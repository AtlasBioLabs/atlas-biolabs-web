import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/site/json-ld";
import { ProductInlineQuoteForm } from "@/components/site/product-inline-quote-form";
import { ProductPurchaseActions } from "@/components/site/product-purchase-actions";
import { Button } from "@/components/ui/button";
import { getRelevantBlogPostsForProduct } from "@/lib/blog";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getProductSchema,
  getProductSeoCopy,
  mergeKeywords,
} from "@/lib/seo";
import {
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
    description: `${product.name} is listed in our ${categoryLabel.toLowerCase()} catalog with structured peptide sourcing, MOQ ${product.moq}+ units, ${product.leadTime} lead time guidance, documentation support, and batch transparency for commercial buyers.`,
    keywords: mergeKeywords([
      product.name,
      `${categoryLabel} supplier`,
      `buy ${product.name}`,
      `${product.name} MOQ`,
      `${product.name} wholesale`,
      "peptide product page",
    ]),
    image: product.image,
    imageAlt: `${product.name} peptide supplier product graphic`,
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
  const quoteHref = `/request-quote?product=${encodeURIComponent(product.name)}&qty=${encodeURIComponent(`${product.moq} units`)}`;
  const seoCopy = getProductSeoCopy(product, categoryLabel);
  const relatedProducts = products
    .filter(
      (entry) => entry.category === product.category && entry.slug !== product.slug
    )
    .slice(0, 4);
  const relatedBlogPosts = getRelevantBlogPostsForProduct(product, 3);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: categoryLabel, path: categoryHref },
    { name: product.name, path: `/shop/${product.slug}` },
  ]);

  const productSchema = getProductSchema(product, categoryLabel);

  return (
    <>
      <JsonLd id={`product-schema-${product.slug}`} data={productSchema} />
      <JsonLd id={`product-breadcrumb-${product.slug}`} data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f7faff] to-white">
        <div className="site-container">
          <nav className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-[var(--brand-blue)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[var(--brand-blue)]">
              Shop
            </Link>
            <span>/</span>
            <Link href={categoryHref} className="hover:text-[var(--brand-blue)]">
              {categoryLabel}
            </Link>
            <span>/</span>
            <span className="text-[var(--brand-navy)]">{product.name}</span>
          </nav>

          <Button asChild variant="ghost" className="mb-6 px-0 text-sm">
            <Link href="/shop">Back to Shop</Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-[#f0f5ff]">
              <Image
                src={product.image}
                alt={`${product.name} peptide supplier product graphic`}
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
                {product.summary}
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
              Research-Style Product Profile
            </h2>
            <div className="mt-4 space-y-4">
              {seoCopy.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-5 text-sm text-[var(--brand-navy)]">
              Explore the{" "}
              <Link href={categoryHref} className="text-[var(--brand-blue)] hover:underline">
                {categoryLabel} category page
              </Link>{" "}
              for comparable options, then submit a{" "}
              <Link href={quoteHref} className="text-[var(--brand-blue)] hover:underline">
                prefilled quote request
              </Link>{" "}
              to confirm sourcing, pricing, and lead time alignment.
            </p>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.overview}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              We share associated-use commercial sourcing context only. You remain
              responsible for local compliance and use requirements.
            </p>
          </article>

          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Key Details</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.mechanismInsight}
            </p>
            <ul className="mt-4 space-y-3">
              {product.functionalRole.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
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
              Mechanism Insight
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.mechanismInsight}
            </p>
          </article>

          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Applications / Context
            </h2>
            <ul className="mt-4 space-y-3">
              {product.commonApplications.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-white px-4 py-3 text-sm text-[var(--brand-navy)]"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Buyers usually evaluate this peptide within the context of{" "}
              {product.intendedBuyerType.slice(0, 2).join(" and ").toLowerCase()}.
            </p>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Key Characteristics
            </h2>
            <ul className="mt-4 space-y-3">
              {product.keyCharacteristics.map((item) => (
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
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Packaging & MOQ</h2>
            <ul className="mt-4 space-y-3">
              <li className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]">
                MOQ: {product.moq} units
              </li>
              <li className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]">
                Lead time: {product.leadTime}
              </li>
              <li className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]">
                Starting price: ${product.priceFrom} USD
              </li>
              <li className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]">
                {product.priceRange}
              </li>
              <li className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]">
                Pack sizes: {product.packSizes.join(", ")}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Available Pack Sizes</h2>
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
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Documentation Support</h2>
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
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Storage and Handling</h2>
            <ul className="mt-4 space-y-3">
              {product.storageHandling.map((item) => (
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
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Intended Buyer Type</h2>
            <ul className="mt-4 space-y-3">
              {product.intendedBuyerType.map((item) => (
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
          <article className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Supply Notes
            </h2>
            <ul className="mt-4 grid gap-3 lg:grid-cols-3">
              {product.trustSupport.map((item) => (
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
                Related Blog Reading
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                View all articles
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {relatedBlogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <h3 className="text-base font-semibold text-[var(--brand-navy)]">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
                </article>
              ))}
            </div>
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
              {relatedProducts.map((relatedProduct) => (
                <article
                  key={relatedProduct.slug}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
                    {categoryLabel}
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
              ))}
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

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                Need a non-catalog variant?
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--brand-navy)]">
                Submit a custom peptide request
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Share custom sequence, format, or documentation requirements for sourcing support.
              </p>
            </div>
            <Button asChild className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]">
              <Link href="/custom-requests">Custom Peptide Request</Link>
            </Button>
          </article>
        </div>
      </section>
    </>
  );
}
