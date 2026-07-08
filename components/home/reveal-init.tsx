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

    // Stagger: cards that share a parent cascade in (capped so long grids don't drag).
    const indexInParent = new Map<Element, number>();
    els.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const i = indexInParent.get(parent) ?? 0;
      indexInParent.set(parent, i + 1);
      el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 80}ms`);
    });

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

    // Safety net: only reveal elements that are ALREADY on screen at first paint
    // (in case the observer is slow to fire). Off-screen cards are left to the
    // observer so they still animate in as the user scrolls to them.
    const fallback = window.setTimeout(() => {
      els.forEach((el) => {
        if (el.classList.contains("in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }, 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
