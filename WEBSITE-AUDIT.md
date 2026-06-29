# PPC Guru — Full Website Audit

**Method:** Five senior auditors reviewed the site page-by-page on the live `claude/revamp`
build, each playing two roles at once — a **20+ year web designer/developer** and a **first-time
prospective client** (a business owner shopping cold for a marketing agency). Every page was
viewed rendered at **desktop (1280px) and mobile (390px)**, forms/tools/calculators were actually
used, and the source/content was cross-checked. Scope: homepage + global chrome, all services, all
industries, locations, free tools, results/case studies, about, contact, blog, legal.

> Scoring is out of 100. **Trust** = "do I believe this company is real, honest, and safe to hand
> money to?" **Credibility** = "does the content prove they're genuinely expert and effective?"

---

## Executive summary

The site is **well-built, modern, and honestly framed** — strong information architecture, a real
benchmark/calculator engine, genuine channel and vertical expertise, labelled sample data, and a
founder story that's checkable in principle. As a *craft* exercise it's well above the typical
agency template.

What holds it back is **not design — it's three things a sharp buyer notices immediately:**
1. **Internal "work-in-progress" notes are leaking onto public pages** (multiple "verify before
   launch / replace before launch / starting template" disclaimers, and dev copy like "API key").
   These are the single loudest "this site is unfinished / this is fake" signals, and they
   currently ship to every visitor.
2. **An arrival pop-up covers the content on essentially every page** — including landing *on top of
   the contact form*, the one page whose entire job is form completion.
3. **Depth and proof are uneven** — 11 of 15 industries and all 30 location pages are thin/templated,
   the homepage hides the *real* aggregate stats while showing an implausible calculator result, and
   there's no verifiable named proof (no photos, no named clients, no phone number).

Fix the leaked disclaimers + pop-up behaviour first (cheap, high-impact, mostly P0), then close the
content-depth and proof gaps. None of the core architecture needs rebuilding.

### Scorecard

| Area | Trust /100 | Credibility /100 |
|------|:---:|:---:|
| Homepage & global chrome | 62 | 58 |
| Services | 72 | 76 |
| Industries | 70 | 66 |
| Locations | 58 | 45 |
| Free tools | 80 | 76 |
| Results / case studies | 68 | 74 |
| About / Contact | 66 | 70 |
| **Overall (buyer-journey weighted)** | **≈66** | **≈64** |

**The verdict in one line:** a genuinely good website wearing its dev notes in public and leading with
its weakest proof — a few days of focused cleanup would move both scores into the high-70s/80s.

---

## Master fix list (cross-cutting, prioritized)

### P0 — do before anyone else sees the site
1. **Remove every internal/dev disclaimer that renders to visitors.** Found in 5 places:
   - Homepage Case Studies chip: "⚠ Verify before launch · replace with real approved client case studies" (`app/page.tsx` ~line 364)
   - Homepage Testimonials chip: "⚠ Representative · replace before launch" (`app/page.tsx` ~line 450; helper ~line 36)
   - About: "Team photos & additional team members to be added. Verify founder bio details before launch." (`app/about/page.tsx` ~line 117)
   - Privacy: "provided as a starting template… reviewed by qualified legal counsel" (`app/privacy/page.tsx` ~line 46)
   - Terms: same (`app/terms/page.tsx` ~line 41)
   - Tools footer: "AI tools run on Claude and work best with an API key configured — see setup notes" (`app/tools/page.tsx`)
   Keep quiet "Representative" labels where appropriate; delete the warnings.
2. **Stop the arrival pop-up from covering content.** Gate it by pathname in `app/layout.tsx` so it
   never fires on `/contact` or `/results` (and ideally any `/tools/*`), delay it elsewhere to ≥15s
   or deeper scroll, disable the early exit-intent, and ensure the dismissal-armed `$600` slide-in
   **never captures clicks** on a page's primary form. (`components/shared/offer-popup.tsx`)
3. **Fix deceptive/empty trust surfaces.**
   - Footer "Brands we work with" lists named businesses (BrightSmile Dental, Apex Renovations,
     Maple Immigration, Skyline Realty, PureForm Med Spa, FitHouse Studios) as if real clients —
     conflicts with the no-fabricated-clients rule. Relabel ("Industries we serve") or use real,
     permissioned logos. (`site-footer.tsx`)
   - "WhatsApp" buttons (header, footer, final CTA) link to `/contact`, not WhatsApp — relabel
     "Message us" or wire the real number.
4. **De-doorway the location pages + close the worst of the industry depth cliff.** 30 location pages
   share byte-identical bodies (only ~20 words unique per city); 11/15 industries are thin. At
   minimum add genuinely local body copy + a local disclaimer on location proof stats, and populate
   the deep fields for the highest-value thin industries (law-firms, med-spa, immigration, roofing,
   construction). (`lib/data/locations.ts`, `lib/data/industries.ts` — both data-only, sections are
   already guarded.)

### P1 — do before promoting the site
5. **Wire CTAs to real destinations.** Homepage Services "Learn more →" and Case "View →" both
   dead-end at `/#audit` instead of `/services/[slug]` and `/results/[slug]`. Hurts SEO and stops
   serious buyers going deep. (`app/page.tsx` ~lines 216, 389; homepage service cards.)
6. **Surface the real aggregate stats + tone down the waste calculator.** The real, client-confirmed
   numbers ($10M+ managed, 120,000+ leads, 4.2x avg ROAS, 35+ clients, 1,000+ accounts) never appear
   on the homepage; meanwhile the waste calculator shows ~$34K/mo revenue lift from "+7 leads" on a
   $4K budget. Add a stats band near the Proof section; recalibrate the calculator's "missed
   revenue / lift" so outputs stay defensible vs spend. (`lib/data/benchmarks.ts`, homepage Proof.)
7. **Add a real phone + WhatsApp (and a booking calendar) to Contact.** Service-business buyers
   expect to call; the page promises a "strategy call" with no way to book. Populate
   `siteConfig.contact.phone/whatsapp`; embed a calendar.
8. **Fix the dental case-study data contradiction.** `beforeAfter` says "Calls tracked 0% → 100%"
   while `secondaryMetrics` says "62% of calls now tracked" — same page, two numbers disagree. One
   visible contradiction undermines a metrics-led agency. (`lib/data/case-studies.ts`, dental entry.)
9. **Push the per-vertical accent into the body, not just the hero.** On thin pages the accent only
   colours the hero (and the index grids aren't tinted at all), so pages snap back to lime/olive
   below the fold. Consume `--accent`/`--accent-strong` in deep-section cards, process numbers,
   cadence bullets and icon tiles; tint index icon tiles with `getAccent(slug)`.
10. **Add a pricing/engagement signal.** Two of three pricing tiers say "Custom/Custom" with no
    anchor; services/industries pages have none. Add "from $X/mo" or "% of spend" ranges.
11. **Fix the AI ad-copy fallback output.** Without an API key (likely also in prod) the fallback
    renders truncated mid-word headlines/descriptions. Rewrite `fallbackCopy` to respect word
    boundaries and the 30/90 char limits. (`app/api/ad-copy/route.ts`)

### P2 — polish
12. Cut homepage and service-page length/repetition (3× "how we work" blocks on home; ~20k-px-tall
    service pages; merge process / cadence / 30-day / deliverables). Tone down the "leak/waste"
    motif (used 4+ times) and the floating-pill infinite shake.
13. Add human faces & verifiable identity — founder headshots + LinkedIn on About, a named author
    byline on the blog, ideally one named/consented case study or short client video.
14. De-duplicate near-identical offerings: `web-design` vs `cro-landing-pages` (services), and the
    Lead-Quality calculator (same component as the ad calculators).
15. Resolve brand geography: positioning says "GTA / Canada / USA" but all 10 location cities are
    Ontario — add real coverage or scope the claim.
16. Smaller items: reposition floating CTA so it doesn't overlap result tiles (ROAS calc); switch
    the Contact submit button off the legacy violet→cyan gradient; raise the FAQ floor to 3–4 per
    industry; add a cookie-consent banner (the privacy policy describes cookies/pixels); group the
    14-item Services dropdown.

---

# Detailed page-by-page findings

The five sections below are the auditors' full reports, lightly formatted.

## 1. Homepage & Global Chrome

*Reviewed live at 1280px and 390px; cross-referenced against `app/page.tsx`, `lib/data/home.ts`, `lib/data/performance-stats.ts`, `lib/site-config.ts`, and the chrome components.*

### Global chrome

**Announcement bar** — Lime bar: "30-Day PPC Growth Sprint — now open / You own your accounts · No lock-in / Claim trial". Good: leads with two real differentiators. Bad: "now open" implies a deadline that doesn't exist; this is the third lime CTA stacked in the top-right (banner-blindness).

**Sticky header + dropdown nav** — Clean, professional, accessible (focus-within dropdowns, Esc, aria-haspopup). Bad: the Services dropdown has 14 items (overwhelming — group or trim to 6 + "All services"); the **"WhatsApp" button links to `/contact`, not WhatsApp** (number is blank) — a button labelled WhatsApp that doesn't open WhatsApp frustrates a busy buyer; logo is text-only (no wordmark) for a company selling creative.

**Mobile hamburger menu** — Big tap targets, accordions work, looks great at 390px. Bad: expanding Services pushes everything below the fold; no tap-to-call/WhatsApp CTA in the mobile menu — a phone-first local buyer expects one.

**Footer** — Strong IA and link coverage. Bad (credibility): "Brands we work with" lists named businesses (BrightSmile Dental, Apex Renovations, Maple Immigration, Skyline Realty, PureForm Med Spa, FitHouse Studios) as text — unlike the case studies/testimonials these are NOT labelled representative, so they read as real named clients (violates the no-fabricated-clients rule). "WhatsApp us" and "Book a call" both go to `/contact`; no real phone/address. "Cookies" links to `/privacy`; no consent banner exists.

**Two-step offer pop-up** — Well-built (session-capped, Esc/backdrop close, bottom-sheet on mobile, honest fine print). Bad: fires almost immediately and covers the hero before the visitor reads the value prop (45% scroll triggers early on a long page; exit-intent fires on any upward exit). Delay to ≥15s/deeper scroll; never before the hero is read.

**Floating "Free PPC Audit" pill** — Persistent conversion path, on-brand. Bad: the infinite shake reads gimmicky/desperate to a serious buyer; on mobile it competes with the $600 slide-in in the same corner.

### Homepage — section by section

1. **Hero** — Strong message-match (pain-led H1 "Stop *wasting* ad spend" + outcome subcopy), partner proof above the fold, math-consistent dashboard honestly labelled "Sample · illustrative". Bad: eyebrow "Toronto's AI-first Google Ads agency" under-sells scope (Brampton-based, Canada+USA, full-funnel) and is geographically loose; two competing low-commitment CTAs, no "book a call" for a ready buyer; a lot of stacked motion.
2. **Lime ticker** — Scannable scope; pure decoration adding more motion under an already-busy hero.
3. **Proof ("Proof we can show before you book a call")** — Smartly reframes proof as deliverables-you-get-upfront; the 4 trust chips are the strongest specific signals. Bad: it's "proof" with zero actual proof (no stats/logos/results). MISSING: the real aggregate stats ($10M+ managed, 120k+ leads, 4.2x ROAS, 35+ clients) exist in data but never render anywhere on the homepage — a major omission.
4. **30-Day Sprint** — De-risks the decision; honest disclaimers. Bad: no price/terms — free or paid? A buyer can't tell.
5. **Waste Calculator** — Genuinely interactive and engine-wired; disclaimer present. Bad (credibility): math reads exaggerated — HVAC/Google/$4,000 spend shows Wasted $280, Missed Revenue $43,372, Lift/mo $33,884 from "+7 leads." ~$34K/mo lift on a $4K budget is not believable even with the disclaimer.
6. **Services (8 cards)** — Outcome-led copy, consistent. Bad: every "Learn more →" links to `/#audit`, not the real service pages (which exist) — wastes SEO and frustrates researchers; homepage shows 8 services but nav lists 13.
7. **Growth Loop** — Clean methodology; generic; "more tests than a traditional agency" is unquantified.
8. **AI-augmented / Human-led** — Directly answers the "AI on autopilot" fear; reassuring and specific. Overlaps the Growth Loop and Tools/OS — three "how we work" blocks in a row.
9. **Tools/OS** — Merged platforms/tools/AI/credentials; credentials honestly status-tagged. Verify it renders content on cold load (appeared near-empty in one pass — likely a scroll/animation artifact).
10. **Comparison (Typical agency vs the Guru way)** — Effective, scannable positioning; one of the most persuasive blocks. Strawman framing is a tired trope but works.
11. **Reporting ("No black box")** — Labelled "Sample," visually credible, internally consistent (148 booked, 4.8x match the hero). Two faux-dashboards (hero + this) start to feel like "all mockups, no real screenshots" — one real anonymized report would beat two samples.
12. **Case Studies** — Specific, varied, plausible metrics, honest "Representative · Anonymized." Bad: a loud orange chip "⚠ Verify before launch · replace with real approved client case studies" renders to visitors (loudest "this is fake" signal on the site); "View →" links to `/#audit` not `/results/[slug]`.
13. **Industries (12 tiles)** — Correctly linked (unlike Services/Cases); good niche positioning.
14. **Pricing** — Honest about variability; free audit is a great entry rung. Bad: two of three tiers say "Custom" with no anchor — mid/large buyers self-qualify on price; zero numbers = more friction.
15. **Testimonials** — Specific, on-message quotes; representative is acceptable when labelled. Bad: same visible "⚠ Representative · replace before launch" dev chip; anonymous "Owner, HVAC" attribution carries little weight.
16. **FAQ** — Excellent; answers the real objections (ownership, AI meaning, contracts, partner status). The most trust-building copy on the page.
17. **Audit form** — Strong closing offer; reassurances exactly right.
18. **Final CTA** — Punchy close. Bad: "WhatsApp Us" → `/contact` again; "Find the leaks" is the 4th use of the leak/waste motif.

**Cross-cutting:** very long (~18 sections, redundancy among the 3 "how we work" blocks and 2 dashboards); nearly every CTA routes to `/#audit`; leak/waste motif fatigue; **trust signals are inverted** — real stats hidden, dev warning chips + fabricated-looking footer brands visible. Mobile is otherwise excellent.

**TRUST: 62/100 · CREDIBILITY: 58/100**

**Top fixes:** (P0) remove visitor-facing verify chips; (P0) fix footer brand names + dead WhatsApp; (P1) surface real stats + tame the calculator; (P1) wire CTAs to real pages; (P2) delay pop-up, remove pill shake, add price anchors, trim dropdown/sections.

---

## 2. Services

*Index, the Google Ads flagship, and the standard template across SEO/Meta/LinkedIn/TikTok/AI-Automation/CRO (+ skims of the rest). All 13 services are fully populated — none thin.*

**Services index** — Clean, confident; "one accountable team" is a real differentiator; cards link correctly. Bad: all 13 use the same black icon tile (no per-vertical accent on the index — grid feels flat; cheapest fix is to tint each tile with `getAccent(slug)`); the 3 `featured` services render identically to the rest (no hierarchy); no pricing signal.

**Flagship — /services/google-ads** — The best service page on the site: distinct blue hero, math-consistent DashboardMock, a bespoke "Anatomy of a rebuilt account" POV, concrete operational detail (tCPA/tROAS, offline-conversion import), honest ranges (−30–45% wasted spend, 2–3x leads "as bidding matures"), real tool stack (Optmyzr, Adalysis, Supermetrics). Bad: the global arrival modal auto-fires over the hero on load; hero proof-stat labels are tiny (9.5px); below the bespoke top it converges into the same deep sections as every page, so the "flagship" feel fades.

**Standard template (all other services)** — Genuinely differentiated *copy* per channel (LinkedIn leads with cost-per-qualified-lead; Microsoft with "import + adapt Google"; honest "we'll tell you if TikTok fits before you spend"). Per-vertical accents are visible and distinct in the hero (SEO green, Meta/LinkedIn blue, Pinterest red, TikTok teal). Bad:
- **Accent is only skin-deep** — washes the hero/pills/emphasis words, but the entire body (audit cards, cadence, deliverables, process) stays cream/lime/ink, so below the hero SEO and Pinterest look identical.
- **Too long & repetitive** — the SEO page is ~20,000px tall on mobile (~14 stacked sections); AuditChecklist + 30-day timeline + cadence + deliverables + platforms + process say "what we do" ~4 ways. Time-poor owners bounce before the CTA. Collapse into one "how we work" block or accordions.
- Generic section labels repeat verbatim across all 13 pages ("Before we touch a dollar," "No set-and-forget").
- Near-duplicate services: `web-design` vs `cro-landing-pages` share proofStats/deliverables/FAQs — confusing.
- Calculator semantics: on non-paid services (SEO/CRM/AI/CRO) it still runs a paid-CPC funnel and cites only Google/Meta ad sources — modelling SEO "potential" via paid CPC is conceptually off; a sharp buyer may catch it.

**Calculator UX (tested):** works correctly — industry AND budget AND platform all change output (e.g. 310→570 leads, 9→18 booked); gating is reasonable (top-of-funnel free, only revenue/ROAS/CAC gated, unlocks site-wide once a lead submits). One friction: with the arrival popup + in-calc gate + LeadBand + CTA, that's four lead asks per page.

**MISSING (every standard page):** pricing / "typical investment" range; one concrete named/dated proof on-page; on-page team/credential signal; a "which channel first?" comparison.

**TRUST: 72/100 · CREDIBILITY: 76/100**

**Top fixes:** (P0) stop the arrival popup auto-firing on service pages; (P0) cut length/kill repetition; (P1) push accent into the body + tint index tiles; (P1) add a pricing signal; (P2) merge web-design/CRO + fix the non-paid calculator semantics.

---

## 3. Industries

*Index, both flagships (physiotherapy, real-estate), deep templates (dental, hvac) and thin templates (law-firms, med-spa, plumbing, professional-services), desktop + mobile.*

**The depth cliff (biggest finding):** the 15 industries split into two tiers by which optional data fields are populated.
- **Deep** (reality + benchmarks + playbook + hacks + plan90): physiotherapy, dental, hvac (+ the 2 flagships).
- **Thin** (only painPoints/approach + 1–2 FAQs): the other 11 — healthcare-clinics, plumbing, electrical, construction-renovation, roofing, immigration, **law-firms**, home-improvement, fitness-gyms, **med-spa**, professional-services. These render pain/approach → 3 service cards → calculator → FAQ → CTA and nothing else.
Two-thirds of industries — including high-value, competitive categories — are markedly thinner than the showcase verticals, while the index promises "vertical-specific playbooks… the industry we know best."

**Index** — Strong promise, all 15 cards link correctly, partner badges. Bad: the promise is only delivered on 4/15 pages; no per-vertical accent on the index; no grouping/filtering for 15 items; no signal distinguishing the deep/flagship verticals.

**Flagship — Physiotherapy** — Excellent and clearly bespoke (green hero, booking-calendar mock, condition pills, full deep stack). Bad: the hero "Sample" card hardcodes Booked/wk 34, Cost/booking $122, Show rate 92% — static, not derived from the engine like the rest of the site's samples; 92% show rate is optimistic/unsourced.

**Flagship — Real Estate** — Strong bespoke hero (teal, "What's my home worth?" valuation mock, Sellers/Buyers funnels). Bad: despite being a flagship it has **no playbook/hacks/plan90 in data**, so the body is thin after the funnels — a great hero on a thin body; hero hardcodes Cost/lead $14, LP conv 11%, Leads/mo 127 (aggressive, static); only 1 FAQ.

**Dental (deep)** — Convincing, specific (implants/Invisalign/emergency, call tracking as primary conversion), blue accent throughout, dental-specific calculator math (CPC $6.82, 4.9x ROAS, $244 CAC). Minor: benchmark case value $1,000–6,000+ vs calculator default $1,200; only 2 FAQs.

**HVAC (deep)** — Mirrors dental's depth (seasonal pacing, speed-to-lead, CPC $9.68, $300–8,000+ job value). Strong; same 2-FAQ thinness.

**Law Firms (thin)** — High-stakes, expensive category gets pain/approach → 3 services → calc → 1 FAQ. No reality/benchmarks/playbook/hacks/plan90. The intended purple accent only colours the hero because no deep sections render to carry it below the fold — reads less "purple" than dental reads "blue." Calculator does work (CPL $126, 5.5x ROAS), which partly rescues it.

**Med Spa (thin)** — Aesthetics is creative-driven yet gets the generic thin template; the pink/mauve hero IS the most clearly "own-colour" of the thin pages, but no before/after, no creative showcase. Ironic for the vertical where creative is the whole pitch.

**Plumbing / Professional-Services (thin)** — Render correctly, calculator works, but generic; professional-services reads especially generic.

**Per-vertical theming verdict:** the accent system is real and distinct on deep pages (dental blue, med-spa pink, physio/RE greens), but on thin pages it only colours the hero — so distinctiveness correlates with depth, compounding the two-tier problem.

**Calculator verdict:** genuinely good — every slug exists in the engine, pre-selects the page's industry, and outputs differ sensibly (dental $244 CAC/4.9x; law $633 CAC/5.5x; med-spa $262 CAC/4.6x). Low/mid/high ranges add credibility.

**Other:** the arrival popup auto-fires over the hero on every industry page; the case-study cards appearing blank in screenshots is a Reveal scroll-animation artifact, not a bug.

**TRUST: 70/100 · CREDIBILITY: 66/100**

**Top fixes:** (P0) populate deep fields for the 11 thin industries, high-value first (law, med-spa, immigration, roofing, construction); (P0/P1) make flagship hero "Sample" cards math-consistent; (P1) give both flagships the full deep stack; (P1) defer the popup off the hero; (P2) raise FAQ floor to 3–4 + add index grouping/signal.

---

## 4. Locations & Free Tools

**Locations index** — Clean, fast, mobile-perfect; 10 city cards each deep-linking to 3 services (good internal linking); honest GTA+Ontario scope. Bad: all 10 cities are Ontario, but the brand says "GTA / Canada / USA" — a US prospect sees zero US coverage; blurbs are generic; the map art says "Live now" implying real-time activity it can't back.

**City×service pages (30 combos) — the core risk:** they look polished and ship correct LocalBusiness + breadcrumb schema, real per-vertical theming, and a real neighbourhoods sidebar (5 per city). **But each city contributes only ~120 chars (~20 words) of unique copy** — the 4-step process, outcomes, proof stats, and the entire FAQ are pulled from shared service data and are byte-for-byte identical across all 10 cities for a given service. This is a textbook **doorway-page pattern** (Google Helpful-Content risk) and a "this is auto-generated" tell to any prospect comparing two cities. The "How we run [service] in [city]" heading promises localization the body never delivers; representative proof stats read as *local* results without a local disclaimer.

**Tools index** — Appealing ("free, no sign-up walls"), relevant set, single source of truth shared with the sitemap. Bad: the "no sign-up walls" promise conflicts with the three gated calculators; **dev-facing copy is public** ("AI tools run on Claude and work best with an API key configured — see setup notes"); two cards are effectively the same component.

**Each tool:**
- **ROAS Calculator** — Best/most trustworthy: correct math, fully ungated, live status verdict. Minor: floating "FREE PPC AUDIT" tab overlaps the result tile.
- **Google/Meta Ads ROI Calculators** — Solid engine (`projectFunnel`), industry/budget/platform all change output, sources + disclaimer shown. Revenue/ROAS/CAC are lead-gated (the part the prospect came for) — defensible but contradicts "no walls."
- **Lead Quality Calculator** — Renders the same AdCalculator as the others — redundant; give it a distinct lead-scoring UI or merge.
- **UTM Builder** — Works correctly; verified it preserves existing query params + fragment and overwrites only utm_* keys; copy-to-clipboard works. Minor: spaces → `+` (no slug normalization); no base-URL validation.
- **Instant AI Website Audit** — The standout: audits real on-page signals (HTTPS, title, meta, single H1, viewport, schema, GA/Ads/Pixel tags, form, TTFB), honest fallback label, forbids inventing ad-account metrics, graceful error handling. Bad: the arrival popup covers the entire tool on first load; "<1200ms" measures TTFB not Core Web Vitals.
- **AI Ad Copy Generator** — Honest labelling, per-line copy buttons, compliance-aware prompt. **Real defect:** the no-API-key fallback output is visibly low quality — headlines truncated to fit 30 chars ("Get Furnace tune-ups and AC...") and descriptions cut mid-word ("…delivers fast,"). Since there's likely no key in prod, this ugly fallback is what most users see.

**LOCATIONS — TRUST: 58 · CREDIBILITY: 45**  ·  **TOOLS — TRUST: 80 · CREDIBILITY: 76**

**Top fixes:** (P0) de-doorway the location pages (real local body content + local disclaimer; expand unique copy well beyond 20 words); (P0) fix the AI ad-copy fallback + remove "API key/setup notes" copy + reconcile "no walls"; (P1) stop the popup covering tool pages; (P1) resolve the location/brand geography mismatch + de-dupe the Lead-Quality calc; (P2) floating-CTA overlap + UTM ergonomics.

---

## 5. Results, About, Contact, Blog & Legal

**Critical cross-page finding:** the arrival pop-up fires as a full-screen modal on **/results** (over the hero) and on **/contact** — where it lands **directly on top of the contact form** and repeatedly intercepts clicks on the real submit button. The page built to capture leads is physically blocked by a competing lead form. Suppress the arrival modal on `/contact` and `/results`, and never let the slide-in capture clicks on a page's primary form.

**Results index** — Strong, outcome-framed; 6 metric cards read like real proof; disclosure present but unobtrusive; good vertical spread. Bad: popup over the hero; cards show only a number + label (no "from X to Y in N months" context); no filtering; the aggregate StatBand sits above anonymized cards with no bridge. MISSING: even one named/consented case study or a short client video would do more than all six anonymized cards.

**Case studies (all 6 verified):** the strongest content on the site — real storytelling arcs (problem → decisions → outcome → lessons), large legible visuals, and **internally consistent math** (physio −42% = $210→$122; HVAC −33% = $96→$64, 2.1x→4.8x ROAS; reno CPQ $320→$198; immigration −47% = $78→$41; real-estate $14 CPL, 31→127 leads). **⚠ One real data bug — Dental:** `beforeAfter` says "Calls tracked 0% → 100%" but `secondaryMetrics` says "62% of calls now tracked" — same page, contradictory. Fix in `lib/data/case-studies.ts`.

**About** — Credible and senior: **named real founders** (Jaydeep Patel — Founder/CEO; Dhaval Patel — Co-founder) with a concrete, checkable story (Google-trained, 1,000+ accounts, $20M+ portfolio), partner/BBB badges, honest principles ("no guaranteed-#1 promises"). Bad: a visible build-state disclaimer ships to visitors — "Team photos & additional team members to be added. Verify founder bio details before launch."; founders are monogram initials, not photos (the page admits it); no LinkedIn links + placeholder social URLs, so a buyer can't verify the people. MISSING: founder headshots + LinkedIn, a real office/team photo, named/linked certifications.

**Contact** — Form is thorough and tested working: empty submit fires correct field-level validation; valid submit renders a clean success state and resets; honeypot + optional Turnstile; graceful no-Resend fallback. Bad: the popup blocks the form (above); **no phone number anywhere** (blank by design) — service-business buyers expect to call; no embedded calendar despite promising a "strategy call"; submit button still uses the legacy violet→cyan gradient (inconsistent); address is "Greater Toronto Area" with no real address/map.

**Blog** — Genuinely useful, SEO-smart content with excellent internal linking; renders well on mobile. Bad: all posts authored by generic "PPC Guru" (no human byline/photo/bio) — same credibility gap as About; no related-posts, no share buttons, no visible publish date on the post body.

**Legal** — Appropriately scoped PIPEDA-aware Privacy + Terms; the "no guarantee of results" and "calculators are illustrative" clauses correctly backstop the claims. Bad: **both pages render a visible disclaimer** — "provided as a starting template and should be reviewed by qualified legal counsel before launch." A buyer reading the fine print sees the company admit its own legal pages are unfinished. Also no cookie-consent banner despite the policy describing cookies/pixels.

**RESULTS — TRUST: 68 · CREDIBILITY: 74**  ·  **ABOUT/CONTACT — TRUST: 66 · CREDIBILITY: 70**

**Top fixes:** (P0) stop the popup sabotaging /contact and /results; (P0) remove leaked internal disclaimers (About line ~117, Privacy ~46, Terms ~41); (P1) fix the dental number contradiction; (P1) add real phone + WhatsApp + a booking calendar to Contact; (P2) add founder headshots + LinkedIn, a named blog author, and switch the Contact button off the legacy gradient.
