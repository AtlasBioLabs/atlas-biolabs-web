import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { ProductInlineQuoteForm } from "@/components/site/product-inline-quote-form";
import { ProductPurchaseActions } from "@/components/site/product-purchase-actions";
import { Button } from "@/components/ui/button";
import { getRelevantBlogPostsForProduct } from "@/lib/blog";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getProductBreadcrumbItems,
  getProductIntro,
  getProductSchema,
  mergeKeywords,
} from "@/lib/seo";
import {
  getRelatedProducts,
  productCategories,
  products,
  type Product,
} from "@/lib/site-content";

type ShopDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

function toSentenceList(values: string[]) {
  return values
    .map((value) => value.charAt(0).toLowerCase() + value.slice(1))
    .join(", ");
}

export async function generateMetadata({
  params,
}: ShopDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return createPageMetadata({
      title: "Product Not Found",
      description: "The requested peptide listing could not be found.",
      path: "/shop",
      noIndex: true,
    });
  }

  const categoryLabel =
    productCategories.find((category) => category.id === product.category)?.label ??
    product.category;

  return createPageMetadata({
    title: `${product.name} Peptide Supplier`,
    path: `/shop/${product.slug}`,
    description: `Source ${product.name} through Atlas BioLabs with documentation support, batch transparency, and scalable commercial supply options.`,
    keywords: mergeKeywords([
      product.name,
      `${product.name} peptide supplier`,
      `${product.name} supplier`,
      `${categoryLabel} supplier`,
      `${product.name} wholesale`,
      `${product.name} sourcing`,
      "commercial peptide supply",
    ]),
    image: product.image,
    imageAlt: `${product.name} peptide product image from Atlas BioLabs`,
  });
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category =
    productCategories.find((entry) => entry.id === product.category) ??
    productCategories[0];
  const categoryLabel = category.label;
  const categoryHref = `/categories/${product.category}`;
  const quoteHref = "/request-quote";
  const productIntro = getProductIntro(product.name);
  const relatedProducts = getRelatedProducts(product, 4);
  const relatedArticles = getRelevantBlogPostsForProduct(product, 3);
  const breadcrumbItems = getProductBreadcrumbItems(product, categoryLabel);
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const productSchema = getProductSchema(product, categoryLabel);

  return (
    <>
      <JsonLd id={`product-schema-${product.slug}`} data={productSchema} />
      <JsonLd id={`product-breadcrumb-${product.slug}`} data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f7faff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />

          <Button asChild variant="ghost" className="mb-6 px-0 text-sm">
            <Link href="/shop">Back to Shop</Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-[#f0f5ff]">
              <Image
                src={product.image}
                alt={`${product.name} peptide product image from Atlas BioLabs`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </div>

            <div className="space-y-5">
              <Link
                href={categoryHref}
                className="inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)] hover:underline"
              >
                {categoryLabel}
              </Link>
              <h1 className="text-4xl leading-tight font-semibold text-[var(--brand-navy)]">
                {product.name}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                {productIntro}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Atlas BioLabs places this SKU inside the {categoryLabel.toLowerCase()} catalog with visible price entry, MOQ, lead time, pack size, and documentation context so commercial buyers can move from product review into quote follow-up with less friction.
              </p>
              <div className="rounded-xl border border-border/70 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Starting from
                </p>
                <p className="mt-1 text-2xl font-semibold text-[var(--brand-navy)]">
                  ${product.priceFrom} USD
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{product.priceRange}</p>
              </div>

              <ProductPurchaseActions
                product={{
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  priceFrom: product.priceFrom,
                  moq: product.moq,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              Product Overview
            </h2>
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {productIntro}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.overview} Atlas BioLabs lists {product.name} within the{" "}
                <Link
                  href={categoryHref}
                  className="text-[var(--brand-blue)] hover:underline"
                >
                  {categoryLabel}
                </Link>{" "}
                category so buyers can compare product role, supply format,
                pricing entry points, and documentation requirements in one
                place.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Across technical literature, peptide research discussions, formulation-development planning, and category-level sourcing reviews, {product.name} is commonly evaluated in contexts such as {toSentenceList(product.commonApplications)}. We surface that context here so buyers can understand how the peptide is usually positioned inside health-adjacent, cosmetic, signaling, metabolic, or repair-focused discussions before they move into sampling, formulation review, or quote discussions.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.mechanismInsight}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Teams reviewing this SKU often compare {toSentenceList(product.functionalRole)} alongside factors such as {toSentenceList(product.keyCharacteristics)} when building formulation-development, sourcing, validation, and repeat-order shortlists for more serious technical, wellness-adjacent, and commercially credible peptide portfolios.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              Key Details
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  label: "Product Name",
                  value: product.name,
                },
                {
                  label: "Category",
                  value: categoryLabel,
                  href: categoryHref,
                },
                {
                  label: "Available Pack Sizes",
                  value: product.packSizes.join(", "),
                },
                {
                  label: "MOQ",
                  value: `${product.moq} units`,
                },
                {
                  label: "Lead Time",
                  value: product.leadTime,
                },
                {
                  label: "Documentation",
                  value: "Available on request",
                },
              ].map((detail) => (
                <article
                  key={detail.label}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                    {detail.label}
                  </p>
                  {detail.href ? (
                    <Link
                      href={detail.href}
                      className="mt-2 block text-sm font-medium text-[var(--brand-navy)] hover:text-[var(--brand-blue)]"
                    >
                      {detail.value}
                    </Link>
                  ) : (
                    <p className="mt-2 text-sm font-medium text-[var(--brand-navy)]">
                      {detail.value}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Commercial Supply Context
            </h2>
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Atlas BioLabs presents {product.name} for commercial sourcing, research applications, and formulation development. This page is written to help buyers map the peptide to common research, formulation, and evaluation contexts such as {toSentenceList(product.commonApplications)} while keeping the content commercially focused, academically grounded, and documentation-aligned.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                In practical sourcing terms, {product.name} is usually reviewed by {toSentenceList(product.intendedBuyerType)} who need visibility into category fit, technical positioning, reorder planning, and documentation readiness before moving into quote discussions tied to health-adjacent, formulation-led, or research-aware product programs.
              </p>
            </div>
          </article>

          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Research and Formulation Context
            </h2>
            <div className="mt-4 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                  Common Contexts
                </p>
                <ul className="mt-3 space-y-2">
                  {product.commonApplications.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                  Functional Positioning
                </p>
                <ul className="mt-3 space-y-2">
                  {product.functionalRole.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                  Key Comparison Points
                </p>
                <ul className="mt-3 space-y-2">
                  {product.keyCharacteristics.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Documentation and Batch Transparency
            </h2>
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Atlas Labs reviews incoming product records for {product.name} before the SKU advances through our commercial workflow. That review focuses on documentation consistency, batch transparency, and buyer-ready support so the sourcing narrative stays clear from first inquiry through repeat-order planning.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Documentation is available on request for qualified inquiries, and repeat buyers can use the page as a stable reference point when comparing lot context, product specifications, and reorder planning across the catalog.
              </p>
            </div>
          </article>

          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Documentation Support Notes
            </h2>
            <ul className="mt-4 space-y-3">
              {product.purityDocumentation.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Packaging and Supply Options
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.name} is supplied in inquiry-led formats so buyers can align pack size, volume plan, destination market, and documentation needs before commercial supply moves forward. Atlas BioLabs uses this structure to reflect how quote-led sourcing works for teams running pilot evaluation, formulation-development, or recurring supply programs.
            </p>
            <ul className="mt-4 space-y-3">
              {product.packSizes.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Ordering Structure
            </h2>
            <ul className="mt-4 space-y-3">
              {[
                `MOQ starts at ${product.moq} units`,
                `Typical lead time: ${product.leadTime}`,
                `Commercial pricing reference: ${product.priceRange}`,
                "Ordering is handled through direct inquiry or quote review",
                "Documentation support is available on request for approved buyers",
                product.storageHandling[0],
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                Related Products
              </h2>
              <Link
                href={categoryHref}
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                View all {categoryLabel}
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedCategoryLabel =
                  productCategories.find(
                    (entry) => entry.id === relatedProduct.category
                  )?.label ?? relatedProduct.category;

                return (
                  <article
                    key={relatedProduct.slug}
                    className="rounded-xl border border-border/70 bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
                      <Link
                        href={`/categories/${relatedProduct.category}`}
                        className="hover:underline"
                      >
                        {relatedCategoryLabel}
                      </Link>
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-[var(--brand-navy)]">
                      <Link href={`/shop/${relatedProduct.slug}`} className="hover:underline">
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {relatedProduct.shortDescription}
                    </p>
                  </article>
                );
              })}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                Related Articles
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                Browse all articles
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((article) => (
                <article
                  key={article.slug}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
                    Buyer Guide
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[var(--brand-navy)]">
                    <Link href={`/blog/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {article.description}
                  </p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                CTA
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--brand-navy)]">
                Request Quote or Add {product.name} to Inquiry
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Use the product page as your reference point, then continue into quote review or the inquiry cart with the category, pack size, MOQ, and documentation context already aligned.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <ProductPurchaseActions
                product={{
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  priceFrom: product.priceFrom,
                  moq: product.moq,
                }}
              />
              <Button asChild variant="ghost" className="mt-2 px-0 text-sm">
                <Link href="/custom-requests">Need a non-catalog format instead?</Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <ProductInlineQuoteForm
            productName={product.name}
            defaultQuantity={`${product.moq} units`}
            fullQuoteHref={quoteHref}
          />
        </div>
      </section>
    </>
  );
}
