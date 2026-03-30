import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CtaContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type CtaSectionProps = {
  content: CtaContent;
  className?: string;
};

export function CtaSection({ content, className }: CtaSectionProps) {
  return (
    <section className={cn("section-space", className)}>
      <div className="site-container">
        <div className="rounded-2xl border border-[var(--brand-navy)]/15 bg-[var(--brand-navy)] px-6 py-10 text-white shadow-[0_20px_40px_-26px_rgba(10,26,47,0.75)] sm:px-10">
          {content.eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              {content.eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 max-w-3xl text-2xl leading-tight font-semibold sm:text-3xl">
            {content.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base">
            {content.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              className="border border-transparent bg-white text-[var(--brand-navy)] hover:bg-[var(--brand-grey)]"
            >
              <Link href={content.primaryHref}>{content.primaryLabel}</Link>
            </Button>
            {content.secondaryLabel && content.secondaryHref ? (
              <Button
                asChild
                variant="outline"
                className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={content.secondaryHref}>{content.secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
