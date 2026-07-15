import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getVisitorEvents } from "@/lib/tracking";
import { AdminShell } from "@/components/admin/admin-shell";
import { VisitorsView } from "@/components/admin/visitors-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Visitors", robots: { index: false, follow: false } };

export default async function AdminVisitorsPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const rows = await getVisitorEvents();
  return (
    <AdminShell>
      <VisitorsView rows={rows} />
    </AdminShell>
  );
}
