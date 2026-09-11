/**
 * Data for the "SEO + AI search visibility" paid-traffic landing page
 * (/seo-visibility) — ported from the standalone Vite build on branch
 * `seo-landing-page`. Shared by the client page, the server action (validates
 * the same ids) and the admin panel (ids → labels). Keep ids stable: they are
 * stored verbatim in `landing_page_leads.answers`.
 */

export const SEO_LANDING_PATH = "/seo-visibility";
export const SEO_LANDING_THANK_YOU_PATH = "/seo-visibility/thank-you";
/** `leads.source` value — the /admin/leads "Source" chip and the CRM note. */
export const SEO_LANDING_SOURCE = "landing:seo-visibility";
/** `landing_page_leads.landing` value. */
export const SEO_LANDING_ID = "seo-visibility";
export const SEO_LANDING_SERVICE_LABEL = "SEO + AI search visibility (30-day measured target)";

export const SEO_GOALS = [
  { id: "google", label: "Google Search" },
  { id: "maps", label: "Google Maps" },
  { id: "ai", label: "AI answers" },
  { id: "all", label: "All three" },
] as const;

export const SEO_INVESTMENTS = [
  { id: "under-1500", label: "Under $1,500" },
  { id: "1500-3000", label: "$1,500–$3,000" },
  { id: "3000-5000", label: "$3,000–$5,000" },
  { id: "5000-plus", label: "$5,000+" },
] as const;

export type SeoGoalId = (typeof SEO_GOALS)[number]["id"];
export type SeoInvestmentId = (typeof SEO_INVESTMENTS)[number]["id"];

export const SEO_GOAL_IDS = SEO_GOALS.map((g) => g.id) as [SeoGoalId, ...SeoGoalId[]];
export const SEO_INVESTMENT_IDS = SEO_INVESTMENTS.map((i) => i.id) as [SeoInvestmentId, ...SeoInvestmentId[]];

export function seoGoalLabel(id: string | null | undefined): string {
  return SEO_GOALS.find((g) => g.id === id)?.label ?? (id || "—");
}
export function seoInvestmentLabel(id: string | null | undefined): string {
  return SEO_INVESTMENTS.find((i) => i.id === id)?.label ?? (id || "—");
}

export type AiProof = {
  platform: "SEO" | "Google Ads" | "Meta Ads";
  title: string;
  query: string;
  /** Screenshot under /public/landing/proof (736×1600, byte-identical to the supplied capture). */
  file: string;
  alt: string;
  caption: string;
};

/** Three original ChatGPT mobile-app screenshots supplied by PPC Guru. */
export const aiProofs: AiProof[] = [
  {
    platform: "SEO",
    title: "Top SEO recommendation",
    query: "Best SEO agency in Toronto",
    file: "chatgpt-mobile-seo-actual.jpeg",
    alt: "Original ChatGPT mobile app screenshot recommending PPC Guru for a Toronto SEO agency search",
    caption: "This ChatGPT app capture recommends PPC Guru for a Toronto/GTA service business focused on turning SEO traffic into enquiries and customers.",
  },
  {
    platform: "Google Ads",
    title: "Current Google Ads top pick",
    query: "Best Google Ads agency in Toronto",
    file: "chatgpt-mobile-google-ads-actual.jpeg",
    alt: "Original ChatGPT mobile app screenshot naming PPC Guru as a top Google Ads agency pick in Toronto",
    caption: "This ChatGPT app capture describes PPC Guru as its current top pick for Toronto lead generation through Google Ads.",
  },
  {
    platform: "Meta Ads",
    title: "#1 in this Meta Ads shortlist",
    query: "Top Meta Ads agency in Toronto",
    file: "chatgpt-mobile-meta-ads-actual.jpeg",
    alt: "Original ChatGPT mobile app screenshot placing PPC Guru first in a Toronto Meta Ads agency shortlist",
    caption: "This ChatGPT app capture places PPC Guru first in its Toronto Meta Ads shortlist for local businesses, contractors, clinics and lead generation.",
  },
];
