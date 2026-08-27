#!/usr/bin/env python3
"""Generate for/<slug>.html niche landing pages. Content lives here; template below."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://openwfa.com"

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
def img_block(cat, slug):
    per = os.path.join(ROOT, "assets", "img", "for", slug + ".jpg")
    if os.path.exists(per):
        meta = IMG_SRC.get("for/" + slug, {})
        rel = "for/%s.jpg" % slug
        src_img, alt = "../assets/img/" + rel, meta.get("alt", "")
    else:
        k = IMG_KEY.get(cat)
        if not k: return "", ""
        meta = IMG_SRC.get(k, {})
        rel = "niche-%s.jpg" % k
        src_img, alt = "../assets/img/" + rel, IMG_ALT.get(k, "")
    abs_url = BASE + "/assets/img/" + rel
    return ('  <figure class="niche-hero"><img src="%s" alt="%s" loading="lazy"></figure>\n'
            % (src_img, alt)), abs_url

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
{og_img}{jsonld}<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
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
  .faq-item h3 {{ margin: 18px 0 6px; font-size: 1.02em; }}
  .faq-item p {{ margin: 0; }}
  .see-also {{ margin-top: 22px; font-size: 0.92em; color: var(--text-muted); }}
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
    <div class="eyebrow">{eyebrow_icon}<span>{eyebrow}</span><span class="dot">Free · no signup · nothing tracked</span></div>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
  </div>
</header>

<main id="content" class="wrap niche-main">
{img}  <section class="section-block">
    <h2>{h2_days}</h2>
    <ul class="badday">
{days}
    </ul>
  </section>

  <section class="section-block">
    <h2>{h2_path}</h2>
    <p>{path_intro}</p>
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
{faq}
  <section class="section-block">
    <h2>What this is</h2>
    <p>Fifteen lessons, a 40-question knowledge check, sixteen practice scenarios, a printable <a href="../reference.html">field reference card</a>, and a <a href="../kit.html">kit checklist</a>. Free, no account, nothing recorded about you, source on <a href="https://github.com/owenriverk/wfa-precourse">GitHub</a>. It teaches decision-making, not hands-on skill — practice the hands-on parts on a real, padded, complaining friend.</p>
    <div class="cta-row">
      <a class="btn lg" href="../lessons/01_Provider_Safety.html">Start Lesson 1 →</a>
      <a class="btn secondary lg" href="../sim.html">Try a scenario</a>
    </div>
{see_also}  </section>
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="foot-links">
      <a href="../index.html">Home</a>
      <a href="../index.html#lessons">All lessons</a>
      <a href="../sim.html">Practice</a>
      <a href="../credits.html">Photo credits</a>
      <a href="https://github.com/owenriverk/wfa-precourse">Source on GitHub</a>
    </div>
    <p class="foot-disclaimer">Educational use only. This course supports wilderness first aid training and does not replace hands-on instruction or professional medical care. In an emergency, call your local emergency number.</p>
  </div>
</footer>
</body>
</html>
"""

CAT_ICON = {
    "Trail & Mountain": "mountains", "Climbing & Snow": "snowflake", "Water & Maritime": "canoe",
    "Motorized & Airborne": "wheel", "Youth & Education": "campfire", "Remote Work & Field Science": "flask",
    "Travel & Expeditions": "wagon", "Rescue & Public Safety": "cross", "Rural & Homesteading": "barn",
    "Pros, Events & Coaching": "flag",
}
CAT_PEER_LABEL = {
    "Trail & Mountain": "Same trails, different speeds:",
    "Climbing & Snow": "Other people who rope up:",
    "Water & Maritime": "Other people who read water:",
    "Motorized & Airborne": "Other throttle-and-altitude people:",
    "Youth & Education": "Others out there with a crowd of kids:",
    "Remote Work & Field Science": "Other far-from-help day jobs:",
    "Travel & Expeditions": "Other long-haul people:",
    "Rescue & Public Safety": "Others who answer the call:",
    "Rural & Homesteading": "Other far-from-town neighbors:",
    "Pros, Events & Coaching": "Adjacent worlds:",
}
_by_cat_slugs = {}
for n in NICHES:
    _by_cat_slugs.setdefault(n.get("cat", ""), []).append(n)

