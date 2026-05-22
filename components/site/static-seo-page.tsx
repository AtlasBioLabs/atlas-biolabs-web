import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import type { StaticSeoPage } from "@/lib/seo-resource-data";
import { priorityInternalLinks } from "@/lib/seo-resource-data";
import { getBreadcrumbSchema } from "@/lib/seo";
import { collectionPageJsonLd, webPageJsonLd } from "@/lib/schema";
import { products, productCategories } from "@/lib/site-content";
import { getBlogPostBySlug } from "@/lib/blog";

export interface StaticSeoPageProps {
  page: StaticSeoPage;
  breadcrumbParent?: { name: string; path: string };
}

export function StaticSeoPageRenderer({
  page,
  breadcrumbParent,
}: StaticSeoPageProps) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    ...(breadcrumbParent ? [breadcrumbParent] : []),
    { name: page.h1, path: page.path },
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  // Build JSON-LD schema
  const mainSchema =
    page.schemaType === "CollectionPage"
      ? collectionPageJsonLd({
          name: page.h1,
          description: page.intro,
          url: `https://www.atlasbiolabs.co${page.path}`,
        })
      : webPageJsonLd({
          name: page.h1,
          description: page.intro,
          url: `https://www.atlasbiolabs.co${page.path}`,
        });

  // Get related products
  const relatedProducts =
    page.relatedProductSlugs
      ?.map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is (typeof products)[number] => p !== undefined)
      .slice(0, 3) || [];

  // Get related categories
  const relatedCategories =
    page.relatedCategorySlugs
      ?.map((id) => productCategories.find((c) => c.id === id))
      .filter((c): c is (typeof productCategories)[number] => c !== undefined)
      .slice(0, 3) || [];

  // Get related articles
  const relatedArticles =
    page.relatedArticleSlugs?.map((slug) => {
        try {
          return getBlogPostBySlug(slug);
        } catch {
          return null;
        }
      })
      .filter(
        (a): a is NonNullable<ReturnType<typeof getBlogPostBySlug>> => a !== null
      )
      .slice(0, 2) || [];

  return (
    <>
      <JsonLd id={`seo-page-breadcrumb-${page.slug}`} data={breadcrumbSchema} />
      <JsonLd id={`seo-page-main-${page.slug}`} data={mainSchema} />

      {/* Hero Section */}
      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          {page.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              {page.eyebrow}
            </p>
          )}
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            {page.h1}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {page.intro}
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="section-space">
        <div className="site-container space-y-12">
          {page.sections.map((section, idx) => (
            <article
              key={`${page.slug}-section-${idx}`}
              className="max-w-3xl"
            >
              <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p
                    key={`${page.slug}-para-${idx}-${pIdx}`}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 space-y-2 pl-5">
                    {section.bullets.map((bullet, bIdx) => (
                      <li
                        key={`${page.slug}-bullet-${idx}-${bIdx}`}
                        className="list-disc text-muted-foreground"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}

          {/* Comparison Table */}
          {page.comparisonTable && (
            <article className="max-w-4xl overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border/70 bg-muted px-4 py-3 text-left font-semibold text-[var(--brand-navy)]">
                      Category
                    </th>
                    {page.comparisonTable.columns.map((col) => (
                      <th
                        key={col}
                        className="border border-border/70 bg-muted px-4 py-3 text-left font-semibold text-[var(--brand-navy)]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonTable.rows.map((row, rIdx) => (
                    <tr key={`${page.slug}-row-${rIdx}`}>
                      <td className="border border-border/70 px-4 py-3 font-medium text-[var(--brand-navy)]">
                        {row.label}
                      </td>
                      {row.values.map((value, vIdx) => (
                        <td
                          key={`${page.slug}-cell-${rIdx}-${vIdx}`}
                          className="border border-border/70 px-4 py-3 text-sm text-muted-foreground"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          )}
        </div>
      </section>

      {/* Related Links Section */}
      <section className="section-space">
        <div className="site-container">
          <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
            Related Resources
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Products */}
            {relatedProducts.length > 0 && (
              <article className="space-y-3">
                <h3 className="font-semibold text-[var(--brand-navy)]">
                  Featured Products
                </h3>
                <ul className="space-y-2">
                  {relatedProducts.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="flex items-center gap-2 rounded-lg border border-border/70 bg-white px-3 py-2 text-sm text-[var(--brand-blue)] transition-colors hover:bg-muted"
                      >
                        <span>→</span>
                        <span>{product.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {/* Categories */}
            {relatedCategories.length > 0 && (
              <article className="space-y-3">
                <h3 className="font-semibold text-[var(--brand-navy)]">
                  Related Categories
                </h3>
                <ul className="space-y-2">
                  {relatedCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.id}`}
                        className="flex items-center gap-2 rounded-lg border border-border/70 bg-white px-3 py-2 text-sm text-[var(--brand-blue)] transition-colors hover:bg-muted"
                      >
                        <span>→</span>
                        <span>{category.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {/* Articles */}
            {relatedArticles.length > 0 && (
              <article className="space-y-3">
                <h3 className="font-semibold text-[var(--brand-navy)]">
                  Related Articles
                </h3>
                <ul className="space-y-2">
                  {relatedArticles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="flex items-center gap-2 rounded-lg border border-border/70 bg-white px-3 py-2 text-sm text-[var(--brand-blue)] transition-colors hover:bg-muted"
                      >
                        <span>→</span>
                        <span>{article.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {/* Custom Links */}
            {page.customLinks && page.customLinks.length > 0 && (
              <article className="space-y-3">
                <h3 className="font-semibold text-[var(--brand-navy)]">
                  Resources
                </h3>
                <ul className="space-y-2">
                  {page.customLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 rounded-lg border border-border/70 bg-white px-3 py-2 text-sm text-[var(--brand-blue)] transition-colors hover:bg-muted"
                      >
                        <span>→</span>
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {/* Priority Links */}
            {page.priorityLinkKeys && (
              <article className="space-y-3">
                <h3 className="font-semibold text-[var(--brand-navy)]">
                  Key Pages
                </h3>
                <ul className="space-y-2">
                  {page.priorityLinkKeys
                    .slice(0, 3)
                    .map((key) => {
                      const link = priorityInternalLinks[key];
                      return (
                        <li key={key}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 rounded-lg border border-border/70 bg-white px-3 py-2 text-sm text-[var(--brand-blue)] transition-colors hover:bg-muted"
                          >
                            <span>→</span>
                            <span>{link.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {page.cta && (
        <CtaSection
          content={page.cta}
        />
      )}

      {/* Compliance Note */}
      <section className="section-space border-t border-border/70 bg-muted/30">
        <div className="site-container max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Compliance
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {page.complianceNote}
          </p>
        </div>
      </section>
    </>
  );
}
