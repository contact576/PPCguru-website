# PPC Guru — Creative & Image Brief (for the graphic-design team)

**Purpose:** a complete, page-by-page list of every image / illustration / logo / texture the website
needs, with a description, colour palette, format, dimensions and the **exact path + page + section**
each asset drops into. Hand this whole file to the design team.

**Owner sign-off needed on:** overall art direction (Section 1), then produce in the priority order in
Section 12. Everything here is additive — the site works today with built-in SVG placeholders; these
assets replace/upgrade them for a richer, less "boxy" feel.

---

## 1. Art direction (read first)

**Style: flat editorial illustration + subtle depth — NOT stock photos.** The owner's call is correct:
illustration reads more premium and on-brand here than real photography, and it never looks like a
generic template. Think *Stripe / Intercom / Linear*-grade vector illustration: clean geometry, confident
negative space, one or two focal "hero objects," soft long shadows, a few floating data chips. Avoid
clip-art, avoid gradients-as-crutch, avoid literal "people at laptops" stock.

**Consistency rules (every asset):**
- Built on the **cream canvas** so it melts into the page (no hard white boxes floating on cream).
- **Ink linework** (`#14170e`) as the "pen." **Lime** (`#ceff3a`) is the signature highlight/energy.
  **Coral** (`#f26a2b`) appears **only** to represent waste / leaks / the problem — never as decoration.
- Each page carries its **per-vertical accent** (see the accent table in Section 5/6) as a secondary
  colour so the page "reads as its own" while staying in the family.
- Keep the **"leak, sealed" motif** alive: a dashed coral line that resolves into a solid lime line /
  sealed node. This is the brand's signature — weave it in where natural (arrows, dividers, chart lines).
- Rounded corners (radius 14–26px on cards/objects), soft long drop-shadow (dy ~20, blur ~26, ink @ ~14%).
- Illustrations should be **airy** — 30–40% of the frame is breathing room.

### Master colour palette (hex — use these exactly)
| Token | Hex | Use |
|---|---|---|
| Cream base | `#f1efe3` | canvas / page background |
| Cream soft | `#f7f5ea` | alternate bands, card fills |
| Surface | `#fbfaf2` | raised cards |
| Border | `#dddbc9` / `#c4c2b0` | hairlines / visible outlines |
| Ink | `#14170e` | text, linework, dark panels |
| Ink-dim | `#54564a` | secondary text |
| Ink-faint | `#83856f` | captions / mono labels |
| **Lime (signature)** | `#ceff3a` | energy highlight, "sealed/win," CTAs |
| Lime-soft | `#eef2dd` | soft fills, chips, tints |
| Olive | `#6f7d22` / `#5f6f17` | on-cream accent text, secondary marks |
| **Coral (waste only)** | `#f26a2b` | leaks / wasted spend / the "before" |
| Dark panel | `#14170e` on `#222717` insets | feature panels, dashboards |

### Formats & delivery (all assets)
- **Vector-first: deliver SVG** (optimised, ≤ ~40KB, no embedded rasters) wherever the art is
  geometric/illustrative — that's ~95% of this list. SVG stays crisp, themeable and light.
- Where a raster is unavoidable (textured backgrounds, painterly city skylines): **WebP + PNG fallback**,
  provide **@1x and @2x**, target ≤ 200KB @1x.
- **Transparent background** on all spot illustrations and logos (they sit on cream/tinted sections).
- Deliver each with a **200px-tall preview PNG** for quick review.
- Naming: lower-kebab-case, described below per folder. Provide a single `/assets-source/` with editable
  files (AI/Figma) too.

### Folder / path convention (where files live in the repo → `/public`)
```
/public/images/heroes/        page hero illustrations        e.g. hero-google-ads.svg
/public/images/industries/    industry hero illustrations    e.g. ind-physiotherapy.svg
/public/images/cities/        city skyline illustrations     e.g. city-toronto.svg
/public/images/sections/      reusable in-section spot art   e.g. spot-audit.svg
/public/images/textures/      backgrounds / watermarks       e.g. tex-contour.svg
/public/logos/                brand/app/tool logos           e.g. google-ads.svg
/public/brand/                favicon, app icons, OG cards   e.g. og-default.png
```
Each entry below gives the **target path** so you know exactly which page + section it feeds.

---

## 2. What & how many — inventory summary

