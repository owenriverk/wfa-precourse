/* Two Go, One Stays — a wrecked ankle, a dying phone, and a note that does the rescuing. */
window.WFA_SCENARIO = {
  env: '58°F · clearing skies · six miles in, three hours of light',
  brief: '<p>Backpacking loop, day three, group of four. On the talus crossing below the pass, a slab tips under Kim and her ankle folds. She tried one step and went white. Six miles of trail between you and the trailhead, about three hours of daylight — and one phone among you, sitting at 8% because somebody navigated with it all day.</p><p>You have overnight gear, a paper map, and three healthy walkers counting you.</p>',
  startText: 'Kim is propped against a slab with her boot half unlaced, breathing through her teeth. “I can’t stand on it. I tried.” Tyler is bouncing on his toes, ready to sprint somewhere. The phone in your pocket says 8%.',
  state: { batt: 8, texted: false, textT: null, delivered: false, called: false, dead: false,
           splinted: false, note: false, pairSent: false, tylerGone: false, tylerT: null,
           marked: false, insul: false, crits: { stay: true } },

  tick: function (S, api) {
    if (S.tylerGone && S.t === S.tylerT + 12)
      api.log('event', 'Down-trail, Tyler is running hard with everything except the answers: where exactly, how hurt, what’s needed. Whoever he finds will have to guess.');
    if (S.texted && !S.delivered && S.t === S.textT + 4) {
      S.delivered = true;
      api.log('event', 'The phone buzzes once: Delivered. Sixty-two characters of exactly where and exactly what just reached a dispatcher.');
    }
    if (S.t === 20) api.log('event', 'The sun drops behind the pass wall. The shade turns sweat cold in about a minute.');
    if (S.t === 30 && !S.insul) api.log('event', 'Kim’s second shiver in a minute. The rock under her has been stealing heat the whole time.');
  },
  chips: function (S) {
    var m = Math.max(0, 180 - S.t);
    return [['Phone', S.dead ? 'DEAD' : S.batt + '%', true],
            ['Daylight', Math.floor(m / 60) + ' h ' + (m % 60) + ' min', m <= 60]];
  },

  actions: [
    { id: 'exam', g: 'assess', label: 'Check the ankle — look, feel, CSM', mins: 3, once: true, run: function () {
        return 'Swelling already filling the boot cuff, point tender below the ankle knob, no wound. Toes: pink, warm, wiggle, feel — CSM intact, written down with the time. She cannot bear weight. That phrase decides the evening.'; } },
    { id: 'splint', g: 'treat', label: 'Splint the ankle — boot on, padded, wrapped', mins: 4, once: true, run: function (S) {
        S.splinted = true; S.crits.splint = true;
        return 'The boot stays on as the splint it already is: snugged, padded with a rolled sleeve, wrapped above and below, toes left showing. CSM again after — still pink, still feels. Stabilize the patient before you spend a single walker.'; } },
    { id: 'saver', g: 'treat', label: 'Battery triage — airplane mode, screen down', mins: 1, once: true, run: function (S) {
        S.crits.batt = true;
        return 'Airplane mode, screen dimmed, phone inside your jacket where the battery stays warm. Eight percent is a budget: texts cost pennies, calls cost dollars — and a queued text keeps trying on a signal no call can hold.'; } },
    { id: 'text', g: 'treat', label: 'Text 911 the essentials first', mins: 2, once: true, when: function (S) { return !S.dead; }, run: function (S) {
        S.texted = true; S.textT = S.t; S.batt = 6; S.crits.batt = true;
        return 'Short and dense: “Injured hiker cannot walk. Talus below Sawtooth Pass, ~6mi N trailhead, W of creek. 4 in party. Need rescue.” It sits at “sending…” — queued, patient, trying every time a bar flickers.'; } },
    { id: 'call', g: 'treat', label: 'Call 911', mins: 3, once: true, when: function (S) { return !S.dead; }, run: function (S) {
        S.called = true; S.dead = true; S.batt = 0;
        return 'It rings. A voice: “911, what’s the—” You get out “injured hiker, Cascade Loop, six miles—” and the screen goes black mid-sentence. Dead phone, half a report. Someone knows somebody is hurt out here. They don’t know where, how bad, or what you need. The rest of the message travels on paper and legs now.'; } },
    { id: 'note', g: 'treat', label: 'Write the note — the whole message, on paper', mins: 4, once: true, run: function (S) {
        S.note = true; S.crits.note = true;
        return 'You write it like the search depends on it, because it might: WHERE — talus field below Sawtooth Pass, ~6 miles from the north trailhead, west of the creek, grid coordinates off the paper map. WHO — Kim Alvarez, 31, right ankle, cannot bear weight, splinted, alert, warm. NEED — wheeled litter or team, party of four with overnight gear, two staying at this exact spot. Time, your names, folded into a zip bag. Paper doesn’t have a battery.'; } },
    { id: 'pair', g: 'treat', label: 'Brief two messengers — send them together', mins: 3, once: true, when: function (S) { return !S.pairSent && !S.tylerGone; }, run: function (S, api) {
        S.pairSent = true; S.crits.two = true;
        if (!S.note) api.flag('nonote', 'The messengers left carrying a story instead of a document. Hours from now, at a trailhead, under stress, memory garbles — paper doesn’t. (Lesson 13)');
        return 'Tyler and Ana go together — two heads, ' + (S.note ? 'the note in a zip bag' : 'nothing written down') + ', zero heroics: walk fast, don’t run, stop if it gets dangerous, hand the message to the first ranger or working phone. You and Kim stay. Nobody is alone tonight.'; } },
    { id: 'tyler', g: 'treat', label: 'Tyler’s ready — send him sprinting now', mins: 1, once: true, when: function (S) { return !S.pairSent && !S.tylerGone; }, run: function (S, api) {
        S.tylerGone = true; S.tylerT = S.t;
        api.flag('solo', 'One messenger, alone, at a run, with nothing written down. A twisted ankle at mile four ends the rescue before it starts — and even arriving, he can’t answer the three questions that launch one: where exactly, how hurt, what do you need. Two go, together, with a note. (Lesson 13)');
        return 'Tyler is gone before you finish the sentence, boots clattering down the talus. It felt like action. It was mostly hope with a head start.'; } },
    { id: 'mark', g: 'treat', label: 'Mark your position — loud and visible', mins: 2, once: true, run: function (S) {
        S.marked = true; S.crits.mark = true;
        return 'Kim’s orange rain cover goes up on a trekking pole jammed in the cairn, and an arrow of sticks points off the trail to your ledge. Rescuers find the marker; the marker finds you.'; } },
    { id: 'insul', g: 'treat', label: 'Insulate her for the wait', mins: 3, once: true, run: function (S) {
        S.insul = true; S.crits.warm = true;
        return 'Pad under her first — the ground is the thief — then the sleeping bag over her legs, hat on, puffy zipped. An ankle won’t kill anybody. A cold night on bare rock will spend the evening trying.'; } },
    { id: 'monitor', g: 'assess', label: 'Check on her — CSM, warmth, food, water', mins: 2, run: function (S, api) {
        S.crits.watch = true;
        api.vitals({ hr: 88, rr: 16, avpu: 'A', skin: 'warm, dry' });
        return 'Toes again: pink, warm, wiggle, feel. Pain steady, spirits holding. You feed her, water her, and log it with the time. A long wait is a series of small checks.'; } },
    { id: 'end-wait', g: 'decide', label: 'Settle in — hold this spot for the night', mins: 2, run: function (S, api) {
        S.decided = 'wait'; S.crits.plan = S.pairSent || S.delivered;
        if (!S.pairSent && !S.tylerGone && !S.delivered && !S.called) api.flag('silent', 'Nobody outside this basin knows you exist. Shelter-in-place only works when someone is coming. (Lesson 13)');
        if (S.pairSent) return 'Two walkers carry the message; two of you hold the ground. You feed the little economy of morale — snacks, bad jokes, toe checks — and when headlamps finally bob up the trail, they come straight to the orange marker, reading your own note back to you.';
        if (S.tylerGone) return 'You dig in behind Tyler’s head start and hope his memory holds six miles of detail. The night gets long. Parts of it didn’t have to.';
        if (S.delivered) return 'The text got out with your position, so you dig in properly and wait. Slower than a voice call, surer than hope — the queue did its job.';
        return 'You dig in for a night nobody knows you’re spending. It gets cold, then long, then longer.'; } },
    { id: 'end-all', g: 'decide', label: 'All four move out — Kim hops between shoulders', mins: 3, run: function (S, api) {
        S.decided = 'hop';
        api.flag('hop', 'Six miles of talus and trail on one leg, starting with three hours of light, is how one patient becomes a benighted group of four. The math never worked. (Lessons 13, 6)');
        return 'Four hundred yards takes half an hour and everything Kim has. You stop in the middle of the talus — farther from flat ground, closer to dark, with a patient now shaking from effort.'; } },
    { id: 'end-alone', g: 'decide', label: 'Everyone healthy goes for help — Kim shelters alone', mins: 2, when: function (S) { return !S.pairSent; }, run: function (S, api) {
        S.decided = 'left'; S.crits.stay = false;
        api.flag('alone', 'An injured patient, alone, overnight — she can’t gather warmth, chase a blown-away marker, or call out if she fades. One person always stays. (Lesson 13)');
        return 'Kim says she’ll be fine, in the voice people use when they’re deciding to be brave. From the first switchback you look back: one small orange dot alone in a very large basin, with night coming.'; } }
  ],

  suggest: function (S) {
    if (!S.splinted) return ['exam', 'splint', 'tyler', 'saver', 'call', 'insul'];
    if (!S.dead && !S.texted) return ['saver', 'text', 'call', 'tyler', 'note', 'mark'];
    if (!S.note) return ['note', 'call', 'tyler', 'pair', 'insul', 'mark'];
    if (!S.pairSent && !S.tylerGone) return ['pair', 'tyler', 'mark', 'insul', 'monitor', 'end-all'];
    return ['insul', 'mark', 'monitor', 'end-wait', 'end-all'];
  },

  crits: [
    ['splint', 'Stabilized the ankle before the logistics', 'Splint before moving, before planning, before spending anybody — boot padded and wrapped, toes checkable. (Lesson 6)'],
    ['batt',   'Ran battery triage on the only phone', 'Airplane mode, screen down, text-first: a queued text keeps trying on a signal no call can hold, and 8% is a budget. (Lessons 13, 15)'],
    ['note',   'Wrote the full send-for-help note', 'Location, patient, status, needs — on paper. Under stress, memory garbles; the note doesn’t. (Lesson 13)'],
    ['two',    'Sent two messengers together', 'Never one alone — a solo runner who twists an ankle at mile four ends the rescue before it starts. (Lesson 13)'],
    ['stay',   'Kept someone with Kim the whole time', 'Never leave a patient alone if avoidable — injured people fade quietly and can’t chase help. (Lesson 13)'],
    ['mark',   'Marked your position loud and visible', 'Rescuers find the marker; the marker finds you. Bright, high, unmistakable. (Lesson 13)'],
    ['warm',   'Insulated her for the wait', 'Insulation under the patient matters most — the ground is the thief. (Lessons 9, 5)'],
    ['watch',  'Monitored through the wait — CSM, warmth, food, water', 'A long wait is a series of small checks; the trend is the truth. (Lessons 2, 6)'],
    ['plan',   'Made a sound go/stay decision', 'The evac decision is the medicine: spend electrons before people, and spend people in pairs. (Lesson 13)']
  ],
  links: [['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation'], ['../lessons/06_Musculoskeletal.html', 'Lesson 6 — Musculoskeletal Injuries'], ['../lessons/15_Kits_Preparation.html', 'Lesson 15 — Kits & Preparation']],
  outcome: function (S) {
    if (S.crits.two && S.note) return 'Hours from now, a ranger reads exactly where you are and exactly what you need, in your handwriting. That piece of paper was the best gear on the trip.';
    if (S.tylerGone) return 'Speed without information is just cardio. The note was the real channel all along.';
    if (!S.crits.stay) return 'She was alone out there. That is the part to run differently, every time.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.scree() + SCN.trail() +
      '<g id="kim">' + SCN.figSit('kimF', 560, 232, { accent: true }) + '</g>' +
      SCN.padUnder('kpad', 540, 232, 70) + SCN.blanketOver('kblank', 552, 230, 52) +
      SCN.splintOn('ksplint', 564, 226, 26) +
      '<g id="tylerG">' + SCN.figStand('tylerF', 640, 226, { hat: true }) + '</g>' +
      '<g id="anaG">' + SCN.figStand('anaF', 684, 228, { flip: true }) + '</g>' +
      '<g id="flagpole" style="display:none;"><path d="M730,228 L730,186" class="ln"/><polygon points="730,186 754,193 730,200" class="o a"/></g>',
      { sky: 'dusk', label: 'A backpacker with an injured ankle resting against talus while her group plans the evacuation.' }),
    update: function (S) {
      SCN.show('ksplint', S.splinted);
      SCN.show('kpad', S.insul); SCN.show('kblank', S.insul);
      SCN.show('tylerG', !S.tylerGone && !S.pairSent);
      SCN.show('anaG', !S.pairSent && S.decided !== 'left');
      SCN.show('flagpole', S.marked);
    }
  }
};
