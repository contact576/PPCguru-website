"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { isoToLocalInput, localInputToIso, type PostStatus, type PostSummary } from "@/lib/blog-post-file";

/**
 * The Blog tab: every post in content/blog, including the ones the public site
 * deliberately cannot see.
 *
 * Three groups, in the order the work actually happens — what is queued to go
 * out, what is written but not yet scheduled, and what is already live. The
 * queue is the point of the page: `publishAt` is a real embargo, so a post can
 * be finished and committed today and still stay invisible until its slot.
 */

type Feedback = { tone: "ok" | "error"; message: string } | null;

const STATUS_STYLE: Record<PostStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-[var(--color-accent)] text-[var(--color-ink)]" },
  draft: { label: "Draft", className: "bg-[var(--color-border)] text-[var(--color-ink-dim)]" },
  published: { label: "Live", className: "bg-[var(--color-ink)] text-[var(--color-base)]" },
};

/** "in 3 days · Tue 9 Sep, 09:00" — the two things you want at a glance. */
function whenLabel(iso: string | null, status: PostStatus): string {
  if (!iso) return "no date";
  const date = new Date(iso);
  const stamp = date.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (status !== "scheduled") return stamp;

  const minutes = Math.round((date.getTime() - Date.now()) / 60_000);
  if (minutes < 60) return `in ${Math.max(1, minutes)} min · ${stamp}`;
  if (minutes < 60 * 36) return `in ${Math.round(minutes / 60)} h · ${stamp}`;
  return `in ${Math.round(minutes / 60 / 24)} days · ${stamp}`;
}

