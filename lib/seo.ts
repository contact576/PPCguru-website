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
  // Only ship real, non-placeholder profile URLs into sameAs — a bare platform root
  // (e.g. https://linkedin.com/company/) is a broken entity signal, so it's filtered out.
  const sameAs = ([siteConfig.social.instagram, siteConfig.social.linkedin, siteConfig.social.facebook] as string[]).filter(
    (u) => Boolean(u) && !/^https?:\/\/[^/]+\/?$/.test(u),
  );
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
    founder: siteConfig.founders.map((name) => ({
      "@type": "Person",
      "@id": `${siteConfig.url}/about#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.addressLocality,
      addressRegion: siteConfig.contact.addressRegion,
      addressCountry: siteConfig.contact.addressCountry,
    },
    areaServed: ["Canada", "United States"],
    ...(sameAs.length ? { sameAs } : {}),
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

/** WebSite entity node — anchors the site to the Organization for knowledge-graph building. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-CA",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

/**
 * Person schema for a real founder / author. Emit on /about and reference by @id from
 * Organization.founder and Article.author so the entity graph is connected. Only ships a
 * real LinkedIn into sameAs (bare platform roots are filtered out).
 */
export function personSchema(member: { name: string; role?: string; bio?: string; focus?: string[]; linkedin?: string }) {
  const id = `${siteConfig.url}/about#${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const sameAs = [member.linkedin].filter(
    (u): u is string => typeof u === "string" && u.length > 0 && !/^https?:\/\/[^/]+\/?$/.test(u),
  );
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": id,
    name: member.name,
    ...(member.role ? { jobTitle: member.role } : {}),
    ...(member.bio ? { description: member.bio } : {}),
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    url: `${siteConfig.url}/about`,
    ...(member.focus?.length ? { knowsAbout: member.focus } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** ItemList for hub pages (services, industries, …) — helps engines enumerate the cluster. */
export function itemListSchema(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${siteConfig.url}${it.path}`,
    })),
  };
}
