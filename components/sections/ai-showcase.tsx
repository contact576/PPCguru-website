"use client";

import { motion } from "motion/react";
import { Sparkles, TrendingDown, TrendingUp, Bot, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const insights = [
  "Detected 18% wasted spend on non-converting search terms — added as negatives.",
  "Shifted budget to 3 ad groups with the lowest cost per booked job.",
  "Generated 12 new ad variations; 2 are beating control on CTR.",
  "Flagged a tracking gap on the contact form — now fixed.",
];

export function AiShowcase() {
  return (
    <Section className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[color-mix(in_srgb,var(--color-violet)_18%,transparent)] blur-3xl" />
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Eyebrow>AI-augmented, human-directed</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl text-balance">
            An AI engine working your account <span className="text-gradient">every single day</span>
          </h2>
          <p className="mt-5 text-lg text-[--color-ink-dim]">
            Our proprietary AI workflow audits accounts, mines search terms, drafts creative
            and surfaces insights faster than any traditional agency — so our strategists spend
            their time on judgment, not grunt work. You get more testing, faster turnaround and
            sharper reporting.
          </p>
          <ul className="mt-7 space-y-3">
            {["Continuous wasted-spend detection", "Always-on creative generation & testing", "Plain-English performance insights", "Faster audits and reporting"].map((f) => (
              <li key={f} className="flex items-center gap-3 text-[--color-ink]">
                <Sparkles size={16} className="text-[--color-cyan-bright]" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/tools/instant-audit" size="lg">
              Try our instant AI audit <ArrowRight size={18} />
            </Button>
            <Button href="/about" size="lg" variant="outline">How we use AI</Button>
          </div>
        </div>

        {/* Animated sample dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="card-glass relative rounded-3xl p-6"
        >
          <div className="absolute right-4 top-4 rounded-full border border-[--color-border] bg-[--color-base] px-2.5 py-1 text-[10px] uppercase tracking-wide text-[--color-ink-faint]">
            Sample · Illustrative
          </div>
          <div className="flex items-center gap-2 text-sm text-[--color-ink-dim]">
            <Bot size={16} className="text-[--color-violet-bright]" /> Guru AI · Account Optimizer
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <KpiCard label="Cost / booked job" value="$48" trend="down" delta="-33%" />
            <KpiCard label="Return on ad spend" value="4.8x" trend="up" delta="+1.6x" />
            <KpiCard label="Leads this month" value="312" trend="up" delta="+41%" />
            <KpiCard label="Wasted spend" value="$0" trend="down" delta="-18%" />
          </div>

          <div className="mt-4 rounded-2xl border border-[--color-border] bg-[--color-base] p-4">
            <LineChart />
          </div>

          <div className="mt-4 space-y-2">
            {insights.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.25 }}
                className="flex items-start gap-2 rounded-lg bg-[--color-surface] px-3 py-2 text-xs text-[--color-ink-dim]"
              >
                <Sparkles size={13} className="mt-0.5 shrink-0 text-[--color-cyan-bright]" />
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function KpiCard({ label, value, trend, delta }: { label: string; value: string; trend: "up" | "down"; delta: string }) {
  const good = trend === "up";
  return (
    <div className="rounded-2xl border border-[--color-border] bg-[--color-base] p-4">
      <p className="text-xs text-[--color-ink-faint]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[--color-ink]">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-xs ${good ? "text-[--color-success]" : "text-[--color-cyan-bright]"}`}>
        {good ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {delta}
      </p>
    </div>
  );
}

function LineChart() {
  const points = "0,60 40,52 80,55 120,38 160,42 200,28 240,20 280,14 320,10";
  return (
    <svg viewBox="0 0 320 70" className="h-24 w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5ee7f7" />
          <stop offset="1" stopColor="#9b7bff" />
        </linearGradient>
      </defs>
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#chartGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}
