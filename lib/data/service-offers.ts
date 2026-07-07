/**
 * Lead-generation offers — the single source for page-specific hooks, popups,
 * CTAs and the master offer set. Every offer here is CONFIRMED by the client as
 * real and honest (publish as fact):
 *   - 30-day FREE TRIAL (Google Ads OR Meta Ads management) — no contract, no
 *     setup fee, no upfront payment, no obligation, walk away anytime. We run the
 *     ads for 30 days free; you only move to a contract if you're happy with the
 *     leads. (Applies to google-ads + meta-ads only.)
 *   - Free page-specific audit / account review (universal, no obligation).
 *   - Up to $3,600 in Google Ads credit (Google Partner; eligibility set by Google).
 *
 * Edit copy here; components (offer-popup, floating-cta, service templates,
 * lead-band, announcement bar) read from this file so the offer stays consistent.
 */

/** Master offers reused across surfaces. */
export const masterOffer = {
  trial: {
    label: "30-day free trial",
    headline: "Try our ad management free for 30 days",
    body:
      "Switching agencies, or not happy with your current results? We'll run your Google or Meta ads for 30 days — completely free. No contract, no setup fee, no upfront payment. You only continue if you're happy with the leads.",
    cta: "Start my 30-day free trial",
    /** Services the trial applies to. */
    services: ["google-ads", "meta-ads"] as const,
  },
  audit: {
    label: "Free audit",
    headline: "Get a free account audit",
    body:
      "We'll review your account, tracking and competitors and show you exactly where the opportunity is — no obligation.",
    cta: "Get my free audit",
  },
  credit: {
    label: "Up to $3,600 Google Ads credit",
    body:
      "As a Google Partner, we can set up to $3,600 in Google Ads credit for eligible new accounts — on top of your free audit.",
    fine: "Eligibility and credit amount set by Google. We confirm the details on your audit call.",
  },
  /** Short risk-reversal chips shown near CTAs and forms. */
  riskReversal: ["No contract", "No setup fee", "No obligation", "You keep your account"],
} as const;

export type ServiceOffer = {
  /** Short offer hook (hero chip / eyebrow). */
  hook: string;
  /** One supporting sentence. */
  subhook: string;
  /** Page-specific popup title + body. */
  popupTitle: string;
  popupBody: string;
  /** CTA label used on the hero + lead band. */
  ctaLabel: string;
  /** captureLead `source` tag. */
  formSource: string;
  /** Does the 30-day free trial apply to this service? */
  trial: boolean;
  /** Does the up-to-$3,600 Google Ads credit apply? */
  credit: boolean;
};

