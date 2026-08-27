/**
 * Editorial gate for content/blog/*.md — the only way a post reaches the site
 * now that Git is the blog's source of truth (see lib/blog.ts).
 *
 * Posts arrive as pull requests opened by a scheduling agent, so review means a
 * human reading prose, and prose review is bad at catching structural faults: a
 * table-of-contents anchor that silently scrolls nowhere, a note written to the
 * reviewer that stays in the body, an internal link to a route that does not
 * exist. All three shipped in the same draft. This catches that class.
 *
 * Run:  npm run blog:check            (all posts)
 *       npm run blog:check -- <slug>  (one post)
 *
 * Errors fail the run. Warnings are advisory and do not.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const APP_DIR = path.join(process.cwd(), "app");

/**
 * Phrases that mean the draft is talking to its reviewer rather than to a
 * reader. Matched against the rendered body, code fences excluded.
 */
const REVIEWER_NOTE_PATTERNS: { pattern: RegExp; why: string }[] = [
  { pattern: /staging package/i, why: "a reference to the draft's own staging bundle" },
  { pattern: /owner approval (is |are )?(still )?required/i, why: "an approval note" },
  { pattern: /before the live article/i, why: "a note about the article's own publication" },
  { pattern: /\bTODO\b|\bTBD\b|\bFIXME\b/, why: "an unfinished marker" },
  { pattern: /\[insert [^\]]*\]|\[placeholder|\bXX%|\bNN%/i, why: "an unfilled placeholder" },
  { pattern: /lorem ipsum/i, why: "filler text" },
  { pattern: /as an ai (language )?model/i, why: "model boilerplate" },
  { pattern: /pending (client |owner )?(sign-?off|review)/i, why: "a review note" },
];

const REQUIRED_FRONTMATTER = ["title", "description", "date", "category", "author"] as const;

type Problem = { file: string; level: "error" | "warn"; message: string };
const problems: Problem[] = [];
const fail = (file: string, message: string) => problems.push({ file, level: "error", message });
const warn = (file: string, message: string) => problems.push({ file, level: "warn", message });

/* ── route table ─────────────────────────────────────────────────────────── */
/**
 * Every routable path, read off the App Router tree. Dynamic segments stay as
 * `[param]` and match positionally, so /services/seo resolves through
 * /services/[slug] without this script needing the service catalogue. Blog
 * links are the exception — they are checked against real files below, because
 * a wrong blog slug is the mistake a blog PR actually makes.
 */
function routePatterns(): string[][] {
  const out: string[][] = [];
  const walk = (dir: string, segments: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      // Route groups `(marketing)` and private folders `_lib` are not path segments.
      const next = name.startsWith("(") || name.startsWith("_") ? segments : [...segments, name];
      const child = path.join(dir, name);
      if (fs.existsSync(path.join(child, "page.tsx")) || fs.existsSync(path.join(child, "page.ts"))) {
        out.push(next);
      }
      walk(child, next);
    }
  };
  walk(APP_DIR, []);
  return out;
}

const ROUTES = routePatterns();

function routeExists(segments: string[]): boolean {
  return ROUTES.some(
    (route) =>
      route.length === segments.length &&
      route.every((part, i) => part.startsWith("[") || part === segments[i]),
  );
}

/* ── markdown helpers ────────────────────────────────────────────────────── */
/**
 * Approximates the text rehype-slug sees: a heading is rendered before its id
 * is generated, so inline syntax is already gone by then. Wrong in either
 * direction this produces a false report, so it stays deliberately small.
 */
