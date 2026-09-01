import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { blogGitConfig, blogGitConfigured, BlogGitError, listRemotePosts, writeRemotePost } from "@/lib/blog-git";
import { postStatus, liveTimestamp, wordCount, type PostSummary } from "@/lib/blog-post-file";
import { lintPost } from "@/lib/blog-lint";
import { fsLintCheckers } from "@/lib/blog-lint-fs";
import { commitMessage, fieldsFrom, hasErrors, preparePost } from "@/lib/blog-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notConfigured() {
  return NextResponse.json(
    {
      error:
        "GitHub is not connected. Set BLOG_GITHUB_TOKEN (a fine-grained token with `contents: write` on the site repo) and restart.",
    },
    { status: 503 },
  );
}

function failure(err: unknown) {
  if (err instanceof BlogGitError) return NextResponse.json({ error: err.message }, { status: err.status });
  return NextResponse.json({ error: "Could not reach GitHub." }, { status: 502 });
}

/**
 * GET /api/admin/blog — every post on the branch, drafts and scheduled ones
 * included. This is the one view that must see what the public site hides.
 */
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!blogGitConfigured()) return notConfigured();

  try {
    const files = await listRemotePosts();
    const knownSlugs = new Set(files.map((f) => f.slug));
    const checkers = fsLintCheckers();

    const posts: PostSummary[] = files.map((file) => {
      const problems = lintPost({ file: file.file, data: file.data, content: file.content, knownSlugs, ...checkers });
      const liveAt = liveTimestamp(file.data);
      return {
        slug: file.slug,
        title: String(file.data.title ?? file.slug),
        description: String(file.data.description ?? ""),
        category: String(file.data.category ?? "Marketing"),
        author: String(file.data.author ?? "PPC Guru"),
        date: String(file.data.date ?? ""),
        publishAt: file.data.publishAt ? String(file.data.publishAt) : null,
        draft: file.data.draft === true,
        status: postStatus(file.data),
        liveAt: liveAt === null ? null : new Date(liveAt).toISOString(),
        words: wordCount(file.content),
        sha: file.sha,
        errors: problems.filter((p) => p.level === "error").length,
        warnings: problems.filter((p) => p.level === "warn").length,
      };
    });

    const { repo, branch } = blogGitConfig();
    return NextResponse.json({ posts, repo, branch });
  } catch (err) {
    return failure(err);
  }
}

/**
 * POST /api/admin/blog — commit a new content/blog/<slug>.md.
 *
 * `dryRun: true` runs the editorial checks and returns them without committing;
 * it is what the editor's "Check" button calls.
 */
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!blogGitConfigured()) return notConfigured();

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const fields = fieldsFrom(body);
  if ("error" in fields) return NextResponse.json({ error: fields.error }, { status: 400 });

  try {
    const prepared = await preparePost(fields);
    if (body.dryRun === true) {
      return NextResponse.json({ problems: prepared.problems, markdown: prepared.markdown, slug: fields.slug });
    }
    if (hasErrors(prepared.problems)) {
      return NextResponse.json(
        { error: "The post has editorial errors — fix them before committing.", problems: prepared.problems },
        { status: 422 },
      );
    }

    // No `sha` — GitHub then refuses if the file already exists, which is the
    // duplicate-slug guard. A 422 from here means "that slug is taken".
    const result = await writeRemotePost({
      slug: fields.slug,
      markdown: prepared.markdown,
      message: commitMessage("add", fields),
    });

    return NextResponse.json({ slug: fields.slug, sha: result.sha, commit: result.commit, problems: prepared.problems });
  } catch (err) {
    if (err instanceof BlogGitError && (err.status === 422 || err.status === 409)) {
      return NextResponse.json({ error: `A post with the slug “${fields.slug}” already exists.` }, { status: 409 });
    }
    return failure(err);
  }
}
