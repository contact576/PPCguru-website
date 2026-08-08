/**
 * "Original Reviews from Google" — third-party widget config.
 *
 * The homepage reviews section embeds a Google-reviews widget from one of the
 * common providers below. Until a widget id is set it falls back to the
 * representative testimonial carousel, so nothing ever renders broken.
 *
 * TO GO LIVE:
 *  1. Create a free/paid Google-reviews widget for the "PPC Guru" listing at
 *     one of: Elfsight, Trustindex, or Featurable.
 *  2. Set the provider + id below (or via env — env wins), then rebuild.
 *
 * Env overrides (optional):
 *   NEXT_PUBLIC_REVIEWS_WIDGET_PROVIDER = elfsight | trustindex | featurable
 *   NEXT_PUBLIC_REVIEWS_WIDGET_ID        = <the widget id / embed hash>
 */

export type ReviewsWidgetProvider = "elfsight" | "trustindex" | "featurable" | "none";

const ENV_PROVIDER = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_PROVIDER as ReviewsWidgetProvider | undefined;
const ENV_ID = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_ID;

export const reviewsWidget: { provider: ReviewsWidgetProvider; id: string } = {
  // ↓ Paste your widget provider + id here (or set the env vars above).
  provider: ENV_PROVIDER ?? "none",
  id: ENV_ID ?? "",
};

export function reviewsWidgetConfigured() {
  return reviewsWidget.provider !== "none" && reviewsWidget.id.trim().length > 0;
}

/** Public Google Business listing — used for the header + "See all" link. */
export const googleProfile = {
  name: "PPC Guru",
  // Your shared Google Business Profile link (resolves to the Google listing).
  url: "https://share.google/k2TGOZVdGt9YN3uHO",
  // Shown in the header badge. Update to your real figures when known.
  rating: 5.0,
  count: null as number | null,
};
