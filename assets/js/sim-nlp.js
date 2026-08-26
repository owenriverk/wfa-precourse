/* Phase-0 free-text matcher for practice scenarios. Fully local — no network.
   Maps typed input onto existing action ids by token overlap against action
   labels plus optional per-scenario synonym phrases (SC.nlp[id] = 'a|b|c').
   Dual export: window.SIMNLP in the browser, module.exports under node. */
(function (root) {
  'use strict';

  var WEAK = {};
  'check give take get put make ask go see use come'.split(' ').forEach(function (w) { WEAK[w] = 1; });
  var STOP = {};
  'the a an i we you he she it his her him them then and or to of on for at in with my your our lets let s go do can could would please um uh now some real really just quickly carefully gonna going want try'
    .split(' ').forEach(function (w) { STOP[w] = 1; });

  /* conservative global aliases: typed word -> canonical token that labels use */
  var ALIAS = {
    feel: 'check', feels: 'check', palpate: 'check',
    examine: 'check', inspect: 'check', assess: 'check', evaluate: 'check',
    radial: 'pulse', heartbeat: 'pulse', heart: 'pulse',
    breaths: 'breathing', breathe: 'breathing', breath: 'breathing', respirations: 'breathing',
    dial: 'call', phone: 'call',
    gauze: 'dressing', bandage: 'dressing', dress: 'dressing',
    tq: 'tourniquet', tourniquets: 'tourniquet',
    glove: 'gloves', ppe: 'gloves',
    unresponsive: 'responsiveness', conscious: 'responsiveness', responsive: 'responsiveness', avpu: 'responsiveness',
    talk: 'ask', tell: 'ask', question: 'ask',
    med: 'meds', medications: 'meds', medication: 'meds', medicines: 'meds',
    history: 'sample', allergies: 'allergy',
    drag: 'move', carry: 'move', shift: 'move', relocate: 'move',
    freezing: 'cold', hypothermia: 'cold', hypothermic: 'cold',
    temp: 'temperature', bleed: 'bleeding', blood: 'bleeding', hemorrhage: 'bleeding',
    fracture: 'broken', epipen: 'epi', epinephrine: 'epi', adrenaline: 'epi',
    benadryl: 'antihistamine', diphenhydramine: 'antihistamine',
    csm: 'csm', circulation: 'csm', sensation: 'csm',
    vitals: 'vitals', pulseox: 'vitals'
  };

  function stem(w) {
    if (w.length > 5 && w.slice(-3) === 'ing') return w.slice(0, -3);
    if (w.length > 3 && w.slice(-1) === 's' && w.slice(-2) !== 'ss') return w.slice(0, -1);
    return w;
  }
  function tokens(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/)
      .filter(function (w) { return w && !STOP[w]; })
      .map(function (w) { return stem(ALIAS[w] || w); });
  }
  function norm(text) { return tokens(text).join(' '); }

  /* actions: [{id, label, g, status: 'ok'|'done'|'gated'}], nlpTable: {id: 'phrase|phrase'} */
  function match(input, actions, nlpTable) {
    nlpTable = nlpTable || {};
    var inToks = tokens(input);
    if (!inToks.length) return { type: 'miss' };
    var inNorm = inToks.join(' ');
    /* token rarity across actions for weighting */
    var df = {};
    function actToks(a) { return tokens(a.label + ' ' + String(a.id).replace(/-/g, ' ')); }
    actions.forEach(function (a) {
      var seen = {};
      actToks(a).forEach(function (t) { if (!seen[t]) { seen[t] = 1; df[t] = (df[t] || 0) + 1; } });
    });
    var scored = actions.map(function (a) {
      var lt = actToks(a), score = 0, seen = {};
      inToks.forEach(function (t) {
        if (seen[t]) return; seen[t] = 1;
        if (lt.indexOf(t) >= 0) score += (WEAK[t] ? 0.5 : (df[t] === 1 ? 2.5 : 1));
      });
      String(nlpTable[a.id] || '').split('|').forEach(function (ph) {
        ph = norm(ph);
        if (ph && inNorm.indexOf(ph) >= 0) score += 3;
      });
      return { a: a, score: score };
    }).sort(function (x, y) { return y.score - x.score; });

    var best = scored[0], second = scored[1];
    if (!best || best.score < 2) return { type: 'miss' };
    if (second && second.score >= best.score - 0.45 && second.a.id !== best.a.id)
      return { type: 'ambiguous', alts: [best.a, second.a] };
    if (best.a.status === 'done') return { type: 'done', id: best.a.id, label: best.a.label };
    if (best.a.status === 'gated') return { type: 'gated', id: best.a.id, label: best.a.label };
    if (best.a.g === 'decide') return { type: 'decide', id: best.a.id, label: best.a.label };
    return { type: 'run', id: best.a.id, label: best.a.label };
  }

  var NLP = { tokens: tokens, norm: norm, match: match };
  if (typeof module !== 'undefined' && module.exports) module.exports = NLP;
  root.SIMNLP = NLP;
})(typeof window !== 'undefined' ? window : globalThis);
