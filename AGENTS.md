# WFA Course — AI Agent Guide
*Rules for scenarios, sims, and student interaction · openwfa.com*

## 1. What this product is

Free, open-access first aid education (FOAMed) for **lay rescuers who can't attend an in-person class**. 15 lessons + a 40-question final exam (covering lessons 1–14 only) + resource pages (`reference.html`, `kit.html`, `sim.html`, `sims/`). Everything is dependency-free static HTML — no frameworks, no external requests, nothing recorded about the learner.

## 2. Hard rules — never violate

1. **EMT-B scope ceiling.** Nothing above it, ever: no invasive procedures, no traction splints, no reductions, no prescription meds beyond epi auto-injector assist and OTC. Above-scope skills may be *mentioned* only as "what EMS will do," clearly fenced.
2. **No certification language.** The site issues a *record of completion*, never a "certification," "cert," or anything implying credential.
3. **No day-based structure.** No "Day 1." Lessons are self-paced units called **lessons** (never "modules").
4. **The state machine owns medical ground truth.** In any sim, every clinical fact (vitals, injury, physiology trends, what an action reveals) lives in deterministic, in-repo, auditable code. An LLM — if ever added — only *voices* the patient and maps free text onto existing action ids. It never invents findings, never decides outcomes.
5. **Nothing the learner does is recorded by default.** Progress lives in the learner's browser. The only exception is the opt-in progress sync (`account.html` + `functions/api/`): when a learner turns it on, their email address and `wfa_*` progress keys — nothing else — are stored server-side, and one click deletes both. **Sim state is never synced or recorded, ever.** Sims say so explicitly. Keep it true.
6. **Educational use only.** Every page carries the disclaimer: this supports training, it does not replace hands-on instruction or professional care. Sims additionally state they teach decision-making, not hands-on skill.
7. **Never teach something a lesson contradicts.** Cross-check sim strings against the lessons; cite the lesson number in debrief rationale. If sim and lesson disagree, the sim is wrong.

## 3. Medical doctrine we teach (the canon)

- **XABCDE** — severe hemorrhage first. Tourniquet-first for life-threatening extremity bleeds (no "try pressure for 10 minutes first"). No wound-elevation doctrine.
- **CPR**: 100–120/min; if unresponsive and not breathing, start — no pulse check taught. Rescue breathing is a core skill *at this level*. Drowning: breaths first.
- **Airway**: snoring/gurgling in an unresponsive patient = obstructed airway — position it (jaw thrust with spine concern, recovery position for the unresponsive breathing patient). Airway beats everything except severe bleeding.
- **Spine**: high-energy mechanism → keep them still and ask the spine questions. **We never "clear" a spine at WFA level** — that word is banned. A distracting injury makes spine assessment unreliable — stay conservative. Move as one unit when you must move.
- **Helmets**: "does *this* helmet help or hurt *this* patient?" Removal is two-person, head in line, and optional for an alert patient with a clear airway.
- **Splinting**: immobilize the **joints above and below**; pad it; no strap over the fracture site; check **CSM before and after**, re-check periodically; keep a toe/fingertip window visible; splint before moving.
- **Hypothermia/packaging**: insulation **under** the patient matters most; vapor barrier; wrap torso *and* legs; cover the head; calories if fully alert. **Shivering that stops without rewarming is worsening, not improving.** Handle gently.
- **Frostbite**: never thaw tissue that might refreeze; never walk on thawed feet; refreezing is catastrophic. Walking out on frozen feet beats thawing-then-refreezing.
- **Heat**: a spectrum; altered mental status = heat stroke = **cool first with whatever you have, right where you are**, then evacuate.
- **Anaphylaxis**: epinephrine first and early — hives plus airway/breathing/GI involvement means epi *now*; second dose at 5–15 min if not improving; antihistamines are an adjunct, never a substitute. Adult auto-injector: 0.3 mg.
- **Cardiac**: crushing/pressure chest pain with sweating = stop all exertion, sit them down, aspirin (chewed) if no allergy/contraindication, call for help early. Denial is part of the presentation.
- **Diabetes**: sweaty/confused/altered known diabetic = give sugar if they can swallow, recheck ~15 min. Unresponsive = nothing by mouth — evacuate.
- **Bites/stings**: stinger out fast — speed over method. Snakebite: mark the swelling edge with time, immobilize, jewelry off, evacuate — **no cut, no suck, no tourniquet, no ice, don't chase the snake**. Every snakebite evacuates now.
- **Lightning**: get everyone off the ridge; **reverse triage** — the pulseless, not-breathing patient is the salvageable one (respiratory arrest outlasts cardiac); the screaming patient can wait.
- **Evacuation**: the evac decision *is* the medicine. Exhaust communication before you spend people. Send **two** messengers, never one alone, with a **written note** (location, patient, status, needs); never leave a patient alone if avoidable. Hope is not an evacuation plan.
- **Assessment habits**: scene safety before approach — you don't go until it's safe, one patient never becomes two; consent + introduction; gloves before contact; SAMPLE/OPQRST; **serial vitals — one set is a snapshot, two are a trend, the trend is the truth**. Small sips of water are fine for an alert, stable patient facing a long wait.

