/* Scene-part library for practice scenarios — field-sketch style.
   Every function returns an SVG fragment string. Styling comes from the
   shared classes in assets/css/sim.css (.o .ln .thin .faint .w .w2 .a .a2
   .bru .skin .dot). Compose with SCN.wrap(parts, opts) and drive state by
   toggling ids: SCN.show('id', bool). viewBox is 0 0 800 260, ground ≈ y230. */
(function () {
  'use strict';
  var SCN = {};

  SCN.wrap = function (inner, opts) {
    opts = opts || {};
    var paper = opts.winter ? '#F3F2EE' : '#FBF7EE';
    var tint = '';
    if (opts.sky === 'noon') tint = '<circle cx="700" cy="42" r="22" class="ln thin"/><circle cx="700" cy="42" r="15" style="fill:#EBD9A8"/>';
    if (opts.sky === 'storm') tint = '<rect x="0" y="0" width="800" height="120" style="fill:#7E8B6E;opacity:0.16"/><path d="M90,52 q30,-16 62,0 q24,-10 46,4 M480,36 q34,-18 68,0 q26,-10 50,4" class="ln faint"/>';
    if (opts.sky === 'dusk') tint = '<rect x="0" y="0" width="800" height="260" style="fill:#4A4433;opacity:0.12"/>';
    return '<svg id="scene" viewBox="0 0 800 260" role="img" aria-label="' + (opts.label || 'Scene illustration — it updates as you act.') + '">' +
      '<defs><filter id="rough" x="-4%" y="-8%" width="108%" height="116%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/></filter></defs>' +
      '<rect x="0" y="0" width="800" height="260" fill="' + paper + '"/>' + tint +
      '<g filter="url(#rough)">' + inner + '</g></svg>';
  };

  /* ---- backdrops (draw back-to-front) ---- */
  SCN.mountains = function () {
    return '<path d="M-10,145 L110,92 L240,132 L400,90 L545,136 L690,98 L810,138" class="ln"/>' +
           '<path d="M-10,172 L90,150 L220,168 L380,146 L540,170 L680,150 L810,166" class="ln thin"/>' +
           '<path d="M104,104 l-10,14 M394,102 l-10,14 M684,108 l-10,13" class="ln thin faint"/>';
  };
  SCN.trees = function (xs, y) {
    y = y || 168;
    return xs.map(function (x) {
      return '<path d="M' + (x - 9) + ',' + y + ' L' + x + ',' + (y - 26) + ' L' + (x + 9) + ',' + y +
             ' M' + (x - 7) + ',' + (y - 12) + ' L' + x + ',' + (y - 30) + ' L' + (x + 7) + ',' + (y - 12) +
             ' M' + x + ',' + y + ' L' + x + ',' + (y + 5) + '" class="ln thin"/>';
    }).join('');
  };
  SCN.trail = function () {
    return '<path d="M-10,185 Q200,180 430,184 T810,181" class="ln thin"/>' +
           '<path d="M-10,242 Q240,247 480,241 T810,245" class="ln thin"/>' +
           '<g class="ln thin faint"><path d="M70,214 l4,0 M210,202 l3,0 M330,246 l4,0 M560,216 l4,0 M700,224 l3,0 M420,238 l3,0"/></g>';
  };
  SCN.lake = function () {
    return '<path d="M-10,190 L810,190" class="ln thin"/>' +
           '<g class="ln thin faint"><path d="M80,205 q14,-4 28,0 M300,214 q14,-4 28,0 M520,200 q14,-4 28,0 M660,216 q14,-4 28,0 M180,224 q14,-4 28,0"/></g>';
  };
  SCN.scree = function () {
    /* loose-rock slope descending left-to-right onto the trail */
    var rocks = '';
    for (var i = 0; i < 14; i++) {
      var x = 40 + i * 38 + (i % 3) * 9, y = 96 + i * 8;
      rocks += 'M' + x + ',' + y + ' l6,-2 l3,4 l-7,2 z ';
    }
    return '<polygon points="-10,64 500,238 -10,238" class="w" style="opacity:0.55"/>' +
           '<path d="M-10,64 L500,238" class="ln"/><path d="M-10,96 L440,240" class="ln thin faint"/>' +
           '<path d="' + rocks + '" class="ln thin faint"/>';
  };
  SCN.snowGround = function () {
    return '<path d="M-10,200 Q220,192 440,199 T810,196" class="ln thin"/>' +
           '<g class="ln thin faint"><path d="M120,60 l0,3 M340,44 l0,3 M580,70 l0,3 M220,110 l0,3 M660,120 l0,3 M450,90 l0,3"/></g>';
  };
  SCN.boulder = function (x, y, s) {
    return '<path d="M' + x + ',' + y + ' q' + s * 0.3 + ',-' + s + ' ' + s + ',-' + s * 0.9 + ' q' + s * 0.9 + ',' + s * 0.15 + ' ' + s * 1.1 + ',' + s * 0.9 + ' z" class="o w"/>';
  };
  SCN.tent = function (x, y) {
    return '<polygon points="' + x + ',' + y + ' ' + (x + 34) + ',' + (y - 34) + ' ' + (x + 68) + ',' + y + '" class="o w"/>' +
           '<path d="M' + (x + 34) + ',' + (y - 34) + ' L' + (x + 34) + ',' + y + '" class="ln thin"/>';
  };
  SCN.stove = function (x, y) {
    return '<rect x="' + x + '" y="' + (y - 12) + '" width="30" height="12" rx="2" class="o w2"/>' +
           '<rect x="' + (x + 5) + '" y="' + (y - 22) + '" width="20" height="10" rx="4" class="o w"/>' +
           '<path d="M' + (x + 9) + ',' + (y - 26) + ' q2,-5 0,-9 M' + (x + 17) + ',' + (y - 26) + ' q-2,-5 0,-9" class="ln thin faint"/>';
  };
  SCN.bikeDown = function (x, y) {
    return '<g transform="rotate(12 ' + (x + 55) + ' ' + y + ')">' +
           '<circle cx="' + x + '" cy="' + y + '" r="13" class="ln"/><circle cx="' + x + '" cy="' + y + '" r="2" class="dot"/>' +
           '<circle cx="' + (x + 84) + '" cy="' + (y - 4) + '" r="13" class="ln"/><circle cx="' + (x + 84) + '" cy="' + (y - 4) + '" r="2" class="dot"/>' +
           '<polygon points="' + (x + 6) + ',' + (y - 6) + ' ' + (x + 40) + ',' + (y - 22) + ' ' + (x + 76) + ',' + (y - 10) + ' ' + (x + 50) + ',' + (y - 2) + '" class="o w2"/>' +
           '<path d="M' + (x + 74) + ',' + (y - 10) + ' L' + (x + 88) + ',' + (y - 24) + '" class="ln"/></g>';
  };

  /* ---- figures (about 56px standing height; anchor = feet/ground point) ---- */
  SCN.figStand = function (id, x, y, o) {
    o = o || {};
    var wave = o.wave ? '<path d="M11,-38 L22,-46 l4,1" class="ln"/>' : '<path d="M10,-36 L14,-22" class="ln"/>';
    return '<g id="' + id + '" transform="translate(' + x + ' ' + y + ')' + (o.flip ? ' scale(-1 1)' : '') + '">' +
      '<circle cx="0" cy="-48" r="7" class="o skin"/>' +
      (o.hat ? '<path d="M-7,-48 A7,7 0 0 1 7,-48 Z" class="o ' + (o.accent ? 'a' : 'w2') + '"/>' : '') +
      '<rect x="-7" y="-41" width="14" height="24" rx="5" class="o ' + (o.accent ? 'a' : 'w') + '"/>' +
      wave +
      '<path d="M-3,-17 L-3,0 M3,-17 L3,0" class="ln"/></g>';
  };
  SCN.figSit = function (id, x, y, o) {
    o = o || {};
    return '<g id="' + id + '" transform="translate(' + x + ' ' + y + ')' + (o.flip ? ' scale(-1 1)' : '') + '">' +
      '<circle cx="-2" cy="-38" r="7.5" class="o skin"/>' +
      '<rect x="-9" y="-31" width="15" height="22" rx="6" class="o ' + (o.accent ? 'a' : 'w') + '"/>' +
      '<path d="M4,-10 L16,-16 L20,0" class="ln" style="stroke-width:7;stroke-linecap:round;fill:none"/>' +
      '<path d="M-2,-24 L12,-15" class="ln"/></g>';
  };
  SCN.figSupine = function (id, x, y, o) {
    /* head to the LEFT, feet-up nubs to the right; length ~86 */
    o = o || {};
    return '<g id="' + id + '" transform="translate(' + x + ' ' + y + ')' + (o.flip ? ' scale(-1 1)' : '') + '">' +
      '<circle cx="0" cy="-9" r="9" class="o skin"/>' +
      (o.face !== false ? '<circle cx="2" cy="-12" r="1.3" class="dot"/><path d="M-1,-6 q2.5,-1.4 5,-0.5" class="ln thin"/>' : '') +
      '<rect x="9" y="-14" width="38" height="14" rx="6.5" class="o ' + (o.accent ? 'a' : 'w') + '"/>' +
      '<rect x="44" y="-12" width="30" height="10" rx="5" class="o w2"/>' +
      '<rect x="70" y="-18" width="9" height="18" rx="4" class="o w2"/>' +
      '<path d="M16,-11 L38,-5" class="ln"/></g>';
  };
  SCN.figProne = function (id, x, y, o) {
    /* face-down: head circle with NO face, arm splayed above */
    o = o || {};
    return '<g id="' + id + '" transform="translate(' + x + ' ' + y + ')' + (o.flip ? ' scale(-1 1)' : '') + '">' +
      '<circle cx="0" cy="-8" r="9" class="o skin"/>' +
      '<path d="M-5,-11 A9,9 0 0 1 8,-13" class="ln thin"/>' +
      '<rect x="9" y="-13" width="40" height="13" rx="6" class="o ' + (o.accent ? 'a' : 'w') + '"/>' +
      '<rect x="46" y="-11" width="32" height="9" rx="4.5" class="o w2"/>' +
      '<path d="M14,-13 L2,-22" class="ln"/></g>';
  };
  SCN.figKneel = function (id, x, y, o) {
    /* rescuer kneeling, facing left toward a patient */
    o = o || {};
    return '<g id="' + id + '" transform="translate(' + x + ' ' + y + ')' + (o.flip ? ' scale(-1 1)' : '') + '">' +
      '<circle cx="-6" cy="-36" r="7" class="o skin"/>' +
      '<rect x="-11" y="-30" width="14" height="20" rx="5" class="o ' + (o.accent ? 'a' : 'w') + '"/>' +
      '<path d="M-4,-11 L2,0 L10,0 M-9,-24 L-20,-16" class="ln"/></g>';
  };

  /* ---- overlays ---- */
  SCN.blanketOver = function (id, x, y, w) {
    return '<g id="' + id + '" style="display:none;">' +
      '<rect x="' + x + '" y="' + (y - 16) + '" width="' + w + '" height="16" rx="7" class="o a"/>' +
      '<path d="M' + (x + w * 0.3) + ',' + (y - 15) + ' q3,7 -1,14 M' + (x + w * 0.65) + ',' + (y - 15) + ' q-3,7 1,14" class="ln thin"/></g>';
  };
  SCN.padUnder = function (id, x, y, w) {
    return '<g id="' + id + '" style="display:none;"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="6" rx="3" class="o w2"/></g>';
  };
  SCN.splintOn = function (id, x, y, w) {
    return '<g id="' + id + '" style="display:none;">' +
      '<rect x="' + x + '" y="' + (y - 8) + '" width="' + w + '" height="14" rx="4" class="o"/>' +
      '<rect x="' + (x + 6) + '" y="' + (y - 10) + '" width="3.5" height="18" rx="1.7" class="o w2"/>' +
      '<rect x="' + (x + w - 10) + '" y="' + (y - 10) + '" width="3.5" height="18" rx="1.7" class="o w2"/></g>';
  };
  SCN.dressing = function (id, x, y) {
    return '<g id="' + id + '" style="display:none;"><rect x="' + (x - 7) + '" y="' + (y - 5) + '" width="14" height="10" rx="3" class="o"/>' +
      '<path d="M' + (x - 7) + ',' + y + ' L' + (x + 7) + ',' + y + '" class="ln thin faint"/></g>';
  };
  SCN.mark = function (id, x, y) {
    /* a wound / swelling / hives marker */
    return '<g id="' + id + '" style="display:none;"><ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="4.5" class="bru"/></g>';
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
