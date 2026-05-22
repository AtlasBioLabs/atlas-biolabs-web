import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages.compliance.title,
  description: topLevelSeoPages.compliance.description,
  path: topLevelSeoPages.compliance.path,
  keywords: [
    "compliance",
    "peptide compliance",
    "commercial communication",
    "Atlas BioLabs compliance",
  ],
});

export default function CompliancePage() {
  const page = {
    ...topLevelSeoPages.compliance,
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
