import { DocumentPreview } from "@/lib/site-proof";

type DocumentationPreviewProps = {
  eyebrow: string;
  title: string;
  description: string;
  previews: DocumentPreview[];
  note?: string;
};

function fieldValueClassName(tone: DocumentPreview["fields"][number]["tone"]) {
  if (tone === "accent") {
    return "text-[var(--brand-blue)]";
  }

  if (tone === "redacted") {
    return "font-mono text-[11px] tracking-[0.18em] text-muted-foreground";
  }

  return "text-[var(--brand-navy)]";
}

export function DocumentationPreview({
  eyebrow,
  title,
  description,
  previews,
  note,
}: DocumentationPreviewProps) {
  return (
    <section className="section-space pt-0">
      <div className="site-container">
        <article className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {previews.map((preview) => (
              <article
                key={preview.title}
                className="rounded-2xl border border-border/70 bg-white p-5 shadow-[0_12px_30px_-28px_rgba(10,26,47,0.55)]"
              >
                <div className="flex items-start justify-between gap-3 border-b border-dashed border-border/80 pb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                      {preview.status}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--brand-navy)]">
                      {preview.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-border/70 bg-muted/35 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Redacted
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {preview.summary}
                </p>

                <dl className="mt-4 space-y-3">
                  {preview.fields.map((field) => (
                    <div
                      key={`${preview.title}-${field.label}`}
                      className="rounded-xl border border-border/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-3 py-3"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd className={`mt-1 text-sm font-medium ${fieldValueClassName(field.tone)}`}>
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          {note ? (
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {note}
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
