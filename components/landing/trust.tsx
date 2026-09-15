import { BadgeCheck, ExternalLink } from "lucide-react";
import { BrandIcon } from "@/components/shared/brand-logos";
import { PlatformLogo } from "@/components/brand/platform-logo";
import { earnedAwards } from "@/lib/data/reviews";
import {
  GOOGLE_PARTNER_BADGE,
  GOOGLE_PARTNER_PROFILE_URL,
  META_PARTNER_BADGE,
  META_PARTNER_DIRECTORY_URL,
} from "@/lib/data/certifications";
import { featuredGoogleReviews, googleBusinessProfile, type GoogleReview } from "@/lib/data/google-reviews";
import { clientLogos, logoName } from "@/lib/data/landing-100-leads";

/**
 * Trust blocks shared by the paid landing pages: the two official partner
 * badges, real Google reviews, the public registries we're listed in, and the
 * client logo wall. The Skillshop / Blueprint certification tiles were dropped
 * (2026-09-15) — the badges and reviews carry the proof, the cert grid was
 * clutter. All server-safe (no hooks) so they render inside the RSC landing
 * pages and inside client components alike. Styles: app/100-leads/landing.css.
 */

const LOGOS = "/landing/logos";

/* eslint-disable @next/next/no-img-element -- badge artwork + client logos are tiny static assets */

