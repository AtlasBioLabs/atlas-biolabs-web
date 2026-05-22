import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["shipping-and-lead-times"].title,
  description: topLevelSeoPages["shipping-and-lead-times"].description,
  path: topLevelSeoPages["shipping-and-lead-times"].path,
  keywords: [
    "shipping",
    "lead times",
    "supply coordination",
    "peptide delivery",
  ],
});

export default function ShippingAndLeadTimesPage() {
  const page = {
    ...topLevelSeoPages["shipping-and-lead-times"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
