import { redirect } from "next/navigation";

/** /admin/blog is the same view as /admin — keep one canonical URL. */
export default function BlogRedirect() {
  redirect("/admin");
}
