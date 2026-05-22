import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { createPageMetadata, getBreadcrumbSchema } from "@/lib/seo";
import { downloadGuides } from "@/lib/seo-resource-data";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = createPageMetadata({
  title: "Buyer Guides and Download Resources",
  description:
    "Browse Atlas BioLabs download resources for supplier evaluation, COA review, bulk quote preparation, and cosmetic peptide buying workflows.",
  path: "/downloads",
  keywords: [
    "Atlas BioLabs downloads",
    "peptide supplier checklist",
    "COA review checklist",
  ],
});

export default function DownloadsIndexPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads" },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const guides = Object.values(downloadGuides);
  const collectionSchema = collectionPageJsonLd({
    name: "Atlas BioLabs Download Resources",
    description:
      "Lead magnets and buyer guides for peptide supplier evaluation, documentation review, and quote preparation.",
    url: "https://www.atlasbiolabs.co/downloads",
  });
  const itemListSchema = itemListJsonLd(
    guides.map((guide, index) => ({
      name: guide.h1,
      url: `https://www.atlasbiolabs.co/downloads/${guide.slug}`,
      position: index + 1,
    }))
  );

  return (
    <>
      <JsonLd id="downloads-breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="downloads-collection-schema" data={collectionSchema} />
      <JsonLd id="downloads-itemlist-schema" data={itemListSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Downloads
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Downloadable Buyer Resources
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            These resource pages are designed to help commercial buyers prepare
            better supplier comparisons, documentation reviews, and quote
            requests before direct follow-up with Atlas BioLabs.
          </p>
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Resource Library"
        title="Buyer checklists and preparation guides"
        description="Use these landing pages to understand what each resource covers, then request the guide through the current Atlas BioLabs quote workflow."
        links={guides.map((guide) => ({
          title: guide.h1,
          href: `/downloads/${guide.slug}`,
          description: guide.description,
          eyebrow: "Guide",
        }))}
        className="pt-10"
      />
    </>
  );
}
