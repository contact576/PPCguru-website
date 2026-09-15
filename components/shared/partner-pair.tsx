import { BrandIcon } from "@/components/shared/brand-logos";
import { GOOGLE_PARTNER_BADGE, GOOGLE_PARTNER_PROFILE_URL, META_PARTNER_URL } from "@/lib/data/certifications";

/**
 * Google Partner + Meta Business Partner, as TWO IDENTICAL cards.
 *
 * The official artwork disagrees on shape — Google ships a square badge, Meta a
 * wide lockup — so putting the raw files side by side always looked lopsided.
 * Here each partner gets the same frame (same width, height, radius, padding)
 * with a square mark on the left and the same two lines of text on the right:
 * Google's official badge, and the Meta infinity mark on a matching chip.
 *
 * Server-safe (no hooks, inline styles), so it renders inside the RSC landing
 * pages, inside client components and inside `.lp-root` alike. Both cards link
 * out to the profile/proof the claim comes from.
 */

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { mark: number; title: number; sub: number; basis: number; pad: string; gap: number; radius: number }> = {
  sm: { mark: 38, title: 12.5, sub: 10.5, basis: 228, pad: "8px 14px 8px 8px", gap: 10, radius: 12 },
  md: { mark: 48, title: 14.5, sub: 11.5, basis: 236, pad: "10px 16px 10px 10px", gap: 12, radius: 14 },
  lg: { mark: 60, title: 16, sub: 12, basis: 290, pad: "12px 20px 12px 12px", gap: 14, radius: 16 },
};

function Card({
  href,
  label,
  title,
  sub,
  mark,
  s,
}: {
  href: string;
  label: string;
  title: string;
  sub: string;
  mark: React.ReactNode;
  s: (typeof SIZES)[Size];
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={label}
      className="transition-transform hover:-translate-y-0.5"
      style={{
        flex: `1 1 ${s.basis}px`,
        minWidth: 0,
        maxWidth: s.basis + 60,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: s.gap,
        padding: s.pad,
        borderRadius: s.radius,
        border: "1.5px solid #e0e3d2",
        background: "#fff",
        color: "#14170e",
        textDecoration: "none",
        boxShadow: "0 6px 18px rgba(20,23,14,.05)",
      }}
    >
      <span style={{ display: "inline-flex", width: s.mark, height: s.mark, flex: `0 0 ${s.mark}px`, alignItems: "center", justifyContent: "center" }}>
        {mark}
      </span>
      <span style={{ display: "grid", gap: 2, minWidth: 0, lineHeight: 1.2 }}>
        <strong style={{ fontSize: s.title, fontWeight: 900, letterSpacing: "-.01em" }}>{title}</strong>
        <small style={{ fontSize: s.sub, color: "#7c8071", fontWeight: 600 }}>{sub}</small>
      </span>
    </a>
  );
}

export function PartnerPair({
  size = "md",
  className,
  style,
}: {
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
}) {
  const s = SIZES[size];
  return (
    <div className={className} style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 12, ...style }}>
      <Card
        href={GOOGLE_PARTNER_PROFILE_URL}
        label="Google Partner — view PPC Guru's profile on Google Partners"
        title="Google Partner"
        sub="Verified agency profile"
        s={s}
        mark={
          // eslint-disable-next-line @next/next/no-img-element -- official Google Partners artwork
          <img src={GOOGLE_PARTNER_BADGE} alt="Google Partner" width={s.mark} height={s.mark} style={{ width: s.mark, height: "auto" }} />
        }
      />
      <Card
        href={META_PARTNER_URL}
        label="Meta Business Partner — see the partner documentation"
        title="Meta Business Partner"
        sub="Facebook & Instagram ads"
        s={s}
        // Radius matches the Google badge artwork so the two marks twin.
        mark={<BrandIcon name="Meta Ads" size={s.mark} radius={Math.round(s.mark * 0.13)} />}
      />
    </div>
  );
}
