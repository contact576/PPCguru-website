"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Funnel3D } from "@/components/three/funnel-3d";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { KineticHeading } from "@/components/ui/kinetic-text";
import { Counter } from "@/components/ui/counter";
import { siteConfig } from "@/lib/site-config";
import { scrollState } from "@/lib/scroll-store";

export function Hero() {
  // Map scroll through the hero to funnelProgress 0→1 (drives particle fill).
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      scrollState.funnelProgress = Math.min(1, Math.max(0, window.scrollY / (vh * 1.25)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--color-base)]">
      {/* Ambient WebGL funnel — the live "engine" behind the type */}
      <div
        className="absolute inset-0 lg:left-[18%]"
        data-cursor="Drag"
        aria-hidden
      >
        <Funnel3D />
      </div>

      {/* Legibility scrims — keep the type crisp over the particle field */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,var(--color-base)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--color-base)] via-[var(--color-base)]/70 to-transparent lg:via-[var(--color-base)]/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-base)] to-transparent" />

      {/* Top HUD rail */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-10 hidden md:block">
        <div className="container-page flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">
          <span>PPC&nbsp;GURU // PERFORMANCE&nbsp;TERMINAL</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-success)]" />
            LIVE&nbsp;·&nbsp;GTA
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="container-page relative z-10 flex min-h-[100svh] flex-col justify-center pt-32 pb-28 md:pt-40">
        <div className="max-w-3xl">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Google Partner · Meta Business Partner · AI-augmented
          </motion.span>

          <KineticHeading
            className="mt-6 text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em]"
            delay={0.15}
            lines={[
              <>Turn ad spend</>,
              <>into <span className="text-gradient text-glow">booked revenue.</span></>,
            ]}
          />

          <motion.p
            className="mt-7 max-w-xl text-lg text-[var(--color-ink-dim)] md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {siteConfig.name} is an AI-augmented performance agency for service
            businesses across the GTA. We turn Google &amp; Meta ad spend and SEO
            into qualified leads, booked appointments and revenue — and report on
            all three, in the open.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62 }}
          >
            <Magnetic strength={0.4}>
              <Button href={siteConfig.cta.primaryHref} size="lg" variant="accent" data-cursor="Book">
                {siteConfig.cta.primaryLabel} <ArrowRight size={18} />
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button href={siteConfig.cta.secondaryHref} size="lg" variant="outline">
                Try the ROI calculator
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {["Transparent reporting", "You own your accounts", "No long-term lock-in"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--color-border)] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-dim)] backdrop-blur-sm"
              >
                {c}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Floating telemetry HUD — bottom-right, clearly labelled sample */}
        <motion.div
          className="pointer-events-none absolute bottom-10 right-[clamp(1.25rem,5.5vw,6rem)] z-10 hidden w-[280px] lg:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="card-glass rounded-2xl p-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-faint)]">
              <span>Funnel · live</span>
              <span className="text-[var(--color-orange)]">▲ scroll</span>
            </div>
            <div className="mt-4 space-y-3.5">
              <HudRow label="Clicks" value={2940} stage="ember" />
              <HudRow label="Leads" value={198} stage="orange" />
              <HudRow label="Booked jobs" value={41} stage="gold" />
            </div>
            <p className="mt-4 font-mono text-[9px] leading-relaxed text-[var(--color-ink-faint)]">
              Illustrative projection from our benchmark model — not a client metric.
            </p>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-9 left-[clamp(1.25rem,5.5vw,6rem)] z-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-[var(--color-border-bright)] p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-[var(--color-orange)]" />
          </span>
          Scroll to fill the funnel
        </motion.div>
      </div>
    </section>
  );
}

function HudRow({ label, value, stage }: { label: string; value: number; stage: "ember" | "orange" | "gold" }) {
  const color =
    stage === "ember" ? "#d9381e" : stage === "orange" ? "var(--color-orange)" : "var(--color-gold)";
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-[var(--color-ink-dim)]">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
        {label}
      </span>
      <Counter value={value} className="font-mono text-lg font-bold text-[var(--color-ink)]" />
    </div>
  );
}
