# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **PPC Guru**, an AI-first Google/Meta Partner performance-marketing agency (GTA /
Canada / USA). Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. It is both an **SEO surface**
(programmatic service/industry/location pages + blog) and a **lead-generation funnel** (gated calculators,
two-step pop-up, per-page contact bands). Deployed on Vercel; `main` is production (`vercel.json` pins Next.js).

> **Design state:** the **cream/lime/ink** light revamp is now **LIVE on `main` / production** (PR #7 merged
> Jun 2026). The original dark violet→cyan theme + Three.js hero is retired; some legacy files
> (`components/home/hero.tsx`, `components/home/ai-os.tsx`) may still exist unimported — grep for imports
> before assuming anything renders. New feature work: branch → PR → `main`.

## AEO/GEO, schema & content hubs (2026 — on branches `claude/relaxed-rubin-8h2lvp` + `claude/site-optimization-session`, not yet merged)

A 7-wave AEO/GEO/E-E-A-T overhaul + an optimization session took LLM-readiness from 49 → **93/100**. Durable rules:
- **One trust-number source:** `lib/data/performance-stats.ts` `trustFacts` ($100M+ managed · 1M+ leads ·
  6.3× ROAS · 500+ clients · 10+ yrs founder experience). `siteConfig.trust` holds only booleans + `serviceArea`
  — NEVER re-add numeric figures there (the old $10M+/4.2x/120k set was deleted; a divergent set tanks E-E-A-T).
