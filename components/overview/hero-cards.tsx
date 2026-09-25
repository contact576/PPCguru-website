"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MousePointer2, Pause, Play, Search } from "lucide-react";
import styles from "./hero-cards.module.css";

export function OverviewHeroCards() {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    let inView = !("IntersectionObserver" in window);
    const update = () => {
      element.dataset.active = String(inView && !document.hidden);
    };
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          update();
        }, { threshold: 0.05 })
      : null;

    element.dataset.enhanced = "true";
    update();
    observer?.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
      delete element.dataset.enhanced;
      delete element.dataset.active;
    };
  }, []);

  return (
    <div
      ref={root}
      className={styles.heroArt}
      data-paused={paused}
      role="group"
      aria-label="Our connected approach: be found, be chosen, keep growing"
    >
      <div className={styles.orbit} aria-hidden />
      <div className={styles.artHeader}>
        <button
          type="button"
          className={styles.motionToggle}
          aria-label={paused ? "Play hero card motion" : "Pause hero card motion"}
          aria-pressed={paused}
          title={paused ? "Play motion" : "Pause motion"}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
        </button>
        <div className={styles.artLabel}>One team. The whole journey.</div>
      </div>
      <div className={`${styles.artCard} ${styles.cardOne}`}>
        <span className={styles.cardIndex}>01 / ATTRACT</span>
        <Search size={30} strokeWidth={1.5} aria-hidden />
        <strong>Be found.</strong><span>Search + social + SEO</span>
      </div>
      <div className={`${styles.artCard} ${styles.cardTwo}`}>
        <span className={styles.cardIndex}>02 / CONVERT</span>
        <MousePointer2 size={30} strokeWidth={1.5} aria-hidden />
        <strong>Be chosen.</strong><span>Creative + websites + CRO</span>
      </div>
      <div className={`${styles.artCard} ${styles.cardThree}`}>
        <span className={styles.cardIndex}>03 / GROW</span>
        <ArrowUpRight size={42} strokeWidth={1.5} aria-hidden />
        <strong>Keep growing.</strong><span>CRM + automation + insight</span>
      </div>
      <div className={styles.artFooter}><span>Human strategy.</span><span>AI-powered execution.</span></div>
    </div>
  );
}
