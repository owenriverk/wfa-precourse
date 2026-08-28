/* Snoring Isn't Sleeping — an obstructed airway outranks everything but a severe bleed. */
window.WFA_SCENARIO = {
  env: '55°F · shaded ravine edge · late afternoon',
  brief: '<p>Eight miles into a trail run with Priya, you round a bend and she pulls up short. A runner is off the low side of the trail below a root step — face-down in the duff, one arm thrown uphill, race bib still pinned on. Nobody else around, and nobody saw it happen. From ten feet away you can hear him snoring.</p><p>Both phones read SOS only. The knoll you passed three hundred yards back had one bar.</p>',
  startText: 'He doesn’t react to your voices. The snore is slow and wet, with a catch at the top of each breath. Priya looks at you. “He’s breathing, at least — right?”',
  state: { breathing: 'snoring', positioned: false, rolled: false, arrested: false, revived: false,
           reviveT: 0, called: false, priyaGone: false },

  tick: function (S, api) {
    if (!S.positioned && S.breathing === 'snoring' && S.t >= 4) {
      S.breathing = 'ragged';
      api.log('event', 'The snore has gone ragged — long silent gaps, then a sawing catch-up breath.');
    }
    if (!S.positioned && S.breathing === 'ragged' && (S.arrested ? S.t >= S.reviveT + 3 : S.t >= 8)) {
      S.breathing = 'none';
      api.log('event', 'The snoring stops. Not because the airway opened — because the breathing did.');
      if (!S.arrested) api.flag('late', 'Snoring in an unresponsive patient is an obstructed airway, and it was obstructed from the first sound you heard. Positioning it comes before everything except a severe bleed. (Lesson 3)');
      S.arrested = true;
    }
  },
  chips: function (S) {
    var b = S.breathing === 'none' ? 'STOPPED' : S.breathing === 'easy' ? 'easy, regular' : S.breathing;
    return [['Airway', S.positioned ? 'positioned' : 'OBSTRUCTED', !S.positioned], ['Breathing', b, S.breathing !== 'easy']];
  },

  actions: [
    { id: 'scene', g: 'assess', label: 'Size up the scene before you touch him', mins: 1, once: true, run: function (S) {
        S.crits.scene = true;
        return 'No wires, no wasps, no drop below him — just a root step at ankle height and a stride’s worth of empty air. Best guess: toe caught, head-first off the trail edge. Nobody saw it, which means his spine gets treated like it took the hit.'; } },
    { id: 'gloves', g: 'treat', label: 'Gloves on, both of you', mins: 1, once: true, run: function (S) {
        S.crits.gloves = true;
        return 'Nitrile from the flask pocket of your vest. Priya gets the spare pair.'; } },
    { id: 'resp', g: 'assess', label: 'Shout, squeeze his shoulder — check responsiveness', mins: 1, once: true, run: function (S, api) {
        S.crits.resp = true; api.vitals({ avpu: 'U' });
        return '“Hey! Can you hear me?” Nothing. A hard trapezius squeeze — not a flinch. Unresponsive on AVPU, and the snore keeps sawing. That sound is now the most important thing on this trail.'; } },
    { id: 'snore', g: 'assess', label: 'Listen at his mouth — what is that snoring?', mins: 1, once: true, run: function (S) {
        S.crits.snore = true;
        return 'Ear down by his face. That isn’t sleep. It’s the sound of a tongue lying against the back of an unconscious throat — an airway more closed than open, working against its own soft tissue. Snoring isn’t sleeping. It’s an obstruction with a soundtrack.'; } },
    { id: 'signal', g: 'treat', label: 'Both run back to the knoll for signal first', mins: 6, once: true, run: function (S, api) {
        S.called = true;
        api.flag('left', 'You both left an unresponsive, snoring patient alone and face-down. The airway problem you could hear from ten feet away kept working the whole time you were gone. Position the airway, then spend a runner. (Lessons 3, 13)');
        return 'Six hard minutes, round trip. The call goes out from the knoll — that part works. Jogging back down the last pitch, you strain to hear the snore over your own breathing.'; } },
    { id: 'roll', g: 'treat', label: 'Roll him as one unit — you take the head', mins: 2, once: true, run: function (S) {
        S.rolled = true; S.crits.roll = true;
        return 'Unwitnessed fall, so his spine gets the benefit of the doubt. You hold the head in line, Priya takes hips and knees. “On three — three.” He comes over as one piece, no twist.' +
          (S.breathing === 'none' ? ' Face slack, lips dusky. He is not making any sound at all.' : ' Face slack, lips dusky, the snore still sawing.'); } },
    { id: 'reco', g: 'treat', label: 'Open the airway — jaw forward, recovery position', mins: 1, once: true, when: function (S) { return S.rolled && S.breathing !== 'none'; }, run: function (S) {
        S.positioned = true; S.breathing = 'easy'; S.crits.airway = true;
        return 'You lift the jaw and the snore stops mid-note, like a door unsticking. Then the two of you roll him onto his side — top knee bent, head pillowed on his lower arm — so gravity keeps the tongue and anything else out of the road. The breaths come quiet and even.'; } },
    { id: 'cpr', g: 'treat', label: 'Not breathing — rescue breaths and CPR', mins: 4, once: true, when: function (S) { return S.rolled && S.breathing === 'none'; }, run: function (S) {
        S.revived = true; S.reviveT = S.t + 4; S.breathing = 'ragged';
        return 'Head positioned, nose pinched, two slow breaths — the chest rises. Then compressions, hard and fast, the metronome in your head at 110 while Priya counts. On the second round of breaths he coughs, gulps, and pulls a breath of his own. Ragged — and it only stays open as long as somebody keeps it open.'; } },
    { id: 'monitor', g: 'assess', label: 'Watch his chest — count breaths for a full minute', mins: 1, run: function (S, api) {
        S.crits.monitor = true;
        if (S.breathing === 'none') { api.vitals({ rr: 0 }); return 'You watch for a full minute. Nothing moves. Zero.'; }
        var rr = S.breathing === 'easy' ? 12 : 8;
        api.vitals({ rr: rr });
        return 'A full minute on the watch: ' + rr + ' breaths, ' + (S.breathing === 'easy' ? 'even and quiet. You’ll count again in a few minutes — an airway you positioned is an airway you keep watching.' : 'uneven, with gaps that make you hold your own breath. This is not fixed.'); } },
    { id: 'send', g: 'treat', label: 'Send Priya to the knoll to call — you stay', mins: 3, once: true, when: function (S) { return !S.called; }, run: function (S) {
        S.called = true; S.priyaGone = true; S.crits.send = true;
        return 'You give her the script out loud: half a mile past the creek crossing, adult male runner, found unresponsive, ' + (S.positioned ? 'airway positioned and breathing' : 'snoring — airway being worked on') + '. She repeats it back and is gone at race pace. You stay with his airway.'; } },
    { id: 'insul', g: 'treat', label: 'Get insulation under and over him', mins: 2, once: true, run: function (S) {
        return 'The ground has been pulling heat out of him since he landed. Wind shells go under his torso on the next careful roll, a vest over him, a buff around his head.'; } },

    { id: 'end-stay', g: 'decide', label: 'Hold here — monitor his airway until EMS arrives', mins: 2, when: function (S) { return S.called && S.breathing !== 'none'; }, run: function (S) {
        S.decided = 'stay'; S.crits.evac = true;
        return 'You settle where you can see his chest move — airway on your left, a running count in your head. EMS is forty minutes out, and he spends every one of them on his side, breathing. That was the whole job.'; } },
    { id: 'end-leave', g: 'decide', label: 'Leave him as he is — both run for the trailhead', mins: 2, run: function (S, api) {
        S.decided = 'leave';
        api.flag('abandon', 'Two of you means one can go and one can stay. Never leave a patient alone if it’s avoidable — least of all an unresponsive one whose airway needs a babysitter. (Lessons 13, 3)');
        return 'Two miles of downhill later you flag a truck and the machine starts. Behind you, an unresponsive man lies beside a trail with nobody watching his airway. Whatever happens in the next forty minutes happens to him alone.'; } }
  ],

  suggest: function (S) {
    if (!S.rolled) return ['scene', 'gloves', 'resp', 'signal', 'snore', 'roll'];
    if (S.breathing === 'none') return ['cpr', 'monitor', 'send', 'signal'];
    if (!S.positioned) return ['reco', 'monitor', 'send', 'signal', 'insul'];
    return ['monitor', 'send', 'insul', 'end-stay', 'end-leave'];
  },

  crits: [
    ['scene',   'Sized up the scene and the mechanism', 'An unwitnessed fall means the spine is guilty until proven otherwise — and you checked there was nothing left to fall on you. (Lessons 1, 7)'],
    ['gloves',  'Gloves before contact', 'Standard Precautions — every patient, every time. (Lesson 1)'],
    ['resp',    'Checked responsiveness properly', 'Voice, then touch, then pain stimulus. U on AVPU reclassifies everything above it. (Lesson 2)'],
    ['snore',   'Recognized snoring as an obstructed airway', 'Snoring isn’t sleeping — it’s soft tissue half-blocking the pipe. In an unresponsive patient it’s an emergency with a sound effect. (Lesson 3)'],
    ['roll',    'Rolled him as one unit, spine protected', 'Head and torso move together on a count — you can protect the spine and fix the airway in the same move. (Lesson 7)'],
    ['airway',  'Positioned the airway — jaw forward, recovery position', 'Position is the treatment at this level. Gravity becomes your suction and the tongue stops being a plug. (Lesson 3)'],
    ['monitor', 'Monitored his breathing after positioning', 'An airway you fixed once is not fixed forever. Count, wait, count again. (Lessons 3, 2)'],
    ['send',    'Sent your partner to call while you stayed', 'Spend the runner, keep the rescuer. The patient is never left alone while there are two of you. (Lesson 13)'],
    ['evac',    'Held with the patient until EMS arrived', 'An unresponsive patient buys a full evacuation — your job is keeping the airway open until the handoff. (Lesson 13)']
  ],
  links: [['../lessons/03_Airway.html', 'Lesson 3 — Airway'], ['../lessons/02_Patient_Assessment.html', 'Lesson 2 — Patient Assessment'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.breathing === 'none') return 'Snoring is an airway asking for one minute of attention. It didn’t get one.';
    if (S.arrested) return 'He stopped breathing, and you brought him back. Position the airway first, and you never have to.';
    return 'The snore never got to finish what it was starting.';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.trees([90, 140, 620, 665, 710]) + SCN.trail() +
      '<g id="root">' +
        SCN.pxRow(398, 424, 232, 'trunk') + SCN.pxRect(408, 224, 8, 8, 'trunk') + SCN.pxRow(398, 424, 236, 'boot') +
      '</g>' +
      '<g id="pt-prone">' + SCN.figProne('p1', 432, 248, { accent: true }) + '</g>' +
      '<g id="pt-sup" style="display:none;">' + SCN.figSupine('p2', 432, 248, { accent: true }) + '</g>' +
      '<g id="pt-reco" style="display:none;"><g transform="translate(0 -12) rotate(90 432 248)">' + SCN.figSit('p3', 432, 248, { accent: true }) + '</g></g>' +
      '<g id="priya">' + SCN.figStand('pr', 525, 232) + '</g>',
      { label: 'A runner face-down off the edge of a forest trail, snoring; another runner standing over him.' }),
    update: function (S) {
      SCN.show('pt-prone', !S.rolled);
      SCN.show('pt-sup', S.rolled && !S.positioned);
      SCN.show('pt-reco', S.positioned);
      SCN.show('priya', !S.priyaGone);
    }
  }
};
