# Rural & Homesteading niche pages. Entry format documented in tools/niches/README.md
# Note: core.py already carries 'hunters' (general hunters & anglers) in this category.
NICHES = [
{'cat': 'Rural & Homesteading',
 'cert': 'If you organize with a county CERT team or volunteer fire, their training requirements stand — '
         'this gets you fluent before the class and keeps you sharp after. A hands-on Stop the Bleed '
         'session is a worthwhile Saturday; bring the neighbors.',
 'days': [('The saw kicks back.',
           'Chainsaws don’t make neat wounds. A leg opens up at the woodpile, forty minutes of gravel from '
           'help, and the next three minutes belong to whoever is standing there — tourniquet or pressure, '
           'decided fast, done without flinching.'),
          ('The kettle lives on the stove.',
           'Wood heat is a five-hundred-degree steel box at kid height. Burn care is family medicine out '
           'here: cool it, cover it, and judge honestly whether this one needs the drive.'),
          ('The heifer didn’t mean it.',
           'She catches your husband square in the ribs at the chute, and he waves it off. Blunt trauma '
           'bleeds where you can’t see it — the second set of vitals is the one that tells the truth.')],
 'desc': 'Free first aid for off-grid homesteaders: chainsaw wounds, wood-stove burns, livestock kicks, and '
         'what to do while the ambulance is forty minutes out.',
 'eyebrow': 'For off-grid homesteaders & self-reliance folks',
 'h1': 'Forty minutes from an ambulance, on purpose.',
 'lead': 'You chose the distance, and the distance has a medical side: the saw, the stove, the stock, and '
         'a family whose nearest ER is a long drive on a bad road. Learning this is self-reliance in the '
         'oldest sense — a skill, not a purchase. If you run a neighborhood preparedness or resilience '
         'group, it works as the shared medical layer too: free, so the whole group can take it.',
 'path': [('04_Bleeding_Wounds',
           'Bleeding, Wounds & Burns',
           'the chainsaw, the splitter, and the stove — pressure, tourniquets, and burn care in one lesson'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'a system that holds when the patient is your spouse and your hands are shaking'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'ladder falls and livestock kicks — splint it right the first time'),
          ('13_Evacuation', 'Evacuation', 'when to drive, when to call, and how to make forty minutes shorter'),
          ('15_Kits_Preparation',
           'Kits & Preparation',
           'a real kit for the shop, the barn, and the truck — stocked for your actual hazards')],
 'sims': [('sims/stop-peeking.html', 'Stop Peeking', 'deep laceration, steady pressure — the chainsaw drill'),
          ('sims/guy-whos-fine.html', 'The Guy Who’s Fine', 'blunt trauma hides — vitals twice, believe the trend'),
          ('sims/wiggle-feel-warm.html', 'Wiggle, Feel, Warm', 'the splint check you’ll be doing on family')],
 'h2_days': 'The woodpile ledger',
 'h2_path': 'Kitchen-table study order',
 'path_intro': 'Read these five first — evenings, kitchen table, whole family:',
 'slug': 'homesteaders',
 'title': 'Free First Aid for Off-Grid Homesteaders'},

{'cat': 'Rural & Homesteading',
 'cert': 'If you employ a crew, an OSHA-recognized first aid card may be a requirement — take that class '
         'from a listed provider and walk in already fluent. Farm bureau and extension safety days are '
         'worth a morning; this pairs with them, it doesn’t replace them.',
 'days': [('The PTO doesn’t give it back.',
           'By the time the shaft stops turning, the damage is done and the bleeding is the emergency. '
           'Tourniquet-first is the doctrine for a limb like that — learn it before the day you need it '
           'one-handed.'),
          ('Second cutting, 102 in the shade.',
           'Halfway through the load your hired kid staggers and can’t answer a straight question. That’s '
           'heat stroke, not soft — cool him right there with the stock tank and the hose, and let the '
           'truck wait.'),
          ('The neighbor says it’s his shoulder.',
           'He’s gray, sweating through his shirt, and bound on fixing the baler. Crushing chest pain plus '
           'denial is the classic presentation — sit him down, aspirin if nothing rules it out, and make '
           'the call he won’t.')],
 'desc': 'Free first aid for ranchers, farmers, and rural landowners: bleeding control on machinery, heat '
         'illness in haying season, and guiding EMS to a gate.',
 'eyebrow': 'For ranchers, farmers & rural landowners',
 'h1': 'The ER is an hour out. The work doesn’t care.',
 'lead': 'The machinery doesn’t forgive, the stock outweighs you five to one, and the culture says finish '
         'the job before mentioning the injury. Your place is a workplace where the ambulance needs '
         'directions to a gate, not an address. This is first aid for that hour — free, at the kitchen '
         'table, in a couple of evenings.',
 'path': [('04_Bleeding_Wounds',
           'Bleeding, Wounds & Burns',
           'augers, PTOs, and balers — the tourniquet is farm equipment now'),
          ('08_Heat', 'Heat Illness', 'haying-season physiology: the spectrum, and cool-first when it tips over'),
          ('11_Medical',
           'Medical Emergencies',
           'chest pain, denial, and aspirin, for a demographic that won’t sit down'),
          ('05_Shock', 'Shock', 'the trend that says whether the kick was nothing or a countdown'),
          ('13_Evacuation',
           'Evacuation',
           'meeting the ambulance: gate names, section lines, and somebody standing at the road')],
 'sims': [('sims/not-indigestion.html', 'It’s Not Indigestion', 'the stoic neighbor, the chest pain, the call'),
          ('sims/cool-first.html', 'Cool First', 'heat stroke in the field, cooled where he dropped'),
          ('sims/guy-whos-fine.html', 'The Guy Who’s Fine', 'kicked, laughing, and quietly bleeding inside')],
 'h2_days': 'What the place serves up',
 'h2_path': 'Five lessons between chores',
 'path_intro': 'Ordered by what actually comes through the gate:',
 'slug': 'ranchers',
 'title': 'Free First Aid for Ranchers & Farmers'},

{'cat': 'Rural & Homesteading',
 'cert': 'No one checks a card at the trailhead in September, and hunter education barely touches this. '
         'If you work for an outfitter that requires a WFR, take that course — this is the fluency '
         'underneath it, free, in the offseason.',
 'days': [('Razor blades travel in fours.',
           'A broadhead finds your palm while you’re quartering by headlamp — surgical-sharp and deeper '
           'than it looks. Direct pressure without peeking is the whole skill, and you may be doing it '
           'one-handed by feel.'),
          ('Twenty feet is a mechanism.',
           'The strap lets go at the transition and you’re on your back under the stand — or hanging in '
           'the harness above it. Either way the spine questions come first, and “walk it off” isn’t one '
           'of them.'),
          ('The pack-out flips on you.',
           'Second load of elk out, base layers soaked, temperature dropping with the light. Hypothermia '
           'starts as clumsy and stupid — recognizing it in yourself, alone, is the hard version of this '
           'course.')],
 'desc': 'Free wilderness first aid for backcountry bowhunters: broadhead lacerations, treestand falls, cold '
         'pack-outs, and hunting alone without disappearing.',
 'eyebrow': 'For big game hunters & backcountry bowhunters',
 'h1': 'Three miles past the last boot print.',
 'lead': 'Archery seasons pull you deeper, earlier, and more alone than rifle season ever does — a quiver '
         'of razor blades, a stand twenty feet up, a pack-out that starts sweaty and ends cold. Nobody '
         'wanders past at mile seven in dark timber. The first rescuer on scene is you, so train like it.',
 'path': [('04_Bleeding_Wounds',
           'Bleeding & Wounds',
           'broadheads and boning knives cut deeper than they look — pressure and packing, done right'),
          ('07_Spine', 'Spine Injuries', 'a treestand fall is the textbook high-energy mechanism'),
          ('09_Cold', 'Cold Injuries', 'the sweat-soaked pack-out is a hypothermia machine'),
          ('13_Evacuation',
           'Evacuation',
           'solo protocols: the plan you leave, the check-ins you keep, the hour someone starts looking'),
          ('15_Kits_Preparation', 'Kits & Preparation', 'what earns its ounces in a bino harness and a kill kit')],
 'sims': [('sims/stop-peeking.html', 'Stop Peeking', 'deep laceration, pressure held — the broadhead drill'),
          ('sims/guy-whos-fine.html',
           'The Guy Who’s Fine',
           'a ground fall from stand height, and the vitals that argue'),
          ('sims/the-burrito.html', 'The Burrito', 'wrap the cold hunter before cold becomes the emergency')],
 'h2_days': 'September problems',
 'h2_path': 'Offseason study order',
 'path_intro': 'Ordered for the way archery seasons go wrong:',
 'slug': 'bowhunters',
 'title': 'Free Wilderness First Aid for Bowhunters'},

{'cat': 'Rural & Homesteading',
 'cert': 'If you pack or guide for an outfitter, a WFR card is often the hiring bar — take that course, '
         'and use this to arrive fluent and stay sharp between recerts. For everyone else there’s no card '
         'at the trailhead, just whether you know what to do when the dust settles.',
 'days': [('The spook and the rock.',
           'She comes off hard at the creek crossing onto ground that doesn’t give. High-energy mechanism '
           'plus a sore neck means the spine questions come before the remount — and the helmet comes off '
           'by doctrine or not at all.'),
          ('Wrong side of the mare.',
           'A kick is a crush injury delivered at the speed of reflex. Splint what’s broken with what the '
           'panniers carry, check fingers before and after, and take vitals twice — blunt force does its '
           'worst work out of sight.'),
          ('The wreck where the trail quits.',
           'A pack string tangles in deadfall two drainages from any road. One rider is down, three horses '
           'aren’t caught, and the scene isn’t safe until the stock is — then the evac plan gets built '
           'around the animals that stayed calm.')],
 'desc': 'Free wilderness first aid for horsepackers and equestrian trail riders: thrown riders, kicks and '
         'crush injuries, and evacuation from stock-only country.',
 'eyebrow': 'For horsepackers & equestrian trail riders',
 'h1': 'The thousand-pound variable.',
 'lead': 'Horse wrecks combine high-energy mechanism with terrain no ambulance reaches — a rider thrown '
         'onto rock, a kick that lands like a swung post, and a scene that still contains the horse. This '
         'course covers the human half: assessment, the spine decision, splinting, and evacuation math '
         'when the stock is the ride out.',
 'path': [('01_Provider_Safety',
           'Provider Safety',
           'the scene includes a scared horse — contain it before you kneel, or one patient becomes two'),
          ('07_Spine',
           'Spine & Helmets',
           'thrown riders are why this lesson exists — motion restriction and the helmet call'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'kicks and crushes — splint before anyone gets moved or mounted'),
          ('02_Patient_Assessment', 'Patient Assessment', 'mechanism plus serial vitals, because riders lie politely'),
          ('13_Evacuation',
           'Evacuation',
           'ride out, lead out, or send for help — the math when stock is the ambulance')],
 'sims': [('sims/dont-sit-him-up.html',
           'Don’t Sit Him Up',
           'neck pain with weather moving in — protect the spine while you move'),
          ('sims/guy-whos-fine.html',
           'The Guy Who’s Fine',
           'the kicked rider who’s joking, until the trend says otherwise'),
          ('sims/two-go-one-stays.html', 'Two Go, One Stays', 'sending for help from country without cell bars')],
 'h2_days': 'When the wreck settles',
 'h2_path': 'Barn-aisle reading order',
 'path_intro': 'Ordered for stock country:',
 'slug': 'horsepackers',
 'title': 'Free Wilderness First Aid for Horsepackers'},

{'cat': 'Rural & Homesteading',
 'cert': 'There’s no first aid card for foraging — the credential that keeps mushroom hunters alive is '
         'identification discipline, and you get that from your mycological society and your keys, not '
         'from us. Keep the poison control number (1-800-222-1222 in the US) written somewhere that '
         'doesn’t need a battery.',
 'days': [('The hand goes where the eyes went.',
           'Reaching past the chanterelle into the leaf litter, your fingers find the snake before your '
           'eyes do. Mark the swelling’s edge with a time, jewelry off, keep the arm still, start walking '
           'out — and skip everything the movies taught you.'),
          ('The ground was the nest.',
           'Yellowjackets live under the bramble you’ve been working for twenty minutes. A dozen stings '
           'later your foraging partner has hives and a wheeze — that combination means epinephrine now, '
           'and antihistamines are backup, never the plan.'),
          ('Three ridges past the flagging.',
           'Good patches don’t grow beside trails. An ankle rolls in a creek bottom at dusk, the way back '
           'is a guess, and nobody knows which forest you drove to — that last part is fixable tonight, '
           'free.')],
 'desc': 'Free wilderness first aid for foragers and mushroom hunters: snakebite at hand level, ground-nest '
         'stings, off-trail ankles, and days nobody is tracking.',
 'eyebrow': 'For foragers, herbalists & mushroom hunters',
 'h1': 'Eyes down, feet off the trail.',
 'lead': 'Foraging means hours of head-down wandering off-trail, hands in the same leaf litter snakes and '
         'yellowjackets use, often solo and off everyone’s radar. That exposure profile is exactly what '
         'this course teaches: bites, stings, ankles, and being findable. On ingestion and toxicology we '
         'teach one move only — call poison control early; identification discipline is your craft, not '
         'ours.',
 'path': [('12_Bites_Stings',
           'Bites & Stings',
           'snakes and stinging things live where your hands work — the doctrine, minus the movie medicine'),
          ('10_Anaphylaxis', 'Anaphylaxis', 'ground nests run the sting count up fast — epi first, early'),
          ('06_Musculoskeletal',
           'Musculoskeletal Injuries',
           'off-trail travel is an ankle tax — splint it, then rethink the walk out'),
          ('13_Evacuation',
           'Evacuation',
           'being findable: the plan you leave behind, and when to spend your remaining daylight'),
          ('15_Kits_Preparation', 'Kits & Preparation', 'the kit and the check-in habit that fit beside the basket')],
 'sims': [('sims/sharpie-on-the-leg.html',
           'Sharpie on the Leg',
           'snakebite, and every wrong thing the movies taught you'),
          ('sims/find-the-epi.html', 'Find the Epi', 'stings to wheeze in five minutes — beat the clock'),
          ('sims/two-go-one-stays.html', 'Two Go, One Stays', 'getting help to a patch that isn’t on any map')],
 'h2_days': 'What the leaf litter holds',
 'h2_path': 'Between-seasons reading',
 'path_intro': 'Ordered by what finds your hands first:',
 'slug': 'foragers',
 'title': 'Free First Aid for Foragers & Mushroom Hunters'},

{'cat': 'Rural & Homesteading',
 'cert': 'No one checks a card at a BLM boundary. If a seasonal gig — camp host, campground crew, trail '
         'work — requires a provider’s card, take that class and arrive already fluent; this keeps you '
         'sharp between seasons.',
 'days': [('The stove flares in a two-foot kitchen.',
           'Propane plus a cramped galley plus a loose sleeve — burns are the van-dweller injury. Cool it '
           'right, cover it right, and know which burns end the boondock and start the drive.'),
          ('“What’s your location?”',
           'You sliced your hand breaking down camp, it needs more than your kit, and the road you’re on '
           'has a number only the BLM knows. Coordinates off your phone, landmarks, meeting the ambulance '
           'partway — the call itself is a skill.'),
          ('The rig two sites down.',
           'The guy you waved at yesterday is gray, sweating, and calling it indigestion. Out here the '
           'first wave of EMS is whoever’s parked closest — today that’s you.')],
 'desc': 'Free first aid for vanlifers and full-time RVers: galley burns, the where-am-I 911 call on a '
         'nameless BLM road, and being closest help at a dispersed site.',
 'eyebrow': 'For vanlifers & full-time RV travelers',
 'h1': 'Six miles up a road with no name.',
 'lead': 'Boondocking trades neighbors and street addresses for distance — which is the deal, until '
         'someone’s hurt and 911 asks where you are. Full-timers live solo by default in a rolling kitchen '
         'with a propane stove, and at a dispersed site the nearest help is whoever’s parked two sites '
         'down. (The course teaches the human emergencies. The dog has our sympathy, but pet first aid is '
         'a different class.)',
 'path': [('04_Bleeding_Wounds',
           'Bleeding, Wounds & Burns',
           'the galley curriculum — burns, knife slips, and dressing both from a small kit'),
          ('02_Patient_Assessment',
           'Patient Assessment',
           'be useful at a stranger’s door: introduction, consent, gloves, and a system'),
          ('11_Medical',
           'Medical Emergencies',
           'chest pain, sugar crashes, and known conditions a long way from your doctor'),
          ('13_Evacuation',
           'Evacuation',
           'the where-am-I problem: coordinates, road numbers, and meeting EMS partway'),
          ('15_Kits_Preparation',
           'Kits & Preparation',
           'the kit that lives in the van, and the check-in habit for living alone on purpose')],
 'sims': [('sims/not-indigestion.html',
           'It’s Not Indigestion',
           'the neighbor’s chest pain, and the call he doesn’t want made'),
          ('sims/two-go-one-stays.html',
           'Two Go, One Stays',
           'getting help to a spot with no address while the phone dies'),
          ('sims/cool-first.html', 'Cool First', 'desert boondocking heat, cooled where it happens')],
 'h2_days': 'Parked far out',
 'h2_path': 'Rainy-day reading order',
 'path_intro': 'Ordered for life at the end of a numbered road:',
 'faq_title': 'Camp-chair questions',
 'faq': [('How do I tell 911 where I am when the road has no name?',
          'Your phone’s GPS works without cell signal — pull the coordinates from any map app and read '
          'them slowly, twice. Add the road number if the BLM signed it, the last landmark a driver '
          'would recognize, and offer to meet the ambulance partway at something findable. '
          '<a href="../lessons/13_Evacuation">The call itself is a skill</a>; practice it before '
          'the day it matters.'),
         ('Which burns can I handle in the van?',
          'First, cool it: cool (not ice-cold) running water for a solid 10–20 minutes — the one move '
          'that limits how deep a burn goes, and it still helps up to a few hours after. Then cover it '
          'clean and loose. What ends the boondock: burns to the face, hands, feet, genitals, or '
          'across a joint; anything bigger than a few palm-areas; and any burn that looks waxy or '
          'barely hurts, because deep burns kill their own nerves.'),
         ('I travel solo. What’s the one habit that matters most?',
          'The check-in. One person always knows where you’re parked and when you’ll ping next, and the '
          'gap is short enough that a search starts while it can still help. Boring and automatic beats '
          'elaborate and skipped — a dead-simple routine outperforms gear you never configured.')],
 'slug': 'vanlifers',
 'title': 'Free First Aid for Vanlifers & Full-Time RVers'},

]
