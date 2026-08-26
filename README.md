# Wilderness First Aid — free online course

A free, open, self-paced course in lay-rescuer wilderness first aid. No account, no cost, no tracking.

**Live site:** https://owenriverk.github.io/wfa-precourse/

## What's in it

15 lessons, each with learning objectives, practice scenarios with hidden discussions, a self-check quiz with explanations, a glossary, and a summary. A 40-question final exam produces a printable **record of completion** (name, score, date). It is a study record, not a certification.

| # | Lesson | Time |
|---|--------|------|
| 1 | [Provider Safety & Scene Management](lessons/01_Provider_Safety.html) | 20 minutes |
| 2 | [Patient Assessment System](lessons/02_Patient_Assessment.html) | 40 minutes |
| 3 | [Airway & Breathing Emergencies](lessons/03_Airway.html) | 30 minutes |
| 4 | [Bleeding, Wounds & Burns](lessons/04_Bleeding_Wounds.html) | 45 minutes |
| 5 | [Shock Recognition & Treatment](lessons/05_Shock.html) | 25 minutes |
| 6 | [Musculoskeletal Injuries](lessons/06_Musculoskeletal.html) | 35 minutes |
| 7 | [Head, Neck & Spine Injuries](lessons/07_Spine.html) | 35 minutes |
| 8 | [Heat-Related Emergencies](lessons/08_Heat.html) | 25 minutes |
| 9 | [Cold-Related Emergencies](lessons/09_Cold.html) | 30 minutes |
| 10 | [Anaphylaxis & Allergic Reactions](lessons/10_Anaphylaxis.html) | 25 minutes |
| 11 | [Medical Emergencies](lessons/11_Medical.html) | 35 minutes |
| 12 | [Bites, Stings & Envenomation](lessons/12_Bites_Stings.html) | 25 minutes |
| 13 | [Evacuation & Patient Transport](lessons/13_Evacuation.html) | 30 minutes |
| 14 | [Water & Lightning Emergencies](lessons/14_Water_Lightning.html) | 35 minutes |
| 15 | [First Aid Kits & Trip Preparation](lessons/15_Kits_Preparation.html) | 25 minutes |

Total study time is roughly 7.5 hours. The 40-question final exam covers lessons 1–14.

## How it's built

Plain HTML, CSS, and JavaScript with no build step. GitHub Pages deploys `main` via `.github/workflows/pages.yml`.

```
index.html            landing page
final_exam.html       final exam + record of completion
reference.html        printable field reference card + fillable SOAP form
kit.html              first aid kit checklist (saved locally) + gear guidance
sim.html              sandbox practice scenario (beta): deterministic patient state machine
lessons/NN_*.html     one file per lesson (content + quiz data)
assets/css/site.css   shared design system (responsive, print)
assets/js/lesson.js   shared lesson engine (tabs, deep links, quiz, scenario toggles)
```

Each lesson page declares its quiz in a `window.WFA_LESSON` object at the bottom of the file; `lesson.js` renders it. Progress and scores are kept in the visitor's own `localStorage` (`wfa_completed_NN`, `wfa_score_NN`, `wfa_total_NN`, `wfa_final_exam`) and never leave the browser.

To preview locally:

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Content rules

These keep the course honest and safe for lay rescuers. Please follow them in contributions:

1. **Scope ceiling.** Nothing above EMT-Basic is taught. EMT-level material appears only as brief, labeled "for reference" notes. Assisting with a patient's own epinephrine auto-injector or inhaler, and over-the-counter medications, are in scope.
2. **Standalone.** The course is self-contained; it does not assume a particular in-person class or schedule.
3. **No certification language.** The only credential artifact is the record of completion.

## Contributing

Corrections and improvements are welcome — open an issue or pull request. Please cite current first aid guidance (for example ILCOR/AHA/Red Cross first aid guidelines or Wilderness Medical Society practice guidelines) for clinical changes.

Instructors are welcome to use the course as pre-work for their own classes.

## Disclaimer

For educational use only. This content supports wilderness first aid training and does not replace hands-on instruction or professional medical care. In an emergency, call your local emergency number.
