import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getPeople } from "@/lib/people";
import { AdminShell } from "@/components/admin/admin-shell";
import { PeopleView } from "@/components/admin/people-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "People", robots: { index: false, follow: false } };

export default async function AdminPeoplePage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const people = await getPeople();
  return (
    <AdminShell>
      <PeopleView people={people} />
    </AdminShell>
  );
}
