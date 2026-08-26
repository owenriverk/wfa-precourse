# Scenario authoring contract (sims/js/*.js)

Read AGENTS.md first — §3 doctrine and §4 voice are binding. Reference implementation: `sims/js/hero-complex.js` (engine: `assets/js/sim-engine.js`, scene parts: `assets/js/sim-scenes.js`).

A scenario file defines `window.WFA_SCENARIO = { ... }`:

- `env`: string for the environment chip ("48°F · overcast").
- `brief`: HTML string (1–2 `<p>`) for the Dispatch panel. Second person, sets scene + resources.
- `startText`: narration at T+0. `startLog` optional transcript variant.
- `state`: object merged into engine state `S` (booleans/counters you need). Engine owns: `t, done{}, flags[], crits{}, decided, lastHR/lastRR/lastAVPU/lastSkin, vitalsT`.
- `tick(S, api)`: called once per sim-minute. Put the physiology clock and the gotcha here (worsening on schedule, timed events via `api.log('event', ...)`).
- `actions`: array of `{id, g:'assess'|'ask'|'treat'|'decide', label, mins, once?, when(S)?, run(S, api)}`.
  - `run` returns a string (what that action actually reveals — nothing more), or `{text, acted:false}` for a refused/gated attempt (stays available).
  - `when(S)` hides an action until relevant (e.g. CPR branch).
  - Decide actions set `S.decided = '...'` to end the run. 2–4 endings, at least one tempting-bad one that earns a flag.
  - Include tempting WRONG actions; wrong moves produce in-fiction consequences + `api.flag(id, text)` (text explains + cites "(Lesson N)").
- `api`: `log(kind,text)` ('event' shows in narration + transcript), `flag(id,text)`, `vitals({hr,rr,avpu,skin})` — sets the chips + timestamps the set.
- `suggest(S)`: returns ordered action ids for the shortlist (engine filters availability, caps 6). Plausibility-ordered, always mixing right moves and temptations. Never hide the mistake.
- `crits`: `[[key, 'What they should have done', 'Why. (Lesson N)'], ...]` — 7–12. Earn with `S.crits.key = true` inside runs. Score what was done, never order.
- `chips(S)` optional: extra status chips `[['Label','value', alertBool], ...]` (e.g. a pressure-held timer).
- `nlp` optional: `{actionId: 'phrase|phrase'}` — synonym phrases for the free-text matcher (assets/js/sim-nlp.js; fully local, no network). Labels + ids match automatically; add phrases only where evals miss. Add eval cases to tools/matcher_evals.json and run `node tools/eval_matcher.js` (must pass; `--dump` lists all action ids).
- `links`: `[['../lessons/NN_x.html','Lesson N — Title'], ...]` (2–3).
- `outcome(S)` optional: one extra debrief sentence chosen from final state (use for the scenario's signature line, e.g. "Now there are two of you.").
- `scene`: `{svg: SCN.wrap(parts, {sky:'noon'|'storm'|'dusk', winter:true, label:'...'}), update(S){ SCN.show/SCN.cls/DOM }}`. Compose from SCN parts (mountains, trees, trail, lake, scree, snowGround, boulder, tent, stove, bikeDown, figStand/figSit/figSupine/figProne/figKneel, blanketOver, padUnder, splintOn, dressing, mark). Ground ≈ y230, viewBox 800×260. Keep it simple; state changes must be visually loud. `update` may set `transform` on groups to move figures.

Quality bar per scenario: 8–14 actions, one clear teaching point, the gotcha lives in `tick()` or in a tempting action (never in railroading), realistic timings (minutes matter), every reveal string is field-manual voice, debrief flags explain the *why*. Keep files ≤ ~190 lines. Validate with `node --check`.
