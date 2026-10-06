export type CampaignScreenshot = {
  src: string;
  width: number;
  height: number;
  client: string;
  result: string;
  cost: string;
  spend: string;
  period: string;
};

/**
 * PPC Guru supplied these styled, redacted campaign reports in its Drive folder.
 * The figures below were transcribed from the images, not independently verified
 * against the advertising accounts. Public filenames and captions preserve the
 * client-name redactions visible in the reports.
 */
export const googleAdsResults: CampaignScreenshot[] = [
  { src: "/landing/results/google-ads-wellness-physio.png", width: 865, height: 1818, client: "Wellness & physiotherapy", result: "563 conversions", cost: "CA$15.48 / conversion", spend: "CA$8,716.58", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-immigration.png", width: 865, height: 1819, client: "Immigration services", result: "553 conversions", cost: "CA$14.09 / conversion", spend: "CA$7,790.97", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-engineering.png", width: 865, height: 1819, client: "Engineering services", result: "553 conversions", cost: "CA$15.11 / conversion", spend: "CA$8,357.40", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-health-center.png", width: 865, height: 1819, client: "Health center", result: "541 conversions", cost: "CA$13.74 / conversion", spend: "CA$7,431.79", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-cleaning.png", width: 865, height: 1819, client: "Cleaning services", result: "529 conversions", cost: "CA$13.37 / conversion", spend: "CA$7,072.61", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-rehab-clinic.png", width: 865, height: 1818, client: "Rehabilitation clinic", result: "526 conversions", cost: "CA$12.37 / conversion", spend: "CA$6,506.18", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-physiotherapy.png", width: 865, height: 1819, client: "Physiotherapy & wellness", result: "451 conversions", cost: "CA$18.93 / conversion", spend: "CA$8,536.99", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-facility-services.png", width: 865, height: 1819, client: "Facility services", result: "440 conversions", cost: "CA$18.59 / conversion", spend: "CA$8,177.81", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-therapy.png", width: 865, height: 1819, client: "Therapy services", result: "433 conversions", cost: "CA$17.58 / conversion", spend: "CA$7,611.38", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-rehab-services.png", width: 865, height: 1819, client: "Rehabilitation services", result: "422 conversions", cost: "CA$17.19 / conversion", spend: "CA$7,252.20", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-homecare.png", width: 865, height: 1819, client: "Homecare services", result: "409 conversions", cost: "CA$16.85 / conversion", spend: "CA$6,893.02", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-appliance-repair.png", width: 865, height: 1819, client: "Appliance repair", result: "400 conversions", cost: "CA$15.82 / conversion", spend: "CA$6,326.59", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/google-ads-healthcare.png", width: 865, height: 1819, client: "Healthcare services", result: "319 conversions", cost: "CA$19.27 / conversion", spend: "CA$6,147.17", period: "8 Jul–5 Oct 2026" },
];

export const metaAdsResults: CampaignScreenshot[] = [
  { src: "/landing/results/meta-ads-events.png", width: 865, height: 1819, client: "Events", result: "542 leads", cost: "CA$14.76 / lead", spend: "CA$7,998.22", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-physiotherapy.png", width: 865, height: 1819, client: "Physiotherapy", result: "531 leads", cost: "CA$14.39 / lead", spend: "CA$7,639.04", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-construction-01.png", width: 865, height: 1819, client: "Construction campaign 1", result: "519 leads", cost: "CA$14.03 / lead", spend: "CA$7,279.86", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-construction-02.png", width: 865, height: 1819, client: "Construction campaign 2", result: "516 leads", cost: "CA$13.01 / lead", spend: "CA$6,713.43", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-home-comfort.png", width: 865, height: 1819, client: "Home comfort", result: "502 leads", cost: "CA$12.66 / lead", spend: "CA$6,354.25", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-renovation.png", width: 865, height: 1819, client: "Renovation", result: "447 leads", cost: "CA$19.56 / lead", spend: "CA$8,744.24", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-marketing.png", width: 865, height: 1819, client: "Marketing", result: "429 leads", cost: "CA$18.23 / lead", spend: "CA$7,818.63", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-therapy.png", width: 865, height: 1819, client: "Therapy", result: "418 leads", cost: "CA$17.85 / lead", spend: "CA$7,459.45", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-project-services.png", width: 865, height: 1819, client: "Project services", result: "396 leads", cost: "CA$16.50 / lead", spend: "CA$6,533.84", period: "8 Jul–5 Oct 2026" },
  { src: "/landing/results/meta-ads-construction-03.png", width: 865, height: 1819, client: "Construction campaign 3", result: "383 leads", cost: "CA$16.12 / lead", spend: "CA$6,174.66", period: "8 Jul–5 Oct 2026" },
];
