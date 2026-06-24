# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing + lead-gen website for **PPC Guru**, a GTA/Brampton Google & Meta Partner PPC agency. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. Conversion-focused homepage, data-driven service/industry/location/blog pages, live Google/Meta Ads ROI + PPC-waste calculators, AI tools, and a scroll-driven Three.js "performance funnel" hero. **`main` is the production branch** (Vercel auto-deploys on push).

## Commands

```bash
npm install
npm run dev        # local dev (http://localhost:3000)
npm run build      # production build — the real validation gate (full type-check + prerender)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
# npm run lint is currently BROKEN: `next lint` was removed in Next 16. Use typecheck + build.
```

There is **no test framework**. `npm run build` is the gate — always run it after non-trivial changes.

### Visual QA (screenshots)
Playwright's browser CDN is blocked by the sandbox proxy. Use the working setup instead: `puppeteer-core` + `@sparticuz/chromium` (Chromium ships via npm to `/tmp/chromium`). Pattern: start `npm run start`, then run a node script with `NODE_PATH=./node_modules` that launches `puppeteer.launch({ args:[...chromium.args,'--no-sandbox'], executablePath: await chromium.executablePath() })`, scrolls to trigger `whileInView` reveals, and screenshots. Read the PNGs to self-critique. To view production HTML (the proxy 403s `*.vercel.app`), use the Vercel MCP `web_fetch_vercel_url` tool.

## Architecture

### Content is data-driven; pages are thin templates
Edit data, not JSX. Almost every page renders from typed modules via `generateStaticParams`.
- `lib/site-config.ts` — single source of truth: brand, NAP, trust flags, nav, CTAs. **Phone is intentionally blank** (shows a "Book a call" CTA, never a placeholder number).
- `lib/data/{services,industries,locations,case-studies,testimonials,company}.ts` — page content + `get*`/param helpers.
- `lib/data/benchmarks.ts` — sourced ad-benchmark dataset + `projectResults()`, the deterministic math behind both calculators (no AI in the math).
- `content/blog/*.md` — posts (frontmatter + Markdown), read at build by `lib/blog.ts`, rendered with `react-markdown` + `remark-gfm` (NOT Content Collections).

### Routing
- `app/[city]/[service]/` — programmatic location pages from `allLocationParams()`, `dynamicParams = false`. Static routes win over this catch-all.
- SEO: `buildMetadata()` + JSON-LD builders in `lib/seo.ts` via `components/seo/json-ld.tsx`; `app/sitemap.ts` + `app/robots.ts`. **No Review/aggregateRating schema** is emitted (no verified ratings yet).

### Design system — LIGHT EDITORIAL (Tailwind v4, no config file)
Tokens are CSS-first in `app/globals.css` under `@theme`. White canvas + near-black ink, **oversized pastel color-block sections** (cream/coral/lime/lilac/mint/pink/navy), pill buttons, mono uppercase eyebrows. **Brand accent = orange `#e8612a` + gold `#f4a100`** (from the logo). Fonts: **Inter** (display+body) + **JetBrains Mono** (`.eyebrow`). Adapted from the uploaded Figma system in `DESIGN.md`; principles from the installed **`.claude/skills/frontend-design/`** skill.

- **Legacy token aliasing:** the old dark token names still exist but are remapped — `--color-violet`/`--color-cyan` → orange, `--color-base`/`--color-surface` → white. So old class names render on-brand; prefer `--color-orange`, `--color-ink`, `--color-ink-dim`, `--color-border` going forward.
- **Color-block rhythm:** `<Section tone="cream|coral|lime|lilac|mint|pink|navy|soft|white">` renders the full-width rounded pastel panel; `components/sections/color-block.tsx` is the standalone equivalent. White canvas returns between blocks.
- **Buttons** (`components/ui/button.tsx`): pill variants — `primary` (black), `accent` (orange, the conversion CTA), `outline`/`secondary` (white + 1.5px visible border — never plain 1px on white or it disappears), `ghost`.
- **Eyebrow** = mono uppercase orange via the `Eyebrow` component + `.eyebrow` class (one source of truth — don't re-introduce per-instance size/weight overrides).

### ⚠️ Tailwind v4 CSS-variable gotcha (critical)
Arbitrary values referencing theme vars MUST be `bg-[var(--color-navy)]`, **not** `bg-[--color-navy]`. The v3 bracket shorthand silently produces no CSS in v4 — this previously made every color section render white. Always use `[var(--token)]`.

### Homepage conversion flow (`app/page.tsx`)
Announcement bar (in `app/layout.tsx`) → Hero (3D funnel) → platform strip → non-numeric proof strip → 30-Day Sprint (`trial-offer`) → PPC waste calculator (`waste-audit`) → services → process → AI showcase → why-compare → reporting/`whats-included` → case studies → industries → calculator teaser → pricing-guidance → why-us → testimonials → FAQ → navy CTA. Global: `FloatingCta` (desktop button + mobile sticky bar) and `OfferPopup` (50%-scroll/30s, localStorage-gated). Front-end event hooks in `lib/analytics.ts` are no-ops with GA4/GTM/CRM `TODO`s.

### The 3D "performance funnel" hero (`components/three/` + `components/home/hero.tsx`)
Lives in a **navy panel** in the split hero so the additive particles pop. `funnel-3d.tsx` lazy-mounts the WebGL `<Canvas>` (`next/dynamic({ssr:false})`) only when in view AND `getGPUTier() >= 1` AND not reduced-motion; otherwise shows `funnel-poster.tsx`. Scroll drives the mutable `lib/scroll-store.ts` ref (written by the hero / Lenis+GSAP provider), read in `useFrame` — **never per-frame `setState`**.

### AI tools (server-only, graceful fallback)
`app/api/instant-audit/route.ts` (fetches real on-page signals → Claude narrative) and `app/api/ad-copy/route.ts` use `lib/ai/anthropic.ts` and **fall back to deterministic output when `ANTHROPIC_API_KEY` is absent**. Contact form: `app/contact/actions.ts` (Server Action + Zod + optional Resend + optional Turnstile), all degrade gracefully.

## Conventions & gotchas

- **Honesty / no fabrication** (enforced throughout, see `[VERIFY]` comments + the pre-launch checklist in `app/layout.tsx`): no placeholder phone numbers, no zero/"$0M+" stat counters (use the non-numeric proof strip), no fake reviews/ratings/Review-schema, partner badges marked `[VERIFY]`. Case studies & testimonials are clearly-labeled **representative** content, swappable via one data file.
- **React pinned to 19.2.0** — `@react-three/fiber` v9 needs `react <19.3`. Don't bump past 19.2.
- **lucide-react has no brand icons** — use inline SVGs in `components/shared/social-icons.tsx`.
- Env vars are all **optional** (`.env.example`); AI/email/spam features fall back without them.

## Git / deploy

- `main` = production (Vercel). Feature work on `claude/*` branches → PR → merge to `main`. Direct pushes to `main` may be blocked by the harness; prefer a branch + PR.
- **Public access** to the Vercel URL requires **Deployment Protection → Vercel Authentication → Disabled** in the Vercel dashboard (owner-only). Preview URLs are login-gated by default; production is public only once protection is off.
