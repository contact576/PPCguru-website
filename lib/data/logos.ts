/**
 * Logo / credential registry — single source for the "platforms & tools we work
 * with" wall, the AI-tools section, the credential/accreditation strip, and the
 * footer "brands we work with" carousel.
 *
 * We ship clean monochrome TEXT-PILL logos by default (no third-party logo
 * assets are bundled). Each entry has an optional `src` slot: drop an official
 * SVG/PNG into /public and set `src` to swap the pill for the real mark. For
 * credentials (Google Partner, Meta Business Partner, BBB) the badge only claims
 * accreditation once a real `src` asset is provided — no fake badges.
 */

export type LogoGroup =
  | "platform" // ad platforms
  | "analytics" // measurement / reporting
  | "tool" // SEO / optimization / automation tools
  | "ai" // AI models & creative tools
  | "client" // brands we work with (footer carousel)
  | "credential"; // partner badges / accreditation / awards

export type Logo = {
  name: string;
  group: LogoGroup;
  /** Optional real asset under /public (e.g. "/logos/google-ads.svg"). */
  src?: string;
  /** Short label used by the text-pill fallback. */
  abbr?: string;
  /** For credentials: the sub-label (e.g. "Partner program", "Accredited business"). */
  sub?: string;
};

export const logos: Logo[] = [
  // ---- Ad platforms ----
  { name: "Google Ads", group: "platform" },
  { name: "Meta Ads", group: "platform" },
  { name: "YouTube Ads", group: "platform" },
  { name: "Microsoft Ads", group: "platform" },
  { name: "TikTok Ads", group: "platform" },
  { name: "LinkedIn Ads", group: "platform" },
  { name: "Pinterest Ads", group: "platform" },

  // ---- Analytics & measurement ----
  { name: "Google Analytics 4", group: "analytics", abbr: "GA4" },
  { name: "Google Tag Manager", group: "analytics", abbr: "GTM" },
  { name: "Looker Studio", group: "analytics" },
  { name: "Search Console", group: "analytics" },
  { name: "Merchant Center", group: "analytics" },

  // ---- Tools ----
  { name: "Semrush", group: "tool" },
  { name: "Ahrefs", group: "tool" },
  { name: "Optmyzr", group: "tool" },
  { name: "Screaming Frog", group: "tool" },
  { name: "Supermetrics", group: "tool" },
  { name: "Zapier", group: "tool" },
  { name: "Make", group: "tool" },
  { name: "n8n", group: "tool" },

  // ---- AI (used by the homepage "AI operating system" section) ----
  { name: "ChatGPT", group: "ai" },
  { name: "Claude", group: "ai" },
  { name: "Gemini", group: "ai" },
  { name: "Perplexity", group: "ai" },
  { name: "Midjourney", group: "ai" },
  { name: "Runway", group: "ai" },
  { name: "ElevenLabs", group: "ai" },
  { name: "HeyGen", group: "ai" },

  // ---- Credentials / accreditation (badge shows only when `src` is set) ----
  // [VERIFY] Swap these for the OFFICIAL badge artwork downloaded from your
  // Google Partners / Meta Business Partner dashboards before launch — only
  // display them while you hold active partner status.
  { name: "Google Partner", group: "credential", sub: "Partner program", src: "/badges/google-partner.svg" },
  { name: "Meta Business Partner", group: "credential", sub: "Partner program", src: "/badges/meta-business-partner.svg" },
  { name: "BBB Accredited", group: "credential", sub: "Accredited business" },

  // ---- Industries we serve (footer carousel) ----
  // Honest category labels, NOT named clients. Swap to real client logos only
  // with written consent — see CONTENT-TODO.md.
  { name: "Physiotherapy & Rehab", group: "client" },
  { name: "HVAC & Home Comfort", group: "client" },
  { name: "Dental & Orthodontics", group: "client" },
  { name: "Construction & Renovation", group: "client" },
  { name: "Immigration Consulting", group: "client" },
  { name: "Real Estate", group: "client" },
  { name: "Med Spa & Aesthetics", group: "client" },
  { name: "Law Firms", group: "client" },
  { name: "Roofing", group: "client" },
  { name: "Fitness & Gyms", group: "client" },
];

export const logosByGroup = (group: LogoGroup) => logos.filter((l) => l.group === group);

/**
 * Unified "stack" — the single source for the merged homepage section that
 * replaces the old separate "platforms/tools/credentials" + "AI operating
 * system" blocks. Each tool renders as a monochrome pill with a monogram mark.
 */
export const stackGroups: { title: string; tools: string[] }[] = [
  { title: "Advertising platforms", tools: ["Google Ads", "Meta Ads", "YouTube Ads", "Microsoft Ads", "TikTok Ads", "LinkedIn Ads", "Pinterest Ads", "Performance Max"] },
  { title: "Analytics & tracking", tools: ["Google Analytics 4", "Google Tag Manager", "Looker Studio", "Search Console", "Merchant Center", "Microsoft Clarity"] },
  { title: "Research & strategy AI", tools: ["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok", "DeepSeek"] },
  { title: "Creative & video AI", tools: ["Midjourney", "Adobe Firefly", "Runway", "HeyGen", "ElevenLabs", "CapCut", "Descript"] },
  { title: "SEO & content", tools: ["Semrush", "Ahrefs", "Screaming Frog", "Surfer SEO", "Frase"] },
  { title: "Ads optimization", tools: ["Optmyzr", "Adalysis", "Madgicx", "Revealbot", "Foreplay", "AdCreative.ai"] },
  { title: "Automation & reporting", tools: ["Zapier", "Make", "n8n", "Airtable", "Supermetrics", "Slack"] },
  { title: "Build & deploy", tools: ["Claude Code", "Cursor", "v0", "GitHub", "Vercel", "Next.js"] },
  { title: "Partners & accreditation", tools: ["Google Partner", "Meta Business Partner", "BBB Accredited"] },
];

/** Groups used by the homepage "AI operating system" section. */
export const aiToolGroups: { title: string; tools: string[] }[] = [
  { title: "Research & strategy", tools: ["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok", "DeepSeek"] },
  { title: "Creative & video", tools: ["Midjourney", "Firefly", "Runway", "HeyGen", "ElevenLabs", "CapCut"] },
  { title: "Ads & optimization", tools: ["Google Ads", "Meta Ads Manager", "Performance Max", "Optmyzr", "Madgicx", "Revealbot"] },
  { title: "SEO & website", tools: ["Search Console", "Semrush", "Ahrefs", "Screaming Frog", "Surfer SEO", "Clarity"] },
  { title: "Automation & reporting", tools: ["Zapier", "Make", "n8n", "Airtable", "Looker Studio", "Supermetrics"] },
  { title: "Build & deploy", tools: ["Claude Code", "Cursor", "v0", "GitHub", "Vercel", "Next.js"] },
];