| Bucket | Count | Notes |
|---|---:|---|
| Page hero illustrations (main site pages) | **~24** | homepage + 13 services + hubs/utility pages |
| Industry hero illustrations | **15** | one per vertical (currently all share 1 template) |
| City skyline illustrations | **10** | Toronto, Brampton, Mississauga, Etobicoke, North York, Scarborough, Vaughan, Markham, Hamilton, Ottawa |
| Reusable in-section spot illustrations | **~18** | audit, process, AI, reporting, team, guarantee, etc. |
| Background / texture / watermark assets | **6** | contour mesh, blob washes, grain, section dividers |
| Brand system (favicon, app icons, OG) | **5** | favicon set + 2 OG templates |
| Logos / brand marks (platforms/apps/tools/AI/credentials) | **~66** | full list in Section 4 |
| **Total distinct assets** | **~144** | ~78 illustrations/textures + ~66 logos |

> The 45 `[service] × [industry]` combo pages do **not** each need a bespoke hero — they should reuse the
> service hero + an industry **motif tile** (Section 7). That keeps the set at ~78 illustrations, not 120+.

---

## 3. Global / reusable assets (used across many pages)

### 3.1 Background & texture library → `/public/images/textures/`
| File | Description | Palette | Format | Where it's used |
|---|---|---|---|---|
| `tex-contour.svg` | Topographic contour-line mesh (the flowing curved lines already in the hero backdrop), very low opacity | ink lines @ 5% on transparent | SVG | behind every `PageHero` + homepage hero (replaces the inline SVG) |
| `tex-blob-lime.svg` | Soft radial lime glow blob (organic, blurred) | lime `#ceff3a` @ 12–16% → transparent | SVG | hero corner glows, section accents |
| `tex-blob-accent.svg` | Same blob but single-colour so it can be tinted per accent | neutral (tint via CSS) | SVG | per-vertical hero washes |
| `tex-grain.png` | Ultra-subtle paper grain to warm the cream | warm grey noise @ 3–4% | PNG @2x, tileable | body background overlay (optional) |
| `tex-divider-seal.svg` | The "leak→sealed" motif as a horizontal section divider: dashed coral entering left, resolving to solid lime + a sealed node right | coral `#f26a2b` → lime `#ceff3a`, ink node | SVG | between major sections site-wide (breaks box monotony) |
| `tex-dot-grid.svg` | Faint dot grid for dark feature panels | lime/olive dots @ 8% on ink | SVG | dark CTA panels, stat bands |

### 3.2 Brand system → `/public/brand/`
| File | Description | Palette | Format |
|---|---|---|---|
| `favicon.svg` + `favicon-32.png` + `favicon-16.png` | PPC Guru monogram "the sealed leak" glyph | ink + lime | SVG + PNG |
| `apple-touch-icon.png` (180×180) | rounded-square app icon, lime seal on ink | ink bg, lime mark | PNG |
| `og-default.png` (1200×630) | *A dynamic OG card already exists (`app/opengraph-image.tsx`).* Optionally provide a richer painted version | cream, ink wordmark, lime, hero object | PNG |
| `og-service-template.png` (1200×630) | template with slot for service name + accent | per-accent | PNG/Figma template |

### 3.3 Logo / wordmark → `/public/logo.svg`
A real `logo.svg` wordmark exists (placeholder-grade). **Upgrade:** deliver a polished horizontal
wordmark + a stacked lockup + a standalone glyph, each in **ink-on-transparent** and **cream-on-ink**.
- `logo-wordmark.svg`, `logo-stacked.svg`, `logo-glyph.svg`, `logo-wordmark-inverse.svg`.

---

## 4. Logos & brand marks → `/public/logos/`

The site currently renders **monochrome text pills** for every platform/tool because no logo assets are
bundled. Supplying real marks makes the "tools & platforms" wall and footer credibility jump. Deliver each
as a **clean monochrome SVG** (single ink colour so it reads uniform on the wall) **and** an optional
**full-colour SVG** (for the footer/partner strip where colour is allowed). Transparent background, trimmed
viewBox, ~48px tall optical size.

> ⚖️ **Trademark note for the team:** use each brand's official logo from its brand/press kit, respect
> clear-space and colour rules, and don't recolour protected marks in contexts that imply endorsement.
> The monochrome treatment is for the neutral "tools we use" wall; the partner badges (Google/Meta) must
> use **official partner-badge artwork** only.

**Ad platforms** (`/public/logos/…`): `google-ads`, `meta-ads` (+ `facebook`, `instagram`), `youtube-ads`,
`microsoft-ads` (Bing), `tiktok-ads`, `linkedin-ads`, `pinterest-ads`, `performance-max`.