function headingText(raw: string): string {
  return raw
    .replace(/^#+\s*/, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

function headingSlugs(body: string): Set<string> {
  const slugger = new GithubSlugger();
  const slugs = new Set<string>();
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    if (/^#{1,6}\s/.test(line)) slugs.add(slugger.slug(headingText(line)));
  }
  return slugs;
}

/** Strips fenced code so link and phrase checks do not read examples as prose. */
function withoutCodeFences(body: string): string {
  return body.replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1.*$/gm, "");
}

/* ── per-file checks ─────────────────────────────────────────────────────── */
function checkFile(file: string, knownSlugs: Set<string>) {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const prose = withoutCodeFences(content);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.mdx?$/.test(file)) {
    fail(file, "filename must be lowercase-kebab-case — it becomes the URL slug");
  }

  for (const key of REQUIRED_FRONTMATTER) {
    const value = data[key];
    if (typeof value !== "string" || !value.trim()) fail(file, `frontmatter \`${key}\` is missing or empty`);
  }

  // Dates decide whether a post is visible at all (isAvailableNow in lib/blog.ts),
  // so an unparseable one hides the post silently rather than erroring.
  const date = typeof data.date === "string" ? data.date : "";
  if (date && Number.isNaN(Date.parse(date))) fail(file, `\`date: ${date}\` is not a parseable date`);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) warn(file, `\`date: ${date}\` should be YYYY-MM-DD`);

  if (data.publishAt != null) {
    const publishAt = String(data.publishAt);
    if (Number.isNaN(Date.parse(publishAt))) {
      fail(file, `\`publishAt: ${publishAt}\` is not parseable — the post would publish immediately`);
    } else if (date && publishAt.slice(0, 10) !== date) {
      warn(
        file,
        `\`publishAt\` (${publishAt.slice(0, 10)}) and \`date\` (${date}) disagree — the listing sorts on \`date\``,
      );
    }
  }

  const description = typeof data.description === "string" ? data.description : "";
  if (description.length > 160) warn(file, `description is ${description.length} chars — results truncate around 160`);
  if (description && description.length < 50) warn(file, `description is only ${description.length} chars`);

  const metaTitle =
    (typeof data.seoTitle === "string" && data.seoTitle) || (typeof data.title === "string" ? data.title : "");
  if (metaTitle.length > 60) {
    warn(file, `the title used for <title> is ${metaTitle.length} chars — add a shorter \`seoTitle\` (~60)`);
  }

  // The page renders the frontmatter title as the H1, so a body H1 duplicates it.
  if (/^#\s/m.test(prose)) fail(file, "body contains an H1 — the H1 is rendered from frontmatter `title`");

  for (const { pattern, why } of REVIEWER_NOTE_PATTERNS) {
    const hit = prose.match(pattern);
    if (hit) fail(file, `reader-facing text contains ${why}: "${hit[0]}"`);
  }

  const slugs = headingSlugs(content);
  for (const [, anchor] of prose.matchAll(/\]\(#([^)]+)\)/g)) {
    if (!slugs.has(anchor)) fail(file, `anchor #${anchor} matches no heading in this post`);
  }

  for (const [, href] of prose.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const pathname = href.split(/[#?]/)[0];
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "blog" && segments.length === 2) {
      if (segments[1] === slug) warn(file, `links to itself (${pathname})`);
      else if (!knownSlugs.has(segments[1])) fail(file, `links to /blog/${segments[1]}, which is not a post in content/blog`);
      continue;
    }
    // Files under public/ are served from the root and are not App Router routes.
    if (path.extname(pathname)) {
      if (!fs.existsSync(path.join(process.cwd(), "public", pathname))) {
        fail(file, `links to ${pathname}, which is not a file in public/`);
      }
      continue;
    }
    if (!routeExists(segments)) fail(file, `links to ${pathname}, which matches no route`);
  }
}

/* ── run ─────────────────────────────────────────────────────────────────── */
const files = fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f)).sort();
const knownSlugs = new Set(files.map((f) => f.replace(/\.mdx?$/, "")));

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = only.length
  ? files.filter((f) => only.some((o) => f.replace(/\.mdx?$/, "") === o.replace(/\.mdx?$/, "")))
  : files;

if (only.length && !targets.length) {
  console.error(`No post matches: ${only.join(", ")}`);
  process.exit(1);
}

for (const file of targets) checkFile(file, knownSlugs);

const errors = problems.filter((p) => p.level === "error");
const warnings = problems.filter((p) => p.level === "warn");

for (const { file, level, message } of problems) {
  console.log(`${level === "error" ? "ERROR" : " warn"}  ${file}: ${message}`);
}

console.log(
  `\n${targets.length} post${targets.length === 1 ? "" : "s"} checked — ${errors.length} error${
    errors.length === 1 ? "" : "s"
  }, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}.`,
);

process.exit(errors.length ? 1 : 0);
