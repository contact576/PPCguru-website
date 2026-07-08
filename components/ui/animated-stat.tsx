"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useInView } from "motion/react";

/* Count-up for a stat STRING that may carry a prefix/suffix:
   "$10M+" · "4.2x" · "120,000+" · "−42%" · "↓ 38%". Animates the numeric part
   from zero the first time it scrolls into view, preserving everything else.
   Uses motion's useInView (the same reliable in-view primitive as <Counter>) so
   it fires consistently whether the stat is above or below the fold. */

function parseStat(value: string) {
  const m = value.match(/^(\D*)([\d,.]+)(.*)$/s);
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

export function AnimatedStat({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  const parsed = parseStat(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);
  const ran = useRef(false);

  useEffect(() => {
    // No numeric part, or reduced-motion → just show the final value.
    if (!parsed || reduce) {
      setDisplay(value);
      return;
    }
    if (!inView || ran.current) return;
    ran.current = true;

    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(`${parsed.prefix}${format(parsed.num * eased, parsed.decimals, parsed.hadCommas)}${parsed.suffix}`);
      if (t < 1) requestAnimationFrame(tick);
      else setDisplay(`${parsed.prefix}${format(parsed.num, parsed.decimals, parsed.hadCommas)}${parsed.suffix}`);
    };
    requestAnimationFrame(tick);
  }, [inView, parsed, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
