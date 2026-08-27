#!/usr/bin/env python3
"""Generate Oregon Trail-style 1-bit pixel icons as SVG masks.

Each icon is an ASCII grid ('#' = filled). Output: assets/img/pixel/<name>.svg,
black fill (only alpha matters — site.css applies them via CSS mask, so they
render in currentColor). Rects are merged per row run for small files.
Regenerate with: python3 tools/pixel_icons.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "pixel")

ICONS = {
# Trail & Mountain — twin peaks
"mountains": """
.....#..........
....###.........
...#####........
..##.####...#...
.##...###..###..
##.....##.#####.
#......########.
......##########
""",
# Climbing & Snow — spire with snow band
"snowflake": """
.......##.......
..##...##...##..
...##..##..##...
....##.##.##....
.....######.....
......####......
.##############.
.##############.
......####......
.....######.....
....##.##.##....
...##..##..##...
..##...##...##..
.......##.......
""",
# Water & Maritime — canoe with paddler
"canoe": """
........##......
........##......
.......####.....
........##......
......######....
#..............#
##............##
.####......####.
...##########...
""",
# Motorized & Airborne — spoked wheel
"wheel": """
.....######.....
...##########...
..############..
..############..
.##############.
.#####....#####.
.####......####.
.####......####.
.#####....#####.
.##############.
..############..
..############..
...##########...
.....######.....
""",
# Youth & Education — campfire
"campfire": """
.......#........
......##........
......###.......
.....#####......
....#######.....
...#########....
...#########....
....#######.....
.....#####......
................
..############..
.##############.
""",
# Remote Work & Field Science — binoculars
"flask": """
.....######.....
......####......
......####......
......####......
.....######.....
.....######.....
....########....
...##########...
..############..
..############..
.##############.
""",
# Travel & Expeditions — covered wagon
"wagon": """
...##########...
..###.####.###..
.####.####.####.
.####.####.####.
.##############.
################
....##.....##...
...####...####..
...####...####..
....##.....##...
""",
# Rescue & Public Safety — first aid cross
"cross": """
.....######.....
.....######.....
.....######.....
################
################
################
################
################
################
.....######.....
.....######.....
.....######.....
""",
# Rural & Homesteading — barn
"barn": """
.......##.......
.....######.....
...##########...
.##############.
.##############.
.#####....#####.
.#####....#####.
.#####.##.#####.
.#####.##.#####.
.#####.##.#####.
""",
# Pros, Events & Coaching — course pennant
"flag": """
.##.............
.############...
.###########....
.#########......
.######.........
.####...........
.##.............
.##.............
.##.............
.##.............
""",
# utility — pixel heart (HP)
"heart": """
...###....###...
..#####..#####..
..############..
..############..
..############..
...##########...
....########....
.....######.....
......####......
.......##.......
""",
}

# Wide caravan strip for a section divider: oxen + covered wagon + walker + trees.
ICONS["caravan"] = """
................................................................
.................##########........................#............
................###.####.###.......##.............###...........
................###.####.###....#.####....##.....#####..........
...............##############...#..##....####.....###.......#...
...#..........################..#..##.....##.....#####.....###..
..###..#........###......###....#.#..#....##....#######...#####.
.########.......###......###....#.#..#...#..#.....##.......##...
##########.......#........#.....##....#..#..#.....##.......##...
################################################################
"""


def rects(grid):
    rows = [r for r in grid.strip("\n").split("\n")]
    w = max(len(r) for r in rows)
    out = []
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            if row[x] == "#":
                x0 = x
                while x < len(row) and row[x] == "#":
                    x += 1
                out.append((x0, y, x - x0))
            else:
                x += 1
    return w, len(rows), out


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, grid in ICONS.items():
        w, h, rr = rects(grid)
        body = "".join('<rect x="%d" y="%d" width="%d" height="1"/>' % (x, y, rw) for x, y, rw in rr)
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
               'shape-rendering="crispEdges" fill="#000">%s</svg>' % (w, h, body))
        open(os.path.join(OUT, name + ".svg"), "w").write(svg)
        print("%-10s %dx%d  %d rects" % (name, w, h, len(rr)))




# ---- Color sprites (real colored SVGs, not masks) ----
# Painted programmatically; palette letters map to fills.
def _paint(w, h):
    return [["."] * w for _ in range(h)]

def _px(g, ch, r, c0, c1=None):
    for c in range(c0, (c1 if c1 is not None else c0) + 1):
        g[r][c] = ch

def duck_grid():
    """Trail duck mascot: mallard with a red first-aid pannier, facing right."""
    g = _paint(24, 20)
    # head (green) rows 0-6, cols 13-20
    _px(g, "G", 0, 15, 18)
    _px(g, "G", 1, 14, 19)
    _px(g, "G", 2, 13, 20)
    _px(g, "G", 3, 13, 20)
    _px(g, "G", 4, 13, 20)
    _px(g, "G", 5, 13, 19)
    _px(g, "G", 6, 13, 18)
    # eye (black) with white glint
    _px(g, "K", 2, 17, 18); _px(g, "W", 2, 17)
    # bill (orange)
    _px(g, "O", 3, 21, 23)
    _px(g, "O", 4, 21, 22)
    # white neck ring
    _px(g, "W", 7, 13, 17)
    # chest (chestnut) sloping under neck
    _px(g, "C", 8, 12, 16)
    _px(g, "C", 9, 12, 16)
    _px(g, "C", 10, 12, 15)
    _px(g, "C", 11, 12, 15)
    # tail (body color) kicking up left
    _px(g, "B", 6, 0, 1)
    _px(g, "B", 7, 0, 2)
    # body (gray-blue)
    _px(g, "B", 8, 1, 11)
    _px(g, "B", 9, 1, 11)
    _px(g, "B", 10, 2, 11)
    _px(g, "B", 11, 2, 11)
    _px(g, "B", 12, 3, 14)
    _px(g, "B", 13, 4, 13)
    _px(g, "B", 14, 5, 12)
    # red first-aid pannier with white cross, on the flank
    for r in range(9, 14):
        _px(g, "R", r, 5, 9)
    _px(g, "W", 10, 7); _px(g, "W", 11, 6, 8); _px(g, "W", 12, 7)
    # legs + feet (orange)
    _px(g, "O", 15, 7, 8); _px(g, "O", 15, 11, 12)
    _px(g, "O", 16, 7, 8); _px(g, "O", 16, 11, 12)
    _px(g, "O", 17, 6, 9); _px(g, "O", 17, 10, 13)
    return g

SPRITE_COLORS = {"G": "#1E7A3C", "K": "#101418", "W": "#F5F7F4", "O": "#E8A33D",
                 "C": "#8A4B2A", "B": "#8B98A8", "R": "#C6352B"}

def write_sprites():
    for name, grid in (("duck", duck_grid()),):
        h, w = len(grid), len(grid[0])
        parts = []
        for y, row in enumerate(grid):
            x = 0
            while x < w:
                ch = row[x]
                if ch != ".":
                    x0 = x
                    while x < w and row[x] == ch:
                        x += 1
                    parts.append('<rect x="%d" y="%d" width="%d" height="1" fill="%s"/>'
                                 % (x0, y, x - x0, SPRITE_COLORS[ch]))
                else:
                    x += 1
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
               'shape-rendering="crispEdges">%s</svg>' % (w, h, "".join(parts)))
        open(os.path.join(OUT, name + ".svg"), "w").write(svg)
        print("%-10s %dx%d sprite" % (name, w, h))




# ---- Procedural scene tiles + stat icons (masks) ----
def _grid_str(g):
    return "\n".join("".join(r) for r in g) + "\n"

def make_skyline(w=128, h=22):
    """Seamless repeat-x mountain skyline: 45-degree peaks, wrap-aware."""
    peaks = [(10, 13), (30, 7), (52, 15), (78, 4), (100, 12), (118, 9)]
    g = _paint(w, h)
    for c in range(w):
        top = h
        for px_, apex in peaks:
            d = min(abs(c - px_), w - abs(c - px_))
            top = min(top, apex + d // 2)
        for r in range(max(0, top), h):
            g[r][c] = "#"
    return _grid_str(g)

def _pine(g, cx, top, half):
    rows = [(top, 0), (top + 1, 1), (top + 2, 2), (top + 3, 1), (top + 4, 2),
            (top + 5, 3), (top + 6, half)]
    for r, hw in rows:
        _px(g, "#", r, cx - min(hw, half), cx + min(hw, half))
    _px(g, "#", top + 7, cx, cx)
    _px(g, "#", top + 8, cx, cx)

def make_pines(w=128, h=22):
    g = _paint(w, h)
    _pine(g, 12, 8, 4)
    _pine(g, 34, 11, 3)
    _pine(g, 74, 6, 5)
    _pine(g, 99, 11, 3)
    _pine(g, 117, 9, 4)
    _px(g, "#", 20, 0, w - 1)
    _px(g, "#", 21, 0, w - 1)
    return _grid_str(g)

def make_train(w=128, h=22):
    """Wagon, walker, dog, walker with staff — feet on row 19, ground transparent."""
    g = _paint(w, h)
    # covered wagon x16-31, rows 8-19
    _px(g, "#", 8, 19, 28)
    for r in (9, 10):
        _px(g, "#", r, 18, 29); g[r][21] = "."; g[r][26] = "."
    _px(g, "#", 11, 17, 30)
    _px(g, "#", 12, 16, 31)
    for r in (13, 14, 15, 16):
        _px(g, "#", r, 18, 20); _px(g, "#", r, 27, 29)
    for r in (17, 18):
        _px(g, "#", r, 18, 20); _px(g, "#", r, 27, 29)
    _px(g, "#", 19, 19, 19); _px(g, "#", 19, 28, 28)
    # walker x44-49
    _px(g, "#", 9, 46, 47); _px(g, "#", 10, 45, 48)
    _px(g, "#", 11, 46, 47); _px(g, "#", 12, 46, 47); _px(g, "#", 13, 46, 47)
    _px(g, "#", 14, 45, 45); _px(g, "#", 14, 48, 48)
    for r in (15, 16, 17): _px(g, "#", r, 45, 45); _px(g, "#", r, 48, 48)
    _px(g, "#", 18, 44, 45); _px(g, "#", 18, 48, 49)
    _px(g, "#", 19, 44, 44); _px(g, "#", 19, 49, 49)
    # trotting dog x56-64
    _px(g, "#", 14, 63, 64)
    _px(g, "#", 15, 57, 64)
    _px(g, "#", 16, 56, 63)
    _px(g, "#", 17, 57, 58); _px(g, "#", 17, 61, 62)
    _px(g, "#", 18, 57, 57); _px(g, "#", 18, 62, 62)
    _px(g, "#", 19, 57, 57); _px(g, "#", 19, 62, 62)
    # walker with staff x70-77
    _px(g, "#", 8, 73, 74); _px(g, "#", 9, 72, 75)
    _px(g, "#", 10, 73, 74); _px(g, "#", 11, 73, 74); _px(g, "#", 12, 73, 74)
    for r in range(13, 18): _px(g, "#", r, 72, 72); _px(g, "#", r, 75, 75)
    _px(g, "#", 18, 71, 72); _px(g, "#", 18, 75, 76)
    _px(g, "#", 19, 71, 71); _px(g, "#", 19, 76, 76)
    for r in range(9, 20): _px(g, "#", r, 78, 78)   # staff
    # trail duck waddling behind (x87-97)
    _px(g, "#", 12, 93, 95)
    _px(g, "#", 13, 93, 97)
    _px(g, "#", 14, 88, 95)
    _px(g, "#", 15, 87, 95)
    _px(g, "#", 16, 88, 94)
    _px(g, "#", 13, 87, 87)
    _px(g, "#", 17, 90, 90); _px(g, "#", 17, 93, 93)
    _px(g, "#", 18, 90, 90); _px(g, "#", 18, 93, 93)
    _px(g, "#", 19, 89, 90); _px(g, "#", 19, 92, 93)
    return _grid_str(g)

ICONS["skyline"] = make_skyline()
ICONS["pines"] = make_pines()
ICONS["train"] = make_train()

ICONS["manual"] = """
...##########...
...##########...
...##########...
...####..####...
...####..####...
...##......##...
...##......##...
...####..####...
...####..####...
...##########...
...##########...
...##########...
"""
ICONS["hourglass"] = """
.############.
.############.
..##########..
...########...
....######....
.....####.....
......##......
.....####.....
....######....
...########...
..##########..
.############.
.############.
"""
ICONS["question"] = """
...########...
..##########..
.####....####.
.####....####.
.........####.
........####..
......####....
.....####.....
.....####.....
..............
.....####.....
.....####.....
"""
ICONS["sun"] = """
.......##.......
.......##.......
..##...##...##..
...##.####.##...
.....######.....
....########....
##.##########.##
##.##########.##
....########....
.....######.....
...##.####.##...
..##...##...##..
.......##.......
.......##.......
"""
ICONS["cloud"] = """
.......######...........
.....##########.....##..
...##############..####.
..######################
.#######################
########################
"""


if __name__ == "__main__":
    main()
    write_sprites()
