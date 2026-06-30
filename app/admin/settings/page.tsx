import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { hasSupabase } from "@/lib/supabase";
import { getSettings } from "@/lib/settings";
import { getIntegrationStatus } from "@/lib/system-status";
import { AdminSettings } from "@/components/admin/admin-settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "CMS settings", robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  const settings = await getSettings();
  return <AdminSettings settings={settings} status={getIntegrationStatus()} dbConfigured={hasSupabase()} />;
}
