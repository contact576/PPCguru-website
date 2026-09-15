import {
  CLIENT_TERMS_VERSION_IDS,
  getClientTermsVersion,
  renderClientTermsDocument,
} from "@/lib/legal/client-service-terms";
import { siteConfig } from "@/lib/site-config";

/**
 * /client-service-terms/<version> — the signed-agreement terms document.
 *
 * A ROUTE HANDLER, not a page, on purpose: the response is the complete,
 * self-contained HTML from lib/legal/client-service-terms.ts, with no site
 * chrome, no analytics, no advertising pixel, no session-replay tool and no
 * third-party request. Three reasons that matters here:
 *
 *  1. Immutability. A contract points at this exact URL. What it serves must
 *     not shift when the marketing site's layout, fonts or scripts change.
 *  2. Evidence. The bytes served are the bytes archived and hashed
 *     (scripts/archive-terms.mts), so the SHA-256 recorded at publication still
 *     matches what a signer would see today.
 *  3. The handoff requires no tracking on this page unless the privacy policy
 *     and consent controls cover it — the simplest way to guarantee that is to
 *     render a document the root layout never touches.
 *
 * `dynamicParams = false` means only published versions exist; anything else
 * 404s, so a typo can never serve an unapproved document.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return CLIENT_TERMS_VERSION_IDS.map((version) => ({ version }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ version: string }> }) {
  const { version: versionId } = await params;
  const version = getClientTermsVersion(versionId);

  if (!version) {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(renderClientTermsDocument(version, siteConfig.url), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Published versions never change, so they cache hard; a revision ships
      // at a new URL rather than mutating this one.
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "x-robots-tag": "index, follow",
    },
  });
}
