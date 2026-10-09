"use client";

import { useEffect, useRef } from "react";
import "./home-scroll-motion.css";

/** Adds motion to visible content without hiding server-rendered copy. */
export function HomeScrollMotion() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    const root = progress?.closest<HTMLElement>(".home-revamp");
    if (!progress || !root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stopMotion = () => {};

    const configureMotion = () => {
      stopMotion();
      if (preference.matches) return;
      let frame = 0;
      const update = () => {
        frame = 0;
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        const amount = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
        progress.style.setProperty("--home-scroll", String(amount));
      };
      const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
      const targets = root.querySelectorAll<HTMLElement>(
        ".home-trust-top, .home-client-marquee-heading, .hcr-results-heading, .home-section-head, .home-services-grid, .home-review-grid, .home-goal-layout, .home-steps, .home-markets-grid, .home-credentials-intro, .home-credentials-brands, .home-faq-grid, .home-blog-grid, .home-audit-grid",
      );
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("home-motion-in");
          observer.unobserve(entry.target);
        }
      }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
      targets.forEach((target) => observer.observe(target));
      const resize = new ResizeObserver(scheduleUpdate);
      resize.observe(document.documentElement);
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
      progress.classList.add("is-active");
      update();
      stopMotion = () => {
        observer.disconnect();
        resize.disconnect();
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
        window.cancelAnimationFrame(frame);
        progress.classList.remove("is-active");
        targets.forEach((target) => target.classList.remove("home-motion-in"));
      };
    };

    configureMotion();
    preference.addEventListener("change", configureMotion);
    return () => {
      stopMotion();
      preference.removeEventListener("change", configureMotion);
    };
  }, []);

  return <div ref={progressRef} className="home-scroll-progress" aria-hidden="true"><span /></div>;
}
