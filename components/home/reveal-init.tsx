"use client";

import { useEffect } from "react";

/**
 * Adds `.in` to every [data-reveal] element as it scrolls into view, matching
 * the handoff design's reveal behaviour. Lets the page sections stay server
 * components while still animating in. Falls back to revealing everything after
 * a short delay (and immediately under reduced-motion).
 */
export function RevealInit() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));

    // Safety net: ensure nothing stays hidden if the observer misses anything.
    const fallback = window.setTimeout(() => els.forEach((el) => el.classList.add("in")), 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
