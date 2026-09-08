import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { blogGitConfigured, readRemotePost } from "@/lib/blog-git";
import { readLocalPost } from "@/lib/blog-fs";
import { toFields } from "@/lib/blog-post-file";
import { BlogEditor } from "@/components/admin/blog-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit post", robots: { index: false, follow: false } };

/**
 * Loads the post from GitHub rather than from the deployed filesystem: the
 * file on disk is whatever the last build shipped, which is already stale the
 * moment anything is committed. The blob sha travels with it so a save made
 * from an out-of-date copy is refused instead of overwriting a newer commit.
 *
 * With no token there is no sha and therefore no safe save, so the deployed
 * file is opened READ-ONLY instead — the post can still be read in the
 * dashboard, which is better than the bounce back to /admin this used to do.
 */
export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAuthed())) redirect("/admin/login");

  const { slug } = await params;
  const writable = blogGitConfigured();
  const post = writable ? await readRemotePost(slug) : readLocalPost(slug);
  if (!post) notFound();

  return (
    <BlogEditor
      post={toFields(post.slug, post.data, post.content)}
      sha={post.sha || undefined}
      isNew={false}
      readOnly={!writable}
    />
  );
}
