const serviceIndustryParentAnchors: Record<string, string> = {
  "google-ads/physiotherapy": "Google Ads management for service businesses",
  "google-ads/healthcare-clinics": "professional Google Ads management",
  "google-ads/dental": "Google Ads campaign management",
  "google-ads/hvac": "Google Ads services for high-intent searches",
  "google-ads/plumbing": "Google Search campaign management",
  "google-ads/electrical": "Google Ads lead-generation services",
  "google-ads/construction-renovation": "Google Ads management for project-based businesses",
  "google-ads/roofing": "professional Google Ads services",
  "google-ads/immigration": "Google Ads management across Canada",
  "google-ads/law-firms": "Google Ads management for competitive markets",
  "google-ads/home-improvement": "Google Ads management for qualified project leads",
  "google-ads/fitness-gyms": "Google Search advertising management",
  "google-ads/professional-services": "Google Ads management for B2B services",
  "web-design/physiotherapy": "conversion-focused website design for clinics",
  "web-design/electrical": "website design for electrical contractors",
  "web-design/construction-renovation": "construction and renovation website design",
  "web-design/roofing": "website design for roofing companies",
  "web-design/law-firms": "conversion-focused law firm websites",
  "web-design/real-estate": "real estate website and landing-page design",
  "web-design/home-improvement": "web design for home-improvement businesses",
};

export function getServiceIndustryParentAnchor(service: string, industry: string): string | undefined {
  return serviceIndustryParentAnchors[service + "/" + industry];
}
