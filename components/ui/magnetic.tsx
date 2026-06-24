"use client";

import { useRef, type ReactNode } from "react";

/**
 * Magnetic wrapper — the element drifts toward the pointer while hovered, then
 * springs back. Used on primary CTAs and nav for the tactile, reactive feel of
 * the reference sites. No-ops on touch / reduced-motion (transform just never
 * gets applied because pointer events don't fire the same way; we also guard).
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)", display: "inline-block" }}
    >
      {children}
    </div>
  );
}
