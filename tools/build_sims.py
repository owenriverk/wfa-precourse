#!/usr/bin/env python3
"""Generate sims/<slug>.html pages from tools/sim_template.html + MANIFEST."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = [
    ("hero-complex",        "Hero Complex",        "A hiker is down at the base of a live scree slope and her friend is screaming your name. Scene safety before patient contact — practice it here.", "Scene safety"),
    ("guy-whos-fine",       "The Guy Who's Fine",  "A 15-foot ground fall, and Dale is already making jokes. Vitals are a trend, not a snapshot — practice catching the trend.", "Serial vitals"),
    ("snoring-isnt-sleeping","Snoring Isn't Sleeping","A trail runner face-down, making a noise like a bear. Snoring is an obstructed airway — practice positioning it.", "Airway first"),
    ("dont-sit-him-up",     "Don't Sit Him Up",    "Over the bars, neck pain, and a storm rolling in. Practice spinal motion restriction even when you have to move.", "Spine"),
    ("stop-peeking",        "Stop Peeking",        "Camp kitchen, dull knife, forearm, more blood than seems reasonable. Direct pressure, held, uninterrupted — practice not peeking.", "Bleeding"),
    ("wiggle-feel-warm",    "Wiggle, Feel, Warm",  "A fall on an outstretched hand and the wrist has a new corner. Practice CSM before and after the splint.", "CSM & splint"),
    ("cool-first",          "Cool First",          "Ridge, noon, 95°F, and your buddy is talking nonsense. Heat stroke: cool now with what you have — practice not walking to the car.", "Heat stroke"),
    ("the-burrito",         "The Burrito",         "A kayaker out of a 50°F lake, shivering like a paint mixer. Practice the hypothermia wrap — and what it means when the shivering stops.", "Hypothermia"),
    ("leave-it-frozen",     "Leave It Frozen",     "White numb toes, two hours of walking left, getting colder. Practice the frostbite call: don't thaw what might refreeze.", "Frostbite"),
    ("find-the-epi",        "Find the Epi",        "A bee at lunch, hives at two minutes, wheeze at five. Epinephrine first and early — practice while the clock runs.", "Anaphylaxis"),
    ("not-indigestion",     "It's Not Indigestion","A 58-year-old at the overlook, sweaty, rubbing his chest, blaming the burrito. Practice taking chest pain seriously.", "Cardiac"),
    ("sugar-first",         "Sugar First",         "Your Type 1 partner is sweaty, confused, and swears she's fine. If they can swallow, sugar now — practice before the window closes.", "Diabetes"),
    ("sharpie-on-the-leg",  "Sharpie on the Leg",  "Rattlesnake, ankle, five miles out, and everyone has a theory from a movie. Practice the short list that actually works.", "Snakebite"),
    ("treat-the-dead-first","Treat the Dead First","Lightning on the ridge: one person screaming, one not moving. Practice reverse triage — the quiet one is the one you can save.", "Lightning"),
    ("two-go-one-stays",    "Two Go, One Stays",   "An ankle six miles out, three hours of daylight, one phone at 8%. Practice the send-for-help note and the messenger rules.", "Evacuation"),
]
tpl = open(os.path.join(ROOT, "tools", "sim_template.html")).read()
built, missing = [], []
for slug, title, desc, tagline in MANIFEST:
    page = tpl.replace("{{SLUG}}", slug).replace("{{TITLE}}", title).replace("{{DESC}}", desc).replace("{{TAGLINE}}", tagline)
    open(os.path.join(ROOT, "sims", slug + ".html"), "w").write(page)
    built.append(slug)
    if not os.path.exists(os.path.join(ROOT, "sims", "js", slug + ".js")):
        missing.append(slug)
print("built %d pages" % len(built))
print("scenario js missing: %s" % (", ".join(missing) if missing else "none"))
