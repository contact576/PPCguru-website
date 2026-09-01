import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getSettings } from "@/lib/settings";
import { BlogEditor } from "@/components/admin/blog-editor";
import type { PostFields } from "@/lib/blog-post-file";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New post", robots: { index: false, follow: false } };

export default async function NewBlogPostPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const settings = await getSettings();

  const blank: PostFields = {
    slug: "",
    title: "",
    seoTitle: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    publishAt: "",
    category: settings.defaultCategory,
    author: settings.defaultAuthor,
    coverImage: "",
    draft: false,
    content: "",
  };

  return <BlogEditor post={blank} isNew />;
}
