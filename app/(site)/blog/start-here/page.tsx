import type { Metadata } from "next";

import { SeoContentPage } from "@/components/site/seo-content-page";
import {
  blogStartHerePage,
  defaultQuoteCta,
  getStaticPageResourcePanels,
} from "@/lib/seo-resource-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: blogStartHerePage.title,
  description: blogStartHerePage.description,
  path: blogStartHerePage.path,
  keywords: [
    "Atlas BioLabs start here",
    "how to use Atlas BioLabs",
    "peptide buyer guide",
  ],
});

export default function BlogStartHerePage() {
  return (
    <SeoContentPage
      id="blog-start-here"
      eyebrow={blogStartHerePage.eyebrow}
      title={blogStartHerePage.h1}
      intro={blogStartHerePage.intro}
      description={blogStartHerePage.description}
      path={blogStartHerePage.path}
      breadcrumbItems={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: blogStartHerePage.h1, path: blogStartHerePage.path },
      ]}
      sections={blogStartHerePage.sections}
      complianceNote={blogStartHerePage.complianceNote}
      resourcePanels={getStaticPageResourcePanels(blogStartHerePage)}
      cta={blogStartHerePage.cta ?? defaultQuoteCta}
    />
  );
}
