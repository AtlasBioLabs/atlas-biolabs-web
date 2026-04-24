import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaSection } from "@/components/site/cta-section";
import { DocumentationPreview } from "@/components/site/documentation-preview";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { qualityDocumentPreviews } from "@/lib/site-proof";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getStaticBreadcrumbItems,
} from "@/lib/seo";
import {
  qualityBlocks,
  qualityCta,
  qualityIntro,
  qualityProcessSteps,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Quality Assurance",
  path: "/quality-assurance",
  description:
    "Review how Atlas Labs supports quality review, documentation checks, and batch transparency within Atlas BioLabs commercial peptide supply workflows.",
  keywords: [
    "peptide quality assurance",
    "peptide COA support",
    "lot release workflow",
  ],
});

export default function QualityAssurancePage() {
  const breadcrumbItems = getStaticBreadcrumbItems("qualityAssurance");
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd id="quality-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <Breadcrumbs items={breadcrumbItems} />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Quality Assurance
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
              {qualityIntro.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {qualityIntro.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                Documentation and release control
              </span>
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                Sample handling and release context
              </span>
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                Lot and batch visibility
              </span>
            </div>
          </div>

          <article className="surface-card overflow-hidden">
            <div className="relative min-h-[360px]">
              <Image
                src="/images/quality-medical.jpg"
                alt="Laboratory analyst using a pipette with sample tubes during batch review preparation."
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/88 via-[#071322]/28 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                  Analytical Batch Review
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/84">
                  We approach quality work through sample handling, analytical procedure, record checks, and documentation review.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {qualityBlocks.map((block) => (
            <article key={block.title} className="surface-card h-full space-y-4 p-6">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                {block.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {block.description}
              </p>
              <ul className="space-y-2">
                {block.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-sm text-[var(--brand-navy)]"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card overflow-hidden p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                  Release Workflow Snapshot
                </h2>
                <ol className="mt-5 grid gap-3 md:grid-cols-2">
                  {qualityProcessSteps.map((step, index) => (
                    <li
                      key={step}
                      className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
                    >
                      <span className="mr-2 font-semibold text-[var(--brand-blue)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border/70">
                <Image
                  src="/images/wholesale-vials.jpg"
                  alt="Gloved laboratory hands examining a sealed vial during documentation-linked batch review."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/84 via-[#071322]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                    Sample Handling Snapshot
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/84">
                    Sample handling is part of how we keep quality review tied to daily laboratory work, analytical discipline, and release control.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <DocumentationPreview
        eyebrow="Documentation Snapshot"
        title="This is how we organize quality and release records"
        description="These redacted previews reflect the way we organize review packets, traceability, and release checklists across quality and release work."
        previews={qualityDocumentPreviews}
        note="The details stay redacted, but the structure matches the way we manage documentation flow and commercial handoff."
      />

      <ResourceLinksPanel
        eyebrow="Documentation Resources"
        title="Connect Quality Review With Product Selection and Research Support"
        description="These pages help buyers move from documentation questions into product evaluation, laboratory review context, and sourcing decisions."
        links={[
          {
            title: "Atlas Labs Research",
            href: "/research",
            description:
              "Review how Atlas Labs supports classification, analytical review, and internal documentation controls.",
            eyebrow: "Research",
          },
          {
            title: "Shop Peptides",
            href: "/shop",
            description:
              "Compare product pages with documentation support notes, MOQ visibility, and sourcing context.",
            eyebrow: "Catalog",
          },
          {
            title: "Browse Categories",
            href: "/categories",
            description:
              "Move from documentation review into category pages with direct links to related product listings.",
            eyebrow: "Categories",
          },
          {
            title: "Peptide Quality, Purity, and COA Explained",
            href: "/blog/peptide-quality-purity-coa",
            description:
              "Read the buyer guide that explains how purity, COA review, and documentation affect procurement decisions.",
            eyebrow: "Buyer Guide",
          },
        ]}
      />

      <CtaSection content={qualityCta} className="pt-0" />
    </>
  );
}
