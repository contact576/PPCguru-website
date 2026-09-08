import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { GitPostFile } from "@/lib/blog-git";

/**
 * The deployed copy of content/blog, read straight off disk.
 *
 * The admin Blog tab writes through GitHub (lib/blog-git.ts) because a write to
 * this filesystem would be erased by the next deploy. But READING has no such
 * constraint, and tying the list to the same token meant that without
 * BLOG_GITHUB_TOKEN the tab showed a bare "GitHub is not connected" error — no
 * posts at all, including the ~35 published ones the site was serving from
 * these very files. So the list falls back here: you can always SEE the blog,
 * and only editing needs the token.
 *
 * Drafts and scheduled posts are included on purpose. lib/blog.ts hides them
 * from the public site; the admin queue is the one view that must not.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Same shape as a GitHub-sourced post, minus the blob sha (no sha ⇒ not editable). */
export type LocalPostFile = Omit<GitPostFile, "sha"> & { sha: "" };

function read(file: string): LocalPostFile {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    file,
    slug: file.replace(/\.mdx?$/, ""),
    sha: "",
    data: data as Record<string, unknown>,
    content,
  };
}

export function localPostsAvailable(): boolean {
  return fs.existsSync(BLOG_DIR);
}

export function listLocalPosts(): LocalPostFile[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(read)
    .sort((a, b) => String(b.data.date ?? "").localeCompare(String(a.data.date ?? "")));
}

export function readLocalPost(slug: string): LocalPostFile | null {
  for (const ext of [".md", ".mdx"]) {
    const file = `${slug}${ext}`;
    if (fs.existsSync(path.join(BLOG_DIR, file))) return read(file);
  }
  return null;
}
