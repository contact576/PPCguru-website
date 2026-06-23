# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **PPC Guru**, a Google/Meta Partner digital marketing agency. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, with a scroll-driven Three.js hero, live ad-ROI calculators, AI tools, and a programmatic SEO architecture. Deployed on Vercel (`main` is the production branch; `vercel.json` pins the framework to Next.js).

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
- `lib/data/benchmarks.ts` — ad benchmark dataset + `projectResults()`, the deterministic math behind both calculators (no AI in the math).
- `content/blog/*.md` — blog posts (frontmatter + Markdown), read at build by `lib/blog.ts`.

### Routing notes
- `app/[city]/[service]/` are **programmatic location pages** generated from `allLocationParams()` in `lib/data/locations.ts`, with `export const dynamicParams = false` (only generated combos render; everything else 404s). Static routes (`/services`, `/industries`, `/tools`, etc.) take precedence over this catch-all two-segment dynamic route.
- SEO: per-page metadata via `buildMetadata()` and JSON-LD builders in `lib/seo.ts`, rendered through `components/seo/json-ld.tsx`. `app/sitemap.ts` and `app/robots.ts` enumerate all generated routes.

### The 3D "performance funnel" hero (`components/three/`)
- `funnel-3d.tsx` is the entry point. It renders a static SVG fallback (`funnel-poster.tsx`) by default and only mounts the WebGL canvas when: section is near viewport (IntersectionObserver) **and** `getGPUTier()` (detect-gpu) ≥ 1 **and** not `prefers-reduced-motion`. The canvas is `next/dynamic({ ssr: false })` so three.js stays out of first-load JS.
- `funnel-canvas.tsx` = the `<Canvas>` (drei `PerformanceMonitor`/`AdaptiveDpr`); `funnel-scene.tsx` = `THREE.Points` + custom GLSL shader.
- **Scroll sync rule:** animation is driven by the mutable `lib/scroll-store.ts` object (written by `components/providers/smooth-scroll-provider.tsx` = Lenis + GSAP ScrollTrigger, and by the hero), read inside `useFrame`. **Never** drive 3D via React state / per-frame `setState`.

### AI tools (graceful, server-only)
- `app/api/instant-audit/route.ts` fetches a URL, extracts real on-page/tracking signals, then has Claude write the narrative; `app/api/ad-copy/route.ts` generates ad copy. Both use `lib/ai/anthropic.ts` and **fall back to deterministic output when `ANTHROPIC_API_KEY` is absent** — the site is fully functional without keys. API key is server-side only.
- Contact form: `app/contact/actions.ts` (Server Action + Zod + optional Resend + optional Cloudflare Turnstile). All integrations are optional and degrade gracefully (logs instead of emailing when no key).

### Reusable UI
- `components/sections/*` — composable page sections shared across the homepage and inner pages.
- `components/ui/*` — primitives (`Button`, `Section`, `Counter`, `Reveal`, etc.).
- `components/shared/*` — `page-hero`, `partner-badges`, `legal-layout`, `social-icons`.

## Conventions & gotchas

- **Tailwind v4, no config file.** Design tokens are defined in `app/globals.css` under `@theme`; reference them as arbitrary values, e.g. `text-[--color-ink-dim]`, `bg-[--color-surface]`. The theme is a dark base + violet→cyan accent.
- **React is pinned to 19.2.0** because `@react-three/fiber` v9 requires `react <19.3`. Do not bump React past 19.2.
- **lucide-react has no brand icons** (Instagram/LinkedIn/Facebook) — use the inline SVGs in `components/shared/social-icons.tsx`.
- **Representative content & honesty:** case studies and testimonials are anonymized, clearly-labeled *representative* scenarios — do **not** fabricate named-client results or fake testimonials (legal/FTC). Ad benchmarks are industry averages, not guarantees. `CONTENT-TODO.md` lists the real data to swap in before launch.
- Env vars are documented in `.env.example` / README and are all optional for local/dev.

## Git / deploy

- `main` is the deployed production branch (Vercel auto-deploys on push to `main`). Feature work happens on `claude/*` branches and merges into `main` via PR.