def see_also_block(n):
    sibs = _by_cat_slugs.get(n.get("cat", ""), [])
    others = [s for s in sibs if s["slug"] != n["slug"]]
    if not others: return ""
    i = next((j for j, s in enumerate(sibs) if s["slug"] == n["slug"]), 0)
    rot = [sibs[(i + k) % len(sibs)] for k in range(1, len(sibs))]
    picks = [s for s in rot if s["slug"] != n["slug"]][:3]
    label = CAT_PEER_LABEL.get(n.get("cat", ""), "Nearby worlds:")
    links = " · ".join('<a href="%s.html">%s</a>' % (s["slug"], s["eyebrow"].replace("For ", "", 1)) for s in picks)
    return '    <p class="see-also"><strong>%s</strong> %s</p>\n' % (label, links)

def faq_html(n):
    if not n.get("faq"): return ""
    items = "\n".join('    <div class="faq-item">\n      <h3>%s</h3>\n      <p>%s</p>\n    </div>' % (q, a)
                      for q, a in n["faq"])
    return ('\n  <section class="section-block">\n    <h2>%s</h2>\n%s\n  </section>\n'
            % (n.get("faq_title", "Fair questions"), items))

_TAG = __import__("re").compile("<[^>]+>")
def jsonld_html(n, img_url):
    blocks = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Wilderness First Aid", "item": BASE + "/"},
        {"@type": "ListItem", "position": 2, "name": n["title"], "item": "%s/for/%s.html" % (BASE, n["slug"])}]}]
    if n.get("faq"):
        blocks.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": _TAG.sub("", q), "acceptedAnswer":
             {"@type": "Answer", "text": _TAG.sub("", a)}} for q, a in n["faq"]]})
    return "".join('<script type="application/ld+json">%s</script>\n'
                   % _json.dumps(b, ensure_ascii=False, separators=(",", ":")) for b in blocks)

for n in NICHES:
    days = "\n".join('      <li><strong>%s</strong> %s</li>' % (b, r) for b, r in n["days"])
    path = "\n".join('      <li><a href="../lessons/%s.html">%s</a> — <span class="why">%s</span></li>' % (f, t, w) for f, t, w in n["path"])
    sims = "\n".join('      <li><a href="../%s">%s</a> — <span class="hook">%s</span></li>' % (h, t, k) for h, t, k in n["sims"])
    cert = "    " + (CERT_SHARED % n["cert"])
    img, img_url = img_block(n.get("cat", ""), n["slug"])
    og_img = '<meta property="og:image" content="%s">\n' % img_url if img_url else ""
    page = TPL.format(base=BASE, slug=n["slug"], title=n["title"], desc=n["desc"], eyebrow=n["eyebrow"],
                      h1=n["h1"], lead=n["lead"], days=days, path=path, sims=sims, cert=cert, img=img,
                      eyebrow_icon='<span class="px px-%s" aria-hidden="true"></span>' % CAT_ICON.get(n.get("cat", ""), "heart"),
                      h2_days=n.get("h2_days", "Your version of a bad day"),
                      h2_path=n.get("h2_path", "Start here"),
                      path_intro=n.get("path_intro", "All 15 lessons are worth your time, but this order front-loads what your world serves up:"),
                      faq=faq_html(n), see_also=see_also_block(n),
                      og_img=og_img, jsonld=jsonld_html(n, img_url))
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
    rows.append('      <h3><span class="px px-%s" aria-hidden="true"></span>%s</h3>\n      <div class="crew-row">\n%s\n      </div>'
                % (CAT_ICON.get(cat, "heart"), cat, chips))
