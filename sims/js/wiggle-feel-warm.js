/* Wiggle, Feel, Warm — CSM before the splint, after the splint, and again after that. */
window.WFA_SCENARIO = {
  nlp: { csm: 'fingers|hand', splint: 'splint the wrist|make a splint' },
  env: '58°F · talus field below the ridge · gusty',
  brief: '<p>You and June are scrambling the ridge loop, crossing the big talus field an hour above the trail. A block shifted under her, she threw a hand out the way everyone does, and all her weight landed on the palm. She’s sitting on a slab now, cradling her right wrist against her chest and being extremely casual about it, which is how June does pain.</p><p>Your kit rides in the top of your pack. The route out is a mile of talus at walking grade, then good trail to the car.</p>',
  startText: '“It’s probably fine,” June says, not letting you see it. The way she’s holding the arm — like a waiter with a tray nobody can touch — says otherwise.',
  state: { exposed: false, jewelry: false, splinted: false, splintT: 0, csmaDone: false, postChecks: 0,
           lastCheckT: 0, dusky: false, loosened: false, slung: false },

  tick: function (S, api) {
    if (S.t === 5) api.log('event', 'The wrist is puffing up like bread dough. Whatever is coming off — watch, rings — comes off now or not at all.');
    if (S.t === 10 && !S.jewelry) api.log('event', 'Her watchband is starting to leave a dent.');
    if (S.splinted && !S.csmaDone && !S.dusky && !S.loosened && S.t - S.splintT >= 8) {
      S.dusky = true;
      api.log('event', '“My hand feels weird,” June says, casual, like it’s someone else’s hand. Her fingertips have gone dusky.');
      api.flag('nocheck', 'The splint went on and nobody looked below it again. Swelling keeps rising after the knot is tied — CSM after splinting, then again on a schedule, is what catches a splint turning into a tourniquet. (Lesson 6)');
    }
    if (S.splinted && S.csmaDone && S.postChecks === 1 && S.t - S.lastCheckT === 8) {
      api.log('event', 'It’s been a while since anyone looked below the splint.');
    }
  },
  chips: function (S) {
    var w = S.dusky ? 'fingers DUSKY' : S.splinted ? 'splinted' : S.exposed ? 'deformed' : 'guarded';
    return [['R wrist', w, S.dusky || (S.exposed && !S.splinted)]];
  },

  actions: [
    { id: 'screen', g: 'ask', label: 'Get the story — and ask the spine questions', mins: 2, once: true, run: function (S) {
        S.crits.spine = true;
        return 'Short fall from standing, onto the hand, never hit her head — she walked three steps to the slab under her own power. You ask anyway: no neck or back pain, no tingling anywhere except the hand she’s guarding. Low-energy mechanism. Stay alert, not alarmed — and the wrist gets your full attention.'; } },
    { id: 'look', g: 'assess', label: 'Get the sleeve up — look at the wrist', mins: 1, once: true, run: function (S) {
        S.exposed = true; S.crits.expose = true;
        return 'Jacket sleeve worked gently up, and there it is: the forearm takes a small detour an inch above the wrist. A new corner, where arms don’t have corners. Skin intact, already swelling. Classic fall-on-outstretched-hand.'; } },
    { id: 'csm', g: 'assess', label: 'Check CSM — wiggle, feel, warm', mins: 1, run: function (S) {
        if (!S.splinted) {
          S.crits.csmb = true;
          return 'Below the injury: fingers wiggle — yes, through gritted teeth. She feels your touch on each fingertip. Nailbed squeeze goes pink again in two seconds, hand warm. CSM intact under a wrist that clearly isn’t. Now you have a baseline.';
        }
        S.postChecks++; S.lastCheckT = S.t; S.csmaDone = true;
        if (S.dusky) return 'Fingertips dusky, nailbeds slow to refill, and she admits the hand is “buzzing.” The splint is doing tourniquet work. It needs to be loosened — now.';
        S.crits.csma = true;
        if (S.postChecks >= 2) S.crits.recheck = true;
        return 'Below the splint: wiggle — yes. Feel — yes, all five. Nailbeds pink in two seconds, hand warm. The splint is holding the bone, not the blood supply. Worth checking again in a while — swelling isn’t done.'; } },
    { id: 'rings', g: 'treat', label: 'Watch and rings off before the swelling wins', mins: 2, once: true, run: function (S) {
        S.jewelry = true; S.crits.jewelry = true;
        return (S.t > 10 ? 'The watch fights you over the swelling and loses, barely. ' : '') + 'Watch and both rings off and into her chest pocket, announced out loud so nobody relitigates it later. A ring left on a swelling hand becomes a problem no one out here can fix.'; } },
    { id: 'straighten', g: 'treat', label: 'Pull the wrist straight before splinting', mins: 1, once: true, run: function (S, api) {
        api.flag('pull', 'Realigning a deformed wrist is for the people with the X-ray machine. At this level it’s splint-in-position-found — pulling on it gambles with vessels and nerves that were coping. (Lesson 6)');
        return 'You take her hand like a handshake and pull, gently, to fix the angle. June makes a sound the whole talus field hears. The angle does not improve, and her fingers sting afterward. Deformed stays deformed until an X-ray has an opinion.'; } },
    { id: 'splint', g: 'treat', label: 'Pad and splint it — in the position found', mins: 4, once: true, when: function (S) { return S.exposed; }, run: function (S) {
        S.splinted = true; S.splintT = S.t; S.crits.splint = true;
        return 'Foam pad folded into a gutter, molded under forearm and wrist in the position found — no straightening. It reaches past the elbow side and past the hand: joints above and below. Padded hollows, wraps snug, nothing cinched over the break itself, fingertips left showing like a little status display.'; } },
    { id: 'sling', g: 'treat', label: 'Sling and swathe — bring the arm to the chest', mins: 2, once: true, when: function (S) { return S.splinted; }, run: function (S) {
        S.slung = true; S.crits.sling = true;
        return 'Triangle bandage into a sling, knot padded at her neck, a swathe holding the whole works against her chest. The arm rides at heart height and stops voting every time she moves.'; } },
    { id: 'loosen', g: 'treat', label: 'Loosen the wrap and re-splint it', mins: 2, when: function (S) { return S.dusky; }, run: function (S) {
        S.dusky = false; S.loosened = true; S.crits.csma = true; S.lastCheckT = S.t;
        return 'Two turns unwound, padding reset, re-wrapped a notch looser. Within a couple of minutes the color walks back into her nailbeds. You put the next check on a schedule instead of a hunch.'; } },
    { id: 'ibu', g: 'ask', label: 'Offer ibuprofen from the kit', mins: 1, once: true, run: function () {
        return 'She rates it a six, which in June units is a nine. Ibuprofen from the kit with a swallow of water, dose and time written on a strip of tape on her sleeve.'; } },

    { id: 'end-walk', g: 'decide', label: 'Walk her out — slow, supported, the easy line', mins: 3, when: function (S) { return S.splinted; }, run: function (S) {
        S.decided = 'walk'; S.crits.evac = true;
        return 'Her pack’s weight moves to yours, her good hand stays free for balance, and you take the gentle line down at grandma pace' + (S.slung ? ', the sling keeping the arm quiet' : ', the arm cradled') + '. A wrist in a good splint is a passenger — her legs were never the problem. Urgent care by dinner, X-ray by dessert.'; } },
    { id: 'end-sar', g: 'decide', label: 'Call for a rescue carry-out', mins: 3, when: function (S) { return S.splinted; }, run: function (S) {
        S.decided = 'sar';
        return 'They come — six people and four hours for a patient who was walking around the slab making phone-holder jokes. Nobody in SAR complains. But the evac decision is part of the medicine, and this prescription was stronger than the injury: splinted forearm, intact CSM, working legs.'; } },
    { id: 'end-tough', g: 'decide', label: '“It’s fine” — tape it and keep scrambling for the summit', mins: 2, run: function (S, api) {
        S.decided = 'tough';
        api.flag('summit', 'A deformed, swelling forearm doesn’t finish a talus scramble — it needs a splint, a sling, and a downhill plan while she can still walk out comfortably. (Lessons 6, 13)');
        return 'Two hundred yards of talus later, every step is a hammer tap on the wrist. She’s one-handed on terrain that wants two, sweating through the casual act. The summit will still be there next month. The easy walking window is closing today.'; } }
  ],

  suggest: function (S) {
    if (!S.exposed) return ['screen', 'look', 'csm', 'rings', 'straighten'];
    if (!S.splinted) return ['csm', 'rings', 'straighten', 'splint', 'end-tough'];
    if (S.dusky) return ['loosen', 'csm', 'sling', 'end-walk'];
    return ['csm', 'sling', 'ibu', 'end-walk', 'end-sar', 'end-tough'];
  },

  crits: [
    ['spine',   'Got the mechanism and screened the spine', 'Low fall, no head strike, walked away — low risk. You still ask; the questions are cheap and the miss is not. (Lessons 2, 7)'],
    ['expose',  'Exposed the injury and looked at it', 'You can’t splint what you haven’t seen. Sleeve up, gently — the deformity and intact skin set the whole plan. (Lessons 6, 2)'],
    ['jewelry', 'Got watch and rings off before the swelling', 'Once the hand swells, jewelry becomes a tourniquet with sentimental value. Off early, pocketed, announced. (Lesson 6)'],
    ['csmb',    'Checked CSM before splinting', 'The baseline. Without it, “fingers feel weird” later has nothing to be compared against. (Lesson 6)'],
    ['splint',  'Padded and splinted in the position found', 'Joints above and below, padding in the hollows, nothing tight across the break, fingertips visible. No straightening at this level. (Lesson 6)'],
    ['csma',    'Checked CSM after splinting', 'The after-check is what proves the splint helps the bone without strangling the hand. (Lesson 6)'],
    ['sling',   'Slung and supported the arm', 'A sling turns a splinted arm from a pendulum into a passenger. (Lesson 6)'],
    ['recheck', 'Re-checked CSM periodically', 'Swelling keeps rising after the wrap is tied. Wiggle, feel, warm — on a schedule, all the way to the car. (Lesson 6)'],
    ['evac',    'Walked her out with support', 'The wrist isn’t a walking problem. Splinted, slung, CSM intact: her legs are the evacuation. (Lesson 13)']
  ],
  links: [['../lessons/06_Musculoskeletal.html', 'Lesson 6 — Musculoskeletal'], ['../lessons/02_Patient_Assessment.html', 'Lesson 2 — Patient Assessment'], ['../lessons/13_Evacuation.html', 'Lesson 13 — Evacuation']],
  outcome: function (S) {
    if (S.decided === 'tough') return 'The mountain got a vote on the way down anyway.';
    if (S.loosened) return 'Her fingers went dusky once. The re-check habit is why they didn’t stay that way.';
    if (S.crits.recheck) return 'Wiggle, feel, warm — before, after, and again after that. Nothing below the splint ever got a chance to go quietly wrong.';
    return '';
  },

  scene: {
    svg: SCN.wrap(
      SCN.mountains() + SCN.scree() + SCN.trees([720, 762]) +
      SCN.boulder(360, 234, 30) +
      SCN.figSit('june', 448, 230, { accent: true }) +
      SCN.mark('wound', 462, 213) +
      SCN.splintOn('splint', 448, 212, 30) +
      '<g id="sling" style="display:none;"><path d="M446,196 L462,214 L468,204" class="ln"/></g>' +
      '<g id="helper">' + SCN.figKneel('you', 500, 230, { flip: true }) + '</g>',
      { label: 'A scrambler sitting on a talus slab, cradling a deformed wrist; a partner kneeling beside her.' }),
    update: function (S) {
      SCN.show('wound', S.exposed && !S.splinted);
      SCN.show('splint', S.splinted);
      SCN.show('sling', S.slung);
    }
  }
};
