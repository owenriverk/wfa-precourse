# Anti-slop: substance rules

Style slop makes text sound like AI. Substance slop makes it wrong. In a first-aid course, wrong gets someone hurt. These rules outrank every style rule in this folder.

## 1. Factual fidelity: 100%, no exceptions

- **A rewrite may not add, drop, or change a clinical fact.** That covers every threshold, dose, time interval, sign, contraindication, and step order. If a sentence gets shorter, check that every fact in it survived.
- **Invent nothing.** No new statistics, studies, guideline citations, organization names, or "research shows." If the source didn't say it, the rewrite doesn't either.
- **If the source has an error, flag it and leave the fact alone.** That includes internal contradictions, outdated guidance, and anything above scope. Put it in the rewrite notes for the author to decide. Silently "fixing" medicine is how a style pass changes doctrine.
- **Doctrine lives in AGENTS.md §3.** Lessons, sims, and FAQs must agree with it. If a rewrite would drift from it, the rewrite is wrong.
- **Scope ceiling is EMT-Basic.** Don't add skills, drugs, or procedures above it. Existing above-scope material stays fenced as "what EMS will do."

## 2. No ungrounded metrics

- Every number must come from the source text: percentages, times, rates, distances, doses.
- No decorative precision ("reduces risk by 47%") and no invented ranges.
- Don't turn a qualitative claim into a number, or a number into a vaguer one ("over 100" doesn't become "high").

## 3. No unsupported superlatives

Cut or ground these: most important, most critical, one of the most, the single biggest, the best, always (unless it truly is always), never (same), dramatically, profoundly, vastly, incredibly, extremely.

- **A ranking is allowed when the doctrine ranks it.** "Severe bleeding comes before airway" is doctrine (XABCDE), so it stays. "Shock is one of the most critical emergencies in wilderness medicine" is filler, so it goes.
- **"Always" and "never" stay when they're real safety rules.** "Never thaw tissue that might refreeze" stays. Don't add new ones for punch.

## 4. Hedging: commit, or be precise about the doubt

Default to plain statements. Cut hedges that only exist to avoid committing:

- Cut: "It is generally considered that...", "arguably", "in many ways", "tends to be", "could potentially", "may possibly", "it might be worth considering", "somewhat", "relatively" (when nothing is being compared).
- Cut stacked hedges: "may potentially," "could possibly."

**Medical exception.** Keep a hedge when the uncertainty is real clinical fact. Deleting it would state a false absolute, and that breaks rule 1.

- "Tachycardia is **often** the first sign" stays. It isn't always first (beta-blockers, athletes).
- "A patient in compensated shock **can** look fine" stays. It's a true possibility, and it's the teaching point.
- "Anaphylaxis **can** come back hours later" stays.

When a hedge stays, make it precise and use it once. "Usually," "in some patients," or "can" is enough. Never pile two on one claim.

## 5. No vague authority

Cut "experts agree," "studies show," "current guidance says," and "it is widely accepted" unless the source names the specific body or guideline. Otherwise just state the doctrine as the course's position.

## 6. Keep the machinery intact

Lesson HTML has structure that code depends on. A rewrite changes words, not wiring:

- Keep every `id`, `class`, `aria-*`, `data-*`, and `href` exactly as it is. Keep the tab and section order.
- Keep the quiz data in `window.WFA_LESSON` valid JSON, and never change an `answer` index or the order of `options`. Reword an `exp` only if the facts stay the same. Question stems and options stay put unless they're clearly broken.
- Leave `<head>` metadata alone (title, description, JSON-LD). SEO text is a separate pass.
- Leave glossary terms alone; definitions can be tightened.
