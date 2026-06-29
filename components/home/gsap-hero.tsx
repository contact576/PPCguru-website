"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * GSAP entrance timeline for the homepage hero. Staggers the direct children
 * (eyebrow → headline → subcopy → CTAs → trust row) up into place on load.
 * useGSAP sets the from-state before paint, so there's no flash. Respects
 * reduced motion (renders children statically).
 */
export function GsapHeroReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(el.children, {
        opacity: 0,
        y: 38,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.05,
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
