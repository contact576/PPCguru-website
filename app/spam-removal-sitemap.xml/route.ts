import { GONE_SLUGS, GONE_LASTMOD } from "@/lib/gone-paths";
import { siteConfig } from "@/lib/site-config";

/**
 * Removal sitemap for the casino spam URLs injected into the old, compromised
 * WordPress site. Every URL listed here answers **410 Gone** (see `proxy.ts`).
 *
 * Deliberately a SEPARATE sitemap from `/sitemap.xml`: dead URLs must never sit
 * in the main sitemap, but Google will not re-crawl a page just because it
 * vanished — it can sit in the index for months. Submitting this file in Search
 * Console (Indexing → Sitemaps) puts all 48 URLs back in the crawl queue at
 * once, Googlebot hits the 410, and they drop out.
 *
 * Expect Search Console to report these as errors/"not indexed" — that is the
 * success signal, not a problem. Once the index is clean, this file and its
 * robots.txt reference can be deleted.
 */

// Static — the slug list is a compile-time constant, so no per-request work.
export const dynamic = "force-static";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const entries = GONE_SLUGS.map(
    (slug) =>
      `  <url>\n` +
      `    <loc>${xmlEscape(`${siteConfig.url}/${slug}`)}</loc>\n` +
      `    <lastmod>${GONE_LASTMOD}</lastmod>\n` +
      `    <changefreq>never</changefreq>\n` +
      `    <priority>0.0</priority>\n` +
      `  </url>`,
  ).join("\n");

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!-- Removal sitemap: every URL below returns 410 Gone. Submitted to Google\n` +
    `     purely to force a re-crawl so these hacked-in spam pages leave the index. -->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries}\n` +
    `</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Short cache so a bumped GONE_LASTMOD reaches Google without a purge.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
