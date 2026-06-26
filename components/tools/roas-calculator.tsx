"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

/** Simple, ungated ROAS / profit / break-even calculator (pure client math). */
export function RoasCalculator() {
  const [spend, setSpend] = useState(5000);
  const [revenue, setRevenue] = useState(22000);
  const [margin, setMargin] = useState(60); // gross margin %

  const roas = spend > 0 ? revenue / spend : 0;
  const grossProfit = revenue * (margin / 100);
  const netProfit = grossProfit - spend;
  const breakEvenRoas = margin > 0 ? 100 / margin : 0; // revenue/spend needed to break even
  const poas = spend > 0 ? grossProfit / spend : 0; // profit on ad spend
  const healthy = roas >= breakEvenRoas;

  const field = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm outline-none focus:border-[var(--color-violet)]";

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        <div className="border-b border-[var(--color-border)] p-7 lg:border-b-0 lg:border-r">
          <h3 className="text-lg font-semibold">Your numbers</h3>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">Ad spend (period)</span>
            <input type="number" min={0} value={spend} onChange={(e) => setSpend(Number(e.target.value))} className={field} />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">Revenue from ads</span>
            <input type="number" min={0} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className={field} />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">Gross margin: {margin}%</span>
            <input type="range" min={5} max={95} step={1} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full accent-[var(--color-violet)]" />
          </label>
        </div>

        <div className="p-7">
          <h3 className="text-lg font-semibold">Results</h3>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Tile label="ROAS" value={`${roas.toFixed(2)}x`} highlight />
            <Tile label="Profit on ad spend" value={`${poas.toFixed(2)}x`} />
            <Tile label="Gross profit" value={formatCurrency(grossProfit)} />
            <Tile label="Net profit (after ad spend)" value={formatCurrency(netProfit)} highlight={netProfit >= 0} />
            <Tile label="Break-even ROAS" value={`${breakEvenRoas.toFixed(2)}x`} />
            <Tile label="Status" value={healthy ? "Profitable" : "Below break-even"} />
          </div>
          <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${healthy ? "border-[var(--color-success)] text-[var(--color-ink-dim)]" : "border-[var(--color-coral)] text-[var(--color-ink-dim)]"}`}>
            {healthy
              ? `At ${margin}% margin you break even at ${breakEvenRoas.toFixed(2)}x — you're above it, so every dollar is working.`
              : `At ${margin}% margin you need ${breakEvenRoas.toFixed(2)}x ROAS to break even. You're under it — there's likely waste to recover.`}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-[var(--color-violet)] bg-[color-mix(in_srgb,var(--color-violet)_10%,transparent)]" : "border-[var(--color-border)] bg-[var(--color-base)]"}`}>
      <p className="text-xs text-[var(--color-ink-faint)]">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-gradient" : "text-[var(--color-ink)]"}`}>{value}</p>
    </div>
  );
}
