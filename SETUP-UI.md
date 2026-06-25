# UI Libraries — install notes

This branch installs four copy-paste UI libraries onto the existing site
(Next.js 16 · React 19.2 · Tailwind v4). They're all MIT and vendored into the
repo, so we own the source and nothing depends on an external runtime.

## What's installed

| Library | Where | What it gives us |
|---|---|---|
| **shadcn/ui** (foundation) | `components.json` + shadcn token layer in `app/globals.css` | Config + theming so any shadcn-registry component drops in on-brand. |
| **Magic UI** | `components/magicui/*` | Animated marketing components: `Marquee`, `BorderBeam`, `AnimatedShinyText`, `AnimatedGradientText`, `ShimmerButton`, `NumberTicker`, `AuroraText`. |
| **react-bits** | `components/reactbits/*` | Text/scroll effects: `ShinyText`, `GradientText`, `BlurText`, `RotatingText`, `SplitText`, `AnimatedContent`. |
| **tweakcn theme** + **Radix Colors** | `:root` block in `app/globals.css` + `@radix-ui/colors` | shadcn design tokens mapped to brand orange `#e8612a`. Regenerate a full palette at https://tweakcn.com and paste the `:root`/`.dark` block. |

Animation engines (GSAP, Motion, Lenis, React Three Fiber) were already in the
project. New npm deps added: `@radix-ui/colors`, `tw-animate-css`, `@gsap/react`.

**Preview:** visit `/ui-kit` for a live gallery of every installed component.

## Why these were vendored (not installed via the official CLI)

This environment's network policy only allows package registries (npm). The
component registries — `ui.shadcn.com`, `magicui.design`, `reactbits.dev`,
`tweakcn.com` — are blocked, so `npx shadcn add …` can't reach them here.
`github.com` / `raw.githubusercontent.com` **are** reachable, so components were
pulled directly from source. This is functionally identical (these libs are
copy-paste by design).

## How to add MORE components

**Option A — locally / on an unrestricted network (cleanest):**
```bash
npx shadcn@latest add <component>                      # shadcn
npx shadcn@latest add "https://magicui.design/r/<name>.json"   # Magic UI
# react-bits: copy from https://reactbits.dev
```

**Option B — in this environment (vendor from GitHub raw):**
```bash
# Magic UI components live here:
curl -o components/magicui/<name>.tsx \
  "https://raw.githubusercontent.com/magicuidesign/magicui/main/apps/www/registry/magicui/<name>.tsx"

# react-bits (TypeScript + Tailwind variant):
curl -o components/reactbits/<Name>.tsx \
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/<Category>/<Name>/<Name>.tsx"
```
Magic UI components import only `cn` (`@/lib/utils`) and `motion/react`, so they
drop in cleanly. Some need extra `@theme` keyframes in `globals.css` (we already
added: marquee, marquee-vertical, shiny-text, gradient, aurora, shimmer-slide,
spin-around). react-bits may need `gsap` / `@gsap/react` (installed).

## Notes
- `components/reactbits/SplitText.tsx` has one `as any` cast on its dynamic tag —
  react-bits' upstream typing trips React 19's stricter JSX types. Behaviour is
  unchanged.
- The shadcn token layer deliberately does **not** remap `accent`, `border`, or
  the `--radius-*` scale — those already exist in the brand `@theme` and are used
  across the site; remapping would cause regressions.
