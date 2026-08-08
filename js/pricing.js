/* ============================================================
   IN & OUT PILATES — Pricing data helpers
   Pricing is a flexible list of cards, each with its own list of
   line items. Exactly one card may be the "best option" (featured),
   which is highlighted on the public Pricing page.
   Used by pricing.html (read-only) and admin.html (read + save).
   ============================================================ */
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* Clean into { note, cards:[{title,amount,unit,subtitle,featured,items:[{label,value}]}] }.
     Enforces that at most ONE card is featured (first one wins). */
  function normalize(data) {
    var def = window.PRICING_DEFAULT;
    if (!data || !Array.isArray(data.cards) || !data.cards.length) {
      return { note: def.note, cards: def.cards.map(cloneCard) };
    }
    var featuredUsed = false;
    var cards = data.cards.map(function (c) {
      c = c || {};
      var feat = !!c.featured && !featuredUsed;
      if (feat) featuredUsed = true;
      var items = (Array.isArray(c.items) ? c.items : []).map(function (it) {
        return { label: (it && it.label ? String(it.label) : "").trim(),
                 value: (it && it.value ? String(it.value) : "").trim() };
      }).filter(function (it) { return it.label || it.value; });
      return {
        title: (c.title ? String(c.title) : "").trim(),
        amount: (c.amount ? String(c.amount) : "").trim(),
        unit: (c.unit ? String(c.unit) : "").trim(),
        subtitle: (c.subtitle ? String(c.subtitle) : "").trim(),
        featured: feat,
        items: items
      };
    }).filter(function (c) { return c.title || c.amount || c.items.length; });

    if (!cards.length) return { note: def.note, cards: def.cards.map(cloneCard) };
    return { note: (data.note != null ? data.note : def.note), cards: cards };
  }

  function cloneCard(c) {
    return {
      title: c.title, amount: c.amount, unit: c.unit, subtitle: c.subtitle,
      featured: !!c.featured, items: (c.items || []).map(function (it) {
        return { label: it.label, value: it.value };
      })
    };
  }

  /* Draw the pricing cards into a grid element and an optional note. */
  function render(data, gridEl, noteEl) {
    var d = normalize(data);
    gridEl.innerHTML = d.cards.map(function (c) {
      var items = c.items.map(function (it) {
        return "<li><span>" + esc(it.label) + "</span> <strong>" + esc(it.value) + "</strong></li>";
      }).join("");
      var badge = c.featured ? '<span class="tag">MOST POPULAR</span>' : "";
      var btnClass = c.featured ? "btn--primary" : "btn--ghost";
      var cta = '<a href="registration.html" class="btn ' + btnClass + '">Get Started</a>';
      return '<div class="price-card' + (c.featured ? " featured" : "") + '">' + badge +
        "<h3>" + esc(c.title) + "</h3>" +
        '<div class="amount">' + esc(c.amount) + "<span>" + esc(c.unit) + "</span></div>" +
        '<p class="per">' + esc(c.subtitle) + "</p>" +
        '<ul class="price-list">' + items + "</ul>" + cta + "</div>";
    }).join("");
    if (noteEl) noteEl.textContent = d.note || "";
  }

  async function load() {
    if (!window.DB) return normalize(window.PRICING_DEFAULT);
    var v = await window.DB.getSetting("pricing", window.PRICING_DEFAULT);
    return normalize(v);
  }

  async function save(data) {
    if (!window.DB) throw new Error("not-configured");
    return window.DB.setSetting("pricing", normalize(data));
  }

  window.Pricing = { normalize: normalize, render: render, load: load, save: save };
})();
