import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { hasSupabase } from "@/lib/supabase";
import { listPageMeta } from "@/lib/page-meta";
import { pageRegistry } from "@/lib/data/page-registry";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminMeta } from "@/components/admin/admin-meta";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "SEO / Meta", robots: { index: false, follow: false } };

export default async function AdminMetaPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  const overrides = await listPageMeta();
  return (
    <AdminShell>
      <AdminMeta groups={pageRegistry()} overrides={overrides} dbConfigured={hasSupabase()} />
    </AdminShell>
  );
}
