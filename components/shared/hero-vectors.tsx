/* ============================================================================
   HeroVectors — layered vector backdrop for hero sections.

   Pure SVG + CSS (no client JS) so it renders on the server and stays out of the
   client bundle. Sits behind hero content as an absolutely-positioned, decorative
   (aria-hidden, pointer-events-none) layer. The parent hero MUST be
   `position: relative; overflow: hidden`.

   Layers, back → front:
     1. Dotted grid, radially masked so it fades at the edges
     2. Flowing contour mesh (accent-tinted line work)
     3. Concentric rings / orbit
     4. Floating accent blobs (blurred radial gradients)
     5. A sparse constellation of "+" and node marks (the brand motif)

   `accent` re-tints the linework + glow per vertical (falls back to lime/olive).
   All motion is CSS keyframe based; globals.css zeroes animation under
   prefers-reduced-motion, so this degrades to a static graphic automatically.
   ========================================================================== */

const INK = "#14170e";
const LIME = "#ceff3a";
const OLIVE = "#6f7d22";

type Props = {
  /** Per-vertical accent colour; tints the mesh + glow. Defaults to olive/lime. */
  accent?: string;
  /** Slightly denser / brighter treatment for full-bleed marketing heroes. */
  variant?: "page" | "feature";
  /** Animate the floating layers (homepage / feature heroes). Off → fully static. */
  animate?: boolean;
  /** Unique id seed so multiple instances on one page don't collide on defs ids. */
  idSeed?: string;
};

export function HeroVectors({ accent, variant = "page", animate = false, idSeed = "hv" }: Props) {
  const line = accent || OLIVE;
  const glow = accent || LIME;
  const dense = variant === "feature";
  const gid = (name: string) => `${idSeed}-${name}`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* 1 — dotted grid, radially masked */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${INK}1f 1px, transparent 1px)`,
          backgroundSize: dense ? "30px 30px" : "34px 34px",
          maskImage: "radial-gradient(ellipse 75% 75% at 65% 35%, #000 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 65% 35%, #000 10%, transparent 75%)",
          opacity: dense ? 0.55 : 0.4,
        }}
      />

      {/* 2 — flowing contour mesh + 3 — rings, in one SVG */}
      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: dense ? 0.7 : 0.55 }}
      >
        <defs>
          <linearGradient id={gid("mesh")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={line} stopOpacity={dense ? 0.5 : 0.32} />
            <stop offset="1" stopColor={line} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* contour ribbons */}
        <g fill="none" stroke={`url(#${gid("mesh")})`} strokeWidth="1.25">
          <path d="M-40 170 C 220 110, 380 250, 560 190 S 920 80, 1260 210" />
          <path d="M-40 250 C 240 190, 400 330, 600 270 S 940 160, 1260 290" />
          <path d="M-40 330 C 260 270, 440 410, 660 350 S 1000 240, 1260 380" />
          <path d="M-40 430 C 280 370, 460 510, 700 450 S 1040 340, 1260 480" />
        </g>

        {/* faint ink contours for depth */}
        <g fill="none" stroke={INK} strokeWidth="1" strokeOpacity="0.045">
          <path d="M-40 210 C 200 150, 380 290, 560 230 S 920 120, 1260 250" />
          <path d="M-40 390 C 240 330, 420 470, 640 410 S 980 300, 1260 430" />
        </g>

        {/* concentric orbit rings */}
        <g fill="none" stroke={line} strokeWidth="1" strokeOpacity={dense ? 0.18 : 0.12}>
          <ellipse cx="880" cy="300" rx="220" ry="200" />
          <ellipse cx="880" cy="300" rx="330" ry="290" />
          <ellipse cx="880" cy="300" rx="450" ry="380" />
        </g>

        {/* a couple of orbiting nodes on the rings */}
        <circle cx="1100" cy="300" r="4" fill={glow} />
        <circle cx="660" cy="300" r="3" fill={line} />
        <circle cx="880" cy="-80" r="3.5" fill={glow} opacity="0.8" />
      </svg>

      {/* 4 — floating accent blobs */}
      <div
        className={animate ? "hv-float-a" : undefined}
        style={{
          position: "absolute",
          top: "-12%",
          right: "-6%",
          width: dense ? 520 : 440,
          height: dense ? 520 : 440,
          background: `radial-gradient(circle, color-mix(in srgb, ${glow} ${dense ? 34 : 24}%, transparent), transparent 66%)`,
        }}
      />
      <div
        className={animate ? "hv-float-b" : undefined}
        style={{
          position: "absolute",
          bottom: "-22%",
          left: "-8%",
          width: dense ? 460 : 360,
          height: dense ? 460 : 360,
          background: `radial-gradient(circle, color-mix(in srgb, ${line} ${dense ? 16 : 12}%, transparent), transparent 68%)`,
        }}
      />

      {/* 5 — constellation of "+" marks + nodes (brand motif) */}
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g stroke={line} strokeWidth="1.4" strokeLinecap="round" opacity={dense ? 0.55 : 0.42}>
          {[
            [150, 120], [1040, 150], [1130, 470], [90, 520], [520, 90], [980, 560],
          ].map(([x, y], i) => (
            <g key={i} className={animate ? (i % 2 ? "hv-twinkle-b" : "hv-twinkle-a") : undefined} style={{ transformOrigin: `${x}px ${y}px` }}>
              <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
              <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
            </g>
          ))}
        </g>
        <g fill={glow} opacity="0.7">
          {[[300, 180], [760, 130], [1080, 330], [220, 380], [620, 600]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 2.5 : 3.5} className={animate ? "hv-pulse" : undefined} style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.6}s` }} />
          ))}
        </g>
      </svg>
    </div>
  );
}
