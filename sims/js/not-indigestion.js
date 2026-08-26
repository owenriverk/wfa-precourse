/* It's Not Indigestion — chest pain, denial, and the half mile that almost killed him. */
window.WFA_SCENARIO = {
  env: '74°F · sunny · the overlook, half a mile above the lot',
  brief: '<p>Day hike with your neighbor Ray, 58, and his daughter Erin. Ray charged the last stiff pitch to the overlook to prove he still could. Now he’s leaning on a rock with a hand flat on the middle of his chest, gray around the mouth, telling everyone it’s the gas-station burrito. Erin is looking at you.</p><p>Your kit has a small bottle of aspirin. Your phone shows one bar. The car is half a mile downhill.</p>',
  startText: 'Ray waves you off before you say a word: “It’s indigestion. That burrito.” He’s sweating harder than the shade explains, and his hand keeps coming back to the center of his chest.',
  state: { sat: false, asked: false, aspirin: false, called: false, sentErin: false,
           collapsed: false, collapseT: null, cprOn: false, crits: { nowalk: true, cpr: true, steady: true } },

  tick: function (S, api) {
    if (S.collapsed) return;
    if (!S.sat) {
      if (S.t === 5) api.log('event', 'Ray is still on his feet, pacing it off. The hand hasn’t left his chest.');
      if (S.t === 10) api.log('event', 'He leans over and spits. “Little queasy.” The gray is spreading.');
      if (S.t >= 15) {
        S.collapsed = true; S.collapseT = S.t; S.crits.cpr = false;
        api.vitals({ avpu: 'U', rr: 0 });
        api.log('event', 'Ray sits down hard, then slumps sideways. He isn’t answering. His chest isn’t moving.');
        api.flag('exert', 'He stayed on his feet with an untreated heart attack until it dropped him. Crushing chest pain plus sweat means all exertion stops — immediately, over his objections. (Lesson 11)');
      }
    } else if (S.t === 12) api.log('event', 'Ray, parked on his rock: “This is embarrassing.” Scared, but steady. Steady is the goal.');
  },
  chips: function (S) { return [['EMS', S.called ? 'on the way' : 'not called', !S.called]]; },

  actions: [
    { id: 'look', g: 'assess', label: 'Look at him properly for ten seconds', mins: 1, once: true, run: function () {
        return 'Gray-lipped, sweat-soaked on a mild day, one hand pressed flat to his sternum, and a story about a burrito. Burritos don’t make you sweat like that. This picture has a name.'; } },
    { id: 'opqrst', g: 'ask', label: 'Work the pain up — OPQRST', mins: 3, once: true, run: function (S) {
        S.crits.opqrst = true;
        return 'Onset: on the climb. Provokes: worse when he moves. Quality: “pressure — like someone parked a Jeep on me.” Radiates: left arm, edge of the jaw. Severity: “six. Maybe seven.” Time: twenty minutes and not letting up. That is not a burrito’s résumé.'; } },
    { id: 'insist', g: 'ask', label: 'Overrule the burrito theory, out loud', mins: 1, once: true, run: function (S) {
        S.crits.serious = true;
        return '“Ray. Pressure, sweat, came on with a climb — we treat that as your heart until a doctor with machines says otherwise.” He grumbles. Erin exhales. Denial is part of this condition; you’re allowed to be wrong later, at a hospital.'; } },
    { id: 'sit', g: 'treat', label: 'Stop everything — sit him down', mins: 1, once: true, run: function (S) {
        S.sat = true; S.crits.sit = true;
        return 'You park him against the rock, knees up, in whatever position eases the pressure. The work his heart was doing on his feet, it isn’t doing now. Nobody stands him up again without a stretcher.'; } },
    { id: 'meds', g: 'ask', label: 'Ask: allergies, meds, ulcers — before any pill', mins: 2, once: true, run: function (S) {
        S.asked = true; S.crits.ask = !S.aspirin;
        return 'No aspirin allergy. No blood thinners. No ulcers or recent bleeding. A statin and “something for blood pressure.” Nothing on the list that says no.'; } },
    { id: 'aspirin', g: 'treat', label: 'Give aspirin — chewed', mins: 2, once: true, when: function (S) { return !S.collapsed; }, run: function (S, api) {
        S.aspirin = true; S.crits.aspirin = true;
        if (!S.asked) api.flag('blind', 'The aspirin went in before anyone asked about allergies, blood thinners, or ulcers. It was probably fine. “Probably” is not a screening question. (Lesson 11)');
        return 'Four baby aspirin from the kit — 325 milligrams’ worth — chewed, with a grimace. Chewed is the point: it goes to work in minutes instead of an hour.'; } },
    { id: 'call', g: 'treat', label: 'Call 911 now, clear report', mins: 4, once: true, run: function (S) {
        S.called = true; S.crits.call = true;
        if (S.collapsed) return 'One bar carries it: 58-year-old male, witnessed collapse after chest pain, not breathing, CPR in progress at the overlook. They’re rolling, and the dispatcher counts the rhythm with you.';
        return 'One bar is enough. You keep it clean: the overlook trail, 58-year-old male, twenty minutes of crushing chest pain with sweating, resting now, aspirin aboard. They’re rolling. The best 911 call is the one that turns out overcautious.'; } },
    { id: 'vitals', g: 'assess', label: 'Take a set of vitals', mins: 3, when: function (S) { return !S.collapsed; }, run: function (S, api) {
        var hr = (S.sat ? 92 : 100) + Math.min(14, S.t);
        api.vitals({ hr: hr, rr: 20, avpu: 'A', skin: 'gray, clammy' });
        return 'Pulse ' + hr + ' and not perfectly even. Breathing 20. Alert, skin gray and clammy. Written down with the time — the next set tells you which way this is going.'; } },
    { id: 'watch', g: 'treat', label: 'Stay on him — monitor and reassure', mins: 3, when: function (S) { return !S.collapsed; }, run: function (S) {
        S.crits.watch = true;
        return 'You keep him still and keep him company, counting his breathing between sentences and watching his color. Reassurance is a treatment — fear feeds the same heart you’re trying to rest.'; } },
    { id: 'walk', g: 'treat', label: 'Walk him down to the car — it’s close', mins: 2, once: true, when: function (S) { return !S.collapsed; }, run: function (S, api) {
        S.collapsed = true; S.collapseT = S.t; S.crits.cpr = false; S.crits.nowalk = false;
        api.vitals({ avpu: 'U', rr: 0 });
        api.flag('walk', 'You put a suspected heart attack back on his feet for a half-mile walk — a stress test nobody ordered. The patient rests where he is; the ambulance does the moving. (Lessons 11, 13)');
        return 'He makes it forty yards, stops, grips Erin’s shoulder — and goes down. He isn’t answering. His chest isn’t moving.'; } },
    { id: 'cpr', g: 'treat', label: 'Start compressions — now', mins: 4, once: true, when: function (S) { return S.collapsed && !S.cprOn; }, run: function (S, api) {
        S.cprOn = true;
        if (S.t - S.collapseT <= 2) S.crits.cpr = true;
        else api.flag('late', 'There was a gap between the collapse and the first compression. Unresponsive and not breathing means start now — every empty minute costs him. (Lesson 3)');
        return 'Heel of your hand, center of the chest, arms locked, all your weight — hard and fast, 100 to 120 a minute. Ribs creak. That is what working feels like. You settle into the rhythm.'; } },
    { id: 'breaths', g: 'treat', label: 'Add rescue breaths — 30 and 2', mins: 2, once: true, when: function (S) { return S.cprOn; }, run: function () {
        return 'Thirty compressions, head tilt, pinch, two breaths — the chest rises — then hands back on the sternum without a wasted second.'; } },
    { id: 'send', g: 'ask', label: 'Send Erin to flag EMS in from the lot', mins: 1, once: true, when: function (S) { return S.collapsed; }, run: function (S) {
        S.sentErin = true;
        return '“Erin — down to the lot, wave them in, bring them here.” One clear job at a run. It costs the scene nothing: your hands never have to leave his chest.'; } },
    { id: 'pulse', g: 'assess', label: 'Pause compressions to feel for a pulse', mins: 1, when: function (S) { return S.cprOn; }, run: function (S, api) {
        S.crits.steady = false;
        api.flag('pulse', 'You stopped compressions to hunt for a pulse. Not taught at this level — fingertips lie under stress, and every second off the chest is blood not moving. Compress until help takes over. (Lesson 3)');
        return 'Ten seconds of fingertips on his neck, feeling mostly your own heartbeat. Nothing you’d bet on. Back on the chest — that pause moved no blood.'; } },
    { id: 'end-ems', g: 'decide', label: 'Hold here — hand over to EMS when they arrive', mins: 2, run: function (S, api) {
        S.decided = 'hold';
        if (!S.called) api.flag('nocall', 'You settled in to wait without calling anyone. Nobody was coming. Early activation is the treatment this condition wants most. (Lessons 11, 13)');
        if (S.collapsed && S.cprOn) return 'You trade compressions with Erin when your arms go, and you’re mid-cycle when the crew crests the trail with a monitor and a jump kit. You hand over a working scene.';
        if (S.collapsed) return 'You wait beside him. Nobody pumps. The crew that finally arrives cannot buy back the minutes already spent.';
        return 'Ray stays parked, chewed aspirin aboard, complaining about the fuss — which is exactly how you want him: still complaining when the crew walks up.'; } },
    { id: 'end-drive', g: 'decide', label: 'Load him in the car and drive to town yourselves', mins: 2, when: function (S) { return !S.collapsed; }, run: function (S, api) {
        S.decided = 'drive'; S.crits.nowalk = false;
        api.flag('drive', 'Driving him yourselves means walking him downhill first and betting he doesn’t arrest in a back seat with you at the wheel. The ambulance carries a defibrillator, drugs, and trained hands. Your car carries seatbelts. (Lessons 11, 13)');
        return 'You get him down the trail on two shoulders, every step a coin flip, and into the back seat. Maybe you make it. The version of this where you called first never had to gamble.'; } }
  ],

  suggest: function (S) {
    if (S.collapsed) return S.cprOn ? ['breaths', 'send', 'call', 'pulse', 'end-ems'] : ['cpr', 'call', 'send', 'pulse', 'end-ems'];
    if (!S.sat) return ['sit', 'look', 'opqrst', 'walk', 'call', 'insist'];
    if (!S.aspirin) return ['meds', 'aspirin', 'call', 'opqrst', 'walk', 'vitals'];
    return ['call', 'watch', 'vitals', 'insist', 'end-drive', 'end-ems'];
  },

  crits: [
    ['serious', 'Took the chest pain seriously over his objections', 'Denial is part of the presentation — the patient votes, the pattern decides. (Lesson 11)'],
    ['sit',     'Stopped all exertion and sat him down', 'Every step is work for a heart already starving. Rest is the first drug. (Lesson 11)'],
    ['opqrst',  'Worked the pain up with OPQRST', 'Pressure + sweat + exertion + radiation is the textbook cardiac picture — you can’t act on a pattern you never drew out. (Lessons 2, 11)'],
    ['ask',     'Checked allergies, meds, and bleeding history before the aspirin', 'Aspirin helps most people and hurts a specific few — one question sorts them. (Lesson 11)'],
    ['aspirin', 'Gave aspirin, chewed', '325 mg chewed, working in minutes — one of the few field moves that changes the outcome of a heart attack. (Lesson 11)'],
    ['call',    'Called 911 early with a clear report', 'Time is heart muscle. The call is treatment, not admission of defeat. (Lessons 11, 13)'],
    ['watch',   'Monitored and reassured while waiting', 'Calm lowers the demand on the heart, and watching catches the change that matters. (Lesson 2)'],
    ['nowalk',  'Kept him off his feet — no walking him out', 'The patient rests; the ambulance moves. A half-mile stroll is a stress test. (Lessons 11, 13)'],
    ['cpr',     'If he went down: compressions without delay', 'Unresponsive and not breathing means start now — no pulse check at this level. (Lesson 3)'],
    ['steady',  'Uninterrupted compressions', 'Hands off the chest is blood not moving. Swap rescuers; don’t pause to hunt for a pulse. (Lesson 3)']
  ],
  links: [['../lessons/11_Medical.html', 'Lesson 11 — Medical Emergencies'], ['../lessons/03_Airway.html', 'Lesson 3 — Airway & Breathing'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.decided === 'drive') return 'Maybe you made it to town. The playbook doesn’t deal in maybe.';
    if (S.collapsed && S.cprOn) return 'He went down — but compressions were moving blood and help knew the way. You gave him his chance.';
    if (S.collapsed) return 'He went down, and nobody took over for his heart. That is the run to never repeat.';
    return 'He never collapsed. Rest, aspirin, an early call — that is the whole playbook, and you ran it.';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.trail() + SCN.trees([80, 130, 720]) + SCN.boulder(300, 232, 40) +
      '<g id="ray-up">' + SCN.figStand('rayU', 360, 226, { accent: true }) + '</g>' +
      '<g id="ray-sit" style="display:none;">' + SCN.figSit('rayS', 356, 230, { accent: true }) + '</g>' +
      '<g id="ray-down" style="display:none;">' + SCN.figSupine('rayD', 340, 232, { accent: true }) + '</g>' +
      '<g id="erin">' + SCN.figStand('erinF', 424, 226, { flip: true }) + '</g>',
      { sky: 'noon', label: 'A man at a scenic overlook holding the center of his chest, his daughter beside him.' }),
    update: function (S) {
      SCN.show('ray-up', !S.sat && !S.collapsed);
      SCN.show('ray-sit', S.sat && !S.collapsed);
      SCN.show('ray-down', S.collapsed);
      SCN.show('erin', !S.sentErin);
    }
  }
};
