import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { ProductCard } from "@/components/site/product-card";
import { getRelevantBlogPostsForCategory } from "@/lib/blog";
import {
  getCategoryBreadcrumbItems,
  createPageMetadata,
  getBreadcrumbSchema,
  getCategorySeoCopy,
  mergeKeywords,
} from "@/lib/seo";
import {
  productCategories,
  products,
} from "@/lib/site-content";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.id }));
}

function getCategoryBySlug(slug: string) {
  return productCategories.find((category) => category.id === slug);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return createPageMetadata({
      title: "Category Not Found",
      description: "The requested peptide category page could not be found.",
      path: "/categories",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${category.label} Supplier`,
    path: `/categories/${category.id}`,
    description: `Browse ${category.label.toLowerCase()} from Atlas BioLabs with structured peptide sourcing, product-level MOQ visibility, documentation support, and internal links to related peptide products and blog guides.`,
    keywords: mergeKeywords([
      category.label,
      `${category.label} supplier`,
      `buy ${category.label.toLowerCase()}`,
      `${category.label.toLowerCase()} wholesale`,
      "peptide category page",
    ]),
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category === category.id
  );
  const categorySeoCopy = getCategorySeoCopy(category, categoryProducts);
  const relatedBlogPosts = getRelevantBlogPostsForCategory(category.id, 4);
  const breadcrumbItems = getCategoryBreadcrumbItems(category);
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd id={`category-breadcrumb-${category.id}`} data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Category
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            {category.label}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {category.description} with product pages built for commercial
            comparison, price visibility, documentation review, and faster
            movement into inquiry or quote conversion.
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              {category.label} Commercial Overview
            </h2>
            <div className="mt-4 space-y-4">
              {categorySeoCopy.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-5 text-sm text-[var(--brand-navy)]">
              Need full-catalog context? Visit{" "}
              <Link href="/shop" className="text-[var(--brand-blue)] hover:underline">
                Shop
              </Link>
              , compare specific products below, review our{" "}
              <Link
                href="/quality-assurance"
                className="text-[var(--brand-blue)] hover:underline"
              >
                quality assurance
              </Link>{" "}
              workflow, and request commercial terms and documentation support through{" "}
              <Link
                href="/request-quote"
                className="text-[var(--brand-blue)] hover:underline"
              >
                Request Quote
              </Link>
              . Buyers using this page for shortlist work can move directly from
              category review into product-level pricing references, MOQ
              alignment, and article-based buying guidance.
            </p>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              Products in {category.label}
            </h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
            >
              View full shop
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              Related Blog Reading
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
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
    </>
  );
}
