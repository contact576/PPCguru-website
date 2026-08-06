/**
 * Conversion offers — single source for the lead-capture pop-up funnel and CTAs.
 * Edit copy here; components read from this file.
 */

export const offers = {
  /** Step 1 — arrival modal. */
  audit: {
    eyebrow: "Free website audit",
    title: "See where your website and ad spend are leaking",
    body:
      "Get a free, no-obligation website audit — conversion gaps, tracking problems, wasted ad spend, and the first three fixes we'd make. Built like a mini audit report, not a sales call.",
    cta: "Get my free website audit",
    fields: ["name", "email", "phone", "website"] as const,
  },
  /** Step 2 — bottom-right slide-in, armed after the modal is dismissed. */
  credit: {
    eyebrow: "Google Partner offer",
    title: "Up to $3,600 in Google Ads credit",
    body:
      "As a Google Partner, we can set up to $3,600 in Google Ads credit for eligible new accounts — plus a free account audit to make sure every dollar works.",
    cta: "Claim my Google Ads credit",
    fine: "Eligibility and credit amount set by Google. We confirm details on your audit call.",
  },
} as const;

export type Offer = typeof offers;