**Analytics & tracking:** `google-analytics` (GA4), `google-tag-manager`, `looker-studio`,
`search-console`, `merchant-center`, `microsoft-clarity`.

**Research & strategy AI:** `chatgpt`, `claude`, `gemini`, `perplexity`, `grok`, `deepseek`.

**Creative & video AI:** `midjourney`, `adobe-firefly`, `runway`, `heygen`, `elevenlabs`, `capcut`, `descript`.

**SEO & content:** `semrush`, `ahrefs`, `screaming-frog`, `surfer-seo`, `frase`.

**Ads optimization:** `optmyzr`, `adalysis`, `madgicx`, `revealbot`, `foreplay`, `adcreative-ai`.

**Automation & reporting:** `zapier`, `make`, `n8n`, `airtable`, `supermetrics`, `slack`, `gohighlevel`.

**Build & deploy:** `claude-code`, `cursor`, `v0`, `github`, `vercel`, `nextjs`.

**Credentials / accreditation (official badge art ONLY):** `google-partner-badge`,
`meta-business-partner-badge`, `bbb-accredited-badge`. *(These render as real badges only once the official
asset is provided — do not approximate.)*

**Client / industry category marks (for the footer carousel — honest category icons, NOT client logos):**
small monoline emblem per category: `cat-physiotherapy`, `cat-hvac`, `cat-dental`, `cat-construction`,
`cat-immigration`, `cat-real-estate`, `cat-med-spa`, `cat-law`, `cat-roofing`, `cat-fitness`.

