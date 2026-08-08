/* ============================================================
   IN & OUT PILATES — Optional Cloudflare Turnstile (anti-bot)
   No-op unless a site key is set in js/site-config.js.
   Usage:
     var gate = window.Turnstile.attach(holderEl);
     ... on submit: if (!gate.ok()) { show message; return; }
   ============================================================ */
(function () {
  var loaded = false, loading = false, queue = [];

  function enabled() {
    return !!(window.TURNSTILE_ENABLED && window.TURNSTILE_ENABLED());
  }

  function loadApi(cb) {
    if (loaded) { cb(); return; }
    queue.push(cb);
    if (loading) return;
    loading = true;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true; s.defer = true;
    s.onload = function () { loaded = true; queue.forEach(function (f) { f(); }); queue = []; };
    document.head.appendChild(s);
  }

  /* Render a widget into `holder` and return a small gate object.
     gate.ok()  -> true if disabled, or if the human check passed. */
  function attach(holder) {
    var state = { token: null };
    if (!enabled() || !holder) {
      if (holder) holder.style.display = 'none';
      state.ok = function () { return true; };
      state.reset = function () {};
      return state;
    }
    var widgetId = null;
    loadApi(function () {
      if (!window.turnstile) return;
      widgetId = window.turnstile.render(holder, {
        sitekey: window.SITE_CONFIG.TURNSTILE_SITE_KEY,
        callback: function (t) { state.token = t; },
        'expired-callback': function () { state.token = null; },
        'error-callback': function () { state.token = null; }
      });
    });
    state.ok = function () { return !!state.token; };
    state.reset = function () {
      state.token = null;
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
    };
    return state;
  }

  window.Turnstile = { enabled: enabled, attach: attach };
})();
