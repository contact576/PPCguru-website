# Google Ads + Meta Ads landing page

Routes: `/google-ads-and-meta-ads` and `/google-ads-and-meta-ads/thank-you`.
Both are paid-traffic destinations with noindex metadata and their own header/footer.

## Offer

Headline: **Beat your last 30 days of qualified leads—or pay $0 in management fees.**

PPC Guru verifies the advertiser’s previous 30-day Google Ads performance before
launch. If the agreed comparison period does not generate more qualified leads,
the management fee for that period is $0. The CTA is **See if my account qualifies**.

The offer is available to eligible existing advertisers. Lead criteria, baseline,
attribution, campaign period and a comparable advertising budget are confirmed
before launch. Ad spend is separate and non-refundable. Submitting the form
requests an eligibility review; it does not confirm qualification or enrolment.
Meta-only and new advertisers can discuss a campaign plan, but the Google Ads
management-fee offer does not automatically apply to them.

## Campaign evidence

`lib/data/landing-paid-ads-reports.ts` contains all 43 reports supplied in the
latest PPC Guru Drive folder, imported on 2026-10-08: 28 Google Ads and 15 Meta Ads.
Their optimized WebP assets live in `public/landing/results/2026-10`. Full source
screenshot framing and redactions are preserved without cropping. Each image
retains its own reporting period and metrics; no common period or performance
figures are inferred. The data file uses industry descriptions and image alt text,
not transcribed result claims. Past performance does not guarantee future results.

The results section has two separate horizontal rails: Google Ads on top moving
left to right, and Meta Ads below moving right to left. Compact images have a
narrow white border and a subtle floating motion. Both rails loop continuously
while visible. Hover and ordinary vertical page scrolling do not pause them.
Manual browsing pauses motion briefly, then resumes automatically. Visitors can
use the shared Pause/Resume control. Motion also pauses in background tabs,
offscreen or while a report is open, and is disabled for reduced-motion preferences.

Each rail has previous/next buttons, swipe and keyboard navigation. Opening an
image shows its uncropped report in an accessible dialog, with navigation limited
to the same platform. Previews use Next image optimization and lazy loading; the
dialog uses the corresponding full-size WebP. Existing report data and assets
used by other pages remain separate and unchanged.

Do not use the ChatGPT captures in `public/landing/proof` as campaign evidence.

## Form and booking

- Reuses the three-step qualification form and production delivery action.
- Source: `landing:google-meta-ads`; stored landing ID: `google-meta-ads`.
- Collects business, location, optional website/profile, business type, monthly
  CAD ad budget, channels, name, email and phone. Channels are multi-select:
  Google Ads, Meta Ads, SEO and Help me choose. At least one is required.
  Repeated form values are validated and saved as `answers.channels`; all
  selected labels appear in team email, the GHL note, the admin queue and CSV.
  Older tabs posting `both` remain valid and map to Google Ads plus Meta Ads.
  GTA retains its existing single-choice form and `answers.channel` records.
- Success requires email-provider acknowledgment for marketing, sales and
  contact at ppcguru.ca, plus successful GHL contact, note and tag delivery.
  A Supabase recovery row alone cannot confirm this funnel, and it never falls
  back to Zoho. Failure shows an error without a receipt or conversion event.
- Identical retries reuse saved rows and successful channels in a bounded
  30-minute process cache, including per-recipient email acknowledgments.
  Duplicate protection is best effort across workers/restarts; it is not a
  durable outbox or a guarantee of exactly-once delivery.
- Field errors keep stable accessible labels, describe the error separately and
  focus the relevant step once per failed response. Configured Turnstile must be
  ready before submission. Hidden anti-spam fields stay outside keyboard/AT navigation.
- The thank-you URL contains no name, email or company query parameters.
- This funnel’s acknowledgement email requests a Google Ads eligibility review,
  explains the conditional management-fee offer and separate ad spend, and links
  directly to `/google-ads-and-meta-ads/thank-you#book`. Other forms retain their
  existing acknowledgement copy and destination.
- The short-lived, HTTP-only `ppcg_google_meta_receipt` cookie is isolated to
  this thank-you route. The browser must also have its matching pending event ID.
- Direct visits and acknowledgement-email revisits show neutral booking copy;
  only a valid receipt shows the successful-submission confirmation.
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
Declined analytics consent suppresses them and visitor identity linking. Session
fields respond to consent changes and clear the identifier on opt-out.
Refreshing or directly opening the
thank-you route is not a new lead.

## Verification and release

Run `npm run check:landing-lead`, `npm run check:team-email`,
`npm run check:ghl`, `npm run typecheck` and `npm run build`. The offline suite
covers lead/conversion checks, 16 email checks, 12 routing checks and 16 GHL
contract checks.
On the Windows workspace junction, Next.js must run from the resolved physical
project path; this is a local environment issue, not a deployment configuration.
Production `ppcguru.ca` is hosted on Hostinger and deploys `master`.

Offline tests use mocked delivery providers. They do not prove receipt in a real
inbox or an ads dashboard; those require an intentional live submission after
deployment. The offer release was verified with a live enquiry on 2026-10-09
(India time): confirmed thank-you, loaded calendar, Supabase row, team emails
received in Contact and Sales, and the acknowledgement email received.
GHL and all three team email destinations acknowledged delivery; the Marketing
inbox and individual Meta CAPI event were not independently verified.
Live delivery needs the deployed `GHL_API_TOKEN` and `GHL_LOCATION_ID`, plus a
working `RESEND_API_KEY` with a verified sender and matching `CONTACT_FROM_EMAIL`.
Production email delivery does not use SMTP. Provider acceptance still needs to
be checked against actual receipt in all three inboxes and the GHL contact.
