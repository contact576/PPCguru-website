"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP ScrollTrigger parallax. Drifts its children vertically as the parent
 * section scrolls through the viewport — used behind hero sections for depth.
 * Decorative only (aria-hidden); disabled under reduced motion.
 */
export function ScrollParallax({
  children,
  speed = 16,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const trigger = el.parentElement ?? el;
      gsap.to(el, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} aria-hidden>
      {children}
    </div>
  );
}
