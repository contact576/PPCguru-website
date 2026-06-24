/**
 * Central site configuration — single source of truth for NAP, trust numbers,
 * brand, navigation and social links. Edit values here to update them site-wide.
 *
 * Items the client must verify before go-live are tagged // TODO(client) and
 * mirrored in CONTENT-TODO.md.
 */

export const siteConfig = {
  name: "PPC Guru",
  legalName: "PPC Guru",
  domain: "ppcguru.ca",
  url: "https://ppcguru.ca",
  tagline: "Ad spend, turned into booked jobs.",
  description:
    "PPC Guru is a Google Partner & Meta Business Partner agency turning ad spend into booked jobs and qualified leads for service businesses across the GTA, Canada and the USA. AI-augmented Google Ads, Meta Ads, SEO and creative.",

  // Positioning
  founded: 2021,
  founders: ["Jaydeep Patel", "Dhaval Patel"],

  // Contact — TODO(client): confirm exact public details before launch
  contact: {
    email: "hello@ppcguru.ca", // [VERIFY] confirm real inbox before launch
    // Phone intentionally blank — no placeholder number is shown anywhere.
    // [VERIFY]: add the real business phone + WhatsApp; components show a
    // "Book a call" CTA instead while these are empty.
    phone: "",
    phoneHref: "",
    whatsapp: "", // e.g. "https://wa.me/1XXXXXXXXXX" — [VERIFY] real WhatsApp number
    addressLocality: "Brampton",
    addressRegion: "ON",
    addressCountry: "CA",
    streetAddress: "Greater Toronto Area", // TODO(client) confirm mailing address
    postalCode: "", // TODO(client)
    hours: "Mon–Fri, 9:00 AM – 6:00 PM ET",
  },

  // Trust signals — TODO(client): keep current
  trust: {
    googlePartner: true,
    metaBusinessPartner: true,
    activeClients: "35+",
    adSpendManaged: "$10M+", // representative aggregate — TODO(client) confirm figure
    avgRoas: "4.2x", // representative aggregate — TODO(client) confirm
    leadsGenerated: "120,000+", // representative aggregate — TODO(client) confirm
    googleReviewRating: "4.9", // TODO(client) confirm real rating
    googleReviewCount: "60+", // TODO(client) confirm real count
    serviceArea: "Canada & the USA",
  },

  // Primary conversion offer (used by all CTAs)
  cta: {
    primaryLabel: "Get your free audit",
    primaryHref: "/contact",
    secondaryLabel: "Try the ROI calculator",
    secondaryHref: "/tools/google-ads-calculator",
  },

  // Social — TODO(client): add real profile URLs
  social: {
    instagram: "https://instagram.com/", // TODO(client)
    linkedin: "https://linkedin.com/company/", // TODO(client)
    facebook: "https://facebook.com/", // TODO(client)
  },
} as const;

export type SiteConfig = typeof siteConfig;

// ---- Navigation -----------------------------------------------------------

export const mainNav: { label: string; href: string }[] = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Results", href: "/results" },
  { label: "Free Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
