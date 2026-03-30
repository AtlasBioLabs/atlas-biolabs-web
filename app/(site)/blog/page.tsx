import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/site/blog-card";
import { JsonLd } from "@/components/site/json-ld";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { getAllBlogPosts } from "@/lib/blog";
import { createPageMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  path: "/blog",
  description:
    "Read Atlas BioLabs peptide buying guides, category explainers, and sourcing-focused insights for U.S. and international commercial buyers.",
  keywords: [
    "peptide blog",
    "how to buy peptides",
    "peptide supplier guide",
    "peptide category articles",
  ],
});

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featuredPosts = posts.slice(0, 3);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <>
      <JsonLd id="blog-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Blog
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Peptide Supply Guides and Buyer Insights
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            We publish practical articles on peptide sourcing, peptide supplier evaluation, wholesale peptides, documentation workflows, pricing, and category planning for commercial buyers in the U.S. and international markets.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
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
              href="/request-quote"
              className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
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
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Featured Topics"
        title="Start With the Peptide Guides Buyers Read Most"
        description="These articles connect peptide basics, supplier evaluation, pricing, and sourcing workflows so buyers can move from research into structured procurement planning."
        links={featuredPosts.map((post) => ({
          title: post.title,
          href: `/blog/${post.slug}`,
          description: post.description,
          eyebrow: post.tags[0],
        }))}
      />
    </>
  );
}
