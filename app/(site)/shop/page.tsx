import type { Metadata } from "next";
import Link from "next/link";

import { CtaSection } from "@/components/site/cta-section";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { ShopCatalogClient } from "@/components/site/shop-catalog-client";
import { getAllBlogPosts } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";
import {
  productCategories,
  products,
  shopCta,
  shopIntro,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Shop Peptides",
  path: "/shop",
  description:
    "Shop peptides from Atlas BioLabs by category, product, and commercial supply context with documentation support, batch transparency, and inquiry-led ordering for U.S. and international buyers.",
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
  return (
    <>
      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
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
            Use this catalog to compare peptide supplier options across cosmetic peptides, research applications, wholesale peptides, and custom sourcing conversations with clear MOQ, documentation, batch transparency, and technical positioning context on every listing.
          </p>
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Shop Guides"
        title="Use Category Pages and Buying Guides Alongside the Catalog"
        description="These direct links make the shop useful even before you start filtering, helping buyers move from category discovery into pricing, documentation, and quote planning."
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

      <CtaSection content={shopCta} className="pt-10" />
    </>
  );
}
