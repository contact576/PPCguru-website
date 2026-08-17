import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Explicitly welcome AI answer-engine crawlers (GEO/AEO) alongside classic search bots.
// Everything is allowed except /api/; AI bots are named so the opt-in intent is unambiguous.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", // OpenAI / ChatGPT
  "PerplexityBot", "Perplexity-User", // Perplexity
  "ClaudeBot", "Claude-Web", "anthropic-ai", // Anthropic / Claude
  "Google-Extended", // Google Gemini / AI training
  "Applebot-Extended", // Apple Intelligence
  "Bingbot", "CCBot", // Bing / Common Crawl
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
    ],
    // The removal sitemap lists the hacked-in casino URLs (all 410 Gone) so
    // Google re-crawls and drops them. Temporary — delete once the index is
    // clean. Kept OUT of /sitemap.xml, which must only carry live pages.
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/spam-removal-sitemap.xml`],
    host: siteConfig.url,
  };
}
