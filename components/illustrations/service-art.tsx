import {
  GoogleAdsArt, MetaAdsArt, SeoArt, CreativeArt, WebDesignArt, CrmArt, ServicesArt,
} from "@/components/illustrations/hero-art";

/**
 * Slug → hero illustration for a service. Shared by the service template and the
 * [service]/[industry] combo template so every service surface renders art.
 * New services reuse the closest existing scene until bespoke art ships (see
 * CREATIVE-BRIEF.md — the 7 reused ⚠ items are queued for dedicated artwork).
 */
const SERVICE_ART: Record<string, React.ReactNode> = {
  "google-ads": <GoogleAdsArt />,
  "meta-ads": <MetaAdsArt />,
  seo: <SeoArt />,
  creative: <CreativeArt />,
  "web-design": <WebDesignArt />,
  crm: <CrmArt />,
  "linkedin-ads": <MetaAdsArt />,
  "tiktok-ads": <MetaAdsArt />,
  "microsoft-ads": <GoogleAdsArt />,
  "pinterest-ads": <MetaAdsArt />,
  "youtube-ads": <CreativeArt />,
  "ai-automation": <CrmArt />,
  "cro-landing-pages": <WebDesignArt />,
};

export function serviceArt(slug: string): React.ReactNode {
  return SERVICE_ART[slug] ?? <ServicesArt />;
}
