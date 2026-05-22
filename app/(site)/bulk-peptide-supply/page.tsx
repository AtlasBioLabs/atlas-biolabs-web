import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["bulk-peptide-supply"].title,
  description: topLevelSeoPages["bulk-peptide-supply"].description,
  path: topLevelSeoPages["bulk-peptide-supply"].path,
  keywords: [
    "bulk peptide supply",
    "bulk ordering",
    "qualified buyers",
    "bulk sourcing",
  ],
});

export default function BulkPeptideSupplyPage() {
  const page = {
    ...topLevelSeoPages["bulk-peptide-supply"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
