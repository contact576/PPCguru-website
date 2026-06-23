"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Info, TrendingUp } from "lucide-react";
import {
  industryBenchmarks,
  getBenchmark,
  projectResults,
  BENCHMARK_DISCLAIMER,
  BENCHMARK_SOURCES,
  type Platform,
} from "@/lib/data/benchmarks";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PLATFORM_LABEL: Record<Platform, string> = {
  google: "Google Ads (Search)",
  meta: "Meta Ads (Facebook & Instagram)",
};

export function AdCalculator({ platform: fixedPlatform }: { platform?: Platform }) {
  const [platform, setPlatform] = useState<Platform>(fixedPlatform ?? "google");
  const [industrySlug, setIndustrySlug] = useState(industryBenchmarks[3].slug); // HVAC default
  const [budget, setBudget] = useState(3000);
  const benchmark = getBenchmark(industrySlug);
  const [avgTicket, setAvgTicket] = useState<number>(benchmark.avgTicket);
  const [closeRate, setCloseRate] = useState<number>(Math.round(benchmark.closeRate * 100));

  // when industry changes, reset ticket/close to that industry's defaults
  function onIndustryChange(slug: string) {
    setIndustrySlug(slug);
    const b = getBenchmark(slug);
    setAvgTicket(b.avgTicket);
    setCloseRate(Math.round(b.closeRate * 100));
  }

  const result = useMemo(
    () =>
      projectResults({
        budget,
        platform,
        benchmark,
        avgTicket,
        closeRate: closeRate / 100,
      }),
    [budget, platform, benchmark, avgTicket, closeRate]
  );

  const metrics = benchmark[platform];

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        {/* ---------- Inputs ---------- */}
        <div className="border-b border-[var(--color-border)] p-7 lg:border-b-0 lg:border-r">
          <h3 className="text-lg font-semibold">Your inputs</h3>

          {!fixedPlatform && (
            <Field label="Platform">
              <div className="grid grid-cols-2 gap-2">
                {(["google", "meta"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      platform === p
                        ? "border-[var(--color-violet)] bg-[color-mix(in_srgb,var(--color-violet)_14%,transparent)] text-[var(--color-ink)]"
                        : "border-[var(--color-border)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-bright)]"
                    }`}
                  >
                    {p === "google" ? "Google" : "Meta"}
                  </button>
                ))}
              </div>
            </Field>
          )}

          <Field label="Industry">
            <select
              value={industrySlug}
              onChange={(e) => onIndustryChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]"
            >
              {industryBenchmarks.map((b) => (
                <option key={b.slug} value={b.slug}>{b.label}</option>
              ))}
            </select>
          </Field>

          <Field label={`Monthly ad budget: ${formatCurrency(budget)}`}>
            <input
              type="range"
              min={500}
              max={50000}
              step={250}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[var(--color-violet)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--color-ink-faint)]">
              <span>$500</span><span>$50,000</span>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Avg. customer value">
              <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-3">
                <span className="text-[var(--color-ink-faint)]">$</span>
                <input
                  type="number"
                  value={avgTicket}
                  min={0}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full bg-transparent px-2 py-3 text-sm text-[var(--color-ink)] outline-none"
                />
              </div>
            </Field>
            <Field label={`Lead→customer rate: ${closeRate}%`}>
              <input
                type="range"
                min={2}
                max={80}
                step={1}
                value={closeRate}
                onChange={(e) => setCloseRate(Number(e.target.value))}
                className="mt-3 w-full accent-[var(--color-cyan)]"
              />
            </Field>
          </div>

          <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] p-4 text-xs text-[var(--color-ink-faint)]">
            <p className="mb-2 flex items-center gap-1.5 font-medium text-[var(--color-ink-dim)]"><Info size={13} /> {benchmark.label} · {PLATFORM_LABEL[platform]} benchmarks{metrics.estimate ? " (estimated)" : ""}</p>
            <div className="grid grid-cols-3 gap-2">
              <Bench label="Avg CPC" value={formatCurrency(metrics.cpc, { maximumFractionDigits: 2 })} />
              <Bench label="Avg CTR" value={`${(metrics.ctr * 100).toFixed(2)}%`} />
              <Bench label="Conv. rate" value={`${(metrics.cvr * 100).toFixed(1)}%`} />
            </div>
          </div>
        </div>

        {/* ---------- Results ---------- */}
        <div className="relative p-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--color-violet)_16%,transparent)] blur-3xl" />
          <h3 className="relative text-lg font-semibold">Projected monthly results</h3>

          <div className="relative mt-6 space-y-3">
            <FunnelRow label="Clicks" sub="people to your site" value={formatNumber(result.clicks)} color="#5ee7f7" pct={1} />
            <FunnelRow label="Leads" sub="enquiries & calls" value={formatNumber(result.leads)} color="#9b7bff" pct={0.62} />
            <FunnelRow label="New customers" sub={`at ${closeRate}% close`} value={formatNumber(result.customers)} color="#ffce5c" pct={0.32} />
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3">
            <Big label="Cost per lead" value={formatCurrency(result.costPerLead, { maximumFractionDigits: 2 })} />
            <Big label="Projected revenue" value={formatCurrency(result.revenue)} highlight />
            <Big label="Return on ad spend" value={`${result.roas.toFixed(1)}x`} highlight />
            <Big label="Monthly spend" value={formatCurrency(budget)} />
          </div>

          <motion.div
            key={result.roas.toFixed(1)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-5 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm"
          >
            <TrendingUp size={16} className="text-[var(--color-success)]" />
            <span className="text-[var(--color-ink-dim)]">
              At {formatCurrency(budget)}/mo in <strong className="text-[var(--color-ink)]">{benchmark.label}</strong>, a typical account could see roughly <strong className="text-[var(--color-ink)]">{formatNumber(result.leads)} leads</strong> and <strong className="text-[var(--color-ink)]">{formatCurrency(result.revenue)}</strong> in revenue.
            </span>
          </motion.div>

          <Button href="/contact" className="relative mt-6 w-full" size="lg">
            Get a free audit to hit these numbers <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] bg-[var(--color-base-2)] px-7 py-4">
        <p className="text-xs text-[var(--color-ink-faint)]">{BENCHMARK_DISCLAIMER}</p>
        <p className="mt-1 text-[10px] text-[var(--color-ink-faint)]">Sources: {BENCHMARK_SOURCES.join(" · ")}.</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-5 block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">{label}</span>
      {children}
    </label>
  );
}
function Bench({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[var(--color-ink-faint)]">{label}</p>
      <p className="font-semibold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
function FunnelRow({ label, sub, value, color, pct }: { label: string; sub: string; value: string; color: string; pct: number }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] p-3" style={{ width: `${Math.max(60, pct * 100)}%`, marginLeft: `${(1 - Math.max(0.6, pct)) * 50}%` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
          <span className="text-sm font-medium text-[var(--color-ink)]">{label}</span>
          <span className="hidden text-xs text-[var(--color-ink-faint)] sm:inline">{sub}</span>
        </div>
        <span className="font-display text-lg font-bold" style={{ color }}>{value}</span>
      </div>
    </div>
  );
}
function Big({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-[var(--color-violet)] bg-[color-mix(in_srgb,var(--color-violet)_10%,transparent)]" : "border-[var(--color-border)] bg-[var(--color-base)]"}`}>
      <p className="text-xs text-[var(--color-ink-faint)]">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-gradient" : "text-[var(--color-ink)]"}`}>{value}</p>
    </div>
  );
}
