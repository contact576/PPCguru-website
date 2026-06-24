# PPC Guru — Master Website Build Prompt
*A complete, copy-paste brief for an elite design + engineering system. Hand this to your codegen/design tool verbatim.*

---

## 0. ROLE & MISSION

You are a **founding design engineer at a top 0.1% product studio** — the team brands like Linear, Stripe, Vercel, Ramp, and Figma hire when a website has to *feel* like the company is already winning. You have 15+ years across art direction, motion design, conversion strategy, front-end engineering, and SEO. You do not ship templates. Every decision is deliberate and defensible.

**Mission:** Design and build the complete marketing + lead-generation website for **PPC Guru**, a Google & Meta Partner performance-marketing agency. The result must read as the work of a large, senior, well-funded team — a site that could plausibly have cost **$100,000+** to produce. A first-time visitor (a skeptical business owner) should think *"these people are clearly the best at what they do"* within 3 seconds, and a designer should think *"I've never seen an agency site quite like this."*

**Non-negotiable quality bar:** distinctive (not a recognizable template), obsessively polished (optical alignment, consistent spacing rhythm, restrained shadows, crisp type), fast (Core Web Vitals green), fully responsive, accessible (WCAG 2.2 AA), and conversion-engineered. If any section looks "good enough / AI-default," redo it.

---

## 1. THE QUALITY BENCHMARK (what "$100k / multimillion-dollar" means here)

Calibrate against these references and **why** they're great — emulate the *principle*, never copy the design:

- **Linear / Vercel** — restraint, precision spacing, confident type scale, purposeful motion, dark/light interplay, zero clutter.
- **Stripe** — narrative scroll, layered depth, world-class diagrams/illustrations instead of stock photos, flawless responsive.
- **Figma** — editorial color-block storytelling, joyful but disciplined, bold display type.
- **KlientBoost / Directive / Disruptive** — pain-led PPC messaging ("stop wasting ad spend"), free-audit funnels, proof-driven, account-ownership trust.
- **Awwwards "Site of the Day" WebGL pieces** — a signature scroll-driven 3D moment that's *relevant to the subject*, not decoration.

**Acceptance heuristics (the site passes only if all are true):**
1. The hero communicates the core promise + has a memorable signature visual within one viewport.
2. No section feels empty, generic, or like filler; every block earns its space.
3. Type, spacing, color, and radius are consistent system-wide (one design language).
4. The 3D/scroll experience is smooth (60fps target) and degrades gracefully.
5. Mobile is as considered as desktop — no overflow, no cramped tap targets.
6. Lighthouse (mobile): Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95.
7. Nothing fabricated: no fake reviews, ratings, logos, or numbers (see §11).

---

## 2. BRAND FOUNDATION

- **Name:** PPC Guru (domain ppcguru.ca). **Base:** Brampton / Greater Toronto Area; serves Canada + USA.
- **Credentials:** Google Partner, Meta Business Partner (display as text/`[VERIFY]` until badge rights confirmed — never fake official badge art).
- **What they do:** Google Ads / PPC management (core), Meta Ads, SEO & Local Search, Landing Pages / CRO, Creative Production, CRM & Marketing Operations. AI-augmented execution, human-led strategy.
- **Positioning (one line):** *"Transparent Google Ads & PPC management that finds wasted spend, fixes tracking, improves landing pages, and scales only what's profitable."*
- **Core messages:** Stop wasting ad spend · See exactly where your money goes · Get a clear growth plan · Scale only what's profitable · You own your accounts, data, and reporting · No long-term lock-in.
- **ICP:** owner-operated & SMB local service businesses (physio/healthcare, dental, HVAC/plumbing/electrical, construction/renovation, roofing, immigration, real estate, professional services), plus regional B2B/ecommerce. They want booked jobs, qualified leads, and ROI — not vanity metrics.
- **Signature offer:** the **30-Day PPC Growth Sprint** (one-month trial; audit → fixes → roadmap; ad spend not included; honest scope).
- **Voice:** direct, confident, plain-spoken, outcome-led. Banned clichés: "take your business to the next level," "passionate," "360° solutions," "#1 agency," "guaranteed results," "explosive growth." Preferred verbs: find wasted spend, fix tracking, improve lead quality, scale what's profitable, own your data.
- **Mascot/logo:** a friendly "guru" in an orange/gold turban formed as a lightbulb + "PPC GURU.CA" wordmark (.CA in orange). Recreate faithfully as crisp SVG; provide a `/public/logo.svg` slot for the official file.

