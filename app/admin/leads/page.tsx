import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getLeads } from "@/lib/leads";
import { AdminShell } from "@/components/admin/admin-shell";
import { LeadsView } from "@/components/admin/leads-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads", robots: { index: false, follow: false } };

export default async function AdminLeadsPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const rows = await getLeads();
  return (
    <AdminShell>
      <LeadsView rows={rows} />
    </AdminShell>
  );
}
