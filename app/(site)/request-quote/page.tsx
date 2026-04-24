import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { QuoteRequestForm } from "@/components/site/quote-request-form";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getStaticBreadcrumbItems,
} from "@/lib/seo";

type RequestQuotePageProps = {
  searchParams: Promise<{
    product?: string | string[];
    qty?: string | string[];
  }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Request Peptide Quote",
  path: "/request-quote",
  description:
    "Submit a peptide quote request with product, quantity, destination, and documentation needs to receive Atlas BioLabs commercial pricing and sourcing support for U.S. and international accounts.",
  keywords: [
    "request peptide quote",
    "peptide MOQ quote",
    "Atlas BioLabs quote form",
  ],
});

function getFirstValue(value: string | string[] | undefined) {
  if (!value) {
    return "";
  }

  return Array.isArray(value) ? value[0] ?? "" : value;
}

export default async function RequestQuotePage({
  searchParams,
}: RequestQuotePageProps) {
  const params = await searchParams;
  const product = getFirstValue(params.product);
  const qty = getFirstValue(params.qty);
  const breadcrumbItems = getStaticBreadcrumbItems("requestQuote");
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd id="request-quote-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Request Quote
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Get a Commercial Peptide Quote
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Submit your product interest and quantity needs. We will follow up with MOQ alignment, sourcing details, documentation support options, and commercial terms.
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
          <QuoteRequestForm
            initialProduct={product}
            initialQuantity={qty}
          />
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Quote Planning"
        title="Use These Pages to Tighten Product and Quantity Selection"
        description="These links help buyers move from quote drafting into product comparison, category review, and documentation planning."
        links={[
          {
            title: "Shop Peptides",
            href: "/shop",
            description:
              "Compare product pages with MOQ, pack size, sourcing, and documentation support details.",
            eyebrow: "Catalog",
          },
          {
            title: "Browse Categories",
            href: "/categories",
            description:
              "Review peptide groups before you decide which SKUs to include in a quote request.",
            eyebrow: "Categories",
          },
          {
            title: "Quality Assurance",
            href: "/quality-assurance",
            description:
              "See how Atlas Labs handles documentation checks, release review, and batch transparency support.",
            eyebrow: "Documentation",
          },
          {
            title: "Peptide Supply Blog",
            href: "/blog",
            description:
              "Review sourcing, pricing, and supplier-evaluation guides before you finalize your quote request.",
            eyebrow: "Blog",
          },
        ]}
      />
    </>
  );
}
