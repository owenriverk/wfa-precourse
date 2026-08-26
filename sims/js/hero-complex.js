/* Hero Complex — scene safety before patient contact. */
window.WFA_SCENARIO = {
  nlp: { vitals: 'pulse|heart rate', spine: 'neck|back pain|tingling' },
  env: '62°F · clear · scree still moving',
  brief: '<p>Day hike with friends, a mile above the lake. Crossing below an old rockslide, Maya cut across the scree to save a switchback — and the slope moved. She rode it twenty feet down and is crumpled at the base, moaning. Rocks are still clicking down past her. Jess is kneeling right beside her in the fall line, screaming your name.</p><p>You have your day pack with a small kit, and your phone shows two bars.</p>',
  startText: 'You round the corner. Maya is down at the base of the scree, moving a little. Jess is beside her, in the runout, waving you in. A rock the size of a fist skitters past them both.',
  state: { sceneChecked: false, jessSafe: false, atPatient: false, movedOut: false, rushed: false,
           released: false, pressureOn: false, bledChecked: false, slope: 'clattering' },

  tick: function (S, api) {
    if (S.t === 4 && !S.released) api.log('event', 'A cupful of gravel hisses down the slope and fans out across the runout.');
    /* the gotcha: stay in the fall line long enough and the slope releases again */
    if (S.t >= 9 && !S.movedOut && S.atPatient && !S.released) {
      S.released = true; S.slope = 'RELEASED';
      api.log('event', 'The slope lets go above you — a sheet of rock rattles down. You curl over Maya. Something hits your shoulder hard enough to see stars.');
      api.flag('inrunout', 'You worked on the patient inside the runout zone until the slope released again. In an active hazard zone, the first treatment is distance. (Lesson 1)');
    }
    if (S.t === 14 && !S.jessSafe) api.log('event', 'Jess is still crouched in the fall line, hands over her head.');
  },
  chips: function (S) { return [['Slope', S.slope, S.slope !== 'quiet']]; },

  actions: [
    { id: 'slope', g: 'assess', label: 'Stop. Read the slope before anyone moves', mins: 2, once: true, run: function (S) {
        S.sceneChecked = true; S.crits.scene = !S.atPatient && !S.rushed; S.slope = 'quiet';
        return 'You make yourself stand still and watch. The release comes in pulses — a clatter, then thirty quiet seconds. The fall line runs straight through Maya and Jess. Off to the left, a rib of solid rock climbs to them out of the fall line. That’s the road in.'; } },
    { id: 'jess', g: 'ask', label: 'Shout to Jess: get her out of the fall line', mins: 1, once: true, run: function (S) {
        S.jessSafe = true; S.crits.jess = true;
        return '"JESS. Look at me. Move LEFT to the big boulder — now." She hesitates, then scrambles out of the runout. One patient is not allowed to become three.'; } },
    { id: 'rush', g: 'treat', label: 'Sprint straight to Maya', mins: 1, once: true, run: function (S, api) {
        S.atPatient = true; S.rushed = true; S.slope = 'RELEASED'; S.released = true;
        api.flag('rushed', 'You sprinted into the fall line without reading the slope. The second release caught you in the open — a rescuer who becomes a patient helps no one. (Lesson 1)');
        return 'You run. Halfway across the runout the slope answers — a sheet of scree lets loose above you. You take a rock across the scalp and another off your forearm getting to her. You’re at Maya’s side, bleeding, ears ringing.'; } },
    { id: 'approach', g: 'treat', label: 'Move in along the rock rib, out of the fall line', mins: 2, once: true, when: function (S) { return S.sceneChecked && !S.atPatient; }, run: function (S) {
        S.atPatient = true; S.crits.approach = true;
        return 'You time the quiet pulse and climb the rib, solid rock the whole way, and step into the runout only for the last body length. You’re at Maya’s side with the slope at your back for seconds, not minutes.'; } },
    { id: 'gloves', g: 'treat', label: 'Put on gloves', mins: 1, once: true, run: function (S) {
        S.gloved = true; S.crits.gloves = !S.atPatient || !S.bledChecked;
        return 'Nitrile gloves on.'; } },
    { id: 'drag', g: 'treat', label: 'Move Maya out of the runout — fast and as one unit', mins: 3, once: true, when: function (S) { return S.atPatient; }, run: function (S) {
        S.movedOut = true; S.crits.moveout = true; S.slope = 'behind you';
        return 'Active hazard changes the rules: she moves NOW, as spine-safe as speed allows. You take her head and armpits, Jess takes her feet on your count, and you shift her in two smooth drags behind the boulder. The next clatter of rock lands where she was lying.'; } },
    { id: 'resp', g: 'assess', label: 'Check responsiveness, introduce yourself', mins: 1, once: true, when: function (S) { return S.atPatient; }, run: function (S, api) {
        S.crits.resp = true; api.vitals({ avpu: 'V' });
        return '"Maya — can you hear me?" Her eyes open when you speak: "...it moved. My leg." She knows her name, knows the trail, is hazy on the fall itself. Responds to voice, drifting but answering.'; } },
    { id: 'bleed', g: 'assess', label: 'Sweep for severe bleeding', mins: 2, once: true, when: function (S) { return S.atPatient; }, run: function (S) {
        S.bledChecked = true; S.crits.bleed = true;
        return 'Blood in her hair above the left ear — a scalp gash, oozing steadily the way scalps do, not spurting. Nothing pooled beneath her. Right ankle is swollen against the boot. No life-threatening bleed — but that scalp needs pressure.'; } },
    { id: 'pressure', g: 'treat', label: 'Direct pressure + dressing on the scalp wound', mins: 3, once: true, when: function (S) { return S.bledChecked; }, run: function (S) {
        S.pressureOn = true; S.crits.pressure = true;
        return 'Gauze stack on the gash, firm pressure, then a wrap to hold it. Scalps bleed like they’re auditioning — this one quiets under pressure.'; } },
    { id: 'spine', g: 'assess', label: 'Ask the spine questions', mins: 2, once: true, when: function (S) { return S.atPatient; }, run: function (S) {
        S.crits.spine = true;
        return 'Tumbling fall — real mechanism. "Does your neck or back hurt?" — "No... just my leg and my head." No tingling, hands and feet work. You keep her still anyway and pad around her head. At this level you don’t clear a spine — you just gather reasons to stay careful.'; } },
    { id: 'vitals', g: 'assess', label: 'Take a full set of vitals', mins: 3, when: function (S) { return S.atPatient; }, run: function (S, api) {
        var hr = 92 + Math.min(14, Math.floor(S.t / 3));
        api.vitals({ hr: hr, rr: 18, avpu: 'V', skin: 'pale, cool' });
        return 'Pulse ' + hr + ', breathing 18 easy, responds to voice, skin pale and cool. Logged with the time.'; } },
    { id: 'ankle', g: 'treat', label: 'Support the ankle — pad and wrap it in the boot', mins: 4, once: true, when: function (S) { return S.movedOut; }, run: function (S) {
        S.crits.ankle = true;
        return 'Boot stays on as the splint it already is. You snug padding around it and wrap above and below. She hisses, then settles.'; } },

    { id: 'end-call', g: 'decide', label: 'Call 911 — request SAR, stay with her', mins: 5, run: function (S) {
        S.crits.evac = true; S.decided = 'call';
        return 'Two bars is plenty. Location, mechanism, one patient — altered but answering, scalp bleed controlled, ankle injury — plus one walking-wounded rescuer if the slope caught you. SAR is moving. You and Jess keep her warm behind the boulder, out of the fall line, and wait like professionals.'; } },
    { id: 'end-carry', g: 'decide', label: 'Carry her out between you and Jess', mins: 2, run: function (S, api) {
        S.decided = 'carry';
        api.flag('carry', 'A two-person carry over a mile of rough trail with an altered patient and a possible spine mechanism trades one problem for four. You had two bars — the call was the move. (Lessons 7, 13)');
        return 'Forty yards of staggering makes the math obvious: she’s drifting, the trail is rubble, and you’re one stumble from dropping her. This is not a carrying problem. It’s a phone problem.'; } },
    { id: 'end-wait', g: 'decide', label: 'Sit tight — someone will come along', mins: 2, run: function (S, api) {
        S.decided = 'wait';
        api.flag('nowait', 'Waiting with working phone service and an altered patient hands the outcome to luck. Use your resources. (Lesson 13)');
        return 'You settle in to hope. The slope clatters. Nobody comes. Hope is not an evacuation plan.'; } }
  ],

  suggest: function (S) {
    if (!S.atPatient) return ['slope', 'jess', 'rush', 'approach', 'gloves'];
    if (!S.movedOut) return ['drag', 'resp', 'bleed', 'jess', 'pressure', 'gloves'];
    if (!S.pressureOn) return ['bleed', 'pressure', 'resp', 'spine', 'vitals', 'jess'];
    return ['spine', 'vitals', 'ankle', 'end-call', 'end-carry'];
  },

  crits: [
    ['scene',    'Read the slope before entering the runout', 'What took her down was still coming down. You don’t go until you know how it moves. (Lesson 1)'],
    ['jess',     'Got the bystander out of the fall line', 'One patient must not become two — and Jess was next. (Lesson 1)'],
    ['approach', 'Approached out of the fall line, not straight up it', 'The fastest line and the safest line are rarely the same line. (Lesson 1)'],
    ['gloves',   'Gloves on before blood contact', 'Standard Precautions — every patient, every time. (Lesson 1)'],
    ['moveout',  'Moved the patient out of the hazard zone before treating', 'An active hazard reverses the usual rule: distance first, then medicine — as one unit, as gently as speed allows. (Lessons 1, 7)'],
    ['resp',     'Checked responsiveness', 'V on AVPU after a tumbling fall is a finding, not a mood. (Lesson 2)'],
    ['bleed',    'Swept for severe bleeding', 'Severe hemorrhage is the first letter for a reason. (Lesson 4)'],
    ['pressure', 'Controlled the scalp bleed with direct pressure', 'Direct pressure, held — scalps quit when you mean it. (Lesson 4)'],
    ['spine',    'Asked the spine questions and kept her still', 'Tumbling mechanism + altered patient = stay conservative. (Lesson 7)'],
    ['ankle',    'Stabilized the ankle', 'The boot is already a splint — pad it, wrap it, leave the toe checkable. (Lesson 6)'],
    ['evac',     'Called for rescue with a clear report', 'Altered patient, real mechanism, working phone: activate SAR and hold. (Lesson 13)']
  ],
  links: [['../lessons/01_Provider_Safety.html', 'Lesson 1 — Provider Safety'], ['../lessons/04_Bleeding_Wounds.html', 'Lesson 4 — Bleeding'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) { return S.released ? 'Now there are two of you.' : 'The slope never got a second shot at anyone. That was the test, and you passed it.'; },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.scree() + SCN.trail() + SCN.trees([700, 750]) +
      SCN.boulder(560, 232, 34) +
      '<g id="release" style="display:none;"><path d="M120,90 L300,206 M160,86 L330,200 M200,92 L360,208" class="ln thin faint"/><path d="M300,208 l7,-2 l3,4 l-8,2 z M336,214 l6,-2 l3,4 l-7,2 z" class="ln thin"/></g>' +
      '<g id="pt-pos">' + SCN.figSupine('pt', 300, 232, { accent: true }) + SCN.dressing('dress', 296, 218) + '</g>' +
      '<g id="jess-near">' + SCN.figKneel('jess1', 356, 232) + '</g>' +
      '<g id="jess-safe" style="display:none;">' + SCN.figStand('jess2', 610, 226, { wave: false }) + '</g>',
      { label: 'A hiker down at the base of a scree slope, her friend beside her, rocks still coming down.' }),
    update: function (S) {
      SCN.show('jess-near', !S.jessSafe);
      SCN.show('jess-safe', S.jessSafe);
      SCN.show('release', S.released);
      SCN.show('dress', S.pressureOn);
      var pt = document.getElementById('pt-pos');
      if (pt) pt.setAttribute('transform', S.movedOut ? 'translate(310 6)' : '');
    }
  }
};
