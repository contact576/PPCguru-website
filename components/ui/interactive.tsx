"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** True only on devices with a precise pointer and no reduced-motion request. */
function useFinePointer() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOk(fine && !reduced);
  }, []);
  return ok;
}

/**
 * CursorGlow — a soft lime ring that trails the pointer and swells over
 * interactive elements. Additive (the native cursor stays visible), so it never
 * harms usability. Renders nothing on touch / reduced-motion. Mounted once in
 * the root layout.
 */
export function CursorGlow() {
  const enabled = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });
  const scale = useSpring(1, { stiffness: 300, damping: 20 });
  const opacity = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
      const interactive = (e.target as Element | null)?.closest(
        "a, button, [data-cursor], input, textarea, select, label"
      );
      scale.set(interactive ? 2.4 : 1);
    };
    const leave = () => opacity.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y, scale, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x: ringX,
        y: ringY,
        scale,
        opacity,
        border: "1.5px solid var(--color-olive, #6f7d22)",
        background: "radial-gradient(circle, rgba(206,255,58,.22), transparent 70%)",
        mixBlendMode: "multiply",
      }}
    />
  );
}

/**
 * Magnetic — nudges its child toward the pointer on hover. Use on primary CTAs.
 * Falls back to a plain wrapper on touch / reduced-motion.
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
  const enabled = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * SpotlightCard — a card that follows the cursor with a soft radial spotlight
 * and a subtle 3D tilt. Degrades to a static card on touch / reduced-motion.
 * Drop-in replacement for a styled <div> box: pass the same className.
 */
export function SpotlightCard({
  children,
  className,
  tilt = true,
  maxTilt = 5,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  maxTilt?: number;
} & HTMLMotionProps<"div">) {
  const enabled = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
    ref.current.style.setProperty("--spot", "1");
    if (tilt) {
      rotateX.set(-(py - 0.5) * 2 * maxTilt);
      rotateY.set((px - 0.5) * 2 * maxTilt);
    }
  }
  function reset() {
    if (!ref.current) return;
    ref.current.style.setProperty("--spot", "0");
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={enabled && tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={cn(
        "group/spot relative isolate transition-shadow duration-300 hover:shadow-tile",
        className
      )}
      {...rest}
    >
      {/* cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-[var(--spot,0)] transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(206,255,58,.20), transparent 60%)",
        }}
      />
      <div className="relative z-[1] h-full" style={{ transform: "translateZ(0.01px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
