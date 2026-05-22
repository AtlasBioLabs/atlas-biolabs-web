import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BlogCard } from "@/components/site/blog-card";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { getAllBlogPosts } from "@/lib/blog";
import { blogCategories } from "@/lib/blog-categories";
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getStaticBreadcrumbItems,
} from "@/lib/seo";
import { collectionPageJsonLd } from "@/lib/schema";

export const metadata: Metadata = createPageMetadata({
  title: "Peptide Supply Blog",
  path: "/blog",
  description:
    "Explore Atlas BioLabs articles on peptide supplier evaluation, peptide sourcing, wholesale peptides, custom peptide sourcing, pricing, documentation, and category planning for commercial buyers.",
  keywords: [
    "peptide supply blog",
    "how to buy peptides",
    "peptide supplier guide",
    "custom peptide sourcing",
    "peptide category articles",
  ],
});

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  const toPostLinks = (slugs: string[]) =>
    slugs
      .map((slug) => postsBySlug.get(slug))
      .filter((post): post is (typeof posts)[number] => post !== undefined)
      .map((post) => ({
        title: post.title,
        href: `/blog/${post.slug}`,
        description: post.excerpt ?? post.description,
        eyebrow: post.tags[0],
      }));
  const featuredBuyerGuideLinks = toPostLinks([
    "peptide-supplier-checklist",
    "how-to-read-peptide-coa",
    "peptide-purity-hplc-ms-documentation",
    "source-peptides-wholesale",
    "cosmetic-peptides-guide",
    "trending-emerging-peptides-2026",
    "retatrutide-peptide-commercial-sourcing",
    "atlas-biolabs-peptide-catalog-guide",
  ]);
  const startHereLinks = [
    {
      title: "Start Here: How to Use Atlas BioLabs as a Buyer",
      href: "/blog/start-here",
      description:
        "Follow the guided path through the catalog, categories, documentation resources, and quote workflow.",
      eyebrow: "Start Here",
    },
    ...toPostLinks([
      "atlas-biolabs-peptide-catalog-guide",
      "peptide-supplier-checklist",
      "how-to-read-peptide-coa",
    ]),
  ];
  const trendingPeptideLinks = toPostLinks([
    "retatrutide-peptide-commercial-sourcing",
    "why-retatrutide-is-watched-in-2026",
    "trending-emerging-peptides-2026",
    "klow-peptide-blend-sourcing-context",
  ]);
  const qualityCoaGuideLinks = toPostLinks([
    "how-to-read-peptide-coa",
    "peptide-purity-hplc-ms-documentation",
    "batch-number-coa-verification",
    "lot-specific-peptide-documentation",
  ]);
  const wholesaleGuideLinks = toPostLinks([
    "source-peptides-wholesale",
    "bulk-peptide-supply-moq-lead-time",
    "peptide-moq-explained",
    "quote-based-peptide-ordering",
  ]);
  const cosmeticGuideLinks = toPostLinks([
    "cosmetic-peptides-guide",
    "ghk-cu-copper-peptide-cosmetic-formulation",
    "matrixyl-peptide-supplier-guide",
    "argireline-peptide-cosmetic-formulation",
  ]);
  const supplierEvaluationLinks = toPostLinks([
    "peptide-supplier-checklist",
    "compare-peptide-suppliers",
    "professional-peptide-supplier-before-shipment",
    "trustworthy-peptide-product-page",
  ]);

  const breadcrumbItems = getStaticBreadcrumbItems("blog");
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const collectionSchema = collectionPageJsonLd({
    name: "Atlas BioLabs Peptide Supply Blog",
    description:
      "Atlas BioLabs articles on peptide sourcing, quality documentation, pricing, compliance, wholesale supply, and custom peptide requests.",
    url: "https://www.atlasbiolabs.co/blog",
  });

  return (
    <>
      <JsonLd id="blog-breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="blog-collection-schema" data={collectionSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Blog
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Peptide Supply Guides and Buyer Insights
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            We publish practical articles on peptide sourcing, peptide supplier evaluation, wholesale peptides, documentation workflows, pricing, custom peptide sourcing, and category planning for commercial buyers who want stronger context around peptide research, formulation strategy, and health-adjacent market conversations in the U.S. and international markets.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                {category.name}
              </Link>
            ))}
              <Link
                href="/shop"
                className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                Shop Peptides
            </Link>
            <Link
              href="/categories"
              className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              Browse Categories
            </Link>
              <Link
                href="/blog/start-here"
                className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                Start Here
              </Link>
              <Link
                href="/wholesale"
                className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                Wholesale Supply
            </Link>
            <Link
              href="/custom-requests"
              className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              Custom Peptide Request
            </Link>
          </div>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="surface-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Start Here
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
                Start Here if You Are New to the Atlas BioLabs Catalog
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                New buyers should start with the pillar guides before moving into
                individual product articles. These pages explain how Atlas
                BioLabs thinks about product selection, documentation
                expectations, MOQ planning, batch transparency, and quote-led
                commercial communication.
              </p>
              <div className="mt-5 grid gap-3">
                {startHereLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-border/70 bg-white p-4 text-sm font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </article>

            <article className="surface-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Featured Buyer Guides
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {featuredBuyerGuideLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-border/70 bg-white p-4 hover:border-[var(--brand-blue)]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
                      {link.eyebrow}
                    </span>
                    <span className="mt-2 block text-sm font-semibold text-[var(--brand-navy)]">
                      {link.title}
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          </div>

          {posts.length === 0 ? (
            <article className="surface-card p-8 text-center">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                No posts yet
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Add MDX files to `content/blog` and they will appear here automatically.
              </p>
            </article>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  Latest Articles
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
                  Latest Articles Across Sourcing, Documentation, and Category Planning
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Trending Peptides"
        title="Trending and Emerging Peptide Buyer Guides"
        description="These guides help buyers evaluate fast-moving peptide discussions with sourcing discipline, documentation expectations, and quote-ready context."
        links={trendingPeptideLinks}
      />

      <ResourceLinksPanel
        eyebrow="Quality & COA Guides"
        title="COA, Purity, Batch, and Supplier Evaluation Guides"
        description="Use these resources to understand lot-specific documentation, HPLC/MS context, packaging, storage, and supplier questions before shipment."
        links={qualityCoaGuideLinks}
      />

      <ResourceLinksPanel
        eyebrow="Wholesale & MOQ Guides"
        title="Guides for MOQ Planning, Bulk Supply, and Quote Readiness"
        description="Review the planning guides that help commercial buyers prepare clearer volume, timing, and documentation requests."
        links={wholesaleGuideLinks}
      />

      <ResourceLinksPanel
        eyebrow="Cosmetic Peptide Guides"
        title="Guides for Formulation Teams and Ingredient Buyers"
        description="Compare cosmetic peptide categories, product pages, and documentation expectations before asking for MOQ, bulk pack, or private-label support."
        links={cosmeticGuideLinks}
      />

      <ResourceLinksPanel
        eyebrow="Supplier Evaluation Guides"
        title="Guides for Comparing Suppliers and Buyer Workflows"
        description="These articles help buyers evaluate the quality of product pages, documentation systems, supplier communication, and quote-readiness before ordering."
        links={supplierEvaluationLinks}
      />
    </>
  );
}
