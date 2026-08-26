/* Treat the Dead First — a close strike, two patients, and the instinct that picks the wrong one. */
window.WFA_SCENARIO = {
  nlp: { sam: 'screamer|screaming one', alex: 'silent one|still one' },
  env: '55°F · storm overhead · exposed ridge, 11,400 feet',
  brief: '<p>Afternoon build-up caught your group of four on the ridge — you pushed one saddle too far. The flash and the crack arrive together. When your vision clears, two people are down: Sam is screaming and cradling an arm, and Alex is face-down in the rocks ten feet away, silent. Priya stands frozen between them, yelling both their names.</p><p>Thunder is still rolling. Sheltered ground sits two hundred feet below the crest.</p>',
  startText: 'The air smells like a struck match. Sam’s screaming carries over the thunder — full sentences, mostly swearing. Alex hasn’t made a sound and hasn’t moved. Rain starts, hard.',
  state: { off: false, spreadOut: false, samSeen: false, checkedAlex: false, rolled: false,
           breaths: false, breathsT: null, alexBreathing: false, arrest: false, cpr: false, cprT: null,
           hope: false, delegated: false, called: false, crits: { keepon: true } },

  tick: function (S, api) {
    if (!S.off && S.t === 3) api.log('event', 'FLASH — crack. Close. The ridge is still the tallest thing around, and so are all of you.');
    if (!S.off && S.t === 7) {
      api.flag('exposed', 'The group worked on the ridge crest through the next strikes. The storm was patient zero — everyone moves off the high ground first. (Lessons 14, 1)');
      api.log('event', 'Another strike hits the next knob down the ridge. Close enough to feel in your teeth.');
    }
    if (!S.alexBreathing && !S.breaths && !S.arrest && S.t >= 9) {
      S.arrest = true;
      api.log('event', 'Alex’s color has gone from pale to gray. If his heart was still beating on its own, it isn’t now.');
      api.flag('slow', 'Alex went from stalled breathing to full cardiac arrest while attention was elsewhere. Rescue breaths in the first minutes were the whole game. (Lessons 14, 3)');
    }
    if (S.breaths && !S.alexBreathing && !S.arrest && S.t >= S.breathsT + 3) {
      S.alexBreathing = true;
      api.vitals({ rr: 8, avpu: 'U' });
      api.log('event', 'Against your cheek: Alex pulls a breath on his own. Then another. Ragged, but his.');
    }
    if (S.arrest && S.cpr && !S.hope && S.t >= S.cprT + 8) {
      S.hope = true;
      api.log('event', 'Twice you think you feel him try to breathe against the rhythm. Lightning patients come back — you keep going.');
    }
  },
  chips: function (S) { return [
    ['Alex', S.alexBreathing ? 'breathing' : (S.arrest ? 'CARDIAC ARREST' : (S.checkedAlex ? 'NOT BREATHING' : 'silent, still')), !S.alexBreathing],
    ['Sam', S.delegated ? 'with Priya' : 'screaming', !S.delegated]]; },

  actions: [
    { id: 'off', g: 'treat', label: 'Everyone off the crest — patients included, fast and low', mins: 4, once: true, run: function (S) {
        S.off = true; S.crits.off = true;
        if (S.breaths && !S.alexBreathing) return 'You pause the breaths for the drag — sixty seconds of moving everyone below the crest, as straight as speed allows — then your mouth is back on the job. High ground was the injury that kept happening. You took it away.';
        return 'You make the call nobody wants to make with two patients down: everybody moves. Priya takes Sam; you drag Alex by the shoulders of his shell, as straight as speed allows, into the lee below the crest. High ground is the injury that keeps happening — you just took it away.'; } },
    { id: 'spread', g: 'ask', label: 'Spread the standing people out — 20 feet apart', mins: 1, once: true, run: function (S) {
        S.spreadOut = true; S.crits.spread = true;
        return '“Priya — twenty feet that way. We don’t bunch up.” One strike must not be able to take down everyone still on their feet. Getting off the exposed ground early beats crouching on it late.'; } },
    { id: 'sam', g: 'assess', label: 'Go to Sam — he’s screaming', mins: 3, once: true, run: function (S, api) {
        S.samSeen = true;
        if (!S.checkedAlex) api.flag('loudest', 'You went to the loudest patient first. Screaming is proof of an airway, breathing, and a working brain — the silent one is the emergency. Reverse triage: treat the apparently dead first. (Lesson 14)');
        return 'Sam’s forearm shows a red, branching fern pattern, blistering at the wrist. It hurts, it’s real, and none of it is killing him — he’s perfusing a scream that loud.' + (S.checkedAlex ? '' : ' Behind you, Alex still hasn’t made a sound.'); } },
    { id: 'alex', g: 'assess', label: 'Check Alex — the quiet one', mins: 2, once: true, run: function (S, api) {
        S.checkedAlex = true; S.rolled = true; S.crits.checked = true;
        if (!S.samSeen) S.crits.quiet = true;
        api.vitals({ avpu: 'U', rr: 0 });
        return 'Alex first. You roll him carefully to his back, head in line. Chest still. Ten seconds with your cheek at his mouth: nothing. Not breathing' + (S.arrest ? ', and gray' : '') + '. This is the patient.'; } },
    { id: 'breaths', g: 'treat', label: 'Rescue breaths — now', mins: 2, once: true, when: function (S) { return S.checkedAlex && !S.alexBreathing && !S.arrest; }, run: function (S) {
        S.breaths = true; S.breathsT = S.t; S.crits.vent = true;
        return 'Head tilt, pinch, seal, breathe — the chest rises. Again. Lightning stalls the breathing engine and leaves the rest fixable: your lungs are the bridge. One breath every five seconds, and you count out loud to keep yourself honest.'; } },
    { id: 'cpr', g: 'treat', label: 'Full CPR — compressions and breaths', mins: 3, once: true, when: function (S) { return S.checkedAlex && S.arrest; }, run: function (S) {
        S.cpr = true; S.cprT = S.t; S.crits.vent = true;
        return 'Hands to the center of the chest, hard and fast, 100 to 120 — thirty and two. Lightning arrests are the ones CPR was made for: a stopped, healthy heart wants to restart. You settle in like it’s going to take a while, because it might.'; } },
    { id: 'delegate', g: 'ask', label: 'Put Priya on Sam, with instructions', mins: 2, once: true, run: function (S) {
        S.delegated = true; S.crits.deleg = true;
        return '“Priya — Sam is yours. Sit him down, cool the burn with bottle water, cover it loose and clean, keep him talking to you.” One clear job turns a frozen bystander into a second rescuer — and you never left Alex.'; } },
    { id: 'call', g: 'treat', label: 'Call 911 — two-patient report', mins: 4, once: true, run: function (S) {
        S.called = true; S.crits.call = true;
        return 'You get through between thunderclaps: lightning strike, TWO patients — one not breathing with resuscitation in progress, one conscious with an arm burn — exact position below the ridge, storm still overhead. Two patients is the first word after “lightning.” SAR spins up to launch the moment the cell clears.'; } },
    { id: 'reassess', g: 'assess', label: 'Rounds — reassess both patients', mins: 2, run: function (S, api) {
        S.crits.serial = true;
        api.vitals({ rr: S.alexBreathing ? 8 : 0, avpu: 'U' });
        return 'Alex: ' + (S.alexBreathing ? 'breathing on his own, ragged but holding — you keep the airway open and stay on him.' : 'still needs every breath you can give him.') + ' Sam: pale, loud, burn covered' + (S.delegated ? ', Priya narrating everything back to you' : ', still waiting for someone to own him') + '. Loud is still a good sign.'; } },
    { id: 'end-hold', g: 'decide', label: 'Keep working — hand over when SAR arrives', mins: 2, run: function (S, api) {
        S.decided = 'hold';
        if (!S.called) api.flag('nocall', 'Nobody called. Resuscitation buys time — rescue is what it buys time FOR. (Lesson 13)');
        if (S.alexBreathing) return 'Alex breathes; you guard his airway and keep him warm while the storm drags itself east. When the helicopter finds your two-patient scene, it finds it organized: one rescuer per patient, a report ready.';
        if (S.breaths || S.cpr) return 'You keep it going, trading with Priya when your arms and lips give out. Nobody quits while help is coming. It was never your call to stop — and you never made it.';
        return 'You hold a scene where the salvageable patient never got a single breath. The storm passes. Some silences don’t.'; } },
    { id: 'end-quit', g: 'decide', label: 'Call it — he’s been down too long', mins: 1, when: function (S) { return S.checkedAlex && !S.alexBreathing; }, run: function (S, api) {
        S.decided = 'quit'; S.crits.keepon = false;
        api.flag('quit', 'Lightning rewrites the survival math: respiratory arrest outlasts cardiac arrest, and lightning patients come back after long resuscitation. You don’t call it in the field — you keep going until rescue takes over. (Lesson 14)');
        return 'You sit back on your heels in the rain. Priya stares at you. Somewhere below the cloud deck a helicopter can still fly — and the person it could still save is the one you just stopped breathing for.'; } },
    { id: 'end-carry', g: 'decide', label: 'Load Alex on your shoulders and carry him down', mins: 3, when: function (S) { return S.checkedAlex; }, run: function (S, api) {
        S.decided = 'carry'; if (!S.alexBreathing) S.crits.keepon = false;
        api.flag('carry', 'A body carry means minutes with no breaths and no compressions — resuscitation doesn’t travel on your shoulders. Below the crest was as far as moving needed to go; the medicine happens where you stand. (Lessons 14, 13)');
        return 'Fifty feet of staggering rock with Alex’s chest still the whole way. You put him down, gasping yourself, in a spot no better than the one you left.'; } }
  ],

  suggest: function (S) {
    if (!S.off) return ['off', 'sam', 'alex', 'spread', 'call'];
    if (!S.checkedAlex) return ['alex', 'sam', 'delegate', 'spread', 'call'];
    if (!S.alexBreathing && !S.breaths && !S.arrest) return ['breaths', 'delegate', 'call', 'sam', 'spread'];
    if (S.arrest && !S.cpr) return ['cpr', 'call', 'delegate', 'end-quit', 'spread'];
    return ['reassess', 'call', 'delegate', 'end-hold', 'end-quit', 'sam'];
  },

  crits: [
    ['off',     'Moved everyone off the high ground first', 'The storm was still shooting. Scene safety outranks medicine — patients included, fast and as straight as speed allows. (Lessons 14, 1)'],
    ['spread',  'Spread the group 20+ feet apart', 'One strike must not be able to take down everyone left standing. (Lesson 14)'],
    ['quiet',   'Triaged to the quiet patient first', 'Reverse triage: screaming proves an airway and breathing; silence is the siren. (Lesson 14)'],
    ['checked', 'Checked Alex’s breathing', 'Roll him as one unit, ten seconds at the mouth — the check that decides everything after. (Lessons 2, 3)'],
    ['vent',    'Started rescue breaths / CPR immediately', 'Lightning stalls the breathing engine and leaves the rest fixable — your lungs are the bridge. (Lessons 14, 3)'],
    ['deleg',   'Delegated Sam’s burn care with clear instructions', 'A bystander with one clear job is a second rescuer: cool the burn, cover it, keep him talking. (Lessons 4, 1)'],
    ['call',    'Called 911 with a two-patient report', '“Lightning, two patients” changes what gets launched. Say it early and say it exactly. (Lesson 13)'],
    ['serial',  'Reassessed both patients on rounds', 'Two patients means nobody gets parked and forgotten — the trend is the truth. (Lesson 2)'],
    ['keepon',  'Never gave up on the resuscitation', 'Lightning patients come back after long resuscitation. You don’t call it in the field. (Lesson 14)']
  ],
  links: [['../lessons/14_Water_Lightning.html', 'Lesson 14 — Water & Lightning'], ['../lessons/03_Airway.html', 'Lesson 3 — Airway & Breathing'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.alexBreathing) return 'Alex is breathing because somebody breathed for him. That is the entire logic of reverse triage, and you ran it.';
    if (S.crits.keepon && (S.breaths || S.cpr)) return 'You kept his chances alive until the people with a helicopter could take them over. That is the job.';
    return 'The quiet patient was the one you could save. Loud is an airway; silence is the siren.';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() +
      '<path d="M180,166 Q400,146 620,168" class="ln thin faint"/>' + SCN.trail() +
      '<path id="bolt" d="M600,8 L572,66 L592,68 L556,128 M556,128 l10,-4 M556,128 l2,-10" class="ln"/>' +
      '<g id="party">' +
        '<g id="alex-p">' + SCN.figProne('alexP', 430, 232, { accent: true }) + '</g>' +
        '<g id="alex-s" style="display:none;">' + SCN.figSupine('alexS', 430, 232, { accent: true }) + '</g>' +
        SCN.figSit('samF', 340, 232) + SCN.mark('samburn', 352, 218) +
        '<g id="priya-g">' + SCN.figStand('priyaF', 292, 226) + '</g>' +
      '</g>',
      { sky: 'storm', label: 'Two hikers down on a stormy ridge — one screaming and clutching an arm, one silent and still.' }),
    update: function (S) {
      var p = document.getElementById('party');
      if (p) p.setAttribute('transform', S.off ? '' : 'translate(-30 -64)');
      var pr = document.getElementById('priya-g');
      if (pr) pr.setAttribute('transform', S.spreadOut ? 'translate(-70 0)' : '');
      SCN.show('bolt', !S.off);
      SCN.show('alex-p', !S.rolled); SCN.show('alex-s', S.rolled);
      SCN.show('samburn', S.samSeen || S.delegated);
    }
  }
};
