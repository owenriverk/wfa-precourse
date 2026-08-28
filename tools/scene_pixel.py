#!/usr/bin/env python3
"""Pixel-art scene generator for sim.html (The Rider Down).

Replaces the field-sketch SVG with Oregon Trail-style pixel art while
preserving the engine contract exactly:
  - toggle groups by id: pt-pad, pt-hair, pt-helmet, pt-shin-pants,
    pt-shin-exposed, pt-splint, pt-blanket (display toggled by show())
  - #pt-pos (moved transform), #pt-fig (shiver animation)
  - skin cells carry class="skin", bruise cells class="bru"
    (CSS drives base + pale/cold state fills)
  - #dusk overlay rect kept verbatim
Canvas: viewBox "0 55 800 285", 4x4-unit cells (grid 200 x 71, row r -> y=55+4r).
This supersedes tools/patient_rig.py for this scene (rig kept for history).
Regenerate + patch: python3 tools/scene_pixel.py
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CELL, OY = 4, 55
W, H = 200, 71

# palette --------------------------------------------------------------
P = {
    "sky1": "#C7D2DB", "sky2": "#D2DAD8", "sky3": "#DFE0D2",
    "cloud": "#EFF2F1", "cloudsh": "#D9DFDE",
    "ridge": "#A9B4BE", "ridgesh": "#97A3AF", "snow": "#EDF1F0",
    "hill": "#A8AF97", "hillrim": "#909880",
    "grnd": "#DCCFAF", "trail": "#E9DFC6", "tredge": "#CDBD97",
    "spk1": "#C8B990", "spk2": "#B5A57F",
    "pineL": "#52654B", "pineD": "#3E4F39", "trunk": "#6B4E32",
    "wheel": "#33383E", "hub": "#5A6068", "bike": "#A34E3B", "tank": "#7E3B2D", "bar": "#3A4048",
    "olive": "#6B7A58", "olivesh": "#59684A", "pants2": "#4A5258",
    "jkt": "#B9AE95", "jktsh": "#9C927B", "glove": "#4E4840",
    "pant": "#7E7D68", "pantsh": "#66654F",
    "boot": "#4A4038", "bootsh": "#372F28",
    "helm": "#D08A5C", "helmsh": "#B06F44", "visor": "#5A5F66",
    "hair": "#6E4F33",
    "shadow": "#C9B893",
    "splint": "#C9BC9C", "strap": "#6B6353",
    "blank": "#C96A3F", "blanksh": "#B25834",
    "pad": "#8E8064", "padsh": "#7A6D53",
    "face": "#3A424D",
    # class-driven cells (no fill attr; CSS supplies fill + state shifts)
    "SKIN": None, "BRU": None,
}
CLASS_KEYS = {"SKIN": "skin", "BRU": "bru"}


class Layer:
    def __init__(self):
        self.cells = {}

    def px(self, x, y, k):
        if 0 <= x < W and 0 <= y < H:
            self.cells[(x, y)] = k

    def rect(self, x, y, w, h, k):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.px(xx, yy, k)

    def row(self, x0, x1, y, k):
        for xx in range(x0, x1 + 1):
            self.px(xx, y, k)

    def col(self, x, y0, y1, k):
        for yy in range(y0, y1 + 1):
            self.px(x, yy, k)

    def disc(self, cx, cy, r, k):
        for yy in range(int(cy - r), int(cy + r) + 1):
            for xx in range(int(cx - r), int(cx + r) + 1):
                if (xx - cx) ** 2 + (yy - cy) ** 2 <= r * r + 0.4:
                    self.px(xx, yy, k)

    def emit(self):
        out = []
        for y in range(H):
            x = 0
            while x < W:
                k = self.cells.get((x, y))
                if k is None:
                    x += 1
                    continue
                x0 = x
                while x < W and self.cells.get((x, y)) == k:
                    x += 1
                px_x, px_y, px_w = x0 * CELL, OY + y * CELL, (x - x0) * CELL
                if k in CLASS_KEYS:
                    out.append('<rect x="%d" y="%d" width="%d" height="%d" class="%s"/>'
                               % (px_x, px_y, px_w, CELL, CLASS_KEYS[k]))
                else:
                    out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s"/>'
                               % (px_x, px_y, px_w, CELL, P[k]))
        return "".join(out)


# ---------------------------------------------------------------- terrain
def build_background():
    L = Layer()
    L.rect(0, 0, W, 12, "sky1")
    L.rect(0, 12, W, 8, "sky2")
    L.rect(0, 20, W, 16, "sky3")
    # clouds
    for cx, cy in ((38, 6), (132, 5)):
        L.row(cx - 8, cx + 8, cy, "cloud")
        L.row(cx - 11, cx + 11, cy + 1, "cloud")
        L.row(cx - 9, cx + 12, cy + 2, "cloud")
        L.row(cx - 6, cx + 9, cy + 3, "cloudsh")
    # far ridge: 45-deg-ish peaks, slope 2 cols per row
    peaks = [(20, 20), (60, 24), (98, 17), (140, 23), (178, 20)]
    tops = []
    for x in range(W):
        t = 40
        for px_, apex in peaks:
            t = min(t, apex + abs(x - px_) // 2)
        tops.append(min(t, 40))
    for x in range(W):
        for y in range(tops[x], 41):
            L.px(x, y, "ridge")
    # right-face shading + snow caps
    for x in range(1, W):
        if tops[x] > tops[x - 1]:
            for y in range(tops[x], min(tops[x] + 5, 41)):
                L.px(x, y, "ridgesh")
    for px_, apex in peaks:
        for x in range(W):
            if abs(x - px_) <= 4 and tops[x] <= apex + 2:
                for y in range(tops[x], min(tops[x] + 2, 41)):
                    L.px(x, y, "snow")
    # foothills
    hill = [40, 40, 39, 38, 38, 37, 37, 38, 39, 39, 40, 41, 41, 40, 39, 38, 38, 39, 40, 41]
    for x in range(W):
        t = hill[(x * len(hill)) // W]
        L.px(x, t - 1, "hillrim")
        for y in range(t, 46):
            L.px(x, y, "hill")
    # ground + trail band
    L.rect(0, 45, W, H - 45, "grnd")
    L.row(0, W - 1, 51, "tredge")
    for y in range(52, 64):
        L.row(0, W - 1, y, "trail")
    L.row(0, W - 1, 64, "tredge")
    # gravel speckles (fixed, hand-scattered)
    for x, y, k in ((12, 55, "spk1"), (30, 60, "spk2"), (47, 53, "spk1"), (70, 66, "spk1"),
                    (88, 58, "spk2"), (104, 67, "spk1"), (122, 54, "spk2"), (147, 61, "spk1"),
                    (166, 66, "spk2"), (188, 56, "spk1"), (57, 68, "spk2"), (139, 68, "spk1"),
                    (23, 66, "spk1"), (183, 68, "spk2"), (95, 62, "spk1")):
        L.px(x, y, k)
        L.px(x + 1, y, k)
    # pines on the foothill line
    for cx, top, h_ in ((30, 37, 9), (44, 41, 6), (86, 38, 8), (112, 41, 6), (168, 37, 9), (187, 40, 7)):
        for i in range(h_):
            half = min((i * 2) // 3 + 1, 4)
            L.row(cx - half, cx, top + i, "pineL")
            L.row(cx, cx + half, top + i, "pineD")
        L.col(cx, top + h_, top + h_ + 1, "trunk")
    # tiny distant pines
    for cx, top in ((70, 36), (128, 37)):
        for i in range(4):
            L.row(cx - i // 2, cx + i // 2, top + i, "pineD")
    return L


def build_partner():
    L = Layer()
    L.disc(22, 41, 2.0, "SKIN")            # head
    L.row(20, 24, 38, "helm")              # helmet arc
    L.row(19, 25, 39, "helm")
    L.rect(19, 44, 7, 7, "olive")          # jacket
    L.rect(19, 49, 7, 2, "olivesh")
    L.rect(26, 44, 5, 2, "olive")          # arm reaching toward patient
    L.rect(31, 44, 2, 2, "SKIN")
    L.rect(19, 51, 2, 7, "pants2")         # legs, gap between
    L.rect(24, 51, 2, 7, "pants2")
    L.rect(18, 58, 3, 2, "boot")
    L.rect(24, 58, 3, 2, "boot")
    return L


def build_bike():
    L = Layer()
    L.disc(156, 58, 4.5, "wheel")
    L.px(156, 58, "hub")
    L.disc(172, 58, 4.5, "wheel")
    L.px(172, 58, "hub")
    # frame between wheels, tank + seat humps, on its side
    L.rect(158, 55, 13, 3, "bike")
    L.rect(160, 53, 6, 2, "tank")
    L.rect(166, 54, 4, 1, "bootsh")           # seat
    L.col(173, 52, 55, "bar")                 # handlebar sticking up
    L.row(174, 175, 51, "bar")
    L.row(150, 154, 57, "hub")                # rear exhaust glint
    L.row(146, 152, 61, "spk2")               # skid mark
    L.row(149, 155, 62, "spk2")
    return L


# ---------------------------------------------------------------- patient
def build_patient():
    """Returns dict of group name -> Layer. Base = always-visible body."""
    g = {k: Layer() for k in ("base", "pad", "hair", "helmet", "shinp", "shine", "splint", "blanket")}
    B = g["base"]

    # shadow under body
    B.row(60, 141, 63, "shadow")

    # head (skin disc, face-up)
    B.disc(65, 57, 4.6, "SKIN")
    B.row(66, 68, 54, "face")                  # brow
    B.px(67, 55, "face")                       # eye (face points up)
    B.px(69, 56, "face")                       # nose hint

    # torso jacket with shoulder rise
    B.rect(70, 54, 26, 8, "jkt")
    B.rect(70, 53, 5, 1, "jkt")
    B.rect(70, 60, 26, 2, "jktsh")
    B.col(70, 54, 61, "jktsh")                 # collar shade
    # near arm across body, glove resting on hip
    B.row(73, 79, 54, "jktsh")
    B.row(76, 86, 55, "jktsh")
    B.row(82, 90, 56, "jktsh")
    B.rect(91, 55, 3, 3, "glove")
    B.col(96, 55, 61, "pantsh")                # belt line

    # pelvis + thigh (armored pants)
    B.rect(96, 55, 20, 7, "pant")
    B.rect(96, 60, 20, 2, "pantsh")
    B.rect(116, 55, 8, 6, "pant")
    B.rect(116, 59, 8, 2, "pantsh")

    # boots point UP (supine); far boot peeks behind the shin
    B.rect(132, 51, 3, 4, "bootsh")            # far boot hint
    B.rect(136, 49, 4, 10, "boot")
    B.col(140, 49, 57, "bootsh")               # sole
    B.row(136, 139, 58, "bootsh")

    # shin variants -----------------------------------------------------
    S = g["shinp"]                             # pants over shin (default)
    S.rect(124, 55, 12, 6, "pant")
    S.rect(124, 59, 12, 2, "pantsh")

    E = g["shine"]                             # exposed: skin + fracture + bruise
    E.rect(124, 56, 12, 4, "SKIN")
    E.rect(126, 53, 6, 3, "SKIN")              # apex-up angulation, tented (loud)
    E.px(126, 54, "SKIN"); E.px(131, 54, "SKIN")
    E.row(127, 130, 53, "BRU")                 # swelling crest discolored
    E.rect(125, 57, 7, 2, "BRU")               # bruise field
    E.row(124, 135, 60, "shadow")

    # splint over shin: rigid slab, straps, toe window stays open
    SP = g["splint"]
    SP.rect(122, 54, 15, 7, "splint")
    for sx in (123, 128, 133):
        SP.col(sx, 53, 61, "strap")
        SP.col(sx + 1, 53, 61, "strap")

    # helmet (over head): squared open-face shell, face window, visor up
    HM = g["helmet"]
    HM.rect(59, 52, 12, 10, "helm")
    HM.row(60, 70, 51, "helm")
    HM.row(60, 70, 62, "helm")
    HM.col(59, 53, 61, "helmsh")               # shell back shade
    HM.col(60, 52, 62, "helmsh")
    HM.row(61, 70, 62, "helmsh")               # chin rim
    HM.rect(66, 54, 5, 6, "SKIN")              # face window
    HM.row(66, 68, 54, "face")                 # brow
    HM.px(67, 55, "face")                      # eye
    HM.px(69, 56, "face")                      # nose
    HM.px(67, 58, "face")                      # mouth
    HM.row(64, 71, 50, "visor")                # visor flipped up, attached
    HM.px(71, 51, "visor")

    # hair (revealed when helmet comes off)
    HR = g["hair"]
    HR.row(62, 66, 51, "hair")
    HR.row(61, 67, 52, "hair")
    HR.rect(60, 53, 2, 3, "hair")

    # insulation: pad below, blanket above
    PD = g["pad"]
    PD.rect(58, 61, 85, 2, "pad")
    PD.row(58, 142, 61, "padsh")

    BL = g["blanket"]
    BL.rect(70, 52, 68, 9, "blank")
    BL.rect(70, 58, 68, 2, "blanksh")
    for zx in range(70, 138, 4):               # zigzag bottom edge
        BL.px(zx, 61, "blank")
    BL.row(84, 86, 54, "blanksh")              # fold lines
    BL.row(104, 106, 55, "blanksh")
    return g


def build_svg():
    bg = build_background().emit()
    partner = build_partner().emit()
    bike = build_bike().emit()
    pt = build_patient()
    svg = f'''<svg id="scene" viewBox="0 55 800 285" role="img" aria-label="A rider lying on his back on a gravel trail, his motorcycle on its side beyond him, under an overcast sky." aria-describedby="scene-desc" shape-rendering="crispEdges">
        <desc id="scene-desc">Pixel illustration of the scene. It updates as you act.</desc>
        <!-- PIXEL-SCENE:START (generated by tools/scene_pixel.py — edit the generator, not these rects) -->
        <g>{bg}</g>
        <g>{bike}</g>
        <g>{partner}</g>
        <g id="pt-pos"><g id="pt-fig">
          <g id="pt-pad" style="display:none;">{pt["pad"].emit()}</g>
          {pt["base"].emit()}
          <g id="pt-hair" style="display:none;">{pt["hair"].emit()}</g>
          <g id="pt-helmet">{pt["helmet"].emit()}</g>
          <g id="pt-shin-pants">{pt["shinp"].emit()}</g>
          <g id="pt-shin-exposed" style="display:none;">{pt["shine"].emit()}</g>
          <g id="pt-splint" style="display:none;">{pt["splint"].emit()}</g>
          <g id="pt-blanket" style="display:none;">{pt["blanket"].emit()}</g>
        </g></g>
        <!-- PIXEL-SCENE:END -->
        <!-- daylight fading -->
        <rect id="dusk" x="0" y="0" width="800" height="340" fill="#4A4433" opacity="0"/>
      </svg>'''
    return svg


def main():
    path = os.path.join(ROOT, "sim.html")
    s = open(path).read()
    new_svg = build_svg()
    s2, n = re.subn(r'<svg id="scene".*?</svg>', lambda m: new_svg, s, count=1, flags=re.S)
    assert n == 1, "scene svg not found"
    open(path, "w").write(s2)
    print("sim.html scene replaced: %d bytes of pixel art" % len(new_svg))


if __name__ == "__main__":
    main()
