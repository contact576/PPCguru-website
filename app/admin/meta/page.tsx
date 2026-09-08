import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { hasSupabase } from "@/lib/supabase";
import { listPageMeta } from "@/lib/page-meta";
import { pageRegistry } from "@/lib/data/page-registry";
import { getAllPosts } from "@/lib/blog";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminMeta } from "@/components/admin/admin-meta";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "SEO / Meta", robots: { index: false, follow: false } };

export default async function AdminMetaPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  // Blog posts are content, not code, so the registry can't derive them — they
  // are read here and passed in so every published post is editable too.
  const [overrides, posts] = await Promise.all([listPageMeta(), getAllPosts()]);
  const groups = pageRegistry(posts.map((p) => ({ slug: p.slug, title: p.title })));

  return (
    <AdminShell>
      <AdminMeta groups={groups} overrides={overrides} dbConfigured={hasSupabase()} />
    </AdminShell>
  );
}
