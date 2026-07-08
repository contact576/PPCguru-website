# PPC Guru — Full Website Audit & Lead-Generation Overhaul

**Branch:** `claude/lead-gen-conversion` (off the latest work branch; never pushed to main — review-first)
**Date:** 2026-07-01 · **Gate:** `npm run build` green (~151 routes) each commit; `npm run lint` is broken on Next 16 (documented) — type-check via build.

## 1. Agents / sub-agents used
Six focused **read-only** audit agents ran in parallel (the client's 10 recommended auditors consolidated for
credit-efficiency; each returned a scored section, not file dumps), then implementation happened in the main
thread, then a QA pass:
1. **CRO / lead-gen / offer-funnel / forms / popups / first-screen** (segments 1–7, 19, 20)
2. **Visual design / brand / fonts / color / imagery / consistency / innovation** (8–11, 28, 29)
3. **SEO / technical-SEO / schema / GEO-AEO / internal-linking** (15, 16, 17, 22)
4. **Content quality / verification / E-E-A-T / blog** (12, 13, 14, 23)
5. **UX / mobile / accessibility / performance / nav-footer / analytics-readiness** (21, 24, 25, 26, 27)
6. **Competitor & market research** (18) — WebSearch/WebFetch (Apify not needed)

---

## 2. Audit score summary (out of 10)

| # | Parameter | Score | Priority focus | Status this session |
|---|---|:--:|---|---|
| 1 | First-screen clarity | 8 | Add fold-level trust + offer on inner pages | ✅ hero offer chips added |
| 2 | Hero offer & lead hook | 6→**8** | Surface trial/credit in heroes | ✅ done (home, service, combo, announce bar) |
| 3 | Lead-gen & conversion path | home 7 / inner **4→7** | Stop off-page CTAs | ✅ in-place CTAs + mid-page strip |
| 4 | Page-specific offer strategy | **3→8** | Per-service offers | ✅ `service-offers.ts` + page-aware popup |
| 5 | Popup & floating-CTA | 6→**8** | Page-specific, convert-in-place | ✅ rewritten |
| 6 | Form strategy | 6→**8** | A11y + brand + trust note | ✅ labels, lime button, reply note |
| 7 | CRO psychology | home 7 / inner **5→7** | Risk-reversal at the ask | ✅ risk-reversal chips near CTAs |
| 8 | Visual design quality | 8 | (design overhaul already landed) | ◻ recommend (emoji→icons) |
| 9 | Fonts & readability | 8 | Sub-AA faint text | ✅ `--color-ink-faint` darkened |
| 10 | Color system | 9 | Rogue blue token | ◻ recommend |
| 11 | Image/media quality | 6 | Real assets (CREATIVE-BRIEF.md) | ◻ asset hand-off |
| 12 | Content quality | 8 | De-template service defs | ◻ recommend |
| 13 | Content verification/trust | 7 | Byline `[VERIFY]`, provenance | ◻ needs client confirm |
| 14 | E-E-A-T | 7.5 | Founder photos/LinkedIn, named proof | ◻ needs real assets |
| 15 | SEO | 8.5 | Dedupe 58 titles, homepage meta | ◻ homepage meta ✅; titles recommend |
| 16 | Technical SEO | 9 | `lang=en-CA`, blog dateModified | ◻ recommend |
| 17 | Schema accuracy | 8.5 | Remove priceRange, Article image | ✅ both done |
| 18 | Competitor positioning | — | Risk-reversal hero, gated audit lander | ✅ `/free-audit` built |
| 19 | Service-page conversion | **5→7** | In-place capture | ✅ done |
| 20 | Lead-magnet strength | 7 | Promote trial/credit as offers | ✅ `/free-audit` + hero |
| 21 | Navigation & footer | 8 | Phone/WhatsApp missing (data) | ◻ needs client NAP |
| 22 | Internal linking | 8.5 | Footer hubs, sibling combos | ◻ recommend |
| 23 | Blog strategy | 8 | Orphan posts, author card | ◻ recommend (author card already present) |
| 24 | Mobile UX | 8 | Bottom-right pile-up | ✅ floating CTA de-conflict |
| 25 | Accessibility | **6→8** | Form labels, skip link | ✅ both done |
| 26 | Performance | 7 | next/image when assets land | ◻ recommend |
| 27 | Analytics readiness | 7 | Fire track() on CTAs (no IDs) | ◻ recommend |
| 28 | Consistency | 6 | Homepage inline vs tokens; CTA copy drift | ◻ recommend |
| 29 | Innovation/uniqueness | 8 | Toolkit on homepage | ◻ recommend |
| 30 | Final QA | — | build/typecheck | ✅ green |

