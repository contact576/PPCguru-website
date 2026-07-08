"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/** Animated count-up KPI number that runs once when scrolled into view. */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1600, bounce: 0 });

  const format = (n: number) =>
    prefix + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useEffect(() => {
    if (!inView) return;
    // Respect reduced-motion: show the final value instantly, skip the spring.
    if (reduce) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    mv.set(value);
  }, [inView, value, mv, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent =
          prefix +
          latest.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) +
          suffix;
      }
    });
  }, [spring, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}
