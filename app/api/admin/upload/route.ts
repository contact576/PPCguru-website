import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { supabaseAdmin, BLOG_BUCKET } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

/** POST multipart/form-data with `file` → uploads to Supabase Storage, returns public URL. */
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = supabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image is larger than 8 MB." }, { status: 400 });

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  // Date.now is unavailable in workflow scripts, but this is a normal server route.
  const key = `${base}-${Date.now().toString(36)}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await sb.storage.from(BLOG_BUCKET).upload(key, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from(BLOG_BUCKET).getPublicUrl(key);
  return NextResponse.json({ url: data.publicUrl });
}
