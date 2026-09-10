# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## PPC Guru landing-page decisions

- This is a mobile-first paid-traffic landing page, not a general company website. The first viewport prioritizes the offer and the beginning of a short qualification flow.
- Use the approved cream, charcoal, olive, and electric-lime visual direction from `../design-concepts/ppc-guru-lead-gen-mobile-concept-v2.png`.
- The promise is: 100 agreed-quality leads, or the PPC Guru management fee is $0. Ad spend is separate, qualification is required, and written terms apply.
- Use every supplied logo from `../client-logos/selected` in an automatically moving marquee. Preserve original logo files; do not redraw or rename them.
- Use the seven supplied Meta Ads screenshots as real campaign evidence. Preserve their displayed names and numbers, and present them in an automatic carousel with manual arrows, swipe support, and pause-on-interaction.
- Keep the page concise. Do not add generic service inventories, fake statistics, fake testimonials, or unverified credibility claims.
- The hero uses a compact, question-at-a-time three-step qualification flow: business and service area, campaign fit and budget, then contact details. Keep the first form headline visible in the initial mobile viewport and keep the persistent header CTA focused on that flow.
- Campaign proof uses the original supplied screenshots inside a layered, swipeable dashboard deck with adjacent results peeking from both sides, metric summaries, manual controls, auto-rotation, and a full-screen inspection view.
- The owner states PPC Guru has worked with more than 200 businesses. Say "Trusted across 200+ businesses" while presenting the 57 supplied logos as a selection, not as the full client roster.
- Keep the hero bright rather than dark. Use the approved pale-lime cover background, dark text, blue guarantee accent, and the headline "Get 100 qualified leads. Or our fee is $0."
- The qualification flow is front-end only until the user supplies the final CRM, form endpoint, privacy URL, terms URL, booking destination, tracking pixels, and written guarantee terms.
