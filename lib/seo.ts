import type { Metadata } from "next";
import { siteConfig } from "./site-config";

/** Build per-page metadata with sensible canonical + OG defaults. */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteConfig.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${opts.title} | ${siteConfig.name}`,
      description: opts.description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${opts.title} | ${siteConfig.name}`,
      description: opts.description,
    },
  };
}

/** LocalBusiness / Organization base used across schema blocks. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    foundingDate: String(siteConfig.founded),
    founder: siteConfig.founders.map((name) => ({ "@type": "Person", name })),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.addressLocality,
      addressRegion: siteConfig.contact.addressRegion,
      addressCountry: siteConfig.contact.addressCountry,
    },
    areaServed: ["Canada", "United States"],
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin, siteConfig.social.facebook],
    // NOTE: aggregateRating intentionally omitted — do NOT publish Review/Rating
    // schema until the rating + review count are verified from a real source.
    // [VERIFY]: Add aggregateRating only with a confirmed rating and reviewCount.
    knowsAbout: ["Google Ads", "Meta Ads", "SEO", "PPC", "Conversion optimization"],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${siteConfig.url}${opts.path}`,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: ["Canada", "United States"],
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
