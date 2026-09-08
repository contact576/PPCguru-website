"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { skipHeavyMotion } from "@/lib/motion-env";

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

  useEffect(() => {
    const el = ref.current;
    if (!el || skipHeavyMotion()) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = el.parentElement ?? el;
      ctx = gsap.context(() => {
        gsap.to(el, {
          yPercent: speed,
          ease: "none",
          scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: true },
        });
      }, ref);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} aria-hidden>
      {children}
    </div>
  );
}
