import type { Metadata } from "next";
import "../100-leads/landing.css";
import "./gta.css";
import { GtaLanding } from "@/components/landing/gta-landing";
import { GTA_LANDING_PATH } from "@/lib/data/landing-gta";

/**
 * /gta-marketing-agency — "the GTA's 5-star marketing agency" landing page for
 * paid traffic. Standalone like /100-leads: own header/footer, shared scoped
 * stylesheet, site chrome + offer popup suppressed (chrome-gate.tsx /
 * offer-popup.tsx). Noindex — it's an ad destination.
 */
export const metadata: Metadata = {
  title: "Google Ads + Meta Ads Agency in Toronto & GTA",
  description: "Google Ads and Meta Ads, one accountable team. Get a free growth plan for your GTA business with PPC Guru. Your accounts stay yours. No obligation.",
  robots: { index: false, follow: false },
  alternates: { canonical: GTA_LANDING_PATH },
  openGraph: {
    title: "Google Ads + Meta Ads. One team. | PPC Guru",
    description: "More of the right leads for your GTA business. Start with a free Google and Meta growth plan.",
    url: GTA_LANDING_PATH,
    type: "website",
  },
};

export default function GtaMarketingAgencyPage() {
  return <GtaLanding />;
}
