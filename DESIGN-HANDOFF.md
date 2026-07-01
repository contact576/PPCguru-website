# PPC Guru — Design Modernization Handoff (prompt for Claude Design / a design agent)

> **How to use this file:** paste the whole thing into Claude Design (or your design agent) as the brief.
> It gives the full context, the guardrails, the freedom, and — in the appendices — copy-paste **image/logo
> generation prompts** for Nano Banana ("BananaPro") / ChatGPT / Higgs Field. Companion files in the repo:
> `CREATIVE-BRIEF.md` (the full asset list with exact `/public` paths + palette) and
> `WEBSITE_FULL_AUDIT_REPORT.md` (a scored audit). Read those two first.

---

## 1. Your mission
You are the senior design lead for **PPC Guru**, an AI-first Google/Meta performance-marketing agency (GTA /
Canada / USA). The site is **already strong on content, SEO/AEO (LLM-readiness 93/100), and lead-gen
plumbing** — your job is to **modernize the look, theme, layout, imagery and motion** so it feels *premium,
distinctive, and current* (think Linear / Stripe / Ramp / Vercel-grade polish), **without breaking the
conversion machine or the data architecture underneath.** You have real freedom to restructure section
layouts and refresh the visual system — but stay inside the guardrails in §5.

Target outcome: a visitor landing on any page instantly feels *"this is a sharp, modern, trustworthy agency,"*
understands the value in seconds, and has an obvious next step (audit / free trial / book a call).

## 2. Tech context (so your changes are implementable)
- **Next.js 16 (App Router) · React 19.2 (pinned) · TypeScript · Tailwind v4 (CSS-first, no config).**
  Design tokens live in `app/globals.css` `@theme` (referenced as arbitrary values, e.g. `text-[var(--color-ink)]`).
- **Content is data-driven:** typed modules in `lib/data/*` feed *thin* page templates via `generateStaticParams`.
  **Edit the data or the shared components, not one-off JSX.** ~150 routes prerender.
- **Motion:** the `motion` package (framer-motion) is installed. Reusable primitives already exist in
  `components/ui/interactive.tsx` (`CursorGlow`, `Magnetic`, `SpotlightCard`), `components/ui/reveal.tsx`
  (`Reveal`), `components/ui/counter.tsx` + `stat-counter.tsx` (count-up), and `components/ui/layout.tsx`
  (`BigQuote`, `AccentCard`, `SplitFeature`, `StepFlow`, `StatStrip`, `SealDivider`). **Reuse and extend these.**
- **Validation gate:** `npm run build` (type-checks + prerenders everything). `npm run lint` is broken on Next
  16 — rely on the build. Work on a **branch → PR → review**, never push to `main`.

## 3. Current design system (the starting point — evolve it, don't discard the identity)
- **Palette (cream/lime/ink):** cream base `#f1efe3`, ink text `#14170e`, **lime `#ceff3a`** (signature
  energy/CTA), olive accents `#6f7d22`/`#5f6f17`, **coral `#f26a2b` = "waste/leak" only**, dark panels on ink.
- **Type:** Archivo (display, `.head` — 900 uppercase, tight tracking), DM Serif Display (italic emphasis via
  `.text-gradient`), JetBrains Mono (eyebrows/labels).
- **Signature motif — "the leak, sealed":** a dashed-coral leak resolving into a solid-lime sealed node
  (the `Eyebrow` mark in `components/ui/badge.tsx`, the `SealDivider`). Keep this identity thread.
- **Recently shipped (don't redo; build on it):** an AEO/GEO overhaul; a lead-gen offer system (30-day free
  trial + free audit + up-to-$3,600 Google Ads credit, page-specific popups, `/free-audit` lander); a
  layout-variant toolkit; and an animation pass (count-up numbers, an animated performance dashboard, a
  centre-screen offer popup, compact swipeable case strips, a scannable comparison table).

## 4. What we want you to improve (the brief)
Prioritized. Feel free to propose more.
1. **A modern theme refresh.** Keep cream/lime/ink as the DNA but push it to feel *2026-modern*: consider a
   refined type scale, more confident spacing rhythm, softer/2-layer shadows, subtle glassmorphism on chrome,
   a richer dark-section treatment, tasteful gradients/mesh backgrounds (kept on-brand), and a crisper grid.
   Deliver it as **updated `@theme` tokens + shared components**, so it cascades sitewide.
