import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["custom-peptide-sourcing"].title,
  description: topLevelSeoPages["custom-peptide-sourcing"].description,
  path: topLevelSeoPages["custom-peptide-sourcing"].path,
  keywords: [
    "custom peptide sourcing",
    "non-catalog peptides",
    "custom peptide requests",
    "quote-led sourcing",
  ],
});

export default function CustomPeptideSourcingPage() {
  const page = {
    ...topLevelSeoPages["custom-peptide-sourcing"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
