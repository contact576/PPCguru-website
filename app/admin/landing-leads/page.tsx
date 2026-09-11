import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getLandingLeads } from "@/lib/landing-leads";
import { AdminShell } from "@/components/admin/admin-shell";
import { LandingLeadsView } from "@/components/admin/landing-leads-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Landing page leads", robots: { index: false, follow: false } };

/**
 * /admin/landing-leads — every submission from the /100-leads and
 * /seo-visibility funnels with the
 * landing-specific answers (service area, business type, budget tier,
 * attribution) and a follow-up status. The same leads also appear in
 * /admin/leads (the canonical mirror) tagged `landing · 100-leads`.
 */
export default async function AdminLandingLeadsPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const { rows, fallback } = await getLandingLeads();
  return (
    <AdminShell>
      <LandingLeadsView rows={rows} fallback={fallback} />
    </AdminShell>
  );
}
