/* ============================================================
   IN & OUT PILATES — Schedule data helpers
   The schedule is a flexible list of classes: { day, time, name }.
   Used by classes.html (read-only) and admin.html (read + save).
   ============================================================ */
(function () {
  var client = null;

  function getClient() {
    if (window.DB && window.DB.client) return window.DB.client();
    if (client) return client;
    if (!window.SITE_CONFIGURED || !window.SITE_CONFIGURED()) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    client = window.supabase.createClient(
      window.SITE_CONFIG.SUPABASE_URL,
      window.SITE_CONFIG.SUPABASE_ANON_KEY
    );
    return client;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function dayIndex(day) {
    var i = window.SCHEDULE_DAYS.indexOf(day);
    return i < 0 ? 99 : i;
  }

  /* Clean the data into { note, classes:[{day,time,name}] }. Understands
     both the new list format and the old grid format (rows/morning...). */
  function normalize(data) {
    var def = window.SCHEDULE_DEFAULT;
    if (!data) return { note: def.note, classes: def.classes.slice() };
    var note = (data.note != null) ? data.note : def.note;
    var classes = [];

    if (Array.isArray(data.classes)) {
      classes = data.classes.map(function (c) {
        return {
          day: (c && c.day ? String(c.day) : "").trim(),
          time: (c && c.time ? String(c.time) : "").trim(),
          name: (c && c.name ? String(c.name) : "").trim()
        };
      }).filter(function (c) { return c.name || c.time; });
    } else if (data.rows) {
      // Convert the old fixed grid (Day -> morning/midday/evening) to a list.
      window.SCHEDULE_DAYS.forEach(function (day) {
        var row = data.rows[day];
        if (!row) return;
        [["morning", "Morning"], ["midday", "Midday"], ["evening", "Evening"]].forEach(function (col) {
          var v = row[col[0]];
          if (v && String(v).trim() && String(v).trim() !== "—") {
            classes.push({ day: day, time: col[1], name: String(v).trim() });
          }
        });
      });
    }

    if (!classes.length) classes = def.classes.slice();
    return { note: note, classes: classes };
  }

  async function load() {
    var sb = getClient();
    if (!sb) return normalize(window.SCHEDULE_DEFAULT);
    try {
      var res = await sb.from("settings").select("value").eq("key", "schedule").single();
      if (res.error || !res.data) return normalize(window.SCHEDULE_DEFAULT);
      return normalize(res.data.value);
    } catch (e) {
      return normalize(window.SCHEDULE_DEFAULT);
    }
  }

  async function save(data) {
    var sb = getClient();
    if (!sb) throw new Error("not-configured");
    var res = await sb.from("settings").upsert(
      { key: "schedule", value: normalize(data), updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (res.error) throw res.error;
    return true;
  }

  /* Draw the schedule into a <tbody> (columns: Day | Time | Class),
     grouped/sorted by weekday, and an optional note element. */
  function render(schedule, tbodyEl, noteEl) {
    var s = normalize(schedule);
    var ordered = s.classes.map(function (c, i) { return { c: c, i: i }; })
      .sort(function (a, b) {
        var d = dayIndex(a.c.day) - dayIndex(b.c.day);
        return d !== 0 ? d : a.i - b.i;
      })
      .map(function (x) { return x.c; });

    var rows = ordered.map(function (c) {
      return "<tr><td>" + escapeHtml(c.day || "—") + "</td><td>" +
        escapeHtml(c.time || "—") + "</td><td>" + escapeHtml(c.name || "—") + "</td></tr>";
    }).join("");

    if (tbodyEl) {
      tbodyEl.innerHTML = rows ||
        '<tr><td colspan="3" style="text-align:center">Schedule coming soon — please check back.</td></tr>';
    }
    if (noteEl && s.note) noteEl.textContent = s.note;
  }

  window.Schedule = {
    getClient: getClient,
    normalize: normalize,
    load: load,
    save: save,
    render: render
  };
})();
