"use client";

import { useMemo, useState } from "react";
import { ArrowRight, AlertTriangle, TrendingUp, Target } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { track } from "@/lib/analytics";

// Conservative, clearly-labeled assumption for an unaudited account.
const ASSUMED_WASTE_PCT = 0.15;
const LIFT_SCENARIO = 0.25; // a 25% relative conversion-rate improvement scenario

export function WasteAudit() {
  const [spend, setSpend] = useState(4000);
  const [cpc, setCpc] = useState(4);
  const [cvr, setCvr] = useState(4); // %
  const [leadValue, setLeadValue] = useState(500);

  const r = useMemo(() => {
    const clicks = cpc > 0 ? spend / cpc : 0;
    const leads = clicks * (cvr / 100);
    const wastedSpend = spend * ASSUMED_WASTE_PCT;
    const wastedClicks = clicks * ASSUMED_WASTE_PCT;
    const extraLeads = leads * LIFT_SCENARIO;
    const extraRevenue = extraLeads * leadValue;
    let priority = "Tracking & conversion setup";
    if (cvr < 3) priority = "Landing page & conversion tracking";
    else if (cpc > 8) priority = "Keyword targeting & negative keywords";
    else if (spend > 10000) priority = "Budget allocation & campaign structure";
    else priority = "Search-term waste & ad relevance";
    return { clicks, leads, wastedSpend, wastedClicks, extraLeads, extraRevenue, priority };
  }, [spend, cpc, cvr, leadValue]);

  return (
    <Section id="waste-audit">
      <SectionHeading
        eyebrow="Free PPC waste audit"
        title={<>Find the leaks in your <span className="text-gradient">PPC budget</span></>}
        intro="Enter a few numbers to see a rough estimate of where spend may be leaking and what a realistic improvement could look like. Estimates only — your real audit uses your actual account data."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Inputs */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
          <Field label={`Monthly ad spend: ${formatCurrency(spend)}`}>
            <input type="range" min={500} max={50000} step={250} value={spend} onChange={(e) => setSpend(+e.target.value)} className="w-full accent-[var(--color-orange)]" />
          </Field>
          <Field label={`Average cost per click: ${formatCurrency(cpc, { maximumFractionDigits: 2 })}`}>
            <input type="range" min={0.5} max={25} step={0.5} value={cpc} onChange={(e) => setCpc(+e.target.value)} className="w-full accent-[var(--color-orange)]" />
          </Field>
          <Field label={`Current conversion rate: ${cvr}%`}>
            <input type="range" min={0.5} max={20} step={0.5} value={cvr} onChange={(e) => setCvr(+e.target.value)} className="w-full accent-[var(--color-orange)]" />
          </Field>
          <Field label="Average lead / sale value">
            <div className="flex items-center rounded-xl border border-[var(--color-border)] px-3">
              <span className="text-[var(--color-ink-faint)]">$</span>
              <input type="number" min={0} value={leadValue} onChange={(e) => setLeadValue(+e.target.value)} className="w-full bg-transparent px-2 py-3 text-sm outline-none" />
            </div>
          </Field>
        </div>

        {/* Outputs */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-navy)] p-7 text-white">
          <div className="grid grid-cols-2 gap-4">
            <Stat icon={<AlertTriangle size={16} />} tone="#f97316" label="Est. wasted spend / mo" value={formatCurrency(r.wastedSpend)} sub="~15% industry-typical (illustrative)" />
            <Stat icon={<Target size={16} />} tone="#5ee7f7" label="Est. wasted clicks / mo" value={formatNumber(r.wastedClicks)} sub="clicks unlikely to convert" />
            <Stat icon={<TrendingUp size={16} />} tone="#34e3a3" label="Lift scenario: extra leads" value={`+${formatNumber(r.extraLeads)}`} sub="if conversions improve ~25%" />
            <Stat icon={<TrendingUp size={16} />} tone="#ffce5c" label="Potential revenue / mo" value={formatCurrency(r.extraRevenue)} sub="extra leads × lead value" />
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/50">Suggested audit priority</p>
            <p className="mt-1 text-lg font-semibold text-white">{r.priority}</p>
          </div>
          <Button
            href="/contact"
            className="mt-5 w-full"
            variant="accent"
            onClick={() => track("calculator_complete", { tool: "waste_audit", spend })}
          >
            Get my PPC waste report <ArrowRight size={18} />
          </Button>
          <p className="mt-3 text-center text-[11px] text-white/45">
            Illustrative estimates, not a guarantee. Real findings depend on your actual account, tracking and market.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-5 block first:mt-0">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">{label}</span>
      {children}
    </label>
  );
}

function Stat({ icon, tone, label, value, sub }: { icon: React.ReactNode; tone: string; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: `${tone}22`, color: tone }}>{icon}</span>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-medium text-white/70">{label}</p>
      <p className="mt-0.5 text-[10px] text-white/40">{sub}</p>
    </div>
  );
}
