"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — a soft lime ring that trails the pointer and swells over
 * interactive elements. Additive (the native cursor stays visible), so it never
 * harms usability. Renders nothing on touch / reduced-motion. Mounted once in
 * the root layout.
 *
 * Vanilla rAF easing instead of motion springs: this sits in the root layout, so
 * a motion import here put the library in the first-load JS of every page. The
 * loop only runs while the ring is still catching up, then sleeps.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const target = { x: -100, y: -100, scale: 1, opacity: 0 };
    const cur = { ...target };
    let frame = 0;

    const step = () => {
      frame = 0;
      cur.x += (target.x - cur.x) * 0.35;
      cur.y += (target.y - cur.y) * 0.35;
      cur.scale += (target.scale - cur.scale) * 0.25;
      cur.opacity += (target.opacity - cur.opacity) * 0.25;
      el.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%) scale(${cur.scale})`;
      el.style.opacity = String(cur.opacity);
      const settled =
        Math.abs(target.x - cur.x) < 0.1 &&
        Math.abs(target.y - cur.y) < 0.1 &&
        Math.abs(target.scale - cur.scale) < 0.005 &&
        Math.abs(target.opacity - cur.opacity) < 0.005;
      if (!settled) frame = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.opacity = 1;
      const interactive = (e.target as Element | null)?.closest(
        "a, button, [data-cursor], input, textarea, select, label"
      );
      target.scale = interactive ? 1.7 : 1;
      kick();
    };
    const leave = () => {
      target.opacity = 0;
      kick();
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-4 w-4 rounded-full"
      style={{
        opacity: 0,
        willChange: "transform, opacity",
        border: "1px solid var(--color-olive, #6f7d22)",
        background: "radial-gradient(circle, rgba(206,255,58,.12), transparent 72%)",
        mixBlendMode: "multiply",
      }}
    />
  );
}
