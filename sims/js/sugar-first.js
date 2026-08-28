/* Sugar First — a known diabetic, a closing window, and the treatment already in her hipbelt. */
window.WFA_SCENARIO = {
  nlp: { sugar: 'gel|glucose|candy|sweet|juice' },
  env: '18°F · bluebird · top of the skin track',
  brief: '<p>Ski tour with Dana and Marco. Dana — Type 1 diabetic for twelve years, normally the most organized person on the mountain — just fumbled her binding twice and is standing at the top of the skin track with her skins half off, sweating in eighteen degrees. She says she’s fine. She doesn’t look fine, and her sentences keep arriving half a beat late.</p><p>Her glucose gels ride in her hipbelt pocket. You have food, spare layers, and a phone with signal.</p>',
  startText: 'Dana braces on her poles like the snow is tilting. “Just — gimme a sec.” Her face is pale and wet, her hands miss the buckle again, and she asks what time it is twice in one minute.',
  state: { inv: 0, sat: false, sugar: false, sugarT: null, whole: false, wholeT: null,
           better: false, down: false, rec: false, called: false, crits: { down: true, near: true } },

  tick: function (S, api) {
    if (!S.sugar && !S.down && (S.inv >= 3 || S.t >= 16)) {
      S.down = true; S.crits.down = false;
      api.vitals({ avpu: 'U' });
      api.log('event', 'Dana’s knees buckle mid-sentence. She folds into the snow and doesn’t answer her name. The window for oral sugar just closed.');
      api.flag('window', 'The minutes went to figuring it out instead of treating it. Sweaty + confused + known diabetic = sugar while she can still swallow. When in doubt, sugar — it can’t meaningfully hurt her, and withholding it can. (Lesson 11)');
    }
    if (S.sugar && !S.whole && !S.down && S.t === S.sugarT + 6)
      api.log('event', 'The gel packet is still two-thirds full. Dana holds it like a chore. A mouthful is not a dose.');
    if (S.whole && !S.down && !S.better && S.t >= S.wholeT + 8) {
      S.better = true;
      api.vitals({ avpu: 'A', skin: 'pink, drying' });
      api.log('event', 'Dana straightens mid-sentence. “…whoa. Okay. That was a low.” She’s back — embarrassed, ravenous, and making sense.');
    }
  },
  chips: function (S) { return [
    ['Dana', S.down ? 'UNRESPONSIVE' : (S.better ? 'recovered' : 'foggy'), S.down],
    ['Sugar', S.sugar ? 'given T+' + S.sugarT : 'in her hipbelt', !S.sugar]]; },

  actions: [
    { id: 'look', g: 'assess', label: 'Read her for ten seconds', mins: 1, once: true, run: function (S) {
        S.crits.spot = true;
        return 'Sweating at eighteen degrees. Confused. Clumsy. A Type 1 diabetic on a two-thousand-foot morning. That pattern has a name — low blood sugar — and a treatment already riding in her hipbelt. Treat the pattern; don’t audition other theories.'; } },
    { id: 'ask3', g: 'ask', label: 'Ask the three that matter: insulin, food, exertion', mins: 1, once: true, run: function (S) {
        S.crits.hx = true;
        return '“When was your insulin? What have you eaten? How hard did you push?” — “Normal dose… breakfast, I guess? Half a bar since.” Full insulin, half the fuel, all the output. The math writes itself, and it writes low.'; } },
    { id: 'workup', g: 'assess', label: 'Run a full head-to-toe and complete SAMPLE', mins: 5, once: true, run: function (S) {
        S.inv += 2;
        return 'A careful head-to-toe on a patient who is standing up and arguing with you. Nothing broken, nothing new — five minutes spent confirming what the first ten seconds already said.'; } },
    { id: 'debate', g: 'ask', label: 'Talk it through — altitude? Cold? Dehydration?', mins: 3, once: true, run: function (S) {
        S.inv += 1;
        return 'Marco votes altitude. You float dehydration. Someone says “maybe she’s just cold.” Could be — and the debate treats none of them. Her blood sugar doesn’t care who wins.'; } },
    { id: 'vitals', g: 'assess', label: 'Take a set of vitals', mins: 3, run: function (S, api) {
        if (S.down) { api.vitals({ hr: 96, rr: 14, avpu: 'U', skin: 'pale, cold' }); return 'Pulse 96, breathing 14 and even, unresponsive. Breathing is the number you babysit now.'; }
        api.vitals({ hr: 108, rr: 18, avpu: 'A', skin: 'pale, sweaty, cold' });
        return 'Pulse 108, breathing 18, alert but foggy, skin pale, sweaty, cold to the touch. Sweat at this temperature is a finding, not a mood.'; } },
    { id: 'sit', g: 'treat', label: 'Sit her down out of the wind', mins: 1, once: true, run: function (S) {
        S.sat = true;
        return 'You stack both packs into a bench, sit her on the insulated side, and zip her shell to the chin. Whatever this is, it goes better warm and seated.'; } },
    { id: 'sugar', g: 'treat', label: 'Sugar now — gel from her hipbelt', mins: 2, once: true, when: function (S) { return !S.down; }, run: function (S) {
        S.sugar = true; S.sugarT = S.t; S.crits.sugar = true;
        return 'You dig a gel from her hipbelt and fold it into her glove. “Eat this now.” — “I’m fine.” — “Great. Then it’s a free snack. Eat it anyway.” She takes a grudging mouthful. Sugar first; the debate can have whatever’s left.'; } },
    { id: 'coach', g: 'treat', label: 'Stay on her until the packet is empty', mins: 2, once: true, when: function (S) { return S.sugar && !S.whole && !S.down; }, run: function (S) {
        S.whole = true; S.wholeT = S.t; S.crits.whole = true;
        return 'The whole packet, not polite sips — a real low eats a full dose. She grumbles through every bite. Grumbling is allowed; stopping isn’t.'; } },
    { id: 'recheck', g: 'assess', label: 'Re-check her against the clock', mins: 2, when: function (S) { return S.sugar && !S.down; }, run: function (S) {
        if (S.t < S.sugarT + 8) return { text: 'Two minutes isn’t an answer. Sugar shows its work in ten to fifteen — keep her warm and re-check on schedule, not on nerves.', acted: false };
        S.crits.recheck = true;
        if (S.better) return 'Speech crisp, hands working, names the date and the descent line without hunting for words. That’s a recovery you re-checked instead of assumed.';
        return 'Still pale, still slow, still repeating herself. Not recovered — whatever she’s gotten down so far isn’t a full dose yet. Stay on it.'; } },
    { id: 'food', g: 'treat', label: 'Follow the gel with real food', mins: 2, once: true, when: function (S) { return S.better; }, run: function (S) {
        S.crits.food = true;
        return 'Now the slow fuel: a bar and the emergency sandwich. Gel got her out of the hole; complex carbs keep her out. She eats like the day depends on it, which it did.'; } },
    { id: 'scout', g: 'treat', label: 'Ski ahead and break the descent while she rests', mins: 4, once: true, when: function (S) { return !S.down; }, run: function (S, api) {
        S.crits.near = false;
        api.flag('alone', 'You left a confused patient alone. Altered patients wander, fall, and fade — quietly. Somebody stays, every time. (Lesson 11)');
        return 'You drop in to break the first pitch. When you look back up, Dana has drifted ten feet off the platform with one ski off, facing the wrong direction. Alone was the wrong setting for her.'; } },
    { id: 'recover', g: 'treat', label: 'Recovery position, insulate, protect the airway', mins: 2, once: true, when: function (S) { return S.down; }, run: function (S) {
        S.rec = true; if (S.called) S.crits.down = true;
        return 'On her side, top knee forward, airway pointed downhill, pad underneath and parka over. Nothing goes in her mouth now — an unresponsive patient can’t protect her own airway. The job narrows to keeping it open and keeping her warm.'; } },
    { id: 'mouthgel', g: 'treat', label: 'Squeeze gel into her cheek anyway', mins: 2, once: true, when: function (S) { return S.down; }, run: function (S, api) {
        api.flag('nogel', 'Nothing by mouth for an unresponsive patient — she can’t swallow, so sugar pools at the top of her airway. It was the right treatment fifteen minutes ago; now it’s a choking hazard. (Lesson 11)');
        return 'You squeeze a ribbon of gel into her cheek. It sits there. She coughs wetly, doesn’t swallow, and you sweep it back out with a shaking finger.'; } },
    { id: 'call', g: 'treat', label: 'Call 911 with what you know', mins: 3, once: true, run: function (S) {
        S.called = true; if (S.down && S.rec) S.crits.down = true;
        if (S.down) return 'Unresponsive known diabetic, suspected severe low, too late for oral sugar, recovery position, insulated, exact location. They’re coming — keep her airway clear until they do.';
        return 'You give dispatch a heads-up: known diabetic, treating a low with oral glucose, will call back after the recheck. A line already open costs nothing.'; } },
    { id: 'end-descend', g: 'decide', label: 'Call the tour — ski her down easy, together', mins: 2, when: function (S) { return !S.down; }, run: function (S, api) {
        S.decided = 'descend';
        if (S.better) { S.crits.plan = true; return 'Summit deleted without a funeral. You ski it mellow, Dana in front where you can see her, food in reach, straight line toward the car. A recovered low ends the tour’s ambitions, not the day.'; }
        api.flag('early', 'You pointed a still-foggy diabetic downhill. Skiing takes exactly the coordination and judgment a low removes — treat first, recover fully, then move. (Lesson 11)');
        return 'Two turns in she catches an edge and augers into the soft. Not hurt — this time. You dig her out and finish the treatment the slope interrupted.'; } },
    { id: 'end-summit', g: 'decide', label: 'She feels great now — carry on to the summit', mins: 2, when: function (S) { return S.better; }, run: function (S, api) {
        S.decided = 'summit';
        api.flag('summit', 'One rescued low doesn’t reload her margin: the gel is spent, the food is opened, and the next low would land further from help. Recovered means recovered enough to head down. (Lessons 11, 13)');
        return 'The skin track wins the argument. Two hours later you’re further from the car with the gels gone and the margin spent. Nothing goes wrong — and the plan still earned its flag.'; } },
    { id: 'end-sar', g: 'decide', label: 'Call in a rescue — she needs hands and a sled', mins: 3, when: function (S) { return S.down; }, run: function (S) {
        S.decided = 'sar'; S.called = true; S.crits.plan = true; if (S.rec) S.crits.down = true;
        return 'You give it clean: unresponsive Type 1 diabetic, suspected severe low, in recovery position and insulated, exact coordinates. Rotor or sled, she needs hands you don’t have. Now it’s airway, warmth, and watching — the part still yours.'; } }
  ],

  suggest: function (S) {
    if (S.down) return ['recover', 'call', 'end-sar', 'mouthgel', 'vitals'];
    if (!S.sugar) return ['sugar', 'look', 'ask3', 'debate', 'workup', 'sit'];
    if (!S.whole) return ['coach', 'recheck', 'vitals', 'scout', 'debate', 'call'];
    if (!S.better) return ['recheck', 'vitals', 'sit', 'scout', 'call', 'end-descend'];
    return ['food', 'recheck', 'end-summit', 'end-descend', 'call'];
  },

  crits: [
    ['spot',    'Recognized the hypoglycemia pattern in a known diabetic', 'Sweaty + confused + Type 1 on a big-output day — treat that pattern; don’t audition alternatives. (Lesson 11)'],
    ['hx',      'Asked the three questions that matter: insulin, food, exertion', 'A short, targeted history — not a workup — confirms the pattern in one minute. (Lessons 2, 11)'],
    ['sugar',   'Gave sugar while she could still swallow', 'The star move. When in doubt, sugar: it can’t meaningfully hurt, and waiting can. (Lesson 11)'],
    ['whole',   'Got a full dose in, not a nibble', 'Half a gel treats half a low. The packet empties or it isn’t done. (Lesson 11)'],
    ['recheck', 'Re-checked her around fifteen minutes', 'Sugar is a treatment with a report card — you read it at the recheck, not on hope. (Lesson 11)'],
    ['food',    'Followed the gel with real food', 'Fast sugar spikes and fades; complex carbs hold the ground it gained. (Lesson 11)'],
    ['down',    'If she went under: airway, warmth, 911, nothing by mouth', 'Unresponsive = recovery position, insulation, urgent evacuation — the mouth is closed for business. (Lessons 11, 3, 13)'],
    ['near',    'Never left her alone', 'Altered patients wander and fade quietly. Somebody stays. (Lesson 11)'],
    ['plan',    'Made a sober call about the rest of the day', 'The evac decision is the medicine: recovered means recovered enough to descend, not to summit. (Lesson 13)']
  ],
  links: [['../lessons/11_Medical.html', 'Lesson 11 — Medical Emergencies'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.down && S.rec) return 'She’ll probably be okay — but “probably” is arriving by rescue sled instead of a gel packet. The window was fifteen minutes wide and open the whole time.';
    if (S.down) return 'Unresponsive, in the snow, with the treatment still in her hipbelt. Run it again — this one is worth owning.';
    if (S.better) return 'Fifteen minutes and a gel packet. The hard part was trusting the pattern more than the patient.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.snowGround() + SCN.trees([90, 150, 700], 200) +
      /* two parallel skin tracks climbing toward the group, dashed into the snow */
      SCN.pxRect(328, 240, 12, 4, 'cloudsh') + SCN.pxRect(348, 236, 12, 4, 'cloudsh') +
      SCN.pxRect(368, 232, 12, 4, 'cloudsh') + SCN.pxRect(388, 228, 12, 4, 'cloudsh') +
      SCN.pxRect(342, 248, 12, 4, 'cloudsh') + SCN.pxRect(362, 244, 12, 4, 'cloudsh') +
      SCN.pxRect(382, 240, 12, 4, 'cloudsh') + SCN.pxRect(402, 236, 12, 4, 'cloudsh') +
      '<g id="dana-up">' + SCN.figStand('danaU', 400, 226, { accent: true }) + '</g>' +
      '<g id="dana-sit" style="display:none;">' + SCN.figSit('danaS', 396, 230, { accent: true }) + '</g>' +
      '<g id="dana-down" style="display:none;">' + SCN.figSupine('danaD', 380, 232, { accent: true }) + '</g>' +
      SCN.padUnder('pad', 372, 232, 92) + SCN.blanketOver('parka', 388, 230, 66) +
      '<g id="marco">' + SCN.figStand('marcoF', 470, 226, { flip: true, hat: true }) + '</g>',
      { winter: true, sky: 'noon', label: 'A ski tourer swaying at the top of the skin track, her partners nearby.' }),
    update: function (S) {
      SCN.show('dana-up', !S.sat && !S.down);
      SCN.show('dana-sit', S.sat && !S.down);
      SCN.show('dana-down', S.down);
      SCN.show('pad', S.rec); SCN.show('parka', S.rec);
    }
  }
};
