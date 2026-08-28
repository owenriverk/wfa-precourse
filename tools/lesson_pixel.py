#!/usr/bin/env python3
"""Oregon Trail-style og:image cards for the lessons, the sims and the root pages.

Same engine as the for/ niche heroes: tools/niche_pixel.py owns the Grid, the
palette, the backdrops, the figure rig and the 1200x630 PNG writer. This file
imports that engine and adds only the primitives these motifs need. Nothing
here introduces a new hex — every colour is a key already in niche_pixel.P.

Outputs:
  assets/img/lessons/<NN_Slug>.png   one per lessons/<NN_Slug>.html
  assets/img/sims/<slug>.png         one per sims/<slug>.html
  assets/img/pages/<stem>.png        index, kit, reference, curriculum,
                                     sim, final_exam
  <dir>/alts.json                    {filename stem: alt text}

Every PNG is exactly 1200x630 (og:image 1.91:1), rendered from the shared
200x75 cell grid at 6px per cell plus 15 cells of sky/ground bleed.

House rules that bind these scenes (AGENTS.md): no gore, no graphic injury,
nothing above EMT-B scope, and every mark that carries meaning has to be loud
enough to read at thumbnail size — a mass that appears, not a 3-pixel tick.

Regenerate everything:   python3 tools/lesson_pixel.py
One set:                 python3 tools/lesson_pixel.py lessons
                         python3 tools/lesson_pixel.py sims
                         python3 tools/lesson_pixel.py pages
Named scenes:            python3 tools/lesson_pixel.py 03_Airway cool-first
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from niche_pixel import (  # noqa: E402  - the engine, not a copy of it
    W, H, HOR, P, Grid,
    write_png,
    sky, sun_disc, clouds, ridgeline, pines, big_pine,
    ground, trail_band,
    bd_ridge, bd_forest, bd_desert, bd_water, bd_river, bd_snow, bd_plains,
    fig, flipped, shadow_under, trek_pole,
    prop_tent, prop_campfire, prop_signpost,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LESSON_OUT = os.path.join(ROOT, "assets", "img", "lessons")
SIM_OUT = os.path.join(ROOT, "assets", "img", "sims")
PAGE_OUT = os.path.join(ROOT, "assets", "img", "pages")

TOP = -14        # the fig() rig's head row for a full-size standing figure


# ======================================================================
# backdrops
# ======================================================================
def bd_slope(skytype="day"):
    """Ridge country with the right of frame free for a loose talus face."""
    g = Grid()
    sky(g, skytype)
    clouds(g, ((26, 8), (84, 6)))
    ridgeline(g, [(0, 28), (30, 16), (62, 24), (96, 14), (130, 22), (168, 12),
                  (199, 20), (200, 20)], HOR - 4, "ridge", "ridgesh", snowcap=18)
    ridgeline(g, [(0, 40), (50, 34), (110, 38), (199, 33), (200, 33)],
              HOR, "hill", "hillrim")
    ground(g)
    big_pine(g, 8, HOR + 28, 26)
    return g


def bd_overlook(skytype="day"):
    """Standing on a rim: range beyond, a hard drop, dark rock underfoot."""
    g = Grid()
    sky(g, skytype)
    clouds(g, ((36, 9), (140, 7)))
    ridgeline(g, [(0, 20), (34, 8), (72, 18), (110, 6), (148, 16), (182, 9),
                  (199, 17), (200, 17)], HOR - 12, "ridge", "ridgesh", snowcap=13)
    ridgeline(g, [(0, 28), (60, 22), (130, 27), (199, 23), (200, 23)],
              HOR - 6, "ridgesh", "hillrim")
    g.rect(0, HOR - 6, W, 6, "hill")                  # hazy valley floor
    g.rect(0, HOR, W, 3, "bar")                       # the edge of the drop
    ground(g, HOR + 3)
    g.row(0, W - 1, HOR + 3, "rockD")
    for i in range(14):                               # slabs at the lip
        sx = (i * 29) % (W - 10)
        sy = HOR + 5 + (i * 7) % 8
        g.rect(sx, sy, 6 + i % 4, 2, "rockD")
        g.row(sx, sx + 5 + i % 4, sy, "metalsh")
    return g


def bd_baked():
    """Midday desert with the sun sitting high and large. Nowhere to hide."""
    g = Grid()
    sky(g, "day")
    sun_disc(g, 48, 9, 10)
    ridgeline(g, [(0, 26), (26, 26), (28, 18), (56, 18), (58, 26), (104, 28),
                  (130, 14), (158, 14), (160, 26), (199, 24), (200, 24)],
              HOR - 2, "mesa", "mesash")
    ridgeline(g, [(0, 38), (72, 34), (142, 39), (199, 35), (200, 35)],
              HOR, "mesash", "mesad")
    ground(g, kind="sand")
    for sx in (16, 62, 108, 150, 186):
        g.rect(sx, HOR + 10, 3, 2, "leafsh")
        g.px(sx + 1, HOR + 9, "leafsh")
    return g


def bd_gravel(skytype="storm"):
    """Overcast gravel two-track — the Rider Down light."""
    g = Grid()
    sky(g, skytype)
    ridgeline(g, [(0, 26), (34, 18), (74, 25), (118, 16), (158, 24), (199, 19),
                  (200, 19)], HOR - 4, "ridge", "ridgesh")
    ridgeline(g, [(0, 39), (60, 34), (130, 38), (199, 35), (200, 35)],
              HOR, "hill", "hillrim")
    ground(g)
    trail_band(g, HOR + 16)
    pines(g, (26, 32, 170, 176), HOR + 2, 9)
    big_pine(g, 8, HOR + 28, 26)
    return g


# ======================================================================
# terrain, weather, and other loud marks
# ======================================================================
def talus(g, x0, x1, y0, y1):
    """Loose scree face. Top edge runs (x0,y0) to (x1,y1); fills to the bottom."""
    span = max(1, x1 - x0)
    for x in range(max(0, x0), min(x1, W)):
        t = max(0, y0 + (y1 - y0) * (x - x0) // span)
        g.col(x, t, H - 1, "rockD")
        g.px(x, t, "metal")
        g.px(x, t + 1, "metalsh")
    for i in range(90):
        sx = x0 + (i * 17) % span
        t = max(0, y0 + (y1 - y0) * (sx - x0) // span)
        sy = t + 2 + (i * 13) % max(2, H - t - 3)
        if sy < H - 1:
            g.rect(sx, sy, 2 + i % 3, 1,
                   ("ridgesh", "metalsh", "bar", "ridge")[i % 4])


def rock_debris(g, x0, x1, y):
    """Fresh blocks fanned out at the foot of a slope."""
    for i in range(10):
        sx = x0 + (i * 13) % max(1, x1 - x0 - 6)
        sy = y - (i % 3) * 2
        s = 3 + i % 3
        g.rect(sx, sy - s, s, s, "ridgesh")
        g.row(sx, sx + s - 1, sy - s, "metal")
        g.px(sx + s - 1, sy - 1, "bar")


def falling_rocks(g, spots):
    """Stones in the air with a short dust trail above each."""
    for x, y, s in spots:
        for d in range(1, 5):
            g.rect(x, y - d * 2 - 1, s, 1, "ridgesh" if d % 2 else "metalsh")
        g.rect(x, y, s, s, "wheel")
        g.row(x, x + s - 1, y, "rockD")
        g.col(x + s - 1, y + 1, y + s - 1, "bar")


def crag(g, x0, x1, base=None):
    """Stepped rock buttress dropping left to right out of the top of frame."""
    base = base if base is not None else HOR + 14
    steps = ((0.00, 0), (0.50, 3), (0.68, 11), (0.83, 22), (1.00, 34))
    prev = x0
    for frac, top in steps:
        x = x0 + int((x1 - x0) * frac)
        if x > prev:
            g.rect(prev, top, x - prev, base - top, "rockD")
            g.row(prev, x - 1, top, "metal")
            g.col(x - 1, top, base - 1, "metalsh")
        prev = x
    for i in range(30):
        cx = x0 + (i * 13) % max(1, x1 - x0 - 5)
        cy = 3 + (i * 7) % max(3, base - 6)
        g.rect(cx, cy, 3 + i % 4, 1, "metalsh" if i % 2 else "bar")
    g.rect(x0, base - 2, x1 - x0, 2, "bar")


def lightning(g, x, y0, y1, w=8, dxs=(-3, 4, -3)):
    """Tapering zigzag bolt, outlined so it reads as a strike and not as smoke.
    Segments overlap horizontally at each kink, so the run stays connected."""
    segs = []
    n = len(dxs) + 1
    seg = max(4, (y1 - y0) // n)
    cx, y = x, y0
    for i in range(n):
        ww = max(3, w - i)
        h = seg if i < n - 1 else max(4, y1 - y)
        segs.append((cx, y, ww, h))
        if i < len(dxs):
            cx += dxs[i]
        y += h
    for sx, sy, ww, h in segs:
        g.rect(sx - 1, sy - 1, ww + 2, h + 2, "stormsh")
    for sx, sy, ww, h in segs:
        g.rect(sx, sy, ww, h, "sunhi")
        g.rect(sx + 1, sy, max(1, ww - 2), h, "sun")


def steam(g, x, y, n=5):
    for i in range(n):
        g.rect(x + (i % 2) * 2, y - i * 2, 3, 1, "cloud" if i % 2 else "cloudsh")


def puffs(g, x, y, n=4, step=(-6, -4)):
    """Breath or snore marks going up and away. Sized to be seen."""
    for i in range(n):
        g.rect(x + i * step[0], y + i * step[1], 5 + i * 2, 2,
               "cloud" if i % 2 == 0 else "cloudsh")


def fan_lines(g, x, y, n=3):
    """Moving air over a patient."""
    for i in range(n):
        g.rect(x + (i % 2) * 4, y - i * 4, 12, 2, "cloud")
        g.rect(x + 4 + (i % 2) * 4, y - i * 4 + 2, 8, 1, "cloudsh")


def pour(g, x0, y0, x1, y1):
    """Arc of poured water, wide enough to read."""
    n = max(abs(x1 - x0), abs(y1 - y0), 1)
    for i in range(n + 1):
        t = i / n
        xx = int(round(x0 + (x1 - x0) * t))
        yy = int(round(y0 + (y1 - y0) * (t ** 1.8)))
        g.rect(xx, yy, 1, 2, "water")
        if i % 3 == 0:
            g.px(xx, yy + 2, "watersh")


def bee(g, x, y):
    g.rect(x, y, 4, 2, "gold")
    g.col(x + 1, y, y + 1, "bar")
    g.col(x + 3, y, y + 1, "bar")
    g.rect(x - 2, y - 2, 4, 1, "cloud")
    g.rect(x + 3, y - 2, 4, 1, "cloud")


def hives(g, x, y, n=4):
    """Raised welts as pale blotches on a sleeve. Never broken skin."""
    for i in range(n):
        g.rect(x + (i * 5) % 9, y - i * 3, 3, 2, "helm")


def tick(g, x, y, k="pineL"):
    """A check mark."""
    g.rect(x, y, 2, 2, k)
    g.rect(x + 2, y + 2, 2, 2, k)
    g.rect(x + 4, y, 2, 2, k)
    g.rect(x + 6, y - 2, 2, 2, k)
    g.rect(x + 8, y - 4, 2, 2, k)


# ======================================================================
# figure helpers — arms stay attached to the body
# ======================================================================
def _drop(f, cells):
    for c in cells:
        f.cells.pop(c, None)


def arm_out(f, n=3, dy=-1, sleeve="jktsh", hand="skin", top=TOP):
    """Swap a standing figure's near arm for one held straight out to +x."""
    _drop(f, [(2, top + 5), (2, top + 6), (2, top + 7)])
    for i in range(n):
        f.px(2 + i, top + 5 + dy, sleeve)
    f.rect(2 + n, top + 4 + dy, 2, 3, hand)
    return f


