import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Explicitly welcome approved search and answer-engine crawlers while keeping
// private, transactional, and low-value routes out of their crawl queues.
const ALLOWED_CRAWLERS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

const BLOCKED_CRAWLERS = [
  "CCBot",
  "Bytespider",
  "Diffbot",
  "Amazonbot",
  "Scrapy",
  "MJ12bot",
];

// Add "AhrefsBot" and "SemrushBot" here only if PPC Guru chooses to block
// competitor-research crawlers. They remain allowed through the wildcard rule.
const EXCLUDED_PATHS = [
  "/api",
  "/admin",
  "/search",
  "/*?s=",
  "/*&s=",
  "/cart",
  "/checkout",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ALLOWED_CRAWLERS, allow: "/", disallow: EXCLUDED_PATHS },
      { userAgent: BLOCKED_CRAWLERS, disallow: "/" },
      { userAgent: "*", allow: "/", disallow: EXCLUDED_PATHS },
    ],
    // The removal sitemap lists the hacked-in casino URLs (all 410 Gone) so
    // Google re-crawls and drops them. Temporary — delete once the index is
    // clean. Kept OUT of /sitemap.xml, which must only carry live pages.
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/spam-removal-sitemap.xml`],
  };
}

