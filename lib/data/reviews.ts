/**
 * Reviews + third-party credentials — SINGLE SOURCE for the star-rating widget,
 * the awards/badge strip, and the (gated) AggregateRating schema.
 *
 * HONESTY GATE (see CLAUDE.md): nothing here is ever fabricated.
 *  - A review SOURCE only shows a star rating / feeds AggregateRating schema when
 *    `verified: true` AND real `rating` + `count` are filled in. Until then the widget
 *    renders an honest "verified client reviews" state with NO number and schema stays OFF.
 *  - An AWARD only renders when `earned: true`. `url` links the badge to the real profile
 *    when provided (also strengthens the Organization entity — see seo.ts sameAs).
 *
 * TO GO LIVE: paste the real numbers/URLs below, flip the flags, done — no code changes.
 */

export type ReviewSource = {
  key: string;
  /** Display label, e.g. "Google", "Clutch". */
  label: string;
  /** Real average rating out of 5 (e.g. 4.9). Keep null until verified. */
  rating: number | null;
  /** Real number of reviews. Keep null until verified. */
  count: number | null;
  /** Public profile URL clients can verify against. TODO(client). */
  url: string;
  /** Master gate — must be true AND rating/count set for the rating + schema to show. */
  verified: boolean;
};

// [VERIFY-client] Fill rating + count from the REAL profiles, then set verified: true.
export const reviewSources: ReviewSource[] = [
  { key: "google", label: "Google", rating: null, count: null, url: "", verified: false },
  { key: "clutch", label: "Clutch", rating: null, count: null, url: "", verified: false },
];

/**
 * Combined aggregate across VERIFIED sources (count-weighted). Null when nothing is
 * verified yet — callers must treat null as "no rating to show / no schema to emit".
 */
export const aggregateReview: { ratingValue: number; reviewCount: number; sourceLabels: string[] } | null = (() => {
  const live = reviewSources.filter(
    (s) => s.verified && typeof s.rating === "number" && typeof s.count === "number" && (s.count as number) > 0,
  );
  if (live.length === 0) return null;
  const totalCount = live.reduce((sum, s) => sum + (s.count as number), 0);
  const weighted = live.reduce((sum, s) => sum + (s.rating as number) * (s.count as number), 0);
  return {
    ratingValue: Math.round((weighted / totalCount) * 10) / 10,
    reviewCount: totalCount,
    sourceLabels: live.map((s) => s.label),
  };
})();

/** Profile URLs of verified review sources — usable in Organization.sameAs. */
export const verifiedReviewUrls = reviewSources.filter((s) => s.verified && s.url).map((s) => s.url);

export type Award = {
  name: string;
  /** Small qualifier under the name, e.g. "Partner program". */
  sub?: string;
  /** Verification / profile URL. TODO(client) — badge links out when set. */
  url: string;
  /** Gate — badge renders only when the credential is genuinely earned. */
  earned: boolean;
  /** Brand slug → renders a brand-coloured wordmark logo (components/brand/platform-logo.tsx). */
  brand?: "google" | "meta" | "clutch" | "goodfirms" | "designrush" | "upcity";
  /**
   * Path to the platform's OFFICIAL badge/logo asset (drop into /public, e.g.
   * "/badges/clutch.svg"). When set it renders instead of the wordmark. Each of Clutch /
   * GoodFirms / DesignRush / UpCity provides a real embeddable verified-badge SVG — using it
   * is the ideal (verifiable + links to your live profile). TODO(client).
   */
  logoSrc?: string;
};

/**
 * Third-party credentials & directory recognitions. Order = display priority.
 * earned:true = client-confirmed real. Add the real `url` (badge links out + feeds
 * Organization.sameAs) and, ideally, the official `logoSrc`. Keep unearned ones earned:false.
 */
export const awards: Award[] = [
  { name: "Google Partner", sub: "Partner program", url: "", earned: true, brand: "google" },
  { name: "Meta Business Partner", sub: "Partner program", url: "", earned: true, brand: "meta" },
  { name: "Clutch", sub: "Reviewed agency", url: "", earned: true, brand: "clutch" },
  { name: "GoodFirms", sub: "Verified reviews", url: "", earned: true, brand: "goodfirms" },
  { name: "DesignRush", sub: "Listed agency", url: "", earned: true, brand: "designrush" },
  { name: "UpCity", sub: "Verified provider", url: "", earned: true, brand: "upcity" },
  // Built but hidden until genuinely earned — flip to true + add url when it is.
  { name: "Semrush Agency Partner", sub: "Certified partner", url: "", earned: false },
];

export const earnedAwards = awards.filter((a) => a.earned);
/** Award profile URLs — usable in Organization.sameAs once populated. */
export const awardUrls = earnedAwards.filter((a) => a.url).map((a) => a.url);