**Overall (pre-session): ~7.2/10**, with **lead generation the clear weak spot** (page-specific offers 3,
inner-page conversion path 4, service-page capture 5). **After this session the lead-gen cluster moves into
the 7–8 range** — the site now converts on-page with page-specific offers instead of routing intent away.

---

## 3. Detailed findings by domain (condensed; full per-parameter detail below)

### CRO / Lead-gen (the priority — biggest gains)
- **Root problem (fixed):** the money pages (service + 45 combos) were *content-complete but capture-incomplete*
  — every mid-page CTA was `href="/contact"` (navigating away) and the offer was the same generic "free audit"
  on all ~150 routes. **Now:** page-specific offers (`lib/data/service-offers.ts`), in-place popups, a mid-page
  conversion strip, page-aware slide-in, and a convert-in-place floating CTA.
- **Offer stale (fixed):** popup said "$600 credit"; no trial anywhere. **Now:** 30-day free trial + up-to-$3,600
  credit surfaced on the announcement bar, homepage hero, service/combo heroes, `/free-audit`, and the popup.

### Visual design
- System is strong (~80/100); ceiling is **consistency (6)** — the homepage/header/footer are inline-styled
  hardcoded hex/px while inner pages use tokens + the layout toolkit; plus emoji icons and two sub-AA tokens.
  Fixed the contrast token; the rest is recommended (see §25).

### SEO / Schema / GEO
- Foundation is excellent (8.7). Fixed: removed invented `LocalBusiness priceRange:"$$"` (honesty), added
  `Article image`, gave the homepage a bespoke title/description. Recommended: de-duplicate the 58
  "in the GTA & Canada" titles + 45 combo descriptions; footer hub links; `/locations` ItemList.

### Content / E-E-A-T
- Unusually honest and well-governed (guardrails working; no fabrication found). Gaps are **verification debt**
  (blog bylines still `[VERIFY-client]`; aggregate-stat provenance inconsistent) and **thin real proof**
  (no named clients/reviews — deliberate honesty hold). Biggest honest E-E-A-T wins are **client-supplied**:
  founder headshots + LinkedIn, and ≥1 consented named testimonial.

### UX / Mobile / A11y / Perf
- Two **Critical a11y** items fixed: unlabeled `LeadForm` inputs → `aria-label`; no skip link → added.
  Contrast token darkened. Recommended: `next/image` wrapper (for when assets land), fire `track()` on CTA
  clicks (no tracking IDs added), phone/WhatsApp once the client supplies a real number.

---

## 4. Competitor & market research summary
Researched **SearchKings, Orcafy, BreezeMaxWeb** + WebFX (US reference) + Canadian PPC/SEO agencies.
**Category norms:** a *risk-reversal stack* (no contract + no setup fee + a starter credit/guarantee) is
table-stakes; the strong players **gate + qualify** their free audit (WebFX requires $1k+/mo; SearchKings gives
the audit its **own URL**); proof is stacked high with **one memorable number**; CTAs are "Get My Free Audit /
Book Free Consultation", not "Contact Us"; **3-field forms** and **one primary CTA per page** win.
**Where PPC Guru already leads:** AEO/schema depth, honest pricing explainer, calculators/benchmarks, short
form, programmatic coverage. **Gaps we closed this session:** hero prominence of our (stronger) risk-reversal
offer, a **dedicated gated `/free-audit` lander**, page-specific offers, in-place single-CTA capture.

---

## 5–6. Offers — recommended → implemented
| Offer | Status |
|---|---|
| 30-day free trial (Google/Meta — no contract/setup fee/upfront/obligation) | ✅ site-wide (announce bar, homepage hero, service/combo heroes, `/free-audit`, pricing FAQ, popup) |
| Free page-specific audit (per service + per service×industry) | ✅ `lib/data/service-offers.ts` → heroes, mid-page strip, lead bands, popup |
| Up to $3,600 Google Ads credit (was $600) | ✅ popup, Google Ads hero, `/free-audit`, offers.ts |
| Risk-reversal chips (no contract/setup fee/obligation/you keep your account) | ✅ heroes, lead bands, popup |
| Dedicated gated `/free-audit` landing page | ✅ built + wired (sitemap/footer/llms) |
| Spend-qualifier micro-question on the audit | ◻ recommended (WebFX pattern) |

---

## 7–20. What was implemented vs. left for manual review

**Implemented (this session, all build-green, honesty-safe):**
- Lead-gen: `service-offers.ts`; page-aware slide-in popup; convert-in-place floating CTA; in-place hero +
  mid-page + dashboard + included CTAs on service pages; per-industry offers on 45 combo pages; risk-reversal
  chips; page-specific lead bands; `/free-audit` lander.
