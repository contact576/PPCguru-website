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

  // Trust signals — client-confirmed figures (published as real). See
  // lib/data/performance-stats.ts for the full headline-stat source of truth.
  trust: {
    googlePartner: true,
    metaBusinessPartner: true,
    activeClients: "35+",
    adSpendManaged: "$10M+",
    avgRoas: "4.2x",
    leadsGenerated: "120,000+",
    googleReviewRating: "4.9",
    googleReviewCount: "60+",
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

// Dropdown-aware navigation used by the header + mobile menu. Children list only
// routes that exist (new service pages get added to the Services group when they
// ship). The parent `href` is always a real hub page.
export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Google Ads", href: "/services/google-ads" },
      { label: "Meta Ads", href: "/services/meta-ads" },
      { label: "SEO & Local Search", href: "/services/seo" },
      { label: "Creative Production", href: "/services/creative" },
      { label: "Websites & Landing Pages", href: "/services/web-design" },
      { label: "CRM & Marketing Ops", href: "/services/crm" },
      { label: "LinkedIn Ads", href: "/services/linkedin-ads" },
      { label: "TikTok Ads", href: "/services/tiktok-ads" },
      { label: "Microsoft (Bing) Ads", href: "/services/microsoft-ads" },
      { label: "Pinterest Ads", href: "/services/pinterest-ads" },
      { label: "YouTube Ads", href: "/services/youtube-ads" },
      { label: "AI Automation", href: "/services/ai-automation" },
      { label: "Landing Pages & CRO", href: "/services/cro-landing-pages" },
      { label: "All services →", href: "/services" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Physiotherapy & Rehab", href: "/industries/physiotherapy" },
      { label: "Dental & Orthodontics", href: "/industries/dental" },
      { label: "HVAC & Home Comfort", href: "/industries/hvac" },
      { label: "Construction & Renovation", href: "/industries/construction-renovation" },
      { label: "Immigration", href: "/industries/immigration" },
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Law Firms", href: "/industries/law-firms" },
      { label: "All industries →", href: "/industries" },
    ],
  },
  {
    label: "Locations",
    href: "/locations",
    children: [
      { label: "Toronto", href: "/toronto/google-ads" },
      { label: "Mississauga", href: "/mississauga/google-ads" },
      { label: "Brampton", href: "/brampton/google-ads" },
      { label: "Vaughan", href: "/vaughan/google-ads" },
      { label: "Markham", href: "/markham/google-ads" },
      { label: "Ottawa", href: "/ottawa/google-ads" },
      { label: "All locations →", href: "/locations" },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "Google Ads Calculator", href: "/tools/google-ads-calculator" },
      { label: "Meta Ads Calculator", href: "/tools/meta-ads-calculator" },
      { label: "Instant AI Audit", href: "/tools/instant-audit" },
      { label: "Ad Copy Generator", href: "/tools/ad-copy-generator" },
      { label: "All free tools →", href: "/tools" },
    ],
  },
  { label: "Results", href: "/results" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
