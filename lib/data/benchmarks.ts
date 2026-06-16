/**
 * Ad performance benchmark dataset powering the Google Ads & Meta Ads
 * calculators. The calculators do deterministic arithmetic on these numbers —
 * no AI — so outputs are reproducible and defensible.
 *
 * SOURCING:
 *  - Anchored to WordStream / LocalIQ 2024–2025 industry benchmark reports and
 *    corroborating aggregators (Triple Whale, Visible Factors, Sovran).
 *  - Rows flagged estimate:true are interpolated from the documented
 *    overall averages + the vertical's relative position; verify against
 *    first-party account data before treating as fact.
 *  - Average ticket/deal values are rough industry-typical defaults and are
 *    user-editable in the calculator.
 *
 * Always shown to the user with the DISCLAIMER below.
 */

export const BENCHMARK_DISCLAIMER =
  "Illustrative projections based on 2024–2025 industry-average benchmarks (WordStream/LocalIQ and corroborating sources). Real results vary by offer, location, landing page, season and competition. Not a guarantee of performance.";

export const BENCHMARK_SOURCES = [
  "WordStream / LocalIQ — Google Ads Benchmarks 2024–2025",
  "WordStream / LocalIQ — Facebook (Meta) Ads Benchmarks 2024–2025",
  "Triple Whale, Visible Factors, Sovran — Meta CPM aggregates 2025",
];

export type PlatformMetrics = {
  /** Average cost-per-click, USD. */
  cpc: number;
  /** Click-through rate, as a fraction (0.0666 = 6.66%). */
  ctr: number;
  /** Landing-page / lead conversion rate, as a fraction. */
  cvr: number;
  /** Whether the row is interpolated rather than directly sourced. */
  estimate?: boolean;
};

export type IndustryBenchmark = {
  slug: string;
  label: string;
  /** Average revenue per won customer/job, USD (editable default). */
  avgTicket: number;
  /** Typical lead→customer close rate for the vertical, as a fraction. */
  closeRate: number;
  google: PlatformMetrics;
  meta: PlatformMetrics;
};

/** All-industry fallbacks (WordStream/LocalIQ). */
export const OVERALL = {
  google: { cpc: 5.26, ctr: 0.0666, cvr: 0.0752 } as PlatformMetrics,
  meta: { cpc: 1.92, ctr: 0.0259, cvr: 0.0772 } as PlatformMetrics,
};