2. **Real imagery + illustration** (biggest visible lift). Today all hero/section art is placeholder inline
   SVG; `/public/images` is empty. Produce the asset set in `CREATIVE-BRIEF.md` (page heroes, 15 industry
   heroes, 10 city skylines, in-section spot art, textures, blog covers) + the **logo set** (the platform/tool
   wall currently renders text pills). Use the generation prompts in **Appendix A**. Style = flat editorial
   illustration, **not** stock photos.
3. **Layout restructure where it helps.** You may re-architect section order/layouts (esp. the homepage and
   the long service template) for better rhythm, scannability and conversion — as long as the conversion
   elements in §5 survive and it stays mobile-short.
4. **Motion & interactivity.** Extend the existing motion system: scroll-linked reveals, tasteful parallax,
   hover/cursor reactivity on more surfaces, animated data viz. Everything must respect
   `prefers-reduced-motion` and degrade on touch (patterns already exist in `interactive.tsx`).
5. **Componentry polish.** Tabs, sliders/carousels, sticky-scroll storytelling, better cards — replace any
   remaining plain bordered-box grids with varied, intentional layouts.

## 5. Guardrails — DO NOT BREAK THESE
- **Conversion system stays intact & prominent:** the offer system (`lib/data/service-offers.ts`,
  `hero-offer.tsx`, `offer-popup.tsx`, `floating-cta.tsx`, `lead-band.tsx`, `lead-form.tsx`, `lead-cta.tsx`),
  the per-page **revenue calculator** (`estimate-band.tsx`) kept high on the page, the CTAs, and the
  `captureLead` action. Restyle freely; don't remove or bury them.
- **Honesty / FTC:** no fabricated clients, reviews, testimonials, awards, logos, ratings, or guarantees.
  Client-directed numbers carry `[VERIFY-client]` and must stay consistent with the single source
  (`lib/data/performance-stats.ts` `trustFacts`: $100M+ managed · 1M+ leads · 6.3× ROAS · 500+ businesses ·
  10+ yrs). Partner badges (Google/Meta) only with official artwork. Don't ship Review/AggregateRating schema.
- **Don't touch:** analytics IDs/pixels, env vars, form destinations, deployment/payment settings, or the
  benchmark/calculator math. Keep the AEO/schema layer (`lib/seo.ts`, `sitemap.ts`, `robots.ts`, `llms.txt`).
- **Keep it fast & accessible:** static prerender, `next/image` for real rasters (with width/height to avoid
  CLS), WCAG-AA contrast, form labels, focus states, skip link. Mobile is a hard requirement — no page should
  get very long on mobile.
- **Process:** branch → `npm run build` green per commit → PR → human review. Never push to `main`.

## 6. Per-surface pointers (starting suggestions — you decide the execution)
- **Homepage (`app/page.tsx`):** the strongest page; modernize the hero (real hero illustration in the right
  column, refined kinetic type), keep the trial banner + calculator high, apply the new theme, and make the
  proof/cases/comparison sections feel editorial. It's currently inline-styled — consider migrating it onto
  the token system + shared components for consistency.
- **Service template (`app/services/[slug]/page.tsx`) + 3 flagships (`components/flagship/*`):** real per-service
  hero art, keep the bold `HeroOffer` + calculator near the top, vary the deep sections.
- **Industry / location / combo pages:** industry hero illustrations + city skylines (Appendix A); keep them short.
- **Hubs (`/pricing` `/compare` `/glossary` `/benchmarks` `/free-audit`):** light dataviz, better tables, hero art.
- **Global chrome:** header/footer/announcement bar — modern glass treatment, consistent CTA vocabulary.

## 7. Deliverables we expect back
1. Updated theme (tokens + shared components) as a reviewable PR.
2. The image/logo asset set dropped into `/public/**` per `CREATIVE-BRIEF.md` paths, wired into the data
   (`logos.ts` `src`, hero-art slots, `next/image`).
3. Any layout restructures, build-green, mobile-checked.
4. A short "what changed & why" note + before/after screenshots (desktop + 390px mobile).

---

## Appendix A — Image & logo generation prompts (Nano Banana / ChatGPT / Higgs Field)

