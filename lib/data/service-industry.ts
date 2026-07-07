/**
 * Service × Industry matrix helpers — powers the expandable "[Service] for [Industry]"
 * accordion on service pages AND the dedicated /services/[slug]/[industry] routes.
 * Content lives in the generated lib/data/service-industry-content.ts; this module adds
 * the typed shape, display names and lookup helpers.
 */
import { serviceIndustryContent } from "./service-industry-content";

export type ServiceIndustryAngle = {
  /** What good looks like (and the common mistakes we fix). */
  goodPractices: string[];
  /** Best-practice tactics PPC Guru applies for this vertical. */
  bestPractices: string[];
  /** Typical / representative benchmarks (ranges, not guarantees). */
  industryStandards: string[];
  /** What a client can expect working with us (goals, not promises). */
  whatToExpect: string[];
};

/** Short service names for "[Service] for [Industry]" labels + page titles. */
export const serviceShortName: Record<string, string> = {
  "google-ads": "Google Ads",
  seo: "SEO",
  "web-design": "Web Design",
  crm: "CRM & Automation",
  "meta-ads": "Meta Ads",
  creative: "Creative",
};

/** Short industry names for labels. */
export const industryShortName: Record<string, string> = {
  physiotherapy: "Physiotherapy Clinics",
  "healthcare-clinics": "Healthcare Clinics",
  dental: "Dental Practices",
  hvac: "HVAC Companies",
  plumbing: "Plumbing Companies",
  electrical: "Electrical Contractors",
  "construction-renovation": "Construction & Renovation",
  roofing: "Roofing Companies",
  immigration: "Immigration Consultants",
  "law-firms": "Law Firms",
  "real-estate": "Real Estate",
  "home-improvement": "Home Improvement",
  "fitness-gyms": "Gyms & Fitness Studios",
  "med-spa": "Med Spas",
  "professional-services": "Professional & B2B Services",
};

export function getServiceIndustryAngle(serviceSlug: string, industrySlug: string): ServiceIndustryAngle | undefined {
  return serviceIndustryContent[serviceSlug]?.[industrySlug];
}

/** Industry slugs that have a "[service] for [industry]" page/section. */
export function industriesForService(serviceSlug: string): string[] {
  return Object.keys(serviceIndustryContent[serviceSlug] ?? {});
}

/** All (service, industry) pairs — drives generateStaticParams + the sitemap. */
export function allServiceIndustryPairs(): { service: string; industry: string }[] {
  const pairs: { service: string; industry: string }[] = [];
  for (const service of Object.keys(serviceIndustryContent)) {
    for (const industry of Object.keys(serviceIndustryContent[service])) {
      pairs.push({ service, industry });
    }
  }
  return pairs;
}

export function serviceIndustryLabel(serviceSlug: string, industrySlug: string): string {
  return `${serviceShortName[serviceSlug] ?? serviceSlug} for ${industryShortName[industrySlug] ?? industrySlug}`;
}