---

## 3. VISUAL DESIGN SYSTEM (the "face")

Direction: **premium light editorial meets performance-analytics dashboard.** White canvas interrupted by oversized pastel color-block "story" panels, punctuated by deep-navy data moments. Brand warmth from orange/gold. This is the chosen identity — execute it with precision; the boldness lives in the 3D signature and the data viz, everything else stays quiet and disciplined.

**Color tokens (hex):**
- Canvas `#ffffff`, soft band `#f7f7f5`, hairline `#e6e6e6`, visible border `#c4c4be`.
- Ink `#0a0a0a`, ink-dim `#3a3a36`, ink-faint `#76766f` (hierarchy via weight + tone, **never opacity-dimmed gray**).
- Brand: orange `#e8612a`, orange-deep `#d24e1d`, gold `#f4a100`.
- Pastel blocks: cream `#f4ecd6`, coral `#f6cdb8`, lime `#dceeb1`, lilac `#d8c8f6`, mint `#c8e6cd`, pink `#efd4d4`.
- Deep navy `#1f1d3d` (dashboards, CTA bands, the 3D panel) with light ink `#f4f3ff`.
- Performance semantics: ROI green `#1ea64a`, wasted-spend warning `#f97316`/`#ef4444`.

**Typography:** Display + body in **Inter** (or pair a characterful display like *Clash Display / Geist* with Inter body — pick one deliberate pairing, not defaults); **JetBrains Mono** for eyebrows, captions, and data labels. Set a real type scale: fluid display H1 `clamp(2.75rem, 6vw, 4.75rem)` weight 700, tight tracking (-0.03em); H2 ~`clamp(2rem,4vw,3rem)`; body 17–18px, line-height 1.6; mono eyebrows 13px, uppercase, +0.12em tracking, in orange. Headings are graphic; body is for reading.

**Layout:** max content width ~1320–1440px (use the width — no narrow columns), text blocks capped ~70ch. Card grids: 3-up desktop / 2 tablet / 1 mobile. 8px spacing base; section rhythm ~96–112px; consistent panel radius (24px panels, 32px reserved only for the hero, pill buttons 9999px). Generous-but-tight whitespace.

**Components:** pill buttons (primary = black, **accent = orange** for conversion CTAs, secondary = white + 1.5px visible border); hairline cards with one elevation level (soft shadow on hover only); mono eyebrow labels (single consistent spec); animated KPI counters; dashboard mockups; metric chips; marquee logo/partner strip; sticky-note style cards; FAQ accordions; multi-step forms.

**Imagery:** NO generic stock office photos, fake business people, or random AI-robot art. Use: branded **product/analytics dashboard mockups**, sample PPC audit-report visuals, CRM pipeline diagrams, SVG illustrations, platform badges, real team photos when available, and the 3D engine. Every visual reinforces "performance, transparency, data."

---

## 4. THE SIGNATURE 3D SCROLL EXPERIENCE (top → bottom)

This is the page's thesis and the one place to spend boldness. Build **"The PPC Growth Engine"** — a scroll-driven WebGL object that travels with the user from the top of the homepage to the bottom, narrating the transformation of wasted ad spend into booked revenue.

**Concept & scroll choreography (tie each stage to the section it sits beside):**
1. **Top / hero:** messy red-orange "ad-spend" particles pour into a leaking funnel; small leak labels — *bad keywords, poor tracking, weak landing page, irrelevant traffic*.
2. **Mid-upper:** PPC Guru "fixes the system" — particles organize into tidy keyword clusters, tracking lines connect, negative keywords visibly block waste; color shifts red→violet.
3. **Middle:** an optimization loop rotates — *Test → Measure → Optimize → Scale*.
4. **Lower:** qualified leads (gold particles) stream out the narrow neck and settle as "booked jobs" blocks / flow into CRM cards.
5. **Bottom:** a dashboard/ROAS graph rises as the funnel finishes filling; KPI counters climb.

