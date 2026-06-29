"use client";

import { createElement, useRef, type ElementType, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type Mode = "scrub" | "chars" | "words";

/**
 * GSAP text animations:
 *  - "scrub": words brighten from dim → full as you scroll the line through view.
 *  - "chars": characters tumble up into place once, on scroll-in.
 *  - "words": words rise + fade in once, on scroll-in.
 * Falls back to plain text on failure / reduced motion.
 */
export function GsapText({
  children,
  mode = "scrub",
  as = "p",
  className,
  style,
}: {
  children: ReactNode;
  mode?: Mode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let split: SplitText | null = null;
      try {
        split = new SplitText(el, { type: mode === "chars" ? "chars,words" : "words" });
      } catch {
        return;
      }

      if (mode === "scrub") {
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 82%", end: "top 36%", scrub: 0.5 },
          }
        );
      } else if (mode === "chars") {
        gsap.from(split.chars, {
          opacity: 0,
          yPercent: 80,
          rotateX: -55,
          transformOrigin: "0% 50% -20",
          stagger: 0.016,
          duration: 0.7,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      } else {
        gsap.from(split.words, {
          opacity: 0,
          y: 22,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
    },
    { scope: ref }
  );

  return createElement(as, { ref, className, style }, children);
}
