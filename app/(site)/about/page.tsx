import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyProofPanel } from "@/components/site/company-proof-panel";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import { OperationsEvidenceGrid } from "@/components/site/operations-evidence-grid";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import {
  companyProofFacts,
  operationsEvidenceItems,
  proofSystemNote,
} from "@/lib/site-proof";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getStaticBreadcrumbItems,
} from "@/lib/seo";
import {
  aboutCta,
  aboutIntro,
  aboutStory,
  aboutTeam,
  aboutValues,
  founderProfile,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "About Atlas BioLabs",
  path: "/about",
  description:
    "Learn how Atlas BioLabs was founded in 2024 by Dr. Guy Citrin, how our qualified sourcing network in China supports supply, and how Atlas Labs strengthens documentation and batch transparency for U.S. and international buyers.",
  keywords: [
    "about Atlas BioLabs",
    "Dr. Guy Citrin",
    "Atlas BioLabs team",
    "founded in 2024",
    "peptide supplier company",
    "commercial peptide supply",
  ],
});

export default function AboutPage() {
  const breadcrumbItems = getStaticBreadcrumbItems("about");
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd id="about-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            About Atlas BioLabs
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            {aboutIntro.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {aboutIntro.description}
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="surface-card overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[320px]">
                <Image
                  src="/images/about-team.jpg"
                  alt="Professional team meeting around a conference table."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 30vw"
                />
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                  Our Story
                </h2>
                <div className="mt-4 space-y-4">
                  {aboutStory.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="surface-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Founder
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
              {founderProfile.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--brand-blue)]">
              {founderProfile.title}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {founderProfile.bio}
            </p>
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
              <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-[var(--brand-navy)] text-xl font-semibold text-white">
                GC
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  Founder Note
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--brand-navy)]">
                  You know who is leading the company from the first conversation.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-border/70 bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_100%)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Leadership Approach
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--brand-navy)]">
                We built Atlas BioLabs to combine sourcing access with clearer communication, buyer guidance, and practical documentation support.
              </p>
            </div>
          </article>
        </div>
      </section>

      <CompanyProofPanel
        eyebrow="Company Snapshot"
        title="What you can expect from us"
        description="We introduce our team, explain how we work, and make it easy to reach us without vague marketing language."
        facts={companyProofFacts}
        note={proofSystemNote}
      />

      <section className="section-space pt-0">
        <div className="site-container">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Team of 5
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)]">
              The People Behind Atlas BioLabs
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Alongside our founder, we coordinate commercial quotes, Atlas Labs documentation workflows, partner sourcing alignment, and account support so every conversation stays informed and responsive.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {aboutTeam.map((member) => (
              <article key={member.role} className="surface-card h-full overflow-hidden">
                <div className="relative min-h-[260px] border-b border-border/70">
                  <Image
                    src={member.image}
                    alt={`${member.role} team portrait`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mt-2 text-xl font-semibold text-[var(--brand-navy)]">
                    {member.displayName}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[var(--brand-blue)]">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {member.focus}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <OperationsEvidenceGrid
        eyebrow="Inside Operations"
        title="How we work behind the scenes"
        description="Meet the people, laboratory routines, and support flow that shape our day-to-day work."
        items={operationsEvidenceItems}
      />

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 md:grid-cols-3">
          {aboutValues.map((value) => (
            <article key={value.title} className="surface-card h-full p-6">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                {value.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Explore Atlas BioLabs"
        title="Move From Company Background Into Sourcing and Supply Details"
        description="These pages connect our team story to the catalog, quality review flow, and commercial supply structure buyers usually want to review next."
        links={[
          {
            title: "Shop Peptides",
            href: "/shop",
            description:
              "Browse the full peptide catalog with product-level MOQ, pack size, and documentation context.",
            eyebrow: "Catalog",
          },
          {
            title: "Wholesale Supply",
            href: "/wholesale",
            description:
              "Review how we support recurring peptide supply, volume planning, and bulk quote workflows.",
            eyebrow: "Supply",
          },
          {
            title: "Browse Categories",
            href: "/categories",
            description:
              "Move from company background into peptide category pages with direct links to individual products.",
            eyebrow: "Categories",
          },
          {
            title: "Peptide Supply Blog",
            href: "/blog",
            description:
              "Read the buyer guides that explain pricing, documentation, sourcing, and commercial peptide planning.",
            eyebrow: "Blog",
          },
          {
            title: "Quality Assurance",
            href: "/quality-assurance",
            description:
              "See how Atlas Labs reviews documentation, lot traceability, and batch transparency before supply moves forward.",
            eyebrow: "Documentation",
          },
        ]}
      />

      <CtaSection content={aboutCta} className="pt-0" />
    </>
  );
}
