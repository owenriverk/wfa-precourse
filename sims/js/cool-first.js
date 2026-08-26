/* Cool First — heat stroke: cool now, right here, with what you have. */
window.WFA_SCENARIO = {
  nlp: { soak: 'pour water|douse|wet him down', mental: 'name|orientation|confused' },
  env: '95°F · noon · no shade worth the name',
  brief: '<p>Ridge walk with your friend Dev — a mile of bald granite that bakes from above and below. He set the pace all morning. Now he’s weaving like the trail is moving, and when you ask how he’s doing he says the switchbacks are “full of bees.” There are no bees.</p><p>Between you: three liters of water, lunch, a sun shirt, a foam sit-pad. One squat boulder throws the only shade in sight. The car is a mile downhill. Your phone has one bar.</p>',
  startText: 'Dev stops and sways on his pole. His face is flushed, and the back of his shirt — soaked through an hour ago — has gone dry. "We should — the thing is —" He loses the sentence halfway.',
  state: { stopped: false, shaded: false, stripped: false, soaked: false, fanned: false,
           gaveDrink: false, mentalChecked: false, skinChecked: false, coolMin: 0, worse: false, improved: false },

  tick: function (S, api) {
    if (S.soaked) S.coolMin += S.fanned ? 2 : 1;
    if (!S.soaked && S.t >= 8 && !S.worse) {
      S.worse = true;
      api.log('event', 'Dev stops answering. Eyes open, nobody home — he swats vaguely when you squeeze his shoulder. He is cooking, and the fix is not in your first aid kit. It’s in your water bottles.');
    }
    if (!S.soaked && S.t >= 16 && !S.shudder) {
      S.shudder = true;
      api.log('event', 'A long shudder rolls through him — the kind that comes right before a seizure. Water and moving air. Now.');
    }
    if (S.coolMin >= 10 && !S.improved) {
      S.improved = true;
      api.log('event', 'Dev blinks like a man surfacing. "Why am I… soaked?" He knows his name. He knows yours. The wet shirt and the moving air are doing exactly what they’re supposed to.');
    }
  },
  chips: function (S) { return [['Cooling', S.soaked ? (S.fanned ? 'wet + fanning' : 'wet, still air') : 'NONE', !S.soaked]]; },

  actions: [
    { id: 'stop', g: 'treat', label: 'Stop him — all exertion ends right now', mins: 1, once: true, run: function (S) {
        S.stopped = true; S.crits.stop = true;
        return 'You take his pole and park him. He argues with somebody who isn’t you, then folds. Working muscle is a furnace — every step from here is heat he makes and can’t shed.'; } },
    { id: 'mental', g: 'assess', label: 'Check his head — name, place, day', mins: 1, run: function (S, api) {
        if (S.mentalChecked && S.soaked) S.crits.recheck = true;
        S.mentalChecked = true;
        if (S.skinChecked) S.crits.recognize = true;
        if (S.improved) { api.vitals({ avpu: 'A' }); return 'Name, trail, day — all three, first try. His head is coming back as his temperature drops. Keep the water and air going; the brain is your thermometer.'; }
        if (S.worse) { api.vitals({ avpu: 'P' }); return 'He doesn’t answer. A hard shoulder-squeeze gets a flinch and nothing else. P on AVPU — his brain has gone from scrambled to shutting doors.'; }
        api.vitals({ avpu: 'A, confused' });
        return 'He knows his name. Thinks it’s Tuesday — close. Thinks this is the lake trail — it is not. A grown man who can’t keep the day of the week isn’t "tired." That’s an altered patient.'; } },
    { id: 'skin', g: 'assess', label: 'Feel his skin — forehead, chest', mins: 1, once: true, run: function (S, api) {
        S.skinChecked = true;
        if (S.mentalChecked) S.crits.recognize = true;
        api.vitals({ skin: 'hot, mostly dry' });
        return 'Hot. Rock-in-the-sun hot — flushed, and barely damp on a day he should be soaked through. Hot plus altered has exactly one name, and it isn’t "heat exhaustion." Treatment starts this minute.'; } },
    { id: 'shade', g: 'treat', label: 'Move him into the boulder’s shade, off the hot rock', mins: 2, once: true, run: function (S) {
        S.shaded = true; S.crits.shade = true;
        return 'Twenty feet of trail buys the only shade on the ridge. You lay him back against the packs with the sit-pad under him, so the griddle he’s been standing on stops voting.'; } },
    { id: 'strip', g: 'treat', label: 'Strip him — shirt open, hat off, boots off, everything loose', mins: 1, once: true, run: function (S) {
        S.stripped = true; S.crits.strip = true;
        return 'Skin to the air. Every layer he’s wearing is insulation working for the wrong team.'; } },
    { id: 'soak', g: 'treat', label: 'Soak him — drench head, neck, chest, and the shirt', mins: 2, once: true, run: function (S) {
        S.soaked = true; S.crits.soak = true;
        return 'You pour like water is for spending: head, neck, armpits, chest, shirt back on wet. Saving it to drink later is saving it for a patient who may not be conscious later. In air this dry, evaporation is the best cooler you own.'; } },
    { id: 'fan', g: 'treat', label: 'Fan him — big steady strokes with the sit-pad', mins: 3, run: function (S) {
        S.fanned = true;
        if (S.soaked) { S.crits.fan = true; return 'You fan the wet skin in long strokes and can almost watch it work — a swamp cooler with a patient inside. Trade arms when you tire. Don’t stop.'; }
        return 'You fan dry skin, which mostly rearranges warm air. Wet him down first and this becomes a machine.'; } },
    { id: 'drink', g: 'treat', label: 'Get water into him — he must be dehydrated', mins: 2, once: true, run: function (S, api) {
        S.gaveDrink = true;
        api.flag('drink', 'An altered patient gets nothing by mouth — he can’t guard his own airway, and heat stroke isn’t mainly a water shortage. Pour the water on him, not in him, until his head clears. (Lesson 8)');
        return 'You tip the bottle to his lips. He coughs half of it down his chin and chokes on the rest — his swallow is as scrambled as everything else upstairs.'; } },
    { id: 'call', g: 'ask', label: 'Call 911 — heat stroke on the ridge', mins: 4, once: true, run: function (S) {
        S.crits.call911 = true;
        return 'One bar holds. Location, one patient, hot and altered — the words "heat stroke" move you up their list. They’re coming to you. Your job until then is water and air, and you say so out loud so it stays true.'; } },
    { id: 'vitals', g: 'assess', label: 'Take a full set of vitals', mins: 3, run: function (S, api) {
        var hr = S.improved ? 102 : (S.worse ? 132 : 122), rr = S.improved ? 18 : (S.worse ? 26 : 22);
        api.vitals({ hr: hr, rr: rr, avpu: S.improved ? 'A' : (S.worse ? 'P' : 'A, confused'), skin: S.soaked ? 'hot, wet (by design)' : 'hot, dry' });
        return 'Pulse ' + hr + ', breathing ' + rr + '. Logged with the time — one set is a snapshot, two are a trend.'; } },

    { id: 'end-cool', g: 'decide', label: 'Hold here — cool him until his head clears, meet SAR', mins: 5, run: function (S) {
        S.decided = 'cool'; S.crits.npo = !S.gaveDrink; S.crits.coolfirst = S.soaked;
        if (S.improved) return 'You keep the rotation going — pour, fan, check his head — and he keeps coming back, sentence by sentence. When SAR tops the ridge they find a wet, annoyed, talking patient. "Best field cooling we’ve seen this summer," one says, and means it.';
        if (S.soaked) return 'You hold and keep cooling. It hasn’t caught up yet — but water and air are working on the only problem that kills today, right where he lies.';
        return 'You hold, but holding isn’t cooling. Shade slows the damage; only water and moving air undo it, and his brain stays at temperature while you wait.'; } },
    { id: 'end-walk', g: 'decide', label: '"It’s one mile." Walk him down to the car', mins: 2, run: function (S, api) {
        S.decided = 'walk'; S.crits.npo = !S.gaveDrink;
        api.flag('walked', 'Cool first, move second. Walking is exertion, and exertion makes the exact heat you were supposed to be dumping. The car has air conditioning; the boulder had everything that mattered. (Lessons 8, 13)');
        return 'He makes it farther than he should — grit was never his problem. At the half-mile mark his legs quit, his back arches, and he seizes in the trail dirt: car ten minutes away, help thirty, and all your water uphill behind you.'; } },
    { id: 'end-rest', g: 'decide', label: 'He’s just bonked — snack, rest, he’ll rally', mins: 3, run: function (S, api) {
        S.decided = 'rest'; S.crits.npo = !S.gaveDrink;
        api.flag('bonk', 'Hot day, hot dry skin, altered mental status — that’s heat stroke, not a bonk and not "heat exhaustion." Exhaustion doesn’t take the day of the week with it. (Lesson 8)');
        return 'Fifteen minutes of "rest" later he isn’t rallying, he’s drifting — and the head start you had is spent.'; } }
  ],

  suggest: function (S) {
    if (!S.stopped) return ['stop', 'mental', 'skin', 'drink', 'shade', 'end-walk'];
    if (!S.shaded) return ['shade', 'skin', 'strip', 'soak', 'drink', 'end-walk'];
    if (!S.soaked) return ['soak', 'strip', 'fan', 'call', 'drink', 'end-walk'];
    return ['fan', 'mental', 'call', 'vitals', 'end-cool', 'end-walk'];
  },

  crits: [
    ['recognize', 'Put hot + altered together and called it heat stroke', 'Confusion on a hot day is a brain at temperature, not a bad attitude. Altered plus hot equals heat stroke, and treatment starts that minute. (Lesson 8)'],
    ['stop', 'Stopped all exertion immediately', 'Working muscle is a furnace. The first dose of treatment is standing still. (Lesson 8)'],
    ['shade', 'Got him shaded and off the hot ground', 'The sun above and the rock below were both still heating him. Take both off the table. (Lesson 8)'],
    ['strip', 'Stripped extra layers', 'Clothing is insulation, and the insulation was working for the fever. (Lesson 8)'],
    ['soak', 'Drenched him — head, neck, torso', 'Cool first, with whatever you have, right where you are. Water on skin is the strongest tool you carry. (Lesson 8)'],
    ['fan', 'Fanned the wet skin to force evaporation', 'Wet plus wind is a swamp cooler; either alone is a fraction of the effect. (Lesson 8)'],
    ['npo', 'Kept drinks out of an altered patient', 'He can’t guard his airway, and heat stroke isn’t fixed from the inside. Nothing by mouth until his head clears. (Lesson 8)'],
    ['recheck', 'Re-checked his head — mental status as the cooling gauge', 'The brain is the organ under attack, so the brain is the thermometer. Clearing speech means the cooling is winning. (Lesson 8)'],
    ['call911', 'Called 911 early', 'Heat stroke is a hospital problem you start fixing in the field. Make the call while you still have a head start. (Lessons 8, 13)'],
    ['coolfirst', 'Cooled FIRST, then worked the evacuation', 'The car doesn’t treat heat stroke; water and air do, and they were already in your hands. Cool where they drop, then move. (Lessons 8, 13)']
  ],
  links: [['../lessons/08_Heat.html', 'Lesson 8 — Heat Illness'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation'], ['../lessons/02_Patient_Assessment.html', 'Lesson 2 — Patient Assessment']],
  outcome: function (S) {
    if (S.decided === 'walk') return 'The half-mile mark is where "almost to the car" became a seizure in the dirt.';
    if (S.improved) return 'You turned his brain back on with a wet shirt, a foam pad, and moving air. That’s the whole lesson.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.trail() +
      '<ellipse cx="580" cy="235" rx="42" ry="7" style="fill:#4A4433;opacity:0.16"/>' +
      SCN.boulder(520, 232, 38) +
      '<g id="pt-up">' + SCN.figStand('dev', 300, 228, { accent: true, hat: true }) + '</g>' +
      '<g id="pt-down" style="display:none;">' + SCN.figSit('dev2', 580, 230, { accent: true }) + '</g>' +
      '<g id="wet1" style="display:none;"><path d="M290,168 l0,6 M301,164 l0,6 M312,169 l0,6" class="ln thin"/></g>' +
      '<g id="wet2" style="display:none;"><path d="M568,180 l0,6 M579,176 l0,6 M590,181 l0,6" class="ln thin"/><path d="M566,206 q12,5 24,0" class="ln thin faint"/></g>' +
      '<g id="fanlines" style="display:none;"><path d="M610,198 q9,9 0,18 M620,193 q12,12 0,24" class="ln thin faint"/></g>',
      { sky: 'noon', label: 'A hiker wobbling on a bare ridge at noon, one boulder of shade nearby.' }),
    update: function (S) {
      SCN.show('pt-up', !S.shaded);
      SCN.show('pt-down', S.shaded);
      SCN.show('wet1', S.soaked && !S.shaded);
      SCN.show('wet2', S.soaked && S.shaded);
      SCN.show('fanlines', S.fanned && S.shaded);
    }
  }
};
