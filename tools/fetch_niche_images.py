#!/usr/bin/env python3
"""Fetch a unique, on-topic CC image per niche page from Wikimedia Commons.
Reused category images are copied for slugs where they fit exactly.
Output: assets/img/for/<slug>.jpg + alt/credits merged into assets/img/sources.json."""
import json, subprocess, os, urllib.parse, re, time, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "openwfa-build/1.0 (educational static site; contact: developers@saambaa.com)"
REUSE = {  # slug -> category key whose verified image fits exactly
 "backpackers": "trail", "mountaineers": "climb", "whitewater": "water", "atv-utv": "moto",
 "camp-counselors": "youth", "field-scientists": "fieldwork", "desert-explorers": "travel",
 "sar": "rescue", "horsepackers": "rural", "event-organizers": "events",
}
REUSE_ALT = {
 "backpackers": "A hiking trail winding along a green alpine ridge",
 "mountaineers": "A rope team crossing a glacier",
 "whitewater": "A kayaker working through whitewater",
 "atv-utv": "An ATV on a high mountain trail",
 "camp-counselors": "Wall tents at a summer camp under a big sky",
 "field-scientists": "A wildlife biologist holding a bird in the field",
 "desert-explorers": "A hiker in a desert canyon",
 "sar": "A rescue helicopter on a snowy slope",
 "horsepackers": "Horses grazing in a mountain meadow",
 "event-organizers": "A runner racing the Sierre-Zinal mountain course",
}
Q = {  # slug: (alt text, [queries in priority order])
 "thru-hikers": ("A long-distance hiker on a ridgeline trail", ['appalachian trail hiker ridge', 'pacific crest trail hiker', 'long distance trail hiker pack']),
 "bikepackers": ("A loaded touring bike on a gravel road", ['bikepacking gravel road', 'bicycle touring mountains loaded', 'gravel cycling countryside']),
 "canyoneers": ("A hiker deep in a slot canyon", ['slot canyon hiker', 'canyoneering canyon narrow', 'zion narrows hiker']),
 "disc-golfers": ("A disc golf basket on a wooded course", ['disc golf basket forest', 'disc golf course trees', 'disc golf basket']),
 "mtb": ("A mountain biker on forest singletrack", ['mountain biker singletrack forest', 'mountain biking trail forest', 'mountain bike rider downhill']),
 "trail-runners": ("A trail runner on a mountain path", ['trail runner mountains', 'trail running ridge', 'runner mountain path']),
 "alpine-climbers": ("A climber on a multi-pitch rock face", ['climber rock face multipitch', 'rock climbing granite wall', 'climber belaying cliff']),
 "boulderers": ("A boulderer working a problem above a crash pad", ['bouldering outdoor crash pad', 'boulderer rock problem', 'bouldering fontainebleau']),
 "via-ferrata": ("A climber clipped to via ferrata cables", ['via ferrata climber cable', 'klettersteig', 'via ferrata ladder rock']),
 "backcountry-skiers": ("Ski tourers skinning up a snowy slope", ['ski touring skin track', 'ski mountaineering ascent', 'splitboard backcountry']),
 "ice-climbers": ("An ice climber on a frozen waterfall", ['ice climbing frozen waterfall', 'ice climber axes', 'ice climbing']),
 "open-water-paddlers": ("A sea kayaker paddling open water", ['sea kayaking coast', 'sea kayaker paddling ocean', 'kayak open water coast']),
 "canoe-trippers": ("A canoe on a wilderness lake", ['canoe wilderness lake', 'boundary waters canoe', 'canoe lake morning']),
 "fly-anglers": ("An angler casting a fly line in a river", ['fly fishing river casting', 'fly fisherman waders river', 'angler casting river']),
 "surfers": ("A surfer riding a remote break", ['surfer riding wave', 'surfing point break', 'surfer ocean wave']),
 "remote-divers": ("A freediver descending in open water", ['freediver underwater ocean', 'freediving descent', 'spearfishing diver']),
 "boat-crews": ("A working boat underway in open water", ['fishing boat crew sea', 'fishing vessel underway', 'workboat sea deck']),
 "riders": ("A dual-sport motorcycle on a dirt road", ['adventure motorcycle dirt road', 'dual sport motorcycle trail', 'motorcycle gravel road mountains']),
 "overlanders": ("A 4x4 on a remote overland track", ['4x4 offroad track desert', 'land rover expedition track', 'jeep mountain trail']),
 "snowmobilers": ("A snowmobiler crossing deep snow", ['snowmobile deep snow', 'snowmobile mountains', 'snowmobiler winter trail']),
 "paragliders": ("A paraglider over mountain terrain", ['paraglider mountains', 'paragliding alps flight', 'paraglider launch mountain']),
 "drone-operators": ("A drone pilot flying in open country", ['drone operator field controller', 'drone pilot outdoors', 'quadcopter flying field']),
 "youth-leaders": ("A scout troop hiking with packs", ['scouts hiking trail group', 'scout troop backpacking', 'youth group hiking']),
 "outdoor-educators": ("An instructor teaching a group outdoors", ['outdoor education group', 'field trip students nature', 'teacher students outdoors nature']),
 "forest-school": ("Children exploring a woodland path", ['children forest path walking', 'kids nature walk woods', 'forest kindergarten']),
 "dog-walkers": ("Dogs on a trail walk", ['dogs hiking trail', 'dog walking forest trail', 'hiker with dogs mountains']),
 "forestry-workers": ("A chainsaw operator working timber", ['chainsaw forestry worker', 'logger chainsaw tree', 'forestry work timber']),
 "wildland-fire": ("Wildland firefighters working a fire line", ['wildland firefighters', 'firefighters forest fire line', 'hotshot crew fire']),
 "trail-crews": ("A trail crew building tread with hand tools", ['trail crew maintenance tools', 'trail building volunteers', 'conservation corps trail work']),
 "renewable-techs": ("Wind turbines on open rangeland", ['wind turbines field road', 'wind farm landscape', 'solar farm panels field']),
 "outdoor-photographers": ("A photographer with a tripod in the mountains", ['photographer tripod mountains', 'landscape photographer outdoors', 'photographer camera mountain sunset']),
 "jungle-trekkers": ("Trekkers on a rainforest trail", ['rainforest trail trekking', 'jungle hiking trail', 'tropical forest path hikers']),
 "polar-expeditions": ("Expedition skiers hauling sleds across ice", ['polar expedition sled ski', 'antarctic expedition ski', 'arctic ski expedition pulk']),
 "adventure-travelers": ("A trekker overlooking a mountain valley", ['trekker himalaya valley', 'backpacker mountain vista travel', 'trekking nepal trail']),
 "humanitarian-volunteers": ("Relief supplies being unloaded in the field", ['humanitarian aid supplies field', 'relief distribution volunteers', 'aid workers logistics']),
 "rural-firefighters": ("A rural fire brush truck", ['brush fire truck', 'volunteer fire department truck rural', 'wildland fire engine']),
 "rangers-wardens": ("A ranger patrolling public lands", ['park ranger trail', 'ranger national park uniform', 'ranger patrol vehicle park']),
 "ski-patrol": ("A ski patroller with a rescue toboggan", ['ski patrol toboggan', 'ski patrol sled slope', 'ski patrol rescue']),
 "hunters": ("Hunters in blaze orange crossing a field at dawn", ['hunters blaze orange field', 'duck hunters marsh dawn', 'hunter shotgun field autumn']),
 "homesteaders": ("Splitting firewood at a homestead", ['splitting firewood axe', 'homestead cabin garden', 'wood splitting rural']),
 "ranchers": ("A rancher working cattle on horseback", ['rancher horseback cattle', 'cattle drive ranch', 'cowboy cattle horses']),
 "bowhunters": ("A bowhunter drawing a compound bow", ['bowhunter archery camouflage', 'compound bow hunter', 'archer hunting bow']),
 "foragers": ("A basket of foraged mushrooms in the woods", ['mushroom foraging basket forest', 'picking mushrooms forest', 'chanterelle basket woods']),
 "vanlifers": ("A campervan parked in open country", ['campervan mountains parked', 'camper van desert camping', 'vanlife campervan landscape']),
 "nurses-to-field": ("A first aid kit packed for the backcountry", ['first aid kit hiking backpack', 'medical kit outdoors', 'first aid kit contents']),
 "wilderness-therapy": ("A small group around a wilderness campfire", ['campfire group wilderness evening', 'backpackers campfire camp', 'group camping wilderness fire']),
 "youth-coaches": ("Young runners on a cross-country course", ['cross country race youth', 'high school cross country running', 'students running race trail']),
}
BAD_TITLE = re.compile(r"scan|sign|map|panel|diagram|logo|coat|stamp|screenshot|cover|poster|18\d\d|19[0-7]\d", re.I)
def fetch(slug, alt, queries, manifest):
    for q in queries:
        api = ("https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
               urllib.parse.quote('filetype:bitmap ' + q) +
               "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=1600&format=json")
        try:
            out = subprocess.run(["curl", "-sm", "25", api, "-H", "User-Agent: " + UA], capture_output=True, text=True, timeout=30).stdout
            pages = json.loads(out).get("query", {}).get("pages", {})
        except Exception:
            continue
        for p in sorted(pages.values(), key=lambda p: p.get("index", 99)):
            ii = (p.get("imageinfo") or [{}])[0]
            w, h = ii.get("width", 0), ii.get("height", 0)
            title = p.get("title", "")
            if w < 1200 or w <= h * 1.05 or ii.get("mime") != "image/jpeg" or BAD_TITLE.search(title): continue
            md = ii.get("extmetadata", {})
            lic = md.get("LicenseShortName", {}).get("value", "")
            if not lic or lic == "GFDL": continue
            dt = md.get("DateTimeOriginal", {}).get("value", "")
            m = re.search(r"(19|20)\d\d", dt)
            if m and int(m.group(0)) < 2004: continue
            artist = re.sub("<[^>]+>", "", md.get("Artist", {}).get("value", "")).strip()
            dest = os.path.join(ROOT, "assets/img/for", slug + ".jpg")
            try:
                subprocess.run(["curl", "-sLm", "40", ii.get("thumburl") or ii.get("url"), "-o", dest + ".tmp", "-H", "User-Agent: " + UA], timeout=45, check=True)
                if os.path.getsize(dest + ".tmp") < 60_000: os.remove(dest + ".tmp"); continue
                ft = subprocess.run(["file", "-b", "--mime-type", dest + ".tmp"], capture_output=True, text=True).stdout.strip()
                if "image" not in ft: os.remove(dest + ".tmp"); continue
                os.rename(dest + ".tmp", dest)
                manifest["for/" + slug] = {"alt": alt, "title": title, "creator": artist, "license": lic,
                    "source": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))}
                print("%-22s OK  %-13s %s" % (slug, lic, title[5:58]))
                return True
            except Exception:
                if os.path.exists(dest + ".tmp"): os.remove(dest + ".tmp")
        time.sleep(0.3)
    print("%-22s MISSING" % slug)
    return False
def main():
    mpath = os.path.join(ROOT, "assets/img/sources.json")
    manifest = json.load(open(mpath))
    only = sys.argv[1:]  # optional slugs to (re)fetch
    for slug, cat in REUSE.items():
        if only and slug not in only: continue
        dest = os.path.join(ROOT, "assets/img/for", slug + ".jpg")
        if not os.path.exists(dest):
            shutil.copy(os.path.join(ROOT, "assets/img", "niche-%s.jpg" % cat), dest)
        manifest["for/" + slug] = dict(manifest.get(cat, {}), alt=REUSE_ALT[slug])
        print("%-22s reused %s" % (slug, cat))
    for slug, (alt, queries) in Q.items():
        if only and slug not in only: continue
        if not only and os.path.exists(os.path.join(ROOT, "assets/img/for", slug + ".jpg")):
            print("%-22s exists" % slug); continue
        fetch(slug, alt, queries, manifest)
    json.dump(manifest, open(mpath, "w"), indent=1)
if __name__ == "__main__":
    main()
