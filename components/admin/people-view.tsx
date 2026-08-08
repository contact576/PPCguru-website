"use client";

import { useMemo, useState } from "react";
import { Search, UserCheck, ChevronDown, ChevronRight, Mail, Monitor, History, BellOff } from "lucide-react";
import type { Person } from "@/lib/people";

function fmt(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ago(ts: string | null) {
  if (!ts) return "—";
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : `${Math.floor(d / 30)}mo ago`;
}

const INTENT: Record<Person["intent"], { label: string; cls: string }> = {
  hot: { label: "Hot", cls: "bg-[#fdeede] text-[#c0531f]" },
  warm: { label: "Warm", cls: "bg-[#fdf6dc] text-[#8a6d12]" },
  cold: { label: "Cold", cls: "bg-[#eef0e8] text-[#5c5f4e]" },
};

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="text-xl font-bold text-[var(--color-ink)]">{value}</div>
      <div className="text-xs text-[var(--color-ink-dim)]">{label}</div>
    </div>
  );
}

/** One person's stitched timeline, including their pre-signup research. */
function Timeline({ p }: { p: Person }) {
  const identifiedTs = p.identifiedAt ? +new Date(p.identifiedAt) : null;
  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-base)] px-4 py-4">
      {p.journeys.length > 0 && (
        <div className="mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink)]">
            <Mail size={13} /> Automated emails sent
          </div>
          {p.journeys.map((j, i) => (
            <div key={i} className="text-xs text-[var(--color-ink-dim)]">
              <span className="font-medium text-[#4f5f14]">{j.journey.replace(/_/g, " ")}</span> · {fmt(j.created_at)}
              {j.path ? ` · triggered on ${j.path}` : ""}
            </div>
          ))}
        </div>
      )}

      {p.events.length === 0 ? (
        <p className="text-xs text-[var(--color-ink-dim)]">No page events recorded for this person yet.</p>
      ) : (
        <ol className="space-y-1.5">
          {p.events.map((e) => {
            const pre = identifiedTs !== null && +new Date(e.created_at) < identifiedTs;
            return (
              <li key={e.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
                <span className="w-28 shrink-0 text-[var(--color-ink-faint)]">{fmt(e.created_at)}</span>
                <span className="rounded bg-[#eef2dd] px-1.5 py-0.5 font-medium text-[#4f5f14]">{e.event}</span>
                <span className="font-medium text-[var(--color-ink)]">{e.path || e.target || "—"}</span>
                {e.target && e.path ? <span className="text-[var(--color-ink-dim)]">· {e.target}</span> : null}
                {pre ? (
                  <span
                    className="rounded bg-[#e7e9f5] px-1.5 py-0.5 text-[10px] font-medium text-[#3f4a86]"
                    title="Recorded before they gave us their email — recovered by identity stitching"
                  >
                    pre-signup
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export function PeopleView({ people }: { people: Person[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return people;
    return people.filter((p) =>
      [p.email, p.name, p.location, ...p.events.map((e) => e.path)].filter(Boolean).join(" ").toLowerCase().includes(s)
    );
  }, [people, q]);

  const hot = people.filter((p) => p.intent === "hot").length;
  const stitched = people.reduce((n, p) => n + p.preIdentifyEvents, 0);
  const mailed = people.reduce((n, p) => n + p.journeys.length, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">People</h1>
        <p className="mt-1 max-w-3xl text-sm text-[var(--color-ink-dim)]">
          Visitors we can put a name to — because they submitted a form. Each row merges every device that address has
          used and includes what they read <em>before</em> they identified themselves. Nobody appears here from an IP
          lookup or a data broker.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Known people" value={people.length} />
        <Stat label="Hot right now" value={hot} />
        <Stat label="Pre-signup events recovered" value={stitched} />
        <Stat label="Journey emails sent" value={mailed} />
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <Search size={15} className="text-[var(--color-ink-faint)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, city, page…"
          className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <UserCheck size={26} className="text-[var(--color-ink-faint)]" />
          <p className="max-w-md text-sm text-[var(--color-ink-dim)]">
            {people.length
              ? "Nobody matches your search."
              : "No identified visitors yet. The first person to submit a form will appear here with their full browsing history attached."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
          {filtered.map((p) => {
            const isOpen = open === p.email;
            const intent = INTENT[p.intent];
            return (
              <div key={p.email} className="border-b border-[var(--color-border)] last:border-b-0">
                <button
                  onClick={() => setOpen(isOpen ? null : p.email)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--color-surface)]"
                >
                  {isOpen ? (
                    <ChevronDown size={16} className="shrink-0 text-[var(--color-ink-faint)]" />
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-[var(--color-ink-faint)]" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[var(--color-ink)]">{p.name || p.email}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${intent.cls}`}>{intent.label}</span>
                      {p.unsubscribedAt ? (
                        <span
                          className="flex items-center gap-1 rounded-full bg-[#eef0e8] px-2 py-0.5 text-xs font-medium text-[#5c5f4e]"
                          title={`Opted out ${fmt(p.unsubscribedAt)} — no automated email will be sent`}
                        >
                          <BellOff size={11} /> Unsubscribed
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-[var(--color-ink-dim)]">
                      {p.name ? `${p.email} · ` : ""}
                      {p.location}
                    </div>
                  </div>

                  <div className="hidden shrink-0 gap-5 text-right sm:flex">
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-ink)]">{p.pageviews}</div>
                      <div className="text-[11px] text-[var(--color-ink-dim)]">views</div>
                    </div>
                    <div title="Money-page views in the last 7 days">
                      <div className="text-sm font-semibold text-[var(--color-ink)]">{p.moneyHits}</div>
                      <div className="text-[11px] text-[var(--color-ink-dim)]">intent</div>
                    </div>
                    <div className="w-20">
                      <div className="text-sm font-semibold text-[var(--color-ink)]">{ago(p.lastSeen)}</div>
                      <div className="text-[11px] text-[var(--color-ink-dim)]">last seen</div>
                    </div>
                  </div>
                </button>

                {isOpen ? (
                  <>
                    <div className="flex flex-wrap gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs text-[var(--color-ink-dim)]">
                      <span className="flex items-center gap-1.5">
                        <Monitor size={13} /> {p.devices} device{p.devices === 1 ? "" : "s"} merged
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserCheck size={13} /> Identified {fmt(p.identifiedAt)}
                      </span>
                      <span className="flex items-center gap-1.5" title="History recovered from before they gave us their email">
                        <History size={13} /> {p.preIdentifyEvents} pre-signup event
                        {p.preIdentifyEvents === 1 ? "" : "s"}
                      </span>
                      <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 font-medium text-[#4f5f14] hover:underline">
                        <Mail size={13} /> Email them
                      </a>
                    </div>
                    <Timeline p={p} />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
