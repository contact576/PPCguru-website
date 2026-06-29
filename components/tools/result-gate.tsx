"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { LeadForm } from "@/components/shared/lead-form";

/**
 * Lead-gate for tool results. Shows `preview` (≈20% — a teaser) with the full
 * `children` blurred behind a capture form. Unlocks on submit (or if the visitor
 * already submitted a lead elsewhere this session). Per-tool unlock is also
 * remembered so a returning user isn't re-gated.
 */
export function ResultGate({
  source,
  title = "Unlock your full report",
  blurb = "Enter your details to reveal revenue, ROAS, cost-per-acquisition and the full funnel.",
  preview,
  children,
}: {
  source: string;
  title?: string;
  blurb?: string;
  preview?: React.ReactNode;
  children: React.ReactNode;
}) {
  const key = "ppcg_gate_" + source;
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("ppcg_lead_done") || localStorage.getItem(key)) setUnlocked(true);
    } catch { /* ignore */ }
  }, [key]);

  function onDone() {
    try { localStorage.setItem(key, "1"); localStorage.setItem("ppcg_lead_done", "1"); } catch { /* ignore */ }
    setUnlocked(true);
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {preview ? <div>{preview}</div> : <div aria-hidden className="pointer-events-none select-none blur-[7px] opacity-50">{children}</div>}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/40 to-white/85 p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-tile">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-lime)]"><Lock size={17} /></span>
          <h4 className="mt-3 text-lg font-bold">{title}</h4>
          <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{blurb}</p>
          <div className="mt-4"><LeadForm source={source} compact submitLabel="Unlock my report" onDone={onDone} /></div>
        </div>
      </div>
    </div>
  );
}
