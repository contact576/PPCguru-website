import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { probeEmailHealth, sendTestNotification, leadRecipients, fromAddress } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * GET  /api/admin/email-health → live check of both delivery channels
 *      (SMTP connect + auth; Resend key presence) so the Settings page can
 *      explain a silent inbox instead of showing "Connected".
 * POST /api/admin/email-health → sends ONE real test notification to the team
 *      list and reports which channel (if any) accepted it.
 * Admin-session gated like every other admin route.
 */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const channels = await probeEmailHealth();
  return NextResponse.json({ ok: true, channels, recipients: leadRecipients(), from: fromAddress() });
}

export async function POST() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const result = await sendTestNotification();
  return NextResponse.json({ ok: result.ok, detail: result.detail, recipients: leadRecipients() });
}
