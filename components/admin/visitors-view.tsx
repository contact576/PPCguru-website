"use client";

import { useMemo, useState } from "react";
import { Search, Download, Users } from "lucide-react";
import type { VisitorEventRow } from "@/lib/tracking";

function fmt(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function place(r: VisitorEventRow) {
  return [r.city, r.region, r.country].filter(Boolean).join(", ") || "—";
}

function shortUa(ua: string | null) {
  if (!ua) return "—";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS X|Macintosh/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iPhone|iPad|iOS/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "";
  const br = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "";
  return [br, os].filter(Boolean).join(" · ") || "Unknown";
}

function utmLabel(utm: Record<string, string> | null) {
  if (!utm || !Object.keys(utm).length) return "";
  return [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean).join(" / ");
}

function toCsv(rows: VisitorEventRow[]) {
  const cols = ["created_at", "event", "path", "city", "region", "country", "ip", "referrer", "session_id", "ua"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc((r as unknown as Record<string, unknown>)[c])).join(","))].join("\n");
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="text-xl font-bold text-[var(--color-ink)]">{value}</div>
      <div className="text-xs text-[var(--color-ink-dim)]">{label}</div>
    </div>
  );
}

export function VisitorsView({ rows }: { rows: VisitorEventRow[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.event, r.path, r.city, r.country, r.ip, r.referrer, utmLabel(r.utm)].filter(Boolean).join(" ").toLowerCase().includes(s)
    );
  }, [rows, q]);

  const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;
  const withIp = rows.filter((r) => r.ip).length;
  const linked = rows.filter((r) => r.lead_id).length;

  function download() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ppcguru-visitors-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">Visitors &amp; activity</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            First-party visit &amp; interaction events — newest first. IP, location &amp; device are recorded only when the visitor accepts cookies (PIPEDA/CASL-aligned).
          </p>
        </div>
        <button
          onClick={download}
          disabled={!filtered.length}
          className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)] disabled:opacity-40"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Events (recent)" value={rows.length} />
        <Stat label="Unique sessions" value={sessions} />
        <Stat label="With IP (consented)" value={withIp} />
        <Stat label="Tied to a lead" value={linked} />
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <Search size={15} className="text-[var(--color-ink-faint)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search path, event, city, IP, referrer, campaign…"
          className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <Users size={26} className="text-[var(--color-ink-faint)]" />
          <p className="text-sm text-[var(--color-ink-dim)]">{rows.length ? "No visits match your search." : "No visitor events recorded yet."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)] text-left text-[var(--color-ink-dim)]">
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">Page</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">IP</th>
                <th className="px-4 py-3 font-semibold">Source / referrer</th>
                <th className="px-4 py-3 font-semibold">Device</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const utm = utmLabel(r.utm);
                return (
                  <tr key={r.id} className="border-t border-[var(--color-border)] align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--color-ink-dim)]">{fmt(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-[#eef2dd] px-2.5 py-1 text-xs font-medium text-[#4f5f14]">{r.event}</span>
                      {r.lead_id ? <span className="ml-1 inline-block rounded-full bg-[#fdeede] px-2 py-1 text-xs font-medium text-[#c0531f]">lead</span> : null}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-[var(--color-ink)]" title={r.path ?? ""}>{r.path || "—"}</td>
                    <td className="px-4 py-3 text-[var(--color-ink-dim)]">{place(r)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[var(--color-ink-dim)]">{r.ip || "—"}</td>
                    <td className="max-w-[220px] px-4 py-3 text-[var(--color-ink-dim)]">
                      {utm ? <span className="block text-xs font-medium text-[#4f5f14]">{utm}</span> : null}
                      <span className="block truncate text-xs" title={r.referrer ?? ""}>{r.referrer || (utm ? "" : "direct")}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--color-ink-dim)]">{shortUa(r.ua)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
