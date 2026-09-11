/**
 * Partner programs, platform certifications and third-party registries shown
 * on the landing pages and the homepage trust strip.
 *
 * PARTNER programs link to the public directory profile so the claim can be
 * checked at source. CERTIFICATIONS are Google Skillshop / Meta Blueprint
 * credentials held by the team — [VERIFY-client] keep this list in sync with
 * the certificates actually held (remove any that lapse). REGISTRIES come from
 * lib/data/reviews.ts (`earnedAwards`) so there is one source of truth.
 */

export type Certification = {
  id: string;
  /** Issuer — drives the brand mark and the badge colour. */
  issuer: "google" | "meta";
  /** Short badge title, e.g. "Search". */
  title: string;
  /** Full credential name as printed on the certificate. */
  name: string;
  /** Where the credential is issued / can be verified. */
  url: string;
};

export const GOOGLE_PARTNER_ID = "1117142019";
export const GOOGLE_PARTNER_PROFILE_URL = `https://www.google.com/partners/agency?id=${GOOGLE_PARTNER_ID}`;
/** Official clickable badge artwork served by Google Partners (mirrored in /public/badges). */
export const GOOGLE_PARTNER_BADGE = "/badges/google-partner-official.svg";
export const META_PARTNER_BADGE = "/badges/meta-business-partner.svg";
export const META_PARTNER_DIRECTORY_URL = "https://www.facebook.com/business/partner-directory";

export const certifications: Certification[] = [
  { id: "g-search", issuer: "google", title: "Search", name: "Google Ads Search Certification", url: "https://skillshop.withgoogle.com/" },
  { id: "g-video", issuer: "google", title: "Video", name: "Google Ads Video Certification", url: "https://skillshop.withgoogle.com/" },
  { id: "g-display", issuer: "google", title: "Display", name: "Google Ads Display Certification", url: "https://skillshop.withgoogle.com/" },
  { id: "g-shopping", issuer: "google", title: "Shopping", name: "Google Ads Shopping Certification", url: "https://skillshop.withgoogle.com/" },
  { id: "g-measure", issuer: "google", title: "Measurement", name: "Google Ads Measurement Certification", url: "https://skillshop.withgoogle.com/" },
  { id: "g-ga4", issuer: "google", title: "Analytics", name: "Google Analytics (GA4) Certification", url: "https://skillshop.withgoogle.com/" },
  { id: "m-associate", issuer: "meta", title: "Marketing Associate", name: "Meta Certified Digital Marketing Associate", url: "https://www.facebook.com/business/learn/certification" },
  { id: "m-buying", issuer: "meta", title: "Media Buying Pro", name: "Meta Certified Media Buying Professional", url: "https://www.facebook.com/business/learn/certification" },
];
