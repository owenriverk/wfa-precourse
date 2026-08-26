/* Wilderness First Aid — shared lesson engine
   Handles: accessible tabbed sections with deep links, section-to-section flow,
   scenario discussion toggles, the knowledge-check quiz, and progress storage.
   Progress keys are unchanged from the original site so existing learners keep
   their scores: wfa_completed_<id>, wfa_score_<id>, wfa_total_<id>. */
(function () {
  'use strict';

  var L = window.WFA_LESSON || {};
  var lessonId = L.id || document.body.getAttribute('data-lesson-id') || '';
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode etc. */ } }
  };

  /* ---------------- Tabs / sections ---------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tablist [role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var visitedKey = 'wfa_sections_' + lessonId;
  var visited = {};
  try { visited = JSON.parse(store.get(visitedKey) || '{}') || {}; } catch (e) { visited = {}; }

  function idxOf(sectionId) {
    for (var i = 0; i < panels.length; i++) if (panels[i] && panels[i].id === sectionId) return i;
    return -1;
  }

  function updateProgress() {
    var n = 0;
    tabs.forEach(function (t, i) {
      if (visited[panels[i].id]) { n++; t.classList.add('visited'); }
    });
    var bar = document.querySelector('.toc-progress .bar > span');
    var lbl = document.querySelector('.toc-progress .label');
    if (bar) bar.style.width = Math.round((n / tabs.length) * 100) + '%';
    if (lbl) lbl.textContent = n + ' of ' + tabs.length + ' sections viewed';
  }

  function activate(i, opts) {
    opts = opts || {};
    if (i < 0 || i >= tabs.length) return;
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[j].classList.toggle('active', on);
      panels[j].hidden = !on;
    });
    visited[panels[i].id] = true;
    store.set(visitedKey, JSON.stringify(visited));
    updateProgress();

    if (!opts.silent) {
      var hash = '#' + panels[i].id;
      if (location.hash !== hash) {
        if (opts.replace) history.replaceState(null, '', hash); else history.pushState(null, '', hash);
      }
    }
    if (opts.focusTab) tabs[i].focus();
    if (opts.scroll !== false) {
      var top = document.querySelector('.lesson-body');
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 56;
      if (top) {
        var y = top.getBoundingClientRect().top + window.pageYOffset - navH - 8;
        if (window.pageYOffset > y || opts.forceScroll) window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      // keep the active pill in view on the mobile strip
      if (tabs[i].scrollIntoView && window.innerWidth <= 900) {
        try { tabs[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } catch (e) {}
      }
    }
    if (panels[i].id === 'quiz' && !quizBuilt) buildQuiz();
  }

  function activateFromHash(replace) {
    var id = (location.hash || '').replace(/^#/, '');
    var i = id ? idxOf(id) : -1;
    activate(i >= 0 ? i : 0, { silent: true, scroll: i > 0, replace: replace });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { activate(i, { forceScroll: false }); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); activate(n, { focusTab: true, scroll: false }); }
    });
  });

  window.addEventListener('popstate', function () { activateFromHash(true); });
  window.addEventListener('hashchange', function () { activateFromHash(true); });

  /* ---------------- Section-end navigation ---------------- */
  var nextHref = document.body.getAttribute('data-next-href');
  var nextTitle = document.body.getAttribute('data-next-title');
  panels.forEach(function (p, i) {
    if (!p) return;
    var nav = document.createElement('div');
    nav.className = 'section-nav';
    if (i > 0) {
      var prev = document.createElement('button');
      prev.type = 'button'; prev.className = 'btn secondary';
      prev.innerHTML = '<span aria-hidden="true">←</span> ' + tabs[i - 1].querySelector('.tab-label').textContent;
      prev.addEventListener('click', function () { activate(i - 1, { forceScroll: true }); });
      nav.appendChild(prev);
    }
    if (i < panels.length - 1) {
      var nxt = document.createElement('button');
      nxt.type = 'button'; nxt.className = 'btn next';
      nxt.innerHTML = '<span>Continue: ' + tabs[i + 1].querySelector('.tab-label').textContent + '</span><span aria-hidden="true">→</span>';
      nxt.addEventListener('click', function () { activate(i + 1, { forceScroll: true }); });
      nav.appendChild(nxt);
    } else if (nextHref) {
      var a = document.createElement('a');
      a.className = 'btn next'; a.href = nextHref;
      a.innerHTML = '<span>Next lesson: ' + nextTitle + '</span><span aria-hidden="true">→</span>';
      nav.appendChild(a);
    } else {
      var home = document.createElement('a');
      home.className = 'btn next'; home.href = '../index.html#final-exam';
      home.innerHTML = '<span>You finished the last lesson — take the final exam</span><span aria-hidden="true">→</span>';
      nav.appendChild(home);
    }
    p.appendChild(nav);
  });

  /* ---------------- Scenario discussion toggles ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.btn-toggle[aria-controls]'), function (btn) {
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    var showText = btn.getAttribute('data-show') || btn.textContent.trim();
    var hideText = btn.getAttribute('data-hide') || showText.replace(/^Show/i, 'Hide');
    target.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = target.hidden;
      target.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? hideText : showText;
    });
  });

  /* ---------------- Quiz ---------------- */
  var questions = L.questions || [];
  var quizBuilt = false;
  var answered = 0, correctCount = 0;
  var box = document.getElementById('quiz-box');
  var scoreEl = document.getElementById('score-display');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  function shuffled(n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; }
    return a;
  }

  function buildQuiz() {
    if (!box || !questions.length) return;
    quizBuilt = true;
    answered = 0; correctCount = 0;
    box.innerHTML = '';
    if (scoreEl) scoreEl.hidden = true;
    questions.forEach(function (q, qi) {
      var order = shuffled(q.options.length);
      var wrap = document.createElement('div');
      wrap.className = 'quiz-question';
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-labelledby', 'q-' + qi);
      var html = '<p class="q-text" id="q-' + qi + '"><span class="q-n">' + (qi + 1) + '.</span>' + esc(q.q) + '</p><ul class="quiz-options">';
      order.forEach(function (oi, pos) {
        html += '<li><button type="button" class="quiz-option" data-q="' + qi + '" data-o="' + oi + '"><span class="opt-l" aria-hidden="true">' + String.fromCharCode(65 + pos) + '</span><span>' + esc(q.options[oi]) + '</span></button></li>';
      });
      html += '</ul><div class="explanation" id="exp-' + qi + '" hidden aria-live="polite"></div>';
      wrap.innerHTML = html;
      box.appendChild(wrap);
    });
  }

  if (box) box.addEventListener('click', function (e) {
    var btn = e.target.closest('.quiz-option');
    if (!btn || btn.disabled) return;
    var qi = +btn.getAttribute('data-q'), oi = +btn.getAttribute('data-o');
    var q = questions[qi];
    var all = btn.closest('.quiz-options').querySelectorAll('.quiz-option');
    Array.prototype.forEach.call(all, function (b) { b.disabled = true; });
    var exp = document.getElementById('exp-' + qi);
    var ok = oi === q.answer;
    if (ok) {
      btn.classList.add('correct'); correctCount++;
      exp.className = 'explanation correct-exp';
      exp.innerHTML = '<strong>Correct.</strong> ' + esc(q.exp);
    } else {
      btn.classList.add('incorrect');
      Array.prototype.forEach.call(all, function (b) { if (+b.getAttribute('data-o') === q.answer) b.classList.add('correct'); });
      exp.className = 'explanation incorrect-exp';
      exp.innerHTML = '<strong>Not quite.</strong> ' + esc(q.exp);
    }
    exp.hidden = false;
    answered++;
    if (answered === questions.length) showScore();
  });

  function showScore() {
    var total = questions.length;
    var prev = parseInt(store.get('wfa_score_' + lessonId) || '0', 10) || 0;
    store.set('wfa_completed_' + lessonId, 'true');
    store.set('wfa_score_' + lessonId, String(Math.max(correctCount, prev)));
    store.set('wfa_total_' + lessonId, String(total));
    if (!scoreEl) return;
    var pct = Math.round((correctCount / total) * 100);
    var msg = pct >= 80 ? 'Strong work. You are ready for the next lesson.'
            : pct >= 60 ? 'Good. Review the sections for the questions you missed.'
            : 'Worth another pass through this lesson before moving on.';
    if (prev > 0 && prev !== correctCount) msg += ' Previous best: ' + prev + '/' + total + '.';
    scoreEl.innerHTML =
      '<h3>' + correctCount + ' / ' + total + '</h3>' +
      '<p>' + esc(msg) + '</p>' +
      '<div class="actions">' +
        '<button type="button" class="btn secondary" id="quiz-retry">Retry quiz</button>' +
        (nextHref ? '<a class="btn" href="' + nextHref + '">Next lesson →</a>' : '<a class="btn" href="../index.html#final-exam">Go to the final exam →</a>') +
      '</div>';
    scoreEl.hidden = false;
    document.getElementById('quiz-retry').addEventListener('click', function () {
      buildQuiz();
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    scoreEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------------- Init ---------------- */
  activateFromHash(true);
})();
