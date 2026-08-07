========================================================
  IN & OUT PILATES — NEW WEBSITE  •  PLAIN-ENGLISH GUIDE
========================================================

Hi Shawn — this folder is your brand-new website. Everything is built
with simple, fast web files (no WordPress needed). Below is everything
you need, written for a non-expert. Take it one step at a time.


--------------------------------------------------------
WHAT'S IN THIS FOLDER
--------------------------------------------------------
  index.html .......... Home page
  classes.html ........ Classes & Schedule (live schedule + spot requests)
  pricing.html ........ Pricing & Payment
  registration.html ... Registration + liability waiver (on-site forms)
  about.html .......... About & Contrology (your story + principles)
  reviews.html ........ Client Reviews (your real 5-star Google reviews)
  contact.html ........ Contact page with a message form + map
  admin.html .......... Private dashboard for Euna (schedule, forms)
  css/style.css ....... The styling (colors, fonts, layout)
  js/ ................. Small scripts (menu, schedule, forms, database)
  vercel.json ......... Settings so Vercel hosts it correctly

  No more Google Forms or sign-up sheets — registrations, waivers,
  and class spot requests now save into the site and show up in the
  admin page. (One-time setup: see ADMIN-SETUP.txt.)


--------------------------------------------------------
TO PREVIEW IT RIGHT NOW (no internet hosting needed)
--------------------------------------------------------
  Just double-click "index.html" — it opens in your web browser.
  Click around the top menu to see every page.


--------------------------------------------------------
THINGS THAT STILL NEED YOUR REAL INFO  (3 quick items)
--------------------------------------------------------

1) PRICES  ->  edited by Euna on the new ADMIN page
   The prices currently show "$00" as placeholders. They are now
   self-service: Euna signs in at the private /admin page, opens the
   "Pricing" tab, types the real amounts, and clicks Save — the
   Pricing page updates automatically. (Setup: see ADMIN-SETUP.txt.)

2) SCHEDULE TIMES  ->  edited by Euna on the new ADMIN page
   The weekly grid is now self-service. Euna signs in at the
   private /admin page and types the class times into simple
   boxes; the Classes & Schedule page updates automatically.
   One-time setup (~10 min, free): see ADMIN-SETUP.txt.
   (Your live Google Sheet links and Zoom link already work.)

3) THE CONTACT FORM (EmailJS)  ->  contact.html
   The form is built and ready. To make it actually email you, you
   connect a free EmailJS account ONE time:

     a. Go to  https://www.emailjs.com  and create a free account.
     b. Click "Email Services" -> add Gmail (millershawnwork@gmail.com
        or the studio email) -> copy the SERVICE ID.
     c. Click "Email Templates" -> create a template.
        In the template's "To Email" box, type the STUDIO EMAIL
        ADDRESS where you want messages to arrive.
        In the body, include these fields so you see what people send:
            Name: {{name}}
            Phone: {{phone}}
            Email: {{email}}
            Interested in: {{interest}}
            Message: {{message}}
        Copy the TEMPLATE ID.
     d. Click "Account" -> copy your PUBLIC KEY.
     e. Open contact.html in any text editor. Near the bottom you'll
        see three lines that say PASTE_PUBLIC_KEY, PASTE_SERVICE_ID,
        PASTE_TEMPLATE_ID. Replace each with the values you copied.
     f. Save. Done — the form now emails the studio.
     g. SECURITY (recommended): in the EmailJS dashboard, open
        "Account" -> "Security" and:
          - Turn ON "Allowed Origins" / "API restrictions" and add
            your website address (e.g. https://inandoutpilates.com).
            This stops strangers from using your email quota.
          - Turn ON the built-in CAPTCHA / bot protection if offered.

   (Until you do this, the form politely tells visitors to text Euna.)


--------------------------------------------------------
HOW TO PUBLISH IT ONLINE (Vercel — free, recommended)
--------------------------------------------------------
Easiest method (drag & drop):
  1. Go to  https://vercel.com  and sign in (userid: shawnwolfe25).
  2. Click "Add New..." -> "Project" -> "Deploy".
  3. When it asks, drag this whole "inandout-pilates" folder in,
     OR connect the GitHub repo (see below) and pick it.
  4. Click Deploy. In about a minute you get a live web address.
  5. To use your own domain (inandoutpilates.com), open the project's
     "Settings" -> "Domains" -> add inandoutpilates.com and follow
     the on-screen steps. Vercel walks you through it.

Optional (GitHub, for version history):
  - Create a new repository under your GitHub (shawnwolfe25).
  - Upload all the files in this folder.
  - In Vercel, "Import" that repository and Deploy.
  - Every time you update files on GitHub, the site updates itself.


--------------------------------------------------------
WANT CHANGES?
--------------------------------------------------------
Just ask Shawn / Claude:
  "Update the prices to ___", "Change the schedule times", "Swap the
  hero photo", "Add a new review", etc. Quick to do.

You're all set. Enjoy the new site!  🌿