**GLOBAL STYLE (prepend to every image prompt for consistency):**
> "Flat editorial vector illustration, premium modern SaaS style (à la Stripe/Linear). Cream background
> `#f1efe3`. Ink linework `#14170e`. Signature lime `#ceff3a` as the single energy/highlight colour. Olive
> `#6f7d22` secondary accent. Coral `#f26a2b` used ONLY for 'waste/problem/before' elements. Soft long drop
> shadows, rounded 14–26px corners, generous negative space (~35%), one clear focal object + 1–2 floating
> data chips. No photorealism, no gradients-as-crutch, no clip-art, no text baked in unless specified.
> Transparent background. Output crisp, clean, minimal."

**Format/output:** deliver **SVG where possible** (heroes, spot art, logos → themeable, light); WebP+PNG @1x/@2x
for painterly rasters (city skylines, textures). Transparent background. Trimmed viewBox. Target ≤ ~40KB SVG.

### Page hero illustrations (560×460 each) — `/public/images/heroes/`
Prepend GLOBAL STYLE, then:
- **hero-home.svg** — "A marketing 'control room': a clean dashboard slab with a rising lime revenue line and a
  coral 'wasted spend' line being *sealed* into lime; floating chips 'Cost/lead ↓38%', 'ROAS 4.8×'. Confident,
  premium, the signature scene." accent lime.
- **hero-google-ads.svg** — "Google search results sheet with a sponsored 'Ad' result glowing lime, rising
  conversion bars, a cursor click." accent blue `#2f6db0`.
- **hero-meta-ads.svg** — "Phone showing a Facebook/Instagram ad with a heart and play button, 'Leads/week 64'
  chip." accent indigo `#5b6cc0`.
- **hero-seo.svg** — "SERP ranking climb from #4 to #1 with a local map-pack pin and a dashed→solid climb
  arrow." accent green `#2f8f6b`.
- **hero-youtube-ads.svg** — "YouTube player with a skippable-ad countdown, a view-through funnel, subscribe
  spark." accent red `#b5443a`.
- **hero-microsoft-ads.svg** — "Bing SERP + Windows-tile motif, a 'lower CPC' chip." accent green `#4a7a3f`.
- **hero-tiktok-ads.svg** — "Vertical phone feed, sound-on wave, a spark-ads rocket." accent teal `#2f9e98`.
- **hero-linkedin-ads.svg** — "B2B: profile cards flowing into a lead-gen form, briefcase, 'cost/B2B lead' chip." accent blue `#2d6f9e`.
- **hero-pinterest-ads.svg** — "Masonry pin board, a pin saved → click → cart, 'shopping intent'." accent red `#b0413e`.
- **hero-creative.svg** — "Stacked ad-creative frames (static/carousel/video) with a play button, 'variants/week 24'." accent burnt-orange `#c4632a`.
- **hero-web-design.svg** — "Browser + mobile landing page, a checkmark, 'conv. rate ↑2.1×'." accent olive `#6f7d22`.
- **hero-cro-landing-pages.svg** — "A/B split screen (variant A vs B) with a lift %, a funnel narrowing to a lime CTA." accent orange `#c4632a`.
- **hero-crm.svg** — "Kanban lead pipeline New→Contacted→Booked, an automation bolt, 'speed to lead <5min'." accent gold `#8a6d1f`.
- **hero-ai-automation.svg** — "A node graph: lead → AI brain → routed follow-up across SMS/email, '24/7'." accent indigo `#5b6cc0`.
- **Hub heroes:** hero-pricing ("glass box over an ad-budget bar split into big-lime 'your ad spend' vs small-olive 'our fee'"), hero-compare ("balanced scale / Google-vs-Meta orbs"), hero-glossary ("open A–Z index cards, one lime-highlighted term"), hero-benchmarks ("a data table morphing into a bar chart"), plus upgraded services/industries/locations/tools/results/blog/about/contact index heroes (see `CREATIVE-BRIEF.md §5`).

### Industry heroes (15) — `/public/images/industries/` — one scene each, accent per `CREATIVE-BRIEF.md §7`
physiotherapy (treatment table + booking calendar), healthcare-clinics, dental (tooth + review stars), hvac
(furnace/AC + service van), plumbing (pipe/wrench + map pin), electrical (bolt/panel), construction-renovation
(crane/blueprint), roofing (house + drone before/after), immigration (passport/maple leaf), law-firms
(scales/columns), real-estate (for-sale sign + listing card), home-improvement (paint roller), fitness-gyms
(dumbbell/heart-rate), med-spa (serum/leaf glow), professional-services (briefcase/office).

