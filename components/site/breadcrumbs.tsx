import Link from "next/link";

import type { BreadcrumbItem } from "@/lib/seo";
import { cn } from "@/lib/utils";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className
      )}
    >
      {items.map((item, index) => {
        const isCurrentPage = index === items.length - 1;

        return (
          <span key={item.path} className="inline-flex items-center gap-2">
            {isCurrentPage ? (
              <span aria-current="page" className="text-[var(--brand-navy)]">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="hover:text-[var(--brand-blue)]">
                {item.name}
              </Link>
            )}
            {!isCurrentPage ? <span aria-hidden="true">&gt;</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
