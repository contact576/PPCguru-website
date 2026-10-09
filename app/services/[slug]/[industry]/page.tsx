import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService } from "@/lib/data/services";
import { getIndustry } from "@/lib/data/industries";
import { allServiceIndustryPairs, getServiceIndustryAngle, serviceIndustryLabel, serviceShortName, industryShortName } from "@/lib/data/service-industry";
import { ServiceExperience } from "@/components/services/service-experience";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return allServiceIndustryPairs().map((pair) => ({ slug: pair.service, industry: pair.industry }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; industry: string }> }): Promise<Metadata> {
  const { slug, industry } = await params;
  if (!getServiceIndustryAngle(slug, industry)) return {};
  const label = serviceIndustryLabel(slug, industry);
  return withMetaOverride(buildMetadata({
    title: `${label} in the GTA & Canada`,
    description: `PPC Guru runs ${serviceShortName[slug]} for ${industryShortName[industry]} across the GTA and Canada — best practices, typical benchmarks and what to expect.`,
    path: `/services/${slug}/${industry}`,
  }), `/services/${slug}/${industry}`);
}

export default async function ServiceIndustryPage({ params }: { params: Promise<{ slug: string; industry: string }> }) {
  const { slug, industry } = await params;
  const service = getService(slug);
  const ind = getIndustry(industry);
  const angle = getServiceIndustryAngle(slug, industry);
  if (!service || !ind || !angle) notFound();
  const sShort = serviceShortName[slug] ?? service.name;
  const iShort = industryShortName[industry] ?? ind.name;
  const label = serviceIndustryLabel(slug, industry);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${slug}` },
    { name: iShort, path: `/services/${slug}/${industry}` },
  ];
  const intro = `${label}: how PPC Guru runs ${sShort} for ${iShort.toLowerCase()} across the Greater Toronto Area and Canada — what good looks like, the benchmarks to expect, and how we turn budget into booked jobs, not vanity metrics.`;
  const definition = `${label} is ${sShort} run specifically for ${iShort.toLowerCase()}. PPC Guru is a Google Partner and Meta Business Partner based in the Greater Toronto Area that helps ${iShort.toLowerCase()} across Canada and the USA win more booked jobs through ${sShort.toLowerCase()} — optimized around revenue, not clicks.`;
  return <>
    <JsonLd data={serviceSchema({ name: label, description: intro, path: `/services/${slug}/${industry}` })} />
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <ServiceExperience service={service} crumbs={crumbs} industry={{ slug: industry, name: ind.name, label, angle, intro, definition, calculatorIndustry: ind.calculatorIndustrySlug ?? ind.slug }} />
  </>;
}
