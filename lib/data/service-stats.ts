/**
 * Per-service trust stats — the "numbers that speak louder than promises" band rendered
 * near the top of each service page (and on the [service]/[industry] pages).
 *
 * CLIENT-DIRECTED figures, kept internally consistent with the canonical aggregate in
 * lib/data/performance-stats.ts (`trustFacts`):
 *   - paid-channel "ad spend managed" sums to ~$100M (the aggregate)
 *   - paid leads (~620K) + SEO organic (~380K) ≈ the 1M+ qualified-leads aggregate
 *   - client counts intentionally OVERLAP (one client uses several services), so they do
 *     NOT sum to the 500+ unique-businesses aggregate — that's expected, not a contradiction.
 *
 * Every figure is [VERIFY-client] — swap for audited numbers before launch in this one file.
 * Basis lines are shown as small print so the numbers read as honest, sourced claims (a key
 * E-E-A-T / LLM-citation signal), never as guarantees.
 */

export type ServiceStat = { value: string; label: string };
export type ServiceStatBlock = { stats: ServiceStat[]; basis: string };

const PAID_BASIS =
  "Across PPC Guru client campaigns, 2021–2026 · client-reported & blended · representative, not a guarantee.";
const ORGANIC_BASIS =
  "Across PPC Guru SEO engagements, 2021–2026 · client-reported & blended · representative, not a guarantee.";
const BUILD_BASIS =
  "Across PPC Guru engagements, 2021–2026 · client-reported · representative, not a guarantee.";

/** Shared credentials line shown alongside the per-service numbers. [VERIFY-client] */
export const serviceCredentials = [
  "Google Partner",
  "Meta Business Partner",
  "10+ yrs combined founder experience",
  "500+ businesses served",
] as const;

/** Keyed by service slug. Undefined for an unknown slug → the stat band simply doesn't render. */
export const serviceStats: Record<string, ServiceStatBlock> = {
  "google-ads": {
    stats: [
      { value: "$65M+", label: "Google Ads spend managed" },
      { value: "320K+", label: "qualified leads generated" },
      { value: "6.8x", label: "average return on ad spend" },
      { value: "500+", label: "businesses served" },
    ],
    basis: PAID_BASIS,
  },
  "meta-ads": {
    stats: [
      { value: "$26M+", label: "Meta ad spend managed" },
      { value: "180K+", label: "qualified leads generated" },
      { value: "5.9x", label: "average return on ad spend" },
      { value: "300+", label: "businesses served" },
    ],
    basis: PAID_BASIS,
  },
  "youtube-ads": {
    stats: [
      { value: "$6M+", label: "YouTube ad spend managed" },
      { value: "35K+", label: "leads & view-through actions" },
      { value: "5.2x", label: "average return on ad spend" },
      { value: "120+", label: "businesses served" },
    ],
    basis: PAID_BASIS,
  },
  "microsoft-ads": {
    stats: [
      { value: "$500K+", label: "Microsoft Ads spend managed" },
      { value: "30K+", label: "qualified leads generated" },
      { value: "6.1x", label: "average return on ad spend" },
      { value: "40+", label: "businesses served" },
    ],
    basis: PAID_BASIS,
  },
  "tiktok-ads": {
    stats: [
      { value: "$4M+", label: "TikTok ad spend managed" },
      { value: "25K+", label: "leads generated" },
      { value: "4.8x", label: "average return on ad spend" },
      { value: "25+", label: "businesses served" },
    ],
    basis: PAID_BASIS,
  },
  "linkedin-ads": {
    stats: [
      { value: "$4M+", label: "LinkedIn ad spend managed" },
      { value: "14K+", label: "B2B leads generated" },
      { value: "4.5x", label: "average return on ad spend" },
      { value: "30+", label: "businesses served" },
    ],
    basis: PAID_BASIS,
  },
  "pinterest-ads": {
    stats: [
      { value: "$3M+", label: "Pinterest ad spend managed" },
      { value: "16K+", label: "leads generated" },
      { value: "4.6x", label: "average return on ad spend" },
      { value: "25+", label: "businesses served" },
    ],
    basis: PAID_BASIS,
  },
  seo: {
    stats: [
      { value: "120+", label: "businesses ranked" },
      { value: "380K+", label: "organic leads generated" },
      { value: "1,500+", label: "keywords ranked on page 1" },
      { value: "10+ yrs", label: "founder SEO experience" },
    ],
    basis: ORGANIC_BASIS,
  },
  "web-design": {
    stats: [
      { value: "140+", label: "websites & landing pages launched" },
      { value: "+38%", label: "average lift in conversion rate" },
      { value: "<2s", label: "typical load time (Core Web Vitals)" },
      { value: "100%", label: "you own the site & code" },
    ],
    basis: BUILD_BASIS,
  },
  "cro-landing-pages": {
    stats: [
      { value: "200+", label: "A/B tests & experiments run" },
      { value: "+27%", label: "average conversion-rate lift" },
      { value: "90 days", label: "to a statistically-significant win" },
      { value: "100%", label: "decisions backed by data" },
    ],
    basis: BUILD_BASIS,
  },
  creative: {
    stats: [
      { value: "12,000+", label: "ad creatives produced" },
      { value: "500+", label: "concepts tested against fatigue" },
      { value: "Weekly", label: "fresh creative shipped" },
      { value: "AI + human", label: "production system" },
    ],
    basis: BUILD_BASIS,
  },
  crm: {
    stats: [
      { value: "60+", label: "CRM & automation builds" },
      { value: "1M+", label: "leads routed & nurtured" },
      { value: "<5 min", label: "target speed-to-lead" },
      { value: "24/7", label: "automated follow-up" },
    ],
    basis: BUILD_BASIS,
  },
  "ai-automation": {
    stats: [
      { value: "40+", label: "AI workflows deployed" },
      { value: "1,000s", label: "of hours saved for clients" },
      { value: "24/7", label: "automated lead response" },
      { value: "AI + human", label: "every output reviewed" },
    ],
    basis: BUILD_BASIS,
  },
};

export function getServiceStats(slug: string): ServiceStatBlock | undefined {
  return serviceStats[slug];
}
