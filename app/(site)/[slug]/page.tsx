import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoContentPage } from "@/components/site/seo-content-page";
import {
  defaultQuoteCta,
  getStaticPageResourcePanels,
  getTopLevelBreadcrumbs,
  topLevelSeoPages,
} from "@/lib/seo-resource-data";
import { createPageMetadata } from "@/lib/seo";

type StaticSeoPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(topLevelSeoPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StaticSeoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = topLevelSeoPages[slug];

  if (!page) {
    return createPageMetadata({
      title: "Page Not Found",
      description: "The requested Atlas BioLabs page could not be found.",
      path: "/",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: [page.h1, page.title, "Atlas BioLabs", "peptide sourcing"],
  });
}

export default async function StaticSeoPage({ params }: StaticSeoPageProps) {
  const { slug } = await params;
  const page = topLevelSeoPages[slug];

  if (!page) {
    notFound();
  }

  return (
    <SeoContentPage
      id={`static-${page.slug}`}
      eyebrow={page.eyebrow}
      title={page.h1}
      intro={page.intro}
      description={page.description}
      path={page.path}
      breadcrumbItems={getTopLevelBreadcrumbs(page)}
      schemaType={page.schemaType}
      sections={page.sections}
      complianceNote={page.complianceNote}
      comparisonTable={page.comparisonTable}
      resourcePanels={getStaticPageResourcePanels(page)}
      cta={page.cta ?? defaultQuoteCta}
    />
  );
}
