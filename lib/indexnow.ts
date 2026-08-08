import "server-only";
import { siteConfig } from "@/lib/site-config";

/**
 * IndexNow — instantly notifies participating search engines (Bing, Yandex,
 * Seznam, Naver) that a URL changed, instead of waiting for the next crawl.
 * Google does NOT use IndexNow and has retired its sitemap-ping endpoint, so
 * for Google we rely on the dynamic sitemap's accurate `lastModified` + a
 * one-time Search Console submission.
 *
 * Best-effort and fail-open: with no `INDEXNOW_KEY` set it's a no-op, and any
 * network error is swallowed so publishing a post can never fail because of it.
 * The key must also be served at `/{...}.txt` — see app/indexnow-key.txt/route.ts.
 */
export function indexNowKey(): string | null {
  return process.env.INDEXNOW_KEY?.trim() || null;
}

export async function pingIndexNow(urls: string[]): Promise<void> {
  const key = indexNowKey();
  if (!key) return; // not configured → silent no-op
  const urlList = [...new Set(urls.filter(Boolean))];
  if (!urlList.length) return;

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: siteConfig.domain,
        key,
        keyLocation: `${siteConfig.url}/indexnow-key.txt`,
        urlList,
      }),
    });
  } catch (err) {
    console.warn("[indexnow] ping failed (non-fatal):", (err as Error)?.message);
  }
}
