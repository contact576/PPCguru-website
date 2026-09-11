import Link from "next/link";

/**
 * PPC Guru logo — the ORIGINAL brand artwork (smiling guru in the orange/gold
 * turban-lightbulb + "PPC GURU.CA" wordmark), restored 2026-09-12 from the
 * client-supplied file (public/brand/ppc-guru-logo.png, transparent). This
 * replaced the interim lime "growth tile" mark that shipped with redesign v2.
 *
 * `variant="light"` swaps to the cream-text edition for dark backgrounds
 * (footer); `"dark"` is the standard edition for light backgrounds (header).
 * `size` is the rendered HEIGHT in px (the artwork is 2.87:1). `wordmark=false`
 * renders just the guru mark (square).
 */
const RATIO = 1760 / 614;

export function Logo({
  variant = "dark",
  wordmark = true,
  size = 38,
  href,
  className,
}: {
  variant?: "dark" | "light";
  wordmark?: boolean;
  size?: number;
  href?: string;
  className?: string;
}) {
  const src = wordmark ? (variant === "light" ? "/brand/ppc-guru-logo-light-720.png" : "/brand/ppc-guru-logo-720.png") : "/brand/ppc-guru-mark.png";
  const width = wordmark ? Math.round(size * RATIO) : size;

  const content = (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- brand PNG; next/image adds nothing for a fixed-size logo */}
      <img src={src} alt="PPC Guru" width={width} height={size} style={{ height: size, width: "auto", display: "block" }} decoding="async" fetchPriority="high" />
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="PPC Guru — home" className="logo-link" style={{ display: "inline-flex" }}>
        {content}
      </Link>
    );
  }
  return content;
}
