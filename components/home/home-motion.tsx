"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* ============================================================================
   Homepage motion helpers (client-only).
   - HomeHeroMotion: a tasteful entrance (fade + rise) for the hero column.
   - AnimatedStat:  counts a stat value up from zero the first time it scrolls
                    into view, preserving the prefix/suffix ($, M+, x, commas).
   Both fully respect prefers-reduced-motion (render final state, no motion).
   ========================================================================== */

export function HomeHeroMotion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Parse "$10M+" → { prefix:"$", num:10, suffix:"M+", decimals:0 }, "4.2x" →
 *  { prefix:"", num:4.2, suffix:"x", decimals:1 }, "120,000+" → 120000 (commas). */
function parseStat(value: string) {
  const m = value.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!m) return null;
  const [, prefix, rawNum, suffix] = m;
  const hadCommas = rawNum.includes(",");
  const clean = rawNum.replace(/,/g, "");
  const num = parseFloat(clean);
  if (!isFinite(num)) return null;
  const decimals = clean.includes(".") ? clean.split(".")[1].length : 0;
  return { prefix, num, suffix, decimals, hadCommas };
}

function format(n: number, decimals: number, commas: boolean) {
  const fixed = n.toFixed(decimals);
  if (!commas) return fixed;
  const [int, dec] = fixed.split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withCommas}.${dec}` : withCommas;
}

export function AnimatedStat({ value }: { value: string }) {
  const reduce = useReducedMotion();
  const parsed = parseStat(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);
  const ran = useRef(false);

  useEffect(() => {
    if (!parsed || reduce) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !ran.current) {
            ran.current = true;
            const duration = 1400;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
              const current = parsed.num * eased;
              setDisplay(`${parsed.prefix}${format(current, parsed.decimals, parsed.hadCommas)}${parsed.suffix}`);
              if (t < 1) requestAnimationFrame(tick);
              else setDisplay(`${parsed.prefix}${format(parsed.num, parsed.decimals, parsed.hadCommas)}${parsed.suffix}`);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [parsed, reduce, value]);

  return <span ref={ref}>{display}</span>;
}
