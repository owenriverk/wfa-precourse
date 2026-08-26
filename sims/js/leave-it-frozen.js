/* Leave It Frozen — frostbite: never thaw what might refreeze; frozen feet can walk, thawed feet can’t. */
window.WFA_SCENARIO = {
  nlp: { 'end-sled': 'snowmobile|sled|machine' },
  env: '12°F · flat gray light · temperature falling',
  brief: '<p>Second morning of a winter camping trip up in the North Meadow with your friend Sam. Yesterday’s creek crossing went in over his boot tops and the boots never dried. This morning he pulled off a sock to investigate "a weird numb spot" — and two toes on his right foot are white, waxy, and hard. He can’t feel your squeeze.</p><p>It’s two hours of walking to the trailhead. The sky is flat gray and the temperature is falling. Camp has a stove, fuel, a pot, food — and, surprisingly, one bar of phone signal.</p>',
  startText: 'Sam sits half out of the tent, bare foot propped on a boot, looking at his own toes like they belong to someone else. "They don’t even hurt," he says. That is not the good news he thinks it is.',
  state: { examined: false, reasoned: false, thawed: false, thawT: 0, socksOn: false, padded: false,
           rubbed: false, stoved: false, fed: false, layered: false, called: false },

  tick: function (S, api) {
    if (S.t === 8) api.log('event', 'The wind has found the meadow. Sam’s pack thermometer has lost three degrees since breakfast.');
    if (S.t === 20) api.log('event', 'The light has gone flat and the spruce line is starting to hiss. The day will not get warmer, and the walk will not get shorter.');
    if (S.thawed && S.t === S.thawT + 5) api.log('event', 'The thawed toes are deep pink and throbbing. Sam tries three steps toward the stove and sits right back down, gray-faced. Thawed tissue does not walk.');
    if (S.t === 34 && !S.decided) api.log('event', 'First flakes, small and businesslike. The mountain has started voting.');
  },
  chips: function (S) { return [['Trailhead', '2 h on foot', false], ['Weather', S.t >= 20 ? 'closing in' : 'gray, falling', S.t >= 20]]; },

  actions: [
    { id: 'look', g: 'assess', label: 'Boots and socks off — look at those toes', mins: 2, once: true, run: function (S) {
        S.examined = true; S.crits.recognize = true;
        return 'Two toes on the right foot: white as candle wax, firm when you press, and nothing when you squeeze — he watches your fingers do it. That’s past frostnip. Frostnip is pale, soft, and stings; waxy, hard, and numb is frozen tissue. Frostbite.'; } },
    { id: 'history', g: 'ask', label: 'Ask: how long numb, how did they get wet', mins: 1, once: true, run: function () {
        return 'Creek crossing yesterday, boots wet through by noon, "warm enough" in the bag overnight. Numb since he woke. He wiggled them at breakfast and then stopped mentioning it — which is how these go.'; } },
    { id: 'reason', g: 'ask', label: 'Say the math out loud: thaw now, or walk frozen?', mins: 2, once: true, run: function (S) {
        S.reasoned = true; S.crits.reason = true;
        return 'You say it so it’s real: two hours of walking, falling temps, no sled in camp. Anything thawed here refreezes on the trail, and refrozen tissue dies. Thawed feet can’t walk at all. So the toes stay frozen and they walk — the rotten-sounding rule that saves the most foot.'; } },
    { id: 'thaw', g: 'treat', label: 'Thaw the toes — warm water in the pot, by the stove', mins: 15, once: true, run: function (S) {
        S.thawed = true; S.thawT = S.t;
        return 'Warm-not-hot water, topped up patiently to hold the temperature. It works — which is the trap. The toes flush pink, then red, then wake up furious; Sam white-knuckles the sleeping bag through the worst of it. They’re thawed now. Thawed toes cannot be walked on, and they must never freeze again. Your options just narrowed, and the trailhead didn’t get any closer.'; } },
    { id: 'stove', g: 'treat', label: 'Prop his foot right up next to the stove burner', mins: 2, once: true, run: function (S, api) {
        S.stoved = true;
        api.flag('stove', 'Numb tissue can’t feel a burn happening — direct stove heat cooks frostbite on top of freezing it. Warm water at bath temperature or skin-to-skin only, and only when refreeze is off the table. (Lesson 9)');
        return 'A red patch blooms on the side of his foot before he feels a thing, and you yank it back. Numb means the smoke alarm is unplugged.'; } },
    { id: 'rub', g: 'treat', label: 'Rub the toes briskly to bring them back', mins: 1, once: true, run: function (S, api) {
        S.rubbed = true;
        api.flag('rub', 'Frozen tissue is full of ice crystals. Rubbing grinds them through cell walls — sandpaper from the inside. Hands off. (Lesson 9)');
        return 'Two passes before the thought catches up with your hands: those toes are full of ice crystals, and you’re grinding them.'; } },
    { id: 'socks', g: 'treat', label: 'Dry socks, dried liners, boots back on loose', mins: 3, once: true, run: function (S) {
        S.socksOn = true; if (S.padded) S.crits.protect = true;
        return 'His last dry socks, boot liners toasted over the stove, laces left loose. Nothing tight — squeeze is the enemy of cold tissue, and the foot needs room to swell.'; } },
    { id: 'pad', g: 'treat', label: 'Pad and separate the toes — loose wool, nothing snug', mins: 2, once: true, run: function (S) {
        S.padded = true; if (S.socksOn) S.crits.protect = true;
        return 'Loose wool worked between and around the toes — padded against the knocks of the trail, never compressed.'; } },
    { id: 'drink', g: 'treat', label: 'Hot sugary drink in his hands, breakfast in him', mins: 3, once: true, run: function (S) {
        S.fed = true; if (S.layered) S.crits.whole = true;
        return 'Cocoa with a criminal amount of sugar, and the rest of breakfast. He’s alert, he can swallow, he drinks. The toes answer to the core — a warm, fueled body defends its edges better than a cold hungry one.'; } },
    { id: 'layers', g: 'treat', label: 'Layer up — both of you — and watch each other', mins: 2, once: true, run: function (S) {
        S.layered = true; if (S.fed) S.crits.whole = true;
        return 'You both add a layer before it’s missed. Frostbite hunts with hypothermia, and cold recruits rescuers — two patients is how these mornings get worse.'; } },
    { id: 'call', g: 'ask', label: 'The phone works — call it in before you move', mins: 4, once: true, run: function (S) {
        S.called = true; S.crits.plan = true;
        return 'The bar holds. The county’s winter deputy takes it seriously: there’s a snowmobile at the sno-park that can meet you partway up the summer trail inside two hours — or at the trailhead if you walk the whole way. Location, patient, plan, backup. Now nobody has to guess.'; } },

    { id: 'end-walk', g: 'decide', label: 'Pack light and walk out now, while he still can', mins: 3, run: function (S, api) {
        S.decided = 'walk'; S.crits.nothaw = !S.thawed; S.crits.hands = !S.rubbed && !S.stoved; S.crits.depart = S.t < 45;
        if (S.thawed) {
          api.flag('refroze', 'Thawing is a one-way door. You opened it two hours from the road, the cold shut it again en route, and refrozen tissue is tissue lost. When refreeze is possible, the walk decides — not the stove. (Lesson 9)');
          return 'He grits through a quarter mile on the burning feet, and then the burning fades — the cold coming back in like a tide. By the trailhead the toes are wood again. Froze, thawed, froze: the one sequence frostbite punishes above all others.';
        }
        return 'You drop everything but survival gear and walk. Frozen toes carry weight — numb is walkable, and that’s the grim gift of it. Two hard hours later you’re at the trailhead with the heater running: the right place for a thaw is one where it can only happen once.'; } },
    { id: 'end-sled', g: 'decide', label: 'Hold in camp — the snowmobile comes to you', mins: 3, when: function (S) { return S.called; }, run: function (S) {
        S.decided = 'sled'; S.crits.nothaw = !S.thawed; S.crits.hands = !S.rubbed && !S.stoved; S.crits.depart = S.t < 45;
        if (S.thawed) return 'The right call for the corner you’re in: thawed toes must not refreeze, so nobody walks. You feed the stove, keep the foot wrapped and still, and the machine’s whine comes up the valley inside two hours.';
        return 'You strike a warm camp around him and wait, dry and fed. The machine’s whine comes up the valley on schedule, and the toes ride out exactly as frozen as they started — which was the plan.'; } },
    { id: 'end-wait', g: 'decide', label: 'Wait — maybe the afternoon warms up', mins: 2, run: function (S, api) {
        S.decided = 'wait'; S.crits.nothaw = !S.thawed; S.crits.hands = !S.rubbed && !S.stoved;
        api.flag('wait', 'The thermometer told you the afternoon’s plan all morning: colder. Waiting spent daylight and bought nothing. Hope is not an evacuation plan. (Lesson 13)');
        return 'The afternoon does not warm up. You watch the light go from flat to failing, and the two-hour walk is now a two-hour walk in the dark, colder, with the same frozen toes.'; } }
  ],

  suggest: function (S) {
    if (!S.examined) return ['look', 'history', 'thaw', 'rub', 'socks'];
    if (!S.reasoned) return ['reason', 'thaw', 'call', 'stove', 'socks', 'end-walk'];
    if (!S.socksOn || !S.padded) return ['socks', 'pad', 'call', 'thaw', 'drink', 'end-walk'];
    return ['call', 'drink', 'layers', 'end-walk', 'end-sled', 'end-wait'];
  },

  crits: [
    ['recognize', 'Told frostbite from frostnip', 'White, waxy, hard, and numb is frozen tissue — past the pale-and-stinging stage where warm hands fix it. (Lesson 9)'],
    ['reason', 'Said the refreeze math out loud', 'The thaw decision is about the next two hours, not the next ten minutes. If refreeze is possible, thawing is off the table. (Lesson 9)'],
    ['nothaw', 'Kept frozen tissue frozen for the walk', 'Never thaw what might refreeze, and never walk on thawed feet. Frozen-and-moving beats thawed-and-stranded. (Lesson 9)'],
    ['hands', 'No rubbing, no direct stove heat', 'Rubbing grinds ice crystals through cells; numb skin can’t feel a burn happening. Both subtract tissue. (Lesson 9)'],
    ['protect', 'Dry socks, loose padding, nothing tight', 'Frozen toes travel padded and protected — swelling needs room, and one hard knock costs tissue. (Lesson 9)'],
    ['whole', 'Treated the whole patient — calories and layers, for both of you', 'A warm, fueled core defends its toes. And cold takes rescuers too; watch each other. (Lesson 9)'],
    ['depart', 'Made the go decision early, while daylight held', 'Falling temps and flat light only get worse. The decisive hour is the warm one. (Lesson 13)'],
    ['plan', 'Used the phone before moving — an evac plan with backup', 'Exhaust communication before you spend people. A plan someone else knows about beats two you kept to yourself. (Lesson 13)']
  ],
  links: [['../lessons/09_Cold.html', 'Lesson 9 — Cold Injuries'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.decided === 'walk' && S.thawed) return 'Refreezing took toes that a cold, ugly walk would have kept.';
    if (S.decided === 'walk') return 'Cold, ugly, and correct — the toes stayed frozen until a hospital could thaw them once, for good.';
    if (S.decided === 'sled') return 'You traded two hours of walking for a machine and a plan. The toes never noticed the trip.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.snowGround() + SCN.trees([640, 690, 745], 200) +
      SCN.tent(360, 232) + SCN.stove(470, 232) +
      '<g id="sam-pos">' + SCN.figSit('sam', 290, 230, { accent: true }) +
      '<g id="toes-frozen" style="display:none;"><circle cx="312" cy="227" r="4" class="o w"/><circle cx="318" cy="229" r="3.2" class="o w"/></g>' +
      '<g id="toes-thawed" style="display:none;"><ellipse cx="315" cy="228" rx="8" ry="5" class="bru"/></g>' +
      '<g id="padg" style="display:none;"><rect x="304" y="219" width="20" height="13" rx="5" class="o w2"/></g>' +
      '</g>' +
      '<g id="flakes" style="display:none;" class="ln thin faint"><path d="M150,70 l0,3 M260,50 l0,3 M420,80 l0,3 M560,55 l0,3 M700,75 l0,3 M340,110 l0,3"/></g>',
      { winter: true, label: 'A winter camp — tent, stove, and a camper examining two frozen toes.' }),
    update: function (S) {
      SCN.show('toes-frozen', S.examined && !S.thawed && !S.padded);
      SCN.show('toes-thawed', S.thawed && !S.padded);
      SCN.show('padg', S.padded);
      SCN.show('flakes', S.t >= 34);
    }
  }
};
