import type { Metadata } from "next";
import "../100-leads/landing.css";
import { GtaLanding } from "@/components/landing/gta-landing";
import { GTA_LANDING_PATH } from "@/lib/data/landing-gta";

/**
 * /gta-marketing-agency — "the GTA's 5-star marketing agency" landing page for
 * paid traffic. Standalone like /100-leads: own header/footer, shared scoped
 * stylesheet, site chrome + offer popup suppressed (chrome-gate.tsx /
 * offer-popup.tsx). Noindex — it's an ad destination.
 */
export const metadata: Metadata = {
  title: "Toronto & GTA Marketing Agency — Google Ads, Meta Ads, SEO",
  description: "PPC Guru is the 5-star rated Toronto marketing agency for Google Ads, Meta Ads and SEO. Get a free growth plan for your GTA business.",
  robots: { index: false, follow: false },
  alternates: { canonical: GTA_LANDING_PATH },
  openGraph: {
    title: "The GTA's 5-star marketing agency | PPC Guru",
    description: "Google Ads, Meta Ads and SEO run as one plan for businesses across Toronto and the GTA.",
    url: GTA_LANDING_PATH,
    type: "website",
  },
};

export default function GtaMarketingAgencyPage() {
  return <GtaLanding />;
}
