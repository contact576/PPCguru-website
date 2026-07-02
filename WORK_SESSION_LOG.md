# Work Session Log — Lead-Generation & Conversion Overhaul

**Branch:** `claude/lead-gen-conversion` (off the latest work branch). **Never pushed to main. Review-first.**
**Objective:** turn the site from *educational* into a *lead-generation* machine — page-specific offers,
in-place capture, premium/trust/conversion feel — without a random redesign. Audit first, then implement the
highest-impact, safe changes.

## Guardrails (honoured)
No fabricated clients/testimonials/reviews/awards/guarantees · client-directed numbers stay `[VERIFY-client]` ·
no changes to analytics IDs/pixels/env/forms-destinations/deploy/payment · `npm run build` green per commit ·
review-first, nothing on `main`.

## Confirmed offers (client-approved this session)
- **30-day free trial** (Google Ads OR Meta Ads management) — no contract, no setup fee, no upfront payment,
  no obligation, walk away anytime; continue only if happy with the leads.
- **Free page-specific audit / account review** (universal).
- **Up to $3,600 in Google Ads credit** (Google Partner; was $600).

---

## Phase 1 — Audit ✅
- Ran **6 read-only audit agents in parallel** (CRO/lead-gen · design/brand · SEO/schema/GEO · content/E-E-A-T ·
  UX/mobile/a11y/perf · competitor research). Each returned a scored /10 section.
- Synthesized into **`WEBSITE_FULL_AUDIT_REPORT.md`** (30 parameters scored; overall ~7.2/10 with lead-gen the
  weak spot — page-specific offers 3/10, inner-page conversion path 4/10).
- Competitor research (SearchKings/Orcafy/BreezeMax/WebFX): risk-reversal stack is table-stakes; gate+qualify
  the audit; dedicated audit URL; one memorable proof number; 3-field forms; single CTA per page.

## Phase 2 — Lead-generation implementation ✅ (the priority)
- **`lib/data/service-offers.ts`** (NEW) — per-service hooks/popup copy/CTAs + master offers (trial, audit,
  $3,600 credit, risk-reversal). `offerForPath()` resolves the offer by route. Commit `9b8fbcf`.
- **`offer-popup.tsx`** — rewritten page-aware: single gentle bottom-right slide-in (~7s on service pages),
  page-specific copy, session-capped, openable on demand via `ppcg:open-offer` event.
- **`floating-cta.tsx`** — converts IN PLACE (dispatches the open event) instead of navigating to `/#audit`;
  auto-hides while the slide-in is open.
- **`lead-form.tsx`** — a11y labels (was placeholder-only — a Critical fix), brand-lime button (was off-brand),
  focus ring, larger tap targets, "reply within one business day" trust note.
- **Service template** (`app/services/[slug]/page.tsx`) — hero CTA + dashboard CTA + "included" CTA now open an
  in-place popup with page-specific copy; hero offer chips (trial / $3,600 / no contract / no setup fee);
  mid-page conversion strip after the pain BigQuote; final LeadBand made offer-specific. Commit `753b1dc`.
- **Combo template** (45 pages) — hero CTA + LeadBand personalized per service×industry
  ("Free {service} audit for {industry}").
- **`lead-band.tsx`** — page-specific `ctaLabel` + risk-reversal chips + `id="lead-band"`.
- **`/free-audit`** (NEW) — dedicated gated audit landing page (competitor-validated): form high on page,
  "what you get", 30-day-trial StepFlow, FAQ (FAQPage schema), risk-reversal + $3,600. Wired into sitemap,
  footer, llms.txt. Announcement bar + homepage hero now lead with the trial; `/pricing` FAQ aligned to
  "no setup fee / free trial". Commit `e93b6f8`.

## Phase 3 — Audit-driven SEO / a11y / honesty fixes ✅ (top items)
- Removed invented `LocalBusiness priceRange:"$$"` from 30 location pages (honesty).
- Added `Article image` to blog schema (rich-result eligibility).
- Bespoke homepage `title`/`description` (was inheriting the generic layout title).
- Skip-to-content link; darkened `--color-ink-faint` to meet WCAG-AA on cream. Commit (SEO/a11y).
- The remaining SEO/design/content polish (title de-dup at 58-page scale, emoji→icons, footer hubs, `track()`
  on CTAs, `next/image`) is documented as a recommended follow-on batch in the audit report §7/§25.

## Phase 4 — QA + reports ✅
- `npm run build` green (~151 routes) on every commit; final QA pass verified links/schema/no-fabrication.
- Wrote `WEBSITE_FULL_AUDIT_REPORT.md` (25-section final report + scores) and this log.

---

## Net result
The lead-generation cluster (parameters 2–7, 19, 20) moved from the **3–5/10** range into the **7–8/10** range:
the site now converts on-page with page-specific offers, a flagship 30-day-free-trial hook, a dedicated
`/free-audit` lander, in-place CTAs, and risk-reversal at every ask — with the honesty guardrails intact and
the whole thing behind a review-first PR.
