"use client";

import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scroll-store";

/**
 * Lenis smooth scrolling + GSAP ScrollTrigger sync — active on DESKTOP ONLY.
 *
 * Lenis wraps the NATIVE scroll, so sticky positioning, anchor links and
 * keyboard a11y all keep working. On a phone, though, it is pure cost: it runs
 * a requestAnimationFrame loop for the whole session, and it never smooths
 * touch scrolling anyway (`syncTouch` is off), which the browser already does
 * off the main thread. That loop competes with hydration and with every tap —
 * it shows up as input latency and a janky first scroll on mid-range Android.
 *
 * So on a coarse pointer (or with reduced motion requested) Lenis is put to
 * sleep: `autoRaf` off kills the per-frame work, and `smoothWheel` off means it
 * never calls preventDefault on a wheel event — which matters, because a Lenis
 * that intercepts wheel but never advances would freeze the page.
 *
 * The component stays MOUNTED either way. Swapping the provider in and out
 * would change the element type wrapping the whole app, remounting every child
 * (and re-firing the visitor beacon) the moment the media query resolved.
 */
function useSmoothScrollEligible() {
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => setEligible(fine.matches && !reduced.matches);
    evaluate();
    fine.addEventListener("change", evaluate);
    reduced.addEventListener("change", evaluate);
    return () => {
      fine.removeEventListener("change", evaluate);
      reduced.removeEventListener("change", evaluate);
    };
  }, []);

  return eligible;
}

/** ScrollTrigger sync + the ambient parallax inputs. Desktop-only, like Lenis. */
function ScrollSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const update = () => ScrollTrigger.update();
    lenis?.on("scroll", update);

    // Track global page progress + pointer for ambient parallax.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.pageProgress = max > 0 ? window.scrollY / max : 0;
    };
    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    onScroll();

    return () => {
      lenis?.off("scroll", update);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const eligible = useSmoothScrollEligible();

  return (
    <ReactLenis root autoRaf={eligible} options={{ lerp: 0.1, smoothWheel: eligible }}>
      {eligible && <ScrollSync />}
      {children}
    </ReactLenis>
  );
}
