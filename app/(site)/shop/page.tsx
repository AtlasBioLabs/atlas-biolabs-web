import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { ShopCatalogClient } from "@/components/site/shop-catalog-client";
import { getAllBlogPosts } from "@/lib/blog";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getStaticBreadcrumbItems,
} from "@/lib/seo";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/schema";
import {
  productCategories,
  products,
  shopCta,
  shopIntro,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Peptide Catalog",
  path: "/shop",
  description:
    "Browse Atlas BioLabs peptide catalog for commercial sourcing, MOQ support, documentation, batch transparency, and quote-led B2B supply.",
  keywords: [
    "shop peptides",
    "peptide product catalog",
    "wholesale peptides",
    "peptide MOQ and bulk pricing",
    "peptide sourcing catalog",
  ],
});

const shopSupportLinks = [
  {
    title: "All Product Categories",
    href: "/categories",
    description:
      "Compare every product category as an indexable sourcing landing page with product counts and buyer guidance.",
    eyebrow: "Category Hub",
  },
  {
    title: "Peptide Supply Blog",
    href: "/blog",
    description:
      "Read sourcing, quality, pricing, compliance, and category guides for commercial peptide buyers.",
    eyebrow: "Blog",
  },
  {
    title: "Wholesale Peptide Supply",
    href: "/wholesale",
    description:
      "Review quote-led wholesale peptide supply support for recurring and volume-based B2B programs.",
    eyebrow: "Wholesale",
  },
  {
    title: "Quality Assurance",
    href: "/quality-assurance",
    description:
      "See how Atlas Labs supports documentation review, batch transparency, and quality-context workflows.",
    eyebrow: "Quality",
  },
  {
    title: "Request Quote",
    href: "/request-quote",
    description:
      "Share target products, quantity, destination, and documentation needs for direct commercial support.",
    eyebrow: "Quote",
  },
  {
    title: "Signal Peptides",
    href: "/categories/signal-peptides",
    description:
      "Browse peptide supplier listings for collagen-support and cosmetic formulation programs.",
    eyebrow: "Category",
  },
  {
    title: "Carrier Peptides",
    href: "/categories/carrier-peptides",
    description:
      "Compare carrier peptide products with pack size, MOQ, and documentation support details.",
    eyebrow: "Category",
  },
  {
    title: "Metabolic Peptides",
    href: "/categories/metabolic-advanced-peptides",
    description:
      "Review advanced peptide listings for trend-driven demand and structured quote planning.",
    eyebrow: "Category",
  },
  {
    title: "Trending & Emerging Peptides",
    href: "/categories/trending-emerging-peptides",
    description:
      "Compare current-demand peptides, blend-format listings, and newer advanced SKUs with status visibility and commercial sourcing context.",
    eyebrow: "Category",
  },
  {
    title: "Retatrutide",
    href: "/shop/retatrutide",
    description:
      "Review an emerging advanced peptide listing with visible pricing entry, MOQ, documentation support, and related article links.",
    eyebrow: "Product",
  },
  {
    title: "KLOW / Glow Blend",
    href: "/shop/klow-glow-blend",
    description:
      "Explore the blend-format listing with status visibility, pack-size guidance, and inquiry-led commercial sourcing context.",
    eyebrow: "Product",
  },
  ...getAllBlogPosts()
    .filter((post) =>
      ["peptide-supplier-guide", "peptide-pricing-explained", "how-to-buy-peptides"].includes(
        post.slug
      )
    )
    .map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      description: post.description,
      eyebrow: "Buyer Guide",
    })),
];

export default function ShopPage() {
  const breadcrumbItems = getStaticBreadcrumbItems("shop");
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const shopCollectionSchema = collectionPageJsonLd({
    name: "Peptide Catalog",
    description:
      "Atlas BioLabs peptide catalog for commercial sourcing, MOQ support, documentation, batch transparency, and quote-led B2B supply.",
    url: "https://www.atlasbiolabs.co/shop",
  });
  const shopItemListSchema = itemListJsonLd(
    products.map((product, index) => ({
      name: product.name,
      url: product.canonicalUrl,
      position: index + 1,
    }))
  );

  return (
    <>
      <JsonLd id="shop-breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="shop-collection-schema" data={shopCollectionSchema} />
      <JsonLd id="shop-item-list-schema" data={shopItemListSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Shop
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            {shopIntro.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {shopIntro.description}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Use this catalog to compare peptide supplier options across cosmetic
            peptides, research applications, wholesale peptides, and custom
            sourcing conversations with visible pricing entry points, MOQ,
            documentation support, batch transparency, and technical
            positioning context on every listing.
          </p>
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Shop Guides"
        title="Use Category Pages and Buying Guides Alongside the Catalog"
        description="These direct links make the catalog more useful before filtering starts, helping buyers move from category discovery into pricing, documentation review, and quote planning with stronger commercial context."
        links={shopSupportLinks}
      />

      <section className="section-space pt-10">
        <div className="site-container">
          <div className="mb-6 flex flex-wrap gap-2">
            {productCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                {category.label}
              </Link>
            ))}
          </div>
          <ShopCatalogClient products={products} categories={productCategories} />
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                Complete Product Index
              </h2>
              <Link
                href="/categories"
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                View category hub
              </Link>
            </div>
            <div className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/shop/${product.slug}`}
                  className="rounded-lg border border-border/70 bg-white px-3 py-2 text-sm font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <CtaSection content={shopCta} className="pt-10" />
    </>
  );
}