**Engineering spec:** React Three Fiber + drei + three (`THREE.Points` + custom GLSL shader; a single `uFill`/progress uniform drives the fill). Sync via Lenis smooth-scroll + GSAP ScrollTrigger writing to a **mutable ref read inside `useFrame`** — never per-frame React state. Render it inside a **navy panel/stage** so additive particles pop on light pages. Lazy-load via `dynamic({ssr:false})` behind an AVIF/SVG poster (poster = LCP, not the canvas); mount only when in view AND GPU tier ≥ 1 AND not `prefers-reduced-motion`. Mobile/low-power/reduced-motion: show an animated SVG fallback telling the same story. Performance budget: 60fps desktop, clamp DPR [1,2], ≤ ~14k particles desktop / ≤ ~4k mobile, one draw call. The 3D must never block hero render or tank Core Web Vitals.

---

## 5. TECH STACK & ARCHITECTURE

- **Next.js (App Router) + React 19 + TypeScript**, **Tailwind CSS v4** (CSS-first `@theme` tokens; ⚠️ arbitrary CSS-var values must be `bg-[var(--token)]`, not `bg-[--token]`), **Motion** for UI animation, **GSAP + ScrollTrigger + Lenis** for scroll, **react-three-fiber/drei** for 3D, **next/font** (self-hosted) + **next/image**. Deploy on **Vercel**.
- **Data-driven, template-thin:** all repeatable content lives in typed data modules (`lib/data/*` and `lib/site-config.ts`) and is rendered by small page templates via `generateStaticParams`. Programmatic location pages (`/[city]/[service]`). Blog as local Markdown/MDX read at build.
- **Forms:** Server Actions + Zod validation + optional Resend email + Cloudflare Turnstile + honeypot; graceful no-backend fallback with clear `TODO` for CRM wiring.
- **AI features:** server-only (`@anthropic-ai/sdk`), graceful deterministic fallback when no API key.
- Reusable component layers: `components/ui/*` (primitives), `components/sections/*` (composable sections), `components/layout/*`, `components/three/*`.

---

## 6. FULL SITEMAP & PER-PAGE SPECS

Build all of the following. Word counts are content targets; every page ends with a strong CTA and uses the color-block rhythm. Mark any link without a live target as `TODO`.

**HOMEPAGE** (1,800–2,500 words) — section order:
announcement bar → sticky header → hero (3D + headline + dual CTA + trust chips) → platform/tools strip → non-numeric proof strip (or `[VERIFY]` real numbers) → 30-Day Growth Sprint (4-week breakdown) → PPC Waste Calculator → services overview → "Guru Growth Loop" process (Audit→Build→Optimize→Scale) → AI-Augmented Execution → "Typical Agency vs The PPC Guru Way" comparison → Transparent Reporting / dashboard → case-study preview → industries served → free-tools / ROI calculator teaser → pricing guidance → why PPC Guru → testimonials → FAQ (8–10) → final CTA → footer → floating audit CTA + exit/scroll offer popup.
Hero H1: **"Stop Wasting Ad Spend"** (or "Turn Ad Spend Into Qualified Leads & Revenue"). Subhead: PPC Guru audits, rebuilds, and manages Google Ads, Meta Ads, SEO, and landing pages so your budget turns into qualified leads, booked appointments, and measurable revenue. Primary CTA "Get Free PPC Audit", secondary "Try the ROI Calculator".

**SERVICES HUB** `/services/` (2,950–3,850w): hero → problem → services overview (6 cards: outcome + 3 deliverables + best-fit + link) → why it matters → results → industries → process → why us → credentials → testimonials → locations served → FAQ → CTA.

**GOOGLE ADS / PPC** `/services/google-ads/` (2,800–3,500w): hero → why Google Ads fails for most → what we manage → campaign types → tracking & conversion measurement → audit process → rebuild process → search-term waste → landing page/CRO → reporting dashboard → case studies → pricing/budget guidance → FAQ → CTA.

**SEO (Toronto)** `/services/seo-toronto/` (3,100–4,000w) — H1 "SEO Services in Toronto That Drive Real Organic Growth and Qualified Leads." Sub-service cards: Local SEO & GBP, Technical SEO, On-Page, Content Strategy, Link Building, AI/Generative-Engine Optimization. Include the 8 SEO FAQs (how long, cost, guarantees, local vs regular, measuring, why us, contracts, ranking in AI search).

