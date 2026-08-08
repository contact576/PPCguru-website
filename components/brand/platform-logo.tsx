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
        <span className={`${wm} inline-flex items-center gap-1.5`} aria-label="Meta">
          <svg width="19" height="12.5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#0866FF"
              d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
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
    case "trustpilot":
      return (
        <span className={`${wm} inline-flex items-center gap-1.5`} aria-label="Trustpilot">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
            <path fill="#00B67A" d="M12 1.5l3.09 6.94 7.41.72-5.6 4.99 1.64 7.35L12 17.77 5.46 21.5l1.64-7.35-5.6-4.99 7.41-.72L12 1.5z" />
          </svg>
          <span style={{ color: "#191919" }}>Trustpilot</span>
        </span>
      );
    case "g2":
      return (
        <span className={`${wm} inline-flex items-center gap-1.5`} aria-label="G2">
          <span
            style={{ background: "#FF492C", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}
            aria-hidden
          >
            G2
          </span>
          <span style={{ color: "#191919" }}>G2</span>
        </span>
      );
    case "themanifest":
      return (
        <span className={wm} aria-label="The Manifest">
          <span style={{ color: "#1D1D1B" }}>the</span>
          <span style={{ color: "#F04E37" }}>manifest</span>
        </span>
      );
    case "sortlist":
      return (
        <span className={wm} aria-label="Sortlist">
          <span style={{ color: "#12344D" }}>Sort</span>
          <span style={{ color: "#00B2A9" }}>list</span>
        </span>
      );
    case "provenexpert":
      return (
        <span className={wm} aria-label="ProvenExpert">
          <span style={{ color: "#005EA8" }}>Proven</span>
          <span style={{ color: "#F7941D" }}>Expert</span>
        </span>
      );
    case "techbehemoths":
      return (
        <span className={wm} aria-label="TechBehemoths">
          <span style={{ color: "#F26522" }}>Tech</span>
          <span style={{ color: "#1B1B1B" }}>Behemoths</span>
        </span>
      );
    case "itprofiles":
      return (
        <span className={wm} aria-label="ITProfiles">
          <span style={{ color: "#0B63CE" }}>IT</span>
          <span style={{ color: "#1B1B1B" }}>Profiles</span>
        </span>
      );
    default:
      return null;
  }
}
