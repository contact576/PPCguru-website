/**
 * Internal-linking / silo anchor map — the single source of truth for the
 * keyword-relevant anchor text used when one page links to another.
 *
 * SEO rationale (silo structure): links that point *to* a page should use anchor
 * text that describes THAT destination's primary keyword — not generic "learn more".
 * We keep a small set of natural variants per target so anchors can be rotated and
 * never read as over-optimized/exact-match spam. Geo (Toronto / GTA) is woven in on
 * a subset only, so the profile stays natural.
 *
 * `anchor` = the default (primary) anchor phrase. `variants` = alternates for reuse
 * elsewhere in the silo. `keyword` = the head term the destination page targets.
 */

export type LinkTarget = {
  href: string;
  /** Head keyword the destination page targets (for reference / future use). */
  keyword: string;
  /** Default keyword-rich anchor text for links pointing to this page. */
  anchor: string;
  /** Natural anchor alternates (rotate to avoid an exact-match footprint). */
  variants: string[];
};

/** Root + hub pages. */
export const hubLinks = {
  home: {
    href: "/",
    keyword: "digital marketing agency Toronto",
    anchor: "digital marketing agency in Toronto",
    variants: ["Toronto PPC agency", "GTA digital marketing agency", "PPC Guru"],
  },
  services: {
    href: "/services",
    keyword: "digital marketing services GTA",
    anchor: "digital marketing services across the GTA",
    variants: ["our full-funnel marketing services", "all our services", "performance marketing services"],
  },
  industries: {
    href: "/industries",
    keyword: "industries we serve",
    anchor: "industries we serve",
    variants: ["by industry", "the industries we work with"],
  },
  locations: {
    href: "/locations",
    keyword: "GTA service areas",
    anchor: "areas we serve across the GTA",
    variants: ["our GTA service areas", "locations we serve"],
  },
} satisfies Record<string, LinkTarget>;

/** Per-service anchor map (keyed by service slug). */
export const serviceLinks: Record<string, LinkTarget> = {
  "google-ads": {
    href: "/services/google-ads",
    keyword: "Google Ads management Toronto",
    anchor: "Google Ads management",
    variants: ["Google Ads agency in the GTA", "Google Ads management in Toronto", "Google Ads services"],
  },
  "meta-ads": {
    href: "/services/meta-ads",
    keyword: "Meta Ads agency GTA",
    anchor: "Meta Ads management",
    variants: ["Facebook & Instagram ads agency in the GTA", "Facebook ads management", "Meta Ads agency"],
  },
  seo: {
    href: "/services/seo",
    keyword: "SEO agency GTA",
    anchor: "SEO services in the GTA",
    variants: ["SEO agency in the GTA", "local SEO services", "SEO & local search"],
  },
  creative: {
    href: "/services/creative",
    keyword: "ad creative production",
    anchor: "ad creative production",
    variants: ["creative production studio", "ad creative services"],
  },
  "web-design": {
    href: "/services/web-design",
    keyword: "landing page & web design Toronto",
    anchor: "landing page design",
    variants: ["landing page & web design", "conversion-focused web design", "websites & landing pages"],
  },
  crm: {
    href: "/services/crm",
    keyword: "CRM & marketing automation GTA",
    anchor: "CRM & marketing operations",
    variants: ["CRM & marketing automation", "marketing operations & CRM setup"],
  },
  "linkedin-ads": {
    href: "/services/linkedin-ads",
    keyword: "LinkedIn Ads agency",
    anchor: "LinkedIn Ads management",
    variants: ["LinkedIn Ads agency", "B2B LinkedIn advertising"],
  },
  "tiktok-ads": {
    href: "/services/tiktok-ads",
    keyword: "TikTok Ads management",
    anchor: "TikTok Ads management",
    variants: ["TikTok advertising", "TikTok Ads agency"],
  },
  "microsoft-ads": {
    href: "/services/microsoft-ads",
    keyword: "Microsoft (Bing) Ads management",
    anchor: "Microsoft Ads management",
    variants: ["Bing Ads management", "Microsoft Advertising"],
  },
  "pinterest-ads": {
    href: "/services/pinterest-ads",
    keyword: "Pinterest Ads management",
    anchor: "Pinterest Ads management",
    variants: ["Pinterest advertising", "Pinterest Ads agency"],
  },
  "youtube-ads": {
    href: "/services/youtube-ads",
    keyword: "YouTube Ads management",
    anchor: "YouTube Ads management",
    variants: ["YouTube advertising", "YouTube Ads agency"],
  },
  "ai-automation": {
    href: "/services/ai-automation",
    keyword: "AI marketing automation",
    anchor: "AI marketing automation",
    variants: ["AI automation services", "AI-powered marketing automation"],
  },
  "cro-landing-pages": {
    href: "/services/cro-landing-pages",
    keyword: "landing pages & CRO",
    anchor: "landing pages & CRO",
    variants: ["conversion rate optimization", "CRO & landing page optimization"],
  },
};

/** Ordered slug list — canonical silo order for "related services" rows. */
export const serviceSlugOrder = Object.keys(serviceLinks);

/** Resolve the keyword anchor for a link href. Falls back to the services hub. */
export function anchorForHref(href: string): string {
  const slug = href.replace(/\/+$/, "").split("/").pop() ?? "";
  if (href === "/services" || href === "/services/") return hubLinks.services.variants[1];
  return serviceLinks[slug]?.anchor ?? hubLinks.services.anchor;
}

/** Get the link target for a service slug (or undefined). */
export function serviceLink(slug: string): LinkTarget | undefined {
  return serviceLinks[slug];
}
