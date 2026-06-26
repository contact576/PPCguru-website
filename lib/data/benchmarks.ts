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

/* ===========================================================================
 * SEPARABLE MODEL (industry economics × platform modifiers)
 * Lets the calculators cover ~36 industries × ~10 platforms without
 * hand-authoring every cell. Per-(industry,platform) `overrides` preserve the
 * directly-sourced rows above. Everything here is additive — the legacy exports
 * stay intact.
 * ========================================================================= */

export type PlatformId =
  | "google-search" | "pmax" | "display" | "youtube"
  | "meta" | "instagram" | "tiktok" | "linkedin"
  | "microsoft" | "pinterest";

export type IntentTier = "high" | "mid" | "low";

export type PlatformModel = {
  id: PlatformId;
  label: string;
  group: "search" | "social" | "video" | "display";
  /** × the industry's baseSearchCpc anchor. */
  cpcMultiplier: number;
  /** Platform-typical CTR (largely industry-independent). */
  ctr: number;
  /** × the industry's baseCvr (intent quality of the click). */
  cvrMultiplier: number;
  intent: IntentTier;
};

export const PLATFORMS: PlatformModel[] = [
  { id: "google-search", label: "Google Search", group: "search", cpcMultiplier: 1.0, ctr: 0.062, cvrMultiplier: 1.0, intent: "high" },
  { id: "microsoft", label: "Microsoft / Bing", group: "search", cpcMultiplier: 0.7, ctr: 0.028, cvrMultiplier: 0.95, intent: "high" },
  { id: "pmax", label: "Performance Max", group: "search", cpcMultiplier: 0.7, ctr: 0.02, cvrMultiplier: 0.72, intent: "mid" },
  { id: "meta", label: "Meta (Facebook)", group: "social", cpcMultiplier: 0.45, ctr: 0.02, cvrMultiplier: 0.7, intent: "mid" },
  { id: "instagram", label: "Instagram", group: "social", cpcMultiplier: 0.5, ctr: 0.022, cvrMultiplier: 0.65, intent: "mid" },
  { id: "tiktok", label: "TikTok", group: "social", cpcMultiplier: 0.35, ctr: 0.018, cvrMultiplier: 0.5, intent: "low" },
  { id: "linkedin", label: "LinkedIn", group: "social", cpcMultiplier: 1.7, ctr: 0.005, cvrMultiplier: 0.6, intent: "mid" },
  { id: "pinterest", label: "Pinterest", group: "social", cpcMultiplier: 0.3, ctr: 0.012, cvrMultiplier: 0.45, intent: "low" },
  { id: "youtube", label: "YouTube", group: "video", cpcMultiplier: 0.3, ctr: 0.008, cvrMultiplier: 0.3, intent: "low" },
  { id: "display", label: "Google Display", group: "display", cpcMultiplier: 0.25, ctr: 0.006, cvrMultiplier: 0.25, intent: "low" },
];

export function getPlatform(id: PlatformId): PlatformModel {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}