### City skylines (10) — `/public/images/cities/` — wide 640×300, flat 2-layer skyline
Prepend GLOBAL STYLE + "iconic flat skyline, near silhouette in ink, far layer in olive, cream sky with a soft
lime sun, a couple of lime map pins, 3–4 recognisable landmarks max":
Toronto (CN Tower + bank towers + lake), Brampton (Rose Theatre/City Hall clock + 'our HQ' lime pin),
Mississauga (Marilyn Monroe curved towers + Square One), Etobicoke (lakeshore mid-rises + Humber arch),
North York (Yonge/Sheppard towers), Scarborough (Bluffs cliffs + STC), Vaughan (VMC towers + coaster hint),
Markham (Unionville gables + tech campus), Hamilton (escarpment + steel silhouette + waterfall hint), Ottawa
(Parliament Peace Tower + canal).

### Logos / brand marks — `/public/logos/` (monochrome ink SVG + optional full-colour)
Use each brand's **official** mark from its press kit (respect trademark/clear-space; don't imply endorsement).
Platforms: google-ads, meta/facebook/instagram, youtube-ads, microsoft-ads(bing), tiktok-ads, linkedin-ads,
pinterest-ads, performance-max. Analytics: ga4, gtm, looker-studio, search-console, merchant-center,
microsoft-clarity. AI: chatgpt, claude, gemini, perplexity, grok, deepseek. Creative AI: midjourney,
adobe-firefly, runway, heygen, elevenlabs, capcut, descript. SEO/tools: semrush, ahrefs, screaming-frog,
surfer-seo, frase, optmyzr, madgicx, revealbot. Automation: zapier, make, n8n, airtable, supermetrics, slack,
gohighlevel. Build: github, vercel, nextjs, cursor, v0. **Credentials (official badge art ONLY):**
google-partner, meta-business-partner, bbb-accredited. **Brand:** `logo-wordmark.svg`, `logo-stacked.svg`,
`logo-glyph.svg` (the "sealed leak" monogram), inverse variants; favicon + apple-touch-icon; OG cards.

### Textures / spot art — `/public/images/textures/` + `/sections/`
tex-contour (topographic mesh, ink @5%), tex-blob-lime, tex-grain, **tex-divider-seal** (the leak→sealed
divider), tex-dot-grid; plus ~18 square spot illustrations (audit, process, AI, reporting, team, guarantee,
comparison, pricing, speed, local, funnel, creative-lab, integration, review, checklist, growth, handshake) —
full list + placements in `CREATIVE-BRIEF.md §3 & §8`.

### Blog covers — `/public/images/blog/` — 1200×630 WebP@2x, one concept illustration per post topic.

**Total ≈ 78 illustrations/textures + ~66 logos ≈ 144 assets** (see `CREATIVE-BRIEF.md §2` for the exact tally
and every `/public` path). The 45 service×industry combo pages reuse the service hero + a small industry
"motif tile" — don't make 45 bespoke heroes.

---

## Appendix B — Using image MCPs to produce these
- **Higgs Field** (connected here): `generate_image` for the illustrations/heroes/skylines; `remove_background`
  for transparent cutouts; `upscale_image` to 2K/4K for rasters. Feed GLOBAL STYLE + the per-asset line.
- **Nano Banana / Gemini ("BananaPro") or ChatGPT image gen:** paste GLOBAL STYLE + the per-asset line; export
  SVG/PNG transparent; run a quick vectorize pass for the SVG-first assets.
- **Wiring after generation:** drop files at the exact `/public` paths in `CREATIVE-BRIEF.md`, set `src` on the
  matching `lib/data/logos.ts` entries, swap the placeholder SVG hero components for `next/image`
  (with width/height), and keep the cream background so nothing floats as a white box.
- **Consistency rule:** generate ONE hero first, get sign-off on the exact style, then batch the rest with the
  identical GLOBAL STYLE prefix so all 144 assets read as one set.

---
*Companion files: `CREATIVE-BRIEF.md` (asset list + paths + palette), `WEBSITE_FULL_AUDIT_REPORT.md` (scored
audit), `WORK_SESSION_LOG.md` (recent changes). Brand truth: `lib/data/performance-stats.ts` + `CLAUDE.md`.*
