import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed, adminConfigured } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");
  return <LoginForm configured={adminConfigured()} />;
}
