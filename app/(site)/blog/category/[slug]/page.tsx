import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/site/blog-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import {
  blogCategories,
  getBlogCategoryBySlug,
  getBlogPostsForCategory,
} from "@/lib/blog-categories";
import {
  blogCategoryCanonical,
  createPageMetadata,
  getBreadcrumbSchema,
  mergeKeywords,
} from "@/lib/seo";
import { collectionPageJsonLd } from "@/lib/schema";
import { productCategories, products } from "@/lib/site-content";

type BlogCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return blogCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);

  if (!category) {
    return createPageMetadata({
      title: "Blog Category Not Found",
      description: "The requested Atlas BioLabs blog category was not found.",
      path: "/blog",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: category.seoTitle,
    description: category.metaDescription,
    path: `/blog/category/${category.slug}`,
    keywords: mergeKeywords([category.name, "peptide blog category", "Atlas BioLabs blog"]),
  });
}

function getCategoryBuyerIntro(
  category: (typeof blogCategories)[number],
  relatedProducts: typeof products,
  relatedProductCategories: typeof productCategories
) {
  const productNames = relatedProducts
    .slice(0, 3)
    .map((product) => product.name)
    .join(", ");
  const categoryNames = relatedProductCategories
    .slice(0, 2)
    .map((productCategory) => productCategory.label)
    .join(" and ");

  return [
    `${category.name} is organized as a practical buyer path, not a thin article archive. The goal is to help qualified B2B buyers move from research context into clearer commercial sourcing decisions with enough detail to compare products, documentation expectations, MOQ, lead time, and quote readiness. Atlas BioLabs uses this category to connect editorial guidance with product pages and category pages that buyers can review before opening a commercial conversation.`,
    `Readers in this section are often trying to understand what a professional supplier should provide, where documentation questions belong in the workflow, and how to avoid vague quote requests. Related products such as ${productNames || "Atlas BioLabs catalog SKUs"} give the category a concrete product path, while related product categories such as ${categoryNames || "the core peptide catalog categories"} help buyers compare adjacent sourcing options without relying on filter-only URLs or disconnected product mentions.`,
    `A strong buyer workflow usually starts with article review, moves into product comparison, and then becomes a quote request with specific quantity, pack size, destination, timeline, and document expectations. That is why this page links articles, products, product categories, and quote actions together. It supports procurement teams, formulation teams, and research supply buyers who need more than generic peptide content before they can make a sourcing decision.`,
    `Use this category as a working library. Start with the most relevant article, compare the linked product pages, review the documentation language, and keep notes on questions for the supplier. When the request is specific enough, Atlas BioLabs can help clarify MOQ, pack-size options, batch transparency support, lead-time assumptions, and documentation expectations before the buyer moves deeper into commercial follow-up.`,
  ];
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = getBlogPostsForCategory(category);
  const relatedProducts = category.relatedProductSlugs
    .map((productSlug) => products.find((product) => product.slug === productSlug))
    .filter((product): product is (typeof products)[number] => product !== undefined);
  const relatedProductCategories = category.relatedCategorySlugs
    .map((categorySlug) =>
      productCategories.find((productCategory) => productCategory.id === categorySlug)
    )
    .filter(
      (productCategory): productCategory is (typeof productCategories)[number] =>
        productCategory !== undefined
    );
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: category.name, path: `/blog/category/${category.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const collectionSchema = collectionPageJsonLd({
    name: category.name,
    description: category.metaDescription,
    url: blogCategoryCanonical(category.slug),
  });

  return (
    <>
      <JsonLd id={`blog-category-breadcrumb-${category.slug}`} data={breadcrumbSchema} />
      <JsonLd id={`blog-category-collection-${category.slug}`} data={collectionSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Blog Category
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            {category.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {category.intro}
          </p>
          <div className="mt-6 grid gap-4 text-sm leading-relaxed text-muted-foreground lg:grid-cols-2">
            {getCategoryBuyerIntro(
              category,
              relatedProducts,
              relatedProductCategories
            ).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                Related Products
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                Browse catalog
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {relatedProducts.map((product) => (
                <article
                  key={product.slug}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <h3 className="text-base font-semibold text-[var(--brand-navy)]">
                    <Link href={`/shop/${product.slug}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {product.shortDescription}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <article className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                Related Product Categories
              </h2>
              <Link
                href="/categories"
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                View categories
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {relatedProductCategories.map((productCategory) => (
                <article
                  key={productCategory.id}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <h3 className="text-base font-semibold text-[var(--brand-navy)]">
                    <Link
                      href={`/categories/${productCategory.id}`}
                      className="hover:underline"
                    >
                      {productCategory.label}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {productCategory.description} listings with product-level
                    sourcing context and documentation support.
                  </p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                Next step
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--brand-navy)]">
                Move from reading into catalog review
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Use the blog category as a research path, then compare products,
                documentation expectations, MOQ, and quote options in the catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/shop"
                className="inline-flex rounded-lg bg-[var(--brand-navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-blue)]"
              >
                Browse Catalog
              </Link>
              <Link
                href="/request-quote"
                className="inline-flex rounded-lg border border-border/70 bg-white px-4 py-2 text-sm font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                Request Quote
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
