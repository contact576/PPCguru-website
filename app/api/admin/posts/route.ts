import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

function noDb() {
  return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
}

/** GET /api/admin/posts — list ALL posts (drafts included) for the dashboard. */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = supabaseAdmin();
  if (!sb) return noDb();
  const { data, error } = await sb
    .from("posts")
    .select("id,slug,title,description,category,author,published,published_at,updated_at,cover_image")
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [] });
}

/** POST /api/admin/posts — create a post. */
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = supabaseAdmin();
  if (!sb) return noDb();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const slug = slugify(String(body.slug ?? "") || title);
  if (!slug) return NextResponse.json({ error: "Could not derive a slug from the title." }, { status: 400 });
  const published = Boolean(body.published);

  const { data, error } = await sb
    .from("posts")
    .insert({
      slug,
      title,
      description: String(body.description ?? ""),
      category: String(body.category ?? "Marketing"),
      author: String(body.author ?? "PPC Guru"),
      content: String(body.content ?? ""),
      cover_image: body.cover_image ? String(body.cover_image) : null,
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    const msg = error.code === "23505" ? "A post with that slug already exists." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return NextResponse.json({ post: data });
}
