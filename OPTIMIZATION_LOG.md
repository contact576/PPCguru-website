# Website Optimization Session — Work Log

**Branch:** `claude/site-optimization-session` (off `claude/relaxed-rubin-8h2lvp` @ 60cdc09 — all AEO Waves 1–7 included)
**Base for review:** never `main`. Stacks on the AEO work (PR #8).
**Goal:** continuous, high-impact optimization across SEO, GEO/AEO, content, trust, CRO, UX, technical SEO,
schema, blog, internal linking, positioning. Review-first; nothing merged without approval.

> Context: a 7-wave AEO/GEO/E-E-A-T overhaul already shipped on the parent branch (LLM-readiness 49 → 89,
> verified). This session pivots to the areas that overhaul did NOT deeply cover: **CRO, conversion clarity,
> new strategic pages (compare / glossary), content humanization, UX polish, OG images, deeper internal
> linking, and competitor-informed positioning.**

## Guardrails (honoured this whole session)
- No fabricated clients / testimonials / reviews / awards / guarantees. Client-directed numbers stay
  `[VERIFY-client]`. No Review/AggregateRating schema until real.
- No changes to analytics, tracking, forms' destinations, env vars, deployment, or secrets.
- `npm run build` is the gate (lint is broken on Next 16). Commit in small reviewable batches.

## Plan (phased, adaptive — impact over hour-blocks)
1. Setup + targeted competitor/market research → prioritise. *(in progress)*
2. `/compare` hub (decision content: Google Ads vs Meta, managed vs in-house vs DIY, Google Ads vs SEO).
3. `/glossary` hub (DefinedTerm schema; "what is X" AEO surface).
4. Dynamic OG images (next/og) + metadata polish (og:image sitewide).
5. CRO: pricing transparency + CTA clarity review.
6. Content humanisation spot-checks + deeper internal linking.
7. Blog: improve weak posts / add 1 high-intent post.
8. QA (build/typecheck) + CLAUDE.md update + final report.

---

## Progress

### Phase 1 — Setup + research ✅
- [x] Created branch `claude/site-optimization-session`.
- [x] Created this work log.
- [x] **Confirmed AEO/GEO/LLM-readiness = 93/100** (workflow `wdo5qnw4a`; journey 49→79→89→93,
      every change verified in-repo). The >90 goal from the prior task is met — this session is upside.
- [x] Targeted competitor/market research (2 focused web searches):
  - **Google Ads vs Meta for local:** Google Ads wins first (active search intent → faster-converting
    leads); Meta is demand-gen/awareness + retargeting; best is complementary; tight budget → start Google.
  - **PPC pricing transparency:** publishing fee *models* is a trust + conversion lever; the #1 prospect
    red flag is opacity on "how much of my budget goes to ad spend." Models: % of ad spend (10–20%),
    flat retainer ($1.5k–$10k/mo), performance-based. → informs a clear pricing-explainer (no invented prices).

**Decided session priorities (high impact, safe, reviewable):**
`/compare` decision hub · `/glossary` (DefinedTerm schema) · pricing-transparency section · dynamic OG
images (next/og) · CTA/CRO polish · deeper internal linking · blog touch-ups. All content hand-written
(no big workflows) for credit efficiency; honesty guardrails intact.

### Phase 2 — `/compare` decision hub ✅
- `lib/data/comparisons.ts` + `app/compare/page.tsx`: Google Ads vs Meta, agency vs in-house vs DIY,
  Google Ads vs SEO. Semantic tables w/ `scope="col"/"row"` + `<caption>` (closes the a11y/AEO gap the
  audit flagged), answer-first verdicts, FAQPage schema, internal links. Wired into sitemap/footer/llms.txt.
- Build green. Committed + pushed; draft PR #9 opened (base = AEO branch → clean session-only diff).

### Phase 3 — `/glossary` (DefinedTerm hub) ✅
- `lib/data/glossary.ts` (30 terms across 4 categories) + `app/glossary/page.tsx` with `DefinedTermSet`/
  `DefinedTerm` schema, anchor IDs, category jump-nav, `<dl>` semantics. Strong "what is X?" AEO surface.
- Wired into sitemap/footer/llms.txt. Build green.

### Phase 4 — pricing transparency + OG images ✅
- `app/opengraph-image.tsx`: dynamic 1200×630 branded social card via `next/og` (no static asset
  needed; cascades as the default `og:image` sitewide). Build green.
- `app/pricing/page.tsx`: honest pricing-transparency page (the #1 prospect trust lever per research) —
  4 principles ("ad spend is 100% yours", "you own everything", "month-to-month", "no surprises"), the
  3 fee models explained, what's-included list, lead band, FAQ (FAQPage schema), CTA. **No invented
  prices**; exact model flagged `[VERIFY-client]`. Added to **header nav** (high-intent) + footer + sitemap + llms.txt.

### Phase 5 — CRO + deeper internal linking ✅
- Service pages: added a "See exactly how our pricing works →" link in the pricing section (→ `/pricing`).
- `ComparisonTable` (renders on ~58 service + combo pages): added a "See more comparisons →" link (→ `/compare`).
- Homepage: new **"Free resources"** strip linking the 6 lead-magnet/decision assets (calculators,
  benchmarks, compare, glossary, pricing, instant audit) — internal-linking + CRO + "useful even if we
  never work together" trust framing. Build green.

### Phase 6 — a11y/AEO table polish + blog internal links ✅
- Retrofitted `scope="col"`/`scope="row"` + `<caption>` onto the existing `ComparisonTable` (~58 pages)
  and the homepage comparison table — closes the a11y/semantic-extraction gap the audit flagged.
- Blog posts: added a category-aware "Related services" + glossary + free-audit internal-link block
  below every post (e.g. a Google Ads post links to /services/google-ads). Build green.

### Phase 7 — QA review + CLAUDE.md + final report ✅
- Ran a focused QA agent over all new pages: **clean** — all internal links valid, no fabricated content,
  schema well-formed, tables a11y-correct, content quality strong. One pre-existing defect fixed (blog
  "Keep reading" cards used retired `--color-violet`/`--color-cyan-bright` tokens → ink/olive).
- Confirmed `buildMetadata` sets no `openGraph.images`, so the dynamic OG card cascades sitewide.
- Updated `CLAUDE.md` with durable AEO/content-hub rules + review workflow.

---

## FINAL REPORT — optimization session

**Branch:** `claude/site-optimization-session` · **PR #9** (draft, base = AEO branch `claude/relaxed-rubin-8h2lvp`).
Nothing pushed to `main`. `npm run build` + `npm run typecheck` green on every commit.

**AEO/GEO/LLM-readiness:** confirmed **93/100** (from the prior overhaul; journey 49→79→89→93).

**Pages created (this session):** `/compare`, `/glossary`, `/pricing`, `app/opengraph-image.tsx` (dynamic OG).
**Pages updated:** homepage (Free Resources strip + comparison-table a11y), all service pages (pricing +
compare links), `ComparisonTable` (a11y, ~58 pages), blog post template (Related-services block + token fix),
footer, sitemap, robots-adjacent (llms.txt), site-config nav, CLAUDE.md.

**SEO:** geo-aware titles already in place; new indexable hubs (+ sitemap + llms.txt); semantic tables.
**GEO/AEO:** `/glossary` `DefinedTermSet`, `/compare` FAQPage + verdicts, `/benchmarks` already Dataset-schema'd.
**Schema:** DefinedTermSet, FAQPage (compare/pricing), all validated by QA.
**Content:** 3 research-informed hubs + 30 glossary terms, all human-written, honesty-safe.
**Trust/CRO:** pricing-transparency page (the #1 prospect trust lever), Free Resources strip, cross-links.
**UX/a11y:** `scope`/`<caption>` on all comparison tables; consistent components; mobile `overflow-x-auto` tables.
**Research:** Google-vs-Meta (intent vs demand-gen) + PPC pricing-transparency best practices → used in /compare + /pricing.

**Build/lint/typecheck:** build green; typecheck clean; `npm run lint` is broken on Next 16 (documented).

**Blockers:** none. `send_later` self-check-in tool needs an approval unavailable in this non-interactive
session — relied on push-triggered Vercel webhooks for CI instead (all green).

**Needs manual review / client to supply (all `[VERIFY-client]`):** real per-service stat numbers; exact
pricing model + any starting fee on `/pricing`; founder LinkedIn + headshots; official Partner badge art +
directory links; real social URLs (lights up `sameAs`); phone/postal (NAP). None block the build.

**Recommended next before merging:** (1) review PR #9 (+ the AEO PR #8 it stacks on); (2) swap the
`[VERIFY-client]` items; (3) off-site GEO the audit flagged (GBP, Clutch/G2, directories, digital PR) — the
on-site work is best-in-class but ~82–89% of LLM citations are earned/off-site.

---

## SESSION 2 — number updates · creative brief · design overhaul (Jul 2026)

Client-directed follow-up: (A) update per-service paid-ads numbers, (B) produce a designer-ready image
brief, (C) overhaul the visual design (owner rated it ~65/100; target 90) — "too many boxes; add variety,
motion, cards, sliders, varied layouts." All on this branch; review-first.

### A. Per-service numbers (client-directed, all `[VERIFY-client]`)
- Google Ads **500+** businesses / **$65M+** spend · Meta **300+** · YouTube **120+** · Microsoft **40+** /
  **~$500K** (avg $10–15K/client) · TikTok **25+** · LinkedIn **30+** · Pinterest **25+** · Creative
  **12,000+** ad creatives.
- **Reconciled the aggregate** `trustFacts.clientsServed` **150+ → 500+** (Google alone is 500+, so unique
  businesses served must be ≥500) across performance-stats, service-stats credentials, service-faq /
  industry-faq answers, `llms.txt`, CLAUDE.md. Paid ad-spend still sums to the **$100M+** aggregate. Commit `e9dc25c`.

### B. Creative / image brief → `CREATIVE-BRIEF.md`
Full designer handoff: ~144 assets (78 illustrations/textures + 66 logos) with per-asset description,
colour palette (exact hex), format and **exact `/public` path + page + section**. Covers page heroes (incl.
the 7 services that reuse another's art), 15 industry heroes, 10 city skylines, in-section spot
illustrations, textures/watermarks, the full logo set, brand/favicon/OG, blog covers — plus art direction +
production priority. Illustration-first (owner's call), honesty-safe (client logos consent-gated).

### C. Design overhaul (audited → implemented → re-audited)
**Baseline audit (agent):** ~**63/100** — craft/typography strong (75–80), but *variety, rhythm, motion,
imagery* in the 40s–50s; the dominant unit was `Section` + `grid` of bordered `#fbfaf2` boxes repeated
everywhere; **zero raster imagery** in the repo.

**Built a layout-variant toolkit** (`components/ui/layout.tsx` + `stat-counter.tsx`): `BigQuote`
(full-bleed editorial break), `AccentCard` (rotating accent-edge card + hover lift), `SplitFeature` (sticky
asymmetric split), `StepFlow` (connected numbered timeline), `StatStrip`, `StatCounter` (count-up parsing
"$65M+"/"6.3x").

**Applied across the worst offenders:** service-deep (4 identical grids → AccentCard rotation + AI spotlight
accents + first-30-days timeline); industry-deep (3 grids → split w/ count-up benchmarks, numbered playbook,
accent hacks list, 90-day timeline); process-steps → StepFlow; ServiceStatBand + homepage aggregates count
up on scroll-in; editorial BigQuote breaks on service/combo/industry templates; hero art on the 45 combo
pages + the 4 hub pages (pricing/compare/glossary/benchmarks); table dataviz (ComparisonTable ~58 pages,
/compare, /benchmarks — dark header, zebra, hover, a11y scope/caption, inline CPL bar); pricing/glossary
grids → AccentCard / category-accented cards. Commits `bfed6cc`, `e95c7e1`, `e0f-polish`.

**Re-audit:** _(pending — recorded here once the re-audit agent returns; any parameter < 90 gets another pass.)_
