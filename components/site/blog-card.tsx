import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "contentlayer/generated";

import { Button } from "@/components/ui/button";
import { formatBlogDate, getBlogReadingTime } from "@/lib/blog";

type BlogCardProps = {
  post: Pick<
    BlogPost,
    | "title"
    | "description"
    | "date"
    | "slug"
    | "tags"
    | "image"
    | "readingTime"
    | "readingTimeMinutes"
  >;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] w-full border-b border-border/70 bg-[#eef4ff]">
        <Image
          src={post.image}
          alt={`Editorial illustration covering ${post.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
          {formatBlogDate(post.date)} | {getBlogReadingTime(post)}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--brand-navy)]">
          <Link href={`/blog/${post.slug}`} className="hover:text-[var(--brand-blue)]">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-[var(--brand-navy)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button asChild variant="outline">
            <Link href={`/blog/${post.slug}`}>Read more</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
