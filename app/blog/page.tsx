import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog & Resources",
  description:
    "Practical guides on Google Ads, Meta Ads, SEO and lead generation for local service businesses — from the PPC Guru team.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Blog & resources"
        title={<>Marketing that <span className="text-gradient">actually moves the needle</span></>}
        intro="No fluff. Practical guides on paid ads, SEO and lead generation for service businesses — written by the team running the campaigns."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]}
      />
      <Section>
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group mb-10 block overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-violet)]">
            <div className="bg-radial-glow p-8 md:p-12">
              <span className="text-sm font-medium text-[var(--color-cyan-bright)]">{featured.category}</span>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">{featured.title}</h2>
              <p className="mt-4 max-w-2xl text-[var(--color-ink-dim)]">{featured.description}</p>
              <Meta date={featured.date} readingTime={featured.readingTime} />
            </div>
          </Link>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all hover:-translate-y-1 hover:border-[var(--color-violet)]">
              <span className="text-xs font-medium text-[var(--color-cyan-bright)]">{p.category}</span>
              <h3 className="mt-2 text-xl font-semibold group-hover:text-[var(--color-ink)]">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-[var(--color-ink-dim)]">{p.description}</p>
              <Meta date={p.date} readingTime={p.readingTime} />
            </Link>
          ))}
        </div>
      </Section>
      <CtaBlock />
    </>
  );
}

function Meta({ date, readingTime }: { date: string; readingTime: string }) {
  return (
    <div className="mt-5 flex items-center gap-4 text-xs text-[var(--color-ink-faint)]">
      <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {new Date(date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}</span>
      <span className="flex items-center gap-1.5"><Clock size={13} /> {readingTime}</span>
    </div>
  );
}
