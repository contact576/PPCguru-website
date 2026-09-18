"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Holds back every `<img data-src>` inside it until the wrapper is within
 * `margin` of the viewport, then loads them all at once.
 *
 * Why not `loading="lazy"`: in a horizontal marquee the off-screen tiles are
 * clipped by `overflow:hidden`, so native lazy-loading only fetches each logo
 * as it slides into view — tiles pop in blank. Loading the whole row together
 * (vertically ahead of time) avoids that, while keeping ~100 logo requests off
 * the first-paint critical path, where they were competing with the CSS, fonts
 * and JS on a phone connection.
 */
export function LoadImagesNearView({
  children,
  margin = "800px 0px",
  className,
  style,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  margin?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const load = () => {
      el.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((img) => {
        img.src = img.dataset.src!;
        img.removeAttribute("data-src");
      });
    };
    if (!("IntersectionObserver" in window)) return load();
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        load();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={className} style={style} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
