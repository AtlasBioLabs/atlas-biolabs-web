import Link from "next/link";

import type { BlogHeading } from "@/lib/blog";

type BlogTableOfContentsProps = {
  headings: BlogHeading[];
};

export function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-2xl border border-border/70 bg-[#f8fbff] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
        Table of Contents
      </p>
      <ul className="mt-4 space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            className={heading.level === 3 ? "pl-4" : undefined}
          >
            <Link
              href={`#${heading.slug}`}
              className="text-sm text-muted-foreground hover:text-[var(--brand-blue)]"
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
