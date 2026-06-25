# PPC Guru — Full Website Revamp Plan

> Status: PROPOSAL — awaiting approval. Nothing is built until the design
> direction (Section 2) is confirmed. Built page-by-page with a preview +
> your sign-off at each gate.

---

## 1. Requirements ledger — everything asked for in this project

Captured from the entire conversation so nothing is dropped. Each item is
tracked through the plan.

### Business & scope
- [ ] Marketing site for **PPC Guru** — Brampton/GTA **Google Partner + Meta Business Partner**, AI-augmented PPC/marketing agency for local service businesses.
- [ ] Based on best practices from 40–50 competitor agencies.
- [ ] Keep all real company context/services; **fabricate nothing**.

### Look & feel (your feedback, in order)
- [ ] Must NOT look basic / WordPress-tier / 2010s. Current ≈ 4–5/10.
- [ ] Must look **futuristic, next-generation, AI-era**, "$100k+" quality.
- [ ] Reference quality bar: **landonorris.com, messenger.abeto.co, kfc.it/loyalty** — cursor reactions, click reactions, scroll choreography, "reacts to everything."
- [ ] **Keep the brand colors** (orange `#E8612A` + gold `#F4A100`); eye-catching layout.
- [ ] **Fonts** must be better (not default Inter-only).
- [ ] **Structure/layout** must be stronger.
- [ ] **Width / side space** must be correct — generous margins, not cramped.
- [ ] **3D object** must look great and animate well (scroll-driven, industry-relevant "performance funnel").
- [ ] **Don't stop until 9/10.**
- [ ] Run the **Anthropic frontend-design skill** to evaluate/critique.

### Content & depth
- [ ] **Every page full and in-depth** — no thin pages, no placeholder sections.
- [ ] **SEO-friendly content writing** on every page (I write it; grounded, not fabricated).
- [ ] Programmatic SEO: **many industries**, **GTA location pages**, **blog**.
- [ ] Live **Google Ads + Meta Ads ROI calculators** (industry-based revenue projection).
- [ ] **AI feature showcases** (instant audit, ad-copy generator).
- [ ] **Case studies** (representative, clearly labeled).

### Conversion system (from the PPC brief)
- [ ] 30-Day PPC Growth Sprint offer.
- [ ] PPC Waste Calculator / free-audit funnel.
- [ ] "Why us / comparison" section.
- [ ] Pricing guidance.
- [ ] Lead capture (forms, sticky CTAs, exit/scroll offer).

### Tooling now available (installed, PR #6)
- [ ] **shadcn/ui** (foundation), **Magic UI** (animated marketing components),
      **react-bits** (text/scroll effects), **tweakcn theme + Radix Colors**.
- [ ] Already in stack: **GSAP, Motion, Lenis, React Three Fiber**, Next 16, React 19.2, Tailwind v4.

### Honesty / compliance (hard rules — never violated)
- [ ] No fake reviews, ratings, client logos, awards, testimonials, guarantees, or numbers.
- [ ] No placeholder phone; "Book a call" until real number provided.
- [ ] Case studies/testimonials labeled **representative**.
- [ ] No Review/AggregateRating schema until real.
- [ ] Mark unverified claims `[VERIFY]`; never expose API keys.

### Process expectations
- [ ] Implement the WHOLE request, not half. Plan → approve → build.
- [ ] Build page-by-page; show a real preview at each step; iterate to 9/10.

---

## 2. Design direction — THE decision to confirm first

I've now read your direction wrong twice (dark dull v1 → rejected; dark cinematic
v3 → rejected). So this is the one thing I will not assume. My recommendation,
reconciling "keep the colors," "eye-catching/next-gen," and your rejection of
*both* dull-dark and basic-light:

**Recommended — "Vibrant Premium Light":**
- Warm near-white canvas (`#FBFAF7`) with **bold orange→gold** as the hero color,
  plus **deep-ink feature sections** (near-black blocks) for cinematic contrast.
- Big, characterful display type + generous side margins.
- Heavy, tasteful motion everywhere (Magic UI + react-bits + GSAP + custom cursor).
- The "wow" of the reference sites, but bright and on-brand — not dull, not flat.

Alternatives: (B) full **Dark Cinematic** (the v3 concept, re-executed better),
(C) **Hybrid** dark hero → light body. Section 3 onward assumes the recommended
direction and adapts once you pick.

---

## 3. Design system & framework

**Type (replaces default Inter-only):**
- Display: a characterful grotesque (e.g. **Bricolage Grotesque** or **Clash/Geist** family) for big headlines.
- Body: **Inter** (clean workhorse).
- Mono: **JetBrains Mono** for eyebrows/labels/data.
- Fluid type scale (clamp) so headlines are large on desktop, controlled on mobile.

**Color (tweakcn-managed tokens):**
- Brand orange `#E8612A` → gold `#F4A100` gradient as the signature.
- Warm-white canvas, near-black ink, hairline borders, a few pastel/deep accent blocks.
- Accessible contrast (WCAG AA) enforced.

**Spacing & layout:**
- Generous fluid container (`clamp` side padding) → real side space on desktop.
- Editorial grid with intentional asymmetry; consistent vertical rhythm.

**Motion system (the reference-site feel):**
- Global **Lenis** smooth scroll (already in).
- **Custom cursor** (reticle + hover labels) + **magnetic** buttons.
- **GSAP ScrollTrigger** for pinned/parallax scenes; **Motion** for reveals.
- **react-bits** text effects (SplitText, BlurText, ShinyText) for headlines.
- **Magic UI** (BorderBeam, Marquee, NumberTicker, AnimatedGradientText, ShimmerButton) for marketing moments.
- Page-load + route-transition choreography. All respect `prefers-reduced-motion`.

