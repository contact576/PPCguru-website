"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, MousePointerClick, Users, CalendarCheck, Star } from "lucide-react";
import { Funnel3D } from "@/components/three/funnel-3d";
import { Button } from "@/components/ui/button";
import { PartnerBadges } from "@/components/shared/partner-badges";
import { siteConfig } from "@/lib/site-config";
import { scrollState } from "@/lib/scroll-store";

export function Hero() {
  // Map scroll through the hero to funnelProgress 0→1 (drives particle fill).
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      scrollState.funnelProgress = Math.min(1, Math.max(0, window.scrollY / (vh * 1.1)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-12 md:pt-40 md:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-warm-wash" />
      <div className="container-page relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left — editorial */}
          <div>
            <motion.span
              className="eyebrow inline-flex items-center gap-2 text-[var(--color-ink-dim)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
              Google Partner · Meta Business Partner · AI-augmented
            </motion.span>

            <motion.h1
              className="mt-5 text-[2.7rem] leading-[1.02] sm:text-6xl md:text-[4.3rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              Turn ad spend into <span className="text-gradient">booked jobs.</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)] md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {siteConfig.name} is an AI-augmented performance agency for service
              businesses. We turn Google &amp; Meta ad spend and SEO into qualified
              leads, booked appointments and revenue — and report on all three.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <Button href={siteConfig.cta.primaryHref} size="lg" variant="accent">
                {siteConfig.cta.primaryLabel} <ArrowRight size={18} />
              </Button>
              <Button href={siteConfig.cta.secondaryHref} size="lg" variant="outline">
                Try the ROI calculator
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)]">
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-[var(--color-gold)] text-[var(--color-gold)]" />
                  ))}
                </span>
                {siteConfig.trust.googleReviewRating} · {siteConfig.trust.activeClients} clients
              </span>
              <PartnerBadges />
            </motion.div>
          </div>

          {/* Right — navy panel with the live 3D funnel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-navy)] shadow-tile sm:aspect-[5/5] lg:aspect-[4/5]">
              <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" />
              <div className="absolute inset-0">
                <Funnel3D />
              </div>

              {/* stage legend overlay */}
              <div className="absolute left-5 top-5 flex flex-col gap-2.5">
                <Stage icon={<MousePointerClick size={13} />} color="#5ee7f7" label="Clicks" />
                <Stage icon={<Users size={13} />} color="#b69bff" label="Leads" />
                <Stage icon={<CalendarCheck size={13} />} color="#ffce5c" label="Booked jobs" />
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/60">Avg. return on ad spend</p>
                  <p className="text-2xl font-bold text-white">{siteConfig.trust.avgRoas}</p>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/50">Scroll → fills the funnel</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stage({ icon, color, label }: { icon: React.ReactNode; color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
      <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: `${color}33`, color }}>
        {icon}
      </span>
      <span className="text-xs font-medium text-white/90">{label}</span>
    </span>
  );
}
