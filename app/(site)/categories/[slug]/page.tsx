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
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/schema";
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
  const itemListSchema = itemListJsonLd(
    categoryProducts.map((product, index) => ({
      name: product.name,
      url: product.canonicalUrl,
      position: index + 1,
    }))
  );
  const collectionSchema = collectionPageJsonLd({
    name: category.label,
    description: `${category.label} product listings from Atlas BioLabs with MOQ, pack-size, documentation, and quote-led sourcing context.`,
    url: `https://www.atlasbiolabs.co/categories/${category.id}`,
  });
  const siblingCategories = productCategories.filter(
    (entry) => entry.id !== category.id
  );
  const categoryFaqs = [
    {
      question: `What should buyers compare on ${category.label} pages?`,
      answer:
        "Compare product role, MOQ, pack sizes, documentation availability, lead time, and how the peptide fits a research, formulation, or B2B sourcing context.",
    },
    {
      question: "Are pack-size variations separate indexable pages?",
      answer:
        "Pack sizes stay on the main product page so buyers and search engines have one canonical product URL with clear variant context.",
    },
    {
      question: "How does Atlas BioLabs support documentation review?",
      answer:
        "Atlas BioLabs supports quote-led sourcing with documentation available on request, batch transparency support, and Atlas Labs quality review language for qualified commercial buyers.",
    },
  ];

  return (
    <>
      <JsonLd id={`category-breadcrumb-${category.id}`} data={breadcrumbSchema} />
      <JsonLd id={`category-collection-${category.id}`} data={collectionSchema} />
      <JsonLd id={`category-item-list-${category.id}`} data={itemListSchema} />

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
          <article className="surface-card overflow-hidden p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              {category.label} Product Comparison
            </h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
                  <tr>
                    <th className="border border-border/70 px-3 py-3 font-semibold">
                      Product
                    </th>
                    <th className="border border-border/70 px-3 py-3 font-semibold">
                      MOQ
                    </th>
                    <th className="border border-border/70 px-3 py-3 font-semibold">
                      Pack Sizes
                    </th>
                    <th className="border border-border/70 px-3 py-3 font-semibold">
                      Lead Time
                    </th>
                    <th className="border border-border/70 px-3 py-3 font-semibold">
                      Documentation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryProducts.map((product) => (
                    <tr key={product.slug}>
                      <td className="border border-border/70 px-3 py-3 font-medium text-[var(--brand-navy)]">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="hover:text-[var(--brand-blue)] hover:underline"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="border border-border/70 px-3 py-3 text-muted-foreground">
                        {product.moq} units
                      </td>
                      <td className="border border-border/70 px-3 py-3 text-muted-foreground">
                        {product.packSizes.join(", ")}
                      </td>
                      <td className="border border-border/70 px-3 py-3 text-muted-foreground">
                        {product.leadTime}
                      </td>
                      <td className="border border-border/70 px-3 py-3 text-muted-foreground">
                        {product.documentation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
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

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              {category.label} FAQ
            </h2>
            <div className="mt-5 space-y-3">
              {categoryFaqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <h3 className="text-base font-semibold text-[var(--brand-navy)]">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              Other Product Categories
            </h2>
            <div className="mt-5 grid gap-3">
              {siblingCategories.slice(0, 5).map((siblingCategory) => (
                <Link
                  key={siblingCategory.id}
                  href={`/categories/${siblingCategory.id}`}
                  className="rounded-xl border border-border/70 bg-white p-4 text-sm font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                >
                  {siblingCategory.label}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
