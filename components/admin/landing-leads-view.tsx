"use client";

import { useMemo, useState } from "react";
import { Search, Download, Inbox, AlertTriangle, ExternalLink } from "lucide-react";
import { LANDING_LEAD_STATUSES, type LandingLeadRow, type LandingLeadStatus } from "@/lib/landing-leads";
import { budgetLabel, businessTypeLabel, LANDING_PATH } from "@/lib/data/landing-100-leads";

function fmt(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-CA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function waLink(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  // Bare 10-digit North American numbers get the +1.
  return `https://wa.me/${digits.length === 10 ? `1${digits}` : digits}`;
}

const STATUS_STYLE: Record<LandingLeadStatus, string> = {
  new: "bg-[#eef2dd] text-[#4f5f14]",
  contacted: "bg-[#e6f0ff] text-[#1f4b99]",
  qualified: "bg-[#fff4d6] text-[#8a5a00]",
  booked: "bg-[#dcf5e3] text-[#14612f]",
  lost: "bg-[#f3e6e6] text-[#7a2626]",
};

function attributionLabel(utm: Record<string, string> | null) {
  if (!utm) return null;
  const parts: string[] = [];
  if (utm.utm_source || utm.utm_medium) parts.push([utm.utm_source, utm.utm_medium].filter(Boolean).join(" / "));
  if (utm.utm_campaign) parts.push(utm.utm_campaign);
  if (!parts.length) {
    if (utm.gclid) parts.push("Google Ads click");
    else if (utm.fbclid) parts.push("Meta click");
    else if (utm.msclkid) parts.push("Microsoft Ads click");
    else if (utm.referrer) {
      try {
        parts.push(new URL(utm.referrer).hostname);
      } catch {
        parts.push("referral");
      }
    }
  }
  return parts.length ? parts.join(" · ") : null;
}

function toCsv(rows: LandingLeadRow[]) {
  const cols = ["created_at", "status", "name", "company", "email", "phone", "location", "business_type", "budget", "utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid", "landing", "lead_id"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    cols.join(","),
    ...rows.map((r) =>
      cols
        .map((c) => {
          if (c === "business_type") return esc(businessTypeLabel(r.business_type));
          if (c === "budget") return esc(budgetLabel(r.budget));
          if (c.startsWith("utm_") || c === "gclid" || c === "fbclid") return esc(r.utm?.[c]);
          return esc((r as unknown as Record<string, unknown>)[c]);
        })
        .join(",")
    ),
  ];
  return lines.join("\n");
}

/**
 * /admin/landing-leads — the /100-leads funnel queue. Search, CSV export, and
 * a per-row status select that PATCHes /api/admin/landing-leads. When the
 * dedicated table is missing the page still lists the leads (from `leads`)
 * but says so and disables status editing.
 */
export function LandingLeadsView({ rows: initialRows, fallback }: { rows: LandingLeadRow[]; fallback: boolean }) {
  const [rows, setRows] = useState(initialRows);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LandingLeadStatus>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!s) return true;
      return [r.name, r.email, r.phone, r.company, r.location, businessTypeLabel(r.business_type), budgetLabel(r.budget), attributionLabel(r.utm)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(s);
    });
  }, [rows, q, statusFilter]);

  async function setStatus(id: string, status: LandingLeadStatus) {
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    setBusy(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/landing-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `HTTP ${res.status}`);
      }
    } catch (e) {
      setRows(prev);
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(null);
    }
  }

  function download() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ppcguru-landing-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const now = Date.now();
  const today = rows.filter((r) => now - new Date(r.created_at).getTime() < 864e5).length;
  const week = rows.filter((r) => now - new Date(r.created_at).getTime() < 7 * 864e5).length;
  const counts = Object.fromEntries(LANDING_LEAD_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])) as Record<LandingLeadStatus, number>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">Landing page leads</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            Every "100 qualified leads" application from{" "}
            <a href={LANDING_PATH} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-dotted">
              {LANDING_PATH} <ExternalLink size={12} />
            </a>{" "}
            — newest first. <strong>{rows.length}</strong> total · <strong>{today}</strong> today · <strong>{week}</strong> this week.
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

      {fallback ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#e8d9a0] bg-[#fff8e1] px-3.5 py-3 text-sm text-[#6b4f00]">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>
            The <code>landing_page_leads</code> table isn't set up yet, so this list is read from the general leads mirror and status editing is off. Run{" "}
            <code>supabase/landing-leads.sql</code> in the Supabase SQL editor once to enable service-area / business-type / attribution columns and the status pipeline.
          </p>
        </div>
      ) : null}
      {error ? <p className="mb-4 rounded-lg bg-[#fdeaea] px-3.5 py-2 text-sm text-[#7a2626]">{error}</p> : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <Search size={15} className="text-[var(--color-ink-faint)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, business, city, email, phone, campaign…"
            className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {(["all", ...LANDING_LEAD_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-dim)] hover:border-[var(--color-ink)]"
              }`}
            >
              {s} {s === "all" ? `(${rows.length})` : `(${counts[s]})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <Inbox size={26} className="text-[var(--color-ink-faint)]" />
          <p className="text-sm text-[var(--color-ink-dim)]">{rows.length ? "No landing leads match your filters." : "No landing page applications yet."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)] text-left text-[var(--color-ink-dim)]">
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Name / Business</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Market</th>
                <th className="px-4 py-3 font-semibold">Ad budget / mo</th>
                <th className="px-4 py-3 font-semibold">Campaign</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const wa = waLink(r.phone);
                const attr = attributionLabel(r.utm);
                return (
                  <tr key={r.id} className="border-t border-[var(--color-border)] align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--color-ink-dim)]">{fmt(r.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                      {r.name || "—"}
                      {r.company ? <span className="block text-xs font-normal text-[var(--color-ink-faint)]">{r.company}</span> : null}
                    </td>
                    <td className="px-4 py-3">
                      {r.email ? (
                        <a href={`mailto:${r.email}`} className="block text-[var(--color-ink)] underline decoration-dotted">
                          {r.email}
                        </a>
                      ) : null}
                      {r.phone ? (
                        <span className="flex flex-wrap items-center gap-2">
                          <a href={`tel:${r.phone}`} className="text-[var(--color-ink-dim)]">
                            {r.phone}
                          </a>
                          {wa ? (
                            <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#dcf5e3] px-2 py-0.5 text-[11px] font-semibold text-[#14612f]">
                              WhatsApp
                            </a>
                          ) : null}
                        </span>
                      ) : null}
                      {!r.email && !r.phone ? "—" : null}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-ink-dim)]">
                      {r.location || "—"}
                      <span className="block text-xs text-[var(--color-ink-faint)]">{businessTypeLabel(r.business_type)}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--color-ink-dim)]">{budgetLabel(r.budget)}</td>
                    <td className="max-w-[220px] px-4 py-3 text-xs text-[var(--color-ink-dim)]">{attr || <span className="text-[var(--color-ink-faint)]">direct / unknown</span>}</td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        disabled={fallback || busy === r.id}
                        onChange={(e) => setStatus(r.id, e.target.value as LandingLeadStatus)}
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize outline-none disabled:opacity-60 ${STATUS_STYLE[r.status]}`}
                      >
                        {LANDING_LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
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
