import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages.faq.title,
  description: topLevelSeoPages.faq.description,
  path: topLevelSeoPages.faq.path,
  keywords: [
    "peptide FAQ",
    "frequently asked questions",
    "peptide sourcing questions",
    "Atlas BioLabs FAQ",
  ],
});

export default function FaqPage() {
  const page = {
    ...topLevelSeoPages.faq,
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
