/**
 * Data for the "100 Qualified Leads" paid-traffic landing page (/100-leads) —
 * ported from the standalone Vite build on branch `landing-page`.
 *
 * Shared by the client page (renders the choices), the server action (validates
 * the SAME ids, so a spoofed option can't reach Supabase/CRM) and the admin
 * view (turns stored ids back into labels). Keep ids stable: they are stored
 * verbatim in `landing_page_leads.business_type` / `.budget`.
 */

export const LANDING_PATH = "/100-leads";
export const LANDING_THANK_YOU_PATH = "/100-leads/thank-you";
/** `leads.source` value — the /admin/leads "Source" chip and the CRM note. */
export const LANDING_SOURCE = "landing:100-leads";
/** `leads.service` text for these submissions (free text, not a SERVICE_OPTIONS value). */
export const LANDING_SERVICE_LABEL = "100 Qualified Leads guarantee (Google Ads + Meta Ads)";

export const BUSINESS_TYPES = [
  { id: "home-services", label: "Home services" },
  { id: "construction", label: "Construction & trades" },
  { id: "healthcare", label: "Health & wellness" },
  { id: "professional", label: "Professional service" },
] as const;

export const LANDING_BUDGETS = [
  { id: "under-2500", label: "Under $2,500" },
  { id: "2500-5000", label: "$2,500–$5,000" },
  { id: "5000-10000", label: "$5,000–$10,000" },
  { id: "10000-plus", label: "$10,000+" },
] as const;

export type BusinessTypeId = (typeof BUSINESS_TYPES)[number]["id"];
export type LandingBudgetId = (typeof LANDING_BUDGETS)[number]["id"];

export const BUSINESS_TYPE_IDS = BUSINESS_TYPES.map((b) => b.id) as [BusinessTypeId, ...BusinessTypeId[]];
export const LANDING_BUDGET_IDS = LANDING_BUDGETS.map((b) => b.id) as [LandingBudgetId, ...LandingBudgetId[]];

export function businessTypeLabel(id: string | null | undefined): string {
  return BUSINESS_TYPES.find((b) => b.id === id)?.label ?? (id || "—");
}

export function budgetLabel(id: string | null | undefined): string {
  return LANDING_BUDGETS.find((b) => b.id === id)?.label ?? (id || "—");
}

/** Files under /public/landing/logos — 57 supplied client logos (+ ppc-guru.png, the brand mark). */
export const clientLogos = [
  "a2z-comfort.png",
  "ace-equity.png",
  "acure-security-solutions.jpg",
  "apexshine-cleaning-inc.png",
  "apna-tiffin-service.jpg",
  "best-western.svg",
  "bindra-world-immigration-terminal-inc.jpg",
  "blockline-physiotherapy-wellness.png",
  "bombay-chaat-saskatoon.png",
  "boston-pizza.svg",
  "btdt-beentheredonethat.webp",
  "century-21-canada.png",
  "choice-hotels.svg",
  "civia-jewels.svg",
  "cora-breakfast-lunch.webp",
  "dave-financial-services-inc.webp",
  "ecocare-home-comfort.png",
  "gcad-construction.png",
  "ginos-pizza.svg",
  "global-financial-impact.svg",
  "gnc-facility-services.jpg",
  "jk-appliance-repair-inc.webp",
  "lavish-artigiano-inc.webp",
  "little-caesars.svg",
  "loyalty-real-estate-brokerage.webp",
  "marriott.svg",
  "mary-brown-s.svg",
  "mc-concrete-cutting-mc-construction.png",
  "mdi-reno-and-construction-ltd.png",
  "millennial-events.webp",
  "mina-yousefi-immigration-service-myis.jpg",
  "mr-lube.png",
  "north-york-healthcare-associates.webp",
  "norths-construction.jpg",
  "one-percent-sold.png",
  "oxford-learning.svg",
  "palmdale-health-center.png",
  "pizza-nova.svg",
  "pizza-pizza.png",
  "project-pioneer-construction.jpg",
  "re-max-canada.png",
  "rehab-clinic.png",
  "rehab2go.png",
  "rj-cad-solutions-inc.png",
  "royal-lepage-platinum-realty-brokerage.svg",
  "scholars-ed.svg",
  "sold-by-kaushik-real-estate.svg",
  "the-ups-store-604.svg",
  "therapy-villa.png",
  "three-sisters-pharmacy.png",
  "true-life-wellness-and-physiotherapy.png",
  "upwell-homecare-inc-qualicare-peel.webp",
  "vin-engineering-inc.png",
  "westway-immigration.png",
  "wing-machine.png",
  "xceed-homes.png",
  "xpertech.png",
] as const;

export type CampaignResult = {
  client: string;
  result: string;
  cost: string;
  spend: string;
  /** Screenshot under /public/landing/results */
  file: string;
  /** Logo under /public/landing/logos */
  logo: string;
};

