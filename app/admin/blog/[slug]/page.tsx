import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { blogGitConfigured, readRemotePost } from "@/lib/blog-git";
import { toFields } from "@/lib/blog-post-file";
import { BlogEditor } from "@/components/admin/blog-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit post", robots: { index: false, follow: false } };

/**
 * Loads the post from GitHub rather than from the deployed filesystem: the
 * file on disk is whatever the last build shipped, which is already stale the
 * moment anything is committed. The blob sha travels with it so a save made
 * from an out-of-date copy is refused instead of overwriting a newer commit.
 */
export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAuthed())) redirect("/admin/login");
  if (!blogGitConfigured()) redirect("/admin");

  const { slug } = await params;
  const post = await readRemotePost(slug);
  if (!post) notFound();

  return <BlogEditor post={toFields(post.slug, post.data, post.content)} sha={post.sha} isNew={false} />;
}
