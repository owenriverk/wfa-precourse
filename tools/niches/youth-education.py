# Youth & Education niche pages. Entry format documented in tools/niches/README.md
NICHES = [
{'cat': 'Youth & Education',
 'cert': 'ACA accreditation and state camp regulations set real training requirements — certified first '
         'aid, CPR, lifeguards on the waterfront — and those stand exactly as written. This is '
         'arrive-prepared material, not a substitute for any of it.',
 'days': [('S’mores night.',
           'Two minutes after the cookout starts there are hives; five minutes in, a wheeze. Knowing which '
           'camper carries epi and where it lives is a before-dinner habit, not a during-emergency '
           'search.'),
          ('The buddy check comes up one short.',
           'A swimmer comes out of the lake limp and not breathing. Drowning is the one place the order '
           'changes: breaths first, then everything else.'),
          ('The climbing wall.',
           'A camper puts a hand out at the bottom of the wall and the wrist goes wrong. Splint it, check '
           'the fingers before and after, and keep the rest of the line moving.')],
 'desc': 'Free first aid study for summer camp counselors and activity directors: anaphylaxis at the '
         'cookout, waterfront rescues, wrist fractures, and hot game days.',
 'eyebrow': 'For summer camp counselors & activity directors',
 'h1': 'Ten weeks, ninety kids, one of you.',
 'lead': 'Camp compresses a childhood’s worth of emergencies into one summer: allergies at every cookout, '
         'water all day, a climbing wall with opinions. Your camp’s required training and protocols come '
         'first — this is how you show up to staff week already fluent, with the judgment underneath the '
         'checklists.',
 'path': [('10_Anaphylaxis',
           'Anaphylaxis',
           'epi first and early — plus the known-allergies roster habit'),
          ('14_Water_Lightning', 'Water & Lightning', 'breaths first — drowning changes the order'),
          ('08_Heat', 'Heat Illness', 'color wars in July put kids on the heat spectrum'),
          ('06_Musculoskeletal', 'Musculoskeletal Injuries', 'FOOSH wrists are a camp season constant'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'kids under-report — the system catches what they won’t say')],
 'sims': [('sims/find-the-epi.html', 'Find the Epi', 'anaphylaxis at the cookout, clock running'),
          ('sims/cool-first.html', 'Cool First', 'the field-game day that goes over the line'),
          ('sims/wiggle-feel-warm.html',
           'Wiggle, Feel, Warm',
           'the climbing-wall wrist, start to finish')],
 'h2_days': 'A summer’s worth in one week',
 'h2_path': 'The staff-week head start',
 'path_intro': 'Read these five before staff week:',
 'faq_title': 'Bunk-time questions',
 'faq': [('Will this count toward my camp’s first aid requirement?',
          'No — camps answer to ACA accreditation and state licensing, which name the certifications '
          'and providers they accept. Check with your camp director. What this does is make you the '
          'counselor who already knows why the protocols say what they say, which is worth more than it '
          'sounds like in week six.'),
         ('What should I actually have memorized before campers arrive?',
          'Two things cold: which of your campers carry epinephrine and exactly where it lives, and '
          'that <a href="../lessons/14_Water_Lightning.html">drowning changes the order</a> — breaths '
          'first, before compressions. Everything else can live in a reference card; those two have to '
          'live in you.'),
         ('A camper says they’re fine — do I believe them?',
          'Believe them twice. Kids under-report to stay in the game, avoid the nurse, or avoid the '
          'phone call home — so check now and check again in fifteen minutes, and let the second look '
          'make the call. A kid who’s trending quieter, paler, or clumsier is telling you the truth '
          'their mouth won’t.')],
 'slug': 'camp-counselors',
 'title': 'Free Wilderness First Aid for Camp Counselors'},

{'cat': 'Youth & Education',
 'cert': 'Most institutions specify the credential their field staff need — WFA or WFR from an approved '
         'provider, plus CPR — and that requirement is the floor, not a suggestion. Use this to arrive '
         'fluent, brief your chaperones, and stay sharp between renewals.',
 'days': [('The overlook.',
           'One student down with a bad ankle, fourteen more on a ledge losing interest. Treating the '
           'patient is half the job; keeping the group deliberately parked and led is the other half.'),
          ('Page two of the med form.',
           'Twenty minutes up the trail, the student who “forgot” her inhaler starts working to breathe. '
           'The roster isn’t paperwork — it’s your patient list in advance.'),
          ('The hand-off.',
           'EMS meets you at the trailhead and asks what happened. Two sets of vitals with times, written '
           'down, turn you from a bystander into the first link in the chain.')],
 'desc': 'Free wilderness first aid for outdoor educators and trip leaders: running a group around one '
         'patient, roster conditions, and documentation that holds up.',
 'eyebrow': 'For outdoor education instructors, university rec staff & school trip coordinators',
 'h1': 'One patient, eleven spectators.',
 'lead': 'Institutional trips fail differently: the medicine is standard, but it happens in front of a '
         'group you’re still responsible for, on a student whose med form you skimmed. This is that '
         'judgment — and if you’re a parent chaperone handed a first aid kit and a prayer, this page is '
         'for you too.',
 'path': [('01_Provider_Safety',
           'Provider Safety',
           'scene control when the scene includes fourteen teenagers'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'SAMPLE, serial vitals, and notes worth handing to EMS'),
          ('11_Medical',
           'Medical Emergencies',
           'diabetes, asthma, and whatever else the med forms mention'),
          ('10_Anaphylaxis', 'Anaphylaxis', 'field trips carry every allergy in the school district'),
          ('13_Evacuation', 'Evacuation', 'messengers, notes, and never splitting a group thoughtlessly')],
 'sims': [('sims/guy-whos-fine.html',
           'The Guy Who’s Fine',
           'serial vitals — and the note-taking habit — catch it'),
          ('sims/hero-complex.html', 'Hero Complex', 'scene safety with an audience in the fall line'),
          ('sims/two-go-one-stays.html',
           'Two Go, One Stays',
           'who goes, who stays, what the note says')],
 'h2_days': 'Field-trip failure modes',
 'h2_path': 'The staff-training five',
 'path_intro': 'In the order institutional trips need them:',
 'slug': 'outdoor-educators',
 'title': 'Free Wilderness First Aid for Outdoor Educators'},

{'cat': 'Youth & Education',
 'cert': 'Childcare licensing in most states requires pediatric first aid and CPR from an approved '
         'provider, and a pediatric-specific class is worth taking on its own merits. Those requirements '
         'stand — this adds the outdoor judgment on top.',
 'days': [('Snack circle goes quiet.',
           'A four-year-old with a mouthful of trail mix stops making noise. Quiet is the alarm — the '
           'choking response is fast, physical, and not something to improvise for the first time that '
           'morning.'),
          ('The first sting.',
           'No allergy on file because there’s no file yet — first stings are first data. Stinger out '
           'fast, then watch: hives alone is one plan, hives plus a wheeze is epi and 911.'),
          ('Puddle season.',
           'The three-year-old who sat down in the creek an hour ago is now oddly quiet and doesn’t want '
           'to play. Small bodies cool fast and complain little — warm, dry, calories, and watch.')],
 'desc': 'Free first aid for forest school educators and nature guides: choking response, first-time '
         'allergic reactions, and small bodies in cold, wet weather.',
 'eyebrow': 'For forest school educators & early-childhood nature guides',
 'h1': 'Small patients, big woods.',
 'lead': 'Preschoolers outdoors are wonderful and slightly terrifying: straw-sized airways, no allergy '
         'history yet, and small bodies that shed heat fast. The doctrine here is the same one that works '
         'on adults — what changes with small patients is mostly speed and attention, and knowing that is '
         'the job.',
 'path': [('03_Airway',
           'Airway & Breathing',
           'choking response and positioning — the skills this age group demands'),
          ('10_Anaphylaxis',
           'Anaphylaxis',
           'first reactions happen on your watch, without a history to warn you'),
          ('09_Cold', 'Cold Injuries', 'little bodies lose heat fast and report it late'),
          ('12_Bites_Stings', 'Bites & Stings', 'stingers out fast, plus the end-of-session tick check'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'assessing a patient whose chief complaint is crying')],
 'sims': [('sims/snoring-isnt-sleeping.html',
           'Snoring Isn’t Sleeping',
           'the airway you can hear — positioning under pressure'),
          ('sims/find-the-epi.html', 'Find the Epi', 'the reaction that escalates while you decide'),
          ('sims/the-burrito.html', 'The Burrito', 'cold and wet, wrapped right')],
 'h2_days': 'Small-patient emergencies',
 'h2_path': 'Circle-time study order',
 'path_intro': 'Ordered for the youngest patients:',
 'slug': 'forest-school',
 'title': 'Wilderness First Aid for Forest School Educators'},

{'cat': 'Youth & Education',
 'cert': 'Pet first aid classes cover the dogs; this covers the humans. If a client contract or insurer '
         'wants a human first aid card, take an in-person class — you’ll walk in already fluent.',
 'days': [('The breakup.',
           'Two dogs decide, and your hand is the closest thing to grab. Bite wounds want real irrigation, '
           'honest bandaging, and a low threshold for a clinic visit — Lesson 12 does it properly.'),
          ('Six leashes, one root.',
           'The pack surges at a squirrel, the leads wrap your knees, and the trail wins. FOOSH wrists and '
           'hip landings are the leash-tangle tax — splint, check, re-check.'),
          ('The regular who isn’t moving.',
           'Same loop, same faces — until the morning cyclist is off the trail at the bottom of the '
           'switchback. You’re first on scene by default, and the next ten minutes are this course.')],
 'desc': 'Free first aid for professional dog walkers and off-leash group leaders: dog-bite wounds, '
         'leash-tangle falls, heat days, and strangers found on the trail.',
 'eyebrow': 'For dog walkers & off-leash trail group leaders',
 'h1': 'The regular who finds the irregular.',
 'lead': 'Daily miles in all weather, usually alone, often with six dogs and one working hand — that’s an '
         'exposure profile, whether or not it feels like one. Bites, falls, and heat come with the job, '
         'and the person who walks the same loop every morning is exactly the one who finds the runner who '
         'didn’t make it home.',
 'path': [('12_Bites_Stings', 'Bites & Stings', 'dog-bite wound care, done right the first time'),
          ('04_Bleeding_Wounds',
           'Bleeding & Wounds',
           'punctures, tears, and pressure that actually stops it'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'wrists and hips — yours and the people you find'),
          ('08_Heat', 'Heat Illness', 'you already watch the dogs for it; humans need the same eye'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'a system for the stranger down, starting from nothing')],
 'sims': [('sims/snoring-isnt-sleeping.html',
           'Snoring Isn’t Sleeping',
           'the runner down who isn’t napping'),
          ('sims/stop-peeking.html', 'Stop Peeking', 'pressure held through the urge to look'),
          ('sims/wiggle-feel-warm.html', 'Wiggle, Feel, Warm', 'the FOOSH wrist and the CSM habit')],
 'h2_days': 'On the morning loop',
 'h2_path': 'Between-walk reading',
 'path_intro': 'Five lessons, ordered by what the job serves up:',
 'slug': 'dog-walkers',
 'title': 'Free First Aid for Professional Dog Walkers'},

]
