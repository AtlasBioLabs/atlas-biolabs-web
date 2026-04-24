import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CompanyProofPanel } from "@/components/site/company-proof-panel";
import { CtaSection } from "@/components/site/cta-section";
import { HeroSection } from "@/components/site/hero-section";
import { JsonLd } from "@/components/site/json-ld";
import { ProductCard } from "@/components/site/product-card";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { TrustStrip } from "@/components/site/trust-strip";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/lib/blog";
import { companyProofFacts, proofSystemNote } from "@/lib/site-proof";
import {
  createPageMetadata,
  getOrganizationSchema,
  getWebsiteSchema,
} from "@/lib/seo";
import {
  featuredProductSlugs,
  heroContent,
  homeCta,
  orderingSteps,
  productCategories,
  products,
  proofChips,
  qualityHighlights,
  trustMetrics,
  wholesaleHighlights,
  whyBuyPoints,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  path: "/",
  description:
    "Atlas BioLabs is a peptide supplier and sourcing company supporting peptide sourcing, wholesale peptides, and custom peptide sourcing for U.S. and international buyers through qualified manufacturing partners in China, Atlas Labs documentation review, and quote-based commercial ordering.",
  keywords: [
    "Atlas BioLabs peptides",
    "peptide supplier homepage",
    "wholesale peptides",
    "custom peptide sourcing",
    "bulk peptide quote",
  ],
});

const featuredProducts = featuredProductSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter((product): product is (typeof products)[number] => product !== undefined);

const homeFeaturedPosts = getAllBlogPosts().slice(0, 3);
const categoryLinkCards = productCategories.slice(0, 6).map((category) => ({
  title: category.label,
  href: `/categories/${category.id}`,
  description: `${category.description} peptide listings with product-level MOQ visibility, documentation support, and direct quote paths.`,
  eyebrow: "Peptide Category",
}));
const homeBlogLinks = homeFeaturedPosts.map((post) => ({
  title: post.title,
  href: `/blog/${post.slug}`,
  description: post.description,
  eyebrow: post.tags[0],
}));

export default function HomePage() {
  return (
    <>
      <JsonLd id="organization-schema" data={getOrganizationSchema()} />
      <JsonLd id="website-schema" data={getWebsiteSchema()} />
      <HeroSection content={heroContent} />
      <TrustStrip metrics={trustMetrics} />
      <CompanyProofPanel
        eyebrow="Company Snapshot"
        title="Who we are and how we work"
        description="We keep our leadership, catalog depth, response standard, and operating structure visible from the first scroll instead of hiding them behind generic marketing language."
        facts={companyProofFacts}
        note={proofSystemNote}
      />

      <section className="section-space pt-8">
        <div className="site-container">
          <article className="surface-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Peptide Supplier Overview
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
              Atlas BioLabs operates as a peptide supplier for commercial buyers who need structured peptide sourcing, wholesale peptides, custom peptide sourcing, documentation support, batch transparency, and enough technical product context to move into quote discussions with clearer expectations.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/shop">Shop Peptides</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/categories">Browse Categories</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/wholesale">Wholesale Supply</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/blog">Peptide Blog</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/contact">Contact Sales</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/custom-requests">Custom Peptide Request</Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Popular Peptides
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)] sm:text-4xl">
                Popular Peptides for Commercial Sourcing
              </h2>
            </div>
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/shop">View Full Shop</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {proofChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border/80 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Peptide Categories"
        title="Browse Peptide Categories Before You Compare Individual SKUs"
        description="Our category pages help buyers move from peptide category research into direct product comparisons with cleaner context around sourcing, MOQ, and documentation support."
        links={categoryLinkCards}
      />

      <ResourceLinksPanel
        eyebrow="From the Blog"
        title="Read the Buying Guides That Support Commercial Decision-Making"
        description="These blog articles connect peptide basics, supplier evaluation, pricing, and sourcing workflows so buyers can move from early research into structured quote planning."
        links={homeBlogLinks}
      />

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              How Ordering Works
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {orderingSteps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-border/70 bg-white px-4 py-3"
                >
                  <h3 className="text-sm font-semibold text-[var(--brand-navy)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              Why Buy From Atlas BioLabs
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {whyBuyPoints.map((point) => (
                <div
                  key={point.title}
                  className="rounded-xl border border-border/70 bg-muted/35 px-4 py-3"
                >
                  <h3 className="text-sm font-semibold text-[var(--brand-navy)]">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  Wholesale / Bulk Supply
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)] sm:text-3xl">
                  Scale from Entry MOQ to Recurring Volume
                </h2>
              </div>
              <Button asChild variant="outline" className="w-full md:w-auto">
                <Link href="/wholesale">Explore Wholesale</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {wholesaleHighlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-xl border border-border/70 bg-white px-4 py-3"
                  >
                    <h3 className="text-sm font-semibold text-[var(--brand-navy)]">
                      {highlight.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-border/70">
                <Image
                  src="/images/shipping-boxes.jpg"
                  alt="Shipping cartons arranged for outbound order fulfillment."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/82 via-[#071322]/28 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                    Recurring Volume Logistics
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/84">
                    From sample-entry orders to larger recurring schedules, we keep fulfillment planning visible and commercially grounded.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <article className="surface-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  Quality Assurance
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)] sm:text-3xl">
                  Atlas Labs Quality Review and Documentation Support
                </h2>
              </div>
              <Button asChild variant="outline" className="w-full md:w-auto">
                <Link href="/quality-assurance">Read Quality Details</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {qualityHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-xl border border-border/70 bg-muted/35 px-4 py-3"
                >
                  <h3 className="text-sm font-semibold text-[var(--brand-navy)]">
                    {highlight.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              We use clear documentation language and direct process copy so first-time buyers can understand what to expect before requesting a formal quote.
            </p>
          </article>
        </div>
      </section>

      <CtaSection content={homeCta} className="pt-8" />
    </>
  );
}
