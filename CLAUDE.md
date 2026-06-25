# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **PPC Guru**, a Google/Meta Partner digital marketing agency. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, with live ad-ROI calculators, AI tools, and a programmatic SEO architecture. Deployed on Vercel (`main` is the production branch; `vercel.json` pins the framework to Next.js).

> **Design state:** the `main` branch ships the original dark, violet→cyan theme with a scroll-driven Three.js hero. The `claude/*` revamp branches ship the current **cream/lime/ink** light design (the "handoff" system) with a 2D illustrated dashboard hero. The notes below describe the revamp design, since that is what merges into `main`. When something reads as "legacy," it belongs to the old `main` look and may be orphaned on the revamp branch — grep for imports before assuming it's live.

## Commands

```bash
npm install
npm run dev        # local dev (http://localhost:3000)
npm run build      # production build — run this to validate; it type-checks all routes
npm run start      # serve the production build
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
```

There is **no test framework** configured — `npm run build` (which runs full TypeScript checking and prerenders all static routes) is the primary validation gate. Always run it after non-trivial changes.

## Architecture

### Content is data-driven; pages are templates
Almost nothing is hardcoded in pages. Content lives in typed modules and is rendered by thin page templates via `generateStaticParams`. To change copy/structure, edit the data — not the JSX.

- `lib/site-config.ts` — single source of truth for brand, NAP, trust numbers, nav, CTAs.
- `lib/data/services.ts`, `industries.ts`, `locations.ts`, `case-studies.ts`, `testimonials.ts`, `company.ts` — page content + the `get*`/`generateStaticParams` helpers.
- `lib/data/home.ts` — homepage content (hero, proof, FAQ, calculator copy) consumed by `app/page.tsx` and `components/home/*`.
- `lib/data/benchmarks.ts` — ad benchmark dataset + `projectResults()`, the deterministic math behind both calculators (no AI in the math).
- `content/blog/*.md` — blog posts (frontmatter + Markdown), read at build by `lib/blog.ts`.

### Routing notes
- `app/[city]/[service]/` are **programmatic location pages** generated from `allLocationParams()` in `lib/data/locations.ts`, with `export const dynamicParams = false` (only generated combos render; everything else 404s). Static routes (`/services`, `/industries`, `/tools`, etc.) take precedence over this catch-all two-segment dynamic route.
- SEO: per-page metadata via `buildMetadata()` and JSON-LD builders in `lib/seo.ts`, rendered through `components/seo/json-ld.tsx`. `app/sitemap.ts` and `app/robots.ts` enumerate all generated routes.

### Homepage hero & sections (`components/home/`)
- `app/page.tsx` composes the homepage from `components/home/*` (`HeroDashboard`, `WasteCalculator`, `FaqList`, `AuditForm`, `RevealInit`) driven by `lib/data/home.ts`. The hero is a 2D illustrated "dashboard" (`components/illustrations/hero-art.tsx`), **not** the Three.js funnel.
- Inner pages use the bespoke SVG illustrations in `components/illustrations/` plus the shared `components/sections/*` blocks.

### The 3D "performance funnel" hero (`components/three/`) — legacy
- This is the old `main` hero and is **currently orphaned on the revamp branch** (its only importer, `components/home/hero.tsx`, is no longer mounted by `app/page.tsx`). Kept for reference / possible reuse; don't assume it renders.
- How it worked: `funnel-3d.tsx` rendered a static SVG fallback (`funnel-poster.tsx`) and only mounted the WebGL canvas when the section was near viewport (IntersectionObserver) **and** `getGPUTier()` (detect-gpu) ≥ 1 **and** not `prefers-reduced-motion`. The canvas was `next/dynamic({ ssr: false })` so three.js stayed out of first-load JS. `funnel-canvas.tsx` = the `<Canvas>`; `funnel-scene.tsx` = `THREE.Points` + custom GLSL shader.
- **Scroll sync rule (still applies to any scroll-driven 3D):** animation is driven by the mutable `lib/scroll-store.ts` object (written by `components/providers/smooth-scroll-provider.tsx` = Lenis + GSAP ScrollTrigger), read inside `useFrame`. **Never** drive 3D via React state / per-frame `setState`.

