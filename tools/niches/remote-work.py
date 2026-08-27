# Remote Work & Field Science niche pages. Entry format documented in tools/niches/README.md
NICHES = [
{'cat': 'Remote Work & Field Science',
 'cert': 'If your employer or university requires certified first-aid training in its field safety plan, '
         'that requirement stands — take the class it names. This is the personal competence underneath '
         'the paperwork: what you actually do while the plan is still ringing phones.',
 'days': [('Snake country, vegetation sampling.',
           'You reach into the sedge for the quadrat frame and something reaches back. Sharpie the '
           'swelling edge, note the time, keep the limb still — and skip every remedy the movies taught '
           'you.'),
          ('June, full sun, no shade on the grid.',
           'Your tech has been flagging plots since seven and now she’s answering questions from some '
           'other survey. Altered means heat stroke — cooling starts at the plot, not back at the truck.'),
          ('The check-in that doesn’t come.',
           'Your partner is wading a sample site two drainages over and misses the 1400 call. The '
           'protocol you agreed on before the season — window, route, response — is now the whole plan.')],
 'desc': 'Free, no-signup wilderness first aid for field biologists, ecologists, geologists, and '
         'environmental consultants: snakebite protocol, heat on survey grids, and check-in discipline '
         'for solo work.',
 'eyebrow': 'For field biologists, ecologists & environmental consultants',
 'h1': 'The safety plan lives in a binder. You’re at flag 47.',
 'lead': 'Biologists, ecologists, geologists, wetland delineators, environmental consultants — fieldwork '
         'sends small crews and solo techs into terrain most people avoid, on schedules nobody watches. '
         'Your employer’s safety plan is real, and this is the competence it quietly assumes: the twenty '
         'minutes you handle alone before the plan kicks in.',
 'path': [('02_Patient_Assessment',
           'Patient Assessment',
           'the system for the crewmate down at a site with no name'),
          ('12_Bites_Stings',
           'Bites & Stings',
           'snake protocol for people paid to reach into vegetation'),
          ('08_Heat', 'Heat Illness', 'survey grids don’t come with shade — read the spectrum early'),
          ('01_Provider_Safety', 'Provider Safety', 'solo and two-person crews: one patient stays one'),
          ('13_Evacuation',
           'Evacuation',
           'the check-in protocol is medicine — build it before the season')],
 'sims': [('sims/sharpie-on-the-leg.html',
           'Sharpie on the Leg',
           'the bite at boot level, without the folklore'),
          ('sims/cool-first.html', 'Cool First', 'heat stroke at the far plot'),
          ('sims/two-go-one-stays.html',
           'Two Go, One Stays',
           'the overdue-partner problem, worked properly')],
 'slug': 'field-scientists',
 'title': 'Free Wilderness First Aid for Field Scientists'},

{'cat': 'Remote Work & Field Science',
 'cert': 'If your employer or OSHA requires a first-aid card for your crew, that stands — take that '
         'class. This gets you fluent before it and keeps the skills warm between renewals.',
 'days': [('Kickback, inner thigh.',
           'The saw jumps and the chaps take most of it — most. Bright red and pulsing, high on the '
           'leg: this is the tourniquet’s moment, and fluency beats improvisation.'),
          ('The limb nobody saw.',
           'A dead top lets go and your partner is under it, dazed, neck sore. Overhead hazards first — '
           'then keep him still and ask the spine questions.'),
          ('Cruising alone, unit 40.',
           'You’re solo on a timber cruise when the ground rolls an ankle out from under you. The '
           'check-in window you set this morning is now the rescue plan — be the person who set one.')],
 'desc': 'Free, no-signup first aid for forestry workers, timber cruisers, and arborists: tourniquet '
         'fluency, struck-by trauma, and getting help to a unit with no cell coverage.',
 'eyebrow': 'For forestry workers, timber cruisers & arborists',
 'h1': 'When the chaps don’t catch it.',
 'lead': 'Saws, steep ground, and wood that moves when it shouldn’t — forestry stacks severe-bleeding '
         'risk on top of struck-by risk, then parks it all a drainage past the last cell bar. The '
         'skills that match that profile are learnable in a few evenings, free.',
 'path': [('04_Bleeding_Wounds',
           'Bleeding & Wounds',
           'tourniquets and pressure — the chainsaw curriculum'),
          ('01_Provider_Safety',
           'Provider Safety',
           'overhead hazards don’t stop being hazards when someone’s down'),
          ('07_Spine', 'Spine Injuries', 'struck-by mechanism means spine questions, every time'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'serial vitals on the partner who says he’s fine'),
          ('13_Evacuation', 'Evacuation', 'no bars in the unit — messengers, notes, and a meet point')],
 'sims': [('sims/stop-peeking.html', 'Stop Peeking', 'pressure held through the urge to look'),
          ('sims/dont-sit-him-up.html',
           'Don’t Sit Him Up',
           'the sore neck you still have to move'),
          ('sims/two-go-one-stays.html',
           'Two Go, One Stays',
           'sending for help when nothing has bars')],
 'slug': 'forestry-workers',
 'title': 'Free Wilderness First Aid for Forestry Workers & Arborists'},

{'cat': 'Remote Work & Field Science',
 'cert': 'NWCG sets the training standards for everyone on a fireline, they are not negotiable, and '
         'this course counts toward none of them. It’s for the applicant waiting on a season and the '
         'camp volunteer who wants the medicine underneath the quals.',
 'days': [('1400 on the line, division in the sun.',
           'Your sawyer stops making sense mid-swamp. Altered mental status is heat stroke, and it gets '
           'cooled right there with what the crew is carrying — not back at the buggy.'),
          ('Day-twelve feet.',
           'What started as a hot spot is now a raw mess that has to survive fourteen more days in the '
           'same boots. Blister and wound care is unglamorous and completely mission-relevant.'),
          ('The hike out at 8,000 feet.',
           'A twenty-year veteran goes gray on the climb, rubbing his chest and blaming the smoke. Hard '
           'work at altitude finds hearts — stop the exertion, sit him down, take it seriously.')],
 'desc': 'Free, no-signup study for wildland firefighters and support crews: heat illness on the line, '
         'blister and boot-injury care, cardiac warning signs at altitude. Not NWCG training — the '
         'fluency under it.',
 'eyebrow': 'For wildland firefighters & support crews',
 'h1': 'Heat, not flame, fills the medical tent.',
 'lead': 'If you’re waiting on a season, chasing a first call, or working camp support, your quals run '
         'through NWCG and nothing here counts toward them. What this covers is the layer underneath: '
         'the crewmate who’s overheating, the feet that are coming apart, and the chest pain everyone '
         'wants to blame on smoke.',
 'path': [('08_Heat',
           'Heat Illness',
           'the fireline’s steadiest injury — the spectrum, and cool first'),
          ('04_Bleeding_Wounds',
           'Bleeding & Wounds',
           'blister-to-boot-injury care that keeps feet in the fight'),
          ('11_Medical',
           'Medical Emergencies',
           'chest pain during hard work at altitude, and the denial that rides with it'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'serial vitals on a crewmate — the trend is the truth'),
          ('13_Evacuation', 'Evacuation', 'vehicle-accessible or line evac — do that math early')],
 'sims': [('sims/cool-first.html', 'Cool First', 'heat stroke on the line, cooled there'),
          ('sims/not-indigestion.html',
           'It’s Not Indigestion',
           'the chest pain everyone blames on smoke'),
          ('sims/guy-whos-fine.html',
           'The Guy Who’s Fine',
           'serial vitals on the crewmate who shook it off')],
 'slug': 'wildland-fire',
 'title': 'Free Wilderness First Aid for Wildland Firefighters'},

{'cat': 'Remote Work & Field Science',
 'cert': 'Many corps and agencies require crew leaders to hold a WFA or WFR card from a recognized '
         'provider — that requirement stands. Members use this to arrive fluent; leaders use it to stay '
         'sharp between hitches.',
 'days': [('The rock moves wrong.',
           'A two-hundred-pounder shifts off the bar and takes a corps member’s foot. Crush injuries '
           'swell — the boot decision, the splint, and the CSM checks start now, not at the trailhead.'),
          ('The axe glances.',
           'Limbing at the end of a long day, the bit skips off a knot and opens a shin. Direct '
           'pressure, held without peeking, while the crew leader runs the rest of the scene.'),
          ('Day six of eight.',
           'A crew member has been quiet since breakfast and now can’t keep water down. Sick, far in, '
           'six days of work still scheduled — the evac decision is yours, and hope is not a plan.')],
 'desc': 'Free, no-signup wilderness first aid for trail crews, conservation corps, and volunteer '
         'stewards: crush injuries, tool lacerations, and the evacuation call from a hitch-deep '
         'worksite.',
 'eyebrow': 'For trail crews, conservation corps & volunteer stewards',
 'h1': 'Sharp tools, green hands, a hitch from the road.',
 'lead': 'Corps crews, agency trail crews, and volunteer trail and park stewards do industrial work in '
         'wilderness settings: rock bars, crosscuts, axes, and a roster of mixed experience, days from '
         'a trailhead. If you lead, a crew’s worth of bodies is your responsibility — this is the '
         'medicine for that job, free.',
 'path': [('04_Bleeding_Wounds',
           'Bleeding & Wounds',
           'edge tools write the curriculum — pressure, packing, dressing'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'crush and fracture care, splinted with what the crew carries'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'a system the greenest crew member can follow'),
          ('13_Evacuation', 'Evacuation', 'messengers, notes, and spending a crew wisely'),
          ('15_Kits_Preparation',
           'Kits & Preparation',
           'the crew kit, scaled for ten people and eight days')],
 'sims': [('sims/stop-peeking.html', 'Stop Peeking', 'direct pressure, held like you mean it'),
          ('sims/wiggle-feel-warm.html',
           'Wiggle, Feel, Warm',
           'splint it, then prove the fingers still work'),
          ('sims/two-go-one-stays.html',
           'Two Go, One Stays',
           'who goes, who stays, what the note says')],
 'slug': 'trail-crews',
 'title': 'Free Wilderness First Aid for Trail Crews & Conservation Corps'},

{'cat': 'Remote Work & Field Science',
 'cert': 'Your employer’s safety program — fall protection, LOTO, whatever first-aid card the contract '
         'requires — stands, and this replaces none of it. It’s the depth behind the card: fluency for '
         'the hour before the ambulance finds the gate.',
 'days': [('String 14, no shade anywhere.',
           'Mid-July commissioning, and your coworker’s answers stop matching your questions. The array '
           'is a reflector oven — cooling starts between the rows, with the water on the truck.'),
          ('The ladder at the laydown yard.',
           'Twelve feet off the top of a conex onto hardpan, and he’s up laughing before you get there. '
           'Take vitals anyway, then again in fifteen — the trend is the truth.'),
          ('Calling 911 from a road with no name.',
           'Dispatch wants an address; you have a turbine number and eleven miles of gravel. What you '
           'stage before the season — pins, gate codes, a meet point — is measured in minutes saved.')],
 'desc': 'Free, no-signup first aid for wind and solar field techs: heat illness on the array, ladder '
         'falls, and getting an ambulance to a nameless access road.',
 'eyebrow': 'For wind & solar field technicians',
 'h1': 'The nearest cross street is forty miles back.',
 'lead': 'Wind and solar work is remote work with a badge: hours of gravel to the site, heat coming off '
         'the array, lone tasks, and a 911 address that doesn’t exist. Your employer trains you not to '
         'get hurt — this is what to do when somebody is anyway.',
 'path': [('08_Heat', 'Heat Illness', 'panel glare and turbine climbs — catch the spectrum early'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'ladder and vehicle injuries, splinted for a long ride out'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'serial vitals on the coworker who bounced up fine'),
          ('13_Evacuation', 'Evacuation', 'the site-address problem, solved before you dial'),
          ('15_Kits_Preparation',
           'Kits & Preparation',
           'a truck kit built for the site, not the glovebox')],
 'sims': [('sims/cool-first.html', 'Cool First', 'heat stroke between the rows'),
          ('sims/guy-whos-fine.html', 'The Guy Who’s Fine', 'the ladder fall that looked fine'),
          ('sims/two-go-one-stays.html', 'Two Go, One Stays', 'making one bar of signal count')],
 'slug': 'renewable-techs',
 'title': 'Free First Aid for Wind & Solar Field Technicians'},

{'cat': 'Remote Work & Field Science',
 'cert': 'If a production, client, or permit requires a certified provider on a remote shoot, that '
         'class is the answer — this isn’t a credential. It’s how you show up already fluent, and stay '
         'that way between gigs.',
 'days': [('The scramble to the vantage.',
           'Loose rock, thirty pounds of kit, and a hand thrown out on the way down. Wrist fractures '
           'love photographers — splint it, check the fingers, then figure out how you’re walking out.'),
          ('Golden hour at nineteen degrees.',
           'Standing still behind a tripod for two hours is a hypothermia strategy. When your shooting '
           'partner’s shivering quits on its own, that’s worsening, not improving.'),
          ('Somebody else’s worst day.',
           'The skier you’re shooting doesn’t get up. The camera goes in the snow, and the questions '
           'become scene, spine, bleeding — in that order, from the person hired to watch.')],
 'desc': 'Free, no-signup wilderness first aid for outdoor photographers and documentary crews: falls '
         'on scrambles, cold exposure on long shoots, and being first to someone else’s accident.',
 'eyebrow': 'For outdoor & adventure photographers and documentary crews',
 'h1': 'Half the pack is glass. None of it stops bleeding.',
 'lead': 'Photographers and documentary crews work the same terrain as their subjects, at worse hours, '
         'with heavier packs — and often alone. And when the athlete in the frame goes down, you stop '
         'being the observer: you’re the closest set of hands, sometimes the only one.',
 'path': [('01_Provider_Safety',
           'Provider Safety',
           'the shot never outranks the scene — read it before you move'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'a system for the day you’re second on scene at someone else’s accident'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'falls with heavy packs — wrists, ankles, and the splint'),
          ('09_Cold', 'Cold Injuries', 'standing still is exposure — know the ladder down and the wrap'),
          ('13_Evacuation', 'Evacuation', 'you scouted the approach — use it to get help in')],
 'sims': [('sims/hero-complex.html',
           'Hero Complex',
           'the accident you were pointing a camera at'),
          ('sims/wiggle-feel-warm.html',
           'Wiggle, Feel, Warm',
           'the wrist you caught yourself with'),
          ('sims/the-burrito.html', 'The Burrito', 'the wrap for the partner who got too cold')],
 'slug': 'outdoor-photographers',
 'title': 'Free Wilderness First Aid for Outdoor Photographers'},

]
