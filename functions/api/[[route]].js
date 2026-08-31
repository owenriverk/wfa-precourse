/* OpenWFA sync API — optional accounts so progress can travel between devices.
 *
 * Runs as a Cloudflare Pages Function on the same origin as the site (/api/*).
 * Design rules:
 *  - The anonymous localStorage path is the default and keeps working untouched;
 *    this API is opt-in backup/sync only (assets/js/sync.js is the client).
 *  - Data minimization: we store an email address and a JSON blob of wfa_*
 *    localStorage keys. Nothing else. Account deletion is one click.
 *  - Sims record nothing, ever (AGENTS.md rule 5). Sim state is never synced.
 *  - Auth is passwordless: email a one-time link, set a long-lived session cookie.
 *
 * Endpoints:
 *  POST /api/auth/request  {email}         -> email a sign-in link
 *  GET  /api/auth/verify?token=...         -> set session cookie, redirect to /account.html
 *  POST /api/auth/logout                   -> end this session
 *  GET  /api/me                            -> {email} or 401
 *  GET  /api/progress                      -> {keys, updatedAt}
 *  PUT  /api/progress  {keys}              -> merge + store, returns merged {keys, updatedAt}
 *       (POST also accepted, for navigator.sendBeacon)
 *  POST /api/account/delete                -> delete account + all data
 */

const SESSION_COOKIE = "wfa_s";
const SESSION_MAX_AGE = 400 * 24 * 3600; // 400 days: the browser cap; "don't worry about cookie refresh"
const LINK_TTL_S = 20 * 60;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_KEYS = 200;
const MAX_VALUE_LEN = 8 * 1024;
const KEY_RE = /^wfa_[A-Za-z0-9_.-]{1,64}$/;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const m = request.method;
  try {
    if (path === "/api/auth/request" && m === "POST") return await authRequest(request, env, url);
    if (path === "/api/auth/verify" && m === "GET") return await authVerify(request, env, url);
    if (path === "/api/auth/logout" && m === "POST") return await logout(request, env);
    if (path === "/api/me" && m === "GET") return await me(request, env);
    if (path === "/api/health" && m === "GET") {
      const email = env.EMAIL ? "cloudflare" : env.RESEND_API_KEY ? "resend" : env.DEV_MODE === "true" ? "dev" : "none";
      return json({ ok: true, email });
    }
    if (path === "/api/progress" && m === "GET") return await getProgress(request, env);
    if (path === "/api/progress" && (m === "PUT" || m === "POST")) return await putProgress(request, env);
    if (path === "/api/account/delete" && m === "POST") return await deleteAccount(request, env);
    return json({ error: "not found" }, 404);
  } catch (e) {
    console.log("api error", path, e && e.message);
    return json({ error: "server error" }, 500);
  }
}

/* ---------------- auth ---------------- */

async function authRequest(request, env, url) {
  const body = await readJson(request);
  if (!body) return json({ error: "bad request" }, 400);
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return json({ error: "That doesn't look like an email address." }, 400);
  }
  const now = epoch();
  const ip = request.headers.get("CF-Connecting-IP") || "";
  // Rate limits: this endpoint sends email, so it must not be usable as a spam cannon.
  const perEmail = await one(env, "SELECT COUNT(*) n FROM login_tokens WHERE email=?1 AND created_at>?2", email, now - 3600);
  const perIp = ip ? await one(env, "SELECT COUNT(*) n FROM login_tokens WHERE ip=?1 AND created_at>?2", ip, now - 3600) : { n: 0 };
  if (perEmail.n >= 5 || perIp.n >= 15) {
    return json({ error: "Too many sign-in requests. Try again in an hour." }, 429);
  }
  // Opportunistic cleanup: expired tokens are useless, so each request sweeps
  // yesterday's (keeps the table tiny without needing a cron).
  await env.DB.prepare("DELETE FROM login_tokens WHERE expires_at < ?1").bind(now - 86400).run();
  const token = randToken();
  await env.DB.prepare(
    "INSERT INTO login_tokens (token_hash, email, ip, created_at, expires_at) VALUES (?1, ?2, ?3, ?4, ?5)"
  ).bind(await sha256hex(token), email, ip, now, now + LINK_TTL_S).run();

  const link = `${url.origin}/api/auth/verify?token=${token}`;
  let dev;
  try {
    dev = await sendMagicLink(env, email, link);
  } catch (e) {
    if (e && e.message === "no email provider configured") {
      return json({ error: "Email sign-in isn't set up on this deployment yet. Your progress is still saved in this browser." }, 503);
    }
    throw e;
  }
  const res = { ok: true, sent: !dev };
  if (dev) res.dev_link = link; // local dev only: no email provider configured, DEV_MODE=true
  return json(res);
}

