"use client";

import { useEffect } from "react";
import { skipHeavyMotion } from "@/lib/motion-env";

/**
 * Arms the [data-reveal] scroll animation, then reveals each element as it
 * scrolls into view.
 *
 * The order matters and is the whole point. Elements are VISIBLE in the
 * server-rendered HTML; this adds `.reveal-armed` (which hides them) only to
 * elements that are BELOW the fold, and only where the animation is wanted.
 * The previous version relied on `[data-reveal] { opacity: 0 }` in CSS, so
 * every revealed element — the homepage <h1> included — was blank from first
 * paint until this component hydrated. That turned a 1.2s FCP into a 7.3s LCP
 * on a mid-range Android.
 *
 * Consequences worth knowing:
 * - Nothing above the fold is ever hidden, so the largest paint is never gated
 *   on JavaScript, and a hydration failure can no longer blank the page.
 * - On touch / reduced-motion this does nothing at all: the content is already
 *   correct, so there is no work to do and no JS cost to pay.
 */
export function RevealInit() {
  useEffect(() => {
    // Content is already visible and correct — leave it alone.
    if (skipHeavyMotion()) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    // Arm only what is out of view. Anything on screen at first paint stays
    // painted; hiding it now would be a visible flash AND a late LCP.
    const viewport = window.innerHeight;
    const armed = els.filter((el) => el.getBoundingClientRect().top >= viewport);
    if (!armed.length) return;

    // Stagger: cards that share a parent cascade in (capped so long grids don't drag).
    const indexInParent = new Map<Element, number>();
    for (const el of armed) {
      const parent = el.parentElement;
      if (!parent) continue;
      const i = indexInParent.get(parent) ?? 0;
      indexInParent.set(parent, i + 1);
      el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 80}ms`);
      el.classList.add("reveal-armed");
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of armed) io.observe(el);

    // Safety net: an armed element must never stay hidden. If the observer
    // hasn't fired for something that has since scrolled into view, reveal it.
    const fallback = window.setTimeout(() => {
      for (const el of armed) {
        if (el.classList.contains("in")) continue;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("in");
          io.unobserve(el);
        }
      }
    }, 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
