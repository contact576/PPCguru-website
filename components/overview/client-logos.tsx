"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { clientLogos, logoName } from "@/lib/data/landing-100-leads";
import { clientLogosWebp } from "@/lib/data/client-logos-webp";
import styles from "./client-logos.module.css";

const halfway = Math.ceil(clientLogos.length / 2);
const rows = [clientLogos.slice(0, halfway), clientLogos.slice(halfway)];
const logoSrc = (file: string) =>
  clientLogosWebp.has(file)
    ? `/landing/logos/opt/${file.replace(/\.[^.]+$/, ".webp")}`
    : `/landing/logos/${file}`;

/* eslint-disable @next/next/no-img-element -- small existing logo assets retain a no-JavaScript fallback */
export function OverviewClientLogos() {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;

    let inView = false;
    const update = () => {
      element.dataset.active = String(inView && !document.hidden);
    };
    element.dataset.enhanced = "true";

    const visibility = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0.01 },
    );
    const loading = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Animated off-screen tiles must load before moving into the viewport.
        element.querySelectorAll("img").forEach((image) => {
          image.loading = "eager";
        });
        loading.disconnect();
      },
      { rootMargin: "600px" },
    );
    visibility.observe(element);
    loading.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      visibility.disconnect();
      loading.disconnect();
      document.removeEventListener("visibilitychange", update);
      delete element.dataset.enhanced;
    };
  }, []);

  return (
    <div ref={root} className={styles.logos} data-paused={paused}>
      <div className={styles.rails}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={styles.viewport}
            role="region"
            aria-label={`Client logos, row ${rowIndex + 1}`}
            tabIndex={0}
          >
            <div className={styles.track} data-reverse={rowIndex === 1}>
              {[false, true].map((duplicate) => (
                <div
                  key={String(duplicate)}
                  className={`${styles.group} ${duplicate ? styles.duplicate : ""}`}
                  aria-hidden={duplicate || undefined}
                >
                  {row.map((file) => (
                    <figure className={styles.tile} key={file}>
                      <img
                        src={logoSrc(file)}
                        alt={duplicate ? "" : logoName(file)}
                        width={150}
                        height={90}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <p>{clientLogos.length} brands. One dedicated team.</p>
        <button
          type="button"
          className={styles.toggle}
          aria-label={paused ? "Play client logo motion" : "Pause client logo motion"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          {paused ? "Play motion" : "Pause motion"}
        </button>
      </div>
    </div>
  );
}
/* eslint-enable @next/next/no-img-element */
