/* Sharpie on the Leg — a rattlesnake bite, five miles out, and a group full of movie medicine. */
window.WFA_SCENARIO = {
  env: '91°F · sun and slickrock · five miles up the canyon',
  brief: '<p>Desert canyon dayhike, four of you, five miles from the trailhead. Stepping over a downed cottonwood, Marcus takes a rattlesnake strike above the ankle. The snake is coiled under the log, still rattling, and everyone in the group has a theory from a movie — knives, suction, ice, tourniquets — and they’re all saying them at once.</p><p>You have one bar of signal, a Sharpie in somebody’s pack, and shade close by.</p>',
  startText: 'Marcus hops back from the log swearing with real feeling, two punctures above his ankle already burning. The rattle keeps going. Tyler rolls up a sleeve: “You have to suck it out — I’ve seen it.” Kelsey digs for her frozen water bottle.',
  state: { away: false, calm: false, marked: false, markT: null, spread: false, grew: false,
           splinted: false, called: false, crits: { nomovie: true } },

  tick: function (S, api) {
    if (!S.away) {
      if (S.t === 3) api.log('event', 'The rattle keeps going under the log. Tyler leans in with his phone out. The snake does not enjoy fame.');
      if (S.t === 8) api.log('event', 'A strike at Tyler’s boot — a miss by inches. Everyone screams. It is still right there.');
    }
    if (S.marked && !S.spread && S.t >= S.markT + 8) {
      S.spread = true; S.grew = true;
      api.log('event', 'The shine and swelling have crossed your Sharpie line — a finger’s width past it and climbing. Time to draw the next one.');
    }
    if (S.t === 6) api.log('event', 'Marcus: “Okay, it’s really burning now.” His voice is a note higher than usual.');
    if (S.t === 14) api.log('event', 'Kelsey, quietly: “Should we be doing… more?” The group needs a captain more than the patient does.');
    if (S.t === 24 && S.called) api.log('event', 'Dispatch calls back: SAR is staging at the trailhead with a wheeled litter. They want your swelling timeline when they arrive.');
  },
  chips: function (S) { return [
    ['Snake', S.away ? 'left with its log' : 'RIGHT THERE', !S.away],
    ['Swelling', S.marked ? (S.spread ? 'PAST the line' : 'inside the line') : 'unmarked', !S.marked || S.spread]]; },

  actions: [
    { id: 'away', g: 'treat', label: 'Move everyone out of range, leave the snake alone', mins: 1, once: true, run: function (S) {
        S.away = true; S.crits.away = true;
        return 'You back the whole group out two snake-lengths and give the log to its owner. A rattler strikes about half its body length — nobody needs to test the estimate. The buzz winds down behind you.'; } },
    { id: 'calm', g: 'treat', label: 'Sit Marcus down — calm and still', mins: 2, once: true, run: function (S) {
        S.calm = true; S.crits.calm = true;
        return 'You sit him on a flat rock in the shade and hand him one job: be still. Panic pumps blood, and blood moves venom — calm is not bedside manner here, it’s dosing.'; } },
    { id: 'ring', g: 'treat', label: 'Rings off, watch off, boot laces loosened', mins: 2, once: true, run: function (S) {
        S.crits.ring = true;
        return 'Ring off — it already argues at the knuckle — watch off, laces opened wide. Everything that could strangle a swelling limb comes off while it still can.'; } },
    { id: 'mark', g: 'treat', label: 'Sharpie the swelling edge, write the time', mins: 1, once: true, run: function (S) {
        S.marked = true; S.markT = S.t; S.crits.mark = true;
        return 'A line at the edge of the redness, the time written beside it. The leg keeps its own chart now — any spread past that line is data you can read at a glance and hand to SAR.'; } },
    { id: 'remark', g: 'assess', label: 'Check the line — re-mark if it’s moved', mins: 1, when: function (S) { return S.marked; }, run: function (S) {
        if (!S.spread) return { text: 'Still inside the last line. Good. Check again in ten or fifteen — the interval is the information.', acted: false };
        S.spread = false; S.markT = S.t; S.crits.serial = true;
        return 'New line, new time. Two timestamped lines turn “it looks worse?” into “a finger’s width in twenty minutes” — the kind of sentence a hospital can act on.'; } },
    { id: 'splint', g: 'treat', label: 'Immobilize the leg, roughly heart level', mins: 3, once: true, run: function (S) {
        S.splinted = true; S.crits.still = true;
        return 'You sling the lower leg still against a rolled pad, riding about level with his heart, and say the rule out loud: this leg is done walking today. Muscle is a pump, and it isn’t pumping venom on your watch.'; } },
    { id: 'call', g: 'treat', label: 'Call 911 — request SAR', mins: 4, once: true, run: function (S) {
        S.called = true; S.crits.evac = true;
        return 'One bar carries it: rattlesnake bite above the ankle, time of the bite, swelling marked and tracked, patient calm and still, five miles up-canyon. Every snakebite evacuates now — antivenom lives in hospitals, not in anybody’s pack. SAR is moving.'; } },
    { id: 'monitor', g: 'assess', label: 'Vitals and a systemic check', mins: 3, run: function (S, api) {
        S.crits.watch = true;
        api.vitals({ hr: 102, rr: 18, avpu: 'A', skin: 'warm, sweaty' });
        return 'Pulse 102 — pain and adrenaline — breathing easy, talking sense. No swelling in the face or mouth, no metallic taste, no tingling lips. Shade, small sips of water, and the time written next to all of it.'; } },
    { id: 'photo', g: 'assess', label: 'Photograph the snake — from way back, on zoom', mins: 1, once: true, run: function () {
        return 'From well out of range, zoom doing the walking: one blurry photo of a coiled rattler. All the identification anyone needs, and nobody got closer to take it.'; } },
    { id: 'cut', g: 'treat', label: 'Cut an X over the bite and suck the venom out', mins: 3, once: true, run: function (S, api) {
        S.crits.nomovie = false;
        api.flag('cut', 'Cutting and sucking removes no meaningful venom, adds a contaminated wound to a limb about to swell, and puts venom in a second mouth. The movies lied. (Lesson 12)');
        return 'Two ragged cuts over punctures that were already doing their damage. What comes out: a little blood. What goes in: dirt, delay, and a story the ER will retell for years.'; } },
    { id: 'tq', g: 'treat', label: 'Tie a tourniquet above the bite', mins: 2, once: true, run: function (S, api) {
        S.crits.nomovie = false;
        api.flag('tq', 'A tourniquet dams venom into one concentrated pool and trades a sick leg for a dying one. Snake venom is not arterial bleeding. (Lesson 12)');
        return 'The bandana goes on tight. The foot pales; the burn concentrates instead of easing. You reconsider and take it off two minutes later, hoping the experiment was short enough.'; } },
    { id: 'ice', g: 'treat', label: 'Strap Kelsey’s frozen bottle on the bite', mins: 2, once: true, run: function (S, api) {
        S.crits.nomovie = false;
        api.flag('ice', 'Ice clamps down circulation in tissue the venom is already strangling — it deepens the local damage and helps nothing. (Lesson 12)');
        return 'The bottle numbs the skin and changes nothing underneath, while the tissue around the punctures collects a frostnip chaser.'; } },
    { id: 'catch', g: 'treat', label: 'Let Tyler bag the snake for the hospital', mins: 4, once: true, run: function (S, api) {
        S.crits.nomovie = false;
        api.flag('catch', 'The hospital does not need the snake — antivenom covers native pit vipers, and snake wrangling is how one patient becomes two. A zoomed photo is plenty. (Lessons 12, 1)');
        return 'Tyler gets the stuff sack within a yard of the log before the strike — another miss, by less this time. You call it off with your heart in your ears. The ER treats the patient in front of them, not the snake in a bag.'; } },
    { id: 'end-wait', g: 'decide', label: 'Keep him still, shaded, and marked — wait for SAR', mins: 2, run: function (S, api) {
        S.decided = 'wait';
        if (!S.called) api.flag('nocall', 'Settling in without telling anyone turns “wait for rescue” into “hope someone guesses.” The phone had a bar; the call was the move. (Lesson 13)');
        if (S.called) return 'You keep him shaded, still, and charted like a tide table. Two hours later the litter team rounds the bend — you hand them a patient and a timeline, which is exactly what antivenom decisions are made of.';
        return 'You keep him still and comfortable, and wait for rescuers nobody sent for. The canyon is quiet. Too quiet to count on.'; } },
    { id: 'end-walk', g: 'decide', label: 'He says he can walk — start the five miles out', mins: 2, run: function (S, api) {
        S.decided = 'walk'; S.crits.still = false;
        api.flag('walked', 'Five miles of walking turns the calf into a venom pump — bitten legs ride. Every snakebite evacuates on wheels, litters, or rotors now, not on the leg that got bit. (Lessons 12, 13)');
        return 'Half a mile in, Marcus is soaked through and the tight shine has climbed past where the second line would have been. You stop in the shade you never should have left, with two hard miles of “almost there” still ahead.'; } }
  ],

  suggest: function (S) {
    if (!S.away) return ['away', 'cut', 'calm', 'catch', 'tq', 'photo'];
    if (!S.calm) return ['calm', 'cut', 'ring', 'tq', 'ice', 'mark'];
    if (!S.marked) return ['mark', 'ring', 'splint', 'ice', 'call', 'monitor'];
    if (S.spread) return ['remark', 'call', 'splint', 'monitor', 'end-walk', 'end-wait'];
    return ['call', 'splint', 'monitor', 'remark', 'end-walk', 'end-wait'];
  },

  crits: [
    ['away',    'Moved everyone out of striking range and left the snake alone', 'Scene safety first — one patient must not become two. (Lessons 1, 12)'],
    ['calm',    'Kept the patient calm and still', 'Panic and motion move venom; slow is a dose of treatment. (Lesson 12)'],
    ['ring',    'Removed rings and loosened the boot before the swelling', 'Anything snug becomes a tourniquet once the limb swells — off early, or cut off later. (Lesson 12)'],
    ['mark',    'Marked the swelling edge with a pen and the time', 'The line turns a leg into a chart the hospital can read. (Lesson 12)'],
    ['serial',  'Re-marked the swelling as it moved', 'Serial marks measure the venom’s pace — one line is a snapshot, two are a trend. (Lessons 12, 2)'],
    ['still',   'Immobilized the limb and kept him off it', 'Splinted roughly at heart level, and the leg rides — muscle is a venom pump. (Lesson 12)'],
    ['evac',    'Called for rescue early', 'Every snakebite evacuates now; antivenom is a hospital drug on a clock. (Lessons 12, 13)'],
    ['nomovie', 'Skipped the movie medicine — no cutting, sucking, tourniquets, ice, or snake wrangling', 'None of it helps, and all of it adds damage or patients. (Lesson 12)'],
    ['watch',   'Monitored him — vitals, face, mouth — while waiting', 'Systemic signs change the urgency; you catch them by looking on schedule. (Lessons 2, 12)']
  ],
  links: [['../lessons/12_Bites_Stings.html', 'Lesson 12 — Bites, Stings & Envenomation'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation'], ['../lessons/01_Provider_Safety.html', 'Lesson 1 — Provider Safety']],
  outcome: function (S) {
    if (S.crits.nomovie && S.away) return 'The right list was short: still, marked, loosened, called. Nobody got cut, iced, strangled, or bitten twice.';
    if (!S.crits.nomovie) return 'The bite was survivable from the first minute. It was the first aid that needed rescuing.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.trail() + SCN.boulder(120, 234, 30) +
      '<g id="log">' +
        SCN.pxRow(560, 648, 220, '#7E5C3A') +
        SCN.pxRow(560, 648, 224, 'trunk') +
        SCN.pxRow(560, 648, 228, 'boot') +
        SCN.pxDisc(648, 224, 8, 'boot') + SCN.pxDisc(648, 224, 4, 'trunk') +
        SCN.pxRect(556, 232, 96, 4, 'shadow') +
      '</g>' +
      '<g id="snake">' +
        SCN.pxRect(592, 232, 8, 4, 'spk2') +
        SCN.pxRect(600, 232, 8, 4, 'olive') + SCN.pxRect(608, 228, 8, 4, 'olivesh') +
        SCN.pxRect(616, 228, 8, 4, 'olive') + SCN.pxRect(624, 232, 8, 4, 'olivesh') +
        SCN.pxRect(632, 232, 8, 4, 'olive') + SCN.pxRect(640, 228, 8, 4, 'olivesh') +
        SCN.pxRect(648, 224, 12, 8, 'olive') + SCN.pxRect(648, 232, 12, 4, 'olivesh') +
        SCN.pxRect(656, 226, 4, 4, 'wheel') +
      '</g>' +
      '<g id="party">' +
        '<g id="m-up">' + SCN.figStand('mU', 500, 228, { accent: true }) + '</g>' +
        '<g id="m-sit" style="display:none;">' + SCN.figSit('mS', 470, 232, { accent: true }) + '</g>' +
        SCN.mark('swell', 492, 228) + SCN.mark('swell2', 498, 223) +
        SCN.splintOn('msplint', 472, 228, 26) +
        SCN.figStand('tylerF', 420, 226) + SCN.figStand('kelseyF', 382, 227, { hat: true }) +
      '</g>',
      { sky: 'noon', label: 'A hiker bitten by a rattlesnake near a downed log in a desert canyon, friends around him.' }),
    update: function (S) {
      SCN.show('m-up', !S.calm); SCN.show('m-sit', S.calm);
      SCN.show('swell', S.marked); SCN.show('swell2', S.grew);
      SCN.show('msplint', S.splinted && S.calm);
      var p = document.getElementById('party');
      if (p) p.setAttribute('transform', S.away ? 'translate(-110 0)' : '');
    }
  }
};
