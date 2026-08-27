#!/usr/bin/env python3
"""Generate for/<slug>.html niche landing pages. Content lives here; template below."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://owenriverk.github.io/wfa-precourse"

import json as _json
IMG_KEY = {"Trail & Mountain": "trail", "Climbing & Snow": "climb", "Water & Maritime": "water",
           "Motorized & Airborne": "moto", "Youth & Education": "youth", "Remote Work & Field Science": "fieldwork",
           "Travel & Expeditions": "travel", "Rescue & Public Safety": "rescue", "Rural & Homesteading": "rural",
           "Pros, Events & Coaching": "events"}
IMG_ALT = {"trail": "A hiking trail winding along a green alpine ridge", "climb": "A rope team crossing a glacier",
           "water": "A kayaker working through whitewater", "moto": "An ATV on a high mountain trail",
           "youth": "Wall tents at a summer camp under a big sky", "fieldwork": "A wildlife biologist holding a bird in the field",
           "travel": "A hiker in a desert canyon", "rescue": "A rescue helicopter on a snowy slope",
           "rural": "Horses grazing in a mountain meadow", "events": "A runner racing the Sierre-Zinal mountain course"}
IMG_SRC = _json.load(open(os.path.join(ROOT, "assets", "img", "sources.json")))
def img_block(cat):
    k = IMG_KEY.get(cat)
    if not k: return ""
    meta = IMG_SRC.get(k, {})
    lic = meta.get("license", "")
    creator = (meta.get("creator") or "").strip()
    if lic.lower().startswith("public domain") or lic.lower() in ("cc0", "pdm"):
        credit = "Public domain, via Wikimedia Commons"
    else:
        credit = "Photo: %s, %s, via Wikimedia Commons" % (creator or "unknown", lic)
    return ('  <figure class="niche-hero"><img src="../assets/img/niche-%s.jpg" alt="%s" loading="lazy">'
            '<figcaption>%s</figcaption></figure>\n' % (k, IMG_ALT.get(k, ""), credit))

CERT_SHARED = """<p><strong>The certification question, honestly.</strong> “Wilderness First Aid” isn’t a regulated credential. No government body defines what a WFA card means — it means whatever the company that printed it says it means. What counts in front of a patient is whether you can do the work. This course teaches the work, free, and issues a record of completion — not a certificate, and we won’t pretend otherwise. %s If nobody requires you to hold a card, what you need are the skills, not the laminate.</p>"""

# Niche data lives in tools/niches/*.py — each file exports NICHES = [dict, ...].
import glob, importlib.util
NICHES = []
for _f in sorted(glob.glob(os.path.join(ROOT, "tools", "niches", "*.py"))):
    _spec = importlib.util.spec_from_file_location(os.path.basename(_f)[:-3], _f)
    _m = importlib.util.module_from_spec(_spec)
    _spec.loader.exec_module(_m)
    NICHES.extend(_m.NICHES)
_slugs = [n["slug"] for n in NICHES]
assert len(_slugs) == len(set(_slugs)), "duplicate slugs: %s" % sorted(set(s for s in _slugs if _slugs.count(s) > 1))

TPL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | Wilderness First Aid — Free Online Course</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#1B4F8A">
<link rel="canonical" href="{base}/for/{slug}.html">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{base}/for/{slug}.html">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/css/site.css">
<style>
  .niche-main {{ max-width: 780px; }}
  .badday {{ list-style: none; margin: 0; padding: 0; }}
  .badday li {{ padding: 12px 0 12px 34px; position: relative; border-bottom: 1px solid var(--border); }}
  .badday li:last-child {{ border-bottom: 0; }}
  .badday li::before {{ content: "⚠"; position: absolute; left: 4px; color: var(--warning); font-weight: 800; }}
  .path {{ margin: 0; padding-left: 22px; }}
  .path li {{ padding: 6px 0; }}
  .path .why {{ color: var(--text-muted); }}
  .simrow {{ list-style: none; margin: 12px 0 0; padding: 0; }}
  .simrow li {{ padding: 7px 0; border-bottom: 1px solid var(--border); }}
  .simrow li:last-child {{ border-bottom: 0; }}
  .simrow .hook {{ color: var(--text-muted); font-size: 0.93em; }}
  .cert-box {{ background: var(--surface-2); border: 1px solid var(--border-strong); border-left: 4px solid var(--primary); border-radius: var(--radius); padding: 16px 20px; margin: 28px 0; }}
  .cta-row {{ display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; }}
  .niche-hero {{ margin: 20px 0 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--surface); }}
  .niche-hero img {{ width: 100%; height: 250px; object-fit: cover; display: block; }}
  .niche-hero figcaption {{ font-size: 0.72em; color: var(--text-faint); padding: 4px 12px; }}
</style>
</head>
<body>
<a class="skip-link" href="#content">Skip to content</a>

<header class="site-nav">
  <div class="wrap">
    <a class="brand" href="../index.html"><svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect x="2" y="2" width="28" height="28" rx="7" fill="currentColor" opacity="0.12"/><path d="M6 23 L12 12 L16 18 L19 14 L26 23 Z" fill="currentColor" opacity="0.85"/><path d="M16 6 v6 M13 9 h6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>Wilderness First Aid</span><span class="brand-sub">Free online course</span></a>
    <nav class="nav-links" aria-label="Course navigation">
      <a href="../index.html#lessons">All lessons</a>
      <a href="../sim.html">Practice</a>
    </nav>
  </div>
</header>

<header class="lesson-head">
  <div class="wrap">
    <div class="eyebrow"><span>{eyebrow}</span><span class="dot">Free · no signup · nothing tracked</span></div>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
  </div>
</header>

<main id="content" class="wrap niche-main">
{img}  <section class="section-block">
    <h2>Your version of a bad day</h2>
    <ul class="badday">
{days}
    </ul>
  </section>

  <section class="section-block">
    <h2>Start here</h2>
    <p>All 15 lessons are worth your time, but this order front-loads what your world serves up:</p>
    <ol class="path">
{path}
    </ol>
    <h3 style="margin-top:22px;">Then pressure-test it</h3>
    <p>Interactive scenarios — one decision at a time, tempting mistakes included, debrief at the end:</p>
    <ul class="simrow">
{sims}
    </ul>
  </section>

  <div class="cert-box">
{cert}
  </div>

  <section class="section-block">
    <h2>What this is</h2>
    <p>Fifteen lessons, a 40-question knowledge check, sixteen practice scenarios, a printable <a href="../reference.html">field reference card</a>, and a <a href="../kit.html">kit checklist</a>. Free, no account, nothing recorded about you, source on <a href="https://github.com/owenriverk/wfa-precourse">GitHub</a>. It teaches decision-making, not hands-on skill — practice the hands-on parts on a real, padded, complaining friend.</p>
    <div class="cta-row">
      <a class="btn lg" href="../lessons/01_Provider_Safety.html">Start Lesson 1 →</a>
      <a class="btn secondary lg" href="../sim.html">Try a scenario</a>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="foot-links">
      <a href="../index.html">Home</a>
      <a href="../index.html#lessons">All lessons</a>
      <a href="../sim.html">Practice</a>
      <a href="https://github.com/owenriverk/wfa-precourse">Source on GitHub</a>
    </div>
    <p class="foot-disclaimer">Educational use only. This course supports wilderness first aid training and does not replace hands-on instruction or professional medical care. In an emergency, call your local emergency number.</p>
  </div>
</footer>
</body>
</html>
"""

