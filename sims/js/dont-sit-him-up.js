/* Don't Sit Him Up — spinal motion restriction, with a storm forcing the move. */
window.WFA_SCENARIO = {
  nlp: { stab: 'hold his head|head still|stabilize', spineq: 'neck|tingling|back pain' },
  env: '66°F · wind rising · the sky has gone green',
  brief: '<p>Flow trail, golden hour. Theo came into the last berm hot, went over the bars, and pinballed off the packed dirt. His helmet has a crack you can lay a finger in, and he’s flat on his back on the open trail saying his neck hurts. His riding buddy Ben got to him first and is hovering, hands out, not sure what he’s allowed to touch.</p><p>You were climbing the other way and have your trail kit. The sky behind the ridge has turned an ugly green, and the wind just changed its mind. A stand of low trees sits forty yards off the berm.</p>',
  startText: '“Don’t really want to move my head,” Theo says, very still, eyes tracking you. He’s alert and breathing easy. Somewhere west, low and long, the first thunder clears its throat.',
  state: { helmetChecked: false, asked: false, stabilized: false, moved: false, insulated: false,
           called: false, sat: false, tingling: false, stormHit: false, storm: 'building' },

  tick: function (S, api) {
    if (S.t === 3) { S.storm = '8 sec out'; api.log('event', 'Thunder. You count the gap: flash to rumble, eight seconds.'); }
    if (S.t === 7) { S.storm = '5 sec out'; api.log('event', 'Another flash. Five seconds. It’s coming to you.'); }
    if (S.t === 10) { S.storm = 'CLOSE'; api.log('event', 'Three seconds. The wind arrives ahead of it, cold and sudden.'); }
    if (S.t === 12) {
      S.stormHit = true; S.storm = 'OVERHEAD';
      if (!S.moved) {
        api.flag('exposed', 'The storm arrived while your patient was still laid out on open trail. Lightning is a scene-safety problem with a countdown — when it’s closing, you move him as one unit to better ground before it gets a vote. (Lessons 14, 7)');
        api.log('event', 'White light and its thunder arrive in the same second. Rain goes sideways. You are the tallest things on an open berm.');
      } else {
        api.log('event', 'The berm lights up white. From the low trees, you watch it happen to where he was lying.');
      }
    }
  },
  chips: function (S) { return [['Storm', S.storm, S.storm !== 'building']]; },

  actions: [
    { id: 'helmet', g: 'assess', label: 'Check the helmet and his airway', mins: 1, once: true, run: function (S) {
        S.helmetChecked = true; S.crits.helmet = true;
        return 'The shell has a real crack, but it held. He’s alert, talking, breathing without a sound out of place — with a clear airway there’s no reason to wrestle the helmet off, and a good reason not to: it’s cradling a head you want kept still. It stays on.'; } },
    { id: 'spineq', g: 'ask', label: 'Ask the spine questions', mins: 2, once: true, run: function (S, api) {
        S.asked = true; S.crits.spineq = true; api.vitals({ avpu: 'A' });
        return '“Where does it hurt?” The back of his neck, midline, worse when he starts to turn — so he stops being allowed to turn. No tingling yet; hands and feet obey. High-speed mechanism plus midline neck pain: he moves as one unit or not at all.'; } },
    { id: 'stab', g: 'treat', label: 'Take manual stabilization of his head', mins: 1, once: true, run: function (S) {
        S.stabilized = true; S.crits.stab = true;
        return 'You kneel at his crown, forearms braced on your knees, and hold his head in line with his spine. From here on your hands are the splint — the job only transfers to something rigid or somebody trained.'; } },
    { id: 'csm', g: 'assess', label: 'Check CSM — hands and feet', mins: 1, run: function (S) {
        if (S.moved || S.sat) S.crits.csm = true;
        return 'Wiggle fingers, wiggle toes — all four answer. He feels your squeeze at hands and ankles, grip even side to side.' +
          (S.tingling ? ' The prickling in his fingers since he sat up is still there — both hands, like they fell half asleep.' : ''); } },
    { id: 'situp', g: 'treat', label: 'Help him sit up — walk it off', mins: 1, once: true, run: function (S, api) {
        S.sat = true; S.tingling = true;
        api.flag('situp', 'You sat up a patient with a cracked helmet and midline neck pain. The tingling in his fingers is his spinal cord voting no. He stays flat and moves as one unit or not at all. (Lesson 7)');
        return 'He gets one elbow under himself before his breath catches. “Whoa — whoa. My hands just went fuzzy.” You ease him back flat. The tingling doesn’t leave with the movement.'; } },
    { id: 'move', g: 'treat', label: 'Move him as one unit — off the berm to the low trees', mins: 4, once: true, run: function (S) {
        S.moved = true; S.crits.move = true;
        return 'Not deeper than you need — off the open berm, clear of the tallest trunks, into the low stand. Ben takes hips and legs, you own the head and the count. Three slow coordinated slides, nose and toes pointing the same way the whole time.'; } },
    { id: 'insul', g: 'treat', label: 'Get insulation under him', mins: 2, once: true, when: function (S) { return S.moved; }, run: function (S) {
        S.insulated = true; S.crits.insul = true;
        return 'Both packs and a folded rain shell go under his torso on the next coordinated lift. The ground is the biggest heat thief out here, and he has a wait ahead of him.'; } },
    { id: 'call', g: 'treat', label: 'Call 911', mins: 3, once: true, run: function (S) {
        S.called = true; S.crits.evac = true;
        return 'One bar, and it holds. Location off the trail app; mechanism — over the bars at speed, cracked helmet, midline neck pain; patient alert and being kept still. They’re coming, and their radar says the same thing your eyes do: twenty minutes of weather first.'; } },

    { id: 'end-sar', g: 'decide', label: 'Hold his head and wait it out — hand off to EMS', mins: 2, when: function (S) { return S.called; }, run: function (S) {
        S.decided = 'sar'; S.crits.flat = !S.sat;
        return 'You keep his head while Ben tents a jacket over the three of you and the cell stomps through. When it passes, the litter team finds an insulated, motionless patient with a rescuer at his crown who can recite the whole story. Clean handoff.'; } },
    { id: 'end-walk', g: 'decide', label: 'Beat the storm — get him up and walking out', mins: 2, run: function (S, api) {
        S.decided = 'walk'; S.crits.flat = false;
        api.flag('walked', 'Midline neck pain and a cracked helmet mean he moves as one unit or not at all — walking him out gambled his spinal cord against a rain delay. (Lesson 7)');
        return 'You get him to his feet between you. Forty yards of walking with a wobble in it, then his legs buckle at a rain rut and you barely keep his head from whipping. He rides out the storm flat anyway — now with extra tingling.'; } },
    { id: 'end-stayput', g: 'decide', label: 'A spine patient doesn’t move for weather — stay put', mins: 2, when: function (S) { return !S.moved; }, run: function (S, api) {
        S.decided = 'stayput'; S.crits.flat = !S.sat;
        api.flag('rod', 'Perfect stillness on open ground traded a spine risk for a lightning one — and lightning was the one on a countdown. When the hazard is closing, you move: as one unit, to the low trees, now. (Lessons 14, 7)');
        return 'You plant yourselves around him on the open berm and wait where he lies. The cell arrives with the three of you as the tallest features on the trail, and a strike hits the ridge close enough to taste. Everyone gets away with it — which is not the same as being right.'; } }
  ],

  suggest: function (S) {
    if (!S.stabilized) return ['spineq', 'helmet', 'stab', 'situp', 'csm', 'call'];
    if (!S.moved) return ['move', 'call', 'csm', 'situp', 'end-stayput'];
    return ['insul', 'csm', 'call', 'end-sar', 'end-walk'];
  },

  crits: [
    ['helmet', 'Checked the helmet and left it on', 'The question is whether this helmet helps this patient. Alert, clear airway: it stays, splinting the head it just saved. (Lesson 7)'],
    ['spineq', 'Asked the spine questions', 'High-energy mechanism plus midline neck pain is your answer: full spine care, no shortcuts, nothing gets talked down. (Lesson 7)'],
    ['stab',   'Took manual stabilization of the head', 'Hands on, in line, early — the cheapest spine protection there is. (Lesson 7)'],
    ['move',   'Moved him as one unit to safer ground', 'When lightning is closing, the move is mandatory — the craft is doing it as one piece, on a count, with the head owned. (Lessons 14, 7)'],
    ['flat',   'Never sat him up', 'Sitting up a possible spine injury is how a bruised cord becomes a cut one. He stays flat until people with a backboard say otherwise. (Lesson 7)'],
    ['csm',    'Rechecked CSM after moving him', 'Every move gets a before-and-after. Fingers and toes are the spine’s status report. (Lessons 7, 2)'],
    ['insul',  'Insulated him from the ground', 'A still patient on wet dirt in a storm is a hypothermia project. Insulation under him matters most. (Lesson 9)'],
    ['evac',   'Called 911 with mechanism and findings', 'Possible spine injury is a litter-and-professionals evacuation. Make the call early — weather slows everyone down. (Lesson 13)']
  ],
  links: [['../lessons/07_Spine.html', 'Lesson 7 — Spine'], ['../lessons/14_Water_Lightning.html', 'Lesson 14 — Water & Lightning'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.sat) return 'His fingers were still tingling at handoff — a souvenir from the thirty seconds he spent sitting up.';
    if (S.stormHit && !S.moved) return 'You were the tallest things on the trail when it hit.';
    if (S.moved) return 'The berm lit up with nobody on it. That was the trade, and you made it in time.';
    return 'The storm never caught you standing still.';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.trail() + SCN.trees([644, 690, 736], 230) +
      SCN.bikeDown(230, 238) +
      '<g id="grp">' + SCN.figSupine('theo', 372, 234, { accent: true }) +
      '<path d="M363,225 A9,9 0 0 1 381,225" class="ln"/><path d="M369,217 l4,5" class="ln thin"/>' +
      SCN.figKneel('ben', 478, 234) + '</g>' +
      SCN.padUnder('pad', 584, 238, 96) +
      '<g id="storm-hit" style="display:none;"><path d="M520,8 L504,58 L520,55 L497,110" class="ln" style="stroke-width:2.6"/>' +
      '<path d="M90,66 l-6,14 M190,58 l-6,14 M310,64 l-6,14 M600,54 l-6,14 M710,68 l-6,14" class="ln thin faint"/></g>',
      { sky: 'storm', label: 'A mountain biker flat on his back on an open berm, cracked helmet on, bike down, storm building; a friend kneeling beside him.' }),
    update: function (S) {
      var g = document.getElementById('grp');
      if (g) g.setAttribute('transform', S.moved ? 'translate(214 2)' : '');
      SCN.show('pad', S.insulated);
      SCN.show('storm-hit', S.stormHit);
    }
  }
};