export const industryBenchmarks: IndustryBenchmark[] = [
  {
    slug: "physiotherapy",
    label: "Physiotherapy & Rehab",
    avgTicket: 650,
    closeRate: 0.35,
    google: { cpc: 4.8, ctr: 0.064, cvr: 0.09, estimate: true },
    meta: { cpc: 3.1, ctr: 0.0172, cvr: 0.065, estimate: true },
  },
  {
    slug: "healthcare-clinics",
    label: "Healthcare & Medical Clinics",
    avgTicket: 850,
    closeRate: 0.3,
    google: { cpc: 5.5, ctr: 0.06, cvr: 0.11 },
    meta: { cpc: 2.4, ctr: 0.0302, cvr: 0.06, estimate: true },
  },
  {
    slug: "dental",
    label: "Dental & Orthodontics",
    avgTicket: 1200,
    closeRate: 0.35,
    google: { cpc: 6.82, ctr: 0.06, cvr: 0.08, estimate: true },
    meta: { cpc: 9.78, ctr: 0.0105, cvr: 0.07, estimate: true },
  },
  {
    slug: "hvac",
    label: "HVAC & Home Comfort",
    avgTicket: 5500,
    closeRate: 0.4,
    google: { cpc: 9.68, ctr: 0.062, cvr: 0.0656 },
    meta: { cpc: 2.2, ctr: 0.0194, cvr: 0.055, estimate: true },
  },
  {
    slug: "plumbing",
    label: "Plumbing",
    avgTicket: 600,
    closeRate: 0.45,
    google: { cpc: 10.49, ctr: 0.062, cvr: 0.0763 },
    meta: { cpc: 2.0, ctr: 0.019, cvr: 0.05, estimate: true },
  },
  {
    slug: "electrical",
    label: "Electrical",
    avgTicket: 800,
    closeRate: 0.45,
    google: { cpc: 12.18, ctr: 0.06, cvr: 0.0908 },
    meta: { cpc: 2.0, ctr: 0.018, cvr: 0.05, estimate: true },
  },
  {
    slug: "construction-renovation",
    label: "Construction & Renovation",
    avgTicket: 25000,
    closeRate: 0.2,
    google: { cpc: 6.5, ctr: 0.055, cvr: 0.06, estimate: true },
    meta: { cpc: 1.8, ctr: 0.015, cvr: 0.06, estimate: true },
  },
  {
    slug: "roofing",
    label: "Roofing",
    avgTicket: 11000,
    closeRate: 0.25,
    google: { cpc: 8.0, ctr: 0.058, cvr: 0.07, estimate: true },
    meta: { cpc: 2.1, ctr: 0.018, cvr: 0.06, estimate: true },
  },
  {
    slug: "immigration",
    label: "Immigration Consulting",
    avgTicket: 3500,
    closeRate: 0.25,
    google: { cpc: 7.5, ctr: 0.06, cvr: 0.08, estimate: true },
    meta: { cpc: 3.0, ctr: 0.018, cvr: 0.07, estimate: true },
  },
  {
    slug: "law-firms",
    label: "Law Firms & Legal",
    avgTicket: 3500,
    closeRate: 0.2,
    google: { cpc: 8.86, ctr: 0.055, cvr: 0.07 },
    meta: { cpc: 4.1, ctr: 0.012, cvr: 0.1053 },
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    avgTicket: 8000,
    closeRate: 0.12,
    google: { cpc: 3.5, ctr: 0.07, cvr: 0.06, estimate: true },
    meta: { cpc: 1.4, ctr: 0.037, cvr: 0.1068 },
  },
  {
    slug: "home-improvement",
    label: "Home Improvement & Remodeling",
    avgTicket: 8000,
    closeRate: 0.22,
    google: { cpc: 6.96, ctr: 0.06, cvr: 0.065 },
    meta: { cpc: 2.0, ctr: 0.0194, cvr: 0.0522 },
  },
  {
    slug: "fitness-gyms",
    label: "Fitness & Gyms",
    avgTicket: 700,
    closeRate: 0.3,
    google: { cpc: 2.8, ctr: 0.07, cvr: 0.08, estimate: true },
    meta: { cpc: 1.07, ctr: 0.026, cvr: 0.1429 },
  },
  {
    slug: "med-spa",
    label: "Med Spa & Aesthetics",
    avgTicket: 1200,
    closeRate: 0.3,
    google: { cpc: 5.5, ctr: 0.06, cvr: 0.07, estimate: true },
    meta: { cpc: 3.06, ctr: 0.018, cvr: 0.0529 },
  },
  {
    slug: "professional-services",
    label: "Professional & B2B Services",
    avgTicket: 2500,
    closeRate: 0.25,
    google: { cpc: 5.0, ctr: 0.06, cvr: 0.07, estimate: true },
    meta: { cpc: 2.5, ctr: 0.015, cvr: 0.07, estimate: true },
  },
];

export function getBenchmark(slug: string) {
  return industryBenchmarks.find((b) => b.slug === slug) ?? industryBenchmarks[0];
}

export type Platform = "google" | "meta";

export type CalculatorResult = {
  clicks: number;
  leads: number;
  costPerLead: number;
  customers: number;
  revenue: number;
  roas: number;
  profitMultiple: number;
};

/**
 * Core projection math used by both calculators.
 * impressions are derived from clicks/CTR for display; the lead funnel is
 * budget → clicks (budget/CPC) → leads (clicks*CVR) → customers (leads*close).
 */
export function projectResults(opts: {
  budget: number;
  platform: Platform;
  benchmark: IndustryBenchmark;
  avgTicket?: number;
  closeRate?: number;
}): CalculatorResult & { impressions: number } {
  const m = opts.benchmark[opts.platform];
  const avgTicket = opts.avgTicket ?? opts.benchmark.avgTicket;
  const closeRate = opts.closeRate ?? opts.benchmark.closeRate;

  const clicks = m.cpc > 0 ? opts.budget / m.cpc : 0;
  const impressions = m.ctr > 0 ? clicks / m.ctr : 0;
  const leads = clicks * m.cvr;
  const costPerLead = leads > 0 ? opts.budget / leads : 0;
  const customers = leads * closeRate;
  const revenue = customers * avgTicket;
  const roas = opts.budget > 0 ? revenue / opts.budget : 0;

  return {
    impressions,
    clicks,
    leads,
    costPerLead,
    customers,
    revenue,
    roas,
    profitMultiple: roas,
  };
}
