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
  { name: "Google Partner", group: "credential", sub: "Partner program" },
  { name: "Meta Business Partner", group: "credential", sub: "Partner program" },
  { name: "BBB Accredited", group: "credential", sub: "Accredited business" },

  // ---- Brands we work with (footer carousel — client supplies real assets) ----
  // [VERIFY] replace these placeholders with real client/brand logos + consent.
  { name: "Northside Physio", group: "client" },
  { name: "ComfortAir HVAC", group: "client" },
  { name: "BrightSmile Dental", group: "client" },
  { name: "Apex Renovations", group: "client" },
  { name: "Maple Immigration", group: "client" },
  { name: "Skyline Realty", group: "client" },
  { name: "PureForm Med Spa", group: "client" },
  { name: "FitHouse Studios", group: "client" },
];

export const logosByGroup = (group: LogoGroup) => logos.filter((l) => l.group === group);

/** Groups used by the homepage "AI operating system" section. */
export const aiToolGroups: { title: string; tools: string[] }[] = [
  { title: "Research & strategy", tools: ["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok", "DeepSeek"] },
  { title: "Creative & video", tools: ["Midjourney", "Firefly", "Runway", "HeyGen", "ElevenLabs", "CapCut"] },
  { title: "Ads & optimization", tools: ["Google Ads", "Meta Ads Manager", "Performance Max", "Optmyzr", "Madgicx", "Revealbot"] },
  { title: "SEO & website", tools: ["Search Console", "Semrush", "Ahrefs", "Screaming Frog", "Surfer SEO", "Clarity"] },
  { title: "Automation & reporting", tools: ["Zapier", "Make", "n8n", "Airtable", "Looker Studio", "Supermetrics"] },
  { title: "Build & deploy", tools: ["Claude Code", "Cursor", "v0", "GitHub", "Vercel", "Next.js"] },
];