### AI tools (graceful, server-only)
- `app/api/instant-audit/route.ts` fetches a URL, extracts real on-page/tracking signals, then has Claude write the narrative; `app/api/ad-copy/route.ts` generates ad copy. Both use `lib/ai/anthropic.ts` and **fall back to deterministic output when `ANTHROPIC_API_KEY` is absent** — the site is fully functional without keys. API key is server-side only.
- Contact form: `app/contact/actions.ts` (Server Action + Zod + optional Resend + optional Cloudflare Turnstile). All integrations are optional and degrade gracefully (logs instead of emailing when no key).

### Reusable UI
- `components/ui/*` — primitives (`Button`, `Section`, `Counter`, `Reveal`, `Eyebrow`/`Badge`). Styled with `cva` + the `cn()` helper in `lib/utils.ts` (clsx + tailwind-merge), shadcn-style.
- `components/sections/*` — composable page sections shared across the homepage and inner pages.
- `components/shared/*` — `page-hero`, `partner-badges`, `legal-layout`, `social-icons`.
- `components/illustrations/*` — bespoke SVG hero art per page.
- `components/reactbits/*` and `components/magicui/*` — vendored text/animation effects (e.g. `SplitText`, `ShinyText`, `NumberTicker`, `BorderBeam`, `Marquee`). These are copied-in source, not an installed package — edit them in place. Animation uses **`motion`** (Framer Motion's successor), not `framer-motion`.
- **Signature motif — "the leak, sealed":** the shared `Eyebrow` (`components/ui/badge.tsx`, mirrored in `app/page.tsx`'s local eyebrow) leads every section label with a small SVG mark — a dashed coral "wasted-spend leak" sealed at an ink node and recovered into a rising olive→lime line. It's the site's one deliberate, recurring brand device; keep it consistent rather than adding competing flourishes.

## Conventions & gotchas

- **Tailwind v4, no config file.** Design tokens are defined in `app/globals.css` under `@theme`; reference them as arbitrary values, e.g. `text-[--color-ink-dim]`, `bg-[--color-surface]`. The current theme is a **light cream base with lime/ink/coral/olive accents** (`--color-cream`, `--color-lime` signature fill, `--color-ink` text, `--color-coral` = the "waste/leak" accent **only**). Radix Colors (`@radix-ui/colors`) is available for scales. **Legacy gotcha:** the old `--color-violet*`/`--color-cyan*` tokens are intentionally remapped to olive so pre-revamp classes stay on-brand — don't "fix" a violet/cyan class to a literal purple/blue; it's olive by design.
- **Typefaces (`app/layout.tsx`, via `next/font/google`):** Archivo (`--font-archivo`, display/body), DM Serif Display (`--font-dm-serif`, italic emphasis like the hero "before"), JetBrains Mono (`--font-jetbrains`, eyebrows/labels).
- **React is pinned to 19.2.0** because `@react-three/fiber` v9 requires `react <19.3`. Do not bump React past 19.2 (the constraint stands even though the 3D hero is currently dormant).
- **lucide-react has no brand icons** (Instagram/LinkedIn/Facebook) — use the inline SVGs in `components/shared/social-icons.tsx`.
- **Representative content & honesty:** case studies and testimonials are anonymized, clearly-labeled *representative* scenarios — do **not** fabricate named-client results or fake testimonials (legal/FTC). Ad benchmarks are industry averages, not guarantees. `CONTENT-TODO.md` lists the real data to swap in before launch.
- Env vars are documented in `.env.example` / README and are all optional for local/dev.

## Git / deploy

- `main` is the deployed production branch (Vercel auto-deploys on push to `main`). Feature work happens on `claude/*` branches and merges into `main` via PR.
