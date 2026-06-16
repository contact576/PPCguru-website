"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, MousePointerClick, Users, CalendarCheck } from "lucide-react";
import { Funnel3D } from "@/components/three/funnel-3d";
import { Button } from "@/components/ui/button";
import { PartnerBadges } from "@/components/shared/partner-badges";
import { siteConfig } from "@/lib/site-config";
import { scrollState } from "@/lib/scroll-store";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Map scroll through the hero to funnelProgress 0→1 (drives particle fill).
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 1.1)));
      scrollState.funnelProgress = p;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      {/* 3D funnel backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Funnel3D />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-[--color-base] to-transparent" />

      <div className="container-page relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[--color-border-bright] bg-[color-mix(in_srgb,var(--color-surface)_70%,transparent)] px-4 py-1.5 text-sm text-[--color-ink-dim] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[--color-success] shadow-[0_0_10px_var(--color-success)]" />
              AI-augmented · Google Partner · Meta Business Partner
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-5xl font-bold leading-[1.02] md:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            Turn ad spend into <span className="text-gradient">booked jobs.</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg text-[--color-ink-dim] md:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {siteConfig.name} is an AI-augmented performance agency for service
            businesses. We turn Google &amp; Meta ad spend and SEO into qualified
            leads, booked appointments and revenue — and we report on all three.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <Button href={siteConfig.cta.primaryHref} size="lg">
              {siteConfig.cta.primaryLabel} <ArrowRight size={18} />
            </Button>
            <Button href={siteConfig.cta.secondaryHref} size="lg" variant="outline">
              {siteConfig.cta.secondaryLabel}
            </Button>
          </motion.div>

          {/* funnel stage legend */}
          <motion.div
            className="mt-10 flex flex-wrap gap-5 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Stage icon={<MousePointerClick size={15} />} color="#5ee7f7" label="Clicks" />
            <span className="text-[--color-ink-faint]">→</span>
            <Stage icon={<Users size={15} />} color="#9b7bff" label="Leads" />
            <span className="text-[--color-ink-faint]">→</span>
            <Stage icon={<CalendarCheck size={15} />} color="#ffce5c" label="Booked jobs" />
          </motion.div>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <PartnerBadges />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stage({ icon, color, label }: { icon: React.ReactNode; color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[--color-ink-dim]">
      <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22`, color }}>
        {icon}
      </span>
      {label}
    </span>
  );
}
