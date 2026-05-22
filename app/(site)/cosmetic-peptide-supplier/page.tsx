import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["cosmetic-peptide-supplier"].title,
  description: topLevelSeoPages["cosmetic-peptide-supplier"].description,
  path: topLevelSeoPages["cosmetic-peptide-supplier"].path,
  keywords: [
    "cosmetic peptides",
    "peptide supplier cosmetic",
    "formulation teams",
    "skincare ingredients",
  ],
});

export default function CosmeticPeptideSupplierPage() {
  const page = {
    ...topLevelSeoPages["cosmetic-peptide-supplier"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
