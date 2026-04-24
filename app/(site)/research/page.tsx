import type { Metadata } from "next";
import Image from "next/image";

import { CtaSection } from "@/components/site/cta-section";
import { DocumentationPreview } from "@/components/site/documentation-preview";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { researchDocumentPreviews } from "@/lib/site-proof";
import { createPageMetadata } from "@/lib/seo";
import {
  productCategories,
  researchCta,
  researchDocumentationControls,
  researchFocus,
  researchIntro,
  researchLabCapabilities,
  researchOutputs,
  researchWorkflowSteps,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Atlas Labs Research",
  path: "/research",
  description:
    "Explore Atlas Labs, the laboratory team supporting Atlas BioLabs, where peptides sourced through qualified partners in China are analyzed, classified, and reviewed for documentation accuracy before commercial supply.",
  keywords: [
    "Atlas Labs laboratory",
    "peptide analysis laboratory",
    "peptide classification",
    "documentation accuracy review",
    "Atlas BioLabs research",
  ],
});

export default function ResearchPage() {
  const classificationCount = productCategories.length;

  return (
    <>
      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Atlas Labs Research
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
              {researchIntro.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {researchIntro.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                Laboratory review team
              </span>
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                Qualified sourcing network in China
              </span>
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                {classificationCount} peptide classes under review
              </span>
            </div>
          </div>

          <article className="surface-card overflow-hidden">
            <div className="relative min-h-[360px]">
              <Image
                src="/images/research-microscope.jpg"
                alt="Laboratory researcher in safety glasses examining peptide samples through a microscope."
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/86 via-[#071322]/22 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                  Analytical Review
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/84">
                  We approach research through microscopy, sample-prep discipline, laboratory observation, and analytical review.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-5 md:grid-cols-3">
          {researchFocus.map((focus) => (
            <article key={focus.title} className="surface-card h-full p-6">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                {focus.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {focus.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {researchLabCapabilities.map((capability) => (
            <article key={capability.title} className="surface-card h-full space-y-4 p-6">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                {capability.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {capability.description}
              </p>
              <ul className="space-y-2">
                {capability.points.map((point) => (
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
        <div className="site-container grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="surface-card overflow-hidden">
            <div className="relative min-h-[300px] border-b border-border/70">
              <Image
                src="/images/quality-medical.jpg"
                alt="Laboratory sample materials and test tubes arranged on an analytical peptide review bench."
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 35vw"
              />
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                Analytical Bench Context
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Bench-level sample work reflects the way we handle classification, record checks, documentation accuracy, and technical note review.
              </p>
            </div>
          </article>

          <div className="grid gap-5">
            <article className="surface-card p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                Atlas Labs Review Workflow
              </h2>
              <ol className="mt-5 space-y-3">
                {researchWorkflowSteps.map((step, index) => (
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
            </article>

            <article className="surface-card p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                Documentation Accuracy Controls
              </h2>
              <ul className="mt-5 space-y-3">
                {researchDocumentationControls.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                We log clarification flags and hold statuses whenever document mismatches need follow-up before a file moves into commercial support.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Peptide Classification Matrix
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              We classify incoming peptides into defined commercial groups before records are handed to our sales and account teams.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {productCategories.map((category) => (
                <article
                  key={category.id}
                  className="rounded-lg border border-border/70 bg-white px-4 py-3"
                >
                  <h3 className="text-sm font-semibold text-[var(--brand-navy)]">
                    {category.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 md:grid-cols-3">
          {researchOutputs.map((output) => (
            <article key={output.title} className="surface-card h-full p-6">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                {output.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {output.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <DocumentationPreview
        eyebrow="Research Records"
        title="This is how we organize classification and record control"
        description="These redacted previews show how we organize category mapping, documentation controls, and exception handling across research support."
        previews={researchDocumentPreviews}
        note="The details stay redacted, but the structure matches the way we review lots, records, and internal handoff points."
      />

      <ResourceLinksPanel
        eyebrow="Research Links"
        title="Use Research Context Alongside Categories, Products, and Quality Review"
        description="These pages connect Atlas Labs research support to the parts of the site buyers usually need when evaluating catalog fit and commercial readiness."
        links={[
          {
            title: "Browse Categories",
            href: "/categories",
            description:
              "Review the peptide classes we use when organizing products for commercial evaluation and sourcing.",
            eyebrow: "Categories",
          },
          {
            title: "Quality Assurance",
            href: "/quality-assurance",
            description:
              "See how research review connects to documentation checks, traceability, and release workflows.",
            eyebrow: "Documentation",
          },
          {
            title: "What We Do at Atlas Labs",
            href: "/blog/atlas-labs-quality-systems",
            description:
              "Read the article that explains how Atlas Labs supports quality review, records, and supply consistency.",
            eyebrow: "Buyer Guide",
          },
        ]}
      />

      <CtaSection content={researchCta} className="pt-0" />
    </>
  );
}
