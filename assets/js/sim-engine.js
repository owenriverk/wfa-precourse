/* WFA practice-scenario engine.
   A page defines window.WFA_SCENARIO (see sims/SPEC.md for the contract),
   includes this file, and provides the standard DOM skeleton (sims template).
   Design: deterministic patient state machine + turn-based choice UI.
   All medical ground truth lives in the scenario file — nothing is scripted
   here, and nothing the learner does is recorded anywhere. */
(function () {
  'use strict';

  function boot() {
    var SC = window.WFA_SCENARIO;
    if (!SC) return;

    var S = { t: 0, done: {}, flags: [], crits: {}, decided: null,
              lastHR: null, lastRR: null, lastAVPU: null, lastSkin: null, vitalsT: null };
    Object.keys(SC.state || {}).forEach(function (k) { S[k] = SC.state[k]; });

    var byId = {};
    SC.actions.forEach(function (a) { byId[a.id] = a; });

    function esc(x) { return String(x).replace(/[&<>]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]; }); }
    function fmtT() { return 'T+' + S.t + ' min'; }
    function el(id) { return document.getElementById(id); }

    /* ---- transcript + per-turn event buffer ---- */
    var turnEvents = [];
    function log(kind, text) {
      var d = document.createElement('div');
      d.className = 'entry';
      d.innerHTML = '<span class="stamp">' + fmtT() + '</span><span class="' + kind + '">' + esc(text) + '</span>';
      el('log').insertBefore(d, el('log').firstChild);
      if (kind === 'event') turnEvents.push(text);
    }
    function logAction(label, result) {
      var d = document.createElement('div');
      d.className = 'entry';
      d.innerHTML = '<span class="stamp">' + fmtT() + '</span><span class="you">' + esc(label) + '</span><br>' + esc(result);
      el('log').insertBefore(d, el('log').firstChild);
    }
    function narrate(label, result) {
      var html = '';
      if (label) html += '<span class="you-did">' + esc(label) + '</span>';
      html += esc(result);
      turnEvents.forEach(function (t) { html += '<span class="event-line">⚠ ' + esc(t) + '</span>'; });
      el('narration').innerHTML = html;
    }

    /* ---- api handed to scenario code ---- */
    var api = {
      log: log,
      flag: function (id, text) {
        if (!S.flags.some(function (f) { return f.id === id; })) S.flags.push({ id: id, text: text });
      },
      vitals: function (v) {
        if (v.hr != null) S.lastHR = v.hr;
        if (v.rr != null) S.lastRR = v.rr;
        if (v.avpu != null) S.lastAVPU = v.avpu;
        if (v.skin != null) S.lastSkin = v.skin;
        S.vitalsT = S.t;
        renderChips();
      }
    };

    /* ---- clock + chips ---- */
    function tick(mins) {
      for (var i = 0; i < mins; i++) { S.t++; if (SC.tick) SC.tick(S, api); }
      el('clock').textContent = fmtT();
      renderChips();
    }
    function chip(id, val, known) {
      var c = el(id);
      c.className = 'chip' + (known ? '' : ' unknown');
      c.querySelector('b').textContent = known ? val : '—';
    }
    function renderChips() {
      chip('chip-hr', S.lastHR, S.lastHR != null);
      chip('chip-rr', S.lastRR, S.lastRR != null);
      chip('chip-avpu', S.lastAVPU, S.lastAVPU != null);
      chip('chip-skin', S.lastSkin, S.lastSkin != null);
      var last = el('chip-last');
      last.className = 'chip' + (S.vitalsT != null ? '' : ' unknown');
      last.querySelector('b').textContent = S.vitalsT != null ? 'T+' + S.vitalsT : 'not taken';
      var ex = el('extra-chips');
      if (ex) {
        ex.innerHTML = '';
        (SC.chips ? SC.chips(S) : []).forEach(function (c2) {
          var s = document.createElement('span');
          s.className = 'chip' + (c2[2] ? ' alert' : '');
          s.innerHTML = esc(c2[0]) + ' <b>' + esc(c2[1]) + '</b>';
          ex.appendChild(s);
        });
      }
    }

    /* ---- choices ---- */
    function avail(id) {
      var a = byId[id];
      return !!a && !(a.once && S.done[id]) && (!a.when || a.when(S));
    }
    function makeBtn(a) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice-btn' + (a.g === 'decide' ? ' decide' : '');
      b.innerHTML = '<span>' + esc(a.label) + '</span><span class="mins">' + a.mins + ' min</span>';
      b.addEventListener('click', function () { doAction(a); });
      return b;
    }
    function renderChoices() {
      var listEl = el('choice-list');
      listEl.innerHTML = '';
      (SC.suggest(S) || []).filter(avail).slice(0, 6).forEach(function (id) { listEl.appendChild(makeBtn(byId[id])); });
      var moreEl = el('more-list');
      moreEl.innerHTML = '';
      [['assess', 'Assess'], ['ask', 'Ask'], ['treat', 'Treat']].forEach(function (grp) {
        var acts = SC.actions.filter(function (a) { return a.g === grp[0] && avail(a.id); });
        if (!acts.length) return;
        var h = document.createElement('h3'); h.textContent = grp[1]; moreEl.appendChild(h);
        acts.forEach(function (a) { moreEl.appendChild(makeBtn(a)); });
      });
      var decEl = el('decide-list');
      decEl.innerHTML = '';
      SC.actions.filter(function (a) { return a.g === 'decide' && avail(a.id); }).forEach(function (a) { decEl.appendChild(makeBtn(a)); });
    }

    /* ---- turn loop ---- */
    var ended = false;
    function doAction(a) {
      if (ended) return;
      turnEvents = [];
      var r = a.run(S, api);
      var text = typeof r === 'string' ? r : r.text;
      var acted = typeof r === 'string' ? true : r.acted !== false;
      logAction(a.label, text);
      tick(a.mins);
      if (a.once && acted) S.done[a.id] = true;
      narrate(a.label, text);
      if (SC.scene && SC.scene.update) SC.scene.update(S);
      if (a.g === 'decide' && S.decided) { endScenario(); return; }
      renderChoices();
    }

    function endScenario() {
      ended = true;
      el('choices').hidden = true;
      var hit = SC.crits.filter(function (c) { return S.crits[c[0]]; });
      var n = hit.length, total = SC.crits.length, frac = n / total;
      var tone = frac >= 0.85 ? 'That’s a textbook response — you’d have made an instructor proud.'
               : frac >= 0.65 ? 'Solid response. A few gaps below are worth a look before the next run.'
               : frac >= 0.4  ? 'You got to the big stuff. The systematic habits — the checklist below — are what turn a good instinct into a reliable response.'
               : 'This is exactly what practice runs are for. Work through the list below, review the linked lessons, and run it again.';
      var extra = SC.outcome ? SC.outcome(S) : '';
      el('debrief-summary').textContent = 'Scenario ended at ' + fmtT() + ' — you hit ' + n + ' of ' + total + ' critical actions. ' + tone + (extra ? ' ' + extra : '');
      S.flags.forEach(function (f) {
        var d = document.createElement('div'); d.className = 'flag-item'; d.textContent = '⚠ ' + f.text;
        el('debrief-flags').appendChild(d);
      });
      SC.crits.forEach(function (c) {
        var li = document.createElement('li');
        li.className = S.crits[c[0]] ? 'hit' : 'miss';
        li.innerHTML = esc(c[1]) + (S.crits[c[0]] ? '' : '<span class="why">' + esc(c[2]) + '</span>');
        el('debrief-crit').appendChild(li);
      });
      if (SC.links) el('debrief-links').innerHTML = 'Review: ' + SC.links.map(function (l) {
        return '<a href="' + l[0] + '">' + esc(l[1]) + '</a>';
      }).join(' · ');
      el('debrief').hidden = false;
      el('debrief').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---- free-text input (Phase 0: local matcher, no network) ---- */
    function actionStatus(a) {
      if (a.once && S.done[a.id]) return 'done';
      if (a.when && !a.when(S)) return 'gated';
      return 'ok';
    }
    function say(msg) { el('narration').innerHTML = '<span class="you-did">You try something</span>' + msg; }
    function handleFree(text) {
      if (ended || !window.SIMNLP) return;
      var acts = SC.actions.map(function (a) { return { id: a.id, label: a.label, g: a.g, status: actionStatus(a) }; });
      var m = SIMNLP.match(text, acts, SC.nlp);
      if (m.type === 'run') { doAction(byId[m.id]); return; }
      if (m.type === 'decide') { el('decide-actions').open = true; say('That would end the scenario — “' + esc(m.label) + '” is waiting in the Decide list below if you mean it.'); return; }
      if (m.type === 'done') { say('You’ve already done that: “' + esc(m.label) + '”.'); return; }
      if (m.type === 'gated') { say('Not yet — “' + esc(m.label) + '” isn’t possible right now. Something else has to come first.'); return; }
      if (m.type === 'ambiguous') { say('Could mean “' + esc(m.alts[0].label) + '” or “' + esc(m.alts[1].label) + '” — say a bit more, or use the buttons.'); return; }
      say('The sim doesn’t know that move. Try other words, or pick from the list — “All actions” below has everything.');
    }
    (function buildFreeInput() {
      if (!window.SIMNLP) return;
      var wrap = document.createElement('form');
      wrap.className = 'free-row';
      wrap.innerHTML = '<input type="text" id="free-text" autocomplete="off" maxlength="120" ' +
        'placeholder="…or type what you do (interpreted on your device — nothing is sent anywhere)" aria-label="Type an action">' +
        '<button class="btn" type="submit">Do it</button>';
      wrap.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = el('free-text').value.trim();
        if (v) handleFree(v);
        el('free-text').value = '';
      });
      var choices = el('choices');
      choices.insertBefore(wrap, el('more-actions'));
    })();

    /* ---- boot the page ---- */
    el('brief-body').innerHTML = SC.brief;
    el('env-chip').textContent = SC.env;
    if (SC.scene && SC.scene.svg) el('stage-slot').innerHTML = SC.scene.svg;
    el('start-btn').addEventListener('click', function () {
      el('briefing').hidden = true;
      el('sim-ui').hidden = false;
      log('event', SC.startLog || SC.startText);
      turnEvents = [];
      narrate('', SC.startText);
      if (SC.scene && SC.scene.update) SC.scene.update(S);
      renderChips(); renderChoices();
    });
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
