/* Stop Peeking — direct pressure works by being held, not checked on. */
window.WFA_SCENARIO = {
  nlp: { csm: 'fingers|hand', peek: 'under the bandage|under the dressing|is it stopped|stopped bleeding|take a look' },
  env: '61°F · morning sun · basecamp on the river bar',
  brief: '<p>Paddling basecamp, day three. Rosa is on breakfast duty, sawing at a bagel with the camp knife everyone keeps meaning to sharpen. The knife skips off the crust and across her forearm, and suddenly there is a great deal more blood than a bagel usually costs. She’s gripping her wrist and looking to you, because you’re the one with the first aid kit strapped to your thwart bag.</p><p>Town is twenty minutes away by the cars parked at the takeout. The kit is a good one.</p>',
  startText: 'Rosa holds her arm out like it belongs to someone else. Blood runs in a steady ribbon off her elbow. “Okay,” she says, calm on the surface. “That’s a lot.” The paper towels somebody hands her are not going to be enough.',
  state: { gloved: false, touched: false, seen: false, pressureOn: false, pressStart: 0, peeks: 0,
           controlled: false, wrapped: false, tqUsed: false },

  tick: function (S, api) {
    if (S.pressureOn && !S.controlled) {
      var held = S.t - S.pressStart;
      if (held === 4) api.log('event', 'Blood is shadowing up through the gauze.');
      if (held >= 9) {
        S.controlled = true;
        if (S.peeks === 0) S.crits.hold = true;
        api.log('event', 'A full minute with no new color coming through. It’s holding.');
      }
    }
    if (!S.pressureOn && !S.controlled) {
      if (S.t === 3) api.log('event', 'A line of blood runs off her elbow and taps the picnic table, steady as a dripping tap.');
      if (S.t === 8) api.log('event', 'Rosa has gone quiet and greenish. The pile of red paper towels is not working.');
    }
  },
  chips: function (S) {
    var held = S.controlled ? 'done' : S.pressureOn ? (S.t - S.pressStart) + ':00' : '0:00';
    var b = S.controlled ? 'controlled' : S.pressureOn ? 'under pressure' : 'RUNNING';
    return [['Pressure held', held, !S.pressureOn && !S.controlled], ['Bleeding', b, !S.controlled]];
  },

  actions: [
    { id: 'gloves', g: 'treat', label: 'Gloves on first', mins: 1, once: true, run: function (S) {
        S.gloved = true; S.crits.gloves = !S.touched;
        return 'Nitrile from the lid pocket. The blood on the cutting board stays on the cutting board.'; } },
    { id: 'look', g: 'assess', label: 'Get the sleeve up — see what you’re dealing with', mins: 1, once: true, run: function (S) {
        S.seen = true; S.crits.look = true;
        return 'Sleeve up, arm into the light. Two inches, clean-edged, across the meat of the forearm — welling steadily, dark red, not spurting. Real, but not the spurting kind. Completely uninterested in paper towels.'; } },
    { id: 'press', g: 'treat', label: 'Direct pressure — gauze stack, both thumbs, weight', mins: 1, once: true, run: function (S, api) {
        S.pressureOn = true; S.pressStart = S.t; S.touched = true; S.crits.pressure = true;
        if (!S.gloved) api.flag('bare', 'Bare hands in that much blood is an exposure you can’t take back. Gloves live in the top of the kit so they can go on first. (Lesson 1)');
        return 'A fat stack of gauze straight onto the cut and both thumbs behind it, real weight. Rosa inhales through her teeth. “You could ask a girl to dinner first.”'; } },
    { id: 'hold', g: 'treat', label: 'Keep holding — lean in and wait', mins: 2, when: function (S) { return S.pressureOn && !S.controlled; }, run: function () {
        return 'You hold. You talk about the bagel. The clot underneath does its quiet work, which only continues if nobody interrupts it.'; } },
    { id: 'talk', g: 'ask', label: 'Take her history while you hold', mins: 2, once: true, when: function (S) { return S.pressureOn; }, run: function () {
        return 'Allergic to shellfish, no meds, tetanus booster two years ago after the oyster incident. Last ate: half a bagel, obviously. The pressure never lets up while she talks.'; } },
    { id: 'peek', g: 'assess', label: 'Lift the dressing — check if it’s stopped', mins: 1, when: function (S) { return S.pressureOn && !S.controlled; }, run: function (S, api) {
        S.peeks++; S.pressStart = S.t;
        if (S.peeks >= 2) api.flag('peek', 'Every peek tears the clot you were building and restarts the clock at zero. Pressure works by being boring: hold it, keep holding it, and judge it by what soaks through — not by looking under it. (Lesson 4)');
        return S.peeks === 1
          ? '“Has it stopped?” You lift the gauze to see. It has not — fresh blood wells the moment the pressure comes off, and the start of a clot leaves with the dressing. Whatever time you’d banked is gone. The clock starts over.'
          : 'You peek again. Same result, same reset. The wound cannot close in front of an audience.'; } },
    { id: 'layer', g: 'treat', label: 'Soaking through — add more gauze on top', mins: 1, once: true, when: function (S) { return S.pressureOn && !S.controlled && S.t - S.pressStart >= 4; }, run: function (S) {
        S.crits.layer = true;
        return 'Fresh gauze goes on top of the soaked layer — the soaked one stays, because the clot lives in it — and your grip comes back down harder than before.'; } },
    { id: 'swap', g: 'treat', label: 'Soaked — peel it off and start with fresh gauze', mins: 1, once: true, when: function (S) { return S.pressureOn && !S.controlled && S.t - S.pressStart >= 4; }, run: function (S, api) {
        S.pressStart = S.t;
        api.flag('swap', 'The soaked dressing is part of the clot now. Peeling it off reopens the wound — add layers on top and keep pressing. (Lesson 4)');
        return 'You peel the soaked stack off to start clean. The wound reopens like you asked it to. Everything the last few minutes built goes into the trash with the old gauze.'; } },
    { id: 'tq', g: 'treat', label: 'Put a tourniquet on it', mins: 2, once: true, run: function (S, api) {
        S.tqUsed = true; S.controlled = true;
        api.flag('tq', 'Pressure was working — save the tourniquet for bleeding that pressure can’t hold. (Lesson 4)');
        return 'You strap her upper arm and crank until the bleeding quits, her fingers blanch, and she stops being polite. It works the way a sledgehammer opens a jar. You note the time on her forearm.'; } },
    { id: 'wrap', g: 'treat', label: 'Pressure bandage over the stack', mins: 2, once: true, when: function (S) { return S.controlled; }, run: function (S) {
        S.wrapped = true; S.crits.wrap = true;
        return 'A roller bandage over the whole stack, snug and overlapping, fingertips left out in the daylight. Pressure you don’t have to hold by hand.'; } },
    { id: 'csm', g: 'assess', label: 'Check CSM below the wrap', mins: 1, when: function (S) { return S.wrapped; }, run: function (S) {
        S.crits.csm = true;
        return 'Fingernail squeeze below the wrap: blanch, release, pink in two seconds. Fingers wiggle and feel your touch. Snug is right; strangling is not.'; } },

    { id: 'end-dress', g: 'decide', label: 'Dress it, set a monitoring schedule, carry on', mins: 2, when: function (S) { return S.controlled && S.wrapped; }, run: function (S) {
        S.decided = 'dress'; S.crits.judgment = true;
        return 'Cleaned at the edges, dressed, and demoted to a chore: CSM and soak-through checks through the evening, a proper look in town tomorrow. Rosa is back on bagels — supervising, left-handed.'; } },
    { id: 'end-911', g: 'decide', label: 'Call 911 and wait for the ambulance', mins: 2, when: function (S) { return S.controlled; }, run: function (S) {
        S.decided = '911';
        return 'The ambulance finds a paddling basecamp and a bandaged cook drinking cocoa. Nobody is sorry you called — but a controlled bleed with good CSM, twenty road minutes from town with your own cars, was a drive-and-monitor problem. The evac decision is part of the medicine.'; } },
    { id: 'end-cook', g: 'decide', label: '“It’s fine” — back to breakfast', mins: 1, run: function (S, api) {
        S.decided = 'cook';
        if (!S.controlled) {
          api.flag('shrug', 'You went back to breakfast with an uncontrolled bleed under a loose dressing. Blood she can spare is not the same as blood you can ignore. (Lesson 4)');
          return 'Back to breakfast. The dressing soaks through before the coffee refills, and the drips start finding the table again. Rosa is pale and quiet, which for Rosa is a vital sign. This isn’t over just because you stopped looking at it.';
        }
        api.flag('watchit', 'A wrapped wound still needs scheduled re-checks — CSM below the wrap, soak-through, pain creeping up. A swelling arm can turn a bandage into a slow tourniquet with nobody watching. (Lesson 4)');
        return 'Fair enough — it’s quiet and wrapped. But a wrap isn’t a discharge. Set a timer between pancakes and look at her fingers on schedule.'; } }
  ],

  suggest: function (S) {
    if (!S.pressureOn && !S.controlled) return ['gloves', 'look', 'press', 'tq'];
    if (!S.controlled) return ['hold', 'peek', 'layer', 'swap', 'talk', 'tq'];
    if (!S.wrapped) return ['wrap', 'csm', 'talk', 'end-cook'];
    return ['csm', 'end-dress', 'end-911', 'end-cook'];
  },

  crits: [
    ['gloves',   'Gloves on before touching blood', 'Fresh red blood is the highest-exposure moment in first aid. Gloves first — every patient, even friends. (Lesson 1)'],
    ['look',     'Exposed the wound and looked at it', 'You treat what you can see. Sleeve up, one good look — then commit to the pressure. (Lessons 4, 2)'],
    ['pressure', 'Direct pressure, immediately', 'Direct pressure is the treatment for this bleed. Gauze, thumbs, weight — right now, not after a debate. (Lesson 4)'],
    ['layer',    'Added gauze on top of the soaked layer', 'The soaked dressing stays — the clot is woven into it. Reinforce over it and press harder. (Lesson 4)'],
    ['hold',     'Held pressure uninterrupted until it stopped', 'The clot needs unbroken minutes, and it can’t form in front of an audience. Judge it by soak-through, never by lifting the dressing. (Lesson 4)'],
    ['wrap',     'Converted to a pressure bandage once controlled', 'A snug wrap holds your work so your hands can retire. (Lesson 4)'],
    ['csm',      'Checked CSM below the wrap', 'A pressure bandage tight enough to work is tight enough to check: pink, feeling, moving fingertips. (Lessons 4, 6)'],
    ['judgment', 'Matched the evacuation to the injury', 'Controlled bleed, intact CSM, cars at the takeout: clean it, dress it, watch it, and see a professional on your own wheels. (Lesson 13)']
  ],
  links: [['../lessons/04_Bleeding_Wounds.html', 'Lesson 4 — Bleeding & Wounds'], ['../lessons/01_Provider_Safety.html', 'Lesson 1 — Provider Safety'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.tqUsed) return 'A tourniquet on a bagel wound is a story Rosa now gets to tell forever.';
    if (S.peeks >= 2) return 'Every peek bought the wound another round. Boring pressure wins.';
    if (S.crits.hold) return 'Held, uninterrupted, until it quit. That’s the whole trick, done the boring way.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.lake() + SCN.trees([60, 105, 730]) +
      SCN.pxRow(612, 644, 188, 'bootsh') + SCN.pxRow(600, 656, 192, 'boot') + SCN.pxRow(608, 648, 196, 'bootsh') +
      SCN.tent(90, 230) + SCN.stove(300, 230) +
      SCN.pxRect(364, 212, 84, 8, 'trunk') + SCN.pxRect(364, 220, 84, 4, 'boot') +
      SCN.pxRect(380, 224, 8, 8, 'boot') + SCN.pxRect(432, 224, 8, 8, 'boot') +
      SCN.pxRect(360, 232, 92, 4, 'shadow') +
      SCN.figSit('rosa', 480, 230, { accent: true }) +
      SCN.mark('wound', 494, 214) +
      '<g id="drip" style="display:none;">' + SCN.pxRect(492, 216, 4, 16, 'BRU') + SCN.pxRect(488, 232, 12, 4, 'BRU') + '</g>' +
      SCN.dressing('dress', 494, 214) +
      '<g id="wrapband" style="display:none;">' + SCN.pxRect(484, 208, 20, 8, 'splint') + SCN.pxRect(484, 216, 20, 4, 'strap') + '</g>' +
      '<g id="helper" style="display:none;">' + SCN.figKneel('you', 522, 230, { flip: true }) + '</g>',
      { sky: 'noon', label: 'A camp kitchen by the river: tent, stove, picnic table, and a paddler seated with a bleeding forearm.' }),
    update: function (S) {
      SCN.show('wound', S.seen && !S.pressureOn && !S.controlled);
      SCN.show('drip', !S.pressureOn && !S.controlled);
      SCN.show('dress', (S.pressureOn || S.controlled) && !S.wrapped);
      SCN.show('wrapband', S.wrapped);
      SCN.show('helper', S.pressureOn && !S.wrapped);
    }
  }
};
