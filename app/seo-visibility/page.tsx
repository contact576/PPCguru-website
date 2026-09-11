import type { Metadata } from "next";
import "../100-leads/landing.css";
import { SeoLanding } from "@/components/landing/seo-landing";
import { SEO_LANDING_PATH } from "@/lib/data/landing-seo";

/**
 * /seo-visibility — the "SEO + AI search visibility" landing page for paid
 * traffic (ported from the standalone Vite build on branch `seo-landing-page`).
 * Standalone like /100-leads: own header/footer, the shared scoped stylesheet
 * (landing.css → .lp-root / .lp-seo), site chrome + offer popup suppressed
 * (chrome-gate.tsx / offer-popup.tsx). Noindex — it's an ad destination.
 * Alias: /seo-landing-page (next.config.ts redirect).
 */
export const metadata: Metadata = {
  title: "SEO + AI Search Visibility",
  description: "Improve your Google rankings, local visibility and presence in selected AI answers with a measurable 30-day SEO target from PPC Guru.",
  robots: { index: false, follow: false },
  alternates: { canonical: SEO_LANDING_PATH },
  openGraph: {
    title: "Make your business the obvious answer — in Google and AI search | PPC Guru",
    description: "A measurable 30-day search-visibility target across Google, Maps and AI answers, agreed upfront.",
    url: SEO_LANDING_PATH,
    type: "website",
  },
};

export default function SeoVisibilityPage() {
  return <SeoLanding />;
}
