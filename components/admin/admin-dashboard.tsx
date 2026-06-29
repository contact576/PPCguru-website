"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export type AdminPostRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  updated_at: string;
};

export function AdminDashboard({ posts, dbConfigured }: { posts: AdminPostRow[]; dbConfigured: boolean }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) router.refresh();
    else alert("Could not delete the post.");
  }

  return (
    <main className="min-h-screen bg-[var(--color-base)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo variant="dark" size={32} />
            <span className="text-sm text-[var(--color-ink-dim)]">· Blog admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blog" target="_blank" className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              <ExternalLink size={14} /> View blog
            </Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="head text-3xl">Posts</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">{posts.length} total</p>
          </div>
          <Link href="/admin/posts/new" className="mono inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--color-base)]">
            <Plus size={15} /> New post
          </Link>
        </div>

        {!dbConfigured && (
          <p className="mt-6 rounded-xl border border-[var(--color-warning)]/40 bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] p-4 text-sm text-[var(--color-ink)]">
            Supabase isn&apos;t configured. Set <code className="mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="mono">SUPABASE_SERVICE_ROLE_KEY</code>, then run <code className="mono">supabase/schema.sql</code>.
          </p>
        )}

        <div className="mt-6 overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)]">
          {posts.length === 0 ? (
            <div className="p-10 text-center text-sm text-[var(--color-ink-dim)]">
              No posts yet. Click <strong>New post</strong> to write your first one.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-ink-faint)]">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-5 py-3">
                      <Link href={`/admin/posts/${p.id}`} className="font-semibold hover:underline">{p.title}</Link>
                      <div className="mono text-[11px] text-[var(--color-ink-faint)]">/{p.slug}</div>
                    </td>
                    <td className="hidden px-5 py-3 text-[var(--color-ink-dim)] sm:table-cell">{p.category}</td>
                    <td className="px-5 py-3">
                      {p.published ? (
                        <span className="mono rounded-full bg-[#eef2dd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.05em] text-[#5f6f17]">Published</span>
                      ) : (
                        <span className="mono rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Draft</span>
                      )}
                    </td>
                    <td className="hidden px-5 py-3 text-[var(--color-ink-faint)] md:table-cell">
                      {new Date(p.updated_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/posts/${p.id}`} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)]"><Pencil size={15} /></Link>
                        <button onClick={() => remove(p.id, p.title)} disabled={busyId === p.id} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-danger)] hover:bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)] disabled:opacity-50"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
