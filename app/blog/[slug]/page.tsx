import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllPostSlugs, getPost, getAllPosts } from "@/lib/blog";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";
import { siteConfig } from "@/lib/site-config";
import { team } from "@/lib/data/team";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return withMetaOverride(buildMetadata({ title: post.title, description: post.description, path: `/blog/${slug}` }), `/blog/${slug}`);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getAllPosts()).filter((p) => p.slug !== slug).slice(0, 3);
  const catLinks: Record<string, { label: string; href: string }[]> = {
    "Google Ads": [{ label: "Google Ads management", href: "/services/google-ads" }],
    "Meta Ads": [{ label: "Meta Ads management", href: "/services/meta-ads" }],
    SEO: [{ label: "SEO & Local Search", href: "/services/seo" }],
    Conversion: [{ label: "Landing Pages & CRO", href: "/services/cro-landing-pages" }],
    AI: [{ label: "AI Automation", href: "/services/ai-automation" }],
  };
  const svcLinks = catLinks[post.category] ?? [{ label: "Explore all services", href: "/services" }];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ];

  // Attribute to a real person ONLY when the frontmatter author matches a team member;
  // otherwise keep Organization (honest — the post is bylined "PPC Guru"). [VERIFY-client]:
  // assign real individual authors in content/blog/*.md frontmatter for stronger E-E-A-T.
  const authorMember = team.find((m) => m.name === post.author);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: authorMember
      ? { "@type": "Person", "@id": `${siteConfig.url}/about#${authorMember.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: authorMember.name }
      : { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    image: `${siteConfig.url}/opengraph-image`,
    mainEntityOfPage: `${siteConfig.url}/blog/${slug}`,
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero eyebrow={post.category} title={post.title} intro={post.description} breadcrumbs={crumbs}>
        <div className="flex items-center gap-4 text-sm text-[var(--color-ink-faint)]">
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readingTime}</span>
          <span>· By {post.author}</span>
        </div>
      </PageHero>

      <Section className="!pt-12">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="mx-auto mb-10 max-w-3xl w-full rounded-[24px] border border-[var(--color-border)] object-cover"
          />
        ) : null}
        <article className="prose-blog mx-auto max-w-3xl">
          {/* rehypeRaw lets the CMS author use plain HTML alongside Markdown
              (blog content is admin-authored only, so raw HTML is trusted here);
              rehypeSlug + autolink give every heading a stable #id and a
              hover "#" so sections can be linked to and shared. */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "append",
                  properties: { className: "heading-anchor", ariaLabel: "Link to this section" },
                  content: { type: "text", value: "#" },
                },
              ],
            ]}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </Section>

      {authorMember && (
        <Section className="!pt-0">
          <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6">
            {authorMember.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authorMember.photo} alt={authorMember.name} className="h-14 w-14 shrink-0 rounded-[14px] object-cover" />
            ) : (
              <span className="head flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[var(--color-ink)] text-lg text-[var(--color-lime)]">
                {authorMember.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            )}
            <div>
              <p className="mono text-[11px] uppercase tracking-[.08em] text-[#5f6f17]">About the author</p>
              <p className="head mt-1 text-[17px] text-[var(--color-ink)]">{authorMember.name} · <span className="text-[var(--color-ink-dim)]">{authorMember.role}</span></p>
              <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{authorMember.bio}</p>
              {authorMember.linkedin && (
                <a href={authorMember.linkedin} target="_blank" rel="noopener noreferrer" className="mono mt-3 inline-block text-[11px] font-bold uppercase tracking-[.06em] text-[var(--color-ink)] hover:text-[#5f6f17]">Connect on LinkedIn →</a>
              )}
            </div>
          </div>
        </Section>
      )}

      <Section className="!pt-0">
        <div className="mx-auto max-w-3xl border-t border-[var(--color-border)] pt-10">
          <h2 className="text-xl font-semibold">Keep reading</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-ink)]">
                <span className="mono text-[11px] uppercase tracking-[.06em] text-[#5f6f17]">{p.category}</span>
                <h3 className="mt-1.5 font-semibold leading-snug group-hover:text-[var(--color-ink)]">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <Section className="!pt-0">
        <div className="mx-auto max-w-3xl rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6">
          <p className="mono text-[11px] uppercase tracking-[.08em] text-[#5f6f17]">Related</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {svcLinks.map((l) => (
              <Link key={l.href} href={l.href} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-4 py-2 text-[11px] uppercase tracking-[.04em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">{l.label} →</Link>
            ))}
            <Link href="/glossary" className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-4 py-2 text-[11px] uppercase tracking-[.04em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">Marketing glossary →</Link>
            <Link href="/contact" className="mono rounded-full border border-[#cfe39a] bg-[#eef2dd] px-4 py-2 text-[11px] font-bold uppercase tracking-[.04em] text-[#5f6f17] transition-colors hover:border-[#5f6f17]">Get a free audit →</Link>
          </div>
        </div>
      </Section>
      <CtaBlock />
    </>
  );
}