/** Official Google Partner badge (clickable → public profile) + Meta Business Partner badge. */
export function PartnerBadges({ size = 72, compact = false }: { size?: number; compact?: boolean }) {
  return (
    <div className={compact ? "lp-partner-row is-compact" : "lp-partner-row"}>
      <a
        href={GOOGLE_PARTNER_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="lp-partner-badge lp-partner-google"
        aria-label="Google Partner — view PPC Guru's profile on Google Partners"
        title="Verified on Google Partners"
      >
        <img src={GOOGLE_PARTNER_BADGE} alt="Google Partner" width={size} height={Math.round(size * 0.957)} style={{ height: size, width: "auto" }} />
        {!compact ? (
          <span>
            <strong>Google Partner</strong>
            <small>Verified agency profile · ID 1117142019</small>
          </span>
        ) : null}
      </a>
      <a
        href={META_PARTNER_DIRECTORY_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="lp-partner-badge lp-partner-meta"
        aria-label="Meta Business Partner — view the Meta partner directory"
        title="Meta Business Partner"
      >
        <img src={META_PARTNER_BADGE} alt="Meta Business Partner" width={252} height={56} style={{ height: Math.round(size * 0.72), width: "auto" }} />
        {!compact ? (
          <span>
            <strong>Meta Business Partner</strong>
            <small>Facebook &amp; Instagram ads partner program</small>
          </span>
        ) : null}
      </a>
    </div>
  );
}

/** Third-party directories / registries where PPC Guru is listed (linked to each profile). */
export function RegistriesStrip({ heading = true }: { heading?: boolean }) {
  const listed = earnedAwards.filter((a) => a.brand && a.brand !== "google" && a.brand !== "meta");
  return (
    <div className="lp-registries">
      {heading ? (
        <p className="lp-trust-label">
          <BadgeCheck aria-hidden="true" /> Listed &amp; reviewed on
        </p>
      ) : null}
      <ul className="lp-registry-row">
        {listed.map((a) => {
          const inner = (
            <>
              <PlatformLogo brand={a.brand as string} />
              {a.sub ? <small>{a.sub}</small> : null}
            </>
          );
          return (
            <li key={a.name}>
              {a.url ? (
                <a href={a.url} target="_blank" rel="noopener noreferrer nofollow" className="lp-registry" aria-label={`${a.name} — ${a.sub ?? "profile"}`}>
                  {inner}
                </a>
              ) : (
                <span className="lp-registry">{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="lp-stars" aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill={i < n ? "#FBBC05" : "#e3e0d0"} />
        </svg>
      ))}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function reviewDate(iso: string) {
  const d = new Date(iso);
  return isNaN(+d) ? "" : d.toLocaleDateString("en-CA", { month: "short", year: "numeric" });
}

/** Real reviews from the PPC Guru Google Business Profile. */
export function GoogleReviewsBlock({ limit = 6, reviews = featuredGoogleReviews, heading = true }: { limit?: number; reviews?: GoogleReview[]; heading?: boolean }) {
  const shown = reviews.slice(0, limit);
  return (
    <div className="lp-reviews" id="reviews">
      {heading ? (
        <div className="lp-reviews-head">
          <span className="lp-google-pill">
            <BrandIcon name="Google" size={24} radius={7} />
            <span>Reviews from Google</span>
          </span>
          <div className="lp-reviews-score">
            <strong>{googleBusinessProfile.rating.toFixed(1)}</strong>
            <Stars n={5} />
            <span>
              {googleBusinessProfile.reviewCount} reviews · {googleBusinessProfile.name}, Toronto
            </span>
          </div>
        </div>
      ) : null}
      <ul className="lp-review-grid">
        {shown.map((r) => (
          <li key={`${r.name}-${r.date}`} className="lp-review-card">
            <header>
              <span className="lp-review-avatar" aria-hidden="true">
                {initials(r.name)}
              </span>
              <span>
                <strong>{r.name}</strong>
                <small>{reviewDate(r.date)} · Google</small>
              </span>
              <Stars n={r.stars} />
            </header>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
      <div className="lp-reviews-cta">
        <a href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer nofollow">
          Read all {googleBusinessProfile.reviewCount} reviews on Google <ExternalLink aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/**
 * Client logo wall — three continuous rows over the full client list, no
 * industry labels (the vertical grouping was dropped 2026-09-15). Each row
 * holds its slice twice so the -50% marquee loops seamlessly.
 */
const LOGO_ROWS = 3;

export function ClientLogoWall() {
  const per = Math.ceil(clientLogos.length / LOGO_ROWS);
  const rows = Array.from({ length: LOGO_ROWS }, (_, i) => clientLogos.slice(i * per, (i + 1) * per));

  return (
    <section className="logo-proof logo-wall" aria-labelledby="logos-title">
      <div className="logo-proof-heading">
        <p id="logos-title">
          <strong>Trusted across 200+ businesses</strong>
          <span>Real PPC Guru clients — franchises, national brands and local businesses.</span>
        </p>
        <div className="proof-rating">
          <BadgeCheck aria-hidden="true" />
          <span>Google Ads &amp; Meta Ads managed in-house</span>
        </div>
      </div>
      <div className="logo-rows">
        {rows.map((row, ri) => {
          const items = [...row, ...row];
          return (
            <div className="logo-viewport" key={ri} aria-label={ri === 0 ? "Client logos" : undefined}>
              <div
                className={ri % 2 ? "logo-track is-reverse" : "logo-track"}
                style={{ animationDuration: `${Math.max(46, items.length * 3.4)}s` }}
              >
                {items.map((file, i) => (
                  <figure className="logo-item" key={`${file}-${i}`} aria-hidden={i >= row.length}>
                    {/* Eager, low priority: a marquee moves tiles in by transform, and
                        lazy images pop in blank as they arrive. The whole set is ~0.6 MB. */}
                    <img src={`${LOGOS}/${file}`} alt={i < row.length ? logoName(file) : ""} loading="eager" fetchPriority="low" decoding="async" />
                  </figure>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** The full credentials block used under the proof section on every landing page. */
export function TrustSection({ kicker = "Verified credentials", title }: { kicker?: string; title?: React.ReactNode }) {
  return (
    <section className="lp-trust" aria-labelledby="trust-title" id="credentials">
      <div className="lp-trust-head">
        <p className="section-kicker">{kicker}</p>
        <h2 id="trust-title">{title ?? <>Official partners. <span>Reviewed by real clients.</span></>}</h2>
        <p>Every badge and review links to the public profile it comes from, so you can check each claim at source before you book a call.</p>
      </div>
      <PartnerBadges size={84} />
      <GoogleReviewsBlock />
      <RegistriesStrip />
    </section>
  );
}
/* eslint-enable @next/next/no-img-element */
