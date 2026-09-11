"use client";

import { useEffect, useState } from "react";
import { Loader2, Send, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import type { EmailChannelHealth } from "@/lib/email";

type Health = { channels: EmailChannelHealth[]; recipients: string[]; from: string };

/**
 * /admin/settings → "Email delivery". Runs a live probe of the SMTP + Resend
 * channels and lets the admin fire one real test notification, so "the team
 * isn't getting form emails" is diagnosed here — not by guessing at env vars.
 */
export function EmailHealthPanel() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; detail: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email-health", { cache: "no-store" });
      const j = (await res.json()) as Health & { ok: boolean };
      if (j.ok) setHealth(j);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function sendTest() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/email-health", { method: "POST" });
      const j = (await res.json()) as { ok: boolean; detail: string };
      setResult(j);
      await load();
    } finally {
      setSending(false);
    }
  }

  const allDown = health ? health.channels.every((c) => !c.ok) : false;

  return (
    <section className="mt-8 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Email delivery</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            Live check of the channels that carry every form notification and autoresponder.
            {health ? (
              <>
                {" "}
                Notifications go to <strong>{health.recipients.join(", ")}</strong> from <strong>{health.from}</strong>.
              </>
            ) : null}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:border-[var(--color-ink)] disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Re-check
          </button>
          <button
            onClick={() => void sendTest()}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send test email
          </button>
        </div>
      </div>

      {allDown ? (
        <p className="mt-4 rounded-lg border border-[#e8b4b4] bg-[#fdeaea] px-3.5 py-3 text-sm text-[#7a2626]">
          No working email channel. Leads are still saved to Supabase and shown under Leads / Landing leads, but nobody is being emailed. Fix at
          least one channel below.
        </p>
      ) : null}

      <ul className="mt-5 divide-y divide-[var(--color-border)]">
        {(health?.channels ?? []).map((c) => (
          <li key={c.channel} className="flex items-start gap-3 py-3.5">
            {c.ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#5f6f17]" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-[#b42318]" />}
            <div>
              <div className="font-medium">
                {c.channel === "smtp" ? "Hostinger SMTP" : "Resend"}{" "}
                <span className="mono ml-2 rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[.05em] text-[var(--color-ink-faint)]">
                  {c.configured ? (c.ok ? "healthy" : "failing") : "not set"}
                </span>
              </div>
              <div className="text-[13px] text-[var(--color-ink-dim)]">{c.detail}</div>
            </div>
          </li>
        ))}
        {loading && !health ? (
          <li className="py-3.5 text-sm text-[var(--color-ink-dim)]">Checking…</li>
        ) : null}
      </ul>

      {result ? (
        <p className={`mt-4 rounded-lg px-3.5 py-3 text-sm ${result.ok ? "bg-[#eef2dd] text-[#4f5f14]" : "bg-[#fdeaea] text-[#7a2626]"}`}>
          {result.ok ? "Test delivered — " : "Test failed — "}
          {result.detail}
        </p>
      ) : null}
    </section>
  );
}
