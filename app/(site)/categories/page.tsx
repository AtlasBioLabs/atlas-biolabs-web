import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { getAllBlogPosts } from "@/lib/blog";
import { createPageMetadata, getBreadcrumbSchema } from "@/lib/seo";
import { catalogProductSlugsByCategory, productCategories } from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Categories",
  path: "/categories",
  description:
    "Browse Atlas BioLabs peptide categories with commercial sourcing context, MOQ visibility, and quote-ready support for U.S. and international buyers.",
  keywords: [
    "peptide categories",
    "signal peptides",
    "carrier peptides",
    "metabolic peptides",
    "growth peptides",
  ],
});

export default function CategoryIndexPage() {
  const categoryGuides = getAllBlogPosts()
    .filter((post) =>
      ["types-of-peptides", "peptide-supplier-guide", "how-to-buy-peptides"].includes(
        post.slug
      )
    )
    .map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      description: post.description,
      eyebrow: "Buyer Guide",
    }));

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
  ]);

  return (
    <>
      <JsonLd id="categories-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Categories
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Shop Peptides by Category
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Compare peptide groups, review sourcing context, and move quickly into product listings with documentation and quote support options.
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {productCategories.map((category) => {
            const productCount = catalogProductSlugsByCategory[category.id]?.length ?? 0;

            return (
              <article key={category.id} className="surface-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  {productCount} Product{productCount === 1 ? "" : "s"}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--brand-navy)]">
                  {category.label}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                <Link
                  href={`/categories/${category.id}`}
                  className="mt-5 inline-flex text-sm font-medium text-[var(--brand-blue)] hover:underline"
                >
                  Explore Category
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Category Guides"
        title="Use These Articles to Compare Peptide Categories More Effectively"
        description="These blog posts explain how peptide categories differ, how buyers source them, and how to move from category selection into product evaluation."
        links={categoryGuides}
      />
    </>
  );
}
