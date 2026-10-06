# IN & OUT PILATES — Website

Website for IN & OUT PILATES, a Pilates studio at 3450 Liberty Drive, Ste A, Springfield, IL 62704.
Live at **https://inandoutpilates.com**.

It's a plain static site (HTML, CSS and vanilla JavaScript) with no build step and no framework. Vercel hosts it. Supabase stores the editable content (schedule, pricing, 1:1 availability) and the form submissions, and powers the admin login.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `classes.html` | Classes & Schedule: live weekly schedule, monthly schedule posters, class spot requests |
| `pricing.html` | Pricing & Payment, with Venmo / Cash App / Square QR codes |
| `registration.html` | New-client registration and liability waiver |
| `about.html` | About & Contrology |
| `reviews.html` | Client reviews |
| `contact.html` | Contact form (EmailJS) and map |
| `privacy.html` | Privacy & Your Information |
| `admin.html` | Private studio dashboard, not linked in the menu and set to `noindex` |
| `404.html` | Not-found page |

## Project layout

```
css/style.css        All site styling
js/site-config.js    Supabase URL + anon key, Turnstile key, default schedule/pricing content
js/db.js             Shared Supabase client (form inserts, admin reads/updates)
js/main.js           Navigation menu and shared page behavior
js/schedule.js       Renders the public schedule and 1:1 availability
js/pricing.js        Renders the public pricing cards
js/turnstile.js      Optional Cloudflare Turnstile anti-bot check (inactive until a key is set)
img/                 Photos, logos, payment QR codes, monthly schedule posters
vercel.json          Clean URLs and security headers (including the Content-Security-Policy)
robots.txt, sitemap.xml
```

## Running locally

You don't need to install anything. Open `index.html` in a browser, or serve the folder so the clean URLs and Supabase calls behave like production:

```bash
npx serve .
```

If Supabase can't be reached, the schedule and pricing fall back to the defaults in `js/site-config.js`.

## Content editing (admin page)

Euna signs in at `/admin` to edit content. Nothing gets redeployed when she saves:

- **Schedule**: weekly class list shown on the Classes page
- **1:1 Availability**: private-session intro text and open slots
- **Pricing**: plans, line items, and the highlighted "best option"
- **Spot Requests / Registrations / Waivers**: review submissions, mark confirmed, export to CSV, delete

Admin logins are created by hand in the Supabase dashboard. Public sign-ups are off.

## Backend services

| Service | Used for | Configured in |
| --- | --- | --- |
| Supabase | `settings`, `registrations`, `waivers`, `signups` tables; admin auth | `js/site-config.js` |
| EmailJS | Contact form email delivery | `contact.html` (bottom script) |
| Cloudflare Turnstile | Optional bot check on forms | `js/site-config.js` |
| Google Maps embed | Map on the contact page | `contact.html` |
| Vercel Web Analytics | Page-view stats (cookieless) | Script tag in each public page's `<head>`; turned on in the Vercel dashboard |

Row-level security lets the public read site settings and **insert** form submissions. Only signed-in users can read or change submissions. The table SQL and policies are in [ADMIN-SETUP.txt](ADMIN-SETUP.txt).

The Supabase anon key in `js/site-config.js` is meant to be public. Never put the `service_role` key anywhere in this repo.

### Still to configure

- **EmailJS**: `contact.html` still has the `PASTE_PUBLIC_KEY` / `PASTE_SERVICE_ID` / `PASTE_TEMPLATE_ID` placeholders. Until they're filled in, the form tells visitors to text Euna instead.
- **Turnstile**: `TURNSTILE_SITE_KEY` is still `PASTE_TURNSTILE_SITE_KEY`. The forms work without it and rely on a honeypot field.

## Adding a third-party script or service

`vercel.json` sets a strict Content-Security-Policy. Any new external script, font, frame, or API host has to be added to the matching CSP directive, or the browser will block it in production even though it works when you open the file locally. External libraries are loaded from jsDelivr with pinned versions and SRI `integrity` hashes, so keep that up when you add or upgrade one.

## Deployment

The site deploys to Vercel. Pushing to the connected repo triggers a deploy, or you can drag the folder into Vercel. `cleanUrls` serves `classes.html` as `/classes`, and so on. Update `sitemap.xml` if you add a public page.

## More documentation

- [SETUP-GUIDE.txt](SETUP-GUIDE.txt): plain-English overview, EmailJS setup, publishing to Vercel
- [ADMIN-SETUP.txt](ADMIN-SETUP.txt): Supabase project, tables, security policies, admin login, and how Euna uses the dashboard
