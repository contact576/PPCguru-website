/**
 * Editorial gate for content/blog/*.md — the last check before a post reaches
 * the site now that Git is the blog's source of truth (see lib/blog.ts).
 *
 * Posts arrive as pull requests opened by a scheduling agent, or straight from
 * the /admin/blog editor, so review means a human reading prose, and prose
 * review is bad at catching structural faults: a table-of-contents anchor that
 * silently scrolls nowhere, a note written to the reviewer that stays in the
 * body, an internal link to a route that does not exist. All three shipped in
 * the same draft. This catches that class.
 *
 * The RULES live in lib/blog-lint.ts, shared with the admin editor so the two
 * cannot drift. This file supplies what only a filesystem can answer — the
 * App Router route table and the contents of public/ — and prints the report.
 *
 * Run:  npm run blog:check            (all posts)
 *       npm run blog:check -- <slug>  (one post)
 *
 * Errors fail the run. Warnings are advisory and do not.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { lintPost, slugOf } from "../lib/blog-lint.ts";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const APP_DIR = path.join(process.cwd(), "app");

type Problem = { file: string; level: "error" | "warn"; message: string };
const problems: Problem[] = [];

/* ── route table ─────────────────────────────────────────────────────────── */
/**
 * Every routable path, read off the App Router tree. Dynamic segments stay as
 * `[param]` and match positionally, so /services/seo resolves through
 * /services/[slug] without this script needing the service catalogue. Blog
 * links are the exception — they are checked against real files in the lint
 * module, because a wrong blog slug is the mistake a blog PR actually makes.
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

const publicFileExists = (pathname: string) => fs.existsSync(path.join(process.cwd(), "public", pathname));

/* ── run ─────────────────────────────────────────────────────────────────── */
const files = fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f)).sort();
const knownSlugs = new Set(files.map(slugOf));

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = only.length ? files.filter((f) => only.some((o) => slugOf(f) === slugOf(o))) : files;

if (only.length && !targets.length) {
  console.error(`No post matches: ${only.join(", ")}`);
  process.exit(1);
}

for (const file of targets) {
  const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
  for (const problem of lintPost({ file, data, content, knownSlugs, routeExists, publicFileExists })) {
    problems.push({ file, ...problem });
  }
}

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