**Component library mapping (so we reuse, not reinvent):**
- Hero headlines → react-bits SplitText/BlurText.
- Trust/logos strip → Magic UI Marquee.
- KPI/stat callouts → Magic UI NumberTicker.
- Feature cards / pricing → BorderBeam + tilt.
- Primary CTAs → ShimmerButton / magnetic Button.
- Accents/eyebrows → existing Eyebrow + AnimatedGradientText.

---

## 4. Global elements (built once, used everywhere)

- **Header:** transparent→solid on scroll, magnetic CTA, animated mobile menu, mega-menu for Services/Industries.
- **Footer:** NAP, nav, socials, partner badges, legal — richer, on-brand.
- **Announcement bar:** 30-Day Sprint offer.
- **Custom cursor**, **smooth scroll**, **route transitions**, **film-grain/texture** (subtle).
- **Sticky/floating CTA** + **scroll-triggered offer** (one, non-annoying).
- **SEO spine:** per-page metadata, JSON-LD (Organization, LocalBusiness, Service, BreadcrumbList, FAQPage), sitemap, robots, OG images.

---

## 5. Sitemap & page-by-page plan

Every page gets: a purpose, an ordered section list, target content length,
SEO targets, and which animations/components. Built in the phase order in §9.

### 5.1 Home — flagship (target: long, ~10–12 sections)
Hero (3D funnel + kinetic headline) → trust marquee → "what we do" services →
the spend→revenue story (scroll-pinned, the 3D motif) → results/KPIs (NumberTicker)
→ 30-Day Sprint offer → PPC Waste Calculator teaser → why-us/comparison →
case studies → industries grid → AI tools showcase → testimonials → FAQ → final CTA.

### 5.2 Services — hub + 6 detail pages
- Hub: overview grid + how-we-work + CTA.
- Each detail page (`google-ads`, `meta-ads`, `seo`, `creative`, `web-design`, `crm`), ~800–1,200 words:
  hero → outcomes → what's included/deliverables → our process → tools → mini case study → related industries → FAQ → CTA.

### 5.3 Industries — hub + 15 detail pages
- 15 verticals (physio, healthcare, dental, HVAC, plumbing, electrical, construction, roofing, immigration, law, real-estate, home-improvement, fitness, med-spa, professional-services).
- Each ~700–1,000 words: hero → pain points → our approach → relevant services → benchmark snapshot (from data) → representative result → FAQ → CTA.

### 5.4 Locations — hub + programmatic `[city]/[service]` (10 cities × 3 services = 30)
- Unique templated copy per combo (city context + service), LocalBusiness schema, internal links. ~500–800 words each, non-thin.

### 5.5 Tools — hub + 4 tools
- **Google Ads calculator** & **Meta Ads calculator** (live, benchmark-driven, animated results + lead capture).
- **Instant AI Audit** (URL → real signals + AI narrative; graceful fallback).
- **AI Ad-Copy Generator** (email-gated lead magnet).

### 5.6 Results — hub + 6 case studies (representative, labeled)
Challenge → strategy → results (from benchmark math) → quote. Animated metric reveals.

### 5.7 About — story, founders, method, partner badges, team, values, CTA. ~700–900 words.

### 5.8 Blog — hub + 8 seed posts (existing), richer cards, related posts, share, JSON-LD Article.

### 5.9 Contact — form (Server Action + Zod + spam protection), calendar slot, click-to-call (when number provided), map/service area.

### 5.10 Legal — Privacy (PIPEDA) + Terms, clean legal layout.

### 5.11 404 — on-brand, animated, helpful links.

---

## 6. The 3D object — "Performance Funnel / Growth Engine"
- Scroll-driven Three.js (R3F) particle funnel: spend (top) → leads (neck) → booked revenue (basin), color-ramped in brand orange/gold.
- Idle motion pre-scroll, cursor parallax, scroll fills it. Poster fallback + GPU gating + reduced-motion (already architected).
- Recurs subtly as a motif in section dividers and the calculator result viz.

## 7. Conversion system
30-Day Sprint offer · PPC Waste Calculator · free-audit funnel · why-us/comparison ·
pricing guidance · sticky + scroll-triggered CTAs · lead-capture on tools. Analytics
hooks (GA4/GTM/CRM) left as wired no-ops with `[VERIFY]` until IDs provided.

## 8. SEO & content
- I write all copy: keyword-targeted, locally relevant, genuinely useful (no fluff, no fabrication).
- Full metadata, JSON-LD, sitemap/robots, internal linking, OG images, image alt text, performance budget (Lighthouse ≥90/SEO ≥95).

## 9. Build sequence (phased, with approval gates)
1. **Design system + global chrome** (tokens, type, cursor, header/footer, motion primitives) → preview.
2. **Home** (the flagship) → preview → your sign-off. ← we calibrate the whole look here first.
3. **Services** hub + 6 pages.
4. **Industries** hub + 15 pages.
5. **Locations** hub + 30 programmatic pages.
6. **Tools** (calculators + AI).
7. **Results, About, Blog, Contact, Legal, 404.**
8. **Full QA pass** (frontend-design skill critique + functionality + screenshots desktop/mobile) → iterate to 9/10.
9. Each phase: build → `npm run build` green → screenshot → you review → next.

## 10. What I need from you (non-blocking; I'll use safe placeholders + `[VERIFY]`)
- Design direction (Section 2).
- Real phone/email/address/socials, verified partner status, any real metrics/testimonials, pricing ranges, analytics IDs.

## 11. Quality bar / definition of done
- Visually 9/10 vs the reference sites; cohesive, animated, on-brand, generous spacing.
- Every page full-depth + SEO-complete; no thin/placeholder sections.
- Build green; responsive; accessible; honesty rules intact.
