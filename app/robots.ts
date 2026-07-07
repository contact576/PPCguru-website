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
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
