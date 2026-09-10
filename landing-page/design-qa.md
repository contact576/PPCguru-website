# Design QA

## Comparison targets

- Selected PPC Guru direction: `C:\Users\dapat\OneDrive\Documents\ChatGPT\PPC Website\design-concepts\ppc-guru-lead-gen-mobile-concept-v2.png`.
- Live funnel reference: `https://local.jumpermedia.co/onboarding/`, inspected at desktop and 390 x 844 mobile.
- Orcafy reference: `https://orcafy.com/lead-generation/`; it returned a WordPress critical-error page during this QA pass, so no current form or layout could be verified from it.
- Rendered implementation: `http://127.0.0.1:4173/`.
- The selected PPC Guru source concept and the current bright implementation were emitted together in one 390 x 844 visual-comparison input after the final color and copy change.

## Findings

- No actionable P0, P1, or P2 findings remain.
- [P3] The real-results and guarantee sections make the page longer than the compact concept image. This is intentional: original dashboard screenshots, client logos, qualification language, and the ad-spend disclosure stay legible instead of being compressed into decorative thumbnails.

## Required fidelity surfaces

- Typography: Passed. Heavy, high-contrast offer typography leads both desktop and mobile; supporting copy remains readable and short.
- Layout and hierarchy: Passed. Desktop uses a two-column offer/form hero. Tablet and phone collapse to one column. The bright pale-lime cover keeps the black-and-blue offer highly legible, and the first mobile viewport shows the hook, credibility checks, guarantee summary, and beginning of the qualification card.
- Funnel design: Passed. The form follows a question-at-a-time three-step flow: business and market, service and budget, then contact details. It includes progress, selected/disabled states, a success screen, and low-friction reassurance.
- Campaign proof: Passed. Seven original Meta screenshots appear in a layered dashboard deck with client identity, displayed metrics, adjacent previews, swipe, arrows, dot navigation, six-second auto-rotation, and a full-screen inspection view.
- Client proof: Passed. The owner-provided "Trusted across 200+ businesses" claim is shown above a continuous moving marquee containing all 57 supplied logos, clearly described as a selection rather than the complete roster.
- Accuracy: Passed. The promise is qualified as a $0 management fee if the agreed target is missed. Ad spend is separate, and the page does not claim that leads equal independently verified sales or revenue.
- Accessibility: Passed for prototype scope. Semantic headings, real labels, visible focus, reduced-motion support, keyboard-operable controls, alt text, and modal focus handling are present.

## Responsive and functional evidence

- 320 x 568: 305 px document width, 305 px scroll width, 275 px form width, and no horizontal overflow.
- 390 x 844: hook and form entry remain visible in the opening mobile experience; the compact header CTA jumps directly to the form.
- 768 x 1024: single-column hero, 650 px form, and no horizontal overflow.
- 1280 x 720: two-column hero, 507 px form, header at the top, and no horizontal overflow.
- Form flow: completed all three steps with synthetic data and reached the personalized success state.
- Results flow: manual next, dot selection, full-size open/close, swipe guard, and six-second automatic advance were verified. Auto-rotation pauses while a desktop pointer is over the deck.
- Asset check: 72 references, 65 unique files, 57 client logos, seven screenshots, one brand asset, zero missing.
- Clean final browser tab: zero console warnings and zero console errors.
- Production build: passed with Vite 6.4.2; 4,571 modules transformed; Sites output prepared.
- Sites packaging tests: four passed, zero failed.

## Comparison history

### Iteration 1

- P2: The previous form was too generic and visually passive.
- Fix: replaced it with a clear three-step qualification funnel modelled on the strongest live-reference pattern: one decision group at a time, explicit progress, meaningful button labels, and reassurance beside the action.

### Iteration 2

- P2: Campaign screenshots looked like a standard card carousel and did not feel like primary proof.
- Fix: rebuilt the section as a layered device-height dashboard deck with visible neighbouring screenshots, real client identities and metrics, direct full-screen inspection, and stronger proof-led copy.

### Iteration 3

- P2: The revised mobile hero still delayed the qualification card.
- Fix: tightened mobile headline sizing, body spacing, trust rows, assurance padding, form stepper spacing, and panel spacing. The form headline now enters the first 844 px viewport without weakening the offer.

### Iteration 4

- P2: The charcoal cover felt too dark and heavy for the owner’s desired tone.
- Fix: changed the complete cover to pale electric lime, switched the primary copy to black with a strong blue guarantee line, retained a white form card, and moved the CTA to black for contrast. Updated the headline to "Get 100 qualified leads. Or our fee is $0." and repeated the qualified guarantee beside the original Meta dashboard proof.
- Post-fix evidence: the 390 x 844 implementation was compared directly with the selected bright source concept. The offer, guarantee, reassurance strip, and form hierarchy remain visible with no dark cover background.

## Open production items

- The form is front-end-only. Do not send paid traffic until it is connected to the approved CRM or form endpoint with consent storage, spam protection, and failure handling.
- Add the approved booking destination, Meta Pixel, Google Ads conversion event, analytics, and final privacy/terms destinations.
- Approve written eligibility, attribution, budget, geography, time-window, invalid-lead, duplicate-lead, and client follow-up rules for the guarantee.

final result: passed
