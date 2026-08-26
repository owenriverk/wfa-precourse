/* The Burrito — hypothermia wrap: the floor matters most, and quiet is not better. */
window.WFA_SCENARIO = {
  nlp: { sugar: 'food|eat|snack|something sweet' },
  env: '54°F air · 50°F water · wind down the lake',
  brief: '<p>Alpine lake, early season. Your friend Theo caught an edge playing in the wind chop, wet-exited, and swam his boat the last forty yards. Now he’s on the gravel beach on all fours, shivering so hard his elbows are buckling — three, maybe four minutes in fifty-degree water, and every stitch on him is soaked.</p><p>On the beach: your dry bags (spare puffy, hat, tarp), two foam pads, three PFDs, a thermos of lukewarm sweet tea, someone’s flask, and a phone that gets one bar from a rock up the shore.</p>',
  startText: 'Theo crawls clear of the waterline and folds onto the gravel, shaking like a paint mixer. "C-c-cold" is the whole sentence. The wind is doing the lake’s work for it.',
  state: { winded: false, dry: false, padded: false, wrapped: false, headOn: false, fed: false,
           rubbed: false, monitored: 0, shiverStopped: false, recovering: false },

  tick: function (S, api) {
    var burrito = S.dry && S.padded && S.wrapped && S.headOn;
    if (S.t === 6 && !S.dry) api.log('event', 'The shivering is getting wilder, not calmer. Every minute in wet clothes is heat he doesn’t have, leaving through fabric.');
    if (S.t >= 14 && !burrito && !S.shiverStopped) {
      S.shiverStopped = true;
      api.log('event', 'The shivering winds down… and stops. He goes still and quiet, words coming out flat and slow. Good news? Be very sure before you answer that.');
    }
    if (S.t >= 18 && burrito && !S.shiverStopped && !S.recovering) {
      S.recovering = true;
      api.log('event', 'The shivering is easing the right way — slower and softer while his voice steadies. He wants to know who’s rescuing his boat. Nobody is rescuing his boat.');
    }
  },
  chips: function (S) { return [['Shivering', S.shiverStopped ? 'STOPPED' : (S.recovering ? 'easing — warming' : 'violent'), !!S.shiverStopped]]; },

  actions: [
    { id: 'resp', g: 'assess', label: 'Get his story — name, how long in the water', mins: 1, once: true, run: function (S, api) {
        api.vitals({ avpu: 'A' });
        return '"Th-th-three minutes. M-maybe f-four." He knows his name, the lake, and exactly how cold he is. Bitten-in-half words, but all there. Violent shivering is ugly, loud — and good news: the furnace still runs. Your job is to stop the heat it makes from leaking out.'; } },
    { id: 'wind', g: 'treat', label: 'Move him behind the boulder, out of the wind', mins: 2, once: true, run: function (S) {
        S.winded = true; S.crits.wind = true;
        return 'Twenty yards of beach and the wind becomes weather happening to other people. On wet skin, moving air is the lake’s little brother — it strips heat almost as fast.'; } },
    { id: 'strip', g: 'treat', label: 'Wet clothes off — all of them, now', mins: 2, once: true, run: function (S) {
        S.dry = true; S.crits.dry = true;
        return 'No dignity in hypothermia. Paddle jacket, fleece, base layers — wrung out and off, your spare puffy on. Wet fabric was pulling heat out of him around twenty-five times faster than air.'; } },
    { id: 'pad', g: 'treat', label: 'Build a floor — pads, PFDs, empty packs under him', mins: 2, once: true, run: function (S) {
        S.padded = true; S.crits.under = true;
        return 'Two PFDs, both foam pads, an emptied dry bag: a floor. Beach gravel is a heat thief with all night to work — the insulation underneath the patient matters most.'; } },
    { id: 'wrap', g: 'treat', label: 'Wrap the burrito — tarp outside, torso AND legs in', mins: 3, once: true, run: function (S) {
        S.wrapped = true; S.crits.wrap = true;
        return 'Dry insulation against him, then the tarp around everything as a vapor barrier — wrapped past his feet and snugged so the wind can’t pick the lock. Legs are half the patient; a torso-only wrap is half a burrito.'; } },
    { id: 'head', g: 'treat', label: 'Hat on, hood up — cover head and neck', mins: 1, once: true, run: function (S) {
        S.headOn = true; S.crits.head = true;
        return 'Warm hat, hood cinched, a spare layer scarfed around his neck. A bare head is a chimney; you just capped it.'; } },
    { id: 'sugar', g: 'treat', label: 'Calories — chocolate and the sweet tea, while he’s sharp', mins: 2, once: true, run: function (S) {
        if (S.shiverStopped) return { text: 'His swallow has gone slow and sloppy with the rest of him. Nothing by mouth now — the calorie window was open while he was still sharp, and it closed.', acted: false };
        S.fed = true; S.crits.sugar = true;
        return 'Emergency chocolate and half the thermos, sip by sip. Shivering burns fuel like a two-stroke — rewarming is work, and the work runs on sugar.'; } },
    { id: 'rub', g: 'treat', label: 'Rub his arms and legs hard — friction is heat', mins: 2, once: true, run: function (S, api) {
        S.rubbed = true;
        api.flag('rub', 'Rubbing pushes cold, pooled shell blood into the core and adds nothing to the furnace. Cold patients get gentle handling — insulation and calories do the work. (Lesson 9)');
        return 'You knock off when he yelps. The skin pinks up where you rubbed, and he is not one degree warmer where it counts.'; } },
    { id: 'booze', g: 'treat', label: 'A pull from the flask — antifreeze', mins: 1, once: true, run: function (S, api) {
        api.flag('booze', 'Alcohol opens the skin’s blood vessels — it feels warm precisely because it’s pouring core heat overboard. Worst drink on the beach. (Lesson 9)');
        return 'He takes the pull and glows for about ninety seconds. That glow is core heat leaving through his skin. The flask goes back in the bag.'; } },
    { id: 'monitor', g: 'assess', label: 'Read the gauge — shivering, speech, grip', mins: 1, run: function (S) {
        S.monitored++; if (S.monitored >= 2) S.crits.monitor = true;
        if (S.shiverStopped) return 'Still not shivering, still slow, words coming out flat. That silence is not comfort — the furnace quit. He just moved from "cold" to "fragile": gentle hands, no walking, and the evacuation math changes.';
        if (S.recovering) return 'Slower, softer shivers, steadier voice, a joke about his boat. That’s the good version of quieting down: warming up, not running down.';
        return 'Still shaking hard, still answering fast. Furnace at full throttle. Check again in a few minutes — the change is the finding.'; } },
    { id: 'vitals', g: 'assess', label: 'Take a full set of vitals', mins: 3, run: function (S, api) {
        var hr = S.shiverStopped ? 64 : (S.recovering ? 84 : 108), rr = S.shiverStopped ? 10 : 18;
        api.vitals({ hr: hr, rr: rr, avpu: S.shiverStopped ? 'V' : 'A', skin: S.shiverStopped ? 'cold, pale, slack' : 'cold, pale' });
        return 'Pulse ' + hr + ', breathing ' + rr + '. One set is a snapshot — this gets a rematch in ten minutes, because the trend is the truth.'; } },

    { id: 'end-warm', g: 'decide', label: 'Hold the beach — rebuild him, then walk out together', mins: 5, run: function (S, api) {
        S.decided = 'warm'; S.crits.gentle = !S.rubbed;
        if (S.shiverStopped) {
          api.flag('walkout', 'Once the shivering stopped without rewarming, he stopped being a walk-out. Moderate hypothermia gets gentle handling, no walking, and rescue brought to it. (Lessons 9, 13)');
          return 'You stand him up and his legs abstain. Slow, clumsy, slurring — you lay him back in the wrap and start the call you could have made half an hour ago.';
        }
        S.crits.evac = true;
        return 'An hour of burrito, tea, and steadily improving complaints later, Theo is warm, fed, and walking out in the middle of the group — the boat left to the beach without one regret.'; } },
    { id: 'end-call', g: 'decide', label: 'Climb to the signal — get rescue coming to him', mins: 5, run: function (S) {
        S.decided = 'call'; S.crits.gentle = !S.rubbed; S.crits.evac = true;
        if (S.shiverStopped) return 'From the one-bar rock: location, patient, "cold-water swim, was shivering hard, now stopped." Dispatch does not treat that as a nap. A boat is coming down the lake; he stays wrapped, flat, and handled like glass until it lands.';
        return 'From the one-bar rock you give it clean: cold-water swim, shivering hard, wrapped and fed. SAR would rather turn a boat around than arrive late. The burrito holds while the cavalry rows.'; } },
    { id: 'end-paddle', g: 'decide', label: 'He’s stopped shivering — crisis over. Back on the water', mins: 2, when: function (S) { return S.shiverStopped; }, run: function (S, api) {
        S.decided = 'paddle'; S.crits.gentle = !S.rubbed;
        api.flag('quiet', 'Shivering that stops without rewarming is the patient getting worse — the furnace giving up, not the cold giving in. That silence upgrades the emergency; it never ends it. (Lesson 9)');
        return 'He moves like a man wading through syrup, fumbles the paddle twice, and misses his cockpit with his foot. Quiet was never the same as better, and the lake is right there, patient as ever.'; } }
  ],

  suggest: function (S) {
    if (!S.dry) return ['strip', 'wind', 'resp', 'rub', 'booze', 'pad'];
    if (!S.padded || !S.wrapped) return ['pad', 'wrap', 'head', 'rub', 'sugar', 'end-paddle'];
    if (!S.headOn || !S.fed) return ['head', 'sugar', 'monitor', 'booze', 'end-warm', 'end-call'];
    return ['monitor', 'vitals', 'end-warm', 'end-call', 'end-paddle'];
  },

  crits: [
    ['wind', 'Got him out of the wind', 'Wind strips heat off wet skin nearly as fast as the lake did. Shelter is treatment. (Lesson 9)'],
    ['dry', 'Got the wet clothes off', 'Wet fabric pulls heat around twenty-five times faster than air. No dignity in hypothermia. (Lesson 9)'],
    ['under', 'Built insulation UNDER him', 'The ground is the biggest heat thief on the beach — the layer beneath the patient matters most. (Lesson 9)'],
    ['wrap', 'Wrapped the burrito — vapor barrier, torso and legs', 'The tarp keeps wind and wet out of everything you built, and legs are half the patient. (Lesson 9)'],
    ['head', 'Covered his head and neck', 'A bare head is a chimney. Cap the chimney. (Lesson 9)'],
    ['sugar', 'Got calories in while he was still fully alert', 'Shivering burns fuel like a two-stroke. The furnace needs feeding — and the window closes if he dulls. (Lesson 9)'],
    ['monitor', 'Kept reading the gauge — shivering and his answers', 'Shiver status is the dashboard. Shivering that stops without rewarming is worsening, not improving. (Lesson 9)'],
    ['gentle', 'Handled him gently — no rubbing, no roughhousing', 'A cold heart is an irritable heart, and rough handling shoves cold shell blood into the core. (Lesson 9)'],
    ['evac', 'Matched the evacuation to how cold he actually was', 'A shivering patient who rewarms can walk out; one who went quiet gets rescue brought to him. (Lessons 9, 13)']
  ],
  links: [['../lessons/09_Cold.html', 'Lesson 9 — Cold Injuries'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.decided === 'paddle') return 'The lake got a second chance at him because quiet looked like recovery.';
    if (S.shiverStopped && S.decided === 'call') return 'He went quiet on your watch and you read it right: worse, not better. That reading was the save.';
    if (S.recovering) return 'A tarp, a foam pad, and a candy bar. The burrito is humble medicine that works.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.lake() + SCN.trees([680, 730, 770]) +
      '<path d="M60,222 q42,-15 86,0 q-44,10 -86,0 z" class="o w2"/><path d="M74,214 l14,-6" class="ln thin"/>' +
      SCN.boulder(560, 232, 36) +
      '<g id="theo-pos"><g class="shakeable">' +
      SCN.figSit('theo', 330, 230, { accent: true }) +
      SCN.padUnder('padg', 314, 231, 62) +
      SCN.blanketOver('wrapg', 312, 231, 68) +
      '<g id="hood" style="display:none;"><path d="M320,190 a8,8 0 0 1 16,0 l-1,4 l-14,0 z" class="o a2"/></g>' +
      '</g></g>',
      { label: 'A soaked kayaker shivering on a gravel beach, his swamped boat at the waterline.' }),
    update: function (S) {
      var g = document.getElementById('theo-pos');
      if (g) g.setAttribute('transform', S.winded ? 'translate(185 0)' : '');
      SCN.show('padg', S.padded); SCN.show('wrapg', S.wrapped); SCN.show('hood', S.headOn);
      SCN.cls('shiver2', !S.shiverStopped && !S.recovering);
      SCN.cls('shiver1', S.recovering && !S.shiverStopped);
      SCN.cls('cold', S.shiverStopped);
    }
  }
};
