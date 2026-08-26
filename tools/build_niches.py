#!/usr/bin/env python3
"""Generate for/<slug>.html niche landing pages. Content lives here; template below."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://owenriverk.github.io/wfa-precourse"

CERT_SHARED = """<p><strong>The certification question, honestly.</strong> “Wilderness First Aid” isn’t a regulated credential. No government body defines what a WFA card means — it means whatever the company that printed it says it means. What counts in front of a patient is whether you can do the work. This course teaches the work, free, and issues a record of completion — not a certificate, and we won’t pretend otherwise. %s If nobody requires you to hold a card, what you need are the skills, not the laminate.</p>"""

NICHES = [
 dict(slug="sar", eyebrow="For SAR candidates & volunteers",
  title="Free Wilderness First Aid for SAR Candidates",
  desc="Free, no-signup wilderness first aid for search and rescue candidates and volunteers: patient assessment, packaging, hypothermia wraps, and evacuation logic — before you ever ring the team's doorbell.",
  h1="Speak the language before you join the team.",
  lead="You don’t need a mission number to start thinking like a rescuer. Learn the assessment system, the packaging, and the evacuation logic that teams run on — free, at your own pace, before the interview and between the recerts.",
  days=[("The subject spent the night out.", "Found at dawn behind a log, cold and quiet. The hypothermia wrap and gentle handling — insulation under, head covered, no rough movement — are most of the mission."),
        ("The carry-out.", "A splinted lower leg, six miles of trail, litter teams rotating. The medicine that matters happened in the first twenty minutes, before the wheels."),
        ("The scene that bites back.", "Loose rock above the subject, a bystander in the fall line. The difference between a rescuer and a second patient is thirty seconds of reading the slope.")],
  path=[("02_Patient_Assessment", "Patient Assessment", "the system everything else hangs on — scene, XABCDE, SAMPLE, serial vitals"),
        ("07_Spine", "Spine Injuries", "motion restriction is half of packaging"),
        ("09_Cold", "Cold Injuries", "most found subjects are cold subjects"),
        ("05_Shock", "Shock", "the trend that decides evacuation urgency"),
        ("13_Evacuation", "Evacuation", "size-up, resources, messengers, and the call")],
  sims=[("sims/hero-complex.html", "Hero Complex", "scene safety when someone is screaming your name"),
        ("sims/the-burrito.html", "The Burrito", "the hypothermia wrap, done in order"),
        ("sims/two-go-one-stays.html", "Two Go, One Stays", "messengers, notes, and staying power")],
  cert="Most teams require a WFR or EMT card from a recognized provider before you’re mission-qualified — this course doesn’t check that box, and isn’t trying to. It gets you fluent before the paid course, and keeps you sharp between recerts."),

 dict(slug="riders", eyebrow="For dual-sport & ADV riders",
  title="Free Wilderness First Aid for Dual-Sport & ADV Riders",
  desc="Free trailside first aid for dual-sport and adventure riders: rider-down assessment, helmet decisions, splinting, and the evacuation call — no signup, no cost.",
  h1="Forty minutes of rough trail from help.",
  lead="You carry tools for the bike. This is the toolkit for the rider — what to do in the minutes after a lowside, when the nearest ambulance can’t reach you and the nearest cell bar is one.",
  days=[("The lowside.", "Your buddy’s bike is on its side ten yards past him and his lower leg has a new angle. Splint it right and the whole day changes."),
        ("The helmet question.", "He’s talking, his neck is sore, and everyone has an opinion about the lid. There’s a doctrine for this — it isn’t “just pull it off.”"),
        ("July, full gear.", "Armored jacket, black pants, no shade. Heat illness in riding gear comes on fast and reads as “just tired” until it doesn’t.")],
  path=[("06_Musculoskeletal", "Musculoskeletal Injuries", "splinting is the signature rider-down skill"),
        ("07_Spine", "Spine & Helmets", "the helmet decision, taught properly"),
        ("02_Patient_Assessment", "Patient Assessment", "what to check, in what order, with gloves on"),
        ("08_Heat", "Heat Illness", "riding gear is a wearable greenhouse"),
        ("13_Evacuation", "Evacuation", "one bar, one partner, forty minutes of trail — do the math right")],
  sims=[("sim.html", "The Rider Down", "the full scenario this course was built around"),
        ("sims/dont-sit-him-up.html", "Don’t Sit Him Up", "neck pain, storm inbound, move him right"),
        ("sims/two-go-one-stays.html", "Two Go, One Stays", "when the phone dies mid-call")],
  cert="If a guide service, race organizer, or employer requires a provider’s card, take their class — you’ll walk in already fluent."),

 dict(slug="hunters", eyebrow="For hunters & anglers",
  title="Free Wilderness First Aid for Hunters & Anglers",
  desc="Free first aid training for hunters and anglers: severe bleeding control, cold-water immersion, treestand falls, and the cardiac event at the truck — no signup, no cost, no certification theater.",
  h1="A long way from the truck.",
  lead="Knives, broadheads, cold water, steep dark timber, and a demographic that shrugs off chest pain. Hunting and fishing collect exactly the emergencies this course teaches — learn them free, in an evening or two.",
  days=[("Field dressing, bad angle.", "The knife slips and a forearm opens up — more blood than seems reasonable. Direct pressure, held without peeking, is the whole game."),
        ("November creek.", "Your partner goes in at the beaver dam. Ten minutes later he’s shivering like a paint mixer — and the truck is two drainages away."),
        ("“It’s just the coffee.”", "Your buddy at the tailgate is sweaty, gray, and rubbing his chest. The most dangerous sentence in the woods is “I’m fine.”")],
  path=[("04_Bleeding_Wounds", "Bleeding & Wounds", "pressure, packing, tourniquets — the sharp-object curriculum"),
        ("09_Cold", "Cold Injuries", "immersion, hypothermia, and the wrap"),
        ("11_Medical", "Medical Emergencies", "chest pain, denial, and aspirin"),
        ("01_Provider_Safety", "Provider Safety", "one patient must not become two"),
        ("13_Evacuation", "Evacuation", "getting help to a spot with no address")],
  sims=[("sims/stop-peeking.html", "Stop Peeking", "hold pressure — the timer resets when you look"),
        ("sims/the-burrito.html", "The Burrito", "cold-water immersion, wrapped right"),
        ("sims/not-indigestion.html", "It’s Not Indigestion", "the tailgate chest pain")],
  cert="If an outfitter or employer wants a provider’s card, take their class — this makes it easy."),

 dict(slug="backpackers", eyebrow="For backpackers & thru-hikers",
  title="Free Wilderness First Aid for Backpackers & Thru-Hikers",
  desc="Free wilderness first aid for backpackers and thru-hikers: ankle injuries miles from the trailhead, heat illness, anaphylaxis, and evacuation decisions — no signup, no cost.",
  h1="Six miles out, three hours of light.",
  lead="Every mile you walk in is a mile somebody might have to carry you out. The skills that change that math — assessment, splinting, the evac decision — fit in a few evenings, and they weigh nothing.",
  days=[("Talus, ankle, pop.", "She can’t bear weight, the group has one phone at 8%, and the daylight is doing daylight things. What happens next is a decision tree, not a vibe."),
        ("Lunch, bee, hives.", "Two minutes in it’s itching. Five minutes in there’s a wheeze. The epinephrine is in somebody’s pack — whose?"),
        ("The hot climb.", "Your partner stops making sense on the exposed switchbacks at noon. Cool first, right there, with what you carry — not at the car.")],
  path=[("06_Musculoskeletal", "Musculoskeletal Injuries", "ankles and wrists are the thru-hiker tax"),
        ("10_Anaphylaxis", "Anaphylaxis", "epi first, early, no substitutes"),
        ("08_Heat", "Heat Illness", "the spectrum, and where your partner sits on it"),
        ("13_Evacuation", "Evacuation", "notes, messengers, and who stays"),
        ("15_Kits_Preparation", "Kits & Preparation", "the kit that earns its weight")],
  sims=[("sims/two-go-one-stays.html", "Two Go, One Stays", "the send-for-help note, under pressure"),
        ("sims/find-the-epi.html", "Find the Epi", "anaphylaxis with the clock running"),
        ("sims/cool-first.html", "Cool First", "heat stroke on the ridge")],
  cert="If a trail organization or guide program requires a provider’s card, take their class — you’ll arrive ahead."),

 dict(slug="mtb", eyebrow="For mountain bikers",
  title="Free First Aid for Mountain Bikers",
  desc="Free trailside first aid for mountain bikers: over-the-bars crashes, wrist and collarbone injuries, the helmet and spine decision, and riders who say they're fine — no signup, no cost.",
  h1="Over the bars happens fast.",
  lead="The crash takes half a second; the next half hour is on whoever’s standing there. Learn what to check, what not to move, and when “I’m fine” needs a second opinion — free, before the next ride.",
  days=[("The new corner.", "She put a hand out and now the wrist has a corner it didn’t have this morning. Check, splint, check again — wiggle, feel, warm."),
        ("Berm, neck, green sky.", "He’s down off the berm saying his neck hurts, and the weather is coming. Moving him and protecting his spine aren’t opposites — if you know how."),
        ("The guy who’s fine.", "Fifteen-foot ground fall, already joking. His heart rate has an opinion, but only if somebody takes it twice.")],
  path=[("06_Musculoskeletal", "Musculoskeletal Injuries", "wrists, collarbones, and the splinting doctrine"),
        ("07_Spine", "Spine & Helmets", "when the lid stays on and how to move a neck"),
        ("02_Patient_Assessment", "Patient Assessment", "serial vitals catch what jokes hide"),
        ("04_Bleeding_Wounds", "Bleeding & Wounds", "rock gardens keep receipts"),
        ("13_Evacuation", "Evacuation", "ride out, walk out, or call — the actual math")],
  sims=[("sims/dont-sit-him-up.html", "Don’t Sit Him Up", "spine + storm, no good options, one right one"),
        ("sims/wiggle-feel-warm.html", "Wiggle, Feel, Warm", "the wrist, the splint, the re-check"),
        ("sims/guy-whos-fine.html", "The Guy Who’s Fine", "trend beats snapshot")],
  cert="If a race series, bike patrol, or employer requires a provider’s card, take their class — you’ll walk in ahead."),

 dict(slug="trail-runners", eyebrow="For trail runners",
  title="Free Wilderness First Aid for Trail Runners",
  desc="Free first aid for trail and ultra runners: the runner down and snoring, heat stroke at noon, sugar crashes, and being useful with almost no gear — no signup, no cost.",
  h1="You carry a phone and 400 calories. Be useful anyway.",
  lead="Runners travel light and far — which means the first person to reach a backcountry emergency is often someone in a race vest. Most of what matters in the first ten minutes is technique and judgment, not equipment. That part is free.",
  days=[("The runner who isn’t sleeping.", "Face-down off the edge of the trail, making a noise like a bear. That snore is an airway, and it’s asking for help now — not after you find signal."),
        ("Noon, exposed ridge.", "Your partner is weaving and answering questions from some other conversation. Heat stroke gets cooled where it happens, with what you have."),
        ("The bonk that isn’t.", "Sweaty, confused, and swearing she’s fine — if she can still swallow, sugar now beats diagnosis later.")],
  path=[("03_Airway", "Airway & Breathing", "positioning saves lives with zero equipment"),
        ("08_Heat", "Heat Illness", "cool first — the walking decision kills"),
        ("11_Medical", "Medical Emergencies", "sugar, chest pain, and the ones with no mechanism"),
        ("02_Patient_Assessment", "Patient Assessment", "a system that works in a race vest"),
        ("13_Evacuation", "Evacuation", "when to run for help and what to know before you go")],
  sims=[("sims/snoring-isnt-sleeping.html", "Snoring Isn’t Sleeping", "the airway you can hear"),
        ("sims/cool-first.html", "Cool First", "heat stroke, cooled in place"),
        ("sims/sugar-first.html", "Sugar First", "the closing window")],
  cert="If a race requires medical volunteers to hold a provider’s card, take their class — this is the fluency underneath it."),

 dict(slug="youth-leaders", eyebrow="For scout & youth outdoor leaders",
  title="Free Wilderness First Aid Prep for Scout & Youth Leaders",
  desc="Free wilderness first aid study for scout and youth outdoor leaders: anaphylaxis, fractures, diabetic emergencies, and leader-level judgment. Prep for and stay sharp between your organization's required trainings.",
  h1="Somebody’s kid, your call.",
  lead="Taking other people’s children into the backcountry concentrates responsibility wonderfully. This course won’t satisfy an organization’s training requirement — check what your council, school, or camp mandates — but it will make you the leader who’s actually ready, not just current.",
  days=[("Lunch, bee, epi in a pack.", "Hives at two minutes, a wheeze at five, and the auto-injector is somewhere in the group gear. Knowing where the epi lives is a before-lunch decision."),
        ("The bouldering fall.", "A scout puts a hand out and the wrist goes wrong. Splint it, check the fingers before and after, and keep the rest of the group led."),
        ("The quiet camper.", "The Type 1 kid is sweaty, confused, and insists he’s fine. If he can swallow, sugar now — the window closes fast.")],
  path=[("10_Anaphylaxis", "Anaphylaxis", "epi first, early — the youth-group emergency"),
        ("06_Musculoskeletal", "Musculoskeletal Injuries", "playground physics, backcountry consequences"),
        ("11_Medical", "Medical Emergencies", "diabetes, asthma, and known conditions on your roster"),
        ("01_Provider_Safety", "Provider Safety", "the scene habits kids copy"),
        ("13_Evacuation", "Evacuation", "groups, messengers, and never sending one kid anywhere alone")],
  sims=[("sims/find-the-epi.html", "Find the Epi", "the search you don’t want to be doing at minute five"),
        ("sims/wiggle-feel-warm.html", "Wiggle, Feel, Warm", "the FOOSH wrist, start to finish"),
        ("sims/sugar-first.html", "Sugar First", "the known diabetic, going down")],
  cert="If your organization — a scouting council, school, or camp — requires certified training from an approved provider, that requirement stands; check with them first. Use this to arrive prepared and stay sharp between renewals."),
]

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
  <section class="section-block">
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
                      h1=n["h1"], lead=n["lead"], days=days, path=path, sims=sims, cert=cert)
    open(os.path.join(ROOT, "for", n["slug"] + ".html"), "w").write(page)
print("built %d niche pages" % len(NICHES))

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
