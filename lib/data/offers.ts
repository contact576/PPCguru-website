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
    eyebrow: "Google Partner offer",
    title: "Up to $3,600 in Google Ads credit",
    body:
      "As a Google Partner, we can set up to $3,600 in Google Ads credit for eligible new accounts — plus a free account audit to make sure every dollar works.",
    cta: "Claim my Google Ads credit",
    fine: "Eligibility and credit amount set by Google. We confirm details on your audit call.",
  },
  /** Flagship — the 30-day free trial (Google/Meta ad management). */
  trial: {
    eyebrow: "30-day free trial",
    title: "Try our ad management free for 30 days",
    body:
      "Switching agencies or not happy with your results? We'll run your Google or Meta ads for 30 days free — no contract, no setup fee, no upfront payment. Continue only if you're happy with the leads.",
    cta: "Start my 30-day free trial",
    fine: "Trial covers management; ad spend is billed by the platform. No obligation — walk away anytime.",
  },
} as const;

export type Offer = typeof offers;
