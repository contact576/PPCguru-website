"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Check, ChevronDown, Plus, RotateCcw, ExternalLink } from "lucide-react";
import type { PageGroup, PageRef } from "@/lib/data/page-registry";
import type { PageMetaOverride } from "@/lib/page-meta";

type Draft = { title: string; description: string; keywords: string; noindex: boolean };
const emptyDraft: Draft = { title: "", description: "", keywords: "", noindex: false };

const field =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]";
const label = "mono text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-faint)]";

function norm(p: string) {
  let s = (p || "").trim().split(/[?#]/)[0];
  if (!s.startsWith("/")) s = "/" + s;
  s = s.replace(/\/+$/g, "");
  return s || "/";
}

export function AdminMeta({
  groups,
  overrides,
  dbConfigured,
}: {
  groups: PageGroup[];
  overrides: PageMetaOverride[];
  dbConfigured: boolean;
}) {
  // Map of path → override, kept in local state so edits reflect immediately.
  const [map, setMap] = useState<Record<string, PageMetaOverride>>(() => {
    const m: Record<string, PageMetaOverride> = {};
    for (const o of overrides) m[norm(o.path)] = o;
    return m;
  });
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPath, setCustomPath] = useState("");

  // Registry paths, so any override NOT in the registry surfaces under "Custom".
  const registryPaths = useMemo(
    () => new Set(groups.flatMap((g) => g.pages.map((p) => p.path))),
    [groups],
  );
  const customPages: PageRef[] = useMemo(
    () =>
      Object.keys(map)
        .filter((p) => !registryPaths.has(p))
        .sort()
        .map((p) => ({ path: p, label: p })),
    [map, registryPaths],
  );

  const allGroups: PageGroup[] = customPages.length
    ? [...groups, { group: "Custom paths", pages: customPages }]
    : groups;

  function toggle(path: string) {
    setError(null);
    setSavedPath(null);
    if (open === path) {
      setOpen(null);
      return;
    }
    const o = map[path];
    setDraft({
      title: o?.title ?? "",
      description: o?.description ?? "",
      keywords: o?.keywords ?? "",
      noindex: o?.noindex ?? false,
    });
    setOpen(path);
  }

  async function save(path: string) {
    setBusy(true);
    setError(null);
    setSavedPath(null);
    try {
      const res = await fetch("/api/admin/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, ...draft }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error || "Couldn't save.");
        return;
      }
      setMap((m) => ({ ...m, [path]: j.override }));
      setSavedPath(path);
    } finally {
      setBusy(false);
    }
  }

  async function reset(path: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/meta?path=${encodeURIComponent(path)}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Couldn't reset.");
        return;
      }
      setMap((m) => {
        const next = { ...m };
        delete next[path];
        return next;
      });
      setDraft(emptyDraft);
      setSavedPath(null);
    } finally {
      setBusy(false);
    }
  }

  function addCustom() {
    const p = norm(customPath);
    if (!p || p === "/") return;
    setCustomPath("");
    // Seed an empty override in the map so it appears, then open it.
    if (!map[p]) {
      setMap((m) => ({ ...m, [p]: { path: p, title: null, description: null, keywords: null, noindex: false } }));
    }
    setDraft(map[p] ? { title: map[p].title ?? "", description: map[p].description ?? "", keywords: map[p].keywords ?? "", noindex: map[p].noindex } : emptyDraft);
    setOpen(p);
  }

  const customized = (path: string) => {
    const o = map[path];
    return Boolean(o && (o.title || o.description || o.keywords || o.noindex));
  };

  return (
    <div>
      <h1 className="head text-3xl">SEO / Meta</h1>
      <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-dim)]">
        Override the <strong>title</strong>, <strong>meta description</strong> and <strong>keywords</strong> for any
        page. Leave a field blank to keep the page&apos;s built-in default. Saved changes go live within a minute.
      </p>

      {!dbConfigured && (
        <p className="mt-6 rounded-xl border border-[var(--color-warning)]/40 bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] p-4 text-sm text-[var(--color-ink)]">
          Supabase isn&apos;t configured, so overrides can&apos;t be saved yet. Set{" "}
          <code className="mono">NEXT_PUBLIC_SUPABASE_URL</code> + <code className="mono">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          and run <code className="mono">supabase/page-meta.sql</code>.
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-xl border border-[var(--color-danger)]/40 bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] p-3 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {/* Add a custom path (e.g. a programmatic /toronto/google-ads page) */}
      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="min-w-[260px] flex-1">
          <span className={label}>Add any other page by path</span>
          <input
            className={`mt-2 ${field}`}
            placeholder="/toronto/google-ads"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
          />
        </div>
        <button
          onClick={addCustom}
          className="mono inline-flex items-center gap-2 rounded-xl border border-[var(--color-ink)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-ink)]"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {allGroups.map((g) => (
        <section key={g.group} className="mt-8">
          <h2 className="mono text-[11px] font-semibold uppercase tracking-[.1em] text-[var(--color-ink-faint)]">
            {g.group}
          </h2>
          <ul className="mt-3 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            {g.pages.map((p) => {
              const isOpen = open === p.path;
              return (
                <li key={p.path}>
                  <button
                    onClick={() => toggle(p.path)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-[var(--color-base)]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{p.label}</span>
                        {customized(p.path) && (
                          <span className="mono shrink-0 rounded-full bg-[#eef2dd] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[.05em] text-[#5f6f17]">
                            Custom
                          </span>
                        )}
                        {map[p.path]?.noindex && (
                          <span className="mono shrink-0 rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[.05em] text-[var(--color-ink-faint)]">
                            noindex
                          </span>
                        )}
                      </div>
                      <div className="mono truncate text-[12px] text-[var(--color-ink-dim)]">{p.path}</div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[var(--color-ink-faint)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[var(--color-border)] bg-[var(--color-base)] px-4 py-5">
                      <div className="grid gap-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={label}>Title</span>
                            <span className="mono text-[11px] text-[var(--color-ink-faint)]">
                              {draft.title.length}/60 ideal
                            </span>
                          </div>
                          <input className={`mt-2 ${field}`} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Leave blank to keep the page default" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={label}>Meta description</span>
                            <span className="mono text-[11px] text-[var(--color-ink-faint)]">
                              {draft.description.length}/155 ideal
                            </span>
                          </div>
                          <textarea rows={3} className={`mt-2 resize-y ${field}`} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} placeholder="Leave blank to keep the page default" />
                        </div>
                        <div>
                          <span className={label}>Keywords (comma-separated)</span>
                          <input className={`mt-2 ${field}`} value={draft.keywords} onChange={(e) => setDraft((d) => ({ ...d, keywords: e.target.value }))} placeholder="google ads toronto, ppc agency, ..." />
                        </div>
                        <label className="flex items-center gap-2.5 text-sm text-[var(--color-ink)]">
                          <input type="checkbox" checked={draft.noindex} onChange={(e) => setDraft((d) => ({ ...d, noindex: e.target.checked }))} className="h-4 w-4 rounded border-[var(--color-border)]" />
                          Hide this page from search engines (<code className="mono">noindex</code>)
                        </label>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => save(p.path)}
                          disabled={busy || !dbConfigured}
                          className="mono inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-50"
                        >
                          {busy && <Loader2 size={14} className="animate-spin" />} Save
                        </button>
                        {customized(p.path) && (
                          <button
                            onClick={() => reset(p.path)}
                            disabled={busy}
                            className="mono inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-ink-dim)] disabled:opacity-50"
                          >
                            <RotateCcw size={13} /> Reset to default
                          </button>
                        )}
                        <Link href={p.path} target="_blank" className="ml-auto flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
                          <ExternalLink size={13} /> View page
                        </Link>
                        {savedPath === p.path && (
                          <span className="flex items-center gap-1.5 text-sm text-[#5f6f17]">
                            <Check size={15} /> Saved
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
