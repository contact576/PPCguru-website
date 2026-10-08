import type { Metadata } from "next";
import "../100-leads/landing.css";
import "./google-meta.css";
import { GoogleMetaLanding } from "@/components/landing/google-meta-landing";
import { GOOGLE_META_LANDING_PATH } from "@/lib/data/landing-google-meta";

export const metadata: Metadata = {
  title: "More Qualified Google Ads Leads or $0 Management Fees",
  description: "Beat your last 30 days of qualified Google Ads leads or pay $0 in management fees for the agreed period. Eligible existing advertisers. Ad spend is separate.",
  robots: { index: false, follow: false },
  alternates: { canonical: GOOGLE_META_LANDING_PATH },
  openGraph: {
    title: "Beat your last 30 days of qualified leads or pay $0 in management fees.",
    description: "For eligible existing Google Ads advertisers. Baseline, lead criteria, attribution, campaign period and comparable ad budget agreed before launch. Ad spend is separate and non-refundable.",
    url: GOOGLE_META_LANDING_PATH,
    type: "website",
  },
};

export default function GoogleAdsAndMetaAdsPage() {
  return <GoogleMetaLanding />;
}
