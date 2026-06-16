"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scroll-store";

/**
 * Wraps the app in Lenis smooth scrolling and syncs GSAP ScrollTrigger to it.
 * Lenis wraps the NATIVE scroll, so sticky positioning, anchor links and
 * keyboard a11y all keep working. Disabled automatically for reduced-motion.
 */
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
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <ScrollSync />
      {children}
    </ReactLenis>
  );
}
