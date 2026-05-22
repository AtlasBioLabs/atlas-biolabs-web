import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoContentPage } from "@/components/site/seo-content-page";
import {
  getGlossaryBreadcrumbs,
  glossaryEntries,
  getPriorityLinks,
  resolveArticleLinks,
  resolveCategoryLinks,
  resolveProductLinks,
} from "@/lib/seo-resource-data";
import { createPageMetadata } from "@/lib/seo";

type GlossaryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(glossaryEntries).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GlossaryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = glossaryEntries[slug];

  if (!entry) {
    return createPageMetadata({
      title: "Glossary Entry Not Found",
      description: "The requested glossary entry could not be found.",
      path: "/glossary",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: entry.title,
    description: entry.description,
    path: `/glossary/${entry.slug}`,
    keywords: [entry.term, "Atlas BioLabs glossary", "peptide sourcing terms"],
  });
}

export default async function GlossaryEntryPage({ params }: GlossaryPageProps) {
  const { slug } = await params;
  const entry = glossaryEntries[slug];

  if (!entry) {
    notFound();
  }

  return (
    <SeoContentPage
      id={`glossary-${entry.slug}`}
      eyebrow="Glossary"
      title={entry.term}
      intro={entry.definition}
      description={entry.description}
      path={`/glossary/${entry.slug}`}
      breadcrumbItems={getGlossaryBreadcrumbs(entry)}
      sections={[
        {
          title: `Why ${entry.term} matters for B2B buyers`,
          paragraphs: [entry.buyerWhyItMatters],
        },
        {
          title: "Documentation context",
          paragraphs: [entry.documentationContext],
        },
        {
          title: "Common buyer questions",
          paragraphs: [
            "These are the kinds of questions Atlas BioLabs expects qualified buyers to raise when the term becomes important in a sourcing workflow.",
          ],
          bullets: entry.commonBuyerQuestions,
        },
      ]}
      complianceNote="Atlas BioLabs glossary entries explain sourcing and documentation language for qualified commercial buyers only. They do not provide medical, dosing, or human-use guidance."
      resourcePanels={[
        {
          eyebrow: "Documentation Resources",
          title: "Pages That Help Put the Term Into Practice",
          description:
            "These links connect the glossary entry to documentation support, product pages, category hubs, and buyer guides.",
          links: [
            ...getPriorityLinks(["peptideDocumentation"]),
            ...resolveProductLinks(entry.relatedProductSlugs),
            ...resolveCategoryLinks(entry.relatedCategorySlugs),
            ...resolveArticleLinks(entry.relatedArticleSlugs),
          ],
        },
      ]}
      cta={{
        eyebrow: "Need more detail?",
        title: "Use the glossary, then ask the right quote and documentation questions",
        description:
          "Atlas BioLabs can help you connect the terminology to product selection, documentation review, and quote-led sourcing follow-up.",
        primaryLabel: "Request Quote",
        primaryHref: "/request-quote",
        secondaryLabel: "Read Documentation Guide",
        secondaryHref: "/peptide-documentation",
      }}
    />
  );
}
