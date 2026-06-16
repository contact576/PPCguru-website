# Content TODO — verify/replace before launch

The site ships fully populated with **representative, clearly-labeled** content so nothing
is empty. Before going live, replace the items below with real, verified data. Most are a
one-line edit in `lib/site-config.ts` or a data file.

## Must-do before launch

- [ ] **Contact details** (`lib/site-config.ts → siteConfig.contact`): real phone, `phoneHref`, email, mailing address, postal code, hours.
- [ ] **Social profile URLs** (`siteConfig.social`): Instagram, LinkedIn, Facebook.
- [ ] **Trust numbers** (`siteConfig.trust`): confirm/replace `activeClients`, `adSpendManaged`, `avgRoas`, `leadsGenerated`, `googleReviewRating`, `googleReviewCount`. These are currently representative aggregates.
- [ ] **Case studies** (`lib/data/case-studies.ts`): currently anonymized, representative scenarios with a disclosure. Replace with real, **consented** client case studies (name + verified numbers) where you have written permission — especially in regulated verticals (healthcare, immigration). Otherwise keep them representative and labeled.
- [ ] **Testimonials** (`lib/data/testimonials.ts`): replace with real, consented quotes (name + business + permission).
- [ ] **Partner badges** (`components/shared/partner-badges.tsx`): swap the styled text badges for the official Google Partner / Meta Business Partner badge artwork from your partner dashboards if desired.
- [ ] **Founder bios / team** (`app/about/page.tsx`): confirm bios; decide whether to keep the Millennial Events mention (flagged in the brief); add team members + headshots.
- [ ] **Legal pages** (`app/privacy`, `app/terms`): have counsel review to match your real data practices and current law.
- [ ] **OG/social share image**: add a branded `opengraph-image` (none shipped yet).
- [ ] **Favicon / logo files**: replace the inline SVG logo with brand artwork if you have it.

## Optional / enhances live features (env vars — see README)

- [ ] `ANTHROPIC_API_KEY` — turns the instant audit & ad-copy tools into true AI output.
- [ ] `RESEND_API_KEY` (+ `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) — contact form email delivery.
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — spam protection on the form.
- [ ] Calendar booking embed on `/contact` (e.g. GoHighLevel/Calendly) if you want inline scheduling.

## Calculator data

- [ ] `lib/data/benchmarks.ts` — rows flagged `estimate: true` are interpolated from overall
      averages; verify against your first-party account data. Verified anchors (Google 2025
      CPC/CTR/CVR, home-services, legal, dental; Meta lead-gen CPLs) are sourced to
      WordStream/LocalIQ. Average ticket values are editable defaults.
