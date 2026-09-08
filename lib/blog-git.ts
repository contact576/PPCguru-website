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

/**
 * Env panels store what you type, quotes included.
 *
 * A GitHub token is always bare ASCII with no whitespace and no quotes, so any
 * of those in the value came from the hosting panel, not from GitHub. Pasting
 * `BLOG_GITHUB_TOKEN="github_pat_…"` into Hostinger stores the quote characters
 * literally, the header goes out as `Bearer "github_pat_…"`, and GitHub answers
 * 401 Bad credentials — which reads like a permissions problem and isn't one.
 * Strip them rather than making someone debug an invisible character.
 */
function sanitizeToken(raw: string | undefined): string {
  if (!raw) return "";
  let t = raw.trim();
  // Surrounding quotes, possibly doubled by a panel that quotes on save.
  while (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

export function blogGitConfig() {
  return {
    repo: sanitizeToken(process.env.BLOG_REPO) || "contact576/PPCguru-website",
    branch: sanitizeToken(process.env.BLOG_BRANCH) || "master",
    token: sanitizeToken(process.env.BLOG_GITHUB_TOKEN) || sanitizeToken(process.env.GITHUB_TOKEN) || "",
  };
}

export function blogGitConfigured() {
  return Boolean(blogGitConfig().token);
}

/**
 * A description of the token that is safe to show in the admin UI and in logs:
 * its kind and length, never its value. Enough to spot the three failures that
 * actually happen — a truncated paste, a stray quote, and the wrong kind of
 * token — without ever printing the secret.
 */
export function tokenFingerprint(): {
  present: boolean;
  kind: string;
  length: number;
  looksValid: boolean;
  note?: string;
} {
  const raw = process.env.BLOG_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
  const token = blogGitConfig().token;
  if (!token) return { present: false, kind: "none", length: 0, looksValid: false };

  const kinds: [RegExp, string, number][] = [
    [/^github_pat_/, "fine-grained PAT", 80],
    [/^ghp_/, "classic PAT", 36],
    [/^gho_/, "OAuth token", 36],
    [/^ghs_/, "app installation token", 36],
  ];
  const match = kinds.find(([re]) => re.test(token));
  const kind = match ? match[1] : "unrecognized prefix";
  const minLength = match ? match[2] : 0;
  const notes: string[] = [];

  if (raw.trim() !== raw) notes.push("the stored value had surrounding whitespace (trimmed)");
  if (/^["']|["']$/.test(raw.trim())) notes.push("the stored value was wrapped in quotes (stripped)");
  if (!match) notes.push("a GitHub token starts with github_pat_, ghp_, gho_ or ghs_ — this one doesn't, so it was probably truncated or is not a token");
  else if (token.length < minLength) notes.push(`${kind} values are longer than this (${token.length} chars) — the paste was probably cut short`);

  return {
    present: true,
    kind,
    length: token.length,
    looksValid: Boolean(match) && token.length >= minLength,
    ...(notes.length ? { note: notes.join("; ") } : {}),
  };
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
    // These three statuses mean genuinely different things, and conflating them
    // sends people to fix the wrong thing. 401 is the token VALUE; 403 is the
    // token's permissions; 404 on a repo path means the token is fine but can't
    // see this repo at all.
    const { repo } = blogGitConfig();
    if (res.status === 401) {
      const fp = tokenFingerprint();
      message =
        `${message} — GitHub rejected the token itself, so this is NOT a permissions problem. ` +
        `BLOG_GITHUB_TOKEN is ${fp.present ? `a ${fp.kind}, ${fp.length} chars` : "empty"}. ` +
        (fp.note ? `${fp.note}. ` : "") +
        `Usual causes: the value was pasted with quotes or a line break, it was truncated, or the token has expired or been revoked.`;
    } else if (res.status === 403) {
      message = `${message} — the token is valid but not allowed to do this. It needs \`Contents: Read and write\` on ${repo}.`;
    } else if (res.status === 404 && path.includes(`/repos/${repo}`)) {
      message =
        `${message} — the token authenticates, but ${repo} is not visible to it. ` +
        `A fine-grained token only covers repositories owned by the account that created it and explicitly selected under "Repository access"; ` +
        `for a repo owned by someone else, either that owner creates the token or you use a classic token with the \`repo\` scope.`;
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
