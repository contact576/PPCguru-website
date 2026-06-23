"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, Check, X, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Signal = { label: string; ok: boolean; detail: string };
type AuditResult = { url: string; score: number; title: string; signals: Signal[]; narrative: string; aiPowered: boolean };

export function InstantAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/instant-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:p-9">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4">
          <Search size={18} className="text-[var(--color-ink-faint)]" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            className="w-full bg-transparent px-3 py-3.5 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
            aria-label="Website URL"
          />
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? <><Loader2 size={18} className="animate-spin" /> Auditing…</> : <>Run free audit</>}
        </Button>
      </form>

      {error && <p className="mt-4 rounded-lg bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)] px-4 py-3 text-sm text-[var(--color-danger)]">{error}</p>}

      {loading && (
        <div className="mt-8 flex flex-col items-center gap-3 py-8 text-[var(--color-ink-dim)]">
          <Loader2 size={28} className="animate-spin text-[var(--color-violet-bright)]" />
          <p className="text-sm">Fetching your page and analyzing speed, SEO and tracking signals…</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <ScoreRing score={result.score} />
            <div className="flex-1">
              <p className="text-sm text-[var(--color-ink-faint)]">Audit for</p>
              <p className="break-all font-semibold text-[var(--color-ink)]">{result.url}</p>
              <p className="mt-3 text-[var(--color-ink-dim)]">{result.narrative}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
                <Sparkles size={12} className="text-[var(--color-cyan-bright)]" />
                {result.aiPowered ? "Analysis written by Claude AI from real measured signals." : "Automated analysis from real measured signals (AI narrative available once an API key is configured)."}
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {result.signals.map((s) => (
              <div key={s.label} className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3">
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${s.ok ? "bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]" : "bg-[color-mix(in_srgb,var(--color-danger)_16%,transparent)] text-[var(--color-danger)]"}`}>
                  {s.ok ? <Check size={13} /> : <X size={13} />}
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">{s.label}</p>
                  <p className="text-xs text-[var(--color-ink-faint)]">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--color-border-bright)] bg-[var(--color-base-2)] p-6 text-center">
            <p className="text-[var(--color-ink)]">This is a fast, on-page check. A full audit reviews your live ad accounts, wasted spend, Quality Score and conversion tracking.</p>
            <Button href="/contact" className="mt-4">Get a full free audit <ArrowRight size={16} /></Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#34e3a3" : score >= 50 ? "#ffce5c" : "#ff6b6b";
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-[var(--color-ink-faint)]">/ 100</span>
      </div>
    </div>
  );
}
