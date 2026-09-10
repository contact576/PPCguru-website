import type { Metadata } from "next";
import "./landing.css";
import { LeadsLanding } from "@/components/landing/leads-landing";
import { LANDING_PATH } from "@/lib/data/landing-100-leads";

/**
 * /100-leads — the "100 Qualified Leads or our fee is $0" landing page for paid
 * Google Ads + Meta Ads traffic. Standalone by design: its own header/footer,
 * scoped CSS (landing.css → .lp-root), site chrome + offer popup suppressed
 * (chrome-gate.tsx / offer-popup.tsx). Noindex — it's an ad destination, not
 * an organic page; flip `robots` if it should rank.
 */
export const metadata: Metadata = {
  title: "100 Qualified Leads Guarantee",
  description:
    "See if your business qualifies for PPC Guru's 100 qualified lead management-fee guarantee across Google Ads and Meta Ads.",
  robots: { index: false, follow: false },
  alternates: { canonical: LANDING_PATH },
  openGraph: {
    title: "Get 100 qualified leads. Or our fee is $0. | PPC Guru",
    description: "Real prospects who match the service, location and intent criteria we agree on before launch.",
    url: LANDING_PATH,
    type: "website",
  },
};

export default function HundredLeadsPage() {
  return <LeadsLanding />;
}
