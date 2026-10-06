# Google Ads + Meta Ads landing page

Routes: `/google-ads-and-meta-ads` and `/google-ads-and-meta-ads/thank-you`.
Both are paid-traffic destinations with noindex metadata and their own header/footer.

## Campaign evidence

`lib/data/landing-google-meta-results.ts` contains five original Meta screenshots,
visually checked against the files in `public/landing/results` on 2026-10-06.
Messaging conversations, Meta leads and form leads retain their actual labels.
Missing reporting years or dates are not inferred.

Google Ads screenshots have not yet been supplied. Its panel currently shows
clearly labelled, verbatim Google Ads client reviews. Add verified original
captures to `googleAdsResults` to enable the matching phone carousel. Each record
needs the image path and dimensions, client, result, cost, spend and visible period.
Do not use the ChatGPT captures in `public/landing/proof` as campaign evidence.

## Form and booking

- Reuses the three-step qualification form and production delivery action.
- Source: `landing:google-meta-ads`; stored landing ID: `google-meta-ads`.
- Collects business, location, optional website/profile, business type, monthly
  CAD ad budget, channel, name, email and phone.
- Success requires an accepted storage/CRM/email delivery path. Validation,
  spam rejection and unavailable delivery return an error instead of redirecting.
- The thank-you URL contains no name, email or company query parameters.
- This funnel’s acknowledgement email matches the growth-plan offer and links
  directly to `/google-ads-and-meta-ads/thank-you#book`. Other forms retain their
  existing acknowledgement copy and destination.
- The short-lived, HTTP-only `ppcg_google_meta_receipt` cookie is isolated to
  this thank-you route. The browser must also have its matching pending event ID.
- Uses the existing LeadConnector booking calendar `zbrJAxyqqqT6te57YdYU`.
  Keep its visible fallback link; do not load `form_embed.js`, which hides this
  calendar. The narrow-phone CSS lets all seven day columns fit.

## Measurement

The existing root scripts install GTM `GTM-NRX9BRWF`, Clarity `xpxkvrbt7j`, and
Meta Pixel `813865793503374` once. This page does not duplicate the loaders.

The published GTM container still watches an obsolete form success selector.
This funnel therefore queues its confirmed GA4 `generate_lead` directly to the
existing Google tag destination `G-MKBLW76L2Z`, using
`form_name: google_meta_growth_plan`. Do not add a parallel GTM GA4 event tag for
this same event without removing the direct path.

Dedicated Google Ads action created 2026-10-06:

- PPC Guru advertiser: `7272498750` (manager `1632013729`).
- Action: `7824827732`, “PPC Guru | Google + Meta Growth Plan | Confirmed Lead”.
- Destination: `AW-18496471261/CysrCNTKlZMdEN2B5_NE`.
- Website / submit lead form / one per click / 30-day click window.
- **Secondary measurement action**, not an automatic bidding goal. Select the
  intended conversion goal when configuring a campaign. No campaigns or budgets
  were changed.

The Ads destination is configured on funnel entry through the existing Google
tag. The Ads conversion, GA4 lead, Clarity `google_meta_lead_submitted`, and Meta
Lead run only after the receipt/session check. Google Ads uses the event ID as
`transaction_id`; Meta uses the same event ID as the server event for deduplication.
No contact details or made-up revenue values are sent in these browser events.
Declined analytics consent suppresses them. Refreshing or directly opening the
thank-you route is not a new lead.

## Verification and release

Run `npm run check:landing-lead`, `npm run check:team-email` and `npm run build`.
On the Windows workspace junction, Next.js must run from the resolved physical
project path; this is a local environment issue, not a deployment configuration.
Production `ppcguru.ca` is hosted on Hostinger and deploys `master`.

Offline tests use mocked delivery providers. They do not prove receipt in a real
inbox or an ads dashboard; those require an intentional live submission after
deployment. No live test lead or calendar booking was created during development.
