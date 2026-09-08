"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { skipHeavyMotion } from "@/lib/motion-env";

/**
 * Heading that reveals word-by-word (rising out of a masked line) as it scrolls
 * into view, using GSAP SplitText. Preserves inline markup (e.g. the serif
 * accent span). Falls back to plain text on failure / reduced motion.
 */
export function SplitHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || skipHeavyMotion()) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      ctx = gsap.context(() => {
        let split: InstanceType<typeof SplitText>;
        try {
          split = new SplitText(el, { type: "lines,words", linesClass: "split-line" });
        } catch {
          return;
        }
        gsap.from(split.words, {
          yPercent: 115,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.035,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }, ref);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return createElement(Tag, { ref, className }, children);
}
