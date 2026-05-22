import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { absoluteUrl } from "@/lib/seo";
import type { BreadcrumbItem } from "@/lib/seo";
import type {
  SeoPageSection,
  SeoPageTable,
  SeoResourceLink,
} from "@/lib/seo-resource-data";
import { breadcrumbJsonLd, collectionPageJsonLd, webPageJsonLd } from "@/lib/schema";
import type { CtaContent } from "@/lib/site-content";

type SeoContentPageProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  description: string;
  path: string;
  breadcrumbItems: BreadcrumbItem[];
  schemaType?: "WebPage" | "CollectionPage";
  sections: SeoPageSection[];
  complianceNote: string;
  comparisonTable?: SeoPageTable;
  resourcePanels?: Array<{
    eyebrow: string;
    title: string;
    description?: string;
    links: SeoResourceLink[];
  }>;
  cta?: CtaContent;
};

export function SeoContentPage({
  id,
  eyebrow,
  title,
  intro,
  description,
  path,
  breadcrumbItems,
  schemaType = "WebPage",
  sections,
  complianceNote,
  comparisonTable,
  resourcePanels = [],
  cta,
}: SeoContentPageProps) {
  const breadcrumbSchema = breadcrumbJsonLd(
    breadcrumbItems.map((item) => ({
      name: item.name,
      url: absoluteUrl(item.path),
    }))
  );
  const pageSchema =
    schemaType === "CollectionPage"
      ? collectionPageJsonLd({
          name: title,
          description,
          url: absoluteUrl(path),
        })
      : webPageJsonLd({
          name: title,
          description,
          url: absoluteUrl(path),
        });

  return (
    <>
      <JsonLd id={`${id}-breadcrumb-schema`} data={breadcrumbSchema} />
      <JsonLd id={`${id}-page-schema`} data={pageSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="surface-card h-full p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {comparisonTable ? (
        <section className="section-space pt-0">
          <div className="site-container">
            <article className="surface-card overflow-hidden p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                Comparison Table
              </h2>
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                  <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
                    <tr>
                      <th className="border border-border/70 px-3 py-3 font-semibold">
                        Comparison Point
                      </th>
                      {comparisonTable.columns.map((column) => (
                        <th
                          key={column}
                          className="border border-border/70 px-3 py-3 font-semibold"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTable.rows.map((row) => (
                      <tr key={row.label}>
                        <td className="border border-border/70 px-3 py-3 font-medium text-[var(--brand-navy)]">
                          {row.label}
                        </td>
                        {row.values.map((value, index) => (
                          <td
                            key={`${row.label}-${comparisonTable.columns[index]}`}
                            className="border border-border/70 px-3 py-3 text-muted-foreground"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Compliance Note
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {complianceNote}
            </p>
          </article>
        </div>
      </section>

      {resourcePanels.map((panel, index) => (
        <ResourceLinksPanel
          key={`${panel.title}-${index}`}
          eyebrow={panel.eyebrow}
          title={panel.title}
          description={panel.description}
          links={panel.links}
        />
      ))}

      {cta ? <CtaSection content={cta} className="pt-0" /> : null}
    </>
  );
}
