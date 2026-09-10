import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { isLandingLeadStatus, updateLandingLeadStatus, LANDING_LEAD_STATUSES } from "@/lib/landing-leads";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/landing-leads  { id, status }
 * Moves a /100-leads submission through the follow-up pipeline from the
 * /admin/landing-leads panel. Admin-session gated like every other admin route.
 */
export async function PATCH(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let body: { id?: unknown; status?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  if (!isLandingLeadStatus(body.status)) {
    return NextResponse.json({ ok: false, error: `status must be one of ${LANDING_LEAD_STATUSES.join(", ")}` }, { status: 400 });
  }

  const ok = await updateLandingLeadStatus(id, body.status);
  if (!ok) return NextResponse.json({ ok: false, error: "Update failed — has supabase/landing-leads.sql been run?" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
