# Deslop: structural AI tropes

These are the patterns that make a reader think "a chatbot wrote this" within two lines. Hunt them down and cut them. Pair this file with `humanizer.md` (rhythm and voice) and `anti-slop.md` (facts). When they conflict, `anti-slop.md` wins.

## 1. Throat-clearing: cut it

Delete any sentence that announces what's coming, or says a thing matters, instead of saying the thing.

Banned openers and fillers:
- "It is worth noting that," "It's important to note/remember/understand," "Keep in mind that"
- "In this lesson, you will learn," "This section covers," "Let's take a look at"
- "When it comes to," "In terms of," "At the end of the day"
- "X is a critical/crucial/vital/key component of Y"
- "Understanding X is essential for Y"

Test: delete the sentence. If nothing is lost, it stays deleted.

## 2. Faux-conversational transitions: cut them

- "Let's dive in," "Let's break it down," "Let's explore"
- "Here's the thing," "Here's the kicker," "The bottom line is"
- "So, what does this mean?", "But wait," "Now, you might be wondering"
- "Simply put," "In other words," "To put it simply"
- "Moreover," "Furthermore," "Additionally," "In addition," "Notably," "Importantly"

A real paragraph break is the transition. If two ideas need a bridge, write it with actual content: "That's why the pulse matters more than the cuff."

## 3. Summary wrap-ups: cut them

- Don't end a section with a paragraph that restates it ("In summary," "Overall," "Ultimately," "To recap," "The key takeaway is").
- End a section on its last useful instruction or its sharpest fact.
- **Exception:** the lesson's **Summary** tab exists on purpose. It stays, and it should read like the tailgate recap before a trip: short, concrete, nothing new, no "In conclusion."

## 4. Other structural tells

- **"Not X, but Y" and "It's not just X, it's Y."** Say Y.
- **Rule-of-three padding.** Don't list three things when there are two, or when the third is a synonym of the first.
- **Synonym cycling.** Pick one term and keep it. A patient doesn't become "the casualty," then "the individual," then "the victim" across one paragraph.
- **Label-colon callouts.** "Critical Point:", "Key Pearl:", "Clinical Pearl:", "Important:". A callout box is already a callout; give it a plain, specific label or none. ("Watch the pulse, not the cuff.")
- **ALL-CAPS for emphasis.** Keep caps only for real acronyms (XABCDE, SAMPLE, CSM). For a word that must not be missed, use `<strong>` sparingly.
- **Em dashes.** At most one per sentence. Most can be a period or a comma.
- **"-ing" tails that fake depth.** "...ensuring optimal outcomes," "...highlighting the importance of."
- **Stakes inflation.** "can be the difference between life and death," "critically important," "absolutely essential." If it's life or death, the content will show it.
- **Stock AI vocabulary.** delve, crucial, robust, comprehensive, nuanced, multifaceted, landscape, leverage, utilize, facilitate, foster, navigate (figurative), pivotal, paramount, seamless, holistic, tapestry, realm, underscore.

## 5. The Single Analogy Rule

- **One analogy per concept, at most.** Pick one comparison and carry it all the way through, or don't use one.
- **Don't mix metaphors.** A pump that becomes a battery that becomes a bank account is three ideas. The reader walks out with none of them.
- **The analogy has to come from the author's world:** fire ground, trail, river, ED, gear, weather. No sports metaphors or corporate metaphors, and nothing a reader has to decode.
- **Never keep an analogy that's medically misleading.** If the comparison breaks in a way that could change a decision on scene, cut it.
- Once an analogy is set up in a lesson, don't introduce a competing one for the same idea later in that lesson.

## Final pass checklist

1. Search the text for every phrase banned above.
2. Look at the first and last sentence of each section. Is the first one throat-clearing? Is the last one a recap? Fix both.
3. Count the em dashes and the bold text. Cut half.
4. Count the analogies per concept. It should be one or zero.
5. Re-read `anti-slop.md` §1 and diff the facts against the source.
