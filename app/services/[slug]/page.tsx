import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService } from "@/lib/data/services";
import { getServiceContent } from "@/lib/data/service-content";
import { ServiceExperience } from "@/components/services/service-experience";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, seoAreaServedSchema, servicePageGraphSchema } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return withMetaOverride(buildMetadata({ title: `${service.name} in the GTA & Canada`, description: service.description, path: `/services/${slug}` }), `/services/${slug}`);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const content = getServiceContent(slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${slug}` },
  ];
  const pageSchema = servicePageGraphSchema({
    name: service.name,
    description: content?.definition ?? service.description,
    path: `/services/${slug}`,
    faqs: content?.faqs ?? service.faqs,
    crumbs,
    dateModified: "2026-10-10",
    ...(slug === "seo" ? {
      areaServed: seoAreaServedSchema(),
      serviceType: ["Search engine optimization", "Local SEO", "Google Business Profile optimization"],
    } : {}),
  });
  return <><JsonLd data={pageSchema} /><ServiceExperience service={service} crumbs={crumbs} /></>;
}