*Total logos ≈ 66.* → feeds `lib/data/logos.ts` (set each entry's `src`), the homepage `ToolsOs`
section, the partner strip, and the footer brand carousel.

---

## 5. Page hero illustrations — main site pages → `/public/images/heroes/`

**Shared spec:** landscape-ish **560×460** artboard (the hero art column), transparent background, one
focal "hero object" + 1–2 floating data chips, built in the page's accent (below) + lime + ink. These
replace the built-in SVGs in `components/illustrations/hero-art.tsx`. **7 of the 13 services currently
*reuse another service's* illustration — those are the highest priority (marked ⚠).**

### 5.1 Homepage → `/` (`app/page.tsx`)
| Asset (path) | Section | Description | Palette |
|---|---|---|---|
| `hero-home.svg` | top hero (right of headline) | The signature scene: a marketing "control room" — a clean dashboard slab showing a rising lime revenue line, a coral "wasted spend" line being *sealed* into lime, floating chips ("Cost/lead ↓38%", "ROAS 4.8×"). Confident, premium, the single best illustration on the site. | cream + ink, lime line, coral leak sealing to lime |
| `home-band-texture.svg` | full-bleed band behind stats | wide contour + blob wash | lime/olive @ low opacity |

### 5.2 The 13 service heroes
Each: `560×460` SVG, accent-led. ⚠ = currently borrowing another page's art (make bespoke first).

| Service (path) | Accent | Hero concept |
|---|---|---|
| `hero-google-ads.svg` | `#2f6db0` blue | Search results sheet with a sponsored "Ad" result glowing lime, rising conversion bars, cursor click *(upgrade of existing)* |
| `hero-meta-ads.svg` | `#5b6cc0` indigo | Phone showing a Facebook/Instagram ad, heart/►, floating "Leads/week 64" chip *(upgrade of existing)* |
| `hero-seo.svg` | `#2f8f6b` green | SERP ranking climb #4→#1 + local map-pack pin, dashed→solid climb arrow *(upgrade of existing)* |
| `hero-creative.svg` | `#c4632a` burnt-orange | Stacked ad-creative frames (static/carousel/video) with a play button + "variants/week 24" |
| `hero-web-design.svg` | `#6f7d22` olive | Browser + mobile landing page, checkmark, "conv. rate ↑2.1×" |
| `hero-crm.svg` | `#8a6d1f` gold | Kanban lead pipeline New→Contacted→Booked, automation bolt, "speed to lead <5min" |
| ⚠ `hero-youtube-ads.svg` | `#b5443a` red | YouTube player with skippable-ad countdown, view-through funnel, subscribe spark — **stop reusing Creative art** |
| ⚠ `hero-microsoft-ads.svg` | `#4a7a3f` green | Bing SERP + Windows-tile motif, "lower CPC" chip, desktop-audience nod — **stop reusing Google art** |
| ⚠ `hero-tiktok-ads.svg` | `#2f9e98` teal | Vertical phone feed, sound-on wave, spark-ads rocket — **stop reusing Meta art** |
| ⚠ `hero-linkedin-ads.svg` | `#2d6f9e` blue | B2B: profile cards → lead-gen form, "cost/B2B lead" chip, briefcase — **stop reusing Meta art** |
| ⚠ `hero-pinterest-ads.svg` | `#b0413e` red | Masonry pin board, a pin saved→click→cart, "shopping intent" — **stop reusing Meta art** |
| ⚠ `hero-ai-automation.svg` | `#5b6cc0` indigo | Node graph: lead → AI brain → routed follow-up across SMS/email, "24/7" — **stop reusing CRM art** |
| ⚠ `hero-cro-landing-pages.svg` | `#c4632a` orange | A/B split screen (variant A vs B) with lift %, funnel narrowing to a lime CTA — **stop reusing Web-Design art** |

### 5.3 Hub & utility page heroes
| Page → path | Asset | Concept | Accent |
|---|---|---|---|
| `/` services index → `hero-services.svg` | full-funnel dashboard, "one team every channel" *(upgrade existing)* | olive/lime |
| `/industries` → `hero-industries.svg` | row of local storefronts with awnings, one lit lime *(upgrade)* | olive |
| `/locations` → `hero-locations.svg` | GTA map with lime pins, Toronto live *(upgrade; see skylines §6)* | olive |
| `/tools` → `hero-tools.svg` | calculator + ROI gauge, "free, no sign-up" *(upgrade)* | olive |
| `/results` → `hero-results.svg` | big revenue-up chart + before/after bars *(upgrade)* | lime |
| `/blog` → `hero-blog.svg` | article sheet + insight bulb *(upgrade)* | olive |
| `/about` → `hero-about.svg` | two founder "coins" (JP/DP monograms), principles checklist, partner badges *(upgrade → see also real founder portraits, §8)* | lime |
| `/contact` → `hero-contact.svg` | chat bubbles + calendar booking slot *(upgrade)* | lime |
| `/pricing` → `hero-pricing.svg` | **NEW** — transparent "glass box" over an ad-budget bar split into *your ad spend* (big, lime) vs *our fee* (small, olive); "you keep 100% of ad spend" | olive/lime |
| `/compare` → `hero-compare.svg` | **NEW** — balanced scale / side-by-side arena: Google vs Meta orbs, "agency vs DIY" | dual-accent |
| `/glossary` → `hero-glossary.svg` | **NEW** — open dictionary / index cards A–Z with a lime highlighted term, "define X" | olive |
| `/benchmarks` → `hero-benchmarks.svg` | **NEW** — data table morphing into a bar chart, "sourced 2026 CPL/CPC by industry" | olive |

---

## 6. City skyline illustrations → `/public/images/cities/`

The 30 location pages (`/[city]/[service]`) currently show a **generic map**. Give each city a
**recognisable flat skyline** so the page instantly feels local (big SEO + trust win). One skyline per
city, reused across that city's 3 service pages.

**Shared spec:** wide **640×300** SVG banner, flat 2-layer skyline (near silhouette in ink, far layer in
olive/accent), cream sky with a soft lime sun/glow, a couple of lime "pins" floating. Keep it iconic, not
literal — 3–4 landmark silhouettes max.

| City → path | Landmark cues (keep it recognisable) | Accent tint |
|---|---|---|
| Toronto → `city-toronto.svg` | CN Tower, bank towers, lake foreground | ink + lime |
| Brampton → `city-brampton.svg` | Rose Theatre/City Hall clock, low skyline, "our HQ" lime pin | olive-lime |
| Mississauga → `city-mississauga.svg` | Marilyn Monroe curved towers, Square One | teal-lime |
| Etobicoke → `city-etobicoke.svg` | lakeshore mid-rises, Humber arch bridge | green |
| North York → `city-north-york.svg` | Yonge/Sheppard towers, Mel Lastman square | blue |
| Scarborough → `city-scarborough.svg` | Bluffs cliffs + STC + civic centre | teal |
| Vaughan → `city-vaughan.svg` | VMC towers, Canada's Wonderland coaster hint | indigo |
| Markham → `city-markham.svg` | Unionville main-street gable roofs + tech campus | blue |
| Hamilton → `city-hamilton.svg` | escarpment, steel/industrial silhouette, waterfalls hint | amber |
| Ottawa → `city-ottawa.svg` | Parliament Peace Tower, canal | blue |

*(Also feeds a future "cities we serve" strip on `/locations`.)*

---

## 7. Industry heroes + combo motif tiles → `/public/images/industries/`

### 7.1 Industry heroes (15) — `560×460` SVG each, accent-led
Currently every industry shares one icon-in-a-card template. Give each a small **scene** (the vertical's
world) so `/industries/[slug]` pages feel bespoke. Keep the composition family consistent (a focal object
+ a mini results chart + a chip) but change the subject:

| Industry → path | Accent | Scene cue |
|---|---|---|
| `ind-physiotherapy.svg` | `#2f8f6b` | clinic/treatment table + booking calendar + "booked appts ↑" |
| `ind-healthcare-clinics.svg` | `#2f8f9e` | clinic building + patient intake form |
| `ind-dental.svg` | `#2f6db0` | tooth + appointment slot + review stars |
| `ind-hvac.svg` | `#2d7fb0` | furnace/AC unit + service van + "emergency calls" |
| `ind-plumbing.svg` | `#2f6db0` | pipe/wrench + map pin + phone ringing |
| `ind-electrical.svg` | `#c79a1f` | bolt/panel + quote card |
| `ind-construction-renovation.svg` | `#b5722a` | crane/blueprint + project gallery |
| `ind-roofing.svg` | `#8a4b2a` | house roof + drone + before/after |
| `ind-immigration.svg` | `#2f6db0` | passport/maple leaf + consultation form |
| `ind-law-firms.svg` | `#6b5b8a` | scales/columns + case intake |
| `ind-real-estate.svg` | `#2f7d6b` | for-sale sign + listing card + map |
| `ind-home-improvement.svg` | `#b5722a` | paint roller/tools + quote |
| `ind-fitness-gyms.svg` | `#c4632a` | dumbbell/heart-rate + membership signups |
| `ind-med-spa.svg` | `#b06a8a` | serum/leaf + booking + glow |
| `ind-professional-services.svg` | `#5b6cc0` | briefcase/office + lead form |

### 7.2 Combo motif tiles (for the 45 `[service]×[industry]` pages) → `/public/images/industries/motifs/`
Rather than 45 bespoke heroes, deliver **one small square motif tile per industry** (`motif-dental.svg`,
etc., 15 tiles, ~200×200) that the combo page composes **beside the service hero**. Cheap, scalable,
still looks tailored. Same subject cues as 7.1, simplified to a single emblem.

---

## 8. In-section spot illustrations → `/public/images/sections/`

These break up the "boxes, boxes, boxes." Small **square-ish 320×280** transparent SVG spots to sit
inside/next to section copy across templates. Reusable across many pages.

| Asset (path) | Feeds section / component | Description | Palette |
|---|---|---|---|
| `spot-audit.svg` | audit CTA / instant-audit (`audit-form`, `waste-audit`) | magnifying glass over an ad account finding red "leaks" turning lime | ink, coral→lime |
| `spot-process.svg` | process steps (`process-steps.tsx`) | 3–4 stepping-stone nodes on a dashed→solid path | olive, lime |
| `spot-ai.svg` | AI sections (`ai-showcase`, `ai-os`, `tools-os`) | friendly AI core with orbiting task nodes (write/optimise/report) | indigo, lime |
| `spot-reporting.svg` | reporting/dashboard mentions | Looker-style tiles + a clean line chart | ink panel, lime |
| `spot-team.svg` | About "meet the team" (`team.tsx`) | two seats + AI copilot glyph, "founder-led" | ink, lime |
| `spot-guarantee.svg` | trust/guarantee bands | shield + sealed-leak check | olive, lime |
| `spot-comparison.svg` | `/compare`, comparison tables | two columns, lime ✓ vs coral ✗ | lime/coral |
| `spot-pricing.svg` | `/pricing` principles | budget bar split ad-spend vs fee | lime/olive |
| `spot-speed.svg` | speed-to-lead / CRM | stopwatch <5min + message flying | lime |
| `spot-local.svg` | geo/city callouts (`CityCallout`) | map pin cluster over GTA | olive, lime |
| `spot-funnel.svg` | funnel/estimate band (`estimate-band`) | clicks→leads→booked→revenue funnel | ink, lime |
| `spot-creative-lab.svg` | creative service deep sections | palette + frames + A/B | orange, lime |
| `spot-integration.svg` | tool-stack sections | connected app tiles / plug | olive |
| `spot-review.svg` | testimonials (`testimonials-section`) | quote mark + 5 stars + avatar ring | lime |
| `spot-checklist.svg` | "what's included" (`whats-included`) | ticked list on a card | olive, lime |
| `spot-growth.svg` | results / case studies | up-and-to-the-right with milestone flags | lime |
| `spot-empty-graph.svg` | generic data decoration | faint chart for section backgrounds | ink @ low |
| `spot-handshake.svg` | contact / partnership | month-to-month, no-contract handshake | olive |

---

## 9. Blog / article imagery → `/public/images/blog/`
Each post needs a **1200×630 feature illustration** (currently none). Style: single concept illustration
per post topic (e.g. "Google Ads for local service businesses" → SERP + storefront). Deliver as WebP@2x.
Provide **8** now (one per existing post) + a **template** for future posts. Also a generic
`blog-default.svg` fallback.

---

## 10. Homepage & section-level placements (where new art plugs in)

The homepage and inner templates are mostly bordered cards on grids. Where art should be **added** to
de-box them (paths reference the components):
- **Homepage hero** → `hero-home.svg` (right column) + `home-band-texture.svg`.
- **"Who we help" / industry grid** → each industry card gets its `motif-*.svg` emblem (top-left).
- **Tools/OS stack section** (`tools-os.tsx`) → real `/public/logos/*` marks replace text pills.
- **Testimonials** (`testimonial-carousel`) → `spot-review.svg` + optional real client photos *(only with
  written consent — otherwise keep monogram avatars)*.
- **Between every 2 major sections** → `tex-divider-seal.svg` as an editorial divider.
- **Dark CTA blocks** (`cta-block.tsx`) → `tex-dot-grid.svg` behind + `spot-handshake.svg`.
- **Service page deep sections** (`service-deep.tsx`: audit/AI/cadence/timeline/toolstack) → `spot-audit`,
  `spot-ai`, `spot-process`, `spot-integration` respectively.
- **Industry page deep sections** (`industry-deep.tsx`) → `ind-*` scene + `spot-local`, `spot-growth`.

---

## 11. Real photography (optional, only if the client wants it)
Illustration covers the whole site. If real photos are ever added, keep them to **two honest places**:
1. **Founder portraits** (`/public/team/jaydeep.jpg`, `dhaval.jpg`, 800×800) for `/about` + blog author
   boxes — big E-E-A-T win. Consistent lighting, cream/neutral backdrop, treated with a subtle duotone
   (ink + lime) so they match.
2. **Real client logos / result screenshots** — **only with written consent** (see `CONTENT-TODO.md`).
Everything else stays illustrated.

---

## 12. Production priority (suggested order)

1. **P0 — brand core:** `logo-*` set, `favicon`/app icons, `tex-contour`, `tex-divider-seal`, `hero-home`.
2. **P1 — the 7 ⚠ service heroes** that currently reuse another page's art (youtube, microsoft, tiktok,
   linkedin, pinterest, ai-automation, cro) + upgrade google/meta/seo.
