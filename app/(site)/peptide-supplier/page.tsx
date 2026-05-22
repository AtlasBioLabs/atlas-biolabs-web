import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["peptide-supplier"].title,
  description: topLevelSeoPages["peptide-supplier"].description,
  path: topLevelSeoPages["peptide-supplier"].path,
  keywords: [
    "peptide supplier",
    "commercial peptide sourcing",
    "B2B peptide supplier",
    "qualified peptide sourcing",
  ],
});

export default function PeptideSupplierPage() {
  const page = {
    ...topLevelSeoPages["peptide-supplier"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
