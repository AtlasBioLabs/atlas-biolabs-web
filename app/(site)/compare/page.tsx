import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { comparisonPages } from "@/lib/seo-resource-data";
import { createPageMetadata, getBreadcrumbSchema } from "@/lib/seo";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = createPageMetadata({
  title: "Peptide Comparison Guides",
  description:
    "Explore Atlas BioLabs comparison guides covering peptide sourcing context, documentation expectations, MOQ planning, and quote-ready product comparisons.",
  path: "/compare",
  keywords: [
    "peptide comparison guides",
    "peptide supplier comparisons",
    "Atlas BioLabs comparison pages",
  ],
});

export default function CompareHubPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const comparisonEntries = Object.values(comparisonPages);
  const collectionSchema = collectionPageJsonLd({
    name: "Atlas BioLabs Comparison Guides",
    description:
      "Comparison guides for peptide buyers evaluating categories, documentation expectations, and quote considerations.",
    url: "https://www.atlasbiolabs.co/compare",
  });
  const itemListSchema = itemListJsonLd(
    comparisonEntries.map((page, index) => ({
      name: page.h1,
      url: `https://www.atlasbiolabs.co${page.path}`,
      position: index + 1,
    }))
  );

  return (
    <>
      <JsonLd id="compare-breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="compare-collection-schema" data={collectionSchema} />
      <JsonLd id="compare-itemlist-schema" data={itemListSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Compare
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Peptide Comparison Guides for Commercial Buyers
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            These comparison pages help buyers review category fit, documentation
            expectations, MOQ considerations, and quote planning without turning
            comparisons into thin or claim-driven content.
          </p>
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Comparison Library"
        title="Choose the comparison that matches your sourcing question"
        description="Each comparison page connects products, categories, and buyer guides so the comparison can move into real commercial follow-up."
        links={comparisonEntries.map((page) => ({
          title: page.h1,
          href: page.path,
          description: page.description,
          eyebrow: "Comparison",
        }))}
        className="pt-10"
      />
    </>
  );
}
