import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["research-peptide-supplier"].title,
  description: topLevelSeoPages["research-peptide-supplier"].description,
  path: topLevelSeoPages["research-peptide-supplier"].path,
  keywords: [
    "research peptides",
    "peptide supplier research",
    "documentation support",
    "research supply",
  ],
});

export default function ResearchPeptideSupplierPage() {
  const page = {
    ...topLevelSeoPages["research-peptide-supplier"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
