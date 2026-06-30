import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

/**
 * Dynamic homepage blog teaser — pulls the latest published posts from the same
 * source as /blog (Supabase when configured, markdown fallback otherwise), so it
 * updates itself as posts are published through the CMS. Renders nothing when
 * there are no posts. The heading/eyebrow live in the homepage section wrapper.
 */
export async function BlogPosts({ limit = 3 }: { limit?: number }) {
  const posts = (await getAllPosts()).slice(0, limit);
  if (posts.length === 0) return null;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            data-reveal
            className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] transition-all hover:-translate-y-1 hover:border-[var(--color-ink)]"
          >
            {p.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.coverImage} alt="" className="aspect-[16/9] w-full object-cover" />
            )}
            <div className="flex flex-1 flex-col p-7">
              <span className="mono text-[10.5px] font-semibold uppercase tracking-[.1em] text-[#5f6f17]">{p.category}</span>
              <h3 className="head mt-2.5 text-[19px] leading-snug">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-[var(--color-ink-dim)]">{p.description}</p>
              <div className="mt-5 flex items-center gap-4 text-xs text-[var(--color-ink-faint)]">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} /> {new Date(p.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {p.readingTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div data-reveal className="mt-10 text-center">
        <Link
          href="/blog"
          className="mono inline-flex items-center gap-2 rounded-full border border-[#14170e] px-7 py-3.5 text-[12px] font-bold uppercase tracking-[.06em] text-[#14170e] transition-colors hover:bg-[#14170e] hover:text-[#f1efe3]"
        >
          Read all articles <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
