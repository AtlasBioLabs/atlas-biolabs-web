import type { Metadata } from "next";

import { StaticSeoPageRenderer } from "@/components/site/static-seo-page";
import { createPageMetadata } from "@/lib/seo";
import { topLevelSeoPages, defaultQuoteCta } from "@/lib/seo-resource-data";

export const metadata: Metadata = createPageMetadata({
  title: topLevelSeoPages["coa-verification"].title,
  description: topLevelSeoPages["coa-verification"].description,
  path: topLevelSeoPages["coa-verification"].path,
  keywords: [
    "COA verification",
    "batch verification",
    "document verification",
    "verification codes",
  ],
});

export default function CoaVerificationPage() {
  const page = {
    ...topLevelSeoPages["coa-verification"],
    cta: defaultQuoteCta,
  };

  return <StaticSeoPageRenderer page={page} />;
}