- Trust/CRO: 30-day trial + $3,600 credit surfaced on announcement bar + homepage hero + pricing FAQ.
- Forms: `LeadForm` a11y labels, brand-lime button, focus ring, larger tap targets, "reply within one
  business day" note.
- SEO/Schema: removed invented `priceRange`; `Article image`; bespoke homepage title/description.
- A11y: skip-to-content link; darkened `--color-ink-faint` to WCAG-AA.

**Left for manual review / client to supply (documented, none block build):**
- **Client data:** real phone/WhatsApp (NAP) → click-to-call in header/footer; founder headshots + LinkedIn
  (`team.ts`); ≥1 consented **named** testimonial/case study; confirm the 8 blog bylines (strip `[VERIFY-client]`).
- **SEO polish:** de-duplicate the 58 "in the GTA & Canada" service/combo titles + 45 combo descriptions;
  `<html lang="en-CA">`; blog `dateModified` from a real `updated`; footer hub links (`/blog`,`/tools`,`/results`,
  `/about`) + `/locations` ItemList; sibling-combo + relevance-matched related-post links.
- **Design:** replace emoji icons with lucide/SVG glyphs; route homepage/footer CTAs through `<Button>`;
  reconcile "WhatsApp Us"/"Message us" copy drift; remove rogue blue in `layout.tsx` ACCENTS; consume the
  layout toolkit on the homepage. (All from the design overhaul's ~82/100 ceiling — code-doable, non-urgent.)
- **Content:** de-template the 13 service `definition` strings; add the "client-reported, blended" provenance
  to the homepage + About stat bands consistently; fix 2 orphan blog posts' internal links.
- **Perf/analytics:** `next/image` wrapper (for when real assets land); fire `track()` on header/footer/floating
  CTA + future tel/wa links (no tracking IDs added — that stays a manual, consent-gated step).
- **Imagery:** all hero/section art is still placeholder SVG — the real illustration/logo set is specified in
  `CREATIVE-BRIEF.md` (separate design-team hand-off).

---

## 21. Files changed (this session)
NEW: `lib/data/service-offers.ts`, `app/free-audit/page.tsx`, `WEBSITE_FULL_AUDIT_REPORT.md`,
`WORK_SESSION_LOG.md`.
EDIT: `lib/data/offers.ts`, `components/shared/offer-popup.tsx`, `components/shared/floating-cta.tsx`,
`components/shared/lead-form.tsx`, `components/sections/lead-band.tsx`, `app/services/[slug]/page.tsx`,
`app/services/[slug]/[industry]/page.tsx`, `app/pricing/page.tsx`, `app/page.tsx`,
`components/layout/announcement-bar.tsx`, `app/[city]/[service]/page.tsx`, `app/blog/[slug]/page.tsx`,
`app/layout.tsx`, `app/globals.css`, `app/sitemap.ts`, `components/layout/site-footer.tsx`, `public/llms.txt`.

## 22. Commands run · Build/lint/type/test
`npm run build` — **green** each commit (~151 routes prerendered). `npm run typecheck` — clean (build type-checks).
`npm run lint` — broken on Next 16 (documented; no separate lint gate). No test framework (build is the gate).

## 23. Blockers
None blocking. `send_later`/interactive approvals unavailable in this non-interactive session — relied on
push-triggered Vercel previews for CI (green). Real client assets (phone, headshots, named proof) block only
the E-E-A-T/NAP items, not the build.

## 24. Manual review items
See §7–20 "Left for manual review". Highest-value client actions: (1) confirm the offer copy on `/free-audit`
+ pricing reads exactly as intended; (2) supply phone/WhatsApp for click-to-call; (3) founder headshots +
LinkedIn + one named testimonial for E-E-A-T; (4) approve/adjust the trial disclaimers.

## 25. Next steps before merging
1. **Review PR** (`claude/lead-gen-conversion`) — walk the new `/free-audit`, a service page, a combo page,
   and the popup on desktop + mobile (390px).
2. **Confirm offer wording** (trial terms, "$3,600", risk-reversal) is exactly as the business wants.
3. **Swap client assets** (phone, founder photos/LinkedIn, named proof) — biggest remaining E-E-A-T + NAP lift.
4. **Optional follow-on batch (all recommended above):** title/description de-duplication at the 58-page scale,
   footer hub links, emoji→icon swap, `track()` on CTAs, `next/image` wrapper — a clean "SEO/consistency polish"
   PR once the lead-gen work is approved.

> Guardrails honoured throughout: no fabricated clients/reviews/awards/guarantees; client-directed numbers stay
> `[VERIFY-client]`; no changes to analytics IDs, pixels, env vars, forms' destinations, deployment or payment
> settings; nothing pushed to `main`.
