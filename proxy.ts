import { NextResponse, type NextRequest } from "next/server";

/**
 * Kills the casino/gambling spam URLs left over from the compromised WordPress
 * site. They were removed from the server, but Google still has them indexed.
 *
 * A plain 404 works eventually; **410 Gone** tells Google the URL is
 * permanently dead and is dropped from the index noticeably faster. We also send
 * `X-Robots-Tag: noindex` so any crawler that ignores the status still gets the
 * message. These paths must stay CRAWLABLE (never robots.txt-blocked) — a
 * blocked URL can't be re-crawled, so Google would never see the 410 and the
 * spam page would sit in the index indefinitely.
 *
 * Adding more as they surface in Search Console: drop the slug into GONE_PATHS,
 * or rely on SPAM_PATTERN, which catches unknown variants automatically.
 */

/** Exact spam slugs found indexed (Search Console, Jul 2026). */
const GONE_PATHS = new Set([
  "mobile-slots-canada",
  "mobile-casino-new",
  "mobile-slots-review",
  "10-deposit-casinos",
  "popular-slot-machines",
  "10-free-casino",
  "10-free-casinos",
  "mobile-casino-games",
  "safe-casino-online",
  "craps-card-game",
  "good-payout-slots",
  "maximum-casino-review",
  "craps-introduction-canada",
  "any-casinos-in-canada",
  "most-reliable-online-casino",
  "safest-gambling-sites-canada",
  "older-casinos-in-canada",
  "mini-slot-machine-canada",
  "mobile-casino-free-money",
  "safe-canada-online-casino",
  "most-popular-online-casinos",
  "1-canada-online-casino",
  "888-casino-canada-app",
  "10-free-casino-canada",
  "springbok-casino-no-deposit-canada",
  "american-roulette-wheel-vs-european",
  "book-of-dead-slot-canada",
  "5-minimum-deposit-casino-canada",
  "18-plus-casino-in-canada",
  "mobile-casinos-for-real-money",
  "pros-of-casinos-in-canada",
  "welcome-bonus-casino-no-deposit-canada",
  "bohocasino-review-and-free-chips-bonus",
  "10-minimum-deposit-online-casino-canada",
  "win-online-slots",
  "winning-baccarat-system",
  "popular-casino-games",
  "american-roulette-games",
  "american-roulette-game-free",
  "10-top-casinos-online",
  "5-no-deposit-casino",
  "10-dollar-free-slots",
  "is-online-casino-safe",
  "age-for-casino-in-canada",
  "3-minimum-deposit-casino-canada",
  "most-popular-casino-games-in-canada",
  "10-free-bet-no-deposit-casino",
  "karamba-casino-review-and-free-chips-bonus",
]);

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
