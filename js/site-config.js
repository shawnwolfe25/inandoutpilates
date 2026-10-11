/* ============================================================
   IN & OUT PILATES — Site configuration
   ------------------------------------------------------------
   These two values connect the website to Supabase, the free
   service that stores the weekly schedule and handles Euna's
   admin login. You only paste these ONCE (see ADMIN-SETUP.txt).

   It is safe for these two values to be public — the "anon key"
   is designed to be shared, and the database rules only allow a
   logged-in user to make changes.
   ============================================================ */
window.SITE_CONFIG = {
  SUPABASE_URL: "https://xqwyvrdqcivlbdlvrhsx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxd3l2cmRxY2l2bGJkbHZyaHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNzEyNDQsImV4cCI6MjA5ODg0NzI0NH0.SzOyGtR4W5ULiFUWeS0Fvrv_5oiXnvrfpPaw3H6fd9U",
  // Optional anti-bot protection (Cloudflare Turnstile). Leave as-is to
  // skip it; paste your free "site key" to turn it on. See ADMIN-SETUP.txt.
  TURNSTILE_SITE_KEY: "PASTE_TURNSTILE_SITE_KEY"
};

/* Returns true once the two Supabase values above have been filled in. */
window.SITE_CONFIGURED = function () {
  var c = window.SITE_CONFIG || {};
  return c.SUPABASE_URL && c.SUPABASE_ANON_KEY &&
         c.SUPABASE_URL.indexOf("PASTE_") === -1 &&
         c.SUPABASE_ANON_KEY.indexOf("PASTE_") === -1;
};

/* Returns true once a Turnstile site key has been pasted in. */
window.TURNSTILE_ENABLED = function () {
  var c = window.SITE_CONFIG || {};
  return c.TURNSTILE_SITE_KEY && c.TURNSTILE_SITE_KEY.indexOf("PASTE_") === -1;
};

/* Days used by the schedule editor dropdown and the public sort order. */
window.SCHEDULE_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

/* The schedule shown before anything is saved (and if the site ever
   can't reach Supabase) so the page never looks broken. It is now a
   flexible LIST of classes — Euna can add or remove as many as needed. */
window.SCHEDULE_DEFAULT = {
  note: "Euna updates this schedule each week. Please confirm your spot before attending.",
  classes: [
    { day: "Monday",    time: "Morning", name: "MBB Group" },
    { day: "Monday",    time: "Midday",  name: "Machine Group" },
    { day: "Wednesday", time: "Morning", name: "MBB Group" },
    { day: "Wednesday", time: "Midday",  name: "Machine Group" },
    { day: "Friday",    time: "Morning", name: "MBB Group" }
  ]
};

/* The 1:1 availability shown on the Classes page — an intro line plus
   a list of openings Euna can add to or remove. */
window.ONETOONE_DEFAULT = {
  intro: "Private 1:1 and duet sessions are by appointment. Text Euna at (618) 409-4966 to arrange a time that works for you.",
  slots: []
};

/* The pricing shown before anything is saved. Euna can add or remove
   whole plans and individual line items, and pick one "best option"
   that is highlighted on the public Pricing page. */
window.PRICING_DEFAULT = {
  note: "All prices are per person. Contact us with any questions.",
  cards: [
    { title: "Group Classes", amount: "$00", unit: "/class",
      subtitle: "Machine & MBB group", featured: false,
      items: [
        { label: "Single class", value: "$00" },
        { label: "5-class pack", value: "$00" },
        { label: "10-class pack", value: "$00" },
        { label: "Monthly unlimited", value: "$00" }
      ] },
    { title: "Private Sessions", amount: "$00", unit: "/session",
      subtitle: "1:1 reformer & Cadillac", featured: true,
      items: [
        { label: "Single session", value: "$00" },
        { label: "5-session pack", value: "$00" },
        { label: "10-session pack", value: "$00" },
        { label: "Duet (per person)", value: "$00" }
      ] },
    { title: "Online via Zoom", amount: "$00", unit: "/class",
      subtitle: "MBB & 1:1 online", featured: false,
      items: [
        { label: "MBB group (online)", value: "$00" },
        { label: "1:1 online", value: "$00" },
        { label: "5-class pack", value: "$00" },
        { label: "Monthly", value: "$00" }
      ] }
  ]
};
