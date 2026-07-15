/**
 * Brand-coloured WORDMARK logos for the review-platform / partner badges.
 *
 * These are lightweight, self-contained wordmark representations (the platforms' official
 * trademark files can't be bundled from here). They read as the brand via its signature
 * colours + letterforms. To use a platform's OFFICIAL verified badge instead, set a
 * `logoSrc` on the award (lib/data/reviews.ts) — the AwardsStrip renders that image first.
 */

const wm = "text-[15px] font-extrabold leading-none tracking-tight";

export function PlatformLogo({ brand }: { brand: string }) {
  switch (brand) {
    case "google":
      return (
        <span className={wm} aria-label="Google" style={{ fontWeight: 700 }}>
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span>
        </span>
      );
    case "meta":
      return (
        <span className={`${wm} inline-flex items-center gap-1`} aria-label="Meta">
          <svg width="18" height="12" viewBox="0 0 40 24" fill="none" aria-hidden>
            <path
              d="M6 4C2.5 4 1 8 1 12s1.5 8 5 8c3 0 5-3.5 7-7 2-3.5 4-7 7-7s5 4 5 8-1.5 8-5 8"
              stroke="#0866FF"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span style={{ color: "#0866FF" }}>Meta</span>
        </span>
      );
    case "clutch":
      return (
        <span className={wm} aria-label="Clutch" style={{ color: "#17313B" }}>
          Clutch<span style={{ color: "#FF3D2E" }}>.</span>
        </span>
      );
    case "goodfirms":
      return (
        <span className={wm} aria-label="GoodFirms">
          <span style={{ color: "#16192C" }}>Good</span>
          <span style={{ color: "#F2703A" }}>Firms</span>
        </span>
      );
    case "designrush":
      return (
        <span className={wm} aria-label="DesignRush">
          <span style={{ color: "#141414" }}>Design</span>
          <span style={{ color: "#E4002B" }}>Rush</span>
        </span>
      );
    case "upcity":
      return (
        <span className={`${wm} inline-flex items-center`} aria-label="UpCity" style={{ color: "#1F5E77" }}>
          UpCity
          <span style={{ color: "#F5821F", marginLeft: 1 }} aria-hidden>
            ▴
          </span>
        </span>
      );
    default:
      return null;
  }
}
