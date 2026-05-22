import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["peptide-documentation"].title,
  description: topLevelSeoPages["peptide-documentation"].description,
  path: topLevelSeoPages["peptide-documentation"].path,
  keywords: [
    "peptide documentation",
    "COA documentation",
    "batch documentation",
    "peptide transparency",
  ],
});

export default function PeptideDocumentationPage() {
  const page = {
    ...topLevelSeoPages["peptide-documentation"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
