"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { getGPUTier } from "detect-gpu";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { FunnelPoster } from "./funnel-poster";

const FunnelCanvas = dynamic(() => import("./funnel-canvas"), {
  ssr: false,
  loading: () => <FunnelPoster />,
});

/**
 * Entry point for the 3D funnel. Renders a static poster by default and only
 * mounts the WebGL canvas when:
 *   - the section is in/near the viewport (IntersectionObserver), AND
 *   - the GPU tier is >= 1, AND
 *   - the user has not requested reduced motion.
 * This keeps three.js out of the critical path (LCP/SEO) and protects low-end
 * devices.
 */
export function Funnel3D() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const [capable, setCapable] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    getGPUTier()
      .then((t) => {
        // Mount the canvas for any WebGL-capable tier (>=1); only tier 0 falls back.
        if (!cancelled) setCapable(t.tier >= 1);
      })
      .catch(() => !cancelled && setCapable(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showCanvas = inView && capable === true && !reduced;

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      {showCanvas ? <FunnelCanvas isMobile={isMobile} /> : <FunnelPoster />}
    </div>
  );
}
