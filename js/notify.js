/* ============================================================
   IN & OUT PILATES — Email notifications (EmailJS)
   Sends Euna an email whenever someone registers, signs the
   waiver, requests a class spot, or uses the contact form.
   Nothing is sent until the three EMAILJS_ values in
   js/site-config.js are filled in. If sending fails, the
   submission is still saved and shows up on the admin page.

   The EmailJS template should use these variables:
     Subject: {{title}}
     Body:    {{title}}
              Name: {{name}}
              Phone: {{phone}}
              Email: {{email}}
              {{details}}
     Reply-To: {{reply_to}}
   ============================================================ */
(function () {
  var inited = false;

  function cfg() { return window.SITE_CONFIG || {}; }

  function enabled() {
    var c = cfg();
    return !!(c.EMAILJS_PUBLIC_KEY && c.EMAILJS_SERVICE_ID && c.EMAILJS_TEMPLATE_ID &&
      (c.EMAILJS_PUBLIC_KEY + c.EMAILJS_SERVICE_ID + c.EMAILJS_TEMPLATE_ID).indexOf("PASTE_") === -1 &&
      window.emailjs);
  }

  /* Send one notification. Rejects if not set up or if sending fails. */
  function send(info) {
    if (!enabled()) return Promise.reject(new Error("not-configured"));
    var c = cfg();
    if (!inited) { window.emailjs.init({ publicKey: c.EMAILJS_PUBLIC_KEY }); inited = true; }
    return window.emailjs.send(c.EMAILJS_SERVICE_ID, c.EMAILJS_TEMPLATE_ID, {
      title: info.title || "New message from the website",
      name: info.name || "",
      phone: info.phone || "",
      email: info.email || "",
      reply_to: info.email || "",
      details: info.details || ""
    });
  }

  /* Same as send(), but never fails — used after a form is already saved. */
  function quiet(info) {
    try { return send(info).catch(function () {}); } catch (e) { return Promise.resolve(); }
  }

  /* Turns [["Label", value], ...] into readable lines, skipping blanks. */
  function lines(pairs) {
    return pairs.filter(function (p) { return p[1] !== undefined && p[1] !== null && String(p[1]).trim() !== ""; })
      .map(function (p) { return p[0] + ": " + p[1]; }).join("\n");
  }

  window.Notify = { enabled: enabled, send: send, quiet: quiet, lines: lines };
})();
