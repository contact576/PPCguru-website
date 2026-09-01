import matter from "gray-matter";

/**
 * The shape of a post as the admin edits it, and the translation between that
 * shape and the markdown file that actually lives in content/blog.
 *
 * Shared by the API routes and the client editor, so it must stay free of
 * server-only imports.
 */

export type PostFields = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  /** YYYY-MM-DD — sorts the blog listing. */
  date: string;
  /** Full ISO timestamp with offset, or "" for "live as soon as it deploys". */
  publishAt: string;
  category: string;
  author: string;
  coverImage: string;
  /** Held back regardless of dates. */
  draft: boolean;
  /** Markdown body, no frontmatter. */
  content: string;
};

export type PostStatus = "published" | "scheduled" | "draft";

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  publishAt: string | null;
  draft: boolean;
  status: PostStatus;
  /** The moment it goes (or went) live — ISO, or null when unparseable. */
  liveAt: string | null;
  words: number;
  /** Blob sha, needed by the editor to save without clobbering a newer version. */
  sha: string;
  errors: number;
  warnings: number;
};

/**
 * When a post becomes visible. Mirrors `isAvailableNow` in lib/blog.ts — an
 * absent `publishAt` falls back to midnight UTC on `date`, and an unparseable
 * value means "visible", never "hidden forever".
 */
export function liveTimestamp(data: { publishAt?: unknown; date?: unknown }): number | null {
  const scheduledAt = data.publishAt ? String(data.publishAt) : `${String(data.date ?? "")}T00:00:00Z`;
  const timestamp = Date.parse(scheduledAt);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function postStatus(data: { draft?: unknown; publishAt?: unknown; date?: unknown }, now = Date.now()): PostStatus {
  if (data.draft === true) return "draft";
  const timestamp = liveTimestamp(data);
  if (timestamp === null) return "published";
  return timestamp > now ? "scheduled" : "published";
}

/** Frontmatter + body → the exact text committed to content/blog/<slug>.md. */
export function toMarkdown(fields: PostFields): string {
  const data: Record<string, unknown> = {
    title: fields.title.trim(),
    ...(fields.seoTitle.trim() ? { seoTitle: fields.seoTitle.trim() } : {}),
    description: fields.description.trim(),
    date: fields.date,
    ...(fields.publishAt ? { publishAt: fields.publishAt } : {}),
    category: fields.category.trim(),
    author: fields.author.trim(),
    ...(fields.coverImage.trim() ? { coverImage: fields.coverImage.trim() } : {}),
    ...(fields.draft ? { draft: true } : {}),
  };
  // The leading blank line and the trailing newline keep the file identical in
  // shape to a hand-written post, so the editor never produces a whitespace-only
  // diff against one an agent committed.
  const body = `\n${fields.content.replace(/\s+$/, "")}\n`;
  return matter.stringify(body, data);
}

/** The inverse: a committed file → the editor's fields. */
export function toFields(slug: string, data: Record<string, unknown>, content: string): PostFields {
  const str = (key: string) => (typeof data[key] === "string" ? (data[key] as string) : "");
  return {
    slug,
    title: str("title"),
    seoTitle: str("seoTitle"),
    description: str("description"),
    date: str("date") || new Date().toISOString().slice(0, 10),
    publishAt: data.publishAt ? String(data.publishAt) : "",
    category: str("category") || "Marketing",
    author: str("author") || "PPC Guru",
    coverImage: str("coverImage"),
    draft: data.draft === true,
    content,
  };
}

export function wordCount(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

/* ── datetime-local ⇄ ISO ────────────────────────────────────────────────── */
/**
 * `<input type="datetime-local">` speaks wall-clock time with no zone, but a
 * publish embargo without a zone is ambiguous by exactly the amount that makes
 * a post appear on the wrong day. Both helpers therefore anchor to the
 * BROWSER's zone: what the editor types is what their own clock will read.
 */
export function localInputToIso(value: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const offsetMinutes = -parsed.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, "0");
  const offset = `${sign}${pad(offsetMinutes / 60)}:${pad(offsetMinutes % 60)}`;
  const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000);
  return `${local.toISOString().slice(0, 19)}${offset}`;
}

export function isoToLocalInput(iso: string): string {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
