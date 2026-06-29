"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ImagePlus, Eye, Pencil, Loader2 } from "lucide-react";
import { slugify } from "@/lib/slug";
import type { DbPost } from "@/lib/supabase";

export function PostEditor({ post }: { post?: DbPost }) {
  const router = useRouter();
  const isNew = !post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugDirty, setSlugDirty] = useState(!isNew);
  const [description, setDescription] = useState(post?.description ?? "");
  const [category, setCategory] = useState(post?.category ?? "Marketing");
  const [author, setAuthor] = useState(post?.author ?? "PPC Guru");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [published, setPublished] = useState(post?.published ?? false);

  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "inline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  function onTitle(v: string) {
    setTitle(v);
    if (!slugDirty) setSlug(slugify(v));
  }

  async function upload(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || "Upload failed.");
      return null;
    }
    return j.url as string;
  }

  async function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("cover");
    setError(null);
    const url = await upload(file);
    if (url) setCoverImage(url);
    setUploading(null);
    e.target.value = "";
  }

  async function onInlineImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("inline");
    setError(null);
    const url = await upload(file);
    if (url) {
      const ta = contentRef.current;
      const md = `\n\n![${file.name.replace(/\.[^.]+$/, "")}](${url})\n\n`;
      if (ta) {
        const start = ta.selectionStart;
        setContent((c) => c.slice(0, start) + md + c.slice(start));
      } else {
        setContent((c) => c + md);
      }
    }
    setUploading(null);
    e.target.value = "";
  }

  async function save() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy(true);
    setError(null);
    const payload = { title, slug, description, category, author, content, cover_image: coverImage, published };
    const res = await fetch(isNew ? "/api/admin/posts" : `/api/admin/posts/${post!.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(j.error || "Could not save the post.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const field = "w-full rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]";
  const label = "mono text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-faint)]";

  return (
    <main className="min-h-screen bg-[var(--color-base)]">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3.5">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
            <ArrowLeft size={15} /> Posts
          </Link>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink-dim)]">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[var(--color-ink)]" />
              Published
            </label>
            <button onClick={save} disabled={busy} className="mono inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)] disabled:opacity-50">
              {busy && <Loader2 size={14} className="animate-spin" />}
              {isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {error && <p className="mb-5 rounded-xl border border-[var(--color-danger)]/40 bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] p-3 text-sm text-[var(--color-danger)]">{error}</p>}

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main column */}
          <div className="space-y-4">
            <input value={title} onChange={(e) => onTitle(e.target.value)} placeholder="Post title" className="head w-full bg-transparent text-3xl outline-none placeholder:text-[var(--color-ink-faint)]" />

            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-faint)]">
              <span className="mono">/blog/</span>
              <input value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugDirty(true); }} placeholder="slug" className="mono flex-1 rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-[var(--color-ink)]" />
            </div>

            <div className="flex items-center gap-1 border-b border-[var(--color-border)]">
              <button onClick={() => setTab("write")} className={`flex items-center gap-1.5 px-3 py-2 text-sm ${tab === "write" ? "border-b-2 border-[var(--color-ink)] font-semibold" : "text-[var(--color-ink-dim)]"}`}><Pencil size={14} /> Write</button>
              <button onClick={() => setTab("preview")} className={`flex items-center gap-1.5 px-3 py-2 text-sm ${tab === "preview" ? "border-b-2 border-[var(--color-ink)] font-semibold" : "text-[var(--color-ink-dim)]"}`}><Eye size={14} /> Preview</button>
              <label className="ml-auto flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
                {uploading === "inline" ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Insert image
                <input type="file" accept="image/*" onChange={onInlineImage} className="hidden" />
              </label>
            </div>

            {tab === "write" ? (
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post in Markdown…"
                className="min-h-[460px] w-full resize-y rounded-xl border border-[var(--color-border)] bg-white p-4 font-mono text-sm leading-relaxed outline-none focus:border-[var(--color-ink)]"
              />
            ) : (
              <article className="prose-blog min-h-[460px] rounded-xl border border-[var(--color-border)] bg-white p-6">
                {content.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className="text-[var(--color-ink-faint)]">Nothing to preview yet.</p>}
              </article>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div>
              <span className={label}>Cover image</span>
              <div className="mt-2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImage} alt="Cover" className="aspect-video w-full object-cover" />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-xs text-[var(--color-ink-faint)]">No cover</div>
                )}
                <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] p-2">
                  <label className="flex cursor-pointer items-center gap-1.5 text-[13px] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
                    {uploading === "cover" ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />} Upload
                    <input type="file" accept="image/*" onChange={onCover} className="hidden" />
                  </label>
                  {coverImage && <button onClick={() => setCoverImage("")} className="text-[13px] text-[var(--color-danger)]">Remove</button>}
                </div>
              </div>
            </div>

            <div>
              <span className={label}>Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Short summary for cards & SEO" className={`mt-2 resize-y ${field}`} />
            </div>

            <div>
              <span className={label}>Category</span>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className={`mt-2 ${field}`} />
            </div>

            <div>
              <span className={label}>Author</span>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className={`mt-2 ${field}`} />
            </div>

            {!isNew && (
              <Link href={`/blog/${slug}`} target="_blank" className="block text-center text-sm text-[var(--color-ink-dim)] underline underline-offset-4 hover:text-[var(--color-ink)]">
                View live post →
              </Link>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
