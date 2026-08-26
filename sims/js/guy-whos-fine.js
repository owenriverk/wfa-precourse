/* The Guy Who's Fine — one set of vitals is a snapshot; the trend is the truth. */
window.WFA_SCENARIO = {
  env: '71°F · sunny · boulderfield below the crag',
  brief: '<p>Rest-day bouldering with the crew. Dale greased off the top of a fifteen-foot highball, clipped the edge of the pads, and landed side-first on the slab with a noise everybody heard. By the time you got over there he was sitting up against the boulder, running his post-fall comedy set. His spotter Kev is not laughing.</p><p>You have the group kit, three friends, and one bar of signal if you stand on the flat boulder. The trailhead is a mile downhill.</p>',
  startText: 'Dale grins up at you, one arm pressed against his lower ribs. “Ladies and gentlemen — the dismount.” His color is decent. His jokes are landing. Kev mouths: he fell fifteen feet.',
  state: { mechKnown: false, bellyDone: false, sets: 0, laidFlat: false, called: false, mood: 'joking' },

  tick: function (S, api) {
    if (S.t === 8) { S.mood = 'quieter'; api.log('event', 'Dale’s jokes are getting shorter.'); }
    if (S.t === 14) { S.mood = 'quiet'; api.log('event', 'Dale has gone quiet. He keeps licking his lips.'); }
    if (S.t === 20) { S.mood = 'anxious'; api.log('event', 'Dale asks whether it got cold out. It did not get cold out.'); }
  },
  chips: function (S) { return [['Dale', S.mood, S.mood !== 'joking']]; },

  actions: [
    { id: 'what', g: 'ask', label: 'Get the story — how far, onto what', mins: 1, once: true, run: function (S) {
        S.mechKnown = true; S.crits.mech = true;
        return 'Fifteen feet, off the top, half on the pad and half on rock — hip, ribs and elbow took it. “I bounced,” he says, delighted. Fifteen feet onto granite is a mechanism, and mechanisms don’t care about punchlines.'; } },
    { id: 'word', g: 'ask', label: 'He says he’s fine — take his word for it', mins: 1, once: true, run: function (S, api) {
        api.flag('word', 'An adrenaline-soaked patient is the least reliable witness to his own insides. The exam decides whether he’s fine — he doesn’t. (Lesson 2)');
        return '“Dude. I’m fine.” He starts a bow to prove it and doesn’t quite finish it. Adrenaline is writing checks his circulation will have to cash.'; } },
    { id: 'resp', g: 'assess', label: 'Check responsiveness and orientation', mins: 1, once: true, run: function (S, api) {
        S.crits.resp = true; api.vitals({ avpu: 'A' });
        return 'Name, place, day, what happened — four for four, delivered as bits. Fully alert. Alert-now is a data point, not a verdict.'; } },
    { id: 'bleed', g: 'assess', label: 'Sweep him for bleeding', mins: 2, once: true, run: function (S) {
        S.crits.bleed = true;
        return 'Hands from scalp to boots: scraped elbow, scraped hip, nothing soaking, nothing pooled beneath him. No bleeding on the outside — which says nothing about the inside.'; } },
    { id: 'spine', g: 'ask', label: 'Ask the spine questions', mins: 2, once: true, run: function (S) {
        S.crits.spine = true;
        return '“Neck hurt? Back? Any tingling?” No, no, and no — hands and feet all answer. You park him against the boulder anyway and tell him the show is a seated show. Fifteen feet buys a lot of caution, and nobody talks you out of it at this level.'; } },
    { id: 'belly', g: 'assess', label: 'Press the belly, check the pelvis', mins: 2, once: true, run: function (S) {
        S.bellyDone = true; S.crits.belly = true;
        return 'Soft on the right. Upper left, his hand catches your wrist before he can decide to be brave — the muscles underneath tighten on their own. Guarding. Pelvis stable to a gentle squeeze. The joke he was building dies in committee.'; } },
    { id: 'vitals', g: 'assess', label: 'Take a full set of vitals', mins: 3, run: function (S, api) {
        var hr = Math.min(128, 86 + Math.round(S.t * 1.6));
        var rr = Math.min(26, 16 + Math.floor(S.t / 3));
        var skin = S.t < 8 ? 'pink, warm' : S.t < 15 ? 'pale, cool' : 'pale, cool, sweaty';
        var prev = S.lastHR; S.sets++;
        if (S.sets === 1) S.crits.vitals1 = true; else S.crits.serial = true;
        api.vitals({ hr: hr, rr: rr, avpu: 'A', skin: skin });
        return 'Pulse ' + hr + (prev ? ' — last set was ' + prev : '') + ', breathing ' + rr + ', alert, skin ' + skin + '. Written down with the time.' + (prev && hr - prev >= 8 ? ' That’s not a number anymore. That’s a direction.' : ''); } },
    { id: 'still', g: 'treat', label: 'Lay him flat, insulate, keep him still', mins: 2, once: true, run: function (S) {
        S.laidFlat = true; S.crits.shock = true;
        return 'Show’s over: flat on the crash pads, puffy jacket over his torso, an audience member assigned to keep him there. Still and warm is the whole prescription for a body that might be leaking where you can’t see.'; } },
    { id: 'call', g: 'treat', label: 'Stand on the boulder — call 911', mins: 3, once: true, run: function (S) {
        S.called = true; S.crits.evac = true;
        return 'One bar holds. You give it clean: fifteen-foot fall onto rock, belly guarding, alert' + (S.sets >= 2 ? ', pulse climbing set over set — now ' + S.lastHR : '') + '. They’re rolling. Keep him still, call back if he worsens.'; } },

    { id: 'end-sar', g: 'decide', label: 'Keep him flat and warm — monitor until EMS arrives', mins: 2, when: function (S) { return S.called; }, run: function (S) {
        S.decided = 'sar';
        return 'Dale spends the wait flat, warm, and steadily less funny — which you now know how to read. You hand EMS a story with numbers in it, and the medic moves faster after the second set than the first.'; } },
    { id: 'end-walk', g: 'decide', label: 'He’s walking and talking — walk him out', mins: 2, run: function (S, api) {
        S.decided = 'walk';
        api.flag('walked', 'You let a fifteen-foot fall walk out on his own say-so. His legs worked; his blood volume was the question — and it got answered at the worst spot on the trail. (Lessons 5, 13)');
        return 'Dale walks it like a champion for two hundred yards. Then he sits down on a rock “for a sec,” waves you off, and puts his head between his knees. He does not get back up on his own. Everything you were going to do anyway now happens a half mile further from the road, with less daylight.'; } },
    { id: 'end-watch', g: 'decide', label: 'Seems okay — keep climbing, keep an eye on him', mins: 2, run: function (S, api) {
        S.decided = 'watch';
        api.flag('watch', 'A hard mechanism with belly guarding and a climbing pulse is not a watch-and-see problem. Internal bleeding doesn’t take rest days. (Lessons 5, 13)');
        return 'You keep half an eye on him between burns. An hour later Dale is gray, sweat-through, and answers a beat late. The bleed didn’t pause while you did.'; } }
  ],

  suggest: function (S) {
    if (!S.mechKnown) return ['what', 'resp', 'word', 'bleed', 'vitals'];
    if (!S.bellyDone) return ['vitals', 'spine', 'belly', 'bleed', 'word', 'still'];
    if (S.sets < 2) return ['vitals', 'still', 'call', 'belly', 'end-walk'];
    return ['still', 'call', 'vitals', 'end-sar', 'end-walk', 'end-watch'];
  },

  crits: [
    ['mech',    'Took the mechanism seriously', 'Fifteen feet onto rock is a big fall even when the patient isn’t acting like one. The fall sets your suspicion — not the comedy. (Lesson 2)'],
    ['resp',    'Checked responsiveness and orientation', 'Alert-now is your baseline. You can’t spot “less alert later” without it. (Lesson 2)'],
    ['bleed',   'Swept for severe bleeding', 'Severe hemorrhage is the first letter for a reason — and finding none outside doesn’t close the question. (Lesson 4)'],
    ['spine',   'Asked the spine questions and kept him parked', 'Real mechanism, distracting injuries, adrenaline: stay conservative and keep him still. (Lesson 7)'],
    ['belly',   'Examined the belly and pelvis', 'Guarding in one quadrant after blunt trauma is the closest thing internal bleeding has to a doorbell. (Lessons 2, 5)'],
    ['vitals1', 'Took a first full set of vitals', 'Numbers with a timestamp — the start of every trend. (Lesson 2)'],
    ['serial',  'Took serial vitals — two sets or more', 'One set is a snapshot, two are a trend, and the trend is the truth. 88 means nothing; 88-then-104 means everything. (Lessons 2, 5)'],
    ['shock',   'Kept him flat, warm and still — treated for shock', 'You can’t stop internal bleeding in the field, but you can stop spending the blood he has left. (Lesson 5)'],
    ['evac',    'Called 911 early with a clear report', 'Suspected internal bleeding is a surgery problem on a countdown. The call is the treatment. (Lesson 13)']
  ],
  links: [['../lessons/02_Patient_Assessment.html', 'Lesson 2 — Patient Assessment'], ['../lessons/05_Shock.html', 'Lesson 5 — Shock'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.decided === 'walk') return 'His legs worked. His blood pressure didn’t.';
    if (!S.crits.serial) return 'One set of vitals is a snapshot. The trend was there the whole time — nobody looked twice.';
    return 'Three snapshots made an arrow, and you followed it.';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.trees([70, 115, 700, 748]) + SCN.trail() +
      SCN.boulder(300, 232, 56) +
      '<rect x="392" y="224" width="88" height="8" rx="4" class="o a2"/>' +
      '<g id="pt-sit">' + SCN.figSit('d1', 430, 226, { accent: true }) + '</g>' +
      '<g id="pt-flat" style="display:none;">' + SCN.figSupine('d2', 408, 224, { accent: true }) + '</g>' +
      SCN.blanketOver('blank', 414, 226, 62) +
      SCN.figStand('kev', 545, 228, { flip: true }),
      { sky: 'noon', label: 'A climber sitting against a boulder on crash pads after a ground fall, a friend standing by.' }),
    update: function (S) {
      SCN.show('pt-sit', !S.laidFlat);
      SCN.show('pt-flat', S.laidFlat);
      SCN.show('blank', S.laidFlat);
    }
  }
};