## 4. Voice & writing rules

- **Register**: direct, second person, plainspoken **field-manual-with-warmth**, occasional dry wit ("practicing on a real, padded, complaining friend"). Concrete over abstract. Short sentences win.
- **Banned AI tells**: delve, crucial, robust, comprehensive, nuanced, multifaceted, "serves as," "plays a vital role," "it's important to note," Moreover/Furthermore/In conclusion, rule-of-three padding, "it's not just X, it's Y," vague attribution, breathless stakes-inflation.
- Em dashes in moderation — never two per sentence.
- No lecture-y throat-clearing ("In this lesson you will learn…"). Open with why it matters in the field.
- Debrief tone is coach, not judge.

## 5. Interacting with students

- **If a user appears to be describing a real, current emergency: break the frame immediately.** Tell them to call 911/EMS and stop role-playing.
- Never shame a learner. Mistakes produce *consequences and explanation*, not mockery. The lowest score tier still says "this is exactly what practice runs are for."
- Never bluff medicine. If it's not in the lessons, say it's beyond this course or don't say it.
- Answer questions by pointing back into the course (lesson number + concept), not by generating novel doctrine.
- Teach process, not promised outcomes.

## 6. How to build a simulation

The engine lives in `assets/js/sim-engine.js`; scene parts in `assets/js/sim-scenes.js`; shared styles in `assets/css/sim.css`; scenario files in `sims/js/*.js`; the authoring contract in `sims/SPEC.md`. `sim.html` (The Rider Down) is the original single-file reference implementation.

Principles every scenario follows:

1. **Hidden deterministic state** evolves on a sim clock; actions cost minutes and **reveal only what that action would actually reveal**.
2. **A physiology clock punishes neglect on schedule** and rewards treatment — the scenario's "gotcha" lives here, not in scripted railroading.
3. **Mistakes are playable, never blocked**: tempting wrong moves sit beside right ones in every shortlist, produce in-fiction consequences, and get a flag explained at debrief.
4. **Score what was done, never the order** (CRITS list, ~7–12 per scenario, each tied to a lesson).
5. **Multiple endings** via Decide actions, graded through flags — including bad ones that teach.
6. **Scene art is layered SVG driven by the same state.** Visual changes must be loud (a mass appears or vanishes), not a 3-pixel mark. The Rider Down's scene is pixel art generated by `tools/scene_pixel.py` — edit the generator, never the emitted rects. (The earlier capsule rig, `tools/patient_rig.py`, is retained for history.)
7. **Pacing**: 8–16 decisions ≈ 3–7 real minutes.
8. **QA gates**: textbook run scores 100%; mistake run raises every intended flag; no console errors; every action reachable and every gated action refuses gracefully; art zoom-loop + three critic lenses (anatomy / readability-at-phone-size / medical accuracy); cache-bust `?v=` when screenshotting local edits; every reveal/debrief string checked against §3 and voiced per §4.
