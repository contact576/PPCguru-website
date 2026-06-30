"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Check, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import type { CmsSettings } from "@/lib/settings";
import type { IntegrationStatus } from "@/lib/system-status";

export function AdminSettings({
  settings,
  status,
  dbConfigured,
}: {
  settings: CmsSettings;
  status: IntegrationStatus[];
  dbConfigured: boolean;
}) {
  const [form, setForm] = useState<CmsSettings>(settings);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof CmsSettings>(key: K, value: CmsSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(j.error || "Could not save settings.");
      return;
    }
    setSaved(true);
  }

  const field =
    "w-full rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]";
  const label = "mono text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-faint)]";

  return (
    <main className="min-h-screen bg-[var(--color-base)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo variant="dark" size={32} />
            <span className="text-sm text-[var(--color-ink-dim)]">· Settings</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              <ArrowLeft size={14} /> Posts
            </Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="head text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-dim)]">CMS defaults and integration status.</p>

        {!dbConfigured && (
          <p className="mt-6 rounded-xl border border-[var(--color-warning)]/40 bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] p-4 text-sm text-[var(--color-ink)]">
            Supabase isn&apos;t configured, so settings can&apos;t be saved yet. The defaults below are still
            in effect. Set <code className="mono">NEXT_PUBLIC_SUPABASE_URL</code> +{" "}
            <code className="mono">SUPABASE_SERVICE_ROLE_KEY</code> and run <code className="mono">supabase/schema.sql</code>.
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-xl border border-[var(--color-danger)]/40 bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] p-3 text-sm text-[var(--color-danger)]">
            {error}
          </p>
        )}

        {/* ── Blog defaults ──────────────────────────────────────────────── */}
        <section className="mt-8 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <h2 className="text-lg font-semibold">Blog defaults</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            New posts start with these. The title &amp; description also drive the public{" "}
            <Link href="/blog" target="_blank" className="underline underline-offset-2">blog index</Link>.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <span className={label}>Default author</span>
              <input className={`mt-2 ${field}`} value={form.defaultAuthor} onChange={(e) => set("defaultAuthor", e.target.value)} />
            </div>
            <div>
              <span className={label}>Default category</span>
              <input className={`mt-2 ${field}`} value={form.defaultCategory} onChange={(e) => set("defaultCategory", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <span className={label}>Blog title</span>
              <input className={`mt-2 ${field}`} value={form.blogTitle} onChange={(e) => set("blogTitle", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <span className={label}>Blog description</span>
              <textarea rows={3} className={`mt-2 resize-y ${field}`} value={form.blogDescription} onChange={(e) => set("blogDescription", e.target.value)} />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={save}
              disabled={busy || !dbConfigured}
              className="mono inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-50"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              Save settings
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[#5f6f17]">
                <Check size={15} /> Saved
              </span>
            )}
          </div>
        </section>

        {/* ── Integration status ─────────────────────────────────────────── */}
        <section className="mt-8 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <h2 className="text-lg font-semibold">Integration status</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            Read-only. Each switches from a graceful fallback to live once its keys are set in{" "}
            <code className="mono">.env.local</code> (or your host&apos;s env). No secrets are shown here.
          </p>

          <ul className="mt-6 divide-y divide-[var(--color-border)]">
            {status.map((s) => (
              <li key={s.key} className="flex items-start justify-between gap-4 py-3.5">
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-[13px] text-[var(--color-ink-dim)]">{s.detail}</div>
                </div>
                {s.configured ? (
                  <span className="mono mt-0.5 shrink-0 rounded-full bg-[#eef2dd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.05em] text-[#5f6f17]">
                    Connected
                  </span>
                ) : (
                  <span className="mono mt-0.5 shrink-0 rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.05em] text-[var(--color-ink-faint)]">
                    Not set
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