directory = ('  <section class="section-block" id="for-you" aria-label="Choose your adventure">\n'
             '    <h2><span class="px px-wagon" aria-hidden="true"></span>Choose your adventure</h2>\n'
             '    <p class="sub">Same course, different bad days. %d paths through the material, each built around how you actually get outside — the lessons to front-load, and the practice scenarios that match your world.</p>\n'
             '    <div class="trail-divider" aria-hidden="true"></div>\n'
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

# ---- credits.html: attribution for hero photos (CC licenses require it; pages stay caption-free) ----
def _meta_for(n):
    slug = n["slug"]
    if os.path.exists(os.path.join(ROOT, "assets", "img", "for", slug + ".jpg")):
        return IMG_SRC.get("for/" + slug, {})
    return IMG_SRC.get(IMG_KEY.get(n.get("cat", ""), ""), {})

_photos = {}
for n in NICHES:
    meta = _meta_for(n)
    source = meta.get("source", "")
    if not source: continue
    p = _photos.setdefault(source, {"meta": meta, "pages": []})
    p["pages"].append(n)

rows = []
for source, p in sorted(_photos.items(), key=lambda kv: kv[1]["meta"].get("title", "")):
    meta = p["meta"]
    title = meta.get("title", "").replace("File:", "", 1).rsplit(".", 1)[0]
    creator = (meta.get("creator") or "").strip()
    lic = meta.get("license", "")
    who = (" by %s" % creator) if creator else ""
    used = ", ".join('<a href="for/%s.html">%s</a>' % (n["slug"], n["eyebrow"].replace("For ", "", 1))
                     for n in p["pages"])
    rows.append('      <li><a href="%s" rel="noopener">%s</a>%s — %s, via Wikimedia Commons. Used on: %s</li>'
                % (source, title, who, lic, used))

CREDITS = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Photo Credits | Wilderness First Aid — Free Online Course</title>
<meta name="description" content="Attribution for the photographs used across this free wilderness first aid course. All images come from Wikimedia Commons under their listed licenses.">
<meta name="theme-color" content="#1B4F8A">
<link rel="canonical" href="%s/credits.html">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/css/site.css">
<style>
  .credits-main { max-width: 780px; }
  .credit-list { margin: 0; padding-left: 22px; }
  .credit-list li { padding: 6px 0; font-size: 0.95em; }
</style>
</head>
<body>
<a class="skip-link" href="#content">Skip to content</a>

<header class="site-nav">
  <div class="wrap">
    <a class="brand" href="index.html"><svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect x="2" y="2" width="28" height="28" rx="7" fill="currentColor" opacity="0.12"/><path d="M6 23 L12 12 L16 18 L19 14 L26 23 Z" fill="currentColor" opacity="0.85"/><path d="M16 6 v6 M13 9 h6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>Wilderness First Aid</span><span class="brand-sub">Free online course</span></a>
    <nav class="nav-links" aria-label="Course navigation">
      <a href="index.html#lessons">All lessons</a>
      <a href="sim.html">Practice</a>
    </nav>
  </div>
</header>

<header class="lesson-head">
  <div class="wrap">
    <div class="eyebrow"><span>Photo credits</span></div>
    <h1>The photographers who make the pages.</h1>
    <p class="lead">Every photo on this site comes from Wikimedia Commons, used under the license its photographer chose. They get named here, with a link back to the original.</p>
  </div>
</header>

<main id="content" class="wrap credits-main">
  <section class="section-block">
    <ol class="credit-list">
%s
    </ol>
  </section>
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="foot-links">
      <a href="index.html">Home</a>
      <a href="index.html#lessons">All lessons</a>
      <a href="sim.html">Practice</a>
      <a href="https://github.com/owenriverk/wfa-precourse">Source on GitHub</a>
    </div>
    <p class="foot-disclaimer">Educational use only. This course supports wilderness first aid training and does not replace hands-on instruction or professional medical care. In an emergency, call your local emergency number.</p>
  </div>
</footer>
</body>
</html>
""" % (BASE, "\n".join(rows))
open(os.path.join(ROOT, "credits.html"), "w").write(CREDITS)
print("credits.html: %d photos, %d page uses" % (len(_photos), sum(len(p["pages"]) for p in _photos.values())))