/** Seven original Meta Ads dashboard screenshots supplied by PPC Guru. */
export const campaignResults: CampaignResult[] = [
  { client: "MC Constructions", result: "36 conversations", cost: "CA$15.64 / conversation", spend: "CA$562.87 spent", file: "mc-constructions.jpeg", logo: "mc-concrete-cutting-mc-construction.png" },
  { client: "True Life Wellness", result: "93 form leads", cost: "CA$12.43 / lead", spend: "CA$1,156.04 spent", file: "true-life-wellness.jpeg", logo: "true-life-wellness-and-physiotherapy.png" },
  { client: "Projects Pioneer", result: "432 conversations", cost: "CA$23.98 / conversation", spend: "CA$10,360.52 spent", file: "projects-pioneer.jpeg", logo: "project-pioneer-construction.jpg" },
  { client: "MDI Reno", result: "51 Meta leads", cost: "CA$12.42 / lead", spend: "Multiple campaigns", file: "mdi-reno.jpeg", logo: "mdi-reno-and-construction-ltd.png" },
  { client: "GCAD Construction", result: "187 conversations", cost: "CA$27.47 / conversation", spend: "CA$5.14K spent", file: "gcad-construction.jpeg", logo: "gcad-construction.png" },
  { client: "Apna Tiffin Service", result: "160 conversations", cost: "CA$3.98 / conversation", spend: "CA$637.37 spent", file: "apna-tiffin-service.jpeg", logo: "apna-tiffin-service.jpg" },
  { client: "Ecocare", result: "1.1K form leads", cost: "CA$21.14 / lead", spend: "CA$23.17K spent", file: "ecocare.jpeg", logo: "ecocare-home-comfort.png" },
];

export function logoLabel(filename: string): string {
  return filename
    .replace(/\.(png|jpe?g|webp|svg)$/i, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Header buttons shared by every landing page (ports to the main site's service pages). */
export const LANDING_HEADER_LINKS = [
  { label: "Google Ads", href: "/services/google-ads", brand: "google" },
  { label: "Meta Ads", href: "/services/meta-ads", brand: "meta" },
] as const;

export type LogoIndustry = { id: string; label: string; logos: string[] };

/**
 * The client logos grouped by the industry / category each business is in, so
 * the logo wall can show WHO we work with AND in which vertical (a visitor in
 * construction looks for construction names, not pizza chains). Every file in
 * `clientLogos` appears exactly once.
 */
export const logoIndustries: LogoIndustry[] = [
  {
    id: "hospitality",
    label: "Restaurants, franchises & hospitality",
    logos: ["boston-pizza.svg", "pizza-pizza.png", "little-caesars.svg", "mary-brown-s.svg", "pizza-nova.svg", "ginos-pizza.svg", "wing-machine.png", "cora-breakfast-lunch.webp", "marriott.svg", "best-western.svg", "choice-hotels.svg", "apna-tiffin-service.jpg", "bombay-chaat-saskatoon.png"],
  },
  {
    id: "construction",
    label: "Construction, renovation & trades",
    logos: ["gcad-construction.png", "mdi-reno-and-construction-ltd.png", "mc-concrete-cutting-mc-construction.png", "project-pioneer-construction.jpg", "norths-construction.jpg", "vin-engineering-inc.png", "rj-cad-solutions-inc.png", "lavish-artigiano-inc.webp"],
  },
  {
    id: "home-services",
    label: "Home, comfort & auto services",
    logos: ["ecocare-home-comfort.png", "a2z-comfort.png", "jk-appliance-repair-inc.webp", "apexshine-cleaning-inc.png", "gnc-facility-services.jpg", "acure-security-solutions.jpg", "mr-lube.png"],
  },
  {
    id: "healthcare",
    label: "Clinics, health & wellness",
    logos: ["true-life-wellness-and-physiotherapy.png", "blockline-physiotherapy-wellness.png", "rehab2go.png", "rehab-clinic.png", "therapy-villa.png", "palmdale-health-center.png", "north-york-healthcare-associates.webp", "three-sisters-pharmacy.png", "upwell-homecare-inc-qualicare-peel.webp"],
  },
  {
    id: "real-estate",
    label: "Real estate & brokerages",
    logos: ["re-max-canada.png", "century-21-canada.png", "royal-lepage-platinum-realty-brokerage.svg", "loyalty-real-estate-brokerage.webp", "one-percent-sold.png", "sold-by-kaushik-real-estate.svg", "xceed-homes.png"],
  },
  {
    id: "professional",
    label: "Immigration, finance & professional services",
    logos: ["westway-immigration.png", "bindra-world-immigration-terminal-inc.jpg", "mina-yousefi-immigration-service-myis.jpg", "dave-financial-services-inc.webp", "global-financial-impact.svg", "ace-equity.png", "the-ups-store-604.svg", "xpertech.png", "btdt-beentheredonethat.webp", "millennial-events.webp"],
  },
  {
    id: "education-retail",
    label: "Education & retail",
    logos: ["oxford-learning.svg", "scholars-ed.svg", "civia-jewels.svg"],
  },
];
