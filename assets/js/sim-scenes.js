/* Scene-part library for practice scenarios (sims/) — Oregon Trail pixel art.
   House style is tools/scene_pixel.py, the generator behind the Rider Down
   scene in sim.html: same cell size, same palette hexes, same class rules.

   GRID. viewBox stays 0 0 800 260, drawn in 4x4 pixel cells — a 200 x 65 grid
   where column c is x = 4c and row r is y = 4r. Every rect emitted here is
   snapped to that grid and the <svg> carries shape-rendering="crispEdges", so
   nothing lands on a half cell. Landmarks scenario files position against:
   horizon y=172, trail band y=184..240, ground y≈230 (figures anchor at the
   feet), standing figure ≈56 tall, supine figure ≈88 long with the head at
   the left origin.

   PALETTE. SCN.P maps a name to a hex. Every name scene_pixel.py uses carries
   that generator's exact hex, so a sim scene and the Rider Down scene read as
   the same game. A few names scene_pixel.py never needed are new and stay in
   family: sun/sunhi, storm/stormsh, water/watersh/wavecap, rockD, dusk.

   SKIN AND BRUISES. Skin cells are emitted with class="skin" and NO fill;
   bruise, swelling and hives cells with class="bru". assets/css/sim.css owns
   those fills plus the #scene.pale / #scene.cold state shifts — never
   hard-code a skin colour. The pixel helpers take the special colour names
   'SKIN' and 'BRU' to emit those class-driven cells.

   USE. Every function returns an SVG fragment string. Compose the scene with
   SCN.wrap(parts, opts), drive state by toggling ids — SCN.show('id', bool) —
   or scene-wide classes — SCN.cls('cold', bool). Overlays default to
   display:none. Art changes must be loud (AGENTS.md §6). */
