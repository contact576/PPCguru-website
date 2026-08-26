/**
 * One-off migration: export every published Supabase post into content/blog/*.md
 * so Git becomes the source of truth for the blog.
 *
 * Run:  node --env-file=.env.local --experimental-strip-types scripts/export-posts-to-markdown.mts [--dry-run]
 *
 * Authority rules (deliberate — the database is what's currently LIVE, but Git
 * holds the editorial decisions the CMS has no column for):
 *   - body, description, date, category, author, coverImage  → database wins
 *   - title and seoTitle                                     → an existing
 *     markdown file wins, because the CMS has no seo_title column yet and the
 *     workaround was to stuff the short SEO title into `title`, which also
 *     shortens the on-page H1. Preserving the file keeps the long headline.
 *
 * Safe to re-run. Nothing is deleted; files are rewritten from the database.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const DRY = process.argv.includes("--dry-run");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

type Row = {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  author: string | null;
  content: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
};

const res = await fetch(
  `${url}/rest/v1/posts?published=eq.true&select=slug,title,description,category,author,content,cover_image,published_at,created_at&order=published_at.desc`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
);
if (!res.ok) {
  console.error("Supabase read failed:", res.status, (await res.text()).slice(0, 300));
  process.exit(1);
}
const rows = (await res.json()) as Row[];

fs.mkdirSync(BLOG_DIR, { recursive: true });

let written = 0;
let titleKept = 0;

for (const row of rows) {
  const file = path.join(BLOG_DIR, `${row.slug}.md`);
  const existed = fs.existsSync(file);

  // Preserve editorial titles already committed to Git (see authority rules).
  let title = row.title;
  let seoTitle: string | undefined;
  if (existed) {
    const prev = matter(fs.readFileSync(file, "utf8")).data as Record<string, unknown>;
    if (typeof prev.title === "string" && prev.title.trim() && prev.title !== row.title) {
      title = prev.title;
      // The DB title in this situation IS the short SEO variant.
      seoTitle = typeof prev.seoTitle === "string" && prev.seoTitle.trim() ? prev.seoTitle : row.title;
      titleKept++;
    } else if (typeof prev.seoTitle === "string" && prev.seoTitle.trim()) {
      seoTitle = prev.seoTitle;
    }
  }

  const publishedAt = row.published_at ?? row.created_at;
  const data: Record<string, string> = { title };
  if (seoTitle) data.seoTitle = seoTitle;
  data.description = row.description ?? "";
  data.date = publishedAt.slice(0, 10);
  data.publishAt = publishedAt;
  data.category = row.category ?? "Marketing";
  data.author = row.author ?? "PPC Guru";
  if (row.cover_image) data.coverImage = row.cover_image;

  // Normalise CRLF so the committed files are stable across machines.
  const body = row.content.replace(/\r\n/g, "\n").trim();
  const out = matter.stringify(`\n${body}\n`, data);

  if (!DRY) fs.writeFileSync(file, out, "utf8");
  written++;
  console.log(`${existed ? "update" : "create"}  ${row.slug}.md${seoTitle ? "  (seoTitle preserved)" : ""}`);
}

console.log(
  `\n${DRY ? "[dry run] would write" : "wrote"} ${written} post(s) to content/blog/` +
    (titleKept ? `\n${titleKept} editorial title(s) preserved from Git.` : ""),
);
