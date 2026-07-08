"use client";

import { useState } from "react";
import { Logo } from "@/components/shared/logo";

export function LoginForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/admin";
        return;
      }
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed.");
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-base)] px-5">
      <div className="w-full max-w-sm rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-tile">
        <Logo variant="dark" size={40} />
        <h1 className="head mt-4 text-2xl">Blog admin</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-dim)]">Enter the admin password to manage posts.</p>

        {!configured && (
          <p className="mt-4 rounded-xl border border-[var(--color-warning)]/40 bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] p-3 text-[13px] text-[var(--color-ink)]">
            Set <code className="mono">ADMIN_PASSWORD</code> in your environment to enable login.
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
          />
          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
          <button
            type="submit"
            disabled={busy || !configured}
            className="mono w-full rounded-xl bg-[var(--color-ink)] px-4 py-3 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