- **AEO content layer (kept separate from core data so it's extendable):** `lib/data/service-content.ts`
  (answer-first service definitions + comparison rows), `industry-content.ts` (industry definitions),
  `service-faq.ts` + `industry-faq.ts` (**AUTO-GENERATED** 130 + 90 FAQs — regenerate from the content
  workflow, don't hand-edit), `service-industry.ts` + `service-industry-content.ts` (the 45
  "[service] for [industry]" combos), `service-stats.ts` (per-service stat bands), `comparisons.ts`
  (/compare), `glossary.ts` (/glossary). `getServiceContent`/`getIndustryContent` MERGE the hand-written
  + generated layers.
- **Schema (`lib/seo.ts`):** sitewide `graphSchema()` (Organization + WebSite in one `@graph`, rendered via
  `SiteGraphJsonLd` in layout); `personSchema()` (founders on /about + matched blog authors); `serviceSchema`
  carries `dateModified` (`CONTENT_UPDATED_ISO`); `faqSchema`/FAQPage on every Q&A surface; `DefinedTermSet`
  (/glossary); `Dataset` (/benchmarks); `itemListSchema` (hubs). Org `sameAs` filters placeholder roots.
  **Keep Review/AggregateRating OFF until verified** (honesty hold).
- **New routes:** `/benchmarks` (ungated sourced data + Dataset schema), `/compare`, `/glossary`, `/pricing`
  (explains fee models — NO invented prices), `app/services/[slug]/[industry]` (45 combo pages,
  `dynamicParams=false`), `app/opengraph-image.tsx` (dynamic OG card). `public/llms.txt` lists entity + key URLs.
- **AEO components:** `components/sections/service-aeo.tsx` (ServiceIntro, TrustBadgeBar, ServiceStatBand,
  ComparisonTable, CityCallout, LastReviewed) + `service-industry-accordion.tsx`. Comparison tables use
  `scope`/`<caption>`.
- **Review workflow:** branch → PR → human review → merge. The optimization session lives on
  `claude/site-optimization-session` (PR base = the AEO branch); progress in `OPTIMIZATION_LOG.md`. NEVER push
  to `main` without approval. After large content changes, re-run the AEO audit (a Workflow) to re-confirm the score.

## Lead-gen / conversion & animation layer (branch `claude/lead-gen-conversion`, PR #10 — stacks on the AEO + optimization branches, not yet merged)

A conversion + motion pass on top of the AEO/design work. Durable pieces:
- **Page-specific offers — single source `lib/data/service-offers.ts`:** per-service `{hook, subhook,
  popupTitle, popupBody, ctaLabel, formSource, trial, credit}` keyed by slug + `masterOffer` (the **30-day
  free trial** for Google/Meta ads, the free audit, up-to-**$3,600** Google Ads credit, risk-reversal chips).
  `offerForPath(pathname)` resolves the offer for a route (fallback `genericOffer`). CONFIRMED real / honesty-safe.
  The 30-day trial is scoped to `google-ads` + `meta-ads` ONLY; the $3,600 credit to `google-ads`.
- **`components/shared/hero-offer.tsx` `HeroOffer`** — the bold lime "⚡ 30-day free trial" banner in every hero
  (service template, 3 flagships, combo pages, homepage); non-trial services show a "Free audit" banner.
- **`components/shared/offer-popup.tsx` (rewritten, page-aware):** on **service pages** a **centre-screen modal
  ~4s after landing** with the page-specific catchy hook; a gentle bottom-right card elsewhere. Once per session
  (localStorage `ppcg_offer_done`), suppressed on `/contact`,`/results`,`/tools`, and **openable on demand by any
  CTA via the `window` event `ppcg:open-offer`**. (Replaced the old two-step $600 funnel.)
- **`components/shared/floating-cta.tsx`** converts IN PLACE — dispatches `ppcg:open-offer` (no navigation),
  shakes every ~4.5s (`ppcShake`), hides while the popup is open (`body[data-offer-open]`).
- **`/free-audit`** (`app/free-audit/page.tsx`) — dedicated gated audit lander (form high + 30-day-trial
  `StepFlow` + FAQPage). It's a static hub → wired into sitemap + footer + `llms.txt` per the hub rule.
- **`lib/data/offers.ts`** — the generic fallback popup copy: now **up to $3,600** credit + a `trial` object.
- **Calculator-high convention:** `EstimateBand` (the revenue calculator) sits **right after the stat band**
  (top ~25%) on service/industry/combo/flagship pages with a revenue-framed heading — it's the top hook. Keep
  it high when editing those templates.
- **Count-up animation:** `components/ui/stat-counter.tsx` `StatCounter` parses a stat string
  ("$65M+"/"6.8x"/"-42%") into a scroll-in count-up (built on `components/ui/counter.tsx`, reduced-motion safe),
  wired broadly (stat bands, proof stats, case metrics, report KPIs). `components/illustrations/dashboard-mock.tsx`
  is now a **client component** — numbers count up + the revenue line draws via `motion` `pathLength` on view.
- **Layout-variant toolkit `components/ui/layout.tsx`:** `BigQuote`, `AccentCard`, `SplitFeature`, `StepFlow`
  (connected timeline), `StatStrip`, `SealDivider` (the leak→sealed divider), `accentAt(i)` — use these to avoid
  box-grid monotony. `.hoverlift` (globals.css) adds lift+glow to inline-styled homepage cards.
- **Compact results:** `components/sections/case-study-cards.tsx` + the homepage cases are a horizontal-scroll
  strip of slim cards (count-up metric + before/after bar), not tall box grids. The homepage comparison table
  uses a dark header + lime "Guru" column + zebra rows for hierarchy.
- **Hero spacing:** `PageHero` + flagship heroes use `pt-24 pb-10 md:pt-28 md:pb-14` (reduced from `pt-40`) so
  the hero + first hook fit the first viewport — don't re-inflate it.
- **Design hand-off docs:** `DESIGN-HANDOFF.md` (modernization brief for a design agent + copy-paste image/logo
  generation prompts) + `CREATIVE-BRIEF.md` (~144 assets with exact `/public` paths + palette). All hero/section
  art is still **placeholder inline SVG** (`components/illustrations/hero-art.tsx`); `/public/images` is empty —
  real assets are the pending design-team job.
- **Trust numbers reconciled to `500+`** businesses (Google Ads alone is 500+); per-service figures in
  `lib/data/service-stats.ts`, all `[VERIFY-client]`.

## Commands

```bash
npm install
npm run dev        # local dev (http://localhost:3000)
npm run build      # PRIMARY validation gate — full type-check + prerenders ~150 routes
                   # (13 services + 45 service×industry combos + 15 industries + 30 location + hubs + blog)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

**No test framework** — `npm run build` is the gate; run it after non-trivial changes. **`npm run lint`
is broken** (Next 16 removed `next lint`; the script errors with "Invalid project directory"). Rely on the
build's type-checking instead.

## Architecture

### Content is data-driven; pages are thin templates
Edit the typed data modules, not the JSX. Pages render via `generateStaticParams`.
- `lib/site-config.ts` — brand, NAP, trust numbers, `trustLine`, CTAs, AND the dropdown-aware `nav` model.
- `lib/data/services.ts` (13: 6 original + 7 ad/AI/CRO), `industries.ts` (15), `locations.ts` (10 cities × 3),
  `case-studies.ts` (6), `testimonials.ts`, `company.ts`, `home.ts` (homepage arrays).
- `lib/data/benchmarks.ts` — the calculator engine (see below).
- `lib/data/themes.ts` — `getAccent(slug)` + `accentTint()`: per-vertical accent colors.
- `lib/data/logos.ts` — `stackGroups` (the merged tools/platforms/credentials section), `logosByGroup`,
  client/credential logos (text-pill fallback; drop real assets in `/public`, set `src`).
- `lib/data/tools.ts` — free-tools registry consumed by BOTH `app/tools/page.tsx` AND `app/sitemap.ts`
  (add a tool here or it drops from the sitemap).
- `lib/data/performance-stats.ts` — `performanceStats` (rendered as a 3-up **agency_aggregate** band on the
  homepage: $100M+ managed · 1M+ leads · 6.3x ROAS; the `founder_experience` rows power the About page) +
  `heroSampleModel` (one consistent set of hero numbers). Client-directed figures — keep them consistent.
- `lib/data/team.ts` — team roster for the About "Meet the team" section (`components/sections/team.tsx`);
  the two real founders are seeded, it scales to N (headshot-or-monogram, focus chips, optional LinkedIn).
  Only add **real** people.
- `lib/data/offers.ts` — GENERIC fallback pop-up copy (up-to-$3,600 credit, free audit, 30-day trial).
  Page-specific offers now live in `lib/data/service-offers.ts` (see the Lead-gen/conversion section).
- `content/blog/*.md` — posts read at build by `lib/blog.ts`.
- **AEO content layer** (`service-content.ts`, `industry-content.ts`, `service-faq.ts`, `industry-faq.ts`,
  `service-industry.ts` + `service-industry-content.ts`, `service-stats.ts`, `comparisons.ts`, `glossary.ts`)
  — detailed in the **AEO/GEO, schema & content hubs** section above. `getServiceContent`/`getIndustryContent`
  MERGE these with the base `services.ts`/`industries.ts`, so a service page's real content is spread across both.

### Calculator / benchmark engine (`lib/data/benchmarks.ts`)
Deterministic math, no AI. **Separable model**: `industryEconomics` (~36 verticals: avgTicket, closeRate,
baseSearchCpc, baseCvr, …) × `PLATFORMS` (~10 `PlatformModel`s: cpcMultiplier, ctr, cvrMultiplier, intent).
`resolveCell(econ, platform)` derives the effective `{cpc, ctr, cvr}` (real sourced rows preserved via
`overrides`). `projectFunnel({budget, platform, industrySlug, …})` is the current function — returns the
full funnel (clicks→leads→qualifiedLeads→bookedCalls→customers→revenue) with low/mid/high ranges + CPL/CAC/
ROAS. The legacy `projectResults`/`industryBenchmarks`/`type Platform` remain as compat shims — prefer
`projectFunnel`. **Industry AND platform must change outputs** (this was a fixed defect; don't regress it).
Shared UI: `components/tools/ad-calculator.tsx` (`platform?`, `defaultIndustry?` props), embedded per-page
via `components/sections/estimate-band.tsx`.

### Lead capture & gating (first-class — every page is a conversion point)
- `app/actions/lead.ts` `captureLead` — Zod + honeypot + optional Resend (logs without a key); the one
  action behind all lead forms. `app/contact/actions.ts` is the separate full contact form.
- `components/shared/lead-form.tsx` — the shared form (name/email/phone). Reused by:
  `offer-popup.tsx` (page-aware; centre modal ~4s on service pages, mounted in `app/layout.tsx` — see the
  Lead-gen/conversion section), `components/shared/hero-offer.tsx` `HeroOffer` (the bold hero offer banner),
  `components/shared/lead-cta.tsx` `LeadCtaButton` (button that opens an in-place popup — used across service
  heroes/CTAs), `components/sections/lead-band.tsx` (per-page contact band, page-specific copy), and
  `components/tools/result-gate.tsx` (`ResultGate` blurs the value half of tool results until a lead submits).

### Anti-spam (four layers — every form, not just /contact)
Inbound form spam was flooding the team inboxes; `captureLead` AND `submitContact` now run the same gauntlet
**before** any Supabase write or email send. Order matters: nothing spammy may reach
`sendLeadAutoresponder`, which would otherwise mail a *forged* address from our domain and burn sender
reputation.
1. **Honeypot** — `company_website` (lead) / `website` (contact), must be empty.
2. **Per-IP rate limit** (`lib/rate-limit.ts` via `headers()`): 5 leads / 4 contacts per IP per 10 min.
3. **Cloudflare Turnstile** (`lib/turnstile.ts` `verifyTurnstile`) — the "I'm not a robot" check. Verifies
   with `remoteip` bound so tokens can't be resold/replayed. **Fail-closed once configured, no-op until
   then** (both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` must be set — with only one the
   widget never renders, so requiring a token would block every real visitor). Fails **open** if Cloudflare
   itself is unreachable — an outage there must not eat real leads.
4. **Heuristics** (`lib/spam-filter.ts` `scoreSubmission`) — additive score vs `SPAM_THRESHOLD`; catches the
   SEO/backlink pitches, link-drops, casino/crypto spam and sub-2.5s bot submits. This is the ONLY active
   filter while the Turnstile keys are blank, and the backstop against solved-for-hire challenges after.

- **Bot submissions are dropped SILENTLY** (returned as `ok: true`) so a bot can't probe what tripped the
  filter. Drops are `console.warn`ed (`[spam] blocked …`) so they stay auditable in Vercel logs.
- **`components/shared/turnstile-field.tsx` `<TurnstileField />`** is the one client widget — drop it in any
  form above the submit button. It posts hidden `turnstileToken` + `renderedAt` (the time-trap stamp) and
  needs no other wiring. It uses **explicit** rendering, not the `cf-turnstile` auto-scan class: our forms
  mount inside modals/pop-ups and several can share a page, and auto-scan only sweeps the DOM once at script
  load. Turnstile tokens are **single-use** — pass a `resetKey` that changes on a rejected submit, or the
  retry fails with a spent token. `onToken` is for forms that build `FormData` by hand (`home/audit-form.tsx`).
- **Tuning is false-positive-averse** — a blocked plumber costs a client, a leaked spam email costs an inbox.
  Signals that a real visitor could plausibly trip (stale timestamp, disposable domain, one URL in the
  message) score *below* the threshold and need corroboration. Run **`npm run check:spam`**
  (`scripts/spam-filter-check.mts`, 16 cases, no framework needed) after touching any rule, and add a case.

### Routing & page templates
- `app/[city]/[service]/` — programmatic location pages from `allLocationParams()`, `dynamicParams = false`.
- Service (`app/services/[slug]`) & industry (`app/industries/[slug]`) pages render guarded deep sections
  when the data is present (`components/sections/service-deep.tsx`: AuditChecklist, AiAutomation,
  OptimizationCadence, Timeline30Day, ToolStack; `industry-deep.tsx`: IndustryReality, IndustryPlaybook,
  IndustryHacks, IndustryPlan90). All deep fields on the `Service`/`Industry`/`CaseStudy` types are
  **optional** — keep them optional so existing entries don't break the build.
- **Flagship pages** (`components/flagship/*`): bespoke layouts rendered via a conditional early-return in
  the `[slug]` templates for `physiotherapy`, `real-estate` (industry) and `google-ads` (service).
- **Per-vertical theming**: `PageHero` takes an `accent` prop (hero wash + top rule + glow); the parametric
  `IndustryArt`/`CityServiceArt` take `accent`. Pages pass `getAccent(slug)`. Accents are a secondary layer —
  the cream/lime/ink system stays primary.
- **AEO routes** (see the AEO/GEO section): `app/services/[slug]/[industry]` (45 combos, `dynamicParams=false`,
  params from `allServiceIndustryPairs()`), plus static hubs `/benchmarks` `/compare` `/glossary` `/pricing` and
  `app/opengraph-image.tsx`. A new static hub must be added to `app/sitemap.ts` `staticRoutes`, the footer, and
  `public/llms.txt` — none of those are auto-discovered from the filesystem.
- SEO: `buildMetadata()` + JSON-LD builders in `lib/seo.ts` via `components/seo/json-ld.tsx`;
  `app/sitemap.ts` + `app/robots.ts` enumerate routes. `robots.ts` explicitly allows AI crawlers (GPTBot,
  PerplexityBot, ClaudeBot, Google-Extended, …).

### Results / case studies
`app/results/[slug]/page.tsx` renders storytelling sections from optional `CaseStudy` fields
(`executiveSummary`, `beforeAfter`, `roiProgression`, `keyDecisions`, `keyTakeaways`) using SVG visuals in
`components/sections/case-study-visuals.tsx` (`BeforeAfter`, `RoiTrend`).

### AI tools (graceful, server-only)
`app/api/instant-audit/route.ts` (real on-page signals + Claude narrative) and `app/api/ad-copy/route.ts`
via `lib/ai/anthropic.ts` — both **fall back to deterministic output when `ANTHROPIC_API_KEY` is absent**.

### Homepage (`app/page.tsx`, ~540 lines inline + `lib/data/home.ts`)
2D illustrated `HeroDashboard` (numbers from `heroSampleModel`), `WasteCalculator` (engine-wired),
`ToolsOs` (merged platforms/tools/AI/credentials — replaced the old `AiOs` + credentials block),
`TestimonialCarousel` (Marquee, monogram avatars), two-column `FaqList`, `AuditForm`.

### Reusable UI
- `components/ui/*` — `Button`, `Section` (tonal `tone` system), `Reveal`, `Counter`, `Eyebrow`/`Badge`,
  and `interactive.tsx` (`CursorGlow` trailing cursor, `Magnetic`, `SpotlightCard` — all degrade on touch /
  reduced-motion). Styled with `cva` + `cn()` (`lib/utils.ts`).
  - **Scroll-reveal has two mechanisms — both fail-safe:** the homepage uses inline `[data-reveal]` +
    `components/home/reveal-init.tsx` (IntersectionObserver, 2.5s blanket fallback); inner pages use the
    `Reveal` motion component (`whileInView` + a 2.2s mount fallback so a section can never stay `opacity:0`).
    If you add reveal-based content, keep a fallback — stuck-hidden sections read as "broken."
- Global chrome mounted in `app/layout.tsx`: `AnnouncementBar`, `SiteHeader`, `SiteFooter`, `FloatingCta`,
  `OfferPopup` (page-aware: centre modal ~4s on service pages / bottom-right card elsewhere; suppressed on
  `/contact`,`/results`,`/tools/*`; once per session; openable via the `ppcg:open-offer` event), `CookieConsent`.
- `components/sections/*` — shared blocks (service-proof, estimate-band, lead-band, faq-accordion,
  service-deep, industry-deep, case-study-visuals, cta-block, service-grid, industry-grid, …).
- `components/illustrations/*` — bespoke SVG hero art + `dashboard-mock.tsx` (a sample dashboard whose every
  number derives from one spend input via the calculator math, labelled "Sample" — never hand-fudge it).
- `components/reactbits/*` + `components/magicui/*` — vendored effects (e.g. `Marquee`), edited in place.
  Animation uses **`motion`** (not `framer-motion`).
- **Signature motif — "the leak, sealed":** the `Eyebrow` (`components/ui/badge.tsx`) leads every section
  label with the dashed-coral-leak → ink-node → olive→lime SVG mark. Keep it; don't add competing flourishes.

## Conventions & gotchas
- **Tailwind v4, no config file.** Tokens live in `app/globals.css` `@theme`; reference as arbitrary values
  (`text-[--color-ink-dim]`). Light cream base; `--color-lime` signature fill, `--color-ink` text,
  `--color-coral` = "waste/leak" accent only. **Legacy:** `--color-violet*`/`--color-cyan*` are remapped to
  olive — don't "fix" them to purple/blue. `body { overflow-x: hidden }` already contains decorative-blob
  spill; mobile is a hard requirement — use Tailwind breakpoints, never `window.innerWidth` (SSR).
- **Typefaces** (`app/layout.tsx`): Archivo (display/body), DM Serif Display (italic emphasis), JetBrains Mono.
- **lucide-react ships NO brand icons** — Instagram/LinkedIn/Facebook (use `components/shared/social-icons.tsx`)
  AND `Linkedin`/`Youtube`/`Music2` don't exist either; use generic glyphs (Briefcase/Play/Video) for the
  new service icons. A bad brand-icon import fails the build.
- **React pinned to 19.2.0** (`@react-three/fiber` v9 needs `<19.3`), even though the 3D hero is dormant.
- **Honesty / FTC:** the client confirmed the founder + aggregate trust stats as **real** (publish them).
  But do **NOT** fabricate named third-party reviews or named case-study clients — testimonials stay
  editable/representative; case studies stay anonymized + disclosed (`REPRESENTATIVE_DISCLOSURE`). Sample
  dashboards/benchmarks are labelled and math-consistent, never guarantees. `CONTENT-TODO.md` + `[VERIFY]`
  markers list what to swap before launch.
- Env vars (`ANTHROPIC_API_KEY`, `RESEND_API_KEY`, Turnstile, …) are all optional; everything degrades gracefully.

## Git / deploy
`main` is production (Vercel auto-deploys it). The revamp (PR #7, branch `claude/revamp`) is **merged**.
Feature work: branch → PR → `main`; each PR push builds a Vercel **preview**, merging to `main` deploys
**production** (`https://pp-cguru-website.vercel.app`, Vercel team `dhaval-patel`).

- **⚠ Vercel blocks a production build when the tip commit's author email isn't matched to a GitHub
  account.** A GitHub UI "merge" can author the merge commit with an unverified email (e.g.
  `contact@ppcguru.ca`) → deployment shows **"Deployment Blocked – commit email could not be matched."**
  Fix: ensure the tip commit is authored with a GitHub-verified email (the account's
  `…@users.noreply.github.com` always matches), then push — Vercel rebuilds. (`noreply@anthropic.com`
  commits built every preview, so re-tipping `main` with one is a quick unblock.)
- The repo lives at `contact576/PPCguru-website`; the Vercel project is under team `dhaval-patel`. If a
  push doesn't deploy, check **Vercel → Settings → Git → Production Branch = `main`** and the Deployments
  tab for a Blocked/Error status.
- Audit docs in repo root: `WEBSITE-AUDIT.md` (page-by-page trust/credibility audit + fixes, all shipped)
  and `ENTERPRISE-AUDIT.md` (enterprise-B2B readiness audit + ranked plan). `CONTENT-TODO.md` lists the
  real assets still to swap in (phone/WhatsApp, founder photos, named client proof, GA4/Pixel/Resend keys).
