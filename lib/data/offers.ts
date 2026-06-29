/**
 * Conversion offers — single source for the lead-capture pop-up funnel and CTAs.
 * Edit copy here; components read from this file.
 */

export const offers = {
  /** Step 1 — arrival modal. */
  audit: {
    eyebrow: "Free account audit",
    title: "See where your ad spend is leaking",
    body:
      "Get a free, no-obligation audit of your Google or Meta account — wasted spend, tracking gaps, and the first three fixes we'd make. Built like a mini audit report, not a sales call.",
    cta: "Get my free audit",
    fields: ["name", "email", "phone", "website"] as const,
  },
  /** Step 2 — bottom-right slide-in, armed after the modal is dismissed. */
  credit: {
    eyebrow: "Limited offer",
    title: "$600 in free Google Ads credit",
    body:
      "Start a managed campaign with us and we'll set up your $600 Google Ads credit — plus a free account audit to make sure every dollar works.",
    cta: "Claim $600 credit",
    fine: "Eligibility set by Google. We'll confirm details on your audit call.",
  },
} as const;

export type Offer = typeof offers;
