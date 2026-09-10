# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## SEO landing-page decisions

- Keep the PPC Guru identity as the text-only wordmark `ppcguru.ca`; do not add the arrow logo.
- Use `../landing-page/` as the visual source of truth: bright lime hero, black-and-blue oversized typography, white form card, dark pill buttons, pale-blue proof section, and the same spacing/radius language.
- Treat the supplied AI-answer screenshots as observed, time-specific examples, not permanent rankings or independent endorsements.
- Do not promise a guaranteed Google position, AI citation, recommendation, or lead volume.
- Keep the conversion path mobile-first: bright trust-led hero, three-step visibility form, selected client-logo marquee, supplied AI proof, and a measurable 30-day before-and-after framework.
- Preserve all supplied SEO, Google Ads, and Meta Ads AI-answer captures as source evidence in `public/proof/`.
- Use the user-supplied original ChatGPT mobile screenshots for the live proof presentation: all three side by side on desktop and a swipeable, one-card-at-a-time track with visible controls on mobile.
- Do not crop the screenshot evidence or require a modal, zoom view, or click-to-open interaction to read it. Label the files as original supplied captures and keep the time-specific AI-output disclosure visible.
- The form is currently a front-end prototype. Connect it to the approved CRM, consent records, spam protection, analytics, and the verified PPC Guru WhatsApp number before paid traffic.
