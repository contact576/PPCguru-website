import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { supabaseAdmin, type DbPost } from "@/lib/supabase";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit post", robots: { index: false, follow: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { id } = await params;

  if (id === "new") return <PostEditor />;

  const sb = supabaseAdmin();
  if (!sb) redirect("/admin");
  const { data } = await sb.from("posts").select("*").eq("id", id).single();
  if (!data) notFound();
  return <PostEditor post={data as DbPost} />;
}
