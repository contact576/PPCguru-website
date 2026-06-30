/**
 * AEO/GEO content layer for industry pages — answer-first definitional paragraphs
 * (entity + service + geography up front) so LLMs can lift a self-contained passage
 * for "[industry] marketing" / "marketing agency for [industry] in Canada" queries.
 * Kept separate from industries.ts so it can be authored/extended without touching the
 * core Industry objects. `faqs` is populated in a later wave; optional.
 */

export type IndustryContent = {
  definition: string;
  /** Question-shaped H2 for the definition block. */
  definitionHeading?: string;
  faqs?: { q: string; a: string }[];
};

export const industryContent: Record<string, IndustryContent> = {
  physiotherapy: {
    definitionHeading: "How does PPC Guru market physiotherapy clinics?",
    definition:
      "Physiotherapy marketing is the work of getting a clinic found by patients actively searching for treatment and turning those searches into booked appointments. PPC Guru helps physiotherapy and rehab clinics across the Greater Toronto Area and Canada with Google Ads, Meta Ads, local SEO and booking-focused websites — built around new-patient bookings and lifetime value, not clicks.",
  },
  "healthcare-clinics": {
    definitionHeading: "How does PPC Guru market healthcare clinics?",
    definition:
      "Healthcare clinic marketing is the practice of attracting new patients through search, social and local listings while staying compliant and trustworthy. PPC Guru helps medical and healthcare clinics across the Greater Toronto Area and Canada with Google Ads, Meta Ads and local SEO — focused on qualified patient bookings, accurate tracking and a reputation patients trust.",
  },
  dental: {
    definitionHeading: "How does PPC Guru market dental practices?",
    definition:
      "Dental marketing is the work of attracting high-value patients — implants, Invisalign, cosmetic and family dentistry — and converting them into booked consultations. PPC Guru helps dental and orthodontic practices across the Greater Toronto Area and Canada win those cases with Google Ads, Meta Ads and local SEO engineered around production and new-patient value.",
  },
  hvac: {
    definitionHeading: "How does PPC Guru market HVAC companies?",
    definition:
      "HVAC marketing is the work of capturing emergency and seasonal demand — heating, cooling, installs and service — the moment customers search. PPC Guru helps HVAC and home-comfort companies across the Greater Toronto Area and Canada with Google Ads, Local Services Ads, Meta and SEO built around booked service calls and high-ticket installs.",
  },
  plumbing: {
    definitionHeading: "How does PPC Guru market plumbing companies?",
    definition:
      "Plumbing marketing is the work of being the first call when a customer has a leak, clog or installation job. PPC Guru helps plumbing companies across the Greater Toronto Area and Canada capture high-intent demand with Google Ads, Local Services Ads, Meta and local SEO — measured in booked jobs, not impressions.",
  },
  electrical: {
    definitionHeading: "How does PPC Guru market electrical contractors?",
    definition:
      "Electrical marketing is the work of generating steady residential and commercial leads that actually convert into jobs. PPC Guru helps electrical contractors across the Greater Toronto Area and Canada with Google Ads, Local Services Ads, Meta and local SEO — built around qualified service and project enquiries, with tracking that ties spend to revenue.",
  },
  "construction-renovation": {
    definitionHeading: "How does PPC Guru market construction & renovation firms?",
    definition:
      "Construction and renovation marketing is the work of generating high-ticket leads for builders and renovators and filtering out tyre-kickers. PPC Guru helps construction and renovation firms across the Greater Toronto Area and Canada with Google Ads, Meta and SEO — using qualification-first landing pages so sales teams talk to serious, project-ready homeowners.",
  },
  roofing: {
    definitionHeading: "How does PPC Guru market roofing companies?",
    definition:
      "Roofing marketing is the work of owning storm-season demand and replacement jobs when homeowners are ready to buy. PPC Guru helps roofing companies across the Greater Toronto Area and Canada with Google Ads, Local Services Ads, Meta and SEO — built around booked inspections and high-value re-roof and repair jobs.",
  },
  immigration: {
    definitionHeading: "How does PPC Guru market immigration consultants?",
    definition:
      "Immigration marketing is the work of reaching high-intent applicants searching for help and earning their trust with compliant, credible campaigns. PPC Guru helps immigration consultants and firms across the Greater Toronto Area and Canada with Google Ads, Meta and trust-focused landing pages — built around qualified consultations, not raw enquiries.",
  },
  "law-firms": {
    definitionHeading: "How does PPC Guru market law firms?",
    definition:
      "Legal marketing is the work of generating high-value case enquiries and qualifying them before they reach the intake team. PPC Guru helps law firms and legal professionals across the Greater Toronto Area and Canada with Google Ads, Local Services Ads, Meta and SEO — built around signed cases and case value, with airtight call and form tracking.",
  },
  "real-estate": {
    definitionHeading: "How does PPC Guru market real estate businesses?",
    definition:
      "Real estate marketing is the work of generating qualified buyer and seller leads with clear attribution back to closings. PPC Guru helps real estate agents, teams and brokerages across the Greater Toronto Area and Canada with Google Ads, Meta and landing pages — built around booked appointments and pipeline, not vanity reach.",
  },
  "home-improvement": {
    definitionHeading: "How does PPC Guru market home-improvement companies?",
    definition:
      "Home-improvement marketing is the work of generating remodel and upgrade leads — kitchens, baths, windows, decks — and qualifying them by budget and timeline. PPC Guru helps home-improvement and remodeling companies across the Greater Toronto Area and Canada with Google Ads, Meta and SEO — focused on booked in-home estimates and high-ticket projects.",
  },
  "fitness-gyms": {
    definitionHeading: "How does PPC Guru market gyms & fitness studios?",
    definition:
      "Fitness marketing is the work of filling memberships and class spots with local prospects ready to commit. PPC Guru helps gyms, studios and fitness brands across the Greater Toronto Area and Canada with Meta Ads, Google Ads and local SEO — built around trials, sign-ups and member lifetime value, with tracking that proves ROAS.",
  },
  "med-spa": {
    definitionHeading: "How does PPC Guru market med spas?",
    definition:
      "Med spa marketing is the work of booking high-value cosmetic and aesthetic treatments from a competitive local market. PPC Guru helps med spas and aesthetic clinics across the Greater Toronto Area and Canada with Meta Ads, Google Ads and local SEO — built around booked consultations, premium treatment value and repeat clients.",
  },
  "professional-services": {
    definitionHeading: "How does PPC Guru market professional & B2B services?",
    definition:
      "Professional-services marketing is the work of generating qualified B2B enquiries — accounting, consulting, agencies, finance — and filtering for fit. PPC Guru helps professional and B2B service firms across the Greater Toronto Area and Canada with Google Ads, LinkedIn Ads and SEO — built around pipeline, qualified consultations and revenue.",
  },
};

export function getIndustryContent(slug: string): IndustryContent | undefined {
  return industryContent[slug];
}