export type IndustryEconomics = {
  slug: string;
  label: string;
  avgTicket: number;
  closeRate: number;
  /** Anchor: industry CPC on high-intent search. */
  baseSearchCpc: number;
  /** Anchor: industry lead CVR on a high-intent click. */
  baseCvr: number;
  /** Optional per-industry overrides of the intent-tier defaults. */
  qualificationRate?: number;
  bookedCallRate?: number;
  /** Directly-sourced cells, by platform. */
  overrides?: Partial<Record<PlatformId, PlatformMetrics>>;
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// Existing 15 verticals → economics, preserving their sourced google/meta cells.
const legacyEconomics: IndustryEconomics[] = industryBenchmarks.map((b) => ({
  slug: b.slug,
  label: b.label,
  avgTicket: b.avgTicket,
  closeRate: b.closeRate,
  baseSearchCpc: b.google.cpc,
  baseCvr: b.google.cvr,
  overrides: { "google-search": { ...b.google }, meta: { ...b.meta } },
}));

// Additional verticals (industry-typical estimates; all cells flagged estimate
// via resolveCell unless overridden). Covers the brief's calculator industry set.
const extraEconomics: IndustryEconomics[] = [
  { slug: "chiropractic", label: "Chiropractic", avgTicket: 700, closeRate: 0.35, baseSearchCpc: 5.0, baseCvr: 0.085 },
  { slug: "massage-therapy", label: "Massage Therapy", avgTicket: 120, closeRate: 0.4, baseSearchCpc: 3.2, baseCvr: 0.09 },
  { slug: "personal-training", label: "Personal Training", avgTicket: 900, closeRate: 0.3, baseSearchCpc: 3.0, baseCvr: 0.08 },
  { slug: "mortgage-broker", label: "Mortgage Broker", avgTicket: 4000, closeRate: 0.15, baseSearchCpc: 7.0, baseCvr: 0.06 },
  { slug: "insurance", label: "Insurance", avgTicket: 1200, closeRate: 0.15, baseSearchCpc: 9.0, baseCvr: 0.065 },
  { slug: "accounting", label: "Accounting & Bookkeeping", avgTicket: 1500, closeRate: 0.25, baseSearchCpc: 6.0, baseCvr: 0.07 },
  { slug: "landscaping", label: "Landscaping", avgTicket: 3500, closeRate: 0.3, baseSearchCpc: 5.5, baseCvr: 0.07 },
  { slug: "cleaning-services", label: "Cleaning Services", avgTicket: 400, closeRate: 0.35, baseSearchCpc: 4.0, baseCvr: 0.08 },
  { slug: "auto-repair", label: "Auto Repair", avgTicket: 500, closeRate: 0.4, baseSearchCpc: 3.5, baseCvr: 0.08 },
  { slug: "car-dealership", label: "Car Dealership", avgTicket: 1500, closeRate: 0.1, baseSearchCpc: 2.5, baseCvr: 0.05 },
  { slug: "restaurants", label: "Restaurants", avgTicket: 60, closeRate: 0.5, baseSearchCpc: 1.8, baseCvr: 0.06 },
  { slug: "catering", label: "Catering", avgTicket: 2500, closeRate: 0.3, baseSearchCpc: 3.5, baseCvr: 0.07 },
  { slug: "event-venues", label: "Event Venues", avgTicket: 6000, closeRate: 0.25, baseSearchCpc: 4.5, baseCvr: 0.06 },
  { slug: "wedding-services", label: "Wedding Services", avgTicket: 4000, closeRate: 0.25, baseSearchCpc: 4.0, baseCvr: 0.06 },
  { slug: "ecommerce", label: "E-commerce", avgTicket: 90, closeRate: 0.35, baseSearchCpc: 1.2, baseCvr: 0.025 },
  { slug: "beauty-salon", label: "Beauty & Salon", avgTicket: 120, closeRate: 0.4, baseSearchCpc: 2.5, baseCvr: 0.08 },
  { slug: "education-coaching", label: "Education & Coaching", avgTicket: 1500, closeRate: 0.2, baseSearchCpc: 4.0, baseCvr: 0.06 },
  { slug: "saas", label: "SaaS", avgTicket: 1200, closeRate: 0.15, baseSearchCpc: 6.0, baseCvr: 0.04 },
  { slug: "financial-services", label: "Financial Services", avgTicket: 3000, closeRate: 0.15, baseSearchCpc: 8.0, baseCvr: 0.05 },
  { slug: "travel-hospitality", label: "Travel & Hospitality", avgTicket: 800, closeRate: 0.2, baseSearchCpc: 2.0, baseCvr: 0.04 },
  { slug: "pets-veterinary", label: "Pets & Veterinary", avgTicket: 350, closeRate: 0.4, baseSearchCpc: 3.5, baseCvr: 0.085 },
  { slug: "generic", label: "Generic Local Service", avgTicket: 800, closeRate: 0.3, baseSearchCpc: 5.26, baseCvr: 0.0752 },
];

export const industryEconomics: IndustryEconomics[] = [...legacyEconomics, ...extraEconomics];

export function getEconomics(slug: string): IndustryEconomics {
  return industryEconomics.find((e) => e.slug === slug) ?? industryEconomics[0];
}

/** Effective {cpc, ctr, cvr} for an industry×platform, from override or model. */
export function resolveCell(econ: IndustryEconomics, p: PlatformModel): PlatformMetrics {
  const o = econ.overrides?.[p.id];
  if (o && o.cpc != null && o.ctr != null && o.cvr != null) return { ...o };
  return {
    cpc: round2(o?.cpc ?? econ.baseSearchCpc * p.cpcMultiplier),
    ctr: o?.ctr ?? p.ctr,
    cvr: clamp(o?.cvr ?? econ.baseCvr * p.cvrMultiplier, 0.002, 0.5),
    estimate: true,
  };
}

const QUAL_BY_INTENT: Record<IntentTier, number> = { high: 0.7, mid: 0.5, low: 0.35 };

export type FunnelStage = { low: number; mid: number; high: number };
const stage = (mid: number): FunnelStage => ({ low: mid * 0.75, mid, high: mid * 1.25 });

export type FunnelResult = {
  impressions: FunnelStage;
  clicks: FunnelStage;
  leads: FunnelStage;
  qualifiedLeads: FunnelStage;
  bookedCalls: FunnelStage;
  customers: FunnelStage;
  revenue: FunnelStage;
  costPerLead: number;
  cac: number;
  roas: number;
  meta: { platform: PlatformId; industry: string; cell: PlatformMetrics; intent: IntentTier };
};

/**
 * Forecasting funnel: budget → clicks → leads → qualified leads → booked calls
 * → customers → revenue, each volume stage carrying a low/mid/high range. CPL,
 * CAC and ROAS are point estimates off the mid value.
 */
export function projectFunnel(opts: {
  budget: number;
  platform: PlatformId;
  industrySlug: string;
  avgTicket?: number;
  closeRate?: number;
  qualificationRate?: number;
  bookedCallRate?: number;
}): FunnelResult {
  const econ = getEconomics(opts.industrySlug);
  const p = getPlatform(opts.platform);
  const cell = resolveCell(econ, p);
  const avgTicket = opts.avgTicket ?? econ.avgTicket;
  const closeRate = opts.closeRate ?? econ.closeRate;
  const qualRate = opts.qualificationRate ?? econ.qualificationRate ?? QUAL_BY_INTENT[p.intent];
  const bookedRate = opts.bookedCallRate ?? econ.bookedCallRate ?? 0.6;

  const clicks = cell.cpc > 0 ? opts.budget / cell.cpc : 0;
  const impressions = cell.ctr > 0 ? clicks / cell.ctr : 0;
  const leads = clicks * cell.cvr;
  const qualifiedLeads = leads * qualRate;
  const bookedCalls = qualifiedLeads * bookedRate;
  const customers = leads * closeRate; // kept off total leads for ROAS continuity
  const revenue = customers * avgTicket;
  const costPerLead = leads > 0 ? opts.budget / leads : 0;
  const cac = customers > 0 ? opts.budget / customers : 0;
  const roas = opts.budget > 0 ? revenue / opts.budget : 0;

  return {
    impressions: stage(impressions),
    clicks: stage(clicks),
    leads: stage(leads),
    qualifiedLeads: stage(qualifiedLeads),
    bookedCalls: stage(bookedCalls),
    customers: stage(customers),
    revenue: stage(revenue),
    costPerLead,
    cac,
    roas,
    meta: { platform: p.id, industry: econ.slug, cell, intent: p.intent },
  };
}
