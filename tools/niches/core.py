# Original seven niche pages. Entry format documented in tools/niches/README.md
NICHES = [
{'cat': 'Rescue & Public Safety',
 'cert': 'Most teams require a WFR or EMT card from a recognized provider before you’re mission-qualified — '
         'this course doesn’t check that box, and isn’t trying to. It gets you fluent before the paid '
         'course, and keeps you sharp between recerts.',
 'days': [('The subject spent the night out.',
           'Found at dawn behind a log, cold and quiet. The hypothermia wrap and gentle handling — '
           'insulation under, head covered, no rough movement — are most of the mission.'),
          ('The carry-out.',
           'A splinted lower leg, six miles of trail, litter teams rotating. The medicine that matters '
           'happened in the first twenty minutes, before the wheels.'),
          ('The scene that bites back.',
           'Loose rock above the subject, a bystander in the fall line. The difference between a rescuer and '
           'a second patient is thirty seconds of reading the slope.')],
 'desc': 'Free, no-signup wilderness first aid for search and rescue candidates and volunteers: patient '
         "assessment, packaging, hypothermia wraps, and evacuation logic — before you ever ring the team's "
         'doorbell.',
 'eyebrow': 'For SAR candidates & volunteers',
 'h1': 'Speak the language before you join the team.',
 'lead': 'You don’t need a mission number to start thinking like a rescuer. Learn the assessment system, the '
         'packaging, and the evacuation logic that teams run on — free, at your own pace, before the '
         'interview and between the recerts.',
 'path': [('02_Patient_Assessment',
           'Patient Assessment',
           'the system everything else hangs on — scene, XABCDE, SAMPLE, serial vitals'),
          ('07_Spine', 'Spine Injuries', 'motion restriction is half of packaging'),
          ('09_Cold', 'Cold Injuries', 'most found subjects are cold subjects'),
          ('05_Shock', 'Shock', 'the trend that decides evacuation urgency'),
          ('13_Evacuation', 'Evacuation', 'size-up, resources, messengers, and the call')],
 'sims': [('sims/hero-complex.html', 'Hero Complex', 'scene safety when someone is screaming your name'),
          ('sims/the-burrito.html', 'The Burrito', 'the hypothermia wrap, done in order'),
          ('sims/two-go-one-stays.html', 'Two Go, One Stays', 'messengers, notes, and staying power')],
 'slug': 'sar',
 'title': 'Free Wilderness First Aid for SAR Candidates'},

{'cat': 'Motorized & Airborne',
 'cert': 'If a guide service, race organizer, or employer requires a provider’s card, take their class — '
         'you’ll walk in already fluent.',
 'days': [('The lowside.',
           'Your buddy’s bike is on its side ten yards past him and his lower leg has a new angle. Splint it '
           'right and the whole day changes.'),
          ('The helmet question.',
           'He’s talking, his neck is sore, and everyone has an opinion about the lid. There’s a doctrine '
           'for this — it isn’t “just pull it off.”'),
          ('July, full gear.',
           'Armored jacket, black pants, no shade. Heat illness in riding gear comes on fast and reads as '
           '“just tired” until it doesn’t.')],
 'desc': 'Free trailside first aid for dual-sport and adventure riders: rider-down assessment, helmet '
         'decisions, splinting, and the evacuation call — no signup, no cost.',
 'eyebrow': 'For dual-sport & ADV riders',
 'h1': 'Forty minutes of rough trail from help.',
 'lead': 'You carry tools for the bike. This is the toolkit for the rider — what to do in the minutes after '
         'a lowside, when the nearest ambulance can’t reach you and the nearest cell bar is one.',
 'path': [('06_Musculoskeletal', 'Musculoskeletal Injuries', 'splinting is the signature rider-down skill'),
          ('07_Spine', 'Spine & Helmets', 'the helmet decision, taught properly'),
          ('02_Patient_Assessment', 'Patient Assessment', 'what to check, in what order, with gloves on'),
          ('08_Heat', 'Heat Illness', 'riding gear is a wearable greenhouse'),
          ('13_Evacuation',
           'Evacuation',
           'one bar, one partner, forty minutes of trail — do the math right')],
 'sims': [('sim.html', 'The Rider Down', 'the full scenario this course was built around'),
          ('sims/dont-sit-him-up.html', 'Don’t Sit Him Up', 'neck pain, storm inbound, move him right'),
          ('sims/two-go-one-stays.html', 'Two Go, One Stays', 'when the phone dies mid-call')],
 'slug': 'riders',
 'title': 'Free Wilderness First Aid for Dual-Sport & ADV Riders'},

{'cat': 'Rural & Homesteading',
 'cert': 'If an outfitter or employer wants a provider’s card, take their class — this makes it easy.',
 'days': [('Field dressing, bad angle.',
           'The knife slips and a forearm opens up — more blood than seems reasonable. Direct pressure, held '
           'without peeking, is the whole game.'),
          ('November creek.',
           'Your partner goes in at the beaver dam. Ten minutes later he’s shivering like a paint mixer — '
           'and the truck is two drainages away.'),
          ('“It’s just the coffee.”',
           'Your buddy at the tailgate is sweaty, gray, and rubbing his chest. The most dangerous sentence '
           'in the woods is “I’m fine.”')],
 'desc': 'Free first aid training for hunters and anglers: severe bleeding control, cold-water immersion, '
         'treestand falls, and the cardiac event at the truck — no signup, no cost, no certification '
         'theater.',
 'eyebrow': 'For hunters & anglers',
 'h1': 'A long way from the truck.',
 'lead': 'Knives, broadheads, cold water, steep dark timber, and a demographic that shrugs off chest pain. '
         'Hunting and fishing collect exactly the emergencies this course teaches — learn them free, in an '
         'evening or two.',
 'path': [('04_Bleeding_Wounds',
           'Bleeding & Wounds',
           'pressure, packing, tourniquets — the sharp-object curriculum'),
          ('09_Cold', 'Cold Injuries', 'immersion, hypothermia, and the wrap'),
          ('11_Medical', 'Medical Emergencies', 'chest pain, denial, and aspirin'),
          ('01_Provider_Safety', 'Provider Safety', 'one patient must not become two'),
          ('13_Evacuation', 'Evacuation', 'getting help to a spot with no address')],
 'sims': [('sims/stop-peeking.html', 'Stop Peeking', 'hold pressure — the timer resets when you look'),
          ('sims/the-burrito.html', 'The Burrito', 'cold-water immersion, wrapped right'),
          ('sims/not-indigestion.html', 'It’s Not Indigestion', 'the tailgate chest pain')],
 'slug': 'hunters',
 'title': 'Free Wilderness First Aid for Hunters & Anglers'},

{'cat': 'Trail & Mountain',
 'cert': 'If a trail organization or guide program requires a provider’s card, take their class — you’ll '
         'arrive ahead.',
 'days': [('Talus, ankle, pop.',
           'She can’t bear weight, the group has one phone at 8%, and the daylight is doing daylight things. '
           'What happens next is a decision tree, not a vibe.'),
          ('Lunch, bee, hives.',
           'Two minutes in it’s itching. Five minutes in there’s a wheeze. The epinephrine is in somebody’s '
           'pack — whose?'),
          ('The hot climb.',
           'Your partner stops making sense on the exposed switchbacks at noon. Cool first, right there, '
           'with what you carry — not at the car.')],
 'desc': 'Free wilderness first aid for backpackers and thru-hikers: ankle injuries miles from the '
         'trailhead, heat illness, anaphylaxis, and evacuation decisions — no signup, no cost.',
 'eyebrow': 'For backpackers & thru-hikers',
 'h1': 'Six miles out, three hours of light.',
 'lead': 'Every mile you walk in is a mile somebody might have to carry you out. The skills that change that '
         'math — assessment, splinting, the evac decision — fit in a few evenings, and they weigh nothing.',
 'path': [('06_Musculoskeletal', 'Musculoskeletal Injuries', 'ankles and wrists are the thru-hiker tax'),
          ('10_Anaphylaxis', 'Anaphylaxis', 'epi first, early, no substitutes'),
          ('08_Heat', 'Heat Illness', 'the spectrum, and where your partner sits on it'),
          ('13_Evacuation', 'Evacuation', 'notes, messengers, and who stays'),
          ('15_Kits_Preparation', 'Kits & Preparation', 'the kit that earns its weight')],
 'sims': [('sims/two-go-one-stays.html', 'Two Go, One Stays', 'the send-for-help note, under pressure'),
          ('sims/find-the-epi.html', 'Find the Epi', 'anaphylaxis with the clock running'),
          ('sims/cool-first.html', 'Cool First', 'heat stroke on the ridge')],
 'slug': 'backpackers',
 'title': 'Free Wilderness First Aid for Backpackers & Thru-Hikers'},

{'cat': 'Trail & Mountain',
 'cert': 'If a race series, bike patrol, or employer requires a provider’s card, take their class — you’ll '
         'walk in ahead.',
 'days': [('The new corner.',
           'She put a hand out and now the wrist has a corner it didn’t have this morning. Check, splint, '
           'check again — wiggle, feel, warm.'),
          ('Berm, neck, green sky.',
           'He’s down off the berm saying his neck hurts, and the weather is coming. Moving him and '
           'protecting his spine aren’t opposites — if you know how.'),
          ('The guy who’s fine.',
           'Fifteen-foot ground fall, already joking. His heart rate has an opinion, but only if somebody '
           'takes it twice.')],
 'desc': 'Free trailside first aid for mountain bikers: over-the-bars crashes, wrist and collarbone '
         "injuries, the helmet and spine decision, and riders who say they're fine — no signup, no cost.",
 'eyebrow': 'For mountain bikers',
 'h1': 'Over the bars happens fast.',
 'lead': 'The crash takes half a second; the next half hour is on whoever’s standing there. Learn what to '
         'check, what not to move, and when “I’m fine” needs a second opinion — free, before the next ride.',
 'path': [('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'wrists, collarbones, and the splinting doctrine'),
          ('07_Spine', 'Spine & Helmets', 'when the lid stays on and how to move a neck'),
          ('02_Patient_Assessment', 'Patient Assessment', 'serial vitals catch what jokes hide'),
          ('04_Bleeding_Wounds', 'Bleeding & Wounds', 'rock gardens keep receipts'),
          ('13_Evacuation', 'Evacuation', 'ride out, walk out, or call — the actual math')],
 'sims': [('sims/dont-sit-him-up.html', 'Don’t Sit Him Up', 'spine + storm, no good options, one right one'),
          ('sims/wiggle-feel-warm.html', 'Wiggle, Feel, Warm', 'the wrist, the splint, the re-check'),
          ('sims/guy-whos-fine.html', 'The Guy Who’s Fine', 'trend beats snapshot')],
 'slug': 'mtb',
 'title': 'Free First Aid for Mountain Bikers'},

{'cat': 'Trail & Mountain',
 'cert': 'If a race requires medical volunteers to hold a provider’s card, take their class — this is the '
         'fluency underneath it.',
 'days': [('The runner who isn’t sleeping.',
           'Face-down off the edge of the trail, making a noise like a bear. That snore is an airway, and '
           'it’s asking for help now — not after you find signal.'),
          ('Noon, exposed ridge.',
           'Your partner is weaving and answering questions from some other conversation. Heat stroke gets '
           'cooled where it happens, with what you have.'),
          ('The bonk that isn’t.',
           'Sweaty, confused, and swearing she’s fine — if she can still swallow, sugar now beats diagnosis '
           'later.')],
 'desc': 'Free first aid for trail and ultra runners: the runner down and snoring, heat stroke at noon, '
         'sugar crashes, and being useful with almost no gear — no signup, no cost.',
 'eyebrow': 'For trail runners',
 'h1': 'You carry a phone and 400 calories. Be useful anyway.',
 'lead': 'Runners travel light and far — which means the first person to reach a backcountry emergency is '
         'often someone in a race vest. Most of what matters in the first ten minutes is technique and '
         'judgment, not equipment. That part is free.',
 'path': [('03_Airway', 'Airway & Breathing', 'positioning saves lives with zero equipment'),
          ('08_Heat', 'Heat Illness', 'cool first — the walking decision kills'),
          ('11_Medical', 'Medical Emergencies', 'sugar, chest pain, and the ones with no mechanism'),
          ('02_Patient_Assessment', 'Patient Assessment', 'a system that works in a race vest'),
          ('13_Evacuation', 'Evacuation', 'when to run for help and what to know before you go')],
 'sims': [('sims/snoring-isnt-sleeping.html', 'Snoring Isn’t Sleeping', 'the airway you can hear'),
          ('sims/cool-first.html', 'Cool First', 'heat stroke, cooled in place'),
          ('sims/sugar-first.html', 'Sugar First', 'the closing window')],
 'slug': 'trail-runners',
 'title': 'Free Wilderness First Aid for Trail Runners'},

{'cat': 'Youth & Education',
 'cert': 'If your organization — a scouting council, school, or camp — requires certified training from an '
         'approved provider, that requirement stands; check with them first. Use this to arrive prepared and '
         'stay sharp between renewals.',
 'days': [('Lunch, bee, epi in a pack.',
           'Hives at two minutes, a wheeze at five, and the auto-injector is somewhere in the group gear. '
           'Knowing where the epi lives is a before-lunch decision.'),
          ('The bouldering fall.',
           'A scout puts a hand out and the wrist goes wrong. Splint it, check the fingers before and after, '
           'and keep the rest of the group led.'),
          ('The quiet camper.',
           'The Type 1 kid is sweaty, confused, and insists he’s fine. If he can swallow, sugar now — the '
           'window closes fast.')],
 'desc': 'Free wilderness first aid study for scout and youth outdoor leaders: anaphylaxis, fractures, '
         'diabetic emergencies, and leader-level judgment. Prep for and stay sharp between your '
         "organization's required trainings.",
 'eyebrow': 'For scout & youth outdoor leaders',
 'h1': 'Somebody’s kid, your call.',
 'lead': 'Taking other people’s children into the backcountry concentrates responsibility wonderfully. This '
         'course won’t satisfy an organization’s training requirement — check what your council, school, or '
         'camp mandates — but it will make you the leader who’s actually ready, not just current.',
 'path': [('10_Anaphylaxis', 'Anaphylaxis', 'epi first, early — the youth-group emergency'),
          ('06_Musculoskeletal', 'Musculoskeletal Injuries', 'playground physics, backcountry consequences'),
          ('11_Medical', 'Medical Emergencies', 'diabetes, asthma, and known conditions on your roster'),
          ('01_Provider_Safety', 'Provider Safety', 'the scene habits kids copy'),
          ('13_Evacuation', 'Evacuation', 'groups, messengers, and never sending one kid anywhere alone')],
 'sims': [('sims/find-the-epi.html', 'Find the Epi', 'the search you don’t want to be doing at minute five'),
          ('sims/wiggle-feel-warm.html', 'Wiggle, Feel, Warm', 'the FOOSH wrist, start to finish'),
          ('sims/sugar-first.html', 'Sugar First', 'the known diabetic, going down')],
 'slug': 'youth-leaders',
 'title': 'Free Wilderness First Aid Prep for Scout & Youth Leaders'},

]