/** Keyed by service slug. Services without an entry fall back to the generic audit offer. */
export const serviceOffers: Record<string, ServiceOffer> = {
  "google-ads": {
    hook: "Free Google Ads audit + 30-day free trial",
    subhook: "Find the wasted spend before you scale — no contract, no setup fee.",
    popupTitle: "Spending on Google Ads?",
    popupBody:
      "Get a free account audit and find wasted spend before you increase your budget — or try our management free for 30 days. No contract, no setup fee.",
    ctaLabel: "Get my free Google Ads audit",
    formSource: "offer:google-ads",
    trial: true,
    credit: true,
  },
  "meta-ads": {
    hook: "Free Meta creative & lead-quality review + 30-day free trial",
    subhook: "Fix creative, targeting and lead quality before you spend more.",
    popupTitle: "Getting Meta leads, but poor quality?",
    popupBody:
      "Get a free creative & lead-quality review — or try our Meta ad management free for 30 days. No contract, no setup fee, no obligation.",
    ctaLabel: "Get my free Meta review",
    formSource: "offer:meta-ads",
    trial: true,
    credit: false,
  },
  seo: {
    hook: "Free SEO visibility audit",
    subhook: "See exactly why competitors outrank you — and how to close the gap.",
    popupTitle: "Want to know why competitors rank above you?",
    popupBody:
      "Get a free SEO visibility audit — rankings, technical SEO, content gaps, local SEO and competitor gaps, with a prioritized plan. No obligation.",
    ctaLabel: "Get my free SEO audit",
    formSource: "offer:seo",
    trial: false,
    credit: false,
  },
  "cro-landing-pages": {
    hook: "Free landing-page conversion review",
    subhook: "Getting clicks but no leads? We'll show you why — and what to change.",
    popupTitle: "Getting clicks but no leads?",
    popupBody:
      "Get a free landing-page conversion review — we pinpoint why visitors aren't converting and the highest-impact fixes to make. No obligation.",
    ctaLabel: "Review my landing page",
    formSource: "offer:cro",
    trial: false,
    credit: false,
  },
  "web-design": {
    hook: "Free website conversion review",
    subhook: "Is your site turning visitors into leads — or losing them?",
    popupTitle: "Is your website winning you leads?",
    popupBody:
      "Get a free website conversion review — speed, structure, messaging and the changes that would turn more visitors into booked jobs. No obligation.",
    ctaLabel: "Review my website",
    formSource: "offer:web-design",
    trial: false,
    credit: false,
  },
  creative: {
    hook: "Free ad creative audit",
    subhook: "See which creatives are working — and what to test next.",
    popupTitle: "Are your ad creatives pulling their weight?",
    popupBody:
      "Get a free ad creative audit — what's fatiguing, what to test next, and the angles most likely to lift results. No obligation.",
    ctaLabel: "Get my free creative audit",
    formSource: "offer:creative",
    trial: false,
    credit: false,
  },
  "youtube-ads": {
    hook: "Free YouTube Ads audit",
    subhook: "Turn views into leads and booked jobs — not just impressions.",
    popupTitle: "Running YouTube Ads?",
    popupBody: "Get a free YouTube Ads audit — targeting, creative and tracking, with the fixes that turn views into leads. No obligation.",
    ctaLabel: "Get my free YouTube audit",
    formSource: "offer:youtube-ads",
    trial: false,
    credit: false,
  },
  "microsoft-ads": {
    hook: "Free Microsoft (Bing) Ads audit",
    subhook: "Cheaper clicks and buyer-heavy audiences — done right.",
    popupTitle: "On Microsoft Ads (or should you be)?",
    popupBody: "Get a free Microsoft/Bing Ads audit — where the cheaper clicks and untapped audiences are for your business. No obligation.",
    ctaLabel: "Get my free Microsoft Ads audit",
    formSource: "offer:microsoft-ads",
    trial: false,
    credit: false,
  },
  "tiktok-ads": {
    hook: "Free TikTok Ads audit",
    subhook: "Native creative and spark ads that actually convert.",
    popupTitle: "Trying TikTok Ads?",
    popupBody: "Get a free TikTok Ads audit — creative angles, targeting and tracking built for lead gen, not just views. No obligation.",
    ctaLabel: "Get my free TikTok audit",
    formSource: "offer:tiktok-ads",
    trial: false,
    credit: false,
  },
  "linkedin-ads": {
    hook: "Free LinkedIn Ads audit",
    subhook: "Reach the right decision-makers without burning budget.",
    popupTitle: "Running LinkedIn Ads for B2B?",
    popupBody: "Get a free LinkedIn Ads audit — targeting, offer and lead-form setup that keeps your cost-per-lead in check. No obligation.",
    ctaLabel: "Get my free LinkedIn audit",
    formSource: "offer:linkedin-ads",
    trial: false,
    credit: false,
  },
  "pinterest-ads": {
    hook: "Free Pinterest Ads audit",
    subhook: "Capture high-intent shoppers before your competitors do.",
    popupTitle: "Exploring Pinterest Ads?",
    popupBody: "Get a free Pinterest Ads audit — creative, targeting and shopping setup tuned for intent-driven conversions. No obligation.",
    ctaLabel: "Get my free Pinterest audit",
    formSource: "offer:pinterest-ads",
    trial: false,
    credit: false,
  },
  crm: {
    hook: "Free lead-flow & CRM audit",
    subhook: "Stop losing leads between the click and the call.",
    popupTitle: "Are leads slipping through the cracks?",
    popupBody: "Get a free lead-flow & CRM audit — speed-to-lead, follow-up and reporting gaps that are costing you booked jobs. No obligation.",
    ctaLabel: "Get my free lead-flow audit",
    formSource: "offer:crm",
    trial: false,
    credit: false,
  },
  "ai-automation": {
    hook: "Free marketing automation audit",
    subhook: "See where AI can save hours and speed up every follow-up.",
    popupTitle: "Where could automation save you hours?",
    popupBody: "Get a free automation audit — the follow-up, routing and reporting we'd automate first to win back time and leads. No obligation.",
    ctaLabel: "Get my free automation audit",
    formSource: "offer:ai-automation",
    trial: false,
    credit: false,
  },
};

/** Generic fallback offer (non-service pages / unknown slug). */
export const genericOffer: ServiceOffer = {
  hook: "Free marketing audit",
  subhook: "See where your budget is leaking — and where better leads can come from.",
  popupTitle: "See where your marketing budget is leaking",
  popupBody:
    "Get a free, no-obligation audit of your Google or Meta account — wasted spend, tracking gaps and the first fixes we'd make. Or try our ad management free for 30 days.",
  ctaLabel: masterOffer.audit.cta,
  formSource: "offer:generic",
  trial: true,
  credit: true,
};

export function getServiceOffer(slug?: string): ServiceOffer | undefined {
  return slug ? serviceOffers[slug] : undefined;
}

/** Resolve the best offer for a pathname (e.g. "/services/google-ads/dental"). */
export function offerForPath(pathname: string): ServiceOffer {
  const m = pathname.match(/^\/services\/([^/]+)/);
  if (m && serviceOffers[m[1]]) return serviceOffers[m[1]];
  return genericOffer;
}
