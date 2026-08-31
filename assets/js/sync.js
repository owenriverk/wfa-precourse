/* OpenWFA progress sync — OPTIONAL. Loaded on pages that read/write progress.
 *
 * Off by default: until the learner signs in on account.html this script makes
 * zero network requests and the site behaves exactly as before (localStorage
 * only). When sync is on, one PUT /api/progress both pushes local progress and
 * pulls the server-merged result back — the server merge keeps the best of
 * both, so devices can sync in any order. Sim state is never synced.
 */
(function () {
  'use strict';

  var FLAG = 'wfa_sync';           // '1' when the learner turned sync on (this browser)
  var SKIP = { wfa_sync: 1 };      // local-only keys, never sent

  function lsOK() {
    try { localStorage.setItem('__wfa_t', '1'); localStorage.removeItem('__wfa_t'); return true; }
    catch (e) { return false; }
  }
  if (!lsOK()) return;

  function collect() {
    var keys = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('wfa_') === 0 && !SKIP[k]) keys[k] = localStorage.getItem(k);
    }
    return keys;
  }

  function apply(keys) {
    var changed = 0;
    for (var k in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, k) && localStorage.getItem(k) !== keys[k]) {
        try { localStorage.setItem(k, keys[k]); changed++; } catch (e) { /* full/blocked */ }
      }
    }
    return changed;
  }

  function api(path, opts) {
    opts = opts || {};
    opts.credentials = 'same-origin';
    if (opts.body) opts.headers = { 'Content-Type': 'application/json' };
    return fetch(path, opts).then(function (r) {
      var ct = r.headers.get('Content-Type') || '';
      if (ct.indexOf('application/json') === -1) throw new Error('no-api'); // e.g. GitHub Pages mirror
      return r.json().then(function (data) { return { status: r.status, data: data }; });
    });
  }

  var SYNC = {
    enabled: function () { return localStorage.getItem(FLAG) === '1'; },
    enable: function () { try { localStorage.setItem(FLAG, '1'); } catch (e) {} },
    disable: function () { try { localStorage.removeItem(FLAG); } catch (e) {} },

    me: function () { return api('/api/me'); },

    requestLink: function (email) {
      return api('/api/auth/request', { method: 'POST', body: JSON.stringify({ email: email }) });
    },

    /* Push local keys, get the server-merged set back, apply it. */
    syncNow: function () {
      return api('/api/progress', { method: 'PUT', body: JSON.stringify({ keys: collect() }) })
        .then(function (res) {
          if (res.status !== 200) return res;
          var changed = apply(res.data.keys || {});
          if (changed) {
            try { window.dispatchEvent(new CustomEvent('wfa-sync-applied', { detail: { changed: changed } })); }
            catch (e) { /* old browser */ }
          }
          return res;
        });
    },

    signOut: function () {
      SYNC.disable();
      return api('/api/auth/logout', { method: 'POST', body: '{}' });
    },

    deleteAccount: function () {
      SYNC.disable();
      return api('/api/account/delete', { method: 'POST', body: '{}' });
    },

    /* Best-effort push when the page is being left (quiz just finished, etc.). */
    beacon: function () {
      if (!SYNC.enabled() || !navigator.sendBeacon) return;
      try {
        var blob = new Blob([JSON.stringify({ keys: collect() })], { type: 'application/json' });
        navigator.sendBeacon('/api/progress', blob);
      } catch (e) { /* never break page unload */ }
    }
  };

  window.WFA_SYNC = SYNC;

  if (SYNC.enabled()) {
    var kick = function () { SYNC.syncNow().catch(function () { /* offline or signed out: local wins, stay quiet */ }); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kick);
    else kick();
    window.addEventListener('pagehide', SYNC.beacon);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') SYNC.beacon();
    });
  }
})();
