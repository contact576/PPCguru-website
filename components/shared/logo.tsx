import Link from "next/link";

/**
 * PPC Guru logo — a lime growth-mark tile + the established stacked "PPC Guru.ca"
 * wordmark. `variant="light"` is for dark backgrounds (footer); `"dark"` is for
 * light backgrounds (header). Pass `href` to make it a link.
 */
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
  const text = variant === "light" ? "#f1efe3" : "#14170e";
  const accent = variant === "light" ? "#ceff3a" : "#6f7d22";

  const mark = (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden role="img" style={{ flexShrink: 0 }}>
      <rect width="40" height="40" rx="11" fill="#ceff3a" />
      {/* upward growth trend + arrowhead */}
      <path d="M9 27 L17 20 L23 24 L31 13" stroke="#14170e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.5 13 L31 13 L31 19.5" stroke="#14170e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* node + spark */}
      <circle cx="9" cy="27" r="2.4" fill="#14170e" />
      <path d="M14 9 l1.3 3 l3 1.3 l-3 1.3 l-1.3 3 l-1.3 -3 l-3 -1.3 l3 -1.3 z" fill="#6f7d22" />
    </svg>
  );

  const content = (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      {mark}
      {wordmark ? (
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 0.8 }}>
          <span className="serif" style={{ fontSize: size * 0.33, color: text, letterSpacing: ".02em" }}>PPC</span>
          <span className="grotesk" style={{ fontWeight: 900, fontSize: size * 0.47, letterSpacing: "-.01em", color: text, textTransform: "uppercase" }}>
            Guru<span style={{ color: accent }}>.ca</span>
          </span>
        </span>
      ) : null}
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
