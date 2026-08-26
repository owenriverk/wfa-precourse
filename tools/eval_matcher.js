#!/usr/bin/env node
/* Eval harness for the Phase-0 free-text matcher.
   --dump: list every scenario's action ids+labels.
   default: run tools/matcher_evals.json → per-case pass/fail + summary. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.dirname(__dirname);
const NLP = require(path.join(ROOT, 'assets/js/sim-nlp.js'));

function loadScenario(file) {
  const stub = new Proxy({}, { get: () => (() => '') });
  const ctx = { window: {}, SCN: stub, document: undefined };
  ctx.window.SCN = stub;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return ctx.window.WFA_SCENARIO;
}

const files = fs.readdirSync(path.join(ROOT, 'sims/js')).filter(f => f.endsWith('.js')).sort();
const sims = {};
for (const f of files) sims[f.replace('.js', '')] = loadScenario(path.join(ROOT, 'sims/js', f));

if (process.argv.includes('--dump')) {
  for (const [slug, SC] of Object.entries(sims)) {
    console.log('## ' + slug);
    SC.actions.forEach(a => console.log('  ' + a.g.padEnd(6) + a.id.padEnd(14) + a.label));
  }
  process.exit(0);
}

const evals = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/matcher_evals.json'), 'utf8'));
let pass = 0, fail = 0;
for (const [slug, cases] of Object.entries(evals)) {
  const SC = sims[slug];
  if (!SC) { console.log('MISSING SIM: ' + slug); continue; }
  const acts = SC.actions.map(a => ({ id: a.id, label: a.label, g: a.g, status: 'ok' }));
  for (const [utterance, expect] of cases) {
    const m = NLP.match(utterance, acts, SC.nlp);
    const got = (m.type === 'run' || m.type === 'decide') ? m.id : m.type;
    const ok = got === expect;
    ok ? pass++ : fail++;
    if (!ok) console.log(`FAIL [${slug}] "${utterance}" → ${got} (want ${expect})`);
  }
}
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
