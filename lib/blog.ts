import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { supabaseAdmin, type DbPost } from "@/lib/supabase";

/**
 * Blog source of truth: the markdown files in content/blog/*, reviewed and
 * merged through Git. The Supabase `posts` table is kept as a read-only legacy
 * source so nothing published through the old /admin CMS can vanish, but
 * MARKDOWN WINS on slug collisions — a committed file always beats a database
 * row describing the same post.
 *
 * This precedence is load-bearing: it is what lets an approved pull request
 * actually change a page. Reversing it would silently shadow every file with a
 * stale database row, which is exactly the bug it replaced.
 *
 * All public helpers are async and only ever return PUBLISHED posts.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  seoTitle?: string | null;
  description: string;
  date: string;
  publishAt?: string | null;
  category: string;
  author: string;
  readingTime: string;
  coverImage?: string | null;
};

export type Post = PostMeta & { content: string };

function readingTimeFor(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/* ── markdown (fallback) ─────────────────────────────────────────────────── */
function fileToPost(file: string): Post & { draft: boolean } {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");
  return {
    slug,
    title: data.title ?? slug,
    seoTitle: data.seoTitle ?? null,
    description: data.description ?? "",
    date: data.date ?? "2026-01-01",
    publishAt: data.publishAt ?? null,
    category: data.category ?? "Marketing",
    author: data.author ?? "PPC Guru",
    readingTime: readingTimeFor(content),
    coverImage: data.coverImage ?? null,
    draft: data.draft === true,
    content,
  };
}

function markdownPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map(fileToPost)
    // `draft: true` holds a post back regardless of its dates — it is what the
    // /admin/blog editor writes for a post that is drafted but not yet worth
    // scheduling. Stripped here so `draft` never reaches a public helper.
    .filter((post) => !post.draft)
    .map(({ draft: _draft, ...post }) => post);
}

/* ── supabase ────────────────────────────────────────────────────────────── */
function dbToPost(p: DbPost): Post {
  return {
    slug: p.slug,
    title: p.title,
    // `?? null` also covers a database that predates the seo_title column:
    // select("*") simply omits the key, which reads back as undefined.
    seoTitle: p.seo_title ?? null,
    description: p.description ?? "",
    date: (p.published_at ?? p.created_at).slice(0, 10),
    publishAt: p.published_at ?? p.created_at,
    category: p.category ?? "Marketing",
    author: p.author ?? "PPC Guru",
    readingTime: readingTimeFor(p.content ?? ""),
    coverImage: p.cover_image,
    content: p.content ?? "",
  };
}

async function dbPosts(): Promise<Post[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return (data as DbPost[]).map(dbToPost);
}

/* ── merge + public API ──────────────────────────────────────────────────── */
function isAvailableNow(post: Post): boolean {
  const scheduledAt = post.publishAt ?? `${post.date}T00:00:00Z`;
  const timestamp = Date.parse(scheduledAt);
  // Preserve existing behaviour for malformed legacy dates; editorial QA should
  // still prevent new posts with invalid dates from reaching this layer.
  return Number.isNaN(timestamp) || timestamp <= Date.now();
}

async function allPosts(): Promise<Post[]> {
  const [db, md] = await Promise.all([dbPosts(), Promise.resolve(markdownPosts())]);
  const bySlug = new Map<string, Post>();
  // Legacy database rows first, then markdown overrides on slug collision.
  for (const p of db) bySlug.set(p.slug, p);
  for (const p of md) bySlug.set(p.slug, p);
  return [...bySlug.values()]
    .filter(isAvailableNow)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

const stripContent = ({ content: _c, ...meta }: Post): PostMeta => meta;

export async function getAllPosts(): Promise<PostMeta[]> {
  return (await allPosts()).map(stripContent);
}

export async function getPost(slug: string): Promise<Post | null> {
  return (await allPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  return (await allPosts()).map((p) => p.slug);
}
