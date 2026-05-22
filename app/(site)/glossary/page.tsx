import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { createPageMetadata, getBreadcrumbSchema } from "@/lib/seo";
import { glossaryEntries } from "@/lib/seo-resource-data";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = createPageMetadata({
  title: "Peptide Sourcing Glossary",
  description:
    "Browse the Atlas BioLabs glossary for peptide sourcing, documentation, MOQ, lead time, batch, and quality terms used by qualified B2B buyers.",
  path: "/glossary",
  keywords: [
    "peptide glossary",
    "B2B peptide sourcing terms",
    "Atlas BioLabs glossary",
  ],
});

export default function GlossaryIndexPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const glossaryItems = Object.values(glossaryEntries);
  const collectionSchema = collectionPageJsonLd({
    name: "Atlas BioLabs Peptide Sourcing Glossary",
    description:
      "Definitions and buyer-facing context for documentation, supply, and peptide sourcing terms.",
    url: "https://www.atlasbiolabs.co/glossary",
  });
  const itemListSchema = itemListJsonLd(
    glossaryItems.map((entry, index) => ({
      name: entry.term,
      url: `https://www.atlasbiolabs.co/glossary/${entry.slug}`,
      position: index + 1,
    }))
  );

  return (
    <>
      <JsonLd id="glossary-breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="glossary-collection-schema" data={collectionSchema} />
      <JsonLd id="glossary-itemlist-schema" data={itemListSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Glossary
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Peptide Sourcing Glossary for Commercial Buyers
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Use this glossary to understand the documentation, supply, and
            catalog terms Atlas BioLabs uses across product pages, buyer guides,
            and quality-related resources.
          </p>
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Glossary Library"
        title="Explore the terms buyers ask about most often"
        description="Each entry explains the term, why it matters for B2B buyers, and where it fits in the documentation and quote workflow."
        links={glossaryItems.map((entry) => ({
          title: entry.term,
          href: `/glossary/${entry.slug}`,
          description: entry.description,
          eyebrow: "Glossary",
        }))}
        className="pt-10"
      />
    </>
  );
}
