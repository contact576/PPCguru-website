import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

/** Fresh, crawlable homepage article links without relying on remote cover art. */
export async function BlogPosts({ limit = 3 }: { limit?: number }) {
  const posts = (await getAllPosts()).slice(0, limit);
  if (posts.length === 0) return null;

  return (
    <>
      <div className="home-blog-grid">
        {posts.map((post, index) => (
          <Link className="home-blog-card" href={`/blog/${post.slug}`} key={post.slug}>
            <div className="home-blog-card-top"><span>{String(index + 1).padStart(2, "0")} / {post.category}</span><ArrowUpRight size={20} aria-hidden="true" /></div>
            <div>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}</time>
          </Link>
        ))}
      </div>
      <div className="home-blog-more"><Link href="/blog" className="home-text-link">Read all articles <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </>
  );
}
