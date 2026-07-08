import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { supabaseAdmin, hasSupabase, type DbPost } from "@/lib/supabase";
import { AdminDashboard, type AdminPostRow } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  let posts: AdminPostRow[] = [];
  const sb = supabaseAdmin();
  if (sb) {
    const { data } = await sb
      .from("posts")
      .select("id,slug,title,category,author,published,published_at,updated_at")
      .order("updated_at", { ascending: false });
    posts = (data as Pick<DbPost, "id" | "slug" | "title" | "category" | "author" | "published" | "published_at" | "updated_at">[] | null) ?? [];
  }

  return <AdminDashboard posts={posts} dbConfigured={hasSupabase()} />;
}
