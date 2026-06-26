/**
 * Headline performance stats — single source of truth so no number contradicts
 * another. `proofType` records what backs each figure so copy can frame it
 * honestly:
 *   - founder_experience : the founders' track record (published as real)
 *   - agency_aggregate   : PPC Guru aggregate results (published as real)
 *   - sample_model       : illustrative dashboard model, always labelled "sample"
 */

export type ProofType = "founder_experience" | "agency_aggregate" | "sample_model";

export type PerfStat = {
  label: string;
  value: string;
  context: string;
  proofType: ProofType;
  verified: boolean;
};

export const performanceStats: PerfStat[] = [
  {
    label: "Google Ads accounts reviewed or managed",
    value: "1,000+",
    context: "Founder-led Google Ads experience",
    proofType: "founder_experience",
    verified: true,
  },
  {
    label: "Quarterly ad portfolio experience",
    value: "$20M+",
    context: "Managed across the founders' careers",
    proofType: "founder_experience",
    verified: true,
  },
  {
    label: "Ad spend managed",
    value: "$10M+",
    context: "PPC Guru client portfolio",
    proofType: "agency_aggregate",
    verified: true,
  },
  {
    label: "Qualified leads generated",
    value: "120,000+",
    context: "Across client campaigns",
    proofType: "agency_aggregate",
    verified: true,
  },
  {
    label: "Average return on ad spend",
    value: "4.2x",
    context: "Blended across active accounts",
    proofType: "agency_aggregate",
    verified: true,
  },
  {
    label: "Active clients",
    value: "35+",
    context: "Service businesses across the GTA & beyond",
    proofType: "agency_aggregate",
    verified: true,
  },
];

/**
 * The hero "sample dashboard" model — ONE source so every number is internally
 * consistent (CPL = spend / leads, revenue = booked × ticket, ROAS = revenue /
 * spend). Always rendered behind a visible "Sample · illustrative" label.
 */
export const heroSampleModel = (() => {
  const spend = 42800;
  const qualifiedLeads = 312;
  const booked = 148; // ~47% of qualified leads book
  const avgTicket = 1388; // realistic service-business ticket
  const wasteRecovered = 7140; // ~17% wasted spend found & resealed
  const trackingHealth = 98;

  const revenue = booked * avgTicket; // 205,424
  const roas = revenue / spend; // ≈ 4.8
  const costPerLead = spend / qualifiedLeads; // ≈ 137

  return { spend, qualifiedLeads, booked, avgTicket, wasteRecovered, trackingHealth, revenue, roas, costPerLead };
})();
