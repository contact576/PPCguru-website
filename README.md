# PPC Guru — Website

A futuristic, AI-forward marketing website for **PPC Guru**, a Google Partner & Meta Business Partner agency. Built with Next.js, a scroll-driven Three.js "performance funnel" hero, live Google/Meta Ads ROI calculators, AI tools, and a deep SEO architecture (services, industries, programmatic GTA location pages, blog).

## Tech stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4** (CSS-first tokens) design system — dark base + electric violet→cyan accent
- **Motion** (UI animation) + **GSAP/ScrollTrigger** + **Lenis** (smooth scroll)
- **react-three-fiber + drei + three** — the 3D performance-funnel hero (GPU-tiered, lazy-loaded, static poster fallback)
- **Anthropic SDK** (`@anthropic-ai/sdk`) — instant AI audit & ad-copy generator (server-side, graceful fallback without a key)
- **Resend + Cloudflare Turnstile** — contact form (graceful fallback without keys)
- Markdown blog (`gray-matter` + `react-markdown`) under `content/blog/`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Environment variables

All are **optional** — the site is fully functional without them (AI tools and the
contact form fall back to deterministic behavior). Add them to enable live features.
Copy `.env.example` to `.env.local`.

| Variable | Enables |
|---|---|
| `ANTHROPIC_API_KEY` | AI-written instant audit & ad-copy (otherwise smart templated output) |
| `RESEND_API_KEY` | Contact form email delivery via Resend |
| `CONTACT_TO_EMAIL` | Where contact submissions are sent (defaults to site email) |
| `CONTACT_FROM_EMAIL` | Verified Resend "from" address |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile spam protection (client) |
| `TURNSTILE_SECRET_KEY` | Turnstile server verification |

## Deployment (Vercel)

1. Push the branch and import the repo in Vercel (auto-detects Next.js).
2. Add the env vars above in Project → Settings → Environment Variables.
3. Deploy. ISR/static generation, image optimization and the API routes work out of the box.

## Editing content

Almost all content is data-driven and edited in one place:

- **Brand, NAP, trust numbers, nav** → `lib/site-config.ts`
- **Services** → `lib/data/services.ts`
- **Industries** → `lib/data/industries.ts`
- **Locations (cities × services)** → `lib/data/locations.ts`
- **Case studies** → `lib/data/case-studies.ts`
- **Testimonials** → `lib/data/testimonials.ts`
- **Stats / process / differentiators / FAQ** → `lib/data/company.ts`
- **Ad calculator benchmarks** → `lib/data/benchmarks.ts`
- **Blog posts** → `content/blog/*.md`

See **`CONTENT-TODO.md`** for the list of real client data to verify/replace before launch.
