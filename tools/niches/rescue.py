# Rescue & Public Safety niche pages (beyond core.py's 'sar'). Format: tools/niches/README.md
NICHES = [
{'cat': 'Rescue & Public Safety',
 'cert': 'State and department EMR or EMT requirements for medical response are real, and this course '
         'contributes hours toward none of them. Treat it as study support: fluency before the class, '
         'sharpness between the calls.',
 'days': [('Chest pain at the ranch.',
           'He met you at the gate, and everyone takes that as a good sign — it isn’t. Crushing '
           'pressure, sweat, denial: stop the walking, sit him down, aspirin if nothing forbids it.'),
          ('The hunter two ridges in.',
           'Dispatch has a cell ping and a description of a gate. Everything between your brush truck '
           'and the ambulance rendezvous is assessment, packaging, and a carry — the wilderness half of '
           'the fire job.'),
          ('The rollover on the county road.',
           'High-energy mechanism, an ejected passenger quiet in the grass, eight minutes before the '
           'next unit. Snoring isn’t sleeping — the airway comes before everything but the bleeding.')],
 'desc': 'Free, no-signup study for volunteer firefighters in rural and WUI districts: patient care in '
         'the EMS gap, cardiac calls, airway basics, and the wilderness-adjacent response.',
 'eyebrow': 'For volunteer firefighters in rural & wildland-urban interface districts',
 'h1': 'The ambulance is twenty-five minutes out. You’re already there.',
 'lead': 'Small departments run medical calls whether or not the district can staff an ambulance — '
         'which makes the first-due engine the patient’s whole medical system for a while. This course '
         'is the wilderness-adjacent half of that job: the hunter, the rancher, the hiker your district '
         'catches because nobody else will.',
 'path': [('02_Patient_Assessment',
           'Patient Assessment',
           'the system that fills the gap before the ambulance'),
          ('11_Medical',
           'Medical Emergencies',
           'chest pain, sugar, and the calls that fill the run log'),
          ('03_Airway',
           'Airway & Breathing',
           'positioning an airway you can hear — no equipment required'),
          ('05_Shock', 'Shock', 'the trend that tells you how fast this is going bad'),
          ('13_Evacuation',
           'Evacuation',
           'rendezvous points, messengers, and moving patients toward help')],
 'sims': [('sims/not-indigestion.html',
           'It’s Not Indigestion',
           'denial, aspirin, and the collapse branch'),
          ('sims/snoring-isnt-sleeping.html',
           'Snoring Isn’t Sleeping',
           'the passenger who sounds asleep and isn’t'),
          ('sims/guy-whos-fine.html',
           'The Guy Who’s Fine',
           'serial vitals catch the quiet bleed')],
 'h2_days': 'First-due, no ambulance',
 'h2_path': 'Between-calls study order',
 'path_intro': 'Ordered by what your run log already says:',
 'slug': 'rural-firefighters',
 'title': 'Free Wilderness First Aid for Rural Volunteer Firefighters'},

{'cat': 'Rescue & Public Safety',
 'cert': 'Agency training requirements — academy medical blocks, in-service standards, whatever your '
         'department mandates — stand untouched. This is prep before the academy and fluency between '
         'in-services, not a line on a training record.',
 'days': [('The overlook, mid-August.',
           'A visitor goes down in line at the scenic pullout: gray, sweating, a hand on his sternum. '
           'You’re the only responder for forty minutes, and the first five matter most.'),
          ('A mile up the nature trail.',
           'The heat call turns out to be a hiker who’s stopped sweating and stopped making sense. '
           'That’s heat stroke — cool aggressively right there, with whatever water the crowd is '
           'carrying.'),
          ('The creel check that changes.',
           'The angler you stopped mentions the snake only when you notice the swelling. Sharpie the '
           'edge, note the time, jewelry off — and none of the folklore.')],
 'desc': 'Free, no-signup wilderness first aid for park rangers, game wardens, and conservation '
         'officers: solo-patrol response to heat stroke, cardiac events, and snakebite until backup '
         'arrives.',
 'eyebrow': 'For park rangers, game wardens & conservation officers',
 'h1': 'First on scene is the job description.',
 'lead': 'Rangers, wardens, conservation officers — different patches, same math: solo patrol, big '
         'country, and every visitor emergency lands on you first. Until backup makes the trailhead, '
         'the officer is also the medic. This is the medicine for that stretch of the call, free.',
 'path': [('02_Patient_Assessment',
           'Patient Assessment',
           'the first-on-scene system, run alone until backup'),
          ('11_Medical',
           'Medical Emergencies',
           'the visitor cardiac — denial, aspirin, and early help'),
          ('08_Heat', 'Heat Illness', 'trailhead to heat stroke, and the cool-first doctrine'),
          ('12_Bites_Stings', 'Bites & Stings', 'snake calls without the folklore'),
          ('13_Evacuation',
           'Evacuation',
           'sizing an incident when you are the resources')],
 'sims': [('sims/not-indigestion.html',
           'It’s Not Indigestion',
           'the parking-lot collapse, start to finish'),
          ('sims/cool-first.html', 'Cool First', 'aggressive cooling before anyone drives anywhere'),
          ('sims/sharpie-on-the-leg.html',
           'Sharpie on the Leg',
           'mark the edge, watch the clock')],
 'h2_days': 'Solo-patrol calls',
 'h2_path': 'Patrol-truck reading order',
 'path_intro': 'Ordered by what visitors actually do:',
 'slug': 'rangers-wardens',
 'title': 'Free Wilderness First Aid for Rangers & Game Wardens'},

{'cat': 'Rescue & Public Safety',
 'cert': 'OEC — Outdoor Emergency Care, through the National Ski Patrol — is the patrol credential, and '
         'this substitutes for none of it. Use it to walk into your OEC course fluent, and to keep the '
         'doctrine warm between seasons.',
 'days': [('The glade with a new angle.',
           'A skier’s lower leg found a buried stump and now points somewhere novel. Splint before the '
           'sled, check circulation before and after, and keep a toe window you can actually see.'),
          ('Sweep finds the overdue snowboarder.',
           'He’s been sitting in the trees since last chair, and he’s stopped shivering without getting '
           'any warmer. Gentle handling and the wrap are the whole ride down.'),
          ('“My neck hurts” at the top of the steeps.',
           'Conscious, talking, helmet on, neck sore — and the sled is below him on a 30-degree pitch. '
           'Packaging him and moving him both have to happen, in the right order, head in the right '
           'hands.')],
 'desc': 'Free, no-signup study for ski patrol candidates and resort staff: cold injuries, on-slope '
         'splinting and packaging, and transport decisions. Pre-season prep for OEC, not a substitute.',
 'eyebrow': 'For ski patrol volunteers & resort safety staff',
 'h1': 'Patrol runs on OEC. Show up already speaking it.',
 'lead': 'Outdoor Emergency Care is the patrol credential, and there’s no shortcut into it — this '
         'course isn’t one hour of OEC and doesn’t pretend to be. It’s for the candidate waiting on the '
         'fall class and the patroller keeping the off-season from eating their edge: the same doctrine, '
         'told at lay-rescuer level.',
 'path': [('09_Cold',
           'Cold Injuries',
           'hypothermia, frostbite, and the wrap — patrol’s home terrain'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'splint before the sled, and prove CSM twice'),
          ('07_Spine', 'Spine & Helmets', 'packaging doctrine, including the helmet question'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'the on-slope system, from scene to serial vitals'),
          ('13_Evacuation',
           'Evacuation',
           'sled now, sled later, or call for more — the decision chain at our level')],
 'sims': [('sims/the-burrito.html', 'The Burrito', 'the wrap, insulation under first'),
          ('sims/dont-sit-him-up.html',
           'Don’t Sit Him Up',
           'packaging a spine that still has to go downhill'),
          ('sims/wiggle-feel-warm.html',
           'Wiggle, Feel, Warm',
           'the terrain-park wrist, checked twice')],
 'h2_days': 'What sweep finds',
 'h2_path': 'Pre-season doctrine order',
 'path_intro': 'Ordered the way the hill teaches it:',
 'slug': 'ski-patrol',
 'title': 'Free Wilderness First Aid for Ski Patrol Volunteers'},

]
