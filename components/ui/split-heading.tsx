"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

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

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let split: SplitText | null = null;
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
    },
    { scope: ref }
  );

  return createElement(Tag, { ref, className }, children);
}
