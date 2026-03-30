import Link from "next/link";

import { cn } from "@/lib/utils";

type ResourceLink = {
  title: string;
  href: string;
  description: string;
  eyebrow?: string;
};

type ResourceLinksPanelProps = {
  eyebrow: string;
  title: string;
  description?: string;
  links: ResourceLink[];
  className?: string;
};

export function ResourceLinksPanel({
  eyebrow,
  title,
  description,
  links,
  className,
}: ResourceLinksPanelProps) {
  return (
    <section className={cn("section-space pt-0", className)}>
      <div className="site-container">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-border/70 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                {eyebrow}
              </p>
              <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[var(--brand-navy)] sm:text-3xl">
                {title}
              </h2>
            </div>
            {description ? (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link) => (
              <article
                key={link.href}
                className="rounded-2xl border border-border/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4"
              >
                {link.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    {link.eyebrow}
                  </p>
                ) : null}
                <h3 className="mt-2 text-lg font-semibold text-[var(--brand-navy)]">
                  <Link href={link.href} className="hover:text-[var(--brand-blue)]">
                    {link.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
