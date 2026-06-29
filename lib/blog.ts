import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { supabaseAdmin, type DbPost } from "@/lib/supabase";

/**
 * Blog source of truth: Supabase `posts` table (managed via /admin), with the
 * bundled markdown files in content/blog/* as a fallback so the blog still works
 * with no database configured. Supabase posts win on slug collisions.
 *
 * All public helpers are async and only ever return PUBLISHED posts.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
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
function fileToPost(file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "2026-01-01",
    category: data.category ?? "Marketing",
    author: data.author ?? "PPC Guru",
    readingTime: readingTimeFor(content),
    coverImage: data.coverImage ?? null,
    content,
  };
}

function markdownPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map(fileToPost);
}

/* ── supabase ────────────────────────────────────────────────────────────── */
function dbToPost(p: DbPost): Post {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description ?? "",
    date: (p.published_at ?? p.created_at).slice(0, 10),
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
async function allPosts(): Promise<Post[]> {
  const [db, md] = await Promise.all([dbPosts(), Promise.resolve(markdownPosts())]);
  const bySlug = new Map<string, Post>();
  // markdown first, then DB overrides on slug collision
  for (const p of md) bySlug.set(p.slug, p);
  for (const p of db) bySlug.set(p.slug, p);
  return [...bySlug.values()].sort((a, b) => +new Date(b.date) - +new Date(a.date));
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
