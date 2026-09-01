import matter from "gray-matter";

/**
 * GitHub is where the blog editor writes.
 *
 * Git is the blog's source of truth (lib/blog.ts), and the live site rebuilds
 * from `master`. So the /admin/blog editor does not write to a database and
 * does not write to the server's own filesystem — either would be erased by the
 * next deploy, or silently shadowed by the markdown file of the same slug. It
 * commits `content/blog/<slug>.md` through the GitHub Contents API, exactly the
 * file a pull request would have added, and the host picks it up.
 *
 * Scheduling still costs nothing extra: a committed post whose `publishAt` is in
 * the future stays invisible until that timestamp (`revalidate = 60`), so
 * "publish next Tuesday at 9am" is one commit today, not a deploy on Tuesday.
 */

const API = "https://api.github.com";
const BLOG_PATH = "content/blog";

export type GitPostFile = {
  /** `<slug>.md` */
  file: string;
  slug: string;
  /** Blob sha — required to update or delete this exact version. */
  sha: string;
  data: Record<string, unknown>;
  content: string;
};

export function blogGitConfig() {
  return {
    repo: process.env.BLOG_REPO || "contact576/PPCguru-website",
    branch: process.env.BLOG_BRANCH || "master",
    token: process.env.BLOG_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "",
  };
}

export function blogGitConfigured() {
  return Boolean(blogGitConfig().token);
}

/** Thrown for any non-2xx from GitHub so routes can surface a real message. */
export class BlogGitError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "BlogGitError";
  }
}

async function gh(path: string, init: RequestInit = {}, accept = "application/vnd.github+json") {
  const { token } = blogGitConfig();
  if (!token) throw new BlogGitError("No GitHub token configured — set BLOG_GITHUB_TOKEN.", 503);

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: accept,
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ppcguru-blog-admin",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    // The admin must always see the live state of the repo, never a cached one.
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    let message = `GitHub responded ${res.status}`;
    try {
      const parsed = JSON.parse(detail) as { message?: string };
      if (parsed.message) message = parsed.message;
    } catch {
      /* non-JSON error body — keep the status line */
    }
    if (res.status === 401 || res.status === 403) {
      message = `${message} — check BLOG_GITHUB_TOKEN has \`contents: write\` on ${blogGitConfig().repo}.`;
    }
    throw new BlogGitError(message, res.status);
  }
  return res;
}

/** Runs `jobs` at most `limit` at a time — 30+ blob fetches should not open 30 sockets. */
async function pooled<T, R>(items: T[], limit: number, run: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await run(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

type DirEntry = { name: string; path: string; sha: string; type: string };

/**
 * Every post on the branch, parsed — INCLUDING drafts and scheduled posts, which
 * lib/blog.ts deliberately hides. The admin list is the one place that has to
 * see them.
 */
export async function listRemotePosts(): Promise<GitPostFile[]> {
  const { repo, branch } = blogGitConfig();
  const res = await gh(`/repos/${repo}/contents/${BLOG_PATH}?ref=${encodeURIComponent(branch)}`);
  const entries = (await res.json()) as DirEntry[];
  const files = entries.filter((e) => e.type === "file" && /\.mdx?$/.test(e.name));

  const posts = await pooled(files, 8, async (entry) => {
    // Blobs are fetched by sha rather than by path: the sha is already in hand,
    // and it is the version this listing actually described.
    const blob = await gh(`/repos/${repo}/git/blobs/${entry.sha}`, {}, "application/vnd.github.raw");
    const raw = await blob.text();
    const { data, content } = matter(raw);
    return {
      file: entry.name,
      slug: entry.name.replace(/\.mdx?$/, ""),
      sha: entry.sha,
      data: data as Record<string, unknown>,
      content,
    };
  });

  return posts.sort((a, b) => String(b.data.date ?? "").localeCompare(String(a.data.date ?? "")));
}

/** One post by slug, or null when the branch has no such file. */
export async function readRemotePost(slug: string): Promise<GitPostFile | null> {
  const { repo, branch } = blogGitConfig();
  let res: Response;
  try {
    res = await gh(`/repos/${repo}/contents/${BLOG_PATH}/${slug}.md?ref=${encodeURIComponent(branch)}`);
  } catch (err) {
    if (err instanceof BlogGitError && err.status === 404) return null;
    throw err;
  }
  const entry = (await res.json()) as { name: string; sha: string; content: string; encoding: string };
  const raw = Buffer.from(entry.content, (entry.encoding as BufferEncoding) || "base64").toString("utf8");
  const { data, content } = matter(raw);
  return { file: entry.name, slug, sha: entry.sha, data: data as Record<string, unknown>, content };
}

/**
 * Creates or updates `content/blog/<slug>.md`.
 *
 * `sha` is the version being replaced — omit it to create. GitHub rejects an
 * update whose sha is stale (409), which is the concurrency guard: two people
 * editing the same post cannot silently overwrite each other.
 */
export async function writeRemotePost(opts: {
  slug: string;
  markdown: string;
  message: string;
  sha?: string;
}): Promise<{ sha: string; commit: string }> {
  const { repo, branch } = blogGitConfig();
  const res = await gh(`/repos/${repo}/contents/${BLOG_PATH}/${opts.slug}.md`, {
    method: "PUT",
    body: JSON.stringify({
      message: opts.message,
      content: Buffer.from(opts.markdown, "utf8").toString("base64"),
      branch,
      ...(opts.sha ? { sha: opts.sha } : {}),
    }),
  });
  const json = (await res.json()) as { content: { sha: string }; commit: { sha: string } };
  return { sha: json.content.sha, commit: json.commit.sha };
}

export async function deleteRemotePost(opts: { slug: string; sha: string; message: string }): Promise<void> {
  const { repo, branch } = blogGitConfig();
  await gh(`/repos/${repo}/contents/${BLOG_PATH}/${opts.slug}.md`, {
    method: "DELETE",
    body: JSON.stringify({ message: opts.message, sha: opts.sha, branch }),
  });
}

/** Just the slugs on the branch — enough to validate /blog/... links on save. */
export async function listRemoteSlugs(): Promise<Set<string>> {
  const { repo, branch } = blogGitConfig();
  const res = await gh(`/repos/${repo}/contents/${BLOG_PATH}?ref=${encodeURIComponent(branch)}`);
  const entries = (await res.json()) as DirEntry[];
  return new Set(entries.filter((e) => e.type === "file" && /\.mdx?$/.test(e.name)).map((e) => e.name.replace(/\.mdx?$/, "")));
}