async function authVerify(request, env, url) {
  const token = url.searchParams.get("token") || "";
  const now = epoch();
  const hash = await sha256hex(token);
  const row = token ? await one(env, "SELECT token_hash, email, expires_at, used FROM login_tokens WHERE token_hash=?1", hash) : null;
  if (!row || row.used || row.expires_at < now) {
    return redirect(url.origin + "/account.html?linkerror=1");
  }
  await env.DB.prepare("UPDATE login_tokens SET used=1 WHERE token_hash=?1").bind(hash).run();

  let user = await one(env, "SELECT id FROM users WHERE email=?1", row.email);
  if (!user) {
    user = { id: crypto.randomUUID() };
    await env.DB.prepare("INSERT INTO users (id, email, created_at) VALUES (?1, ?2, ?3)").bind(user.id, row.email, now).run();
  }
  const session = randToken();
  await env.DB.prepare(
    "INSERT INTO sessions (token_hash, user_id, created_at, last_seen) VALUES (?1, ?2, ?3, ?3)"
  ).bind(await sha256hex(session), user.id, now).run();

  const headers = new Headers({ Location: url.origin + "/account.html?signedin=1" });
  headers.append("Set-Cookie", sessionCookie(session, SESSION_MAX_AGE));
  return new Response(null, { status: 302, headers });
}

async function logout(request, env) {
  const s = await session(request, env);
  if (s) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?1").bind(s.token_hash).run();
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
}

async function me(request, env) {
  const s = await session(request, env);
  if (!s) return json({ signedIn: false }, 401);
  // Touch last_seen at most daily to stay far inside D1's free write budget.
  if (epoch() - s.last_seen > 86400) {
    await env.DB.prepare("UPDATE sessions SET last_seen=?1 WHERE token_hash=?2").bind(epoch(), s.token_hash).run();
  }
  return json({ signedIn: true, email: s.email });
}

async function deleteAccount(request, env) {
  const s = await session(request, env);
  if (!s) return json({ error: "not signed in" }, 401);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE user_id=?1").bind(s.user_id),
    env.DB.prepare("DELETE FROM progress WHERE user_id=?1").bind(s.user_id),
    env.DB.prepare("DELETE FROM login_tokens WHERE email=?1").bind(s.email),
    env.DB.prepare("DELETE FROM users WHERE id=?1").bind(s.user_id),
  ]);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
}

/* ---------------- progress ---------------- */

async function getProgress(request, env) {
  const s = await session(request, env);
  if (!s) return json({ error: "not signed in" }, 401);
  const row = await one(env, "SELECT data, updated_at FROM progress WHERE user_id=?1", s.user_id);
  return json(row ? { keys: JSON.parse(row.data), updatedAt: row.updated_at } : { keys: null, updatedAt: null });
}

async function putProgress(request, env) {
  const s = await session(request, env);
  if (!s) return json({ error: "not signed in" }, 401);
  const body = await readJson(request);
  if (!body || typeof body.keys !== "object" || body.keys === null) return json({ error: "bad request" }, 400);
  const incoming = {};
  let n = 0;
  for (const [k, v] of Object.entries(body.keys)) {
    if (!KEY_RE.test(k) || typeof v !== "string" || v.length > MAX_VALUE_LEN) continue;
    incoming[k] = v;
    if (++n >= MAX_KEYS) break;
  }
  const row = await one(env, "SELECT data FROM progress WHERE user_id=?1", s.user_id);
  const merged = mergeKeys(row ? JSON.parse(row.data) : {}, incoming);
  const now = epoch();
  await env.DB.prepare(
    "INSERT INTO progress (user_id, data, updated_at) VALUES (?1, ?2, ?3) " +
    "ON CONFLICT(user_id) DO UPDATE SET data=?2, updated_at=?3"
  ).bind(s.user_id, JSON.stringify(merged), now).run();
  return json({ keys: merged, updatedAt: now });
}

