"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { growthLoop } from "@/lib/data/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ink = "#14170e", olive = "#6f7d22";

/**
 * Growth Loop as a PINNED, scroll-scrubbed section (desktop). The section pins
 * while the four steps light up one-by-one as you scroll through it, then
 * releases. On mobile / reduced-motion it renders as a normal responsive grid.
 */
export function GrowthLoopPinned() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-step]"));
        const bars = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-step] [data-bar]"));
        gsap.set(cards, { opacity: 0.28, y: 44, scale: 0.96 });
        gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=" + cards.length * 340,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });
        cards.forEach((c, i) => {
          tl.to(c, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }, i)
            .to(bars[i], { scaleX: 1, duration: 1, ease: "none" }, i);
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="process"
      style={{ background: "#f7f5ea", color: ink, borderBottom: "1px solid #e3e0d0", position: "relative", overflow: "hidden" }}
      className="flex min-h-[60vh] items-center lg:min-h-screen"
    >
      <div className="ambient-glow" style={{ position: "absolute", top: -100, right: -60, width: 380, height: 380, background: "radial-gradient(circle,rgba(206,255,58,.07),transparent 65%)" }} />
      <div className="mx-auto w-full max-w-[1480px] px-5 py-16 md:px-8" style={{ position: "relative" }}>
        <div style={{ maxWidth: 720, margin: "0 auto 52px", textAlign: "center" }}>
          <div className="mono" style={{ color: olive, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", fontSize: 12, marginBottom: 16 }}>How it works</div>
          <h2 className="head" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>
            The Guru <span className="serif" style={{ textTransform: "none", fontWeight: 400, fontStyle: "italic", color: "#5d6b1a" }}>Growth</span> Loop
          </h2>
          <p style={{ fontSize: 17, color: "#54564a", marginTop: 18, lineHeight: 1.6 }}>
            A simple, repeatable loop that compounds results month over month — scroll to watch it run.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {growthLoop.map((l) => (
            <div key={l.num} data-step style={{ background: "#fff", border: "1px solid #e3e0d0", borderRadius: 22, padding: 26 }}>
              <div className="head" style={{ fontSize: 42, color: "rgba(111,125,34,.3)", marginBottom: 14 }}>{l.num}</div>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "#eef2dd", color: "#5f6f17", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, marginBottom: 16 }}>{l.icon}</div>
              <div className="head" style={{ fontSize: 19, marginBottom: 9 }}>{l.title}</div>
              <div style={{ fontSize: 13.5, color: "#54564a", lineHeight: 1.55, marginBottom: 16 }}>{l.desc}</div>
              <div style={{ height: 3, background: "#e3e0d0", borderRadius: 999, overflow: "hidden" }}>
                <div data-bar style={{ height: "100%", background: olive, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