3. **P2 — logos** (all ~66, monochrome first) — instantly lifts the platform wall + footer.
4. **P3 — city skylines** (10) — strong local-SEO/trust signal on 30 pages.
5. **P4 — remaining service + hub heroes** (creative, web-design, crm, pricing, compare, glossary,
   benchmarks, and index-page upgrades).
6. **P5 — 15 industry heroes + 15 combo motif tiles.**
7. **P6 — in-section spot illustrations (18) + blog feature images (8).**
8. **P7 — textures/backgrounds polish + founder portraits (if approved).**

---

## 13. Handoff notes for the design team
- Work on the **cream `#f1efe3` canvas** at all times — never design on white.
- Every asset should survive being shrunk to ~360px wide (mobile) — keep detail legible, linework ≥1.5px
  at export scale.
- Deliver SVGs **flattened, with a trimmed viewBox and no inline `<style>`** (so they theme cleanly).
- Match the existing illustration language in `components/illustrations/hero-art.tsx` (soft shadow filter,
  chip components, lime energy) — these are the reference for "on-brand."
- When in doubt on colour: **ink line + cream fill + one lime moment**. Coral only for "the problem."
- Send a **first sample** (suggest: `hero-home.svg` + `hero-youtube-ads.svg` + 6 logos + `city-toronto.svg`)
  for art-direction sign-off **before** producing the full set.

---
*Generated for the PPC Guru design team. Paths map 1:1 to `/public` in the website repo; once assets land,
we wire each `src` into the data modules (`logos.ts`, hero art) and swap the built-in SVG placeholders.*
