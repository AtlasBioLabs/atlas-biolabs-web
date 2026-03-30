import Image from "next/image";
import { BoxesIcon, MicroscopeIcon, ShieldCheckIcon, UserRoundIcon } from "lucide-react";

import { OperationsEvidenceItem } from "@/lib/site-proof";

type OperationsEvidenceGridProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: OperationsEvidenceItem[];
  note?: string;
};

function getPlaceholderIcon(title: string) {
  if (title.toLowerCase().includes("founder")) {
    return UserRoundIcon;
  }

  if (title.toLowerCase().includes("pack")) {
    return BoxesIcon;
  }

  if (title.toLowerCase().includes("micro")) {
    return MicroscopeIcon;
  }

  return ShieldCheckIcon;
}

export function OperationsEvidenceGrid({
  eyebrow,
  title,
  description,
  items,
  note,
}: OperationsEvidenceGridProps) {
  return (
    <section className="section-space pt-0">
      <div className="site-container">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              {eyebrow}
            </p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[var(--brand-navy)] sm:text-3xl">
              {title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const PlaceholderIcon = getPlaceholderIcon(item.title);

            return (
              <article key={item.title} className="surface-card overflow-hidden">
                {item.image ? (
                  <div className="relative min-h-[230px] border-b border-border/70">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[230px] items-center justify-center border-b border-border/70 bg-[radial-gradient(circle_at_top_left,#eaf1ff_0%,#f8fbff_46%,#ffffff_100%)] px-6">
                    <div className="text-center">
                      <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-[var(--brand-navy)] text-xl font-semibold text-white shadow-[0_16px_32px_-24px_rgba(10,26,47,0.8)]">
                        {item.initials ? (
                          item.initials
                        ) : (
                          <PlaceholderIcon className="size-7" />
                        )}
                      </span>
                      <p className="mt-4 text-sm font-medium text-[var(--brand-navy)]">
                        {item.title}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <span className="rounded-full border border-border/70 bg-muted/35 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {item.status}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--brand-navy)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {note ? (
          <p className="mt-5 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
