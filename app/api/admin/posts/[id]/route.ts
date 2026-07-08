import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

function noDb() {
  return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
}

type Ctx = { params: Promise<{ id: string }> };

/** GET one post (full content) for the editor. */
export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = supabaseAdmin();
  if (!sb) return noDb();
  const { id } = await params;
  const { data, error } = await sb.from("posts").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post: data });
}

/** PUT — update a post. */
export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = supabaseAdmin();
  if (!sb) return noDb();
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const slug = slugify(String(body.slug ?? "") || title);
  const published = Boolean(body.published);

  // Read current row so publishing for the first time stamps published_at once.
  const { data: existing } = await sb.from("posts").select("published, published_at, slug").eq("id", id).single();
  const publishedAt =
    published && existing && !existing.published_at ? new Date().toISOString() : existing?.published_at ?? null;

  const { data, error } = await sb
    .from("posts")
    .update({
      slug,
      title,
      description: String(body.description ?? ""),
      category: String(body.category ?? "Marketing"),
      author: String(body.author ?? "PPC Guru"),
      content: String(body.content ?? ""),
      cover_image: body.cover_image ? String(body.cover_image) : null,
      published,
      published_at: published ? publishedAt : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const msg = error.code === "23505" ? "A post with that slug already exists." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (existing?.slug && existing.slug !== slug) revalidatePath(`/blog/${existing.slug}`);
  return NextResponse.json({ post: data });
}

/** DELETE — remove a post. */
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = supabaseAdmin();
  if (!sb) return noDb();
  const { id } = await params;

  const { data: existing } = await sb.from("posts").select("slug").eq("id", id).single();
  const { error } = await sb.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidatePath("/blog");
  if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
