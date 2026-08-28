#!/usr/bin/env python3
"""Generate sims/<slug>.html pages from tools/sim_template.html + MANIFEST."""
import os
import json as _json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = [
    ("hero-complex",        "Hero Complex",        "A hiker is down at the base of a live scree slope and her friend is screaming your name. Practice scene safety, because one patient never becomes two.", "Scene safety"),
    ("guy-whos-fine",       "The Guy Who's Fine",  "A 15-foot ground fall, and Dale is already cracking jokes about it. One set of vitals is a snapshot, two are a trend — practice catching the trend.", "Serial vitals"),
    ("snoring-isnt-sleeping","Snoring Isn't Sleeping","A trail runner face-down in the dirt, making a noise like a bear. Snoring in an unresponsive patient is an obstructed airway — practice positioning it.", "Airway first"),
    ("dont-sit-him-up",     "Don't Sit Him Up",    "Over the bars, neck pain, and a storm rolling up the valley. Practice spinal motion restriction when the weather says you have to move him anyway.", "Spine"),
    ("stop-peeking",        "Stop Peeking",        "Camp kitchen, dull knife, forearm, and more blood than seems reasonable. Direct pressure, held and uninterrupted — practice not peeking at the wound.", "Bleeding"),
    ("wiggle-feel-warm",    "Wiggle, Feel, Warm",  "A fall on an outstretched hand, and the wrist has a new corner in it. Practice checking circulation, sensation, and movement before and after the splint.", "CSM & splint"),
    ("cool-first",          "Cool First",          "Ridge, noon, 95°F, and your buddy is talking nonsense at you. Heat stroke means cooling right here with what you have — practice not walking to the car.", "Heat stroke"),
    ("the-burrito",         "The Burrito",         "A kayaker out of a 50°F lake, shivering like a paint mixer. Practice the hypothermia wrap — and work out what it means when the shivering quits.", "Hypothermia"),
    ("leave-it-frozen",     "Leave It Frozen",     "White numb toes, two hours of walking left, and it is getting colder. Practice the frostbite call: never thaw tissue that might freeze again tonight.", "Frostbite"),
    ("find-the-epi",        "Find the Epi",        "A bee at lunch, hives at two minutes, a wheeze at five. Epinephrine first and early, not antihistamines — practice the call while the clock runs.", "Anaphylaxis"),
    ("not-indigestion",     "It's Not Indigestion","A 58-year-old at the overlook, sweaty, rubbing his chest and blaming the burrito. Practice taking chest pain seriously when the patient will not.", "Cardiac"),
    ("sugar-first",         "Sugar First",         "Your Type 1 partner is sweaty, confused, and swears she's fine. If she can swallow, sugar goes in now — practice before the window closes on you.", "Diabetes"),
    ("sharpie-on-the-leg",  "Sharpie on the Leg",  "Rattlesnake, ankle, five miles from the trailhead, and everyone has a theory from a movie. Practice the short list that works: mark, immobilize, evacuate.", "Snakebite"),
    ("treat-the-dead-first","Treat the Dead First","Lightning on the ridge: one person screaming, one not moving at all. Practice reverse triage — the quiet one is the patient you can still save.", "Lightning"),
    ("two-go-one-stays",    "Two Go, One Stays",   "An ankle six miles out, three hours of daylight, one phone at 8 percent. Practice the send-for-help note and the rule about never sending one messenger.", "Evacuation"),
]
tpl = open(os.path.join(ROOT, "tools", "sim_template.html")).read()
BASE = "https://openwfa.com"


def jsonld(slug, title, desc, tagline):
    """LearningResource + BreadcrumbList, matching the house shape in build_niches.py."""
    url = "%s/sims/%s" % (BASE, slug)
    blocks = [
        {"@context": "https://schema.org", "@type": "LearningResource",
         "name": title, "description": desc, "url": url,
         "learningResourceType": "Practice scenario",
         "educationalLevel": "Beginner", "isAccessibleForFree": True,
         "inLanguage": "en", "about": tagline,
         "isPartOf": {"@type": "Course",
                      "name": "Wilderness First Aid \u2014 Free Online Course",
                      "url": BASE + "/"}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Wilderness First Aid", "item": BASE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Practice scenarios", "item": BASE + "/sim"},
            {"@type": "ListItem", "position": 3, "name": title, "item": url}]},
    ]
    return "".join('<script type="application/ld+json">%s</script>\n'
                   % _json.dumps(b, ensure_ascii=False, separators=(",", ":")) for b in blocks)


built, missing = [], []
for slug, title, desc, tagline in MANIFEST:
    page = (tpl.replace("{{SLUG}}", slug).replace("{{TITLE}}", title)
               .replace("{{DESC}}", desc).replace("{{TAGLINE}}", tagline)
               .replace("{{JSONLD}}", jsonld(slug, title, desc, tagline)))
    open(os.path.join(ROOT, "sims", slug + ".html"), "w").write(page)
    built.append(slug)
    if not os.path.exists(os.path.join(ROOT, "sims", "js", slug + ".js")):
        missing.append(slug)
print("built %d pages" % len(built))
print("scenario js missing: %s" % (", ".join(missing) if missing else "none"))
