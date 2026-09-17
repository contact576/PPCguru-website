import type { Metadata } from "next";
import { siteConfig } from "./site-config";
import { verifiedReviewUrls, awardUrls } from "./data/reviews";
import { GOOGLE_PARTNER_PROFILE_URL, META_PARTNER_URL } from "./data/certifications";
import { cities, type City } from "./data/locations";

/** Content-freshness stamp for schema dateModified + visible "last reviewed". [VERIFY-client] bump on material revisions. */
export const CONTENT_UPDATED_ISO = "2026-06-30";

const escapedSiteName = siteConfig.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const trailingSiteName = new RegExp(`(?:\\s*\\|\\s*${escapedSiteName})+$`, "i");

export type SchemaArea = Record<string, unknown>;
type SchemaFaq = { q: string; a: string };
type SchemaCrumb = { name: string; path: string };

const TORONTO_PLACE_ID = `${siteConfig.url}/#place-toronto`;
const TORONTO_SUBAREA_SLUGS = new Set(["etobicoke", "north-york", "scarborough"]);

function ontarioArea(): SchemaArea {
  return { "@type": "AdministrativeArea", name: "Ontario", containedInPlace: { "@type": "Country", name: "Canada" } };
}

function cityArea(city: City): SchemaArea {
  if (TORONTO_SUBAREA_SLUGS.has(city.slug)) {
    return {
      "@type": "Place",
      "@id": `${siteConfig.url}/#place-${city.slug}`,
      name: city.name,
      containedInPlace: { "@id": TORONTO_PLACE_ID },
    };
  }
  return {
    "@type": "City",
    ...(city.slug === "toronto" ? { "@id": TORONTO_PLACE_ID } : {}),
    name: city.name,
    containedInPlace: ontarioArea(),
  };
}

/** The business entity can name every real service location published in the location hub. */
export function organizationAreaServedSchema(): SchemaArea[] {
  const bySlug = new Map(cities.map((city) => [city.slug, city]));
  const orderedSlugs = [
    "toronto",
    "mississauga",
    "brampton",
    "vaughan",
    "markham",
    "hamilton",
    "ottawa",
    "north-york",
    "scarborough",
    "etobicoke",
  ];
  const [toronto, ...otherLocations] = orderedSlugs.flatMap((slug) => {
    const city = bySlug.get(slug);
    return city ? [cityArea(city)] : [];
  });
  return [
    ...(toronto ? [toronto] : []),
    { "@type": "AdministrativeArea", name: "Greater Toronto Area", containedInPlace: ontarioArea() },
    ...otherLocations,
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "United States" },
  ];
}

/** Canada-wide SEO page: only the cities explicitly named in its visible service definition. */
export function seoAreaServedSchema(): SchemaArea[] {
  const namedSlugs = new Set(["toronto", "mississauga", "brampton", "ottawa"]);
  return [
    { "@type": "Country", name: "Canada" },
    ...cities.filter((city) => namedSlugs.has(city.slug)).map(cityArea),
  ];
}

/** City landing pages describe a Service area, never a fictional branch office. */
export function locationAreaServedSchema(city: City): SchemaArea[] {
  const primary = cityArea(city);
  const primaryId = (primary["@id"] as string | undefined) ?? `${siteConfig.url}/#place-${city.slug}`;
  if (!primary["@id"]) primary["@id"] = primaryId;
  return [
    primary,
    ...city.neighbourhoods.map((neighbourhood) => ({
      "@type": "Place",
      name: city.slug === "toronto" && neighbourhood === "Downtown" ? "Downtown Toronto" : neighbourhood,
      containedInPlace: { "@id": primaryId },
    })),
  ];
}

/** Keep page-level titles unbranded; the root metadata template adds the brand once. */
export function stripTrailingSiteName(title: string): string {
  const trimmed = title.trim();
  return trimmed.replace(trailingSiteName, "").trim() || trimmed;
}

