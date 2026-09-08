"use client";

import { createElement, useEffect, useRef, type ElementType, type CSSProperties, type ReactNode } from "react";
import { skipHeavyMotion } from "@/lib/motion-env";

type Mode = "scrub" | "chars" | "words";

/**
 * GSAP text animations:
 *  - "scrub": words brighten from dim → full as you scroll the line through view.
 *  - "chars": characters tumble up into place once, on scroll-in.
 *  - "words": words rise + fade in once, on scroll-in.
 *
 * The text is always rendered as plain server HTML; GSAP only decorates it, and
 * is imported DYNAMICALLY after the `skipHeavyMotion()` check so a phone never
 * downloads ~100KB of animation library to run nothing. On failure, reduced
 * motion or touch, the text simply stays as it rendered.
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
            },
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
      }, ref);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [mode]);

  return createElement(as, { ref, className, style }, children);
}