def arm_up(f, sleeve="jktsh", hand="skin", top=TOP):
    """Standing figure raising the near arm overhead."""
    _drop(f, [(2, top + 5), (2, top + 6), (2, top + 7)])
    f.px(2, top + 4, sleeve)
    f.px(3, top + 2, sleeve)
    f.rect(3, top - 1, 2, 3, hand)
    return f


def arms_up(f, sleeve="jktsh", hand="skin", top=TOP):
    """Both arms up — the friend shouting for you."""
    arm_up(f, sleeve, hand, top)
    _drop(f, [(-2, top + 5), (-2, top + 6), (-2, top + 7)])
    f.px(-2, top + 4, sleeve)
    f.px(-3, top + 2, sleeve)
    f.rect(-4, top - 1, 2, 3, hand)
    return f


def hand_to_chest(f, top=TOP, jks="jktsh"):
    """Fist clamped on the sternum — the cardiac tell, drawn loud."""
    _drop(f, [(2, top + 5), (2, top + 6), (2, top + 7)])
    f.px(2, top + 5, jks)
    f.px(2, top + 6, jks)
    f.rect(0, top + 5, 2, 2, "skin")
    return f


def kneel_reach(f, n=2, sleeve="jktsh", top=TOP):
    """Extend the kneeling figure's working arm along -x, hand on the ground."""
    for i in range(n):
        f.px(-6 - i, top + 11, sleeve)
    f.rect(-6 - n, top + 10, 2, 2, "skin")
    return f


def reach_arm(g, x_from, x_to, y, sleeve="jktsh"):
    """Forearm from a kneeling rescuer's shoulder to a hand on the patient.
    Keeps contact readable when the patient is sitting up, not lying flat."""
    lo, hi = min(x_from, x_to), max(x_from, x_to)
    g.rect(lo, y, hi - lo, 3, sleeve)
    g.rect(x_to - 5 if x_to < x_from else x_to, y - 1, 6, 5, "skin")


def fig_prone(jk="gold", jks="goldsh", pl="pants2"):
    """Face-down figure. Head at x=0, body along +x, ground on y=0."""
    s = Grid()
    s.rect(-3, -5, 6, 5, "hair")
    s.rect(-4, -3, 3, 3, "skin")
    s.rect(-6, -2, 6, 2, "skin")                 # near arm flung past the head
    s.rect(3, -7, 11, 6, jk)
    s.rect(3, -3, 11, 2, jks)
    s.rect(4, -8, 9, 1, jks)
    s.rect(14, -7, 6, 6, pl)
    s.rect(14, -4, 6, 1, "pants2")
    s.rect(20, -6, 5, 5, pl)
    s.rect(25, -6, 4, 5, "boot")
    s.rect(25, -7, 4, 1, "bootsh")
    return s


def fig_recovery(jk="blank", jks="blanksh", pl="denim", pls="denimsh"):
    """Recovery position, side-lying, top knee drawn up.
    Head at x=0, body along +x, ground on y=0."""
    s = Grid()
    s.rect(-3, -8, 6, 3, "hair")
    s.rect(-3, -5, 6, 4, "skin")
    s.px(-3, -4, "face")
    s.rect(-5, -1, 7, 1, "skin")                 # the arm the head rests on
    s.rect(2, -6, 2, 5, "skin")                  # neck
    s.rect(3, -7, 9, 6, jk)
    s.rect(3, -2, 9, 1, jks)
    s.rect(4, -8, 7, 1, jks)
    s.rect(3, -5, 6, 2, jks)                     # top arm folded in front
    s.rect(12, -6, 4, 5, pl)
    s.rect(14, -12, 6, 6, pl)                    # top knee drawn up high
    s.rect(14, -9, 6, 1, pls)
    s.rect(20, -11, 5, 3, pl)
    s.rect(24, -11, 4, 4, "boot")
    s.rect(16, -3, 8, 3, pls)                    # lower leg out on the ground
    s.rect(23, -4, 4, 4, "boot")
    return s


# ======================================================================
# props
# ======================================================================
def prop_boulder(r=6):
    """Rounded boulder, base on y=0, centred on x=0."""
    s = Grid()
    s.disc(0, -r, r, "rockD")
    s.rect(-r, -r, 2 * r + 1, r, "rockD")
    s.rect(-r + 1, -1, 2 * r - 1, 1, "metalsh")
    s.rect(-r + 2, -r - 1, 5, 1, "metal")
    s.rect(r - 4, -r + 2, 3, 1, "metal")
    s.rect(-r + 1, -r + 4, 4, 1, "metalsh")
    return s


