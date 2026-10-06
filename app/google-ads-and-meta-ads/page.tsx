import type { Metadata } from "next";
import "../100-leads/landing.css";
import "./google-meta.css";
import { GoogleMetaLanding } from "@/components/landing/google-meta-landing";
import { GOOGLE_META_LANDING_PATH } from "@/lib/data/landing-google-meta";

export const metadata: Metadata = {
  title: "Google Ads and Meta Ads | Real Campaign Results",
  description: "Google Ads and Meta Ads, managed by one team. Explore real campaign results and client reviews, then get a free growth plan for your business.",
  robots: { index: false, follow: false },
  alternates: { canonical: GOOGLE_META_LANDING_PATH },
  openGraph: {
    title: "Google Ads. Meta Ads. More leads. | PPC Guru",
    description: "Real campaign evidence. Clear reporting. A free growth plan built around your business.",
    url: GOOGLE_META_LANDING_PATH,
    type: "website",
  },
};

export default function GoogleAdsAndMetaAdsPage() {
  return <GoogleMetaLanding />;
}
