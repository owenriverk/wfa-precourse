# Trail & Mountain niche pages, batch 2. Entry format documented in tools/niches/README.md
NICHES = [
{'cat': 'Trail & Mountain',
 'cert': 'Nobody checks cards at a trailhead register, and this course doesn’t issue one — just a record of '
         'completion. If you want hands-on practice before a long walk, a weekend WFA class from NOLS or '
         'SOLO is money well spent; this gets you to that weekend ready to practice instead of memorize, '
         'and keeps the doctrine warm around mile 1,200.',
 'days': [('Forty-five and raining.',
           'Nobody falls and nobody yells — the hiker at the shelter just goes quiet, fumbles her stove, '
           'and stops shivering. That last part is worse, not better, and it looks like a nap.'),
          ('The desert section bites.',
           'A rattlesnake tags a calf on the morning road-walk. Everything the movies taught makes it '
           'worse; the real protocol is a marked swelling line, an immobilized leg, and an evacuation that '
           'starts now.'),
          ('The solo stretch.',
           'An ankle rolls fourteen miles from pavement and the next hiker through is tomorrow. What saves '
           'you was decided back in town: who knows your plan, and when they’d start wondering.')],
 'desc': 'Free wilderness first aid for AT, PCT, and Camino thru-hikers: wet-cold hypothermia, snakebite '
         'protocol, and evacuation calls on long solo stretches.',
 'eyebrow': 'For thru-hikers & long-distance trekkers',
 'h1': 'Luck runs out around mile 900.',
 'lead': 'A weekend trip can dodge the odds; a five-month walk collects them. Somewhere between the first '
         'blister and the last town stop, the trail hands somebody near you a genuinely bad day — and the '
         'nearest help is a hiker you met at the last register. These skills weigh nothing and never need '
         'a resupply.',
 'path': [('09_Cold', 'Cold Injuries', 'wet-cold on a 50-degree day drops more hikers than blizzards do'),
          ('12_Bites_Stings', 'Bites & Stings', 'you walk past more snakes than you see — until you don’t'),
          ('11_Medical', 'Medical Emergencies',
           'five months is long enough for anybody’s body to file a complaint'),
          ('13_Evacuation', 'Evacuation',
           'solo math — who knows where you are, and how help finds a trail name'),
          ('15_Kits_Preparation', 'Kits & Preparation',
           'a kit that survives your own shakedown and restocks at gas stations')],
 'sims': [('sims/sharpie-on-the-leg.html', 'Sharpie on the Leg',
           'the rattlesnake, minus the movie medicine'),
          ('sims/the-burrito.html', 'The Burrito', 'turning a wet, cold hiker back around'),
          ('sims/two-go-one-stays.html', 'Two Go, One Stays',
           'getting word out when the phone is a brick')],
 'h2_days': 'The trail keeps a ledger',
 'h2_path': 'Zero-day reading order',
 'path_intro': 'Every lesson is short enough for town-stop wifi; these five earn their spot first:',
 'faq_title': 'Trail-register questions',
 'faq': [('What actually ends thru-hikes?',
          'Rarely bears, rarely cliffs. Feet, wet cold, dehydration, and ordinary bodies doing '
          'extraordinary mileage — the dangerous stuff is the stuff that looks like a bad day until it '
          'isn’t. <a href="../lessons/09_Cold.html">Cold Injuries</a> and '
          '<a href="../lessons/11_Medical.html">Medical Emergencies</a> cover the two that sneak up.'),
         ('Do I actually need to worry about snakes?',
          'You’ll walk past far more than you’ll ever see, and that’s fine — until the road-walk morning '
          'one objects. The protocol has no folklore in it: mark the swelling edge with a time, '
          'immobilize the limb, jewelry off, evacuate now. No cutting, no sucking, no ice, no chasing '
          'the snake for identification.'),
         ('What’s a realistic thru-hiker first aid kit?',
          'One that restocks at gas stations: tape for feet, gloves, gauze, an elastic wrap, and the '
          'over-the-counter basics. If an item survives three shakedowns and you still can’t say what '
          'it’s for, mail it home. Start from the <a href="../kit.html">kit checklist</a> and argue '
          'with every gram.')],
 'slug': 'thru-hikers',
 'title': 'Free Wilderness First Aid for Thru-Hikers'},

{'cat': 'Trail & Mountain',
 'cert': 'Self-supported racing makes you the medical plan by rule. If an event, club, or guiding outfit '
         'wants a provider’s card, take that class — this record of completion isn’t one, but you’ll show '
         'up ahead of the syllabus.',
 'days': [('Washboard, then quiet.',
           'The front wheel washes out on a rated-easy descent and your partner’s collarbone gives a '
           'familiar crunch. The nearest town has one store, no clinic, and thirty gravel miles of '
           'distance.'),
          ('Hike-a-bike, sharp rock.',
           'A slip on the push opens a shin deep enough to matter. Direct pressure, held without peeking, '
           'beats everything else in the framebag.'),
          ('He clips back in.',
           'Your partner goes down hard, dusts off, and rides on. Two hours later he’s pale and slow on '
           'every riser — a pulse taken twice at the crash site would have told you sooner.')],
 'desc': 'Free first aid for bikepackers and gravel cyclists: crash assessment far from cell service, '
         'bleeding control, splinting, and the ride-or-wait call.',
 'eyebrow': 'For bikepackers & gravel cyclists',
 'h1': 'You planned the route. Plan the crash.',
 'lead': 'Bikepacking puts the crash farther from the ambulance than almost any way you can travel — you '
         'carry speed, load, and remoteness in the same bag. When a wheel washes out two ridgelines past '
         'your last bar of signal, the first responder is whoever you’re riding with. Free course; bring '
         'them.',
 'path': [('02_Patient_Assessment', 'Patient Assessment',
           'the post-crash check that catches what adrenaline is hiding'),
          ('04_Bleeding_Wounds', 'Bleeding & Wounds',
           'gravel, chainrings, and rock do sharp-object damage'),
          ('06_Musculoskeletal', 'Musculoskeletal Injuries',
           'collarbones and wrists are cycling’s oldest bill'),
          ('13_Evacuation', 'Evacuation', 'when the bail points sit forty miles apart, decide like it'),
          ('15_Kits_Preparation', 'Kits & Preparation',
           'what makes the cut in a framebag kit when every gram argues')],
 'sims': [('sim.html', 'The Rider Down', 'a crash, a broken leg, and every decision that follows'),
          ('sims/guy-whos-fine.html', 'The Guy Who’s Fine',
           'the crash your partner almost walks away from'),
          ('sims/stop-peeking.html', 'Stop Peeking', 'pressure that holds while you want to look')],
 'h2_days': 'Thirty gravel miles from a clinic',
 'h2_path': 'Route-planning for your brain',
 'path_intro': 'Load these five before the next overnighter:',
 'slug': 'bikepackers',
 'title': 'Free First Aid for Bikepackers & Gravel Cyclists'},

{'cat': 'Trail & Mountain',
 'cert': 'Rope rescue, partner assists, and swiftwater skills live in canyoneering courses — the ACA’s '
         'rescue curriculum and a swiftwater class are worth every dollar. This is the patient side of '
         'that education: free, before, and in between.',
 'days': [('The eight-foot jump lands wrong.',
           'An ankle folds on a hidden ledge two rappels below the rim. She can’t weight it, the exit is a '
           'mile of narrows downstream, and "go back" stopped being an option an hour ago.'),
          ('Clear sky, brown water.',
           'The storm is twenty miles away over a plateau you can’t see. Reading the drainage before you '
           'drop in is scene safety at canyon scale — runoff doesn’t care where the rain fell.'),
          ('The exit gully at 104.',
           'The technical section went fine. The sandstone exit in full sun is where your partner stops '
           'sweating and starts talking nonsense — and the cooling happens there, not at the car.')],
 'desc': 'Free wilderness first aid for canyoneers: flash-flood scene judgment, ankle injuries in the '
         'narrows, heat illness, and evacuation from committed terrain.',
 'eyebrow': 'For canyoneers & slot canyon explorers',
 'h1': 'The only way out is through. Now add a patient.',
 'lead': 'Canyons are committing by design — once the rope is pulled, the exit is downstream, through '
         'whatever the route holds. This course won’t teach you rope rescue or hauling systems; take a '
         'canyon rescue class for that. It teaches the other half of a bad day: the medicine, and the '
         'decisions, once somebody’s hurt.',
 'path': [('01_Provider_Safety', 'Provider Safety',
           'flash-flood judgment is scene safety with a bigger clock'),
          ('06_Musculoskeletal', 'Musculoskeletal Injuries',
           'ankles and lower legs pay for every jump and downclimb'),
          ('09_Cold', 'Cold Injuries',
           'the swims run cold in July — wetsuits delay it, they don’t cancel it'),
          ('08_Heat', 'Heat Illness', 'canyon country cooks the approach and the exit'),
          ('13_Evacuation', 'Evacuation', 'help has to reach a slot it can’t see into — plan for that')],
 'sims': [('sims/hero-complex.html', 'Hero Complex', 'the scene that wants to make it two patients'),
          ('sims/wiggle-feel-warm.html', 'Wiggle, Feel, Warm',
           'splint doctrine and the CSM check your ankle patient needs'),
          ('sims/cool-first.html', 'Cool First', 'heat stroke where the shade isn’t')],
 'h2_days': 'Committed terrain, committed problems',
 'h2_path': 'Read these before you drop in',
 'path_intro': 'Ordered for the way canyons stack their hazards:',
 'slug': 'canyoneers',
 'title': 'Free Wilderness First Aid for Canyoneers'},

{'cat': 'Trail & Mountain',
 'cert': 'There’s no first aid card for disc golf, and this isn’t one — it’s a record of completion, not a '
         'credential. If you run leagues or direct tournaments, pairing this with an in-person CPR and '
         'first aid class from the Red Cross or AHA is the responsible-adult move.',
 'days': [('The drive found the ravine. So did you.',
           'Sidehill leaves, hidden roots, and an ankle that pops on the scramble down. The walk back '
           'crosses six holes — or doesn’t, if somebody knows how to splint and when to send for help.'),
          ('Reaching into the rough.',
           'The disc is under a bush, and something under the bush objects. Copperhead bites are rarely '
           'fatal and never optional: mark the swelling edge, pull the rings off, and get moving toward '
           'care — no cutting, no sucking, no ice.'),
          ('Hole 14, bee, wheeze.',
           'A sting at the tee pad turns into hives by the fairway and a tight chest at the basket. '
           'Somebody’s bag needs epi in it, and everybody needs to know it goes in now — not after the '
           'antihistamine.')],
 'desc': 'Free first aid for disc golfers on wooded courses: bee-sting anaphylaxis, snakes in the rough, '
         'heat on the back nine, and ankles a long walk from the lot.',
 'eyebrow': 'For disc golfers on wooded & remote courses',
 'h1': 'The back nine doesn’t have cell service either.',
 'lead': 'A wooded back nine puts you a mile of trees from the parking lot without ever feeling like a '
         'hike. The rough has bees and snakes, July has league night, and ravines collect ankles at the '
         'bottom of every blown drive. Twenty minutes from the lot still needs a plan — this one’s free.',
 'path': [('10_Anaphylaxis', 'Anaphylaxis', 'the bee sting that stops being a bee sting'),
          ('12_Bites_Stings', 'Bites & Stings', 'the rough is habitat — reach in accordingly'),
          ('08_Heat', 'Heat Illness', 'July league night is an endurance event with baskets'),
          ('06_Musculoskeletal', 'Musculoskeletal Injuries', 'ravines and root balls collect ankles'),
          ('11_Medical', 'Medical Emergencies',
           'chest pain on a hilly course deserves more respect than "I’m out of shape"')],
 'sims': [('sims/find-the-epi.html', 'Find the Epi', 'whose bag is it in? the wrong answer is nobody’s'),
          ('sims/sharpie-on-the-leg.html', 'Sharpie on the Leg',
           'the marker, the time, and none of the folklore'),
          ('sims/cool-first.html', 'Cool First',
           'when your doubles partner stops making sense in the heat')],
 'h2_days': 'League-night incidents',
 'h2_path': 'Five lessons between rounds',
 'path_intro': 'Short lessons, ordered by what wooded courses actually produce:',
 'slug': 'disc-golfers',
 'title': 'Free First Aid for Disc Golfers'},

]