def prop_kit(w=11, open_lid=True):
    """First aid case: red body, white cross, base on y=0."""
    s = Grid()
    h = 7
    s.rect(-(w // 2), -h, w, h, "red")
    s.rect(-(w // 2), -3, w, 3, "redsh")
    s.rect(-(w // 2), -h, w, 1, "redsh")
    s.rect(-2, -h + 2, 5, 2, "cloud")
    s.rect(-1, -h + 1, 2, 1, "cloud")
    s.rect(-1, -h + 4, 2, 1, "cloud")
    if open_lid:
        s.rect(-(w // 2) - 1, -h - 4, w + 2, 4, "redsh")
        s.rect(-(w // 2), -h - 3, w, 2, "red")
        s.rect(-(w // 2) + 1, -h - 2, w - 2, 1, "redsh")
    s.px(-(w // 2) - 1, -1, "strap")
    s.px(w // 2 + 1, -1, "strap")
    return s


def prop_pack(col="teal", colsh="tealsh", h=9):
    """Backpack standing on the ground, base y=0."""
    s = Grid()
    s.rect(-4, -h, 9, h, col)
    s.rect(-4, -3, 9, 1, colsh)
    s.rect(-4, -h - 1, 9, 1, colsh)
    s.col(-5, -h + 1, -3, "strap")
    s.col(5, -h + 1, -3, "strap")
    s.rect(-2, -h + 3, 4, 3, colsh)
    return s


def prop_burrito(length=34, wrap="blank", wrapsh="blanksh"):
    """Wrapped patient: insulation under, head clear at the -x end, on y=0.
    Torso sits higher than the legs so the bundle keeps a body contour."""
    s = Grid()
    s.rect(0, -3, length, 3, "pad")
    s.row(0, length - 1, 0, "padsh")
    s.rect(0, -12, 9, 3, "pad")                      # hood, standing proud
    s.rect(1, -13, 7, 1, "padsh")
    s.rect(1, -9, 8, 6, wrap)                        # collar of the wrap
    s.rect(1, -5, 8, 2, wrapsh)
    s.rect(2, -11, 6, 2, "hair")
    s.rect(2, -9, 6, 4, "skin")
    s.px(3, -8, "face")
    s.rect(10, -11, 13, 8, wrap)                     # chest and shoulders
    s.rect(10, -6, 13, 2, wrapsh)
    s.rect(11, -12, 11, 1, wrapsh)
    s.rect(23, -8, length - 25, 5, wrap)             # hips and legs, lower
    s.rect(23, -5, length - 25, 2, wrapsh)
    s.rect(length - 3, -7, 3, 4, wrapsh)
    s.rect(15, -11, 2, 8, wrapsh)                    # two lashings only
    s.rect(27, -8, 2, 5, wrapsh)
    return s


def prop_pad(g, x0, x1, y):
    """Insulating pad under a patient — the thing that matters most."""
    g.rect(x0, y - 3, x1 - x0, 3, "pad")
    g.row(x0, x1 - 1, y, "padsh")
    for sx in range(x0 + 4, x1 - 3, 7):
        g.col(sx, y - 3, y - 1, "padsh")


def prop_splint(g, x0, x1, y):
    """Padded splint on a limb: one padded bar, two straps clear of the site."""
    g.rect(x0, y - 6, x1 - x0, 3, "splint")
    g.rect(x0, y - 3, x1 - x0, 3, "pad")
    g.row(x0, x1 - 1, y, "padsh")
    for sx in (x0 + 3, x1 - 7):
        g.rect(sx, y - 7, 4, 8, "strap")


def prop_sling(g, x, y, w=16, h=14):
    """Triangular sling hanging off the far shoulder."""
    for i in range(h):
        wd = 3 + (w - 3) * i // max(1, h - 1)
        g.row(x, x + wd - 1, y + i, "splint" if i % 3 else "strap")
    g.row(x, x + w - 1, y + h - 1, "strap")


def prop_litter(length=26):
    """Rescue litter with a wrapped patient; rails on y=0, centred on x=0."""
    s = Grid()
    half = length // 2
    s.rect(-half - 2, -2, length + 4, 2, "metal")
    s.rect(-half - 2, -11, length + 4, 2, "metalsh")
    s.rect(-half, -10, 6, 6, "pad")                  # head end, clear
    s.rect(-half + 1, -9, 4, 4, "skin")
    s.px(-half + 2, -8, "face")
    s.rect(-half + 6, -10, 10, 8, "blank")           # chest
    s.rect(-half + 6, -5, 10, 2, "blanksh")
    s.rect(-half + 16, -8, length - 16, 6, "blank")  # legs, lower
    s.rect(-half + 16, -5, length - 16, 2, "blanksh")
    s.rect(-half + 9, -10, 2, 8, "blanksh")
    s.rect(-half + 19, -8, 2, 6, "blanksh")
    return s


def prop_stove(g, x, y):
    """Camp stove with a pot on it, steam going up. Base on row y."""
    g.rect(x - 2, y - 3, 5, 3, "bar")
    g.rect(x - 6, y - 9, 13, 6, "metal")
    g.rect(x - 6, y - 10, 13, 2, "metalsh")
    g.rect(x + 6, y - 8, 4, 2, "metalsh")
    steam(g, x - 2, y - 13, 5)


def prop_table(g, x, y, w=24):
    """Picnic table seen side-on, feet on row y."""
    half = w // 2
    g.rect(x - half, y - 10, w, 3, "wood")
    g.row(x - half, x + half - 1, y - 7, "woodsh")
    g.rect(x - half + 3, y - 7, 3, 7, "woodsh")
    g.rect(x + half - 6, y - 7, 3, 7, "woodsh")
    g.rect(x - half + 1, y - 5, w - 2, 2, "wood")
    g.row(x - half + 1, x + half - 2, y - 3, "woodsh")


def prop_snake():
    """S-curve snake, head at +x, rattle at -x. Body on y=0."""
    s = Grid()
    wave = (0, 0, -1, -2, -3, -3, -2, -1, 0, 0, -1, -2, -3, -3, -2)
    for i, dy in enumerate(wave):
        s.rect(i, dy - 4, 1, 4, "olive" if i % 2 else "olivesh")
        s.px(i, dy - 5, "leafsh")
    s.rect(15, -8, 5, 4, "olive")                # head
    s.rect(20, -7, 3, 2, "olivesh")
    s.rect(18, -8, 2, 2, "face")
    s.rect(23, -6, 3, 1, "red")                  # tongue
    s.rect(-3, -4, 3, 3, "spk2")
    s.rect(-6, -5, 3, 3, "spk1")
    return s


def prop_epipen(h=10):
    """Auto-injector: orange end down on y=0, yellow body, blue cap up."""
    s = Grid()
    s.rect(-2, -h, 5, h, "gold")
    s.rect(1, -h, 2, h, "goldsh")
    s.rect(-2, -3, 5, 3, "blank")
    s.rect(-2, -2, 5, 1, "blanksh")
    s.rect(-2, -h - 3, 5, 3, "denim")
    s.rect(1, -h - 3, 2, 3, "denimsh")
    s.rect(-3, -h + 3, 7, 2, "goldsh")
    return s


def prop_bike_down():
    """Bicycle on its side across the trail."""
    s = Grid()
    for cx in (-9, 9):
        for dx in range(-6, 7):
            hh = 4 - abs(dx) // 2
            s.rect(cx + dx, -hh, 1, hh, "wheel")
        s.rect(cx - 1, -3, 3, 2, "hub")
    s.rect(-8, -4, 17, 2, "bike")
    s.rect(-7, -2, 15, 1, "tank")
    s.rect(-4, -6, 3, 2, "bar")
    s.rect(4, -6, 4, 1, "bar")
    return s


def prop_moto_down():
    """Motorcycle on its side — the Rider Down machine."""
    s = Grid()
    for cx in (-11, 11):
        s.disc(cx, -4, 4.2, "wheel")
        s.disc(cx, -4, 1.8, "hub")
    s.rect(-9, -7, 19, 3, "bike")
    s.rect(-9, -5, 19, 1, "tank")
    s.rect(-4, -10, 8, 3, "tank")
    s.rect(-4, -10, 8, 1, "bike")
    s.rect(7, -11, 4, 2, "bar")
    s.px(11, -12, "bar")
    s.rect(-11, -8, 4, 2, "metalsh")
    return s


def prop_boat_beached(length=28, hull="bike", hullsh="tank"):
    """Kayak hauled up on the shore, side-on. Ground on y=0."""
    s = Grid()
    half = length // 2
    s.rect(-half + 3, -5, length - 6, 5, hull)
    s.rect(-half + 4, -2, length - 8, 2, hullsh)
    s.rect(-half, -4, 4, 4, hull)
    s.rect(half - 4, -4, 4, 4, hull)
    s.rect(-half - 1, -3, 2, 2, hullsh)
    s.rect(half - 1, -3, 2, 2, hullsh)
    s.rect(-4, -7, 9, 2, hullsh)                 # cockpit rim
    s.rect(-3, -6, 7, 1, "bar")
    return s


def prop_paddle(g, x, y, h=18):
    g.rect(x, y - h, 2, h, "trunk")
    g.rect(x - 1, y - h - 4, 4, 5, "wood")
    g.rect(x - 1, y - h - 3, 4, 1, "woodsh")


def prop_helmet(g, x, y, sh="helm", shd="helmsh"):
    """Helmet off, sitting on the ground."""
    g.rect(x - 5, y - 5, 11, 4, sh)
    g.rect(x - 6, y - 1, 13, 1, shd)
    g.rect(x - 4, y - 6, 9, 1, sh)
    g.rect(x - 6, y - 4, 1, 3, shd)
    g.rect(x + 6, y - 4, 1, 3, shd)
    g.rect(x - 3, y - 4, 7, 2, "visor")


def prop_card(g, x, y, w=18, h=13, header="red"):
    """Printed field card lying face up: colour header band, ruled lines."""
    g.rect(x, y, w, h, "cloud")
    g.rect(x, y, w, 3, header)
    g.rect(x, y + 3, w, 1, "cloudsh")
    for i in range(5, h - 1, 3):
        g.rect(x + 2, y + i, w - 5, 2, "cloudsh")
    g.row(x, x + w - 1, y + h - 1, "cloudsh")
    g.col(x + w - 1, y, y + h - 1, "cloudsh")


def prop_register():
    """Trailhead register box on a post, page showing. Base on y=0."""
    s = Grid()
    s.rect(-2, -16, 2, 16, "trunk")
    s.col(0, -16, -1, "woodsh")
    s.rect(-8, -26, 16, 9, "wood")
    s.rect(-8, -19, 16, 2, "woodsh")
    s.rect(-9, -28, 18, 2, "woodsh")
    s.rect(-6, -25, 12, 6, "cloud")
    for i in range(3):
        s.rect(-5, -24 + i * 2, 10, 1, "cloudsh")
    return s


def prop_cairn(h=4):
    """Trail cairn: chunky stacked stones, base y=0."""
    s = Grid()
    w = 9
    y = 0
    for i in range(h):
        s.rect(-(w // 2), y - 3, w, 3, "rockD")
        s.row(-(w // 2), -(w // 2) + w - 1, y - 3, "metal")
        s.row(-(w // 2), -(w // 2) + w - 1, y - 1, "metalsh")
        y -= 3
        w = max(3, w - 2)
    return s


def prop_notebook(g, x, y):
    """Written note: location, patient, status, needs."""
    g.rect(x, y, 7, 9, "cloud")
    g.rect(x, y, 7, 2, "cloudsh")
    for i in range(3, 9, 2):
        g.rect(x + 1, y + i, 5, 1, "cloudsh")


def prop_gel(g, x, y):
    """Sugar: a gel tube held out."""
    g.rect(x, y, 4, 9, "gold")
    g.rect(x, y, 4, 2, "red")
    g.col(x + 3, y + 2, y + 8, "goldsh")


def prop_bottle(g, x, y):
    """Water bottle, base on row y."""
    g.rect(x - 2, y - 9, 6, 9, "ice")
    g.rect(x - 2, y - 3, 6, 2, "icesh")
    g.rect(x - 1, y - 12, 4, 3, "denim")


def prop_dressing(g, x, y, w=9):
    """Clean dressing held on. No wound is ever drawn."""
    g.rect(x, y, w, 6, "cloud")
    g.rect(x, y + 4, w, 2, "cloudsh")


def prop_roller(g, x, y):
    """Rolled gauze on end."""
    g.rect(x, y - 7, 8, 7, "cloud")
    g.rect(x, y - 3, 8, 3, "cloudsh")
    g.rect(x + 3, y - 7, 2, 4, "cloudsh")


def prop_shears(g, x, y):
    g.rect(x, y - 3, 12, 3, "metal")
    g.rect(x + 3, y - 6, 8, 3, "metalsh")
    g.rect(x - 5, y - 7, 5, 4, "red")
    g.rect(x - 5, y - 2, 5, 4, "red")


def prop_gloves(g, x, y):
    g.rect(x, y - 7, 9, 7, "denim")
    g.rect(x, y - 10, 3, 3, "denim")
    g.rect(x + 5, y - 10, 3, 3, "denim")
    g.rect(x, y - 3, 9, 3, "denimsh")


def prop_map(g, x, y, w=20, h=14):
    """Folded map open on the ground: fold lines, contours, a marked route."""
    g.rect(x, y - h, w, h, "jkt")
    g.row(x, x + w - 1, y - h, "cloud")
    g.rect(x + w // 3, y - h, 2, h, "jktsh")
    g.rect(x + 2 * w // 3, y - h, 2, h, "jktsh")
    for i in range(3):                            # contour lines
        g.rect(x + 2 + i * 3, y - h + 3 + i * 3, w - 8 - i * 4, 1, "olivesh")
    for i in range(5):                            # the route, dashed
        g.rect(x + 3 + i * 4, y - 4 - (i % 2), 2, 2, "red")


# ======================================================================
# scene registries
# ======================================================================
LESSON_SCENES, SIM_SCENES, PAGE_SCENES = {}, {}, {}


def _reg(table):
    def outer(slug, alt):
        def deco(fn):
            table[slug] = (alt, fn)
            return fn
        return deco
    return outer


lesson = _reg(LESSON_SCENES)
sim = _reg(SIM_SCENES)
page = _reg(PAGE_SCENES)


# ======================================================================
# lessons
# ======================================================================
@lesson("01_Provider_Safety",
        "Pixel art of a rescuer halting with a raised palm as rocks come down a slope, holding a partner back")
def l01_provider_safety():
    g = bd_slope()
    talus(g, 108, W, HOR + 16, HOR - 28)
    falling_rocks(g, ((124, 36, 4), (146, 50, 3), (164, 30, 5), (184, 44, 4)))
    rock_debris(g, 104, 132, HOR + 24)
    y = HOR + 26
    shadow_under(g, 58, 78, y)
    r = arm_out(fig(jk="red", jks="redsh", hat="helmet", hatc="cloud",
                    pack="small", packc="pad", pose="stand"), 4, -1, "redsh")
    g.blit(r, 68, y, 2)
    g.blit(fig(jk="teal", jks="tealsh", hat="cap", hatc="jkt",
               pack="big", packc="gold", pose="stand"), 30, y, 2)
    return g


@lesson("02_Patient_Assessment",
        "Pixel art of a rescuer working a head-to-toe check on a patient lying on a trail while a partner writes vitals down")
def l02_patient_assessment():
    g = bd_ridge()
    y = HOR + 24
    prop_pad(g, 54, 120, y)
    c = Grid()
    c.blit(fig(pose="supine", jk="denim", jks="denimsh"), 0, 0)
    g.blit(c, 58, y - 3, 2)
    r = flipped(kneel_reach(fig(jk="teal", jks="tealsh", hat="cap",
                                hatc="cloud", pose="kneel"), 3, "tealsh"))
    g.blit(r, 44, y, 2)
    w = arm_out(fig(jk="jkt", jks="jktsh", hat="cap", hatc="red",
                    pose="stand"), 2, 1, "jktsh")
    g.blit(w, 136, y, 2)
    prop_notebook(g, 146, y - 16)
    g.blit(prop_kit(11), 172, y, 1)
    return g


@lesson("03_Airway",
        "Pixel art of a rescuer at the head of a patient rolled into the recovery position on a forest trail")
def l03_airway():
    g = bd_forest()
    trail_band(g, HOR + 14)
    y = HOR + 27
    prop_pad(g, 56, 136, y)
    g.blit(fig_recovery(), 62, y - 3, 2)
    puffs(g, 50, y - 24, 4, (-7, -4))
    r = flipped(kneel_reach(fig(jk="teal", jks="tealsh", hat="cap",
                                hatc="red", pose="kneel"), 2, "tealsh"))
    g.blit(r, 42, y, 2)
    g.blit(prop_pack("blank", "blanksh", 9), 174, y, 2)
    return g


@lesson("04_Bleeding_Wounds",
        "Pixel art of a rescuer holding firm direct pressure on a seated patient's forearm with a clean dressing")
def l04_bleeding_wounds():
    g = bd_river()
    y = HOR + 25
    g.blit(prop_boulder(7), 44, y, 2)
    g.blit(fig(pose="sit", jk="jkt", jks="jktsh", hat="cap", hatc="gold"),
           90, y, 2)
    prop_dressing(g, 100, y - 16, 12)
    g.rect(98, y - 11, 16, 3, "splint")
    g.row(98, 113, y - 8, "strap")
    g.blit(fig(jk="teal", jks="tealsh", pose="kneel"), 136, y - 4, 2)
    reach_arm(g, 128, 116, y - 15, "tealsh")
    g.blit(prop_kit(11), 178, y, 1)
    prop_roller(g, 166, y)
    return g


@lesson("05_Shock",
        "Pixel art of a patient lying wrapped and insulated at dusk while a rescuer checks a wrist pulse")
def l05_shock():
    g = bd_ridge("dusk", trail=False)
    y = HOR + 24
    g.blit(prop_burrito(32), 60, y, 2)
    g.blit(prop_pack("teal", "tealsh", 9), 140, y, 2)   # feet up on a pack
    g.blit(flipped(kneel_reach(fig(jk="red", jks="redsh", hat="beanie",
                                   hatc="pad", pose="kneel"), 3, "redsh")),
           42, y, 2)
    g.blit(prop_kit(11), 176, y, 1)
    return g


@lesson("06_Musculoskeletal",
        "Pixel art of a rescuer checking toes below a padded leg splint on a patient lying in the woods")
def l06_musculoskeletal():
    g = bd_forest()
    y = HOR + 27
    prop_pad(g, 36, 118, y)
    c = Grid()
    c.blit(fig(pose="supine", jk="olive", jks="olivesh"), 0, 0)
    g.blit(c, 40, y - 3, 2)
    prop_splint(g, 76, 116, y - 5)
    g.rect(114, y - 10, 10, 7, "boot")
    g.rect(116, y - 9, 6, 5, "skin")                    # toe window left open
    g.blit(kneel_reach(fig(jk="teal", jks="tealsh", pose="kneel"),
                       4, "tealsh"), 152, y, 2)
    g.blit(prop_boulder(5), 186, y, 2)
    return g


@lesson("07_Spine",
        "Pixel art of two rescuers moving a patient as one unit on a trail with the helmet set down beside them")
def l07_spine():
    g = bd_ridge(trail=False)
    trail_band(g, HOR + 16)
    y = HOR + 26
    prop_pad(g, 56, 126, y)
    c = Grid()
    c.blit(fig(pose="supine", jk="olive", jks="olivesh"), 0, 0)
    g.blit(c, 60, y - 3, 2)
    g.blit(flipped(kneel_reach(fig(jk="red", jks="redsh", hat="cap",
                                   hatc="cloud", pose="kneel"), 3, "redsh")),
           46, y, 2)
    g.blit(kneel_reach(fig(jk="teal", jks="tealsh", hat="cap",
                           hatc="cloud", pose="kneel"), 4, "tealsh"),
           118, y, 2)
    prop_helmet(g, 148, y)
    g.blit(prop_pack("denim", "denimsh", 9), 178, y, 2)
    return g


@lesson("08_Heat",
        "Pixel art of a rescuer cooling an overheated hiker in tarp shade with water and moving air under a high sun")
def l08_heat():
    g = bd_baked()
    y = HOR + 27
    for yy in range(y - 2, H):                          # the pool of shade
        g.row(66, 148, yy, "sandsh")
    g.rect(64, y - 34, 88, 4, "jkt")                    # tarp pitched low
    g.row(64, 151, y - 30, "jktsh")
    for i in range(6):
        g.rect(66 + i * 15, y - 30, 5, 2, "jktsh")
    trek_pole(g, 65, y, 34)
    trek_pole(g, 150, y, 34)
    g.blit(fig(pose="sit", jk="cloud", jks="jktsh"), 92, y, 2)
    g.rect(88, y - 17, 15, 5, "water")                  # shirt soaked, loud
    g.rect(90, y - 12, 11, 2, "watersh")
    g.blit(fig(jk="teal", jks="tealsh", hat="brim", hatc="jkt",
               pose="kneel"), 138, y, 2)
    prop_bottle(g, 124, y - 19)
    pour(g, 122, y - 24, 102, y - 11)
    fan_lines(g, 72, y - 16, 3)
    return g


@lesson("09_Cold",
        "Pixel art of a hypothermia wrap on an insulated pad in the snow with a stove going beside it")
def l09_cold():
    g = bd_snow()
    y = HOR + 24
    g.blit(prop_tent(15, "red", "redsh"), 40, HOR + 10, 2)
    g.blit(prop_burrito(32), 50, y, 2)
    g.blit(kneel_reach(fig(jk="denim", jks="denimsh", hat="hood",
                           pose="kneel"), 4, "denimsh"), 142, y, 2)
    prop_stove(g, 176, y)
    return g


@lesson("10_Anaphylaxis",
        "Pixel art of an epinephrine auto-injector pressed to a seated patient's outer thigh in a meadow")
def l10_anaphylaxis():
    g = bd_plains()
    y = HOR + 26
    g.blit(fig(pose="sit", jk="jkt", jks="jktsh", hat="cap", hatc="teal"),
           74, y, 2)
    hives(g, 66, y - 22, 4)
    p = Grid()
    p.blit(prop_epipen(9), 0, 0)
    g.blit(p, 84, y - 5, 2)                             # tip on the thigh
    g.rect(78, y - 20, 12, 6, "skin")                   # fist round the barrel
    g.rect(90, y - 19, 13, 4, "tealsh")                 # forearm in from the right
    g.blit(fig(jk="teal", jks="tealsh", pose="kneel"), 112, y, 2)
    bee(g, 156, HOR + 2)
    bee(g, 40, HOR - 6)
    g.blit(prop_kit(11), 182, y, 1)
    return g


@lesson("11_Medical",
        "Pixel art of a rescuer taking a history from a seated patient at a dusk camp with sugar and a kit at hand")
def l11_medical():
    g = bd_forest("dusk")
    y = HOR + 27
    g.blit(prop_tent(15, "teal", "tealsh"), 34, HOR + 12, 2)
    f = Grid()
    prop_campfire(f, 0, 0)
    g.blit(f, 178, y, 2)
    g.blit(prop_pack("blank", "blanksh", 10), 62, y, 2)
    g.blit(fig(pose="sit", jk="denim", jks="denimsh", hat="beanie",
               hatc="pad"), 92, y, 2)
    g.blit(fig(jk="teal", jks="tealsh", hat="cap", hatc="cloud",
               pose="kneel"), 140, y, 2)
    reach_arm(g, 132, 116, y - 22, "tealsh")
    prop_gel(g, 114, y - 24)
    prop_notebook(g, 146, y - 20)
    g.blit(prop_kit(11), 162, y, 1)
    return g


@lesson("12_Bites_Stings",
        "Pixel art of a hiker backing off from a rattlesnake sunning on a desert rock, keeping their distance")
def l12_bites_stings():
    g = bd_desert("day")
    trail_band(g, HOR + 18)
    y = HOR + 26
    g.blit(prop_boulder(9), 60, y, 2)
    g.blit(prop_snake(), 54, y + 2, 2)                  # sunning on the trail
    g.blit(flipped(arm_out(fig(jk="jkt", jks="jktsh", hat="brim", hatc="olive",
                               pack="big", packc="teal", pose="walk"),
                           3, -2, "jktsh")), 150, y, 2)
    bee(g, 124, HOR - 6)
    for dx in (170, 182, 192):
        g.rect(dx, y + 2, 5, 1, "sandsh")
    return g


@lesson("13_Evacuation",
        "Pixel art of a two-person litter carry heading down a dusk trail while two messengers walk out with a written note")
def l13_evacuation():
    g = bd_ridge("dusk")
    y = HOR + 24
    c = Grid()
    c.blit(fig(jk="red", jks="redsh", hat="helmet", hatc="cloud",
               pose="walk"), -19, 0)
    c.blit(fig(jk="red", jks="redsh", hat="helmet", hatc="cloud",
               pose="walk"), 19, 0)
    c.blit(prop_litter(26), 0, -7)
    g.blit(c, 74, y, 2)
    m = fig(jk="gold", jks="goldsh", pack="small", packc="denim", pose="walk")
    prop_notebook(m, 4, -11)
    g.blit(m, 166, HOR + 14, 1)
    g.blit(fig(jk="denim", jks="denimsh", pack="small", packc="gold",
               pose="walk"), 180, HOR + 14, 1)
    g.blit(prop_signpost(3), 194, HOR + 16, 1)
    return g


@lesson("14_Water_Lightning",
        "Pixel art of a rescuer throwing a rope from shore under a lightning storm instead of going in after the swimmer")
def l14_water_lightning():
    g = bd_water("storm")
    lightning(g, 132, 0, HOR - 10, 7)
    lightning(g, 22, 2, 28, 6, (-3, 4, -3))
    y = HOR + 26
    g.blit(arm_up(fig(jk="red", jks="redsh", hat="cap", hatc="cloud",
                      pose="stand"), "redsh"), 152, y, 2)
    for i in range(19):                                 # rope arcing out
        g.rect(144 - i * 4, y - 36 + (i * i) // 10, 3, 2, "splint")
    g.rect(58, HOR + 9, 9, 4, "blank")                  # throw bag out ahead
    g.rect(44, HOR + 5, 6, 4, "skin")                   # head and one hand up
    g.rect(36, HOR + 1, 5, 4, "skin")
    g.rect(32, HOR + 10, 26, 2, "wavecap")
    return g


@lesson("15_Kits_Preparation",
        "Pixel art of a hiker packing a first aid kit into a loaded pack at camp with a map spread on the ground")
def l15_kits_preparation():
    g = bd_plains()
    g.blit(prop_tent(16, "olive", "olivesh"), 34, HOR + 14, 2)
    y = HOR + 27
    prop_map(g, 44, y, 32, 18)
    g.blit(prop_kit(13), 104, y, 2)
    g.blit(prop_pack("teal", "tealsh", 12), 150, y, 2)
    g.blit(fig(jk="denim", jks="denimsh", hat="cap", hatc="red",
               pose="kneel"), 178, y, 2)
    reach_arm(g, 170, 156, y - 16, "denimsh")
    prop_roller(g, 122, y)
    prop_gloves(g, 132, y)
    return g


# ======================================================================
# sims
# ======================================================================
@sim("cool-first",
     "Pixel art of a hiker cooling an overheated partner in boulder shade on a sun-blasted ridge")
def s_cool_first():
    g = bd_ridge()
    sun_disc(g, 158, 8, 10)
    y = HOR + 24
    g.blit(prop_boulder(8), 60, y, 2)
    g.rect(78, y - 1, 48, 1, "shadow")
    g.blit(fig(pose="sit", jk="cloud", jks="jktsh"), 94, y, 2)
    g.rect(90, y - 17, 15, 5, "water")
    g.rect(92, y - 12, 11, 2, "watersh")
    g.blit(fig(jk="teal", jks="tealsh", hat="cap", hatc="red",
               pose="kneel"), 140, y, 2)
    prop_bottle(g, 126, y - 19)
    pour(g, 124, y - 24, 104, y - 11)
    fan_lines(g, 108, y - 20, 3)
    return g


@sim("dont-sit-him-up",
     "Pixel art of a rescuer holding a downed rider's head still beside a crashed bike as a storm closes in")
def s_dont_sit_him_up():
    g = bd_forest("storm")
    trail_band(g, HOR + 14)
    lightning(g, 150, 0, HOR - 6, 8)
    y = HOR + 27
    g.blit(prop_bike_down(), 42, y, 2)
    prop_pad(g, 84, 148, y)
    c = Grid()
    c.blit(fig(pose="supine", jk="blank", jks="blanksh"), 0, 0)
    g.blit(c, 88, y - 3, 2)
    prop_helmet(g, 90, y - 5)
    g.blit(flipped(kneel_reach(fig(jk="teal", jks="tealsh", hat="cap",
                                   hatc="cloud", pose="kneel"), 2, "tealsh")),
           72, y, 2)
    g.blit(fig(jk="gold", jks="goldsh", hat="helmet", hatc="red",
               pose="stand"), 178, y, 2)
    return g


@sim("find-the-epi",
     "Pixel art of a rescuer holding up an auto-injector found in scattered packs below a crag, a stung climber waiting")
def s_find_the_epi():
    g = bd_ridge(trail=False)
    crag(g, 0, 40, HOR + 16)
    y = HOR + 26
    for x, col, colsh in ((64, "blank", "blanksh"), (86, "olive", "olivesh"),
                          (108, "denim", "denimsh")):
        g.blit(prop_pack(col, colsh, 9), x, y, 2)
    g.blit(flipped(kneel_reach(fig(jk="teal", jks="tealsh", hat="cap",
                                   hatc="cloud", pose="kneel"), 3, "tealsh")),
           50, y, 2)
    p = arm_up(fig(jk="jkt", jks="jktsh", pose="stand"), "jktsh")
    g.blit(p, 136, y, 2)
    g.blit(prop_epipen(8), 145, y - 30, 2)              # found it, held high
    g.blit(fig(pose="sit", jk="gold", jks="goldsh"), 172, y, 2)
    hives(g, 166, y - 22, 4)
    bee(g, 118, HOR - 2)
    return g


@sim("guy-whos-fine",
     "Pixel art of a boulderer sitting on a crash pad after a ground fall while a partner takes a second set of vitals")
def s_guy_whos_fine():
    g = bd_forest()
    y = HOR + 27
    g.blit(prop_boulder(9), 46, y, 2)
    g.rect(76, y - 6, 54, 5, "blank")                  # crash pad
    g.row(76, 129, y - 1, "blanksh")
    for sx in range(82, 128, 9):
        g.rect(sx, y - 6, 2, 5, "blanksh")
    g.blit(fig(pose="sit", jk="gold", jks="goldsh"), 94, y - 6, 2)
    g.blit(fig(jk="denim", jks="denimsh", hat="cap", hatc="teal",
               pose="kneel"), 138, y - 2, 2)
    reach_arm(g, 130, 116, y - 18, "denimsh")
    prop_notebook(g, 152, y - 24)
    g.blit(prop_kit(11), 186, y, 1)
    return g


@sim("hero-complex",
     "Pixel art of a rescuer stopped short of a live rockfall slope with a patient down at its base")
def s_hero_complex():
    g = bd_slope()
    talus(g, 92, W, HOR + 18, HOR - 26)
    falling_rocks(g, ((110, 34, 4), (134, 48, 4), (152, 26, 5), (176, 40, 4)))
    rock_debris(g, 88, 118, HOR + 26)
    y = HOR + 27
    c = Grid()
    c.blit(fig(pose="supine", jk="blank", jks="blanksh"), 0, 0)
    g.blit(c, 104, y - 3, 2)
    g.blit(arms_up(fig(jk="gold", jks="goldsh", pose="stand"), "goldsh"),
           158, y, 2)
    g.blit(arm_out(fig(jk="red", jks="redsh", hat="helmet", hatc="cloud",
                       pack="small", packc="pad", pose="stand"), 4, -1, "redsh"),
           46, y, 2)
    shadow_under(g, 38, 58, y)
    return g


@sim("leave-it-frozen",
     "Pixel art of a hiker at a snowy camp with a frozen foot padded and left frozen, stove going nearby")
def s_leave_it_frozen():
    g = bd_snow()
    y = HOR + 24
    g.blit(prop_tent(16, "teal", "tealsh"), 40, HOR + 10, 2)
    prop_stove(g, 172, y)
    g.blit(fig(pose="sit", jk="red", jks="redsh", hat="beanie", hatc="pad"),
           86, y, 2)
    g.rect(98, y - 10, 26, 8, "pad")                   # foot padded, not thawed
    g.row(98, 123, y - 2, "padsh")
    g.rect(122, y - 12, 12, 8, "ice")                  # toes left frozen
    g.rect(124, y - 10, 8, 5, "icesh")
    g.rect(136, y - 8, 13, 8, "boot")                  # boot off beside them
    g.rect(136, y - 10, 13, 2, "bootsh")
    g.blit(fig(jk="denim", jks="denimsh", hat="hood", pose="kneel"),
           156, y, 2)
    return g


@sim("not-indigestion",
     "Pixel art of a man at a canyon overlook with a fist pressed to his chest while his daughter steadies him")
def s_not_indigestion():
    g = bd_overlook()
    y = HOR + 26
    g.blit(hand_to_chest(fig(jk="jkt", jks="jktsh", hat="cap", hatc="denim",
                             pose="stand")), 88, y, 2)
    for i in range(5):
        g.rect(78, y - 29 + i * 3, 2, 2, "cloud")      # sweat
    g.blit(flipped(arm_out(fig(jk="teal", jks="tealsh", pose="stand"),
                           3, 1, "tealsh")), 128, y, 2)
    g.blit(prop_boulder(6), 170, y, 2)
    g.blit(prop_pack("blank", "blanksh", 10), 42, y, 2)
    return g


@sim("sharpie-on-the-leg",
     "Pixel art of a snakebite patient sitting still while the swelling edge is marked and timed, the snake moving off")
def s_sharpie_on_the_leg():
    g = bd_desert("day")
    trail_band(g, HOR + 16)
    y = HOR + 27
    g.rect(22, y - 8, 58, 6, "trunk")                  # the log
    g.row(22, 79, y - 2, "woodsh")
    g.rect(78, y - 11, 6, 9, "woodsh")
    g.blit(prop_snake(), 14, y + 4, 2)                 # moving away, not chased
    g.blit(fig(pose="sit", jk="gold", jks="goldsh", hat="cap", hatc="teal"),
           108, y, 2)
    for i, mx in enumerate((110, 122, 132)):           # marks and times on the leg
        g.rect(mx, y - 7 + i, 4, 4, "bar")
        g.rect(mx + 1, y - 11 + i, 2, 4, "bar")
    g.blit(fig(jk="teal", jks="tealsh", pose="kneel"), 164, y - 2, 2)
    reach_arm(g, 156, 140, y - 11, "tealsh")
    g.blit(prop_kit(11), 190, y, 1)
    return g


@sim("snoring-isnt-sleeping",
     "Pixel art of a runner face-down beside a forest trail snoring while a rescuer moves to the head to open the airway")
def s_snoring_isnt_sleeping():
    g = bd_forest()
    trail_band(g, HOR + 12)
    y = HOR + 27
    g.rect(112, y - 5, 46, 4, "trunk")                 # the root that caught them
    g.row(112, 157, y - 1, "boot")
    g.blit(flipped(fig_prone()), 138, y - 3, 2)
    puffs(g, 142, y - 22, 4, (9, -5))
    g.blit(kneel_reach(fig(jk="teal", jks="tealsh", hat="cap",
                           hatc="red", pose="kneel"), 3, "tealsh"),
           166, y - 6, 2)
    g.blit(prop_pack("denim", "denimsh", 9), 30, y, 2)
    return g


@sim("stop-peeking",
     "Pixel art of a camp kitchen by the water where a rescuer holds uninterrupted pressure on a paddler's forearm")
def s_stop_peeking():
    g = bd_river()
    y = HOR + 27
    g.blit(prop_tent(14, "blank", "blanksh"), 28, HOR + 16, 2)
    prop_stove(g, 62, y)
    prop_table(g, 98, y, 28)
    g.blit(fig(pose="sit", jk="denim", jks="denimsh", hat="cap", hatc="gold"),
           132, y, 2)
    prop_dressing(g, 142, y - 18, 12)
    g.rect(140, y - 13, 16, 3, "splint")
    g.row(140, 155, y - 10, "strap")
    g.blit(fig(jk="teal", jks="tealsh", pose="kneel"), 176, y - 6, 2)
    reach_arm(g, 168, 154, y - 19, "tealsh")
    return g


@sim("sugar-first",
     "Pixel art of a ski tourer swaying at the top of a skin track while a partner holds out sugar")
def s_sugar_first():
    g = bd_snow()
    y = HOR + 22
    for i in range(10):
        g.rect(14 + i * 8, y + 5 - i // 2, 6, 2, "icesh")
        g.rect(20 + i * 8, y + 9 - i // 2, 6, 2, "cloudsh")
    g.blit(fig(jk="blank", jks="blanksh", hat="beanie", hatc="teal",
               pack="small", packc="pad", pose="stand"), 90, y, 2)
    g.rect(82, y, 22, 1, "bar")
    trek_pole(g, 104, y - 1, 13, 4)
    g.blit(flipped(arm_out(fig(jk="teal", jks="tealsh", hat="beanie",
                               hatc="red", pose="stand"), 4, -1, "tealsh")),
           152, y, 2)
    prop_gel(g, 136, y - 24)
    return g


@sim("the-burrito",
     "Pixel art of a chilled kayaker wrapped on an insulating pad by a lake with the kayak hauled up on the shore")
def s_the_burrito():
    g = bd_water("cold")
    y = HOR + 27
    g.blit(prop_boat_beached(28, "bike", "tank"), 40, y - 2, 2)
    prop_paddle(g, 74, y, 20)
    g.blit(prop_burrito(32), 90, y, 2)
    g.blit(kneel_reach(fig(jk="red", jks="redsh", hat="beanie",
                           hatc="pad", pose="kneel"), 4, "redsh"), 178, y, 2)
    return g


@sim("treat-the-dead-first",
     "Pixel art of a lightning strike on a ridge with one patient still and one sitting up, the rescuer going to the still one")
def s_treat_the_dead_first():
    g = bd_ridge("storm", trail=False)
    lightning(g, 102, 0, HOR - 2, 7)
    trail_band(g, HOR + 16)
    y = HOR + 27
    g.blit(fig_prone(jk="teal", jks="tealsh"), 70, y - 3, 2)   # the quiet one
    s = fig(pose="sit", jk="gold", jks="goldsh")
    s.rect(-5, TOP + 1, 4, 4, "skin")                          # arm up, shouting
    s.px(-3, TOP + 5, "goldsh")
    g.blit(s, 164, y, 2)
    puffs(g, 174, y - 28, 3, (7, -4))
    g.blit(flipped(fig(jk="red", jks="redsh", hat="cap", hatc="cloud",
                       pose="run")), 40, y, 2)
    for dx in (16, 26, 36):
        g.rect(40 + dx, y - 1, 4, 1, "tredge")
    return g


@sim("two-go-one-stays",
     "Pixel art of a splinted hiker and one companion staying put at dusk while two others walk out with a written note")
def s_two_go_one_stays():
    g = bd_ridge("dusk")
    y = HOR + 26
    trail_band(g, HOR + 18)
    g.blit(prop_boulder(7), 34, y, 2)
    prop_pad(g, 56, 112, y)
    g.blit(fig(pose="sit", jk="blank", jks="blanksh", hat="beanie",
               hatc="pad"), 68, y, 2)
    prop_splint(g, 82, 114, y - 3)
    g.blit(kneel_reach(fig(jk="teal", jks="tealsh", pose="kneel"),
                       3, "tealsh"), 138, y - 2, 2)
    m = fig(jk="gold", jks="goldsh", pack="big", packc="denim", pose="walk")
    prop_notebook(m, 4, -11)
    g.blit(m, 174, HOR + 12, 1)
    g.blit(fig(jk="denim", jks="denimsh", pack="big", packc="gold",
               pose="walk"), 190, HOR + 12, 1)
    return g


@sim("wiggle-feel-warm",
     "Pixel art of a scrambler on talus with a splinted forearm in a sling while a partner checks her fingertips")
def s_wiggle_feel_warm():
    g = bd_slope()
    talus(g, 152, W, HOR + 24, HOR - 6)
    y = HOR + 26
    g.blit(prop_boulder(7), 40, y, 2)
    g.blit(fig(pose="sit", jk="teal", jks="tealsh", hat="cap", hatc="gold"),
           82, y, 2)
    prop_sling(g, 80, y - 26, 22, 14)
    prop_splint(g, 84, 118, y - 10)                    # forearm splint across
    g.rect(116, y - 17, 9, 6, "skin")                  # fingertips left showing
    g.blit(fig(jk="jkt", jks="jktsh", pose="kneel"), 148, y - 8, 2)
    reach_arm(g, 140, 126, y - 17, "jktsh")
    return g


# ======================================================================
# root pages
# ======================================================================
@page("index",
      "Pixel art of a hiker kneeling with an open first aid kit beside a seated partner on a mountain trail")
def p_index():
    g = bd_ridge()
    y = HOR + 26
    g.blit(prop_boulder(7), 28, y, 2)
    g.blit(fig(pose="sit", jk="jkt", jks="jktsh", hat="cap", hatc="gold"),
           68, y, 2)
    g.blit(fig(jk="teal", jks="tealsh", hat="cap", hatc="red",
               pose="kneel"), 128, y - 2, 2)
    reach_arm(g, 120, 106, y - 18, "tealsh")
    g.blit(prop_kit(13), 100, y, 2)
    g.blit(fig(jk="denim", jks="denimsh", pack="big", packc="gold",
               pose="walk"), 170, HOR + 14, 1)
    g.blit(fig(jk="olive", jks="olivesh", pack="big", packc="blank",
               pose="walk"), 184, HOR + 14, 1)
    return g


@page("kit",
      "Pixel art of an open wilderness first aid kit on a flat rock with gauze, gloves, shears and tape laid out")
def p_kit():
    g = bd_plains()
    y = HOR + 20
    g.rect(20, y - 7, 164, 7, "rockD")                 # flat rock as a work top
    g.row(20, 183, y, "metalsh")
    g.row(20, 183, y - 7, "metal")
    g.blit(prop_kit(13), 52, y - 7, 2)
    g.blit(prop_pack("olive", "olivesh", 12), 190, y + 6, 2)
    b = Grid()
    prop_roller(b, 0, 0)
    g.blit(b, 92, y - 7, 2)
    b = Grid()
    prop_gloves(b, 0, 0)
    g.blit(b, 116, y - 7, 2)
    b = Grid()
    prop_shears(b, 0, 0)
    g.blit(b, 148, y - 7, 2)
    g.rect(160, y - 21, 12, 12, "splint")              # tape roll
    g.rect(163, y - 17, 6, 5, "cloud")
    return g


@page("reference",
      "Pixel art of a printed field reference card weighted down on a rock beside a pencil and a first aid kit")
def p_reference():
    g = bd_ridge(trail=False)
    y = HOR + 24
    g.rect(26, y - 5, 148, 5, "rockD")
    g.row(26, 173, y, "metalsh")
    g.row(26, 173, y - 5, "metal")
    c = Grid()
    prop_card(c, 0, 0, 26, 17)
    g.blit(c, 58, y - 34, 2)                           # the card, big and flat
    tick(g, 66, y - 16)
    tick(g, 66, y - 8)
    g.rect(52, y - 9, 12, 6, "rockD")                  # stone on a corner
    g.rect(118, y - 11, 24, 4, "gold")                 # pencil
    g.rect(140, y - 11, 5, 4, "wood")
    g.blit(prop_kit(11), 160, y - 5, 1)
    g.blit(fig(jk="denim", jks="denimsh", hat="cap", hatc="red",
               pose="stand"), 190, y + 6, 2)
    return g


@page("curriculum",
      "Pixel art of a many-armed trail signpost with cairns marking the route up a mountain ridge")
def p_curriculum():
    g = bd_ridge()
    y = HOR + 26
    sp = Grid()
    sp.rect(-1, -24, 3, 24, "trunk")
    sp.col(1, -24, -1, "woodsh")
    for i, dx in enumerate((-11, 2, -10, 3, -9)):      # one arm per stretch
        sp.rect(dx, -23 + i * 4, 10, 3, "wood")
        sp.rect(dx + 1, -21 + i * 4, 8, 1, "woodsh")
    g.blit(sp, 68, y, 2)
    for i, (x, hh) in enumerate(((118, 4), (140, 4), (160, 3), (178, 3))):
        g.blit(prop_cairn(hh), x, HOR + 22 - i * 3, 2)
    g.blit(flipped(fig(jk="teal", jks="tealsh", pack="big", packc="gold",
                       hat="cap", hatc="red", pose="stand")), 38, y, 2)
    return g


@page("sim",
      "Pixel art of The Rider Down: a rider lying on his back on a gravel trail with his motorcycle on its side beyond him")
def p_sim():
    g = bd_gravel()
    y = HOR + 27
    g.blit(prop_moto_down(), 154, y - 2, 2)
    prop_pad(g, 50, 120, y)
    c = Grid()
    c.blit(fig(pose="supine", jk="olive", jks="olivesh"), 0, 0)
    g.blit(c, 54, y - 4, 2)
    prop_helmet(g, 54, y - 6)
    g.blit(flipped(kneel_reach(fig(jk="jkt", jks="jktsh", hat="brim",
                                   hatc="olive", pose="kneel"), 3, "jktsh")),
           40, y, 2)
    g.blit(prop_kit(11), 128, y, 1)
    return g


@page("final_exam",
      "Pixel art of a hiker signing out at a trailhead register with a completion card in hand under big peaks")
def p_final_exam():
    g = bd_ridge()
    y = HOR + 26
    g.blit(prop_register(), 122, y, 2)
    g.blit(arm_out(fig(jk="teal", jks="tealsh", pack="big", packc="gold",
                       hat="cap", hatc="red", pose="stand"), 4, -3, "tealsh"),
           74, y, 2)
    c = Grid()
    prop_card(c, 0, 0, 20, 13, "pineL")
    g.blit(c, 26, y - 30, 2)
    tick(g, 36, y - 16)
    g.blit(prop_boulder(5), 186, y, 2)
    return g


# ======================================================================
# output
# ======================================================================
SETS = (("lessons", LESSON_OUT, LESSON_SCENES),
        ("sims", SIM_OUT, SIM_SCENES),
        ("pages", PAGE_OUT, PAGE_SCENES))


def build(names=None):
    """names: None (everything), a set name, and/or individual slugs."""
    wanted = set(names or [])
    made = 0
    for setname, outdir, scenes in SETS:
        whole = not wanted or setname in wanted
        todo = sorted(scenes) if whole else sorted(wanted & set(scenes))
        if not todo:
            continue
        os.makedirs(outdir, exist_ok=True)
        for slug in todo:
            alt, fn = scenes[slug]
            path = os.path.join(outdir, slug + ".png")
            write_png(path, fn())
            made += 1
            print("%-24s %s" % (slug, os.path.relpath(path, ROOT)))
        json.dump({s: scenes[s][0] for s in sorted(scenes)},
                  open(os.path.join(outdir, "alts.json"), "w"),
                  indent=0, sort_keys=True)
    return made


if __name__ == "__main__":
    print("%d card(s) written" % build(sys.argv[1:] or None))