/* Type-aware merge. Order-free: two devices syncing in any order converge.
   Mirrors what lesson.js already does locally (best score wins, etc.). */
function mergeKeys(oldKeys, newKeys) {
  const out = { ...oldKeys };
  for (const [k, v] of Object.entries(newKeys)) {
    const prev = out[k];
    if (prev === undefined || prev === v) { out[k] = v; continue; }
    if (k.startsWith("wfa_completed_")) {
      out[k] = prev === "true" || v === "true" ? "true" : v;
    } else if (k.startsWith("wfa_score_") || k.startsWith("wfa_total_")) {
      out[k] = String(Math.max(int(prev), int(v)));
    } else if (k.startsWith("wfa_sections_")) {
      out[k] = JSON.stringify({ ...obj(prev), ...obj(v) });
    } else if (k === "wfa_final_exam") {
      out[k] = betterExam(prev, v);
    } else {
      out[k] = v; // unknown wfa_* key (e.g. wfa_kit): last writer wins
    }
  }
  return out;
}

function betterExam(a, b) {
  const A = obj(a), B = obj(b);
  if (!!A.passed !== !!B.passed) return A.passed ? a : b;
  if (int(A.score) !== int(B.score)) return int(A.score) > int(B.score) ? a : b;
  return String(A.date || "") >= String(B.date || "") ? a : b;
}

/* ---------------- email ---------------- */

/* Returns true when running in dev mode (no email sent — caller exposes the link).
   Production: configure Cloudflare Email Sending (env.EMAIL binding, Workers Paid)
   or Resend (RESEND_API_KEY secret, free tier is plenty for sign-in links). */
async function sendMagicLink(env, email, link) {
  const from = { email: env.EMAIL_FROM || "sync@openwfa.com", name: "Wilderness First Aid" };
  const subject = "Your sign-in link — Wilderness First Aid";
  const text =
    `Click to sign in and sync your course progress:\n\n${link}\n\n` +
    `The link works once and expires in 20 minutes. If you didn't request it, ignore this email — nothing happens.`;
  const html =
    `<p>Click to sign in and sync your course progress:</p>` +
    `<p><a href="${link}">Sign in to openwfa.com</a></p>` +
    `<p style="color:#5A6B80;font-size:14px">The link works once and expires in 20 minutes. ` +
    `If you didn't request it, ignore this email — nothing happens.</p>`;
  if (env.EMAIL) {
    await env.EMAIL.send({ to: email, from, subject, text, html });
    return false;
  }
  if (env.RESEND_API_KEY) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${from.name} <${from.email}>`, to: [email], subject, text, html }),
    });
    if (!r.ok) throw new Error(`resend ${r.status}`);
    return false;
  }
  if (env.DEV_MODE === "true") return true;
  throw new Error("no email provider configured");
}

/* ---------------- plumbing ---------------- */

async function session(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([A-Za-z0-9_-]+)`));
  if (!match) return null;
  const hash = await sha256hex(match[1]);
  return await one(env,
    "SELECT s.token_hash, s.user_id, s.last_seen, u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?1",
    hash);
}

function sessionCookie(value, maxAge) {
  return `${SESSION_COOKIE}=${value}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

async function readJson(request) {
  const len = parseInt(request.headers.get("Content-Length") || "0", 10);
  if (len > MAX_BODY_BYTES) return null;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return null;
    return JSON.parse(text);
  } catch (e) { return null; }
}

async function one(env, sql, ...binds) {
  return await env.DB.prepare(sql).bind(...binds).first();
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

function redirect(to) {
  return new Response(null, { status: 302, headers: { Location: to, "Cache-Control": "no-store" } });
}

function randToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256hex(s) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function epoch() { return Math.floor(Date.now() / 1000); }
function int(x) { return parseInt(x, 10) || 0; }
function obj(x) { try { const o = JSON.parse(x); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
