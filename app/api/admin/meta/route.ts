import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { hasSupabase } from "@/lib/supabase";
import { listPageMeta, savePageMeta, deletePageMeta, normPath } from "@/lib/page-meta";

export const runtime = "nodejs";

/** GET /api/admin/meta — every page override (for the editor). */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ overrides: await listPageMeta() });
}

/** POST /api/admin/meta — upsert one page's override. */
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "Couldn't save — Supabase isn't configured. Add the keys and run supabase/page-meta.sql." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const path = normPath(String(body.path ?? ""));
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ error: "A valid page path (e.g. /services/google-ads) is required." }, { status: 400 });
  }

  const saved = await savePageMeta({
    path,
    title: body.title as string | undefined,
    description: body.description as string | undefined,
    keywords: body.keywords as string | undefined,
    noindex: Boolean(body.noindex),
  });
  if (!saved) return NextResponse.json({ error: "Couldn't save the override." }, { status: 500 });

  // Push the change live: re-render the edited route so its metadata refreshes.
  try { revalidatePath(path); } catch {}
  return NextResponse.json({ override: saved });
}

/** DELETE /api/admin/meta?path=/services/google-ads — clear one override. */
export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const path = normPath(new URL(req.url).searchParams.get("path") ?? "");
  if (!path) return NextResponse.json({ error: "Missing path." }, { status: 400 });
  const ok = await deletePageMeta(path);
  if (!ok) return NextResponse.json({ error: "Couldn't remove the override." }, { status: 500 });
  try { revalidatePath(path); } catch {}
  return NextResponse.json({ ok: true });
}
