"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, Users, AlertTriangle, CheckCircle2, UserCheck } from "lucide-react";
import type { VisitorEventRow } from "@/lib/tracking";
import type { IdentityStatus } from "@/lib/identity";

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
  const cols = ["created_at", "person_name", "person_email", "event", "path", "city", "region", "country", "ip", "referrer", "session_id", "ua"];
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

/**
 * Setup state for the identity layer. This is the one screen where "the SQL was
 * never run" needs to be loud — everywhere else it's silent by design, which is
 * right for visitors and useless for whoever has to operate it.
 */
function SetupBanner({ status }: { status: IdentityStatus }) {
  if (status.ready && status.secretDedicated) {
    return (
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-[#cfe0b4] bg-[#f2f7e6] px-4 py-3 text-sm text-[#3f5310]">
        <CheckCircle2 size={16} className="shrink-0" />
        <span>
          <strong>Identity is live.</strong> {status.knownPeople} known {status.knownPeople === 1 ? "person" : "people"}.
          {status.journeysLive ? " Journey emails are on." : " Journey emails are OFF (JOURNEYS_ENABLED=false or no mail provider)."}
        </span>
        <Link href="/admin/people" className="ml-auto font-semibold underline">
          Open People →
        </Link>
      </div>
    );
  }

  const todo: string[] = [];
  if (status.tablesMissing) todo.push("Run supabase/visitor-identity.sql in the Supabase SQL editor — nothing is stored until you do.");
  if (!status.secretConfigured) todo.push("Set IDENTITY_SECRET (or ADMIN_PASSWORD) so the recognition cookie can be signed.");
  else if (!status.secretDedicated)
    todo.push("Set a dedicated IDENTITY_SECRET — it's currently borrowing ADMIN_PASSWORD, so changing that password would sign out every known visitor and break live unsubscribe links.");
  if (!status.journeysLive) todo.push("Journey emails are off: set JOURNEYS_ENABLED=true and configure SMTP or RESEND_API_KEY.");

  return (
    <div className="mb-5 rounded-xl border border-[#e6cfa8] bg-[#fdf6e9] px-4 py-3.5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#8a5a12]">
        <AlertTriangle size={16} /> Visitor identity isn&apos;t fully set up yet
      </div>
      <ul className="mt-2 ml-6 list-disc space-y-1 text-sm text-[#7a5a24]">
        {todo.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="mt-2 ml-6 text-xs text-[#8a6d3c]">
        Until then, events are still recorded but stay anonymous. See VISITOR-IDENTITY-SETUP.md.
      </p>
    </div>
  );
}

export function VisitorsView({ rows, status }: { rows: VisitorEventRow[]; status: IdentityStatus }) {
  const [q, setQ] = useState("");
  const [knownOnly, setKnownOnly] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let out = knownOnly ? rows.filter((r) => r.lead_id) : rows;
    if (s) {
      out = out.filter((r) =>
        [r.event, r.path, r.city, r.country, r.ip, r.referrer, r.person_name, r.person_email, utmLabel(r.utm)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }
    return out;
  }, [rows, q, knownOnly]);

  const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;
  const withIp = rows.filter((r) => r.ip).length;
  const linked = rows.filter((r) => r.lead_id).length;
  const people = new Set(rows.map((r) => r.person_email).filter(Boolean)).size;

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
          <p className="mt-1 max-w-3xl text-sm text-[var(--color-ink-dim)]">
            First-party visit &amp; interaction events — newest first. <strong>Who</strong> is filled in once that person submits
            a form; it then applies retroactively to everything they viewed beforehand. IP, location &amp; device are recorded
            only when the visitor accepts cookies (PIPEDA/CASL-aligned).
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

      <SetupBanner status={status} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Events (recent)" value={rows.length} />
        <Stat label="Unique sessions" value={sessions} />
        <Stat label="Named people" value={people} />
        <Stat label="Events with a name" value={linked} />
        <Stat label="With IP (consented)" value={withIp} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <Search size={15} className="text-[var(--color-ink-faint)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, path, event, city, IP, campaign…"
            className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </div>
        <button
          onClick={() => setKnownOnly((v) => !v)}
          className={
            knownOnly
              ? "flex items-center gap-1.5 rounded-lg border border-[var(--color-ink)] bg-[var(--color-ink)] px-3.5 py-2 text-sm font-medium text-[var(--color-lime)]"
              : "flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
          }
        >
          <UserCheck size={15} /> Known people only
        </button>
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
                <th className="px-4 py-3 font-semibold">Who</th>
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
                    <td className="max-w-[200px] px-4 py-3">
                      {r.person_email ? (
                        <>
                          <span className="block truncate font-medium text-[var(--color-ink)]" title={r.person_name ?? ""}>
                            {r.person_name || r.person_email}
                          </span>
                          {r.person_name ? (
                            <a
                              href={`mailto:${r.person_email}`}
                              className="block truncate text-xs text-[#4f5f14] hover:underline"
                              title={r.person_email}
                            >
                              {r.person_email}
                            </a>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-xs text-[var(--color-ink-faint)]">Anonymous</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-[#eef2dd] px-2.5 py-1 text-xs font-medium text-[#4f5f14]">{r.event}</span>
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
