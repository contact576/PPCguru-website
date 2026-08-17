import { NextResponse, type NextRequest } from "next/server";
import { GONE_PATHS } from "@/lib/gone-paths";

/**
 * Kills the casino/gambling spam URLs left over from the compromised WordPress
 * site. They were removed from the server, but Google still has them indexed.
 *
 * A plain 404 works eventually; **410 Gone** tells Google the URL is
 * permanently dead and is dropped from the index noticeably faster. We also send
 * `X-Robots-Tag: noindex` so any crawler that ignores the status still gets the
 * message. These paths must stay CRAWLABLE (never robots.txt-blocked) — a
 * blocked URL can't be re-crawled, so Google would never see the 410 and the
 * spam page would sit in the index indefinitely. `/spam-removal-sitemap.xml`
 * lists them all so Google is nudged to re-crawl rather than waiting to notice.
 *
 * The slug list lives in `lib/gone-paths.ts` (shared with the removal sitemap).
 * Adding more as they surface in Search Console: append the slug there, or rely
 * on SPAM_PATTERN, which catches unknown variants automatically.
 */

/**
 * Catches spam slugs we haven't enumerated yet. Only applied to single-segment
 * top-level paths (that's where the injected pages lived) so real routes —
 * /services/*, /blog/*, /industries/* — can never be caught by it.
 */
const SPAM_PATTERN =
  /(^|-)(casino|casinos|slot|slots|roulette|baccarat|craps|blackjack|poker|bingo|gambling|betting|bet|jackpot|freespins|no-deposit|free-chips|sportsbook|wagering)(-|$)/;

function gone() {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
      `<meta name="robots" content="noindex,nofollow"><title>410 Gone</title></head>` +
      `<body><h1>410 Gone</h1><p>This page never belonged to PPC Guru and has been permanently removed. ` +
      `<a href="https://ppcguru.ca/">Go to ppcguru.ca</a></p></body></html>`,
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}

export default function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();

  // Canonical host: force the bare apex (ppcguru.ca). www.ppcguru.ca must 308 →
  // apex so the two hostnames can never serve or rank as two separate sites.
  // Path + query are preserved. Only the www subdomain is touched — localhost
  // and *.vercel.app preview hosts pass through unchanged.
  if (host.startsWith("www.")) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`https://${host.slice(4)}${pathname}${search}`, 308);
  }

  const slug = request.nextUrl.pathname.toLowerCase().replace(/^\/|\/+$/g, "");

  // Only top-level, single-segment paths are candidates.
  if (slug && !slug.includes("/") && (GONE_PATHS.has(slug) || SPAM_PATTERN.test(slug))) {
    return gone();
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, the API, and anything with a file extension.
  matcher: ["/((?!api/|_next/|.*\\.).*)"],
};
