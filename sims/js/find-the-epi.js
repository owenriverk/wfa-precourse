/* Find the Epi — anaphylaxis: epinephrine first and early, and know where it lives before lunch. */
window.WFA_SCENARIO = {
  env: '68°F · sunny · lunch ledge below the crag',
  brief: '<p>Climbing day, four of you, lunch spread on the slabs below the crag. Priya is mid-sandwich when a bee gets her on the forearm. She’s allergic — she told everyone at the trailhead — and her twin-pack of epinephrine auto-injectors is in somebody’s pack. Nobody is sure whose, because the group gear got shuffled in the parking lot.</p><p>You have three packs, a group first aid kit with antihistamine tablets, and a phone with service. The trailhead is forty minutes down an easy trail.</p>',
  startText: 'Priya yelps and swats. There’s a stinger in her forearm and a red welt already rising. "OK. So. I’m allergic — allergic-allergic." She says it calmly, which somehow makes it worse. "Someone has my kit."',
  state: { searched: false, epi: false, epiT: 0, second: false, benadryl: false, watched: false, called: false,
           flat: false, wheeze: false, stridor: false, rebound: false, improved: false, examined: false, stingerOut: false },

  tick: function (S, api) {
    if (S.t === 2 && !S.epi) api.log('event', 'Red welts are blooming up Priya’s forearm and onto her neck. She’s scratching and making jokes. The jokes are a little forced.');
    if (S.t === 5 && !S.epi) { S.wheeze = true; api.log('event', 'A whistle rides the top of each breath now, and the jokes have stopped. Skin plus breathing: two systems.'); }
    if (S.t === 9 && !S.epi) api.log('event', 'Her voice is thinning — words squeezed through a narrowing pipe. She leans forward onto her knees to breathe.');
    if (S.t === 10 && S.benadryl && !S.epi) api.flag('adjunct-alone', 'Antihistamines work on skin, over an hour. They do nothing in minutes, and nothing for an airway. Benadryl-and-watch is how anaphylaxis gets ahead of you. (Lesson 10)');
    if (S.t === 13 && !S.epi) { S.stridor = true; api.log('event', 'A high, tight note on the inhale — stridor. Her lips look wrong and she’s spending words one at a time.'); }
    if (S.t === 17 && !S.epi) api.log('event', 'She’s sagging against the pack between breaths, answers gone to nods. You are watching the window close.');
    if (S.epi && !S.improved && S.t >= S.epiT + 2) {
      S.improved = true; var had = S.wheeze; S.wheeze = false; S.stridor = false;
      api.log('event', had ? 'The whistle backs off. Her shoulders drop an inch, color comes back, and she takes her first full breath in a while. Epinephrine works in minutes — which is why it goes first.'
                           : 'The welts stop advancing and start to fade. She’s breathing easy and mildly embarrassed, which is the best outcome epinephrine sells.');
    }
    if (S.epi && S.improved && !S.second && !S.rebound && S.t >= S.epiT + 8) {
      S.rebound = true; S.wheeze = true;
      api.log('event', 'The welts are creeping back up her neck and the whistle is back on the exhale. The first dose bought minutes, not the afternoon.');
    }
  },
  chips: function (S) {
    var c = [['Since sting', S.t + ' min', !S.epi && S.t >= 5]];
    if (S.epi) c.push(['Since epi', (S.t - S.epiT) + ' min', !!S.rebound]);
    return c;
  },

  actions: [
    { id: 'exam', g: 'assess', label: 'Look at her — skin, breathing, count the systems', mins: 1, run: function (S) {
        S.examined = true;
        if (S.t >= 5 || S.wheeze || S.epi) S.crits.recognize = true;
        if (S.stridor) return 'Hives to her collarbones, stridor on the inhale, single-word answers. This stopped being a maybe a long time ago.';
        if (S.rebound) return 'The welts are back on the march and the whistle is back. Two systems, round two — the first dose is wearing off ahead of the allergy.';
        if (S.improved) return 'Welts fading, breathing easy, full sentences. Better is not the same as done — epi wears off, and allergies don’t hurry.';
        if (S.wheeze) return 'Welts up the arm and neck — and a whistle riding each breath. Skin plus breathing is two systems, and two systems is anaphylaxis. That word comes with orders: epinephrine, now.';
        if (S.t >= 2) return 'Red welts spreading up the forearm, past the elbow. One system so far — but you know her history, and anaphylaxis rarely sends a second warning this polite.';
        return 'A sting welt and a scared, steady patient. Nothing else yet — "yet" being the word to plan around.'; } },
    { id: 'stinger', g: 'treat', label: 'Get the stinger out — scrape it, fast', mins: 1, once: true, run: function (S) {
        S.stingerOut = true;
        return 'Fingernail scrape and it’s gone. Speed beats method — the sac keeps pumping venom as long as it’s parked in her arm. Ten seconds well spent, and now the sting itself is the least of your problems.'; } },
    { id: 'search', g: 'ask', label: 'Dump the packs — WHOSE pack has her kit?', mins: 2, once: true, run: function (S) {
        S.searched = true; S.crits.find = true;
        return 'Three packs upended on the slab. It surfaces in the third — lid pocket, under a pair of belay gloves: a twin-pack of auto-injectors that’s been riding anonymously since the parking lot. Two minutes you’d pay anything to get back. Epi you can’t put your hand on in one move is epi you don’t have.'; } },
    { id: 'epi', g: 'treat', label: 'Epinephrine — her auto-injector, outer thigh, now', mins: 1, once: true, when: function (S) { return S.searched; }, run: function (S) {
        S.epi = true; S.epiT = S.t; S.crits.thigh = true; S.crits.fast = S.t <= 12;
        if (S.examined) S.crits.recognize = true;
        return 'Her prescription, her hands on the drill, yours steadying her wrist. Blue cap off, orange tip pressed hard into the outer thigh, straight through the pants. Click, hold, ten. She yells. Done. Nothing else on this ledge does what that just did.'; } },
    { id: 'benadryl', g: 'treat', label: 'Antihistamine tablets from the group kit', mins: 2, once: true, run: function (S) {
        S.benadryl = true;
        if (S.epi) { S.crits.adjunct = true; return 'On top of epinephrine — good. The antihistamine mops up skin and itch over the next hour. It’s the cleanup crew, and the fire is already out.'; }
        return 'She chews them down. Twenty-five milligrams of maybe-within-the-hour, against an airway problem measured in minutes. If this is the main plan, it isn’t a plan.'; } },
    { id: 'sit', g: 'treat', label: 'Sit her up against a pack — position of comfort', mins: 1, run: function (S) {
        S.flat = false; S.crits.position = true;
        return 'She settles upright, forearms on her knees. Someone working to breathe sits and leans forward on their own — the urge to sit up is data. Your job is to stop helpful people from lying her down.'; } },
    { id: 'flat', g: 'treat', label: 'Lay her flat, legs up — treat for shock', mins: 1, once: true, run: function (S, api) {
        S.flat = true;
        if (S.wheeze || S.stridor) {
          api.flag('flat', 'Legs-up is for the shocky patient who isn’t fighting for air. Flatten a patient with a swelling airway and the breathing gets harder. She sits, leaning forward, in the position her own body picks. (Lessons 5, 10)');
          return 'You get her halfway down before she fights you off, panicked — flat makes the whistle louder. Her body already chose the right position. Listen to it.';
        }
        return 'She lies back, itchy but breathing fine — for now. If her breathing tightens she’ll come back up to sitting, and she won’t ask permission.'; } },
    { id: 'call', g: 'ask', label: 'Call 911 — say the word "anaphylaxis"', mins: 3, once: true, run: function (S) {
        S.called = true; S.crits.call911 = true;
        return '"Anaphylaxis" is a word dispatchers move for. You name the crag, the approach trail, the forty-minute walk. Epi buys time; it doesn’t end the emergency — everyone who gets epi gets evaluated, no exceptions for feeling better.'; } },
    { id: 'second', g: 'treat', label: 'Second injector — the first dose isn’t holding', mins: 1, once: true, when: function (S) { return S.epi && !S.second && S.t >= S.epiT + 5; }, run: function (S) {
        if (S.improved && !S.rebound) return { text: 'She’s holding — breathing easy, welts fading. You keep it in your pocket instead. Right reflex, wrong minute: the second dose is for five to fifteen minutes of not-better.', acted: false };
        S.second = true; S.crits.second = true; S.rebound = false; S.wheeze = false; S.stridor = false; S.improved = true;
        return 'Second dose, other thigh, and the whistle backs down again. This is why they sell them in pairs — one dose buys minutes, not the afternoon.'; } },
    { id: 'watch', g: 'ask', label: '"I’m okay, really." Give it a minute and watch', mins: 3, once: true, run: function (S, api) {
        S.watched = true;
        api.flag('waitsee', '"Wait and see" is a plan with anaphylaxis on one side and hope on the other. Hives plus any breathing involvement is epi now — the early dose is the one that works best. (Lesson 10)');
        return 'You give it a minute. Anaphylaxis takes the minute and spends it against her.'; } },
    { id: 'vitals', g: 'assess', label: 'Take a full set of vitals', mins: 3, run: function (S, api) {
        var hr = S.stridor ? 128 : (S.wheeze ? 116 : (S.improved ? 92 : 104));
        var rr = S.stridor ? 30 : (S.wheeze ? 24 : (S.improved ? 16 : 18));
        api.vitals({ hr: hr, rr: rr, avpu: 'A', skin: (S.t >= 2 && (!S.improved || S.rebound)) ? 'flushed, hives' : 'pink, warm' });
        return 'Pulse ' + hr + ', breathing ' + rr + '. Written down with the time — the trend is the truth.'; } },

    { id: 'end-meet', g: 'decide', label: 'Walk her out slow — meet EMS on the approach trail', mins: 4, run: function (S, api) {
        S.decided = 'meet'; S.crits.nowait = S.epi && !S.watched;
        if (S.epi && (S.second || !S.rebound)) S.crits.second = true;
        if (!S.epi) { api.flag('noepi', 'She never got epinephrine — the one medicine that reverses anaphylaxis. Everything else on the ledge was an accessory. Find the epi, give the epi. (Lesson 10)');
          return 'You start down with her breathing getting smaller behind you, packs abandoned, everyone quiet. The medicine that fixes this walked out in a lid pocket, unused.'; }
        if (!S.called) return 'You walk her down slow, spare injector in your jacket pocket, eyes on her breathing — and flag down help at the trailhead. It works, but nobody was coming to meet you. A call would have had them moving forty minutes ago.';
        return 'You carry her pack and set an easy pace, spare injector in your jacket pocket, eyes on her breathing. EMS meets you at the junction. Epi bought the time — you spent it moving toward help.'; } },
    { id: 'end-stay', g: 'decide', label: 'Stay put and monitor — let EMS come to her', mins: 4, run: function (S, api) {
        S.decided = 'stay'; S.crits.nowait = S.epi && !S.watched;
        if (S.epi && (S.second || !S.rebound)) S.crits.second = true;
        if (!S.epi) { api.flag('noepi', 'She never got epinephrine — the one medicine that reverses anaphylaxis. Everything else on the ledge was an accessory. Find the epi, give the epi. (Lesson 10)');
          return 'You keep her company and keep watching, which is all you have left, because the one medicine that reverses this is still lost in a lid pocket three feet away.'; }
        if (!S.called) { api.flag('stayblind', 'Staying put without calling anyone is waiting for a rescue nobody knows to send. The phone had service the whole time. (Lesson 13)');
          return 'You settle in to monitor — but nobody is coming, because nobody was told. Staying put only works when someone knows to come to you.'; }
        return 'You keep her sitting, keep the second injector in reach, and narrate welts and breath sounds to the dispatcher until the crew walks up the trail. Monitoring is a job; you did it like one.'; } },
    { id: 'end-fine', g: 'decide', label: 'She looks great — call it off, climbing’s back on', mins: 2, when: function (S) { return S.improved; }, run: function (S, api) {
        S.decided = 'fine'; S.crits.nowait = S.epi && !S.watched;
        api.flag('backon', 'Epinephrine wears off before anaphylaxis has to. Rebounds are real, and a pitch of rock is a bad place to relearn that. Everyone who gets epi gets evaluated — the ambulance stays called. (Lessons 10, 13)');
        return 'Half a rope-length later there’s a familiar whistle on the exhale, and you get to run this entire problem again — on a ledge, with one injector left.'; } }
  ],

  suggest: function (S) {
    if (!S.searched) return ['search', 'stinger', 'exam', 'benadryl', 'watch', 'sit'];
    if (!S.epi) return ['epi', 'exam', 'sit', 'benadryl', 'watch', 'flat'];
    if (S.rebound) return ['second', 'call', 'exam', 'sit', 'end-stay', 'end-meet'];
    return ['call', 'sit', 'benadryl', 'exam', 'end-meet', 'end-fine'];
  },

  crits: [
    ['recognize', 'Recognized anaphylaxis — two or more systems', 'Hives are one system; add breathing (or gut, or a sinking blood pressure) and it’s anaphylaxis. The name matters because it comes with orders. (Lesson 10)'],
    ['find', 'Went after the epi immediately', 'The auto-injector is the whole treatment plan, and it was lost in a lid pocket. Know where the epi lives before lunch — every trip, every party member. (Lessons 10, 15)'],
    ['fast', 'Gave epinephrine without delay', 'Early epi is the dose that works best. Minutes of hesitation are what let stridor and rebounds off the leash. (Lesson 10)'],
    ['thigh', 'Helped her use her own auto-injector — outer thigh, hold', 'Her prescription, her thigh, your steady hands: that’s the assist, and it’s squarely within your scope. (Lesson 10)'],
    ['call911', 'Called 911 early', 'Epi buys time; it doesn’t end the emergency. Everyone who gets epinephrine gets evaluated. (Lessons 10, 13)'],
    ['position', 'Kept her sitting — position of comfort', 'A patient working to breathe sits up and leans forward on her own. Don’t argue with a body that’s winning. (Lesson 10)'],
    ['adjunct', 'Used the antihistamine as an adjunct, after epi', 'Antihistamines polish off the skin symptoms over an hour. They are the cleanup crew, never the fire department. (Lesson 10)'],
    ['second', 'Ready with the second dose at 5–15 minutes', 'One dose buys minutes. If she isn’t better — or gets better and slides back — the second injector goes in. That’s why they come in pairs. (Lesson 10)'],
    ['nowait', 'No wait-and-see', 'With hives plus breathing trouble, "give it a minute" donates that minute to the allergy. (Lesson 10)']
  ],
  links: [['../lessons/10_Anaphylaxis.html', 'Lesson 10 — Anaphylaxis'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation'], ['../lessons/12_Bites_Stings.html', 'Lesson 12 — Bites & Stings']],
  outcome: function (S) {
    if (!S.epi) return 'Everything on that ledge was optional except the epinephrine.';
    if (S.decided === 'fine') return 'The rebound found you a rope-length up. It always gets a vote.';
    if (S.crits.fast) return 'Found in two minutes, given in one — the whole afternoon turned on knowing which pack to open.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.trail() + SCN.trees([60, 100], 190) +
      '<polygon points="700,232 758,92 810,112 810,232" class="o w"/><path d="M726,182 l22,-8 M714,210 l24,-9" class="ln thin faint"/>' +
      '<rect x="380" y="216" width="26" height="16" rx="5" class="o w2"/><rect x="418" y="218" width="24" height="14" rx="5" class="o w2"/><rect x="452" y="215" width="26" height="17" rx="5" class="o w2"/>' +
      '<g id="epipen" style="display:none;"><rect x="466" y="199" width="5" height="15" rx="2.5" class="o a"/></g>' +
      '<g id="priya-sit">' + SCN.figSit('priya', 540, 228, { accent: true }) +
      SCN.mark('hivesA', 538, 199) + SCN.mark('hivesB', 551, 213) + '</g>' +
      '<g id="priya-flat" style="display:none;">' + SCN.figSupine('priya2', 510, 232, { accent: true }) + SCN.mark('hivesC', 512, 216) + '</g>' +
      SCN.figKneel('rowan', 600, 230) + SCN.figStand('marc', 660, 226, {}),
      { label: 'A climbing group at lunch below the crag — one climber stung, packs scattered.' }),
    update: function (S) {
      var hivesOn = S.t >= 2 && (S.rebound || !S.improved);
      SCN.show('priya-sit', !S.flat);
      SCN.show('priya-flat', S.flat);
      SCN.show('hivesA', hivesOn); SCN.show('hivesB', hivesOn); SCN.show('hivesC', hivesOn);
      SCN.show('epipen', S.searched);
    }
  }
};
