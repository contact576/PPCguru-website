"use client";

import { Counter } from "@/components/ui/counter";

/**
 * StatCounter — renders a stat string ("$65M+", "6.8x", "12,000+", "<5 min")
 * as an animated count-up. Parses a leading prefix, the number, and a trailing
 * suffix; non-numeric values ("Weekly", "AI + human") render as static text.
 */
export function StatCounter({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^([^\d]*)([\d][\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return <span className={className}>{value}</span>;
  const [, prefix, numStr, suffix] = m;
  const num = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  if (!isFinite(num)) return <span className={className}>{value}</span>;
  return <Counter value={num} prefix={prefix} suffix={suffix} decimals={decimals} className={className} />;
}