for n in NICHES:
    days = "\n".join('      <li><strong>%s</strong> %s</li>' % (b, r) for b, r in n["days"])
    path = "\n".join('      <li><a href="../lessons/%s.html">%s</a> — <span class="why">%s</span></li>' % (f, t, w) for f, t, w in n["path"])
    sims = "\n".join('      <li><a href="../%s">%s</a> — <span class="hook">%s</span></li>' % (h, t, k) for h, t, k in n["sims"])
    cert = "    " + (CERT_SHARED % n["cert"])
    page = TPL.format(base=BASE, slug=n["slug"], title=n["title"], desc=n["desc"], eyebrow=n["eyebrow"],
                      h1=n["h1"], lead=n["lead"], days=days, path=path, sims=sims, cert=cert, img=img_block(n.get("cat", "")))
    open(os.path.join(ROOT, "for", n["slug"] + ".html"), "w").write(page)
print("built %d niche pages" % len(NICHES))

# ---- homepage Choose Your Adventure directory (between FOR-YOU markers) ----
CAT_ORDER = ["Trail & Mountain", "Climbing & Snow", "Water & Maritime", "Motorized & Airborne",
             "Youth & Education", "Remote Work & Field Science", "Travel & Expeditions",
             "Rescue & Public Safety", "Rural & Homesteading", "Pros, Events & Coaching"]
by_cat = {}
for n in NICHES:
    by_cat.setdefault(n.get("cat", "More"), []).append(n)
rows = []
for cat in CAT_ORDER + sorted(set(by_cat) - set(CAT_ORDER)):
    if cat not in by_cat: continue
    chips = "\n".join('        <a class="crew-chip" href="for/%s.html">%s</a>' % (n["slug"], (lambda s: s[0].upper() + s[1:])(n["eyebrow"].replace("For ", "", 1)))
                       for n in sorted(by_cat[cat], key=lambda x: x["slug"]))
    rows.append('      <h3>%s</h3>\n      <div class="crew-row">\n%s\n      </div>' % (cat, chips))
directory = ('  <section class="section-block" id="for-you" aria-label="Choose your adventure">\n'
             '    <h2>Choose your adventure</h2>\n'
             '    <p class="sub">Same course, different bad days. %d paths through the material, each built around how you actually get outside — the lessons to front-load, and the practice scenarios that match your world.</p>\n'
             '%s\n  </section>') % (len(NICHES), "\n".join(rows))
ip = os.path.join(ROOT, "index.html")
isrc = open(ip).read()
S, E = "<!-- FOR-YOU:START -->", "<!-- FOR-YOU:END -->"
if S in isrc:
    isrc = isrc[:isrc.index(S) + len(S)] + "\n" + directory + "\n" + isrc[isrc.index(E):]
    open(ip, "w").write(isrc)
    print("homepage directory: %d categories, %d pages" % (len([c for c in by_cat]), len(NICHES)))
else:
    print("WARNING: FOR-YOU markers not found in index.html")

# sitemap (idempotent)
sp = os.path.join(ROOT, "sitemap.xml")
sm = open(sp).read()
added = 0
for n in NICHES:
    loc = "%s/for/%s.html" % (BASE, n["slug"])
    if loc not in sm:
        sm = sm.replace("</urlset>", "  <url><loc>%s</loc><lastmod>2026-08-26</lastmod></url>\n</urlset>" % loc)
        added += 1
open(sp, "w").write(sm)
print("sitemap: +%d (now %d urls)" % (added, sm.count("<url>")))
