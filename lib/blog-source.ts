/**
 * Git is the blog's source of truth (see lib/blog.ts). The /admin post editor
 * predates that decision, so its write paths are retired rather than deleted:
 * the existing 33 posts stay readable in the dashboard, but nothing can be
 * created, edited or deleted there.
 *
 * Deleting the CMS outright would have been the tidier change, but /admin also
 * serves leads, visitors, people and settings — all still live — so only the
 * post-writing half is closed off.
 *
 * To re-open it, set ALLOW_LEGACY_CMS_POST_WRITES=1. Be deliberate: with
 * markdown winning on slug collisions, an edit saved here would not change the
 * published page — the database row would simply be shadowed by its file.
 */
import { NextResponse } from "next/server";

export const CMS_WRITE_RETIRED_MESSAGE =
  "Posts are managed in Git now. Edit content/blog/<slug>.md and open a pull request — merging to master publishes it. This editor is read-only.";

/**
 * True unless someone deliberately sets ALLOW_LEGACY_CMS_POST_WRITES=1.
 *
 * An env flag rather than deleted code: the create/update/delete logic (publish
 * stamping, IndexNow pings, revalidation) still works and is one variable away
 * if the database is ever needed again — without leaving unreachable branches
 * behind an early return.
 */
export function cmsWritesBlocked() {
  return process.env.ALLOW_LEGACY_CMS_POST_WRITES !== "1";
}

/** 409 response used by every retired post-writing route. */
export function cmsWritesRetired() {
  return NextResponse.json({ error: CMS_WRITE_RETIRED_MESSAGE }, { status: 409 });
}
