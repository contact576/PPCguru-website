import type { Metadata } from "next";
import { ServiceDirectory } from "@/components/services/service-experience";
import { services } from "@/lib/data/services";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, itemListSchema } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
    title: "Services — Google Ads, Meta Ads, SEO & more",
    description: "Full-funnel digital marketing services for service businesses: Google Ads, Meta Ads, SEO, creative, websites and CRM — all measured against booked jobs and revenue.",
    path: "/services",
  }), "/services");
}

export default function ServicesPage() {
  return <><JsonLd data={itemListSchema("PPC Guru Services", services.map((service) => ({ name: service.name, path: `/services/${service.slug}` })))} /><ServiceDirectory /></>;
}
