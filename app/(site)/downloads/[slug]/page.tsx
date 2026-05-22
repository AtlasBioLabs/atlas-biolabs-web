import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoContentPage } from "@/components/site/seo-content-page";
import {
  downloadGuides,
  getDownloadBreadcrumbs,
  getPriorityLinks,
  resolveArticleLinks,
  resolveCategoryLinks,
  resolveProductLinks,
} from "@/lib/seo-resource-data";
import { createPageMetadata } from "@/lib/seo";

type DownloadGuidePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(downloadGuides).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DownloadGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = downloadGuides[slug];

  if (!guide) {
    return createPageMetadata({
      title: "Download Not Found",
      description: "The requested download page could not be found.",
      path: "/downloads",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/downloads/${guide.slug}`,
    keywords: [guide.h1, "Atlas BioLabs download", "buyer guide"],
  });
}

export default async function DownloadGuidePage({
  params,
}: DownloadGuidePageProps) {
  const { slug } = await params;
  const guide = downloadGuides[slug];

  if (!guide) {
    notFound();
  }

  return (
    <SeoContentPage
      id={`download-${guide.slug}`}
      eyebrow="Download Resource"
      title={guide.h1}
      intro={guide.intro}
      description={guide.description}
      path={`/downloads/${guide.slug}`}
      breadcrumbItems={getDownloadBreadcrumbs(guide)}
      sections={[
        {
          title: "What the buyer will learn",
          paragraphs: [
            "Use this resource as a preparation guide before moving into a supplier comparison, documentation review, or commercial quote request.",
          ],
          bullets: guide.learnItems,
        },
        {
          title: "How to request the resource",
          paragraphs: [
            "Atlas BioLabs does not yet use a separate email-capture workflow for these resources. For now, request the guide through the quote path and mention the resource name so the team knows what context you need.",
            "That approach keeps the resource tied to a real commercial conversation instead of isolating it from the buyer's actual sourcing questions.",
          ],
        },
      ]}
      complianceNote="Atlas BioLabs downloadable resource pages are provided for commercial sourcing, documentation, and buyer-preparation context only. No medical, dosing, or human-use guidance is provided."
      resourcePanels={[
        {
          eyebrow: "Related Resources",
          title: "Pages to review before requesting the guide",
          description:
            "These links help buyers connect the guide to product pages, documentation references, and broader category review.",
          links: [
            ...getPriorityLinks(["requestQuote", "shop", "peptideDocumentation"]),
            ...resolveProductLinks(guide.relatedProductSlugs),
            ...resolveCategoryLinks(guide.relatedCategorySlugs),
            ...resolveArticleLinks(guide.relatedArticleSlugs),
          ],
        },
      ]}
      cta={{
        eyebrow: "Request the guide",
        title: "Ask for this resource during your quote conversation",
        description:
          "Mention the guide name, your target products, and any documentation or MOQ questions so Atlas BioLabs can respond with more useful buyer support.",
        primaryLabel: "Request Quote",
        primaryHref: "/request-quote",
        secondaryLabel: "Browse Blog",
        secondaryHref: "/blog",
      }}
    />
  );
}
