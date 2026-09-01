import matter from "gray-matter";
import { lintPost, type LintProblem } from "@/lib/blog-lint";
import { fsLintCheckers } from "@/lib/blog-lint-fs";
import { listRemoteSlugs } from "@/lib/blog-git";
import { toMarkdown, type PostFields } from "@/lib/blog-post-file";
import { slugify } from "@/lib/slug";

/**
 * Turning an editor payload into a committable file, and refusing to commit one
 * that `npm run blog:check` would reject.
 *
 * Order matters: the payload is rendered to markdown FIRST and then linted by
 * re-parsing that markdown, so what is checked is byte-for-byte what gets
 * committed — not the in-memory object it came from.
 */

export type PreparedPost = {
  fields: PostFields;
  markdown: string;
  problems: LintProblem[];
};

const str = (value: unknown) => (typeof value === "string" ? value : "");

export function fieldsFrom(body: Record<string, unknown>, fallbackSlug?: string): PostFields | { error: string } {
  const title = str(body.title).trim();
  if (!title) return { error: "Title is required." };

  const slug = slugify(str(body.slug) || fallbackSlug || title);
  if (!slug) return { error: "Could not derive a slug from the title." };

  const date = str(body.date).trim() || new Date().toISOString().slice(0, 10);
  const publishAt = str(body.publishAt).trim();
  if (publishAt && Number.isNaN(Date.parse(publishAt))) {
    return { error: `\`publishAt\` (${publishAt}) is not a valid date and time.` };
  }

  return {
    slug,
    title,
    seoTitle: str(body.seoTitle).trim(),
    description: str(body.description).trim(),
    date,
    publishAt,
    category: str(body.category).trim() || "Marketing",
    author: str(body.author).trim() || "PPC Guru",
    coverImage: str(body.coverImage).trim(),
    draft: body.draft === true,
    content: str(body.content),
  };
}

/** Renders + lints. `otherSlugs` excludes the post itself so it can link nowhere but out. */
export async function preparePost(fields: PostFields): Promise<PreparedPost> {
  const markdown = toMarkdown(fields);
  const { data, content } = matter(markdown);
  const knownSlugs = await listRemoteSlugs().catch(() => new Set<string>());
  knownSlugs.add(fields.slug);

  const problems = lintPost({
    file: `${fields.slug}.md`,
    data: data as Record<string, unknown>,
    content,
    knownSlugs,
    ...fsLintCheckers(),
  });

  return { fields, markdown, problems };
}

export const hasErrors = (problems: LintProblem[]) => problems.some((p) => p.level === "error");

/** The message that lands in the repo's history for an admin-made change. */
export function commitMessage(action: "add" | "update" | "remove", fields: { slug: string; title?: string }) {
  const verb = { add: "add", update: "update", remove: "remove" }[action];
  return `content(blog): ${verb} ${fields.slug}\n\nEdited in /admin/blog.`;
}
