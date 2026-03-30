import { ProofFact } from "@/lib/site-proof";

type CompanyProofPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  facts: ProofFact[];
  note?: string;
};

export function CompanyProofPanel({
  eyebrow,
  title,
  description,
  facts,
  note,
}: CompanyProofPanelProps) {
  return (
    <section className="section-space pt-0">
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
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {facts.map((fact) => (
              <article
                key={fact.label}
                className="rounded-2xl border border-border/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                  {fact.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--brand-navy)]">
                  {fact.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {fact.detail}
                </p>
              </article>
            ))}
          </div>

          {note ? (
            <p className="mt-5 rounded-2xl border border-[var(--brand-blue)]/18 bg-[var(--brand-blue)]/6 px-4 py-3 text-sm leading-relaxed text-[var(--brand-navy)]">
              {note}
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
