import Link from "next/link";
import { Star, BadgeCheck } from "lucide-react";
import { aggregateReview, earnedAwards, reviewSources, type Award as AwardType } from "@/lib/data/reviews";
import { PlatformLogo } from "@/components/brand/platform-logo";

/* ------------------------------------------------------------------ *
 * ReviewRating — verified client star-rating widget.
 * Renders the numeric star rating + count ONLY when a real, verified aggregate
 * exists (lib/data/reviews.ts). Otherwise it shows an honest "verified reviews"
 * state with source chips and a read-reviews link — no fabricated number.
 * ------------------------------------------------------------------ */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={18}
            className={filled ? "text-[var(--color-lime)]" : "text-[var(--color-border-bright)]"}
            fill={filled ? "var(--color-lime)" : "none"}
            strokeWidth={filled ? 0 : 1.5}
          />
        );
      })}
    </span>
  );
}

export function ReviewRating({ align = "center", className = "" }: { align?: "center" | "left"; className?: string }) {
  const sourceChips = reviewSources.filter((s) => s.label);
  const wrap = align === "center" ? "mx-auto text-center items-center" : "text-left items-start";

  if (aggregateReview) {
    const { ratingValue, reviewCount, sourceLabels } = aggregateReview;
    return (
      <div className={`flex max-w-2xl flex-col gap-2 ${wrap} ${className}`}>
        <div className={`flex flex-wrap items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <Stars rating={ratingValue} />
          <span className="head text-2xl leading-none text-[var(--color-ink)]">{ratingValue.toFixed(1)}</span>
          <span className="text-sm text-[var(--color-ink-dim)]" aria-label={`${ratingValue} out of 5 from ${reviewCount} reviews`}>
            from <strong className="text-[var(--color-ink)]">{reviewCount.toLocaleString()}</strong> reviews
          </span>
        </div>
        <p className="mono text-[11px] uppercase tracking-[.12em] text-[var(--color-ink-dim)]">
          Verified on {sourceLabels.join(" & ")}
        </p>
      </div>
    );
  }

  // Honest un-numbered state (until real ratings are verified).
  return (
    <div className={`flex max-w-2xl flex-col gap-2 ${wrap} ${className}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-bright)] bg-white px-4 py-1.5">
        <BadgeCheck size={16} className="text-[var(--color-lime)]" />
        <span className="text-sm font-semibold text-[var(--color-ink)]">Reviewed by real clients</span>
      </span>
      <p className="mono text-[11px] uppercase tracking-[.12em] text-[var(--color-ink-dim)]">
        on {sourceChips.map((s) => s.label).join(", ")} &amp; more ·{" "}
        <Link href="/results" className="underline decoration-[var(--color-lime)] underline-offset-2 hover:text-[var(--color-ink)]">
          read what clients say
        </Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * AwardsStrip — third-party credential / directory badges.
 * Renders only genuinely-earned credentials (lib/data/reviews.ts). Each badge
 * links to its real profile when a url is present. No fabricated badges.
 * ------------------------------------------------------------------ */
function BadgePill({ award }: { award: AwardType }) {
  const mark = award.logoSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={award.logoSrc} alt={award.name} className="h-6 w-auto" />
  ) : award.brand ? (
    <PlatformLogo brand={award.brand} />
  ) : (
    <span className="text-[13px] font-semibold text-[var(--color-ink)]">{award.name}</span>
  );
  const inner = (
    <>
      {mark}
      {award.sub && (
        <span className="mono mt-1 text-[9px] uppercase tracking-[.1em] text-[var(--color-ink-dim)]">{award.sub}</span>
      )}
    </>
  );
  const cls =
    "inline-flex min-w-[112px] flex-col items-center justify-center gap-0 rounded-2xl border border-[var(--color-border-bright)] bg-white px-5 py-3 transition-colors hover:border-[var(--color-ink)]";
  return award.url ? (
    <a href={award.url} target="_blank" rel="noopener noreferrer nofollow" className={cls} aria-label={award.name}>
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

export function AwardsStrip({ heading = true, className = "" }: { heading?: boolean; className?: string }) {
  if (earnedAwards.length === 0) return null;
  return (
    <div className={className}>
      {heading && (
        <p className="mono mb-3 text-center text-[11px] uppercase tracking-[.14em] text-[var(--color-ink-dim)]">
          Certified &amp; recognized by
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {earnedAwards.map((a) => (
          <BadgePill key={a.name} award={a} />
        ))}
      </div>
    </div>
  );
}
