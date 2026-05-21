import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { allBlogPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BlogTableOfContents } from "@/components/site/blog-table-of-contents";
import { JsonLd } from "@/components/site/json-ld";
import { MdxContent } from "@/components/site/mdx-content";
import { RelatedArticles } from "@/components/site/related-articles";
import { blogCategories } from "@/lib/blog-categories";
import {
  formatBlogDate,
  getBlogPostBySlug,
  getBlogPostHeadings,
  getBlogPostModifiedDate,
  getBlogReadingTime,
  getRelatedBlogPosts,
  getRelevantCategoriesForBlogPost,
  getRelevantProductsForBlogPost,
} from "@/lib/blog";
import {
  createPageMetadata,
  getArticleSchema,
  getBlogPostBreadcrumbItems,
  getBreadcrumbSchema,
  mergeKeywords,
} from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return allBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "Post Not Found",
      description: "The requested blog post was not found.",
      path: "/blog",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.seoTitle ?? post.title,
    path: `/blog/${post.slug}`,
    description: post.metaDescription ?? post.description,
    keywords: mergeKeywords(post.tags, [
      post.title,
      "peptide supplier guide",
      "Atlas BioLabs blog",
      "peptide sourcing article",
    ]),
    image: post.image,
    imageAlt: `Editorial illustration covering ${post.title}`,
    type: "article",
    publishedTime: post.date,
    authors: [post.author],
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = getBlogPostHeadings(post);
  const relatedPosts = getRelatedBlogPosts(post, 3);
  const relatedProducts = getRelevantProductsForBlogPost(post, 3);
  const relatedCategories = getRelevantCategoriesForBlogPost(post, 3);
  const relatedBlogCategories = blogCategories
    .filter((category) =>
      category.articleSlugs.includes(post.slug) ||
      post.category === category.slug ||
      post.tags.some((tag) =>
        category.name.toLowerCase().includes(tag.toLowerCase())
      )
    )
    .slice(0, 3);
  const modifiedDate = getBlogPostModifiedDate(post);
  const breadcrumbItems = getBlogPostBreadcrumbItems(post);
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const articleSchema = getArticleSchema(post, modifiedDate);

  return (
    <>
      <JsonLd id={`blog-breadcrumb-${post.slug}`} data={breadcrumbSchema} />
      <JsonLd id={`blog-article-${post.slug}`} data={articleSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Atlas BioLabs Blog
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-tight font-semibold text-[var(--brand-navy)] sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>By {post.author}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>{getBlogReadingTime(post)}</span>
            {modifiedDate !== post.date ? (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                <span>Updated {formatBlogDate(modifiedDate)}</span>
              </>
            ) : null}
          </div>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {post.excerpt ?? post.description}
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
          <article className="surface-card overflow-hidden">
            <div className="relative aspect-[16/8] w-full border-b border-border/70 bg-[#eef4ff]">
              <Image
                src={post.image}
                alt={`Editorial illustration covering ${post.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 76rem"
                priority
              />
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <BlogTableOfContents headings={headings} />
              <div className="mt-8">
                <MdxContent code={post.body.code} />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                Related Products
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                Browse the shop
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((product) => (
                <article
                  key={product.slug}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
                    Product
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[var(--brand-navy)]">
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
                Related Categories
              </h2>
              <Link
                href="/categories"
                className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
              >
                View all categories
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {relatedBlogCategories.map((category) => (
                <article
                  key={category.slug}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
                    Blog Category
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[var(--brand-navy)]">
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className="hover:underline"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.intro}
                  </p>
                </article>
              ))}
              {relatedCategories.map((category) => (
                <article
                  key={category.id}
                  className="rounded-xl border border-border/70 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
                    Category
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[var(--brand-navy)]">
                    <Link href={`/categories/${category.id}`} className="hover:underline">
                      {category.label}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.description} peptide listings with product-level sourcing context and documentation support.
                  </p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <RelatedArticles posts={relatedPosts} />

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                Commercial next step
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--brand-navy)]">
                Compare products or request a quote
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Keep the article as sourcing context, then move into product
                review, MOQ planning, documentation requests, and quote-led B2B
                supply support.
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
