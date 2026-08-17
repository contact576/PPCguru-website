/**
 * Casino/gambling spam slugs injected into the old, compromised WordPress site.
 * The pages are gone from the server, but Google still has them indexed.
 *
 * Single source of truth, consumed by two places that must never drift apart:
 *   - `proxy.ts` — serves each one a 410 Gone + `X-Robots-Tag: noindex`.
 *   - `app/spam-removal-sitemap.xml/route.ts` — a removal sitemap listing the
 *     same URLs so Google re-crawls them promptly and sees the 410.
 *
 * Adding more as they surface in Search Console: append the slug here and both
 * the 410 and the removal sitemap pick it up. Unknown variants are still caught
 * automatically by SPAM_PATTERN in `proxy.ts` (they just won't be listed in the
 * removal sitemap, which only enumerates URLs Google is known to have indexed).
 */

/** Exact spam slugs found indexed (Search Console, Jul–Aug 2026). */
export const GONE_SLUGS = [
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
] as const;

/** Lookup form used by the proxy on every request. */
export const GONE_PATHS: ReadonlySet<string> = new Set<string>(GONE_SLUGS);

/**
 * `lastmod` for the removal sitemap — the date the pages were confirmed dead.
 * A recent stamp is what pushes Google to re-crawl; bump it if a fresh crawl
 * round is needed later. Kept as a literal (never `new Date()`) so the sitemap
 * doesn't claim "modified just now" on every single build.
 */
export const GONE_LASTMOD = "2026-08-17";
