import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { services, getService } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({ title: service.name, description: service.description, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedIndustries = industries.filter((i) => i.services.includes(slug)).slice(0, 5);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${slug}` },
  ];

  return (
    <>
      <JsonLd data={serviceSchema({ name: service.name, description: service.description, path: `/services/${slug}` })} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero eyebrow="Service" title={service.name} intro={service.hero} breadcrumbs={crumbs}>
        <Button href="/contact" size="lg">Get a free {service.name.split(" ")[0]} audit <ArrowRight size={18} /></Button>
      </PageHero>

      {/* Outcomes */}
      <Section>
        <SectionHeading align="left" eyebrow="What you get" title="Outcomes we optimize for" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {service.outcomes.map((o) => (
            <div key={o} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]"><Check size={15} /></span>
              <span className="font-medium">{o}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Deliverables */}
      <Section className="bg-[var(--color-base-2)]">
        <SectionHeading align="left" eyebrow="What's included" title="What we actually do" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {service.deliverables.map((d, i) => (
            <Reveal key={d.title} delay={(i % 2) * 0.05}>
              <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
                <h3 className="text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{d.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeading align="left" eyebrow="The process" title={`How we run ${service.name}`} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p) => (
            <div key={p.step} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <span className="font-display text-3xl font-bold text-[color-mix(in_srgb,var(--color-violet)_45%,transparent)]">{p.step}</span>
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Related industries */}
      {relatedIndustries.length > 0 && (
        <Section className="bg-[var(--color-base-2)]">
          <SectionHeading align="left" eyebrow="Where it works" title="Industries we run this for" />
          <div className="mt-8 flex flex-wrap gap-3">
            {relatedIndustries.map((ind) => (
              <Link key={ind.slug} href={`/industries/${ind.slug}`} className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan-bright)]">
                {ind.name}
              </Link>
            ))}
          </div>
        </Section>
      )}

      <FaqAccordion faqs={service.faqs} title={`${service.name} — questions`} />
      <CtaBlock />
    </>
  );
}
