import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["wholesale-peptides"].title,
  description: topLevelSeoPages["wholesale-peptides"].description,
  path: topLevelSeoPages["wholesale-peptides"].path,
  keywords: [
    "wholesale peptides",
    "bulk peptide supply",
    "peptide MOQ",
    "bulk sourcing",
  ],
});

export default function WholesalePeptidesPage() {
  const page = {
    ...topLevelSeoPages["wholesale-peptides"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
