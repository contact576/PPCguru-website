import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogManager } from "@/components/admin/blog-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog admin", robots: { index: false, follow: false } };

/**
 * The admin landing page is the blog queue: what is scheduled, what is drafted,
 * what is live. Posts are read from and written to content/blog on GitHub — the
 * legacy Supabase CMS list survives, read-only, at /admin/legacy.
 */
export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  return (
    <AdminShell>
      <BlogManager />
    </AdminShell>
  );
}
