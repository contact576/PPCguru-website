import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { blogGitConfigured, BlogGitError, deleteRemotePost, readRemotePost, writeRemotePost } from "@/lib/blog-git";
import { postStatus, toFields } from "@/lib/blog-post-file";
import { commitMessage, fieldsFrom, hasErrors, preparePost } from "@/lib/blog-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

function notConfigured() {
  return NextResponse.json({ error: "GitHub is not connected. Set BLOG_GITHUB_TOKEN and restart." }, { status: 503 });
}

function failure(err: unknown) {
  if (err instanceof BlogGitError) return NextResponse.json({ error: err.message }, { status: err.status });
  return NextResponse.json({ error: "Could not reach GitHub." }, { status: 502 });
}

/** GET — one post, as editor fields, with the blob sha the editor must send back. */
export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!blogGitConfigured()) return notConfigured();
  const { slug } = await params;

  try {
    const post = await readRemotePost(slug);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      post: toFields(post.slug, post.data, post.content),
      sha: post.sha,
      status: postStatus(post.data),
    });
  } catch (err) {
    return failure(err);
  }
}

/**
 * PUT — commit an edit.
 *
 * `sha` is the version the editor loaded. GitHub rejects a stale one, so an
 * edit made from an out-of-date copy fails loudly instead of overwriting
 * someone else's commit. A changed slug is a rename: write the new file, then
 * delete the old one — in that order, so a failure leaves the post existing
 * twice rather than not at all.
 */
export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!blogGitConfigured()) return notConfigured();
  const { slug: originalSlug } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const fields = fieldsFrom(body, originalSlug);
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

    const renamed = fields.slug !== originalSlug;
    const existing = await readRemotePost(originalSlug);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const sha = typeof body.sha === "string" ? body.sha : existing.sha;
    if (!renamed && sha !== existing.sha) {
      return NextResponse.json(
        { error: "This post changed on GitHub since you opened it. Reload the editor and reapply your edit." },
        { status: 409 },
      );
    }

    const result = await writeRemotePost({
      slug: fields.slug,
      markdown: prepared.markdown,
      message: commitMessage("update", fields),
      ...(renamed ? {} : { sha: existing.sha }),
    });

    if (renamed) {
      await deleteRemotePost({
        slug: originalSlug,
        sha: existing.sha,
        message: `content(blog): remove ${originalSlug} (renamed to ${fields.slug})\n\nEdited in /admin/blog.`,
      });
    }

    return NextResponse.json({ slug: fields.slug, sha: result.sha, commit: result.commit, problems: prepared.problems });
  } catch (err) {
    return failure(err);
  }
}

/**
 * PATCH — a schedule-only change (`publishAt`, `draft`) made from the board,
 * without opening the editor. Reads the current file, swaps those two fields,
 * commits the rest untouched.
 */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!blogGitConfigured()) return notConfigured();
  const { slug } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  try {
    const existing = await readRemotePost(slug);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const current = toFields(existing.slug, existing.data, existing.content);
    const publishAt = typeof body.publishAt === "string" ? body.publishAt.trim() : current.publishAt;
    if (publishAt && Number.isNaN(Date.parse(publishAt))) {
      return NextResponse.json({ error: `\`publishAt\` (${publishAt}) is not a valid date and time.` }, { status: 400 });
    }

    const next = {
      ...current,
      publishAt,
      // Moving the schedule moves the listing date with it, or the post sorts
      // into the archive on a date that has nothing to do with when it ran.
      date: publishAt ? publishAt.slice(0, 10) : current.date,
      draft: typeof body.draft === "boolean" ? body.draft : current.draft,
    };

    const prepared = await preparePost(next);
    if (hasErrors(prepared.problems)) {
      return NextResponse.json(
        { error: "That post has editorial errors — open it in the editor to fix them.", problems: prepared.problems },
        { status: 422 },
      );
    }

    const verb = next.draft && !current.draft ? "unschedule" : "reschedule";
    const result = await writeRemotePost({
      slug,
      markdown: prepared.markdown,
      message: `content(blog): ${verb} ${slug}\n\nEdited in /admin/blog.`,
      sha: existing.sha,
    });

    return NextResponse.json({ slug, sha: result.sha, commit: result.commit, status: postStatus(next) });
  } catch (err) {
    return failure(err);
  }
}

/** DELETE — remove the file from the branch. The post disappears on the next build. */
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!blogGitConfigured()) return notConfigured();
  const { slug } = await params;

  try {
    const existing = await readRemotePost(slug);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await deleteRemotePost({ slug, sha: existing.sha, message: commitMessage("remove", { slug }) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return failure(err);
  }
}
