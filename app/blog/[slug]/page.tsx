import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPostSlugs, getPost, getAllPosts } from "@/lib/blog";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({ title: post.title, description: post.description, path: `/blog/${slug}` });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: `${siteConfig.url}/blog/${slug}`,
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero eyebrow={post.category} title={post.title} intro={post.description} breadcrumbs={crumbs}>
        <div className="flex items-center gap-4 text-sm text-[--color-ink-faint]">
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readingTime}</span>
          <span>· By {post.author}</span>
        </div>
      </PageHero>

      <Section className="!pt-12">
        <article className="prose-blog mx-auto max-w-3xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      </Section>

      <Section className="!pt-0">
        <div className="mx-auto max-w-3xl border-t border-[--color-border] pt-10">
          <h2 className="text-xl font-semibold">Keep reading</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-[--color-border] bg-[--color-surface] p-5 transition-colors hover:border-[--color-violet]">
                <span className="text-xs text-[--color-cyan-bright]">{p.category}</span>
                <h3 className="mt-1.5 font-semibold leading-snug group-hover:text-[--color-ink]">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <CtaBlock />
    </>
  );
}
