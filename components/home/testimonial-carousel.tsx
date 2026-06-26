"use client";

import { Marquee } from "@/components/magicui/marquee";
import { homeTestimonials } from "@/lib/data/home";

/**
 * Auto-scrolling testimonial carousel (pause-on-hover). Two rows scrolling in
 * opposite directions. Cards are fixed-width so the marquee loops smoothly.
 * Content is representative until real reviews are supplied (no fake sources).
 */
const AV = ["#6f7d22", "#3f7d18", "#5f6f17", "#8a6d1f", "#4f5f14", "#7a5a2a"];
function initials(name: string) {
  const w = name.trim().split(" ").filter(Boolean);
  return ((w[0]?.[0] ?? "") + (w[1]?.[0] ?? "")).toUpperCase() || "PG";
}

function Card({ t, i }: { t: (typeof homeTestimonials)[number]; i: number }) {
  return (
    <div style={{ width: 360, maxWidth: "82vw", background: "#fff", border: "1px solid #e3e0d0", borderRadius: 22, padding: 24, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ color: "#6f7d22", fontSize: 14, letterSpacing: 2 }}>★★★★★</span>
        <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, color: "#6b6d5c", border: "1px solid #dddbc9", padding: "4px 9px", borderRadius: 6, letterSpacing: ".05em", textTransform: "uppercase" }}>{t.platform}</span>
      </div>
      <p className="serif" style={{ fontSize: 16, color: "#2c2e22", lineHeight: 1.45, flex: 1, textTransform: "none" }}>&ldquo;{t.quote}&rdquo;</p>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #e3e0d0", display: "flex", alignItems: "center", gap: 12 }}>
        <span aria-hidden className="head" style={{ flexShrink: 0, width: 42, height: 42, borderRadius: "50%", background: AV[i % AV.length], color: "#f1efe3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{initials(t.name)}</span>
        <div>
          <div className="head" style={{ fontSize: 14 }}>{t.name}</div>
          <div className="mono" style={{ fontSize: 11, color: "#83856f", letterSpacing: ".03em", marginTop: 3 }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialCarousel() {
  const half = Math.ceil(homeTestimonials.length / 2);
  const rowA = homeTestimonials.slice(0, half);
  const rowB = homeTestimonials.slice(half);
  return (
    <div data-reveal className="relative flex flex-col gap-4 overflow-hidden">
      <Marquee pauseOnHover className="[--duration:46s] [--gap:1rem]">
        {rowA.map((t, i) => <Card key={t.quote} t={t} i={i} />)}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:52s] [--gap:1rem]">
        {rowB.map((t, i) => <Card key={t.quote} t={t} i={i + 3} />)}
      </Marquee>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f7f5ea] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f7f5ea] to-transparent sm:w-32" />
    </div>
  );
}