/** Build per-page metadata with sensible canonical + OG defaults. */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
}): Metadata {
  const url = `${siteConfig.url}${opts.path}`;
  const title = stripTrailingSiteName(opts.title);
  const image = opts.image
    ? opts.image.startsWith("http")
      ? opts.image
      : `${siteConfig.url}${opts.image.startsWith("/") ? "" : "/"}${opts.image}`
    : null;
  return {
    title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: opts.description,
      url,
      siteName: siteConfig.name,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: opts.description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Canonical LocalBusiness entity used across schema blocks. */
export function organizationSchema() {
  // Only ship real, non-placeholder profile URLs into sameAs — a bare platform root
  // (e.g. https://linkedin.com/company/) is a broken entity signal, so it's filtered out.
  // Partner-program proof belongs under hasCertification, not sameAs.
  const sameAs = [
    ...new Set(
      ([
        siteConfig.social.instagram,
        siteConfig.social.linkedin,
        siteConfig.social.facebook,
        ...verifiedReviewUrls,
        ...awardUrls.filter((url) => url !== GOOGLE_PARTNER_PROFILE_URL),
      ] as string[]).filter((u) => Boolean(u) && !/^https?:\/\/[^/]+\/?$/.test(u)),
    ),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/ppc-guru-logo-720.png`,
    image: `${siteConfig.url}/brand/ppc-guru-logo-720.png`,
    description: siteConfig.schemaDescription,
    slogan: siteConfig.tagline,
    email: siteConfig.contact.email,
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales and customer service",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      availableLanguage: "English",
    },
    // Points the entity at the Google Business Profile the footer + /contact
    // both link to, so the on-page NAP and the listing corroborate each other.
    ...(siteConfig.maps.mapUrl ? { hasMap: siteConfig.maps.mapUrl } : {}),
    foundingDate: String(siteConfig.founded),
    founder: siteConfig.founders.map((name) => ({
      "@type": "Person",
      "@id": `${siteConfig.url}/about#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
    })),
    address: {
      "@type": "PostalAddress",
      ...(siteConfig.contact.streetAddress ? { streetAddress: siteConfig.contact.streetAddress } : {}),
      addressLocality: siteConfig.contact.addressLocality,
      addressRegion: siteConfig.contact.addressRegion,
      ...(siteConfig.contact.postalCode ? { postalCode: siteConfig.contact.postalCode } : {}),
      addressCountry: siteConfig.contact.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.maps.latitude,
      longitude: siteConfig.maps.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: organizationAreaServedSchema(),
    ...(sameAs.length ? { sameAs } : {}),
    hasCertification: [
      {
        "@type": "Certification",
        name: "Google Partner",
        url: GOOGLE_PARTNER_PROFILE_URL,
        issuedBy: { "@type": "Organization", name: "Google" },
        about: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "Certification",
        name: "Meta Business Partner",
        url: META_PARTNER_URL,
        issuedBy: { "@type": "Organization", name: "Meta" },
        about: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
    hasOfferCatalog: { "@id": `${siteConfig.url}/#services` },
    knowsAbout: [
      "Google Ads management",
      "Meta Ads management",
      "Search engine optimization",
      "Local search optimization",
      "Conversion rate optimization",
      "Landing page design",
      "Web development",
      "Marketing analytics",
    ],
  };
}

/** Primary services shown on the homepage and linked to their canonical landing pages. */
export function offerCatalogSchema() {
  const services = [
    { name: "Google Ads Management", path: "/services/google-ads" },
    { name: "Meta Ads Management", path: "/services/meta-ads" },
    { name: "SEO and Local Search", path: "/services/seo" },
    { name: "Conversion Rate Optimization and Landing Pages", path: "/services/cro-landing-pages" },
    { name: "Web Design and Development", path: "/services/web-design" },
    { name: "Creative Production", path: "/services/creative" },
    { name: "CRM and Marketing Operations", path: "/services/crm" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${siteConfig.url}/#services`,
    name: "PPC Guru digital marketing services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": `${siteConfig.url}${service.path}#service`,
        name: service.name,
        url: `${siteConfig.url}${service.path}`,
        provider: { "@id": `${siteConfig.url}/#organization` },
      },
    })),
  };
}

/** Homepage entity node; the root layout supplies the linked site and business nodes. */
export function homepageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    url: `${siteConfig.url}/`,
    name: "PPC Guru — Toronto Digital Marketing Agency",
    description: siteConfig.schemaDescription,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    mainEntity: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-CA",
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

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  areaServed?: SchemaArea[];
  serviceType?: string[];
  relatedServicePath?: string;
}) {
  const url = `${siteConfig.url}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: opts.name,
    description: opts.description,
    url,
    ...(opts.serviceType?.length ? { serviceType: opts.serviceType } : {}),
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: opts.areaServed ?? [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
    ],
    ...(opts.relatedServicePath
      ? { isRelatedTo: { "@id": `${siteConfig.url}${opts.relatedServicePath}#service` } }
      : {}),
    mainEntityOfPage: { "@id": `${url}#webpage` },
  };
}

function stripContext(node: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...node };
  delete copy["@context"];
  return copy;
}

/** One cohesive Service → WebPage → FAQ/Breadcrumb graph for commercial landing pages. */
export function servicePageGraphSchema(opts: {
  name: string;
  description: string;
  path: string;
  faqs: SchemaFaq[];
  crumbs: SchemaCrumb[];
  areaServed?: SchemaArea[];
  serviceType?: string[];
  relatedServicePath?: string;
}) {
  const url = `${siteConfig.url}${opts.path}`;
  const serviceId = `${url}#service`;
  const webpageId = `${url}#webpage`;
  const faqId = `${url}#faq`;
  const breadcrumbId = `${url}#breadcrumb`;
  const service = serviceSchema({
    name: opts.name,
    description: opts.description,
    path: opts.path,
    areaServed: opts.areaServed,
    serviceType: opts.serviceType,
    relatedServicePath: opts.relatedServicePath,
  });
  const breadcrumb = stripContext(breadcrumbSchema(opts.crumbs));

  return {
    "@context": "https://schema.org",
    "@graph": [
      stripContext(service),
      {
        "@type": "WebPage",
        "@id": webpageId,
        url,
        name: opts.name,
        description: opts.description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": serviceId },
        mainEntity: { "@id": serviceId },
        hasPart: { "@id": faqId },
        breadcrumb: { "@id": breadcrumbId },
        dateModified: CONTENT_UPDATED_ISO,
        inLanguage: "en-CA",
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url,
        name: `${opts.name} frequently asked questions`,
        isPartOf: { "@id": webpageId },
        about: { "@id": serviceId },
        inLanguage: "en-CA",
        mainEntity: opts.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      { ...breadcrumb, "@id": breadcrumbId },
    ],
  };
}

/** Sitewide entity graph — business, site and services in one connected node-set. */
export function graphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [stripContext(organizationSchema()), stripContext(websiteSchema()), stripContext(offerCatalogSchema())],
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
    description: siteConfig.schemaDescription,
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

