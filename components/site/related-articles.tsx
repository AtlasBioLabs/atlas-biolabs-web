import Link from "next/link";
import type { BlogPost } from "contentlayer/generated";

import { formatBlogDate, getBlogReadingTime } from "@/lib/blog";

type RelatedArticlesProps = {
  posts: BlogPost[];
};

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="section-space pt-0">
      <div className="site-container">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-3 border-b border-border/70 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Related Articles
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
                Keep Exploring Peptide Supply Topics
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              These guides connect to the same sourcing, documentation, and category questions that buyers usually research next.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-border/70 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                  {formatBlogDate(post.date)} · {getBlogReadingTime(post)}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--brand-navy)]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[var(--brand-blue)]">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
