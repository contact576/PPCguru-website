"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { skipHeavyMotion } from "@/lib/motion-env";

/**
 * GSAP entrance timeline for the homepage hero. Staggers the direct children
 * (eyebrow → headline → subcopy → CTAs → trust row) up into place on load.
 *
 * ⚠ This component animates the element that IS the mobile LCP — the <h1>.
 * `gsap.from({opacity: 0})` renders its from-state the moment the tween is
 * created, i.e. after hydration, so the server-painted headline was being
 * hidden again and faded back in. Measured: 1.2s FCP, 7.3s LCP on a Moto G
 * over slow 4G. The largest paint was waiting on React + GSAP to download,
 * parse and run.
 *
 * So on touch (or with reduced motion) it does nothing whatsoever, and GSAP is
 * imported DYNAMICALLY after that check — a phone never downloads it for this.
 * If you add an entrance animation to above-the-fold content, it has to clear
 * both bars: no from-state before paint, and no library on the mobile path.
 */
export function GsapHeroReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || skipHeavyMotion()) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    void (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled || !ref.current) return;
      ctx = gsap.context(() => {
        gsap.from(el.children, {
          opacity: 0,
          y: 38,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.05,
        });
      }, ref);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
