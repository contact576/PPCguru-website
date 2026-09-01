import GithubSlugger from "github-slugger";

/**
 * The editorial rules for content/blog/*.md, in one place.
 *
 * Two callers enforce them and must never drift apart: `npm run blog:check`
 * (scripts/check-blog.mts, the gate before a commit) and the /admin/blog editor
 * (which refuses to commit a post with errors). When the rules lived only in the
 * script, the editor could happily publish a post the gate would have rejected —
 * and the gate runs after the commit is already on master.
 *
 * Pure by design: no `fs`, no `@/` path alias. The script imports it relatively
 * under `node --experimental-strip-types`, which resolves neither.
 * Filesystem-dependent checks (does this route exist, does this public/ file
 * exist) arrive as optional callbacks — omitted, they are skipped rather than
 * guessed at, because a standalone Next build has no `app/` tree to read.
 */

export type LintProblem = { level: "error" | "warn"; message: string };

export type LintInput = {
  /** File name including extension, e.g. `local-seo-checklist-gta.md`. */
  file: string;
  /** Frontmatter, already parsed by gray-matter. */
  data: Record<string, unknown>;
  /** Markdown body with the frontmatter removed. */
  content: string;
  /** Every slug in content/blog — used to validate /blog/... links. */
  knownSlugs: Set<string>;
  /** True when the App Router has a page for these path segments. */
  routeExists?: (segments: string[]) => boolean;
  /** True when `public/<pathname>` exists. */
  publicFileExists?: (pathname: string) => boolean;
};

export const REQUIRED_FRONTMATTER = ["title", "description", "date", "category", "author"] as const;

/**
 * Phrases that mean the draft is talking to its reviewer rather than to a
 * reader. Matched against the rendered body, code fences excluded.
 */
export const REVIEWER_NOTE_PATTERNS: { pattern: RegExp; why: string }[] = [
  { pattern: /staging package/i, why: "a reference to the draft's own staging bundle" },
  { pattern: /owner approval (is |are )?(still )?required/i, why: "an approval note" },
  { pattern: /before the live article/i, why: "a note about the article's own publication" },
  { pattern: /\bTODO\b|\bTBD\b|\bFIXME\b/, why: "an unfinished marker" },
  { pattern: /\[insert [^\]]*\]|\[placeholder|\bXX%|\bNN%/i, why: "an unfilled placeholder" },
  { pattern: /lorem ipsum/i, why: "filler text" },
  { pattern: /as an ai (language )?model/i, why: "model boilerplate" },
  { pattern: /pending (client |owner )?(sign-?off|review)/i, why: "a review note" },
];

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

export function headingSlugs(body: string): Set<string> {
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
export function withoutCodeFences(body: string): string {
  return body.replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1.*$/gm, "");
}

/** Extension-less file name — the URL slug. */
export function slugOf(file: string): string {
  return file.replace(/\.mdx?$/, "");
}

export function lintPost(input: LintInput): LintProblem[] {
  const { file, data, content, knownSlugs, routeExists, publicFileExists } = input;
  const slug = slugOf(file);
  const prose = withoutCodeFences(content);
  const problems: LintProblem[] = [];
  const fail = (message: string) => problems.push({ level: "error", message });
  const warn = (message: string) => problems.push({ level: "warn", message });

  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.mdx?$/.test(file)) {
    fail("filename must be lowercase-kebab-case — it becomes the URL slug");
  }

  for (const key of REQUIRED_FRONTMATTER) {
    const value = data[key];
    if (typeof value !== "string" || !value.trim()) fail(`frontmatter \`${key}\` is missing or empty`);
  }

  // Dates decide whether a post is visible at all (isAvailableNow in lib/blog.ts),
  // so an unparseable one hides the post silently rather than erroring.
  const date = typeof data.date === "string" ? data.date : "";
  if (date && Number.isNaN(Date.parse(date))) fail(`\`date: ${date}\` is not a parseable date`);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) warn(`\`date: ${date}\` should be YYYY-MM-DD`);

  if (data.publishAt != null) {
    const publishAt = String(data.publishAt);
    if (Number.isNaN(Date.parse(publishAt))) {
      fail(`\`publishAt: ${publishAt}\` is not parseable — the post would publish immediately`);
    } else if (date && publishAt.slice(0, 10) !== date) {
      warn(`\`publishAt\` (${publishAt.slice(0, 10)}) and \`date\` (${date}) disagree — the listing sorts on \`date\``);
    }
  }

  // `draft: true` holds a post back regardless of its dates (lib/blog.ts). Only
  // a real boolean counts, so `draft: "false"` cannot silently hide a post.
  if (data.draft != null && typeof data.draft !== "boolean") {
    fail(`\`draft: ${String(data.draft)}\` must be true or false`);
  }

  const description = typeof data.description === "string" ? data.description : "";
  if (description.length > 160) warn(`description is ${description.length} chars — results truncate around 160`);
  if (description && description.length < 50) warn(`description is only ${description.length} chars`);

  const metaTitle =
    (typeof data.seoTitle === "string" && data.seoTitle) || (typeof data.title === "string" ? data.title : "");
  if (metaTitle.length > 60) {
    warn(`the title used for <title> is ${metaTitle.length} chars — add a shorter \`seoTitle\` (~60)`);
  }

  // The page renders the frontmatter title as the H1, so a body H1 duplicates it.
  if (/^#\s/m.test(prose)) fail("body contains an H1 — the H1 is rendered from frontmatter `title`");

  for (const { pattern, why } of REVIEWER_NOTE_PATTERNS) {
    const hit = prose.match(pattern);
    if (hit) fail(`reader-facing text contains ${why}: "${hit[0]}"`);
  }

  const slugs = headingSlugs(content);
  for (const [, anchor] of prose.matchAll(/\]\(#([^)]+)\)/g)) {
    if (!slugs.has(anchor)) fail(`anchor #${anchor} matches no heading in this post`);
  }

  for (const [, href] of prose.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const pathname = href.split(/[#?]/)[0];
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "blog" && segments.length === 2) {
      if (segments[1] === slug) warn(`links to itself (${pathname})`);
      else if (!knownSlugs.has(segments[1])) fail(`links to /blog/${segments[1]}, which is not a post in content/blog`);
      continue;
    }
    // Files under public/ are served from the root and are not App Router routes.
    if (/\.[a-z0-9]+$/i.test(pathname)) {
      if (publicFileExists && !publicFileExists(pathname)) fail(`links to ${pathname}, which is not a file in public/`);
      continue;
    }
    if (routeExists && !routeExists(segments)) fail(`links to ${pathname}, which matches no route`);
  }

  return problems;
}
