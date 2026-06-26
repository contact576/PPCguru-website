"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Info, TrendingUp } from "lucide-react";
import {
  industryEconomics,
  getEconomics,
  getPlatform,
  resolveCell,
  projectFunnel,
  PLATFORMS,
  BENCHMARK_DISCLAIMER,
  BENCHMARK_SOURCES,
  type PlatformId,
  type FunnelStage,
} from "@/lib/data/benchmarks";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ResultGate } from "@/components/tools/result-gate";

const GROUP_LABEL: Record<string, string> = { search: "Search", social: "Social", video: "Video", display: "Display" };

export function AdCalculator({ platform: fixedPlatform }: { platform?: PlatformId }) {
  const [platform, setPlatform] = useState<PlatformId>(fixedPlatform ?? "google-search");
  const [industrySlug, setIndustrySlug] = useState("hvac");
  const [budget, setBudget] = useState(3000);
  const econ = getEconomics(industrySlug);
  const [avgTicket, setAvgTicket] = useState<number>(econ.avgTicket);
  const [closeRate, setCloseRate] = useState<number>(Math.round(econ.closeRate * 100));

  function onIndustryChange(slug: string) {
    setIndustrySlug(slug);
    const e = getEconomics(slug);
    setAvgTicket(e.avgTicket);
    setCloseRate(Math.round(e.closeRate * 100));
  }

  const result = useMemo(
    () => projectFunnel({ budget, platform, industrySlug, avgTicket, closeRate: closeRate / 100 }),
    [budget, platform, industrySlug, avgTicket, closeRate]
  );

  const cell = resolveCell(econ, getPlatform(platform));
  const platformLabel = getPlatform(platform).label;
  const grouped = useMemo(() => {
    const g: Record<string, typeof PLATFORMS> = {};
    for (const p of PLATFORMS) (g[p.group] ||= []).push(p);
    return g;
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        {/* ---------- Inputs ---------- */}
        <div className="border-b border-[var(--color-border)] p-7 lg:border-b-0 lg:border-r">
          <h3 className="text-lg font-semibold">Your inputs</h3>

          {!fixedPlatform && (
            <Field label="Platform">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformId)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]"
              >
                {Object.entries(grouped).map(([group, items]) => (
                  <optgroup key={group} label={GROUP_LABEL[group] ?? group}>
                    {items.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>
          )}

          <Field label="Industry">
            <select
              value={industrySlug}
              onChange={(e) => onIndustryChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-violet)]"
            >
              {industryEconomics.map((b) => <option key={b.slug} value={b.slug}>{b.label}</option>)}
            </select>
          </Field>

          <Field label={`Monthly ad budget: ${formatCurrency(budget)}`}>
            <input type="range" min={500} max={50000} step={250} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-[var(--color-violet)]" />
            <div className="mt-1 flex justify-between text-xs text-[var(--color-ink-faint)]"><span>$500</span><span>$50,000</span></div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Avg. customer value">
              <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-3">
                <span className="text-[var(--color-ink-faint)]">$</span>
                <input type="number" value={avgTicket} min={0} onChange={(e) => setAvgTicket(Number(e.target.value))} className="w-full bg-transparent px-2 py-3 text-sm text-[var(--color-ink)] outline-none" />
              </div>
            </Field>
            <Field label={`Lead→customer rate: ${closeRate}%`}>
              <input type="range" min={2} max={80} step={1} value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-cyan)]" />
            </Field>
          </div>

          <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] p-4 text-xs text-[var(--color-ink-faint)]">
            <p className="mb-2 flex items-center gap-1.5 font-medium text-[var(--color-ink-dim)]"><Info size={13} /> {econ.label} · {platformLabel} benchmarks{cell.estimate ? " (estimated)" : ""}</p>
            <div className="grid grid-cols-3 gap-2">
              <Bench label="Avg CPC" value={formatCurrency(cell.cpc, { maximumFractionDigits: 2 })} />
              <Bench label="Avg CTR" value={`${(cell.ctr * 100).toFixed(2)}%`} />
              <Bench label="Conv. rate" value={`${(cell.cvr * 100).toFixed(1)}%`} />
            </div>
          </div>
        </div>

        {/* ---------- Results ---------- */}
        <div className="relative p-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--color-violet)_16%,transparent)] blur-3xl" />
          <h3 className="relative text-lg font-semibold">Projected monthly results</h3>

          {/* Free preview: top of funnel */}
          <div className="relative mt-6 space-y-3">
            <FunnelRow label="Clicks" sub="visitors to your site" stage={result.clicks} color="#5ee7f7" pct={1} />
            <FunnelRow label="Leads" sub="enquiries & calls" stage={result.leads} color="#9b7bff" pct={0.78} />
            <FunnelRow label="Qualified leads" sub="real prospects" stage={result.qualifiedLeads} color="#8fbf24" pct={0.6} />
            <FunnelRow label="Booked calls" sub="on the calendar" stage={result.bookedCalls} color="#ffce5c" pct={0.46} />
          </div>

          {/* Gated: revenue economics */}
          <div className="relative mt-6">
            <ResultGate source={`tool:${platform}-calculator`}>
              <div className="grid grid-cols-2 gap-3">
                <Big label="New customers" value={formatNumber(result.customers.mid)} />
                <Big label="Cost per lead" value={formatCurrency(result.costPerLead, { maximumFractionDigits: 2 })} />
                <Big label="Cost per acquisition" value={formatCurrency(result.cac, { maximumFractionDigits: 0 })} />
                <Big label="Projected revenue" value={formatCurrency(result.revenue.mid)} highlight />
                <Big label="Return on ad spend" value={`${result.roas.toFixed(1)}x`} highlight />
                <Big label="Monthly spend" value={formatCurrency(budget)} />
              </div>
              <motion.div
                key={result.roas.toFixed(1)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm"
              >
                <TrendingUp size={16} className="text-[var(--color-success)]" />
                <span className="text-[var(--color-ink-dim)]">
                  At {formatCurrency(budget)}/mo in <strong className="text-[var(--color-ink)]">{econ.label}</strong>, a typical {platformLabel} account could see roughly <strong className="text-[var(--color-ink)]">{formatNumber(result.leads.mid)} leads</strong> and <strong className="text-[var(--color-ink)]">{formatCurrency(result.revenue.mid)}</strong> in revenue.
                </span>
              </motion.div>
              <Button href="/contact" className="mt-5 w-full" size="lg">
                Get a free audit to hit these numbers <ArrowRight size={18} />
              </Button>
            </ResultGate>
          </div>
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
function FunnelRow({ label, sub, stage, color, pct }: { label: string; sub: string; stage: FunnelStage; color: string; pct: number }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] p-3" style={{ width: `${Math.max(60, pct * 100)}%`, marginLeft: `${(1 - Math.max(0.6, pct)) * 50}%` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
          <span className="text-sm font-medium text-[var(--color-ink)]">{label}</span>
          <span className="hidden text-xs text-[var(--color-ink-faint)] sm:inline">{sub}</span>
        </div>
        <div className="text-right">
          <span className="font-display text-lg font-bold" style={{ color }}>{formatNumber(stage.mid)}</span>
          <span className="ml-1 text-[10px] text-[var(--color-ink-faint)]">{formatNumber(stage.low)}–{formatNumber(stage.high)}</span>
        </div>
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
