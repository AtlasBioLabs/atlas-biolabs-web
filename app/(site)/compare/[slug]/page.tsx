import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoContentPage } from "@/components/site/seo-content-page";
import {
  comparisonPages,
  defaultQuoteCta,
  getComparisonBreadcrumbs,
  getStaticPageResourcePanels,
} from "@/lib/seo-resource-data";
import { createPageMetadata } from "@/lib/seo";

type ComparisonPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(comparisonPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = comparisonPages[slug];

  if (!page) {
    return createPageMetadata({
      title: "Comparison Not Found",
      description: "The requested comparison page could not be found.",
      path: "/compare",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: [page.h1, "peptide comparison", "Atlas BioLabs"],
  });
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const page = comparisonPages[slug];

  if (!page) {
    notFound();
  }

  return (
    <SeoContentPage
      id={`comparison-${page.slug}`}
      eyebrow={page.eyebrow}
      title={page.h1}
      intro={page.intro}
      description={page.description}
      path={page.path}
      breadcrumbItems={getComparisonBreadcrumbs(page)}
      sections={page.sections}
      complianceNote={page.complianceNote}
      comparisonTable={page.comparisonTable}
      resourcePanels={getStaticPageResourcePanels(page)}
      cta={page.cta ?? defaultQuoteCta}
    />
  );
}
