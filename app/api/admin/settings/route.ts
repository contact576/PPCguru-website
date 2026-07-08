import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { getSettings, saveSettings, type CmsSettings } from "@/lib/settings";

export const runtime = "nodejs";

/** GET /api/admin/settings — current CMS settings. */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: await getSettings() });
}

/** POST /api/admin/settings — persist settings (requires Supabase). */
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Partial<CmsSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const saved = await saveSettings(body);
  if (!saved) {
    return NextResponse.json(
      { error: "Couldn't save — Supabase isn't configured. Add the keys and run supabase/schema.sql." },
      { status: 503 },
    );
  }

  // The blog index reads blogTitle/blogDescription at build/ISR time.
  revalidatePath("/blog");
  return NextResponse.json({ settings: saved });
}
