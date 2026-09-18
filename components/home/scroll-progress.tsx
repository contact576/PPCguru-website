"use client";

import { useEffect, useRef } from "react";

/**
 * Thin lime progress bar pinned to the top, tracking page scroll.
 *
 * Plain scroll listener + one transform write per frame — no animation library,
 * so it doesn't pull motion's ~40KB runtime onto the homepage's critical path.
 * The short CSS transition stands in for the old spring smoothing.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="motion-reduce:hidden"
      style={{
        transform: "scaleX(0)",
        transformOrigin: "0%",
        transition: "transform .12s ease-out",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        background: "linear-gradient(90deg,#ceff3a,#9bd227,#6f7d22)",
      }}
    />
  );
}