**META ADS** `/services/meta-ads/` (2,500–3,200w): hero → why Meta ads fail → what we manage → creative testing system → audience strategy → lead-form vs landing-page → retargeting funnel → reporting → industry examples → pricing → FAQ → CTA.

**LANDING PAGE / CRO** `/services/landing-page-optimization/` (2,300–3,000w): hero → why clicks don't convert → audit checklist → offer/headline optimization → form optimization → speed & mobile UX → trust elements → A/B testing → before/after → FAQ → CTA.

**LOCAL SEO / GBP** `/services/local-seo/` (2,500–3,200w): hero → why local businesses don't rank in Maps → GBP optimization → citation/NAP consistency → local landing pages → review strategy → local link building → location grid → reporting → FAQ → CTA.

**CREATIVE PRODUCTION** & **CRM / MARKETING OPS** — structured service pages (hero → problem → what's included → process → deliverables → reporting → pricing guidance → FAQ → CTA).

**CASE STUDIES** index `/case-studies/` (1,200–1,800w) + individual pages (900–1,500w each): client type/location → problem → starting metrics → strategy → execution → results → what made the difference → dashboard screenshots → lessons → CTA. (Representative + clearly labeled until real, consented results exist — see §11.)

**INDUSTRIES** index `/industries/` (1,500–2,200w) + per-industry pages (1,800–2,800w): industry-specific hero → pain points → recommended platforms → campaign strategy → landing-page strategy → tracking requirements → proof → budget guidance → FAQ → CTA. Cover: physiotherapy, healthcare, dental, HVAC, plumbing, electrical, construction, roofing, immigration, real estate (+ expand as relevant). Use a meaningful per-industry icon (not decorative 01/02/03 numbers).

**FREE TOOLS** `/tools/`: Google Ads ROI calculator, Meta Ads ROI calculator, PPC Waste calculator, Instant AI Audit, AI Ad-Copy Generator. **PPC AUDIT landing** `/audit/` — highly conversion-focused.

**ABOUT** `/about/` (1,200–1,800w): who PPC Guru is → founders/team → how the agency works → why transparency matters → tools/platforms → credentials → client fit → CTA. **CONTACT** `/contact/` (multi-step qualification form + booking + email/WhatsApp). **BLOG/RESOURCES** hub + posts (long-form, SEO-driven). **LEGAL:** Privacy (PIPEDA), Terms, Disclaimer, Cookie policy (if pixels used). Custom **404**.

---

## 7. CONVERSION SYSTEM

- **Primary funnel:** Free PPC Waste Audit → 30-Day Growth Sprint → ongoing management. One repeated primary CTA ("Get Free PPC Audit") in sticky nav, after each major section, and a full-width pre-footer band.
- **30-Day Sprint** with explicit 4-week breakdown (Week 1 Audit & Tracking → Week 2 Waste Removal & Campaign Fixes → Week 3 Creative/Landing/CRO → Week 4 Scaling Plan & Reporting Dashboard) + honest terms (ad spend not included; scope confirmed after review; results vary).
- **PPC Waste Calculator** — inputs: industry, platform (Google/Meta/Both), monthly spend, avg CPC, conversion rate, lead-to-booking rate, avg customer value, current monthly leads, close rate. Outputs: estimated wasted spend, lost leads, missed revenue, tracking-risk score, landing-page-risk score, recommended first fix, audit priority. Label everything "directional estimate, not a guarantee."
- **ROI calculators** built on a **sourced benchmark dataset** (e.g., Google Search ~$5.26 avg CPC / ~6.7% CTR / ~7.5% CVR; HVAC ~$9–12 CPC; Meta lead-gen ~$22–30 CPL) with visible source + disclaimer; deterministic math, no AI.
- **Forms:** client-side validation, error/success/loading states, honeypot, consent copy, no broken submit.
- **Contact:** real phone + WhatsApp + email (or a "Book a call" CTA until verified). Floating audit CTA (desktop) + mobile sticky bar. One tasteful exit/scroll/30s popup, localStorage-gated, Esc/backdrop close.
- **Tracking event hooks** (no-op until IDs set, with `TODO` for GA4/GTM/Meta Pixel + consent): `cta_click, audit_form_start, audit_form_submit, trial_offer_click, calculator_complete, phone_click, whatsapp_click, service_card_click, case_study_click, pricing_cta_click, faq_open`.

---

## 8. AI FEATURES (honest, buildable)
- **Instant AI Audit:** user enters a URL → server fetches *real* signals (PageSpeed/Core Web Vitals, on-page tags, GA4/GTM/Ads/Meta pixel presence, schema, mobile viewport) → Claude writes a plain-English audit grounded strictly in measured facts. Graceful deterministic fallback without a key.
- **AI Ad-Copy Generator:** RSA-style headlines/descriptions within character limits; doubles as an email lead magnet.
- **Lead-qualifying chat assistant** (optional): scoped system prompt, structured lead capture, rate-limited, disclosed as AI.
- Honesty: disclose AI, never present AI/sample numbers as real client results.

---

## 9. SEO & SCHEMA
Per-page `<title>`/meta/canonical, OG + Twitter tags, one H1, logical H2/H3, descriptive alt text, internal linking. JSON-LD: Organization, LocalBusiness (only with verified address), Service (per service page), FAQPage, BreadcrumbList, Article (blog). **No Review/AggregateRating schema unless ratings are real.** Programmatic city×service pages with genuinely unique copy (not thin doorways). `sitemap.xml` + `robots.txt`.

## 10. PERFORMANCE, ACCESSIBILITY, RESPONSIVE (benchmarks)
- Lighthouse mobile: Perf ≥ 90, SEO ≥ 95, A11y ≥ 95, Best Practices ≥ 95. LCP < 2.5s, INP < 200ms, CLS < 0.1.
- 3D bundle out of first-load JS; lazy-load non-critical assets; optimized AVIF/WebP; no layout shift.
- WCAG 2.2 AA: semantic landmarks, keyboard-operable nav, visible focus rings on all interactive elements, modal focus trap + Esc, sufficient contrast, labels on every input, `prefers-reduced-motion` respected.
- Test breakpoints 360 / 480 / 768 / 1024 / 1440px; zero horizontal overflow.

## 11. CONTENT & COMPLIANCE RULES (do not violate)
Do **not** fabricate reviews, ratings, client logos, awards, testimonials, metrics, or guarantees. Where proof is missing, use realistic **representative** content **clearly labeled** and wrapped in `[VERIFY]` developer comments (e.g. `<!-- [VERIFY]: Replace with real, consented client result -->`). No placeholder phone numbers shown to users. No "guaranteed #1." Keep claims compliant (Canada Competition Act / FTC AI-washing). Ship a **pre-launch verification checklist** comment listing every item needing real data (phone, email, address, partner status, ratings, testimonials, case-study metrics, pricing, sprint terms, pixel IDs, cookie/consent).

## 12. MOTION & INTERACTION
Scroll-reveal sections (transform/opacity only), KPI count-ups, dashboard number transitions, hover micro-interactions, smooth anchor scrolling, the orchestrated 3D scroll sequence. Restraint: one signature moment, everything else calm. No shaking buttons, no aggressive popups, no jank on mobile, reduced-motion fallback everywhere.

## 13. DELIVERABLES & SELF-CRITIQUE LOOP
Produce the full working codebase (clean reusable components, no one giant file, proper TypeScript, no console errors, production build passes). **Critique your own work with screenshots** at desktop + mobile; fix invisible/empty/misaligned elements before declaring done. Provide: changed-files summary, how to run locally, remaining `[VERIFY]`/TODO items, and a Lighthouse pass.

## 14. ANTI-PATTERNS (instant fail)
Templated hero with a big number + gradient blob; stock office photos / fake people / robot mascots; narrow centered text columns with huge empty sides; faint low-contrast gray text; fake badge walls or star ratings; zero-value stat counters ("$0M+"); placeholder phone numbers; invisible white-on-white buttons; decorative numbered markers on non-sequential content; 3D that blocks load or breaks on mobile; any unverified claim presented as fact.

---

### FINAL INSTRUCTION
Plan the design first (palette, type pairing, layout concept, the one signature element), pressure-test it against §1 and §14, revise anything that reads as a default, then build to this brief exactly. The bar is simple: **it should look like the website of a company that has already won — and like no other agency site.**
