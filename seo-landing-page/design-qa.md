# SEO + AI-search landing-page design QA

## Selected visual sources

- PPC Guru paid-traffic theme: `C:\Users\dapat\OneDrive\Documents\ChatGPT\PPC Website\landing-page\`.
- Original ChatGPT mobile screenshots supplied by PPC Guru and copied byte-for-byte into `public/proof/`:
  - `chatgpt-mobile-seo-actual.jpeg` — 736 × 1600, 173,543 bytes, SHA-256 `6D0F9D003A9661F0B98714B6768003519691D8D0A61030FCD3B43CB58FCB16BF`.
  - `chatgpt-mobile-google-ads-actual.jpeg` — 736 × 1600, 162,332 bytes, SHA-256 `CBEF556C830832781CC013BC20D94CF295851EC088E2C106DA7EDC9B8FCCE343`.
  - `chatgpt-mobile-meta-ads-actual.jpeg` — 736 × 1600, 154,975 bytes, SHA-256 `CF94008C5276CAF3DF716EAF65D0F7A9453A709BFF8208C412CE648B9D2A8224`.
- Verified implementation: `http://127.0.0.1:4174/?actualproof=final#top` in the Codex in-app browser.

## Layout and fidelity

- The page keeps the approved bright lime, black, blue and pale-blue PPC Guru design language and text-only PPC / GURU.CA wordmark.
- Desktop displays the three original screenshots simultaneously in equal-width, equal-height cards. At 1280 × 800, each card measured 394 CSS pixels wide with 18-pixel gaps.
- Mobile uses a horizontal, scroll-snapped track with one 345-pixel card inside a 390-pixel viewport. The next card is outside the content area; users can swipe, use previous/next controls or select a position dot.
- Screenshots use their complete 736 × 1600 source frame. There is no crop, reconstruction, enlarged modal, zoom dependency or click-to-open requirement.
- The cards and section disclosure identify the files as original PPC Guru-supplied ChatGPT app screenshots and state that AI outputs are time- and prompt-specific rather than permanent rankings or guaranteed endorsements.

## Visual QA

- Mobile inspected at exactly 390 × 844 CSS pixels.
- Desktop inspected at exactly 1280 × 800 CSS pixels.
- The original SEO source and its implemented mobile card were rendered together in the same 390 × 844 visual-comparison input.
- The source response, map result, PPC Guru listing and visible ranking table remain legible in the page presentation.
- Mobile proof controls were inspected after navigating from screenshot 1 to screenshot 2; the track moved to 357 CSS pixels and the active indicator changed correctly.
- No horizontal page overflow was present.
- All lazy-loaded images completed with non-zero natural dimensions; all three proof images reported 736 × 1600.
- Fresh-browser warning and error log: empty.

## Functional and build QA

- Completed the three-step mobile form with synthetic data through the success state.
- Verified required-field gating, choices, contact inputs and consent copy.
- Verified the proof CTA scrolls back to the visibility form.
- `npm run build` passed: 4,571 modules transformed and Sites output prepared.
- The production JavaScript bundle references all three new original screenshot filenames.
- `npm run test:sites` passed all four tests.

## Issues resolved

- P1: Generated reconstructions did not match the newly supplied genuine evidence. Replaced all live proof assets with the original ChatGPT app screenshots and preserved their hashes.
- P1: The previous vertical stack did not meet the requested responsive presentation. Added a three-column desktop comparison and a one-at-a-time mobile swipe experience with visible controls.
- P2: The proof heading wrapped awkwardly on mobile. Tightened it to “See PPC Guru recommended by ChatGPT.”
- P2: Proof needed a clearer trust boundary. Replaced reconstruction labels with “Original” labels and updated the qualification disclosure.

final result: passed
