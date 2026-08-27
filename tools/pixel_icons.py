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


if __name__ == "__main__":
    main()
    write_sprites()
