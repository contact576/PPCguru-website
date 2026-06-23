/**
 * Static, dependency-free funnel visual. Defines the LCP/visual slot before
 * (or instead of) the WebGL canvas. Pure SVG + CSS so it ships in the initial
 * HTML and never blocks load.
 */
export function FunnelPoster() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(60% 60% at 50% 35%, rgba(124,92,255,0.35), transparent 70%)" }}
      />
      <svg
        viewBox="0 0 400 500"
        className="absolute left-1/2 top-1/2 h-[90%] -translate-x-1/2 -translate-y-1/2 opacity-90"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="funnelStroke" x1="0" y1="0" x2="0" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5ee7f7" />
            <stop offset="0.6" stopColor="#7c5cff" />
            <stop offset="1" stopColor="#ffce5c" />
          </linearGradient>
          <radialGradient id="dotGlow" cx="0.5" cy="0.5" r="0.5">
            <stop stopColor="#9b7bff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#9b7bff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* funnel outline */}
        <path d="M40 60 L360 60 L235 250 L235 360 L165 400 L165 250 Z" stroke="url(#funnelStroke)" strokeWidth="1.5" opacity="0.55" />

        {/* particle dots distributed through the funnel */}
        {Array.from({ length: 70 }).map((_, i) => {
          const t = i / 70;
          const y = 60 + t * 340;
          const spread = t < 0.55 ? 150 * (1 - t / 0.6) + 12 : 35;
          const x = 200 + (Math.sin(i * 12.9898) * 43758.5453 % 1) * spread - spread / 2;
          const r = 1.4 + ((i * 7) % 5) * 0.5;
          const fill = t < 0.5 ? "#5ee7f7" : t < 0.78 ? "#7c5cff" : "#ffce5c";
          return <circle key={i} cx={x} cy={y} r={r} fill={fill} opacity={0.85} />;
        })}
        {/* basin glow */}
        <ellipse cx="200" cy="395" rx="42" ry="14" fill="url(#dotGlow)" />
      </svg>
    </div>
  );
}
