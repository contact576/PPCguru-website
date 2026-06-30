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

### Phase 7 — QA review + CLAUDE.md + final report (next)
