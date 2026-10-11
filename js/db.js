/* ============================================================
   IN & OUT PILATES — Shared database layer (Supabase)
   One Supabase client for the whole site. Used by the public
   forms (registration, waiver, class sign-ups) and by admin.html
   to review submissions and edit page content.
   ============================================================ */
(function () {
  var client = null;

  function configured() {
    return !!(window.SITE_CONFIGURED && window.SITE_CONFIGURED());
  }

  function client_() {
    if (client) return client;
    if (!configured()) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    client = window.supabase.createClient(
      window.SITE_CONFIG.SUPABASE_URL,
      window.SITE_CONFIG.SUPABASE_ANON_KEY
    );
    return client;
  }

  /* Insert one row into a table (used by the public forms). */
  async function insert(table, row) {
    var sb = client_();
    if (!sb) throw new Error("not-configured");
    var res = await sb.from(table).insert(row);
    if (res.error) throw res.error;
    return true;
  }

  /* List every row in a table, newest first (admin only). */
  async function listAll(table) {
    var sb = client_();
    if (!sb) return [];
    var res = await sb.from(table).select("*").order("created_at", { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function deleteRow(table, id) {
    var sb = client_();
    if (!sb) throw new Error("not-configured");
    var res = await sb.from(table).delete().eq("id", id);
    if (res.error) throw res.error;
    return true;
  }

  async function updateRow(table, id, patch) {
    var sb = client_();
    if (!sb) throw new Error("not-configured");
    var res = await sb.from(table).update(patch).eq("id", id);
    if (res.error) throw res.error;
    return true;
  }

  /* Generic key/value content stored in the "settings" table
     (the weekly schedule and the 1:1 availability text). */
  async function getSetting(key, fallback) {
    var sb = client_();
    if (!sb) return fallback;
    try {
      var res = await sb.from("settings").select("value").eq("key", key).single();
      if (res.error || !res.data) return fallback;
      return res.data.value;
    } catch (e) {
      return fallback;
    }
  }

  async function setSetting(key, value) {
    var sb = client_();
    if (!sb) throw new Error("not-configured");
    var res = await sb.from("settings").upsert(
      { key: key, value: value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (res.error) throw res.error;
    return true;
  }

  window.DB = {
    configured: configured,
    client: client_,
    insert: insert,
    listAll: listAll,
    deleteRow: deleteRow,
    updateRow: updateRow,
    getSetting: getSetting,
    setSetting: setSetting
  };
})();
