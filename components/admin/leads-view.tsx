"use client";

import { useMemo, useState } from "react";
import { Search, Download, Inbox } from "lucide-react";
import type { LeadRow } from "@/lib/leads";

function fmt(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-CA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** Turn "popup:audit" / "tool:roas-calculator" / "contact" into a readable label. */
function sourceLabel(s: string | null) {
  if (!s) return "—";
  return s.replace(/[:_-]/g, " · ");
}

function toCsv(rows: LeadRow[]) {
  const cols = ["created_at", "name", "email", "phone", "company", "website", "source", "service", "budget", "message"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [cols.join(","), ...rows.map((r) => cols.map((c) => esc((r as unknown as Record<string, unknown>)[c])).join(","))];
  return lines.join("\n");
}

export function LeadsView({ rows }: { rows: LeadRow[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.company, r.source, r.service, r.message].filter(Boolean).join(" ").toLowerCase().includes(s)
    );
  }, [rows, q]);

  function download() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ppcguru-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const now = Date.now();
  const today = rows.filter((r) => now - new Date(r.created_at).getTime() < 864e5).length;
  const week = rows.filter((r) => now - new Date(r.created_at).getTime() < 7 * 864e5).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">Leads &amp; form submissions</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            Every contact / audit / calculator form filled on the site — newest first. <strong>{rows.length}</strong> total ·{" "}
            <strong>{today}</strong> today · <strong>{week}</strong> this week.
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

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <Search size={15} className="text-[var(--color-ink-faint)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone, source, message…"
          className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <Inbox size={26} className="text-[var(--color-ink-faint)]" />
          <p className="text-sm text-[var(--color-ink-dim)]">{rows.length ? "No leads match your search." : "No form submissions yet."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)] text-left text-[var(--color-ink-dim)]">
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Service / Budget</th>
                <th className="px-4 py-3 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-[var(--color-border)] align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--color-ink-dim)]">{fmt(r.created_at)}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                    {r.name || "—"}
                    {r.company ? <span className="block text-xs font-normal text-[var(--color-ink-faint)]">{r.company}</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    {r.email ? <a href={`mailto:${r.email}`} className="block text-[var(--color-ink)] underline decoration-dotted">{r.email}</a> : null}
                    {r.phone ? <a href={`tel:${r.phone}`} className="block text-[var(--color-ink-dim)]">{r.phone}</a> : null}
                    {!r.email && !r.phone ? "—" : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-[#eef2dd] px-2.5 py-1 text-xs font-medium text-[#4f5f14]">{sourceLabel(r.source)}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-dim)]">
                    {r.service || "—"}
                    {r.budget ? <span className="block text-xs text-[var(--color-ink-faint)]">{r.budget}</span> : null}
                  </td>
                  <td className="max-w-[280px] px-4 py-3 text-[var(--color-ink-dim)]">{r.message || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