export function BlogManager() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [repo, setRepo] = useState<{ repo: string; branch: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [query, setQuery] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const [when, setWhen] = useState("");

  const load = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/admin/blog");
    const json = (await res.json().catch(() => ({}))) as {
      posts?: PostSummary[];
      repo?: string;
      branch?: string;
      error?: string;
    };
    if (!res.ok) {
      setLoadError(json.error || "Could not load posts.");
      setPosts([]);
      return;
    }
    setPosts(json.posts ?? []);
    if (json.repo && json.branch) setRepo({ repo: json.repo, branch: json.branch });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const list = posts ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => `${p.title} ${p.slug} ${p.category}`.toLowerCase().includes(q));
  }, [posts, query]);

  const groups = useMemo(() => {
    const scheduled = filtered
      .filter((p) => p.status === "scheduled")
      .sort((a, b) => (a.liveAt ?? "").localeCompare(b.liveAt ?? ""));
    const drafts = filtered.filter((p) => p.status === "draft");
    const published = filtered
      .filter((p) => p.status === "published")
      .sort((a, b) => (b.liveAt ?? "").localeCompare(a.liveAt ?? ""));
    return { scheduled, drafts, published };
  }, [filtered]);

  async function patch(slug: string, body: Record<string, unknown>, okMessage: string) {
    setBusySlug(slug);
    setFeedback(null);
    const res = await fetch(`/api/admin/blog/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; commit?: string };
    setBusySlug(null);
    setRescheduling(null);
    if (!res.ok) {
      setFeedback({ tone: "error", message: json.error || "Could not save that change." });
      return;
    }
    setFeedback({
      tone: "ok",
      message: `${okMessage} Committed ${json.commit?.slice(0, 7) ?? ""} — live after the rebuild.`,
    });
    await load();
  }

  async function remove(post: PostSummary) {
    if (!confirm(`Delete "${post.title}"? This commits a deletion to ${repo?.branch ?? "the branch"}.`)) return;
    setBusySlug(post.slug);
    setFeedback(null);
    const res = await fetch(`/api/admin/blog/${post.slug}`, { method: "DELETE" });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    setBusySlug(null);
    if (!res.ok) {
      setFeedback({ tone: "error", message: json.error || "Could not delete that post." });
      return;
    }
    setFeedback({ tone: "ok", message: `Deleted ${post.slug}.` });
    await load();
  }

  function startReschedule(post: PostSummary) {
    setRescheduling(post.slug);
    setWhen(isoToLocalInput(post.publishAt ?? post.liveAt ?? new Date().toISOString()));
  }

  const pill = "mono rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em]";
  const action =
    "flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[13px] text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] disabled:opacity-40";

  function Row({ post }: { post: PostSummary }) {
    const busy = busySlug === post.slug;
    return (
      <li className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-[240px] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${pill} ${STATUS_STYLE[post.status].className}`}>{STATUS_STYLE[post.status].label}</span>
              <Link href={`/admin/blog/${post.slug}`} className="head text-[17px] leading-snug hover:underline">
                {post.title}
              </Link>
            </div>
            <p className="mono mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--color-ink-faint)]">
              <span className="inline-flex items-center gap-1">
                <CalendarClock size={12} /> {whenLabel(post.liveAt, post.status)}
              </span>
              <span>/blog/{post.slug}</span>
              <span>{post.category}</span>
              <span>{post.words.toLocaleString()} words</span>
              {post.errors > 0 && (
                <span className="inline-flex items-center gap-1 font-bold text-[var(--color-danger)]">
                  <AlertTriangle size={12} /> {post.errors} error{post.errors === 1 ? "" : "s"}
                </span>
              )}
              {post.errors === 0 && post.warnings > 0 && (
                <span>
                  {post.warnings} warning{post.warnings === 1 ? "" : "s"}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/blog/${post.slug}`} className={action}>
              <Pencil size={13} /> Edit
            </Link>
            <button onClick={() => startReschedule(post)} disabled={busy} className={action}>
              <CalendarClock size={13} /> Schedule
            </button>
            {post.status === "published" && (
              <Link href={`/blog/${post.slug}`} target="_blank" className={action}>
                <ExternalLink size={13} /> View
              </Link>
            )}
            <button
              onClick={() => remove(post)}
              disabled={busy}
              aria-label={`Delete ${post.title}`}
              className={`${action} hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]`}
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
        </div>

        {rescheduling === post.slug && (
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] p-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="mono text-[10px] font-bold uppercase tracking-[.08em] text-[var(--color-ink-faint)]">
                Goes live
              </span>
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-ink)]"
              />
            </label>
            <button
              onClick={() => patch(post.slug, { publishAt: localInputToIso(when), draft: false }, "Rescheduled.")}
              disabled={busy || !when}
              className="mono inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-50"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save
            </button>
            <button
              onClick={() => patch(post.slug, { publishAt: new Date().toISOString(), draft: false }, "Publishing now.")}
              disabled={busy}
              className={action}
            >
              <Send size={13} /> Publish now
            </button>
            <button
              onClick={() =>
                patch(post.slug, { draft: !post.draft }, post.draft ? "Moved back to the queue." : "Held as a draft.")
              }
              disabled={busy}
              className={action}
            >
              <FileText size={13} /> {post.draft ? "Return to queue" : "Hold as draft"}
            </button>
            <button onClick={() => setRescheduling(null)} className={`${action} ml-auto`}>
              <X size={13} /> Cancel
            </button>
          </div>
        )}
      </li>
    );
  }

  function Group({ title, hint, list }: { title: string; hint: string; list: PostSummary[] }) {
    if (!list.length) return null;
    return (
      <section className="mt-9">
        <div className="flex items-baseline gap-3">
          <h2 className="head text-xl">{title}</h2>
          <span className="mono text-[11px] text-[var(--color-ink-faint)]">
            {list.length} · {hint}
          </span>
        </div>
        <ul className="mt-3 space-y-2.5">
          {list.map((post) => (
            <Row key={post.slug} post={post} />
          ))}
        </ul>
      </section>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="head text-3xl">Blog</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            {posts ? `${posts.length} posts` : "Loading…"}
            {repo && (
              <span className="mono ml-2 text-[11px] text-[var(--color-ink-faint)]">
                {repo.repo}@{repo.branch}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className={action}>
            <RefreshCw size={13} /> Refresh
          </button>
          <Link
            href="/admin/blog/new"
            className="mono inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)]"
          >
            <Plus size={15} /> New post
          </Link>
        </div>
      </div>

      {feedback && (
        <p
          className={`mt-5 rounded-xl border p-3 text-sm ${
            feedback.tone === "ok"
              ? "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-dim)]"
              : "border-[var(--color-danger)]/40 bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] text-[var(--color-danger)]"
          }`}
        >
          {feedback.message}
        </p>
      )}

      {loadError && (
        <div className="mt-5 rounded-xl border border-[var(--color-danger)]/40 bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] p-4 text-sm text-[var(--color-danger)]">
          <p className="font-semibold">{loadError}</p>
          <p className="mt-1.5 text-[var(--color-ink-dim)]">
            The editor commits markdown to GitHub, so it needs a token with <code>contents: write</code> on the site
            repo in <code>BLOG_GITHUB_TOKEN</code>. Until then, posts can still be added by hand in{" "}
            <code>content/blog/</code>.
          </p>
        </div>
      )}

      <div className="relative mt-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts"
          className="w-full rounded-xl border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-[var(--color-ink)]"
        />
      </div>

      {posts === null ? (
        <p className="mt-10 flex items-center gap-2 text-sm text-[var(--color-ink-dim)]">
          <Loader2 size={15} className="animate-spin" /> Reading content/blog from GitHub…
        </p>
      ) : (
        <>
          <Group title="Scheduled" hint="committed, waiting for its slot" list={groups.scheduled} />
          <Group title="Drafts" hint="held back until you schedule them" list={groups.drafts} />
          <Group title="Published" hint="live on the site" list={groups.published} />
          {!filtered.length && !loadError && (
            <p className="mt-10 text-sm text-[var(--color-ink-dim)]">No posts match that search.</p>
          )}
        </>
      )}
    </div>
  );
}
