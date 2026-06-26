"use client";

import { Marquee } from "@/components/magicui/marquee";
import { homeTestimonials } from "@/lib/data/home";

/**
 * Auto-scrolling testimonial carousel (pause-on-hover). Two rows scrolling in
 * opposite directions. Cards are fixed-width so the marquee loops smoothly.
 * Content is representative until real reviews are supplied (no fake sources).
 */
function Card({ t }: { t: (typeof homeTestimonials)[number] }) {
  return (
    <div style={{ width: 360, background: "#fff", border: "1px solid #e3e0d0", borderRadius: 22, padding: 24, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ color: "#6f7d22", fontSize: 14, letterSpacing: 2 }}>★★★★★</span>
        <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, color: "#6b6d5c", border: "1px solid #dddbc9", padding: "4px 9px", borderRadius: 6, letterSpacing: ".05em", textTransform: "uppercase" }}>{t.platform}</span>
      </div>
      <p className="serif" style={{ fontSize: 16, color: "#2c2e22", lineHeight: 1.45, flex: 1, textTransform: "none" }}>&ldquo;{t.quote}&rdquo;</p>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #e3e0d0" }}>
        <div className="head" style={{ fontSize: 14 }}>{t.name}</div>
        <div className="mono" style={{ fontSize: 11, color: "#83856f", letterSpacing: ".03em", marginTop: 3 }}>{t.role}</div>
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
        {rowA.map((t) => <Card key={t.quote} t={t} />)}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:52s] [--gap:1rem]">
        {rowB.map((t) => <Card key={t.quote} t={t} />)}
      </Marquee>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f7f5ea] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f7f5ea] to-transparent sm:w-32" />
    </div>
  );
}
