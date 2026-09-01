"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Columns2,
  Eye,
  Loader2,
  Pencil,
  Sparkles,
  Wand2,
} from "lucide-react";
import { EditorToolbar, applyAction, shortcutFor, type EditorAction } from "@/components/admin/editor-toolbar";
import { isoToLocalInput, localInputToIso, postStatus, type PostFields } from "@/lib/blog-post-file";
import type { LintProblem } from "@/lib/blog-lint";
import { slugify } from "@/lib/slug";

/**
 * The Git-backed post editor.
 *
 * Saving does not write a database row — it commits content/blog/<slug>.md to
 * the site repo, which is the blog's source of truth. Two consequences shape
 * this screen: the editorial checks run BEFORE the commit (a bad post on master
 * is a bad post in the history), and "publish" is a timestamp rather than a
 * boolean, because a committed post stays invisible until its `publishAt`.
 */

const CATEGORIES = ["SEO", "Local SEO", "AI Search", "Google Ads", "Meta Ads", "CRO", "Marketing"];

/** Schedule presets — the three slots that actually get used. */
function presets(): { label: string; value: Date }[] {
  const at9 = (date: Date) => {
    date.setHours(9, 0, 0, 0);
    return date;
  };
  const tomorrow = at9(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const monday = at9(new Date());
  monday.setDate(monday.getDate() + ((8 - monday.getDay()) % 7 || 7));
  return [
    { label: "Tomorrow, 9am", value: tomorrow },
    { label: "Next Monday, 9am", value: monday },
  ];
}

export function BlogEditor({
  post,
  sha,
  isNew,
}: {
  post: PostFields;
  /** Blob sha of the version loaded — sent back so a stale save is refused. */
  sha?: string;
  isNew: boolean;
}) {
  const router = useRouter();

  const [fields, setFields] = useState<PostFields>(post);
  const [slugDirty, setSlugDirty] = useState(!isNew);
  const [tab, setTab] = useState<"write" | "preview" | "split">("write");
  const [problems, setProblems] = useState<LintProblem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<"check" | "save" | "draft" | null>(null);
  const [linkSignal, setLinkSignal] = useState(0);

  const [aiOpen, setAiOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [notes, setNotes] = useState("");
  const [words, setWords] = useState(1400);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof PostFields>(key: K, value: PostFields[K]) =>
    setFields((f) => ({ ...f, [key]: value }));

  const status = useMemo(() => postStatus(fields), [fields]);

  function runAction(action: EditorAction) {
    const ta = contentRef.current;
    if (!ta) return;
    if (tab === "preview") setTab("write");
    applyAction(ta, action, (next) => setFields((f) => ({ ...f, content: next })));
  }

  function onContentKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const action = shortcutFor(e);
    if (!action) return;
    e.preventDefault();
    if (action === "link") setLinkSignal((n) => n + 1);
    else runAction(action);
  }

  function onTitle(value: string) {
    setFields((f) => ({ ...f, title: value, ...(slugDirty ? {} : { slug: slugify(value) }) }));
  }

  /** Picking a slot also moves `date` — the listing sorts on `date`, not on publishAt. */
  function onSchedule(localValue: string) {
    const iso = localInputToIso(localValue);
    setFields((f) => ({ ...f, publishAt: iso, date: iso ? iso.slice(0, 10) : f.date }));
  }

  async function send(dryRun: boolean, overrides: Partial<PostFields> = {}) {
    const payload = { ...fields, ...overrides, dryRun };
    const res = await fetch(isNew ? "/api/admin/blog" : `/api/admin/blog/${post.slug}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, sha }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      problems?: LintProblem[];
      slug?: string;
      commit?: string;
    };
    return { ok: res.ok, json };
  }

  async function check() {
    setBusy("check");
    setError(null);
    setNotice(null);
    const { ok, json } = await send(true);
    setBusy(null);
    if (!ok) {
      setError(json.error || "Could not run the checks.");
      return;
    }
    setProblems(json.problems ?? []);
    if (!json.problems?.length) setNotice("No problems. This post is ready to commit.");
  }

  async function save(overrides: Partial<PostFields> = {}, label = "save") {
    setBusy(label === "save" ? "save" : "draft");
    setError(null);
    setNotice(null);
    const { ok, json } = await send(false, overrides);
    setBusy(null);
    if (!ok) {
      setError(json.error || "Could not commit the post.");
      setProblems(json.problems ?? null);
      return;
    }
    setProblems(json.problems ?? []);
    router.push("/admin");
    router.refresh();
  }

  async function generate() {
    if (fields.content.trim() && !confirm("Replace the current draft with a new one?")) return;
    setBusy("check");
    setError(null);
    setNotice(null);
    const res = await fetch("/api/admin/blog/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, keyword, notes, words }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      draft?: { title: string; seoTitle: string; description: string; category: string; slug: string; content: string };
    };
    setBusy(null);
    if (!res.ok || !json.draft) {
      setError(json.error || "The draft could not be generated.");
      return;
    }
    const draft = json.draft;
    setFields((f) => ({
      ...f,
      title: draft.title || f.title,
      seoTitle: draft.seoTitle || f.seoTitle,
      description: draft.description || f.description,
      category: draft.category || f.category,
      slug: slugDirty ? f.slug : draft.slug || f.slug,
      content: draft.content,
    }));
    setAiOpen(false);
    setNotice("Draft written. Read it end to end before you schedule it — it is a first draft, not a published post.");
  }

  const errors = problems?.filter((p) => p.level === "error") ?? [];
  const warnings = problems?.filter((p) => p.level === "warn") ?? [];

  const field =
    "w-full rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]";
  const label = "mono text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-faint)]";
  const ghost =
    "flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] disabled:opacity-40";

  return (
    <main className="min-h-screen bg-[var(--color-base)]">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
            <ArrowLeft size={15} /> Blog
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setAiOpen((v) => !v)} className={ghost}>
              <Sparkles size={14} /> Write with AI
            </button>
            <button onClick={check} disabled={busy !== null} className={ghost}>
              {busy === "check" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Check
            </button>
            <button
              onClick={() => save({ draft: true }, "draft")}
              disabled={busy !== null}
              className={ghost}
            >
              {busy === "draft" ? <Loader2 size={14} className="animate-spin" /> : null} Save as draft
            </button>
            <button
              onClick={() => save()}
              disabled={busy !== null}
              className="mono inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-50"
            >
              {busy === "save" && <Loader2 size={14} className="animate-spin" />}
              {fields.draft ? "Commit draft" : status === "scheduled" ? "Commit + schedule" : "Commit + publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {error && (
          <p className="mb-5 rounded-xl border border-[var(--color-danger)]/40 bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] p-3 text-sm text-[var(--color-danger)]">
            {error}
          </p>
        )}
        {notice && (
          <p className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-ink-dim)]">
            {notice}
          </p>
        )}

        {aiOpen && (
          <section className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="head flex items-center gap-2 text-lg">
              <Wand2 size={17} /> Write a first draft
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
              Writes to the house rules — no invented statistics or client results, no body H1, internal links only to
              pages that exist. It is a first draft: read it before you schedule it.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className={label}>Topic</span>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What a Toronto dentist should budget for Google Ads"
                  className={`mt-2 ${field}`}
                />
              </label>
              <label className="block">
                <span className={label}>Primary keyword</span>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="dental google ads cost toronto"
                  className={`mt-2 ${field}`}
                />
              </label>
              <label className="block md:col-span-2">
                <span className={label}>Direction (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Angle, must-cover points, who it is for, what to avoid."
                  className={`mt-2 resize-y ${field}`}
                />
              </label>
              <label className="block">
                <span className={label}>Length</span>
                <input
                  type="number"
                  min={600}
                  max={3000}
                  step={100}
                  value={words}
                  onChange={(e) => setWords(Number(e.target.value))}
                  className={`mt-2 ${field}`}
                />
              </label>
            </div>
            <button
              onClick={generate}
              disabled={busy !== null || !topic.trim()}
              className="mono mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-50"
            >
              {busy === "check" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Generate draft
            </button>
          </section>
        )}

        {problems && problems.length > 0 && (
          <section className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="head text-lg">
              {errors.length} error{errors.length === 1 ? "" : "s"} · {warnings.length} warning
              {warnings.length === 1 ? "" : "s"}
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle
                    size={14}
                    className={`mt-0.5 shrink-0 ${p.level === "error" ? "text-[var(--color-danger)]" : "text-[var(--color-ink-faint)]"}`}
                  />
                  <span className={p.level === "error" ? "text-[var(--color-ink)]" : "text-[var(--color-ink-dim)]"}>
                    {p.message}
                  </span>
                </li>
              ))}
            </ul>
            {errors.length > 0 && (
              <p className="mt-3 text-[13px] text-[var(--color-ink-dim)]">
                Errors block the commit. Warnings do not.
              </p>
            )}
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-4">
            <input
              value={fields.title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="Post title"
              className="head w-full bg-transparent text-3xl outline-none placeholder:text-[var(--color-ink-faint)]"
            />

            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-faint)]">
              <span className="mono">/blog/</span>
              <input
                value={fields.slug}
                onChange={(e) => {
                  set("slug", slugify(e.target.value));
                  setSlugDirty(true);
                }}
                placeholder="slug"
                className="mono flex-1 rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-[var(--color-ink)]"
              />
            </div>

            <div className="flex items-center gap-1 border-b border-[var(--color-border)]">
              <button
                onClick={() => setTab("write")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm ${tab === "write" ? "border-b-2 border-[var(--color-ink)] font-semibold" : "text-[var(--color-ink-dim)]"}`}
              >
                <Pencil size={14} /> Write
              </button>
              <button
                onClick={() => setTab("split")}
                className={`hidden items-center gap-1.5 px-3 py-2 text-sm lg:flex ${tab === "split" ? "border-b-2 border-[var(--color-ink)] font-semibold" : "text-[var(--color-ink-dim)]"}`}
              >
                <Columns2 size={14} /> Split
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm ${tab === "preview" ? "border-b-2 border-[var(--color-ink)] font-semibold" : "text-[var(--color-ink-dim)]"}`}
              >
                <Eye size={14} /> Preview
              </button>
              <span className="mono ml-auto px-3 py-2 text-[11px] text-[var(--color-ink-faint)]">
                {fields.content.trim().split(/\s+/).filter(Boolean).length.toLocaleString()} words
              </span>
            </div>

            <div className={tab === "split" ? "grid gap-3 lg:grid-cols-2" : ""}>
              {/* The textarea stays mounted so selection and undo survive tab switches. */}
              <div className={tab === "preview" ? "hidden" : ""}>
                <EditorToolbar
                  onAction={runAction}
                  content={fields.content}
                  getSelection={() => {
                    const ta = contentRef.current;
                    return ta ? ta.value.slice(ta.selectionStart, ta.selectionEnd) : "";
                  }}
                  linkSignal={linkSignal}
                />
                <textarea
                  ref={contentRef}
                  value={fields.content}
                  onChange={(e) => set("content", e.target.value)}
                  onKeyDown={onContentKeyDown}
                  placeholder="Write the post here. Start headings at ## — the H1 comes from the title above."
                  className="min-h-[520px] w-full resize-y rounded-b-xl border border-[var(--color-border)] bg-white p-4 font-mono text-sm leading-relaxed outline-none focus:border-[var(--color-ink)]"
                />
              </div>

              {tab !== "write" && (
                <article className="prose-blog min-h-[520px] overflow-auto rounded-xl border border-[var(--color-border)] bg-white p-6">
                  {fields.content.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug]}>
                      {fields.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-[var(--color-ink-faint)]">Nothing to preview yet.</p>
                  )}
                </article>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <span className={`${label} flex items-center gap-1.5`}>
                <CalendarClock size={13} /> Schedule
              </span>
              <p className="mt-2 text-sm text-[var(--color-ink-dim)]">
                {fields.draft
                  ? "Held as a draft — it will not publish on any date."
                  : status === "scheduled"
                    ? "Committed now, appears on its own at the time below."
                    : "Goes live as soon as the site rebuilds."}
              </p>
              <input
                type="datetime-local"
                value={isoToLocalInput(fields.publishAt)}
                onChange={(e) => onSchedule(e.target.value)}
                className={`mt-3 ${field}`}
              />
              <div className="mt-2.5 flex flex-wrap gap-2">
                {presets().map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onSchedule(isoToLocalInput(preset.value.toISOString()))}
                    className="mono rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[11px] text-[var(--color-ink-dim)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  onClick={() => setFields((f) => ({ ...f, publishAt: "" }))}
                  className="mono rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[11px] text-[var(--color-ink-dim)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                >
                  Immediately
                </button>
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink-dim)]">
                <input
                  type="checkbox"
                  checked={fields.draft}
                  onChange={(e) => set("draft", e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-ink)]"
                />
                Hold as a draft
              </label>
              <label className="mt-3 block">
                <span className={label}>Listing date</span>
                <input type="date" value={fields.date} onChange={(e) => set("date", e.target.value)} className={`mt-2 ${field}`} />
              </label>
            </div>

            <div>
              <span className={label}>SEO title</span>
              {/* Separate from the headline: the on-page H1 can stay long and
                  specific while the <title> tag stays under ~60 characters. */}
              <input
                value={fields.seoTitle}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder="Optional — defaults to the post title"
                className={`mt-2 ${field}`}
              />
              <span className="mt-1.5 block text-[11px] text-[var(--color-ink-faint)]">
                {(fields.seoTitle || fields.title).length} chars · aim for under 60
              </span>
            </div>

            <div>
              <span className={label}>Description</span>
              <textarea
                value={fields.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="Meta description for search results and cards"
                className={`mt-2 resize-y ${field}`}
              />
              <span className="mt-1.5 block text-[11px] text-[var(--color-ink-faint)]">
                {fields.description.length} chars · 50–160
              </span>
            </div>

            <div>
              <span className={label}>Category</span>
              <input
                value={fields.category}
                onChange={(e) => set("category", e.target.value)}
                list="blog-categories"
                className={`mt-2 ${field}`}
              />
              <datalist id="blog-categories">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <span className={label}>Author</span>
              <input value={fields.author} onChange={(e) => set("author", e.target.value)} className={`mt-2 ${field}`} />
            </div>

            <div>
              <span className={label}>Cover image</span>
              <input
                value={fields.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="/blog/something.jpg"
                className={`mt-2 ${field}`}
              />
              <span className="mt-1.5 block text-[11px] text-[var(--color-ink-faint)]">
                A path inside public/ — an image that does not exist there renders as a broken card.
              </span>
            </div>

            {!isNew && (
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="block text-center text-sm text-[var(--color-ink-dim)] underline underline-offset-4 hover:text-[var(--color-ink)]"
              >
                View live post →
              </Link>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
