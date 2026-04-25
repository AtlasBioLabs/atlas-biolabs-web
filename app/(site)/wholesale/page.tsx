import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getStaticBreadcrumbItems,
} from "@/lib/seo";
import {
  featuredProductSlugs,
  productCategories,
  products,
  wholesaleCta,
  wholesaleHighlights,
  wholesaleIntro,
  wholesaleSteps,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Wholesale Peptides",
  path: "/wholesale",
  description:
    "Request wholesale peptide and bulk sourcing support from Atlas BioLabs with MOQ planning, category and product pathways, qualified partner sourcing in China, and documentation-backed supply for U.S. and international buyers.",
  keywords: [
    "wholesale peptides",
    "bulk peptide supplier",
    "bulk peptide sourcing",
    "peptide recurring supply",
  ],
});

export default function WholesalePage() {
  const breadcrumbItems = getStaticBreadcrumbItems("wholesale");
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const wholesaleLinkedProducts = featuredProductSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is (typeof products)[number] => product !== undefined)
    .filter((product) =>
      ["retatrutide", "klow-glow-blend", "tesamorelin"].includes(product.slug)
    )
    .slice(0, 3);
  const wholesaleLinkedCategories = productCategories
    .filter((category) =>
      [
        "signal-peptides",
        "growth-repair-peptides",
        "metabolic-advanced-peptides",
        "trending-emerging-peptides",
      ].includes(
        category.id
      )
    )
    .slice(0, 4);

  return (
    <>
      <JsonLd id="wholesale-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Breadcrumbs items={breadcrumbItems} />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Wholesale
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
              {wholesaleIntro.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {wholesaleIntro.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                Controlled vial handling
              </span>
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                Volume planning with documentation context
              </span>
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                U.S. and international bulk support
              </span>
            </div>
          </div>

          <article className="surface-card overflow-hidden">
            <div className="relative min-h-[360px]">
              <Image
                src="/images/lab-hero.jpg"
                alt="Supply operations specialist handling packaged inventory in a laboratory-informed commercial environment."
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/88 via-[#071322]/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                  Laboratory-Informed Supply Context
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/84">
                  We handle wholesale supply with clear operational context
                  around vial handling, batch records, laboratory discipline,
                  and buyer communication built for repeat commercial accounts.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container grid gap-5 md:grid-cols-3">
          {wholesaleHighlights.map((highlight) => (
            <article key={highlight.title} className="surface-card p-6">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                {highlight.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card overflow-hidden p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
                  Bulk Quote Workflow
                </h2>
                <ol className="mt-5 grid gap-3 md:grid-cols-2">
                  {wholesaleSteps.map((step, index) => (
                    <li
                      key={step}
                      className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
                    >
                      <span className="mr-2 font-semibold text-[var(--brand-blue)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border/70">
                <Image
                  src="/images/wholesale-vials.jpg"
                  alt="Close-up of gloved hands handling a sealed vial in a laboratory setting."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/82 via-[#071322]/24 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                    Controlled Handling
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/84">
                    This reflects the care we bring to vial handling, documentation alignment, and buyer-ready fulfillment.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Recurring Programs
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
              We stay organized when volume starts to scale
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Once an account moves beyond a one-off order, we focus on cadence,
              clearer communication, and steadier handoff between sourcing,
              documentation, technical review, and commercial support so repeat
              programs feel managed instead of improvised.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "Forecast-led MOQ planning for pilot, validation, and recurring supply windows",
                "Commercial coordination tied to account history",
                "Documentation support aligned with recurring supply windows and batch continuity",
                "Direct follow-up when quantity or timing shifts",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3 text-sm text-[var(--brand-navy)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card overflow-hidden">
            <div className="relative min-h-[300px] border-b border-border/70">
              <Image
                src="/images/sales-support.jpg"
                alt="Account support specialist coordinating follow-up for laboratory-informed peptide supply programs."
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 38vw"
              />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Account Continuity
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We built our wholesale flow so recurring accounts feel supported, not handed off into silence after the first quote.
              </p>
            </div>
          </article>
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Wholesale Resources"
        title="Review Product, Quality, and Pricing Context Before You Scale"
        description="These pages help wholesale buyers connect recurring supply planning with product selection, category review, documentation support, and pricing strategy."
        links={[
          {
            title: "Shop Peptides",
            href: "/shop",
            description:
              "Browse wholesale-ready peptide listings with MOQ, pack size, and product-level sourcing context.",
            eyebrow: "Catalog",
          },
          ...wholesaleLinkedCategories.map((category) => ({
            title: category.label,
            href: `/categories/${category.id}`,
            description: `${category.description} category pages with product-level supply context and direct links into rankable product pages.`,
            eyebrow: "Category",
          })),
          ...wholesaleLinkedProducts.map((product) => ({
            title: product.name,
            href: `/shop/${product.slug}`,
            description: product.shortDescription,
            eyebrow: "Product",
          })),
          {
            title: "Peptide Pricing Explained",
            href: "/blog/peptide-pricing-explained",
            description:
              "Understand the cost drivers that shape peptide pricing across volume tiers and supply formats.",
            eyebrow: "Buyer Guide",
          },
        ]}
      />

      <CtaSection content={wholesaleCta} className="pt-10" />
    </>
  );
}