(function () {
  'use strict';
  var SCN = {};

  /* ---- grid + palette ---------------------------------------------------- */
  var CELL = 4;
  var HOR = 172;               /* horizon row: sky above, ground below */

  var P = {
    sky1: '#C7D2DB', sky2: '#D2DAD8', sky3: '#DFE0D2',
    cloud: '#EFF2F1', cloudsh: '#D9DFDE',
    ridge: '#A9B4BE', ridgesh: '#97A3AF', snow: '#EDF1F0',
    hill: '#A8AF97', hillrim: '#909880',
    grnd: '#DCCFAF', trail: '#E9DFC6', tredge: '#CDBD97',
    spk1: '#C8B990', spk2: '#B5A57F',
    pineL: '#52654B', pineD: '#3E4F39', trunk: '#6B4E32',
    wheel: '#33383E', hub: '#5A6068', bike: '#A34E3B', tank: '#7E3B2D', bar: '#3A4048',
    olive: '#6B7A58', olivesh: '#59684A', pants2: '#4A5258',
    jkt: '#B9AE95', jktsh: '#9C927B', glove: '#4E4840',
    pant: '#7E7D68', pantsh: '#66654F',
    boot: '#4A4038', bootsh: '#372F28',
    helm: '#D08A5C', helmsh: '#B06F44', visor: '#5A5F66',
    hair: '#6E4F33', shadow: '#C9B893',
    splint: '#C9BC9C', strap: '#6B6353',
    blank: '#C96A3F', blanksh: '#B25834',
    pad: '#8E8064', padsh: '#7A6D53',
    face: '#3A424D',
    /* names the Rider Down generator never needed */
    sun: '#EBD9A8', sunhi: '#F6EDCE',
    storm: '#A3ABA6', stormsh: '#8B948F',
    dsk1: '#9BA3B0', dsk2: '#C0B2A6', dsk3: '#DEC49F',
    water: '#9CB0BC', watersh: '#879DAB', wavecap: '#CBD7DD',
    rockD: '#7E8891', dusk: '#4A4433'
  };
  SCN.P = P;

  /* ---- pixel helpers ------------------------------------------------------
     Colour may be a palette key ('grnd'), a raw hex ('#C96A3F'), or the
     special 'SKIN' / 'BRU', which emit class-driven cells with no fill. */
  function sn(v) { return Math.round(v / CELL) * CELL; }

  function cellRect(x, y, w, h, c) {
    if (!(w > 0) || !(h > 0)) return '';
    var r = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"';
    if (c === 'SKIN') return r + ' class="skin"/>';
    if (c === 'BRU') return r + ' class="bru"/>';
    return r + ' fill="' + (P[c] || c) + '"/>';
  }

  SCN.pxRect = function (x, y, w, h, c) {
    if (!(w > 0) || !(h > 0)) return '';
    return cellRect(sn(x), sn(y), Math.max(CELL, sn(w)), Math.max(CELL, sn(h)), c);
  };
  SCN.pxRow = function (x0, x1, y, c) {
    var a = sn(Math.min(x0, x1)), b = sn(Math.max(x0, x1));
    return cellRect(a, sn(y), b - a + CELL, CELL, c);
  };
  SCN.pxDisc = function (cx, cy, r, c) {
    var out = '', y, dy, hw, a, b;
    for (y = sn(cy - r) - CELL; y <= cy + r; y += CELL) {
      dy = y + CELL / 2 - cy;
      hw = r * r - dy * dy;
      if (hw <= 0) continue;
      hw = Math.sqrt(hw);
      a = sn(cx - hw); b = sn(cx + hw);
      if (b <= a) { out += cellRect(sn(cx), y, CELL, CELL, c); continue; }
      out += cellRect(a, y, b - a, CELL, c);
    }
    return out;
  };

  var R = SCN.pxRect, ROW = SCN.pxRow, DISC = SCN.pxDisc;

  /* run-length fill of a per-column skyline: tops[i] is the top y of column i */
  function skyline(tops, bottom, fill, rim) {
    var out = '', i0 = 0, i, x0, w;
    for (i = 1; i <= tops.length; i++) {
      if (i === tops.length || tops[i] !== tops[i0]) {
        x0 = i0 * CELL; w = (i - i0) * CELL;
        if (tops[i0] < bottom) {
          if (rim) out += R(x0, tops[i0] - CELL, w, CELL, rim);
          out += R(x0, tops[i0], w, bottom - tops[i0], fill);
        }
        i0 = i;
      }
    }
    return out;
  }

  /* ---- shell --------------------------------------------------------------
     Sky bands, weather, the base ground, then the scene, then the dusk tint
     LAST so it dims everything (the old field-sketch tint sat underneath). */
  SCN.wrap = function (inner, opts) {
    opts = opts || {};
    var s = '', i;
    var dusk = opts.sky === 'dusk';

    s += R(0, 0, 800, 56, dusk ? 'dsk1' : 'sky1') +
         R(0, 56, 800, 48, dusk ? 'dsk2' : 'sky2') +
         R(0, 104, 800, HOR - 104, dusk ? 'dsk3' : 'sky3');

    if (opts.sky === 'storm') {
      /* flat-bottomed cloud deck with a lumpy underside */
      s += R(0, 0, 800, 88, 'storm') + R(0, 0, 800, 20, 'stormsh');
      var lump = [[-20, 120, 20], [90, 150, 12], [230, 170, 24], [380, 140, 12],
                  [500, 180, 20], [660, 150, 12], [740, 90, 24]];
      for (i = 0; i < lump.length; i++) {
        s += R(lump[i][0], 88, lump[i][1], lump[i][2], 'storm');
        s += R(lump[i][0] + 12, 88 + lump[i][2], lump[i][1] - 24, 8, 'storm');
        s += R(lump[i][0] + 12, 84 + lump[i][2], lump[i][1] - 24, 8, 'stormsh');
      }
    } else {
      var puff = [[150, 44], [520, 32]];
      for (i = 0; i < puff.length; i++) {
        var cx = puff[i][0], cy = puff[i][1];
        s += ROW(cx - 32, cx + 32, cy, 'cloud') +
             ROW(cx - 44, cx + 48, cy + 4, 'cloud') +
             ROW(cx - 36, cx + 44, cy + 8, 'cloud') +
             ROW(cx - 24, cx + 36, cy + 12, 'cloudsh');
      }
    }
    if (opts.sky === 'noon') s += DISC(700, 44, 24, 'sun') + DISC(700, 44, 14, 'sunhi');

    /* base ground — trail()/lake()/snowGround() paint over it */
    s += R(0, HOR, 800, 260 - HOR, opts.winter ? 'snow' : 'grnd');
    s += R(0, HOR, 800, CELL, opts.winter ? 'cloudsh' : 'tredge');

    var over = dusk
      ? '<rect x="0" y="0" width="800" height="260" fill="' + P.dusk + '" opacity="0.26"/>' : '';

    return '<svg id="scene" viewBox="0 0 800 260" role="img" shape-rendering="crispEdges" aria-label="' +
      (opts.label || 'Scene illustration — it updates as you act.') + '">' +
      s + inner + over + '</svg>';
  };

  /* ---- backdrops (draw back-to-front) ------------------------------------ */
  SCN.mountains = function () {
    var peaks = [[108, 88], [240, 124], [400, 84], [556, 128], [688, 96]];
    var tops = [], s = '', x, i, k, t;

    for (x = 0; x < 800; x += CELL) {
      t = HOR;
      for (i = 0; i < peaks.length; i++) {
        t = Math.min(t, peaks[i][1] + Math.abs(x + CELL / 2 - peaks[i][0]) * 0.5);
      }
      tops.push(Math.min(sn(t), HOR));
    }
    s += skyline(tops, HOR, 'ridge', null);

    /* right faces fall into shade (sampled +/-2 columns so the band follows the
       slope instead of striping on every step); peaks catch snow */
    for (i = 0; i < tops.length; i++) {
      var back = tops[Math.max(0, i - 2)], fwd = tops[Math.min(tops.length - 1, i + 2)];
      if (tops[i] < HOR && (fwd > tops[i] || tops[i] > back)) {
        s += R(i * CELL, tops[i], CELL, Math.min(24, HOR - tops[i]), 'ridgesh');
      }
    }
    for (k = 0; k < peaks.length; k++) {
      for (i = 0; i < tops.length; i++) {
        x = i * CELL;
        if (Math.abs(x - peaks[k][0]) <= 16 && tops[i] <= peaks[k][1] + 12) {
          s += R(x, tops[i], CELL, 8, 'snow');
        }
      }
    }

    /* foothills in front of the ridge */
    var wave = [160, 160, 156, 152, 152, 148, 148, 152, 156, 156,
                160, 164, 164, 160, 156, 152, 152, 156, 160, 164];
    var htops = [];
    for (x = 0; x < 800; x += CELL) htops.push(wave[Math.floor(x * wave.length / 800)]);
    s += skyline(htops, HOR, 'hill', 'hillrim');

    /* distant pines on the hill line */
    var far = [[120, 148], [468, 148], [620, 152]];
    for (k = 0; k < far.length; k++) {
      for (i = 0; i < 5; i++) {
        s += ROW(far[k][0] - i * 2, far[k][0] + i * 2, far[k][1] + i * 4, 'pineD');
      }
    }
    return s;
  };

  SCN.trees = function (xs, y) {
    y = y || 168;
    return xs.map(function (x) {
      var cx = sn(x), b = sn(y), s = '', i, half, ry;
      for (i = 0; i < 7; i++) {
        half = Math.min(Math.floor(i / 2) * 4 + 4, 8);
        ry = b - 28 + i * 4;
        s += R(cx - half, ry, half, CELL, 'pineL') + R(cx, ry, half + CELL, CELL, 'pineD');
      }
      s += R(cx - CELL, b, 8, 8, 'trunk');
      return s;
    }).join('');
  };

  SCN.trail = function () {
    var s = R(0, 184, 800, CELL, 'tredge') + R(0, 188, 800, 52, 'trail') + R(0, 240, 800, CELL, 'tredge');
    var spk = [[48, 200, 'spk1'], [120, 224, 'spk2'], [188, 192, 'spk1'], [264, 232, 'spk1'],
               [344, 208, 'spk2'], [400, 236, 'spk1'], [452, 196, 'spk2'], [520, 228, 'spk1'],
               [596, 204, 'spk2'], [648, 232, 'spk1'], [704, 196, 'spk1'], [752, 220, 'spk2'],
               [92, 248, 'spk1'], [556, 248, 'spk2'], [300, 252, 'spk1']];
    for (var i = 0; i < spk.length; i++) s += R(spk[i][0], spk[i][1], 8, CELL, spk[i][2]);
    return s;
  };

  SCN.lake = function () {
    var s = R(0, HOR, 800, 28, 'water') + R(0, 196, 800, 8, 'watersh');
    var caps = [[64, 180], [176, 188], [288, 176], [392, 192], [504, 180],
                [616, 188], [712, 176], [240, 196], [560, 196]];
    for (var i = 0; i < caps.length; i++) s += R(caps[i][0], caps[i][1], 16, CELL, 'wavecap');
    s += R(0, 204, 800, CELL, 'spk2') + R(0, 208, 800, CELL, 'tredge');
    return s;
  };

  SCN.scree = function () {
    /* Loose-rock slope falling left-to-right onto the trail. This is a
       scene-safety teaching element, so it stays LOUD: rubble-tan against the
       blue ridge and the pale trail, a hard grey lip along the fall line,
       chunks strewn down the face, and rocks that have already run out onto
       the flat. Scenario files draw trail() AFTER this in two scenes, which
       repaints y=184..240, so the escaped rocks are seeded just above the
       trail's upper edge as well as down on it. */
    var s = '', y, xr, i, rk;
    for (y = 64; y <= 244; y += CELL) {
      xr = -10 + (y - 64) / 0.3412;
      if (xr <= 0) continue;
      if (xr > 580) xr = 580;
      s += R(0, y, xr, CELL, 'spk2');            /* talus body */
      s += R(xr - 28, y, 28, CELL, 'tredge');    /* sunlit lower face */
      s += R(xr - 8, y, 8, CELL, 'rockD');       /* hard lip along the fall line */
    }
    /* runnels — heat-cracked channels down the face */
    var run = [[0, 96, 120], [0, 148, 210], [40, 188, 220], [0, 232, 320], [110, 124, 90]];
    for (i = 0; i < run.length; i++) s += R(run[i][0], run[i][1], run[i][2], CELL, 'spk1');
    /* chunks on the slope */
    var rub = [[40, 110], [96, 132], [140, 120], [150, 150], [70, 178], [196, 176],
               [130, 206], [250, 200], [210, 228], [300, 222], [36, 216], [330, 238]];
    for (i = 0; i < rub.length; i++) {
      rk = rub[i];
      s += R(rk[0], rk[1], 16, 8, 'ridgesh') + R(rk[0] + 8, rk[1] + 4, 8, CELL, 'rockD');
    }
    /* rocks already out on the flat — the hazard, and the reason nobody stands
       here. The high row survives a trail() drawn on top of this. */
    var loose = [[356, 168], [424, 174], [478, 170], [532, 176], [592, 172],
                 [452, 214], [500, 224], [548, 236], [592, 244], [624, 228]];
    for (i = 0; i < loose.length; i++) {
      rk = loose[i];
      s += R(rk[0] - CELL, rk[1] + 12, 24, CELL, 'shadow');
      s += R(rk[0], rk[1], 16, 12, 'ridge');
      s += R(rk[0] + 8, rk[1] + 4, 8, 8, 'ridgesh');
      s += R(rk[0] + 4, rk[1] + 8, 8, CELL, 'rockD');
    }
    return s;
  };

  SCN.snowGround = function () {
    var s = R(0, HOR, 800, 260 - HOR, 'snow') + R(0, HOR, 800, CELL, 'cloudsh');
    var drift = [[0, 196, 180], [240, 204, 220], [520, 192, 180],
                 [660, 212, 140], [80, 232, 260], [430, 236, 220]];
    for (var i = 0; i < drift.length; i++) {
      s += R(drift[i][0], drift[i][1], drift[i][2], 8, 'cloudsh');
      s += R(drift[i][0] + 16, drift[i][1] - CELL, drift[i][2] - 32, CELL, 'snow');
    }
    var scour = [[120, 220], [340, 188], [600, 244], [720, 200], [200, 252], [500, 216]];
    for (i = 0; i < scour.length; i++) s += R(scour[i][0], scour[i][1], 24, CELL, 'cloudsh');
    return s;
  };

  SCN.boulder = function (x, y, s) {
    s = s || 30;
    var bx = sn(x), by = sn(y), w = sn(s * 1.1), h = sn(s * 0.9);
    var cx = bx + w / 2, out = '', ry, u, half, a, b;
    for (ry = by - h; ry < by; ry += CELL) {
      u = (by - (ry + CELL / 2)) / h;
      half = (w / 2) * Math.sqrt(Math.max(0, 1 - u * u));
      a = sn(cx - half); b = sn(cx + half);
      if (b <= a) continue;
      out += R(a, ry, b - a, CELL, 'ridgesh');
      out += R(a, ry, Math.max(CELL, sn((b - a) / 3)), CELL, 'ridge');
    }
    out += R(bx + sn(w * 0.55), by - sn(h * 0.55), 8, sn(h * 0.35), 'rockD');
    out += R(bx - CELL, by, w + 8, CELL, 'shadow');
    return out;
  };

  SCN.tent = function (x, y) {
    var bx = sn(x), by = sn(y), cx = bx + 34, s = '', ry, half;
    for (ry = by - 36; ry < by; ry += CELL) {
      half = sn(34 * (ry + CELL - (by - 36)) / 36);
      if (half < CELL) half = CELL;
      s += R(cx - half, ry, half, CELL, 'jkt') + R(cx, ry, half, CELL, 'jktsh');
    }
    s += R(cx - CELL, by - 36, 8, 36, 'jktsh');        /* ridge seam */
    s += R(cx - 8, by - 16, 16, 16, 'boot');           /* door */
    s += R(cx - 8, by - 16, CELL, 16, 'bootsh');
    s += R(bx - CELL, by, 76, CELL, 'shadow');
    return s;
  };

  SCN.stove = function (x, y) {
    var bx = sn(x), by = sn(y), s = '';
    s += R(bx, by - 12, 32, 12, 'bar') + R(bx, by - 12, 32, CELL, 'hub');
    s += R(bx + 4, by - 24, 24, 12, 'hub') + R(bx + 4, by - 24, 24, CELL, 'cloudsh');
    s += R(bx + 8, by - 16, 16, CELL, 'helm');         /* burner glow */
    s += R(bx + 8, by - 32, 8, 8, 'cloud') + R(bx + 20, by - 36, 8, 8, 'cloud');
    return s;
  };

  SCN.bikeDown = function (x, y) {
    var bx = sn(x), by = sn(y), s = '';
    s += R(bx - 40, by + 12, 132, CELL, 'shadow');
    s += DISC(bx, by, 13, 'wheel') + R(bx - CELL, by - CELL, 8, 8, 'hub');
    s += DISC(bx + 84, by - CELL, 13, 'wheel') + R(bx + 80, by - 8, 8, 8, 'hub');
    s += R(bx + 8, by - 12, 68, 8, 'bike');
    s += R(bx + 28, by - 20, 24, 8, 'tank');
    s += R(bx + 52, by - 16, 16, CELL, 'bootsh');
    s += R(bx + 76, by - 28, CELL, 20, 'bar') + R(bx + 80, by - 32, 12, CELL, 'bar');
    s += R(bx - 36, by + 4, 28, CELL, 'spk2') + R(bx - 24, by + 8, 32, CELL, 'spk2');
    return s;
  };

  /* ---- figures ------------------------------------------------------------
     Anchor is the feet / ground point at (x, y); standing height ≈56.
     o.accent dresses the figure in the patient orange (the helmet family from
     the Rider Down), so "accent" still reads as "this is the patient".
     o.flip mirrors, o.hat adds a brim, o.wave raises an arm,
     o.face === false drops the face pixels. */
  function kit(o) {
    return o.accent
      ? { jk: 'helm', jks: 'helmsh', pl: 'pant', pls: 'pantsh', hat: 'helm', hats: 'helmsh' }
      : { jk: 'olive', jks: 'olivesh', pl: 'pants2', pls: 'pants2', hat: 'jkt', hats: 'jktsh' };
  }
  /* sprite columns run on the 4px grid with the body centred on local x=2, so
     the group is nudged 2px left to sit exactly on the anchor the caller gave */
  function figure(id, x, y, o, body) {
    return '<g id="' + id + '" transform="translate(' + (sn(x) - 2) + ' ' + sn(y) + ')' +
      (o.flip ? ' scale(-1 1)' : '') + '">' + body + '</g>';
  }
  function head(k, o, top) {
    /* 16px head whose bottom sits at top+16 either way */
    if (o.hat) {
      return R(-4, top, 12, CELL, k.hat) + R(-8, top + 4, 20, CELL, k.hats) +
             R(-4, top + 8, 12, 8, 'SKIN');
    }
    return R(-4, top, 12, CELL, 'hair') + R(-4, top + 4, 12, 12, 'SKIN');
  }

  SCN.figStand = function (id, x, y, o) {
    o = o || {};
    var k = kit(o), s = head(k, o, -56);
    if (o.face !== false) s += R(-4, -48, CELL, CELL, 'face') + R(4, -48, CELL, CELL, 'face');
    s += R(-8, -40, 20, CELL, k.jk);                       /* shoulders */
    s += R(-4, -36, 12, 12, k.jk) + R(-4, -28, 12, CELL, k.jks);
    s += R(-8, -36, CELL, 8, k.jks) + R(-8, -28, CELL, CELL, 'SKIN');
    if (o.wave) {
      s += R(8, -36, CELL, CELL, k.jks) + R(12, -44, CELL, 8, k.jks) + R(12, -48, CELL, CELL, 'SKIN');
    } else {
      s += R(8, -36, CELL, 8, k.jks) + R(8, -28, CELL, CELL, 'SKIN');
    }
    s += R(-4, -24, 12, CELL, k.pl);                       /* hips */
    s += R(-4, -20, CELL, 12, k.pl) + R(4, -20, CELL, 12, k.pl);
    s += R(-4, -8, CELL, CELL, 'boot') + R(4, -8, CELL, CELL, 'boot');
    s += R(-8, -4, 8, CELL, 'boot') + R(4, -4, 8, CELL, 'boot');
    s += R(-8, -4, CELL, CELL, 'bootsh') + R(8, -4, CELL, CELL, 'bootsh');
    return figure(id, x, y, o, s);
  };

  SCN.figSit = function (id, x, y, o) {
    o = o || {};
    var k = kit(o), s = head(k, o, -48);
    if (o.face !== false) s += R(4, -40, CELL, CELL, 'face');   /* facing right */
    s += R(-8, -32, 20, CELL, k.jk);
    s += R(-4, -28, 12, 12, k.jk) + R(-4, -20, 12, CELL, k.jks);
    s += R(8, -28, CELL, 8, k.jks) + R(12, -20, CELL, CELL, k.jks) + R(16, -16, CELL, CELL, 'SKIN');
    s += R(-8, -16, 16, CELL, k.pl);                       /* pelvis */
    s += R(-8, -12, 28, CELL, k.pl);                       /* thigh out front */
    s += R(12, -8, 12, CELL, k.pl);                        /* shin down */
    s += R(-8, -4, 12, CELL, k.pls) + R(20, -4, 12, CELL, 'boot');
    s += R(-8, 0, 36, CELL, 'shadow');
    return figure(id, x, y, o, s);
  };

  SCN.figSupine = function (id, x, y, o) {
    /* head at the LEFT origin, body along +x, total length ≈88 */
    o = o || {};
    var k = kit(o), s = R(-8, 0, 88, CELL, 'shadow');
    s += R(-4, -20, 8, CELL, 'hair');
    s += R(-8, -16, 16, 8, 'SKIN') + R(-4, -8, 12, 8, 'SKIN');
    if (o.face !== false) {
      s += R(-4, -16, 8, CELL, 'hair') + R(-4, -12, CELL, CELL, 'face') + R(4, -8, CELL, CELL, 'face');
    }
    s += R(12, -16, 12, CELL, k.jk);                       /* shoulder rise */
    s += R(8, -12, 36, 12, k.jk) + R(8, -4, 36, CELL, k.jks);
    s += R(20, -8, 20, CELL, k.jks) + R(40, -8, CELL, CELL, 'SKIN');   /* arm across, hand */
    s += R(44, -12, 20, 8, k.pl) + R(44, -4, 20, CELL, k.pls);
    s += R(64, -12, 8, 8, k.pl) + R(64, -4, 8, CELL, k.pls);
    s += R(68, -20, 8, 20, 'boot') + R(76, -20, CELL, 20, 'bootsh');   /* boots point up */
    return figure(id, x, y, o, s);
  };

  SCN.figProne = function (id, x, y, o) {
    /* face-down: back of the head, arm splayed above, NO face pixels */
    o = o || {};
    var k = kit(o), s = R(-8, 0, 88, CELL, 'shadow');
    s += R(-8, -16, 16, 12, 'hair') + R(-8, -4, 8, CELL, 'SKIN');
    s += R(8, -12, 36, 8, k.jk) + R(8, -4, 36, CELL, k.jks);
    s += R(12, -16, CELL, CELL, k.jks) + R(8, -20, CELL, CELL, k.jks) +
         R(4, -24, CELL, CELL, k.jks) + R(0, -28, CELL, CELL, 'SKIN');
    s += R(44, -12, 24, 8, k.pl) + R(44, -4, 24, CELL, k.pls);
    s += R(68, -12, 12, 8, 'boot') + R(68, -4, 12, CELL, 'bootsh');
    return figure(id, x, y, o, s);
  };

  SCN.figKneel = function (id, x, y, o) {
    /* rescuer kneeling, facing left toward a patient: torso upright, thigh
       folded forward, shin and rear foot flat on the ground — the low, compact
       silhouette is what separates this from a short standing figure */
    o = o || {};
    var k = kit(o), s = head(k, o, -40);
    if (o.face !== false) s += R(-4, -32, CELL, CELL, 'face');
    s += R(-8, -24, 20, CELL, k.jk);                       /* shoulders */
    s += R(-4, -20, 12, 8, k.jk) + R(-4, -12, 12, CELL, k.jks);
    s += R(-12, -20, CELL, CELL, k.jks) + R(-16, -16, CELL, CELL, k.jks) +
         R(-20, -12, CELL, CELL, 'SKIN');                  /* hands on the patient */
    s += R(-8, -12, 16, CELL, k.pl);                       /* hips */
    s += R(-12, -8, 32, CELL, k.pl);                       /* thigh folded forward */
    s += R(12, -4, 8, CELL, k.pl);                         /* shin down to the ground */
    s += R(-16, -4, 16, CELL, 'boot') + R(12, -4, 8, CELL, 'boot');
    s += R(-16, 0, 40, CELL, 'shadow');
    return figure(id, x, y, o, s);
  };

  /* ---- overlays (hidden until the state turns them on) ------------------- */
  SCN.blanketOver = function (id, x, y, w) {
    var bx = sn(x), by = sn(y), bw = Math.max(16, sn(w)), s = '', i;
    s += R(bx, by - 16, bw, 12, 'blank') + R(bx, by - 4, bw, CELL, 'blanksh');
    for (i = 0; i < bw; i += 16) s += R(bx + i, by, 8, CELL, 'blank');       /* zigzag hem */
    s += R(bx + sn(bw * 0.3), by - 12, 12, CELL, 'blanksh');                 /* folds */
    s += R(bx + sn(bw * 0.62), by - 8, 12, CELL, 'blanksh');
    return '<g id="' + id + '" style="display:none;">' + s + '</g>';
  };

  SCN.padUnder = function (id, x, y, w) {
    var bx = sn(x), by = sn(y), bw = Math.max(16, sn(w)), s = '', i;
    s += R(bx, by, bw, CELL, 'pad') + R(bx, by + 4, bw, CELL, 'padsh');
    for (i = 8; i < bw - 8; i += 24) s += R(bx + i, by, 8, CELL, 'padsh');   /* ribbing */
    return '<g id="' + id + '" style="display:none;">' + s + '</g>';
  };

  SCN.splintOn = function (id, x, y, w) {
    var bx = sn(x), by = sn(y), bw = Math.max(24, sn(w)), s = '';
    s += R(bx, by - 8, bw, 16, 'splint') + R(bx, by + 4, bw, CELL, 'strap');
    s += R(bx + 8, by - 12, 8, 20, 'strap');
    s += R(bx + bw - 16, by - 12, 8, 20, 'strap');
    if (bw >= 48) s += R(bx + sn(bw / 2) - 4, by - 12, 8, 20, 'strap');
    return '<g id="' + id + '" style="display:none;">' + s + '</g>';
  };

  SCN.dressing = function (id, x, y) {
    var bx = sn(x), by = sn(y), s = '';
    s += R(bx - 8, by - 8, 16, 8, 'cloud') + R(bx - 8, by, 16, CELL, 'cloudsh');
    s += R(bx - 4, by - 8, CELL, 12, 'cloudsh');           /* tape */
    return '<g id="' + id + '" style="display:none;">' + s + '</g>';
  };

  SCN.mark = function (id, x, y) {
    /* wound / swelling / hives marker — .bru is CSS-driven */
    var bx = sn(x), by = sn(y), s = '';
    s += R(bx - 4, by - 8, 8, CELL, 'BRU') + R(bx - 8, by - 4, 16, CELL, 'BRU') +
         R(bx - 4, by, 8, CELL, 'BRU');
    return '<g id="' + id + '" style="display:none;">' + s + '</g>';
  };

  SCN.show = function (id, on) {
    var n = document.getElementById(id);
    if (n) n.style.display = on ? '' : 'none';
  };
  SCN.cls = function (name, on) {
    var s = document.getElementById('scene');
    if (s) s.classList.toggle(name, !!on);
  };

  window.SCN = SCN;
})();
