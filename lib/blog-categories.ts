import type { BlogPost } from "contentlayer/generated";

import { getAllBlogPosts } from "@/lib/blog";
import type { ProductCategoryId } from "@/lib/site-content";

export type BlogCategory = {
  name: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  articleSlugs: string[];
  relatedProductSlugs: string[];
  relatedCategorySlugs: ProductCategoryId[];
};

export const blogCategories: BlogCategory[] = [
  {
    name: "Peptide Sourcing",
    slug: "peptide-sourcing",
    seoTitle: "Peptide Sourcing Articles",
    metaDescription:
      "Read Atlas BioLabs guides on peptide sourcing, supplier evaluation, quote workflows, and commercial procurement planning for qualified B2B buyers.",
    intro:
      "Peptide sourcing articles for commercial teams comparing suppliers, MOQ expectations, quote workflows, and documentation-backed procurement paths.",
    articleSlugs: [
      "peptide-supplier-guide",
      "how-to-buy-peptides",
      "peptide-sourcing-risks",
      "peptide-supply-chain-logistics",
    ],
    relatedProductSlugs: ["bpc-157", "retatrutide", "cjc-1295-with-dac"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
    ],
  },
  {
    name: "Quality Documentation",
    slug: "quality-documentation",
    seoTitle: "Peptide Quality and Documentation Guides",
    metaDescription:
      "Explore peptide quality, purity, COA review, batch documentation, and Atlas Labs documentation workflows for commercial sourcing teams.",
    intro:
      "Quality documentation resources covering COA review, purity context, batch transparency, and the documentation layer buyers should evaluate before commercial supply.",
    articleSlugs: [
      "peptide-quality-purity-coa",
      "atlas-labs-quality-systems",
      "peptide-supplier-guide",
      "peptide-sourcing-risks",
    ],
    relatedProductSlugs: ["bpc-157", "ll-37", "copper-tripeptide-1-ghk-cu"],
    relatedCategorySlugs: [
      "carrier-peptides",
      "antimicrobial-peptides",
      "growth-repair-peptides",
    ],
  },
  {
    name: "Peptide Pricing",
    slug: "peptide-pricing",
    seoTitle: "Peptide Pricing and MOQ Guides",
    metaDescription:
      "Learn how peptide pricing, MOQ, pack sizes, volume tiers, and documentation requirements affect commercial B2B supply planning.",
    intro:
      "Pricing-focused guidance for buyers comparing MOQ, pack size, synthesis complexity, documentation needs, and quote-led commercial supply terms.",
    articleSlugs: [
      "peptide-pricing-explained",
      "how-to-buy-peptides",
      "peptide-supply-chain-logistics",
      "peptide-market-trends",
    ],
    relatedProductSlugs: ["semaglutide-demo-trending", "tirzepatide-demo-trending", "retatrutide"],
    relatedCategorySlugs: [
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
      "signal-peptides",
    ],
  },
  {
    name: "Cosmetic Peptides",
    slug: "cosmetic-peptides",
    seoTitle: "Cosmetic Peptide Sourcing Articles",
    metaDescription:
      "Browse cosmetic peptide sourcing guides for signal peptides, carrier peptides, neurotransmitter peptides, and formulation-focused B2B planning.",
    intro:
      "Cosmetic peptide articles for formulation, private-label, and ingredient teams reviewing category fit, documentation, and commercial sourcing support.",
    articleSlugs: [
      "types-of-peptides",
      "what-are-peptides",
      "peptide-quality-purity-coa",
      "peptide-market-trends",
    ],
    relatedProductSlugs: [
      "acetyl-hexapeptide-8-argireline",
      "palmitoyl-pentapeptide-4-matrixyl",
      "nonapeptide-1-melanostatine",
    ],
    relatedCategorySlugs: [
      "signal-peptides",
      "carrier-peptides",
      "neurotransmitter-peptides",
    ],
  },
  {
    name: "Trending Peptides",
    slug: "trending-peptides",
    seoTitle: "Trending Peptide Market Guides",
    metaDescription:
      "Track trend-aware peptide sourcing articles covering current-demand SKUs, emerging peptides, blends, and commercial catalog planning.",
    intro:
      "Trend-aware peptide articles for catalog operators and wholesale teams monitoring newer peptide discussions while keeping sourcing and documentation grounded.",
    articleSlugs: [
      "top-peptides-in-demand",
      "peptide-market-trends",
      "types-of-peptides",
      "how-to-buy-peptides",
    ],
    relatedProductSlugs: ["retatrutide", "klow-glow-blend", "cagrilintide"],
    relatedCategorySlugs: [
      "trending-emerging-peptides",
      "metabolic-advanced-peptides",
      "growth-repair-peptides",
    ],
  },
  {
    name: "Compliance",
    slug: "compliance",
    seoTitle: "Peptide Compliance and Regulatory Guides",
    metaDescription:
      "Read compliance-safe peptide sourcing guidance covering regulatory context, documentation language, commercial review, and buyer risk controls.",
    intro:
      "Compliance resources for buyers who need careful commercial language, documentation workflows, and sourcing decisions without human-use claims or dosing guidance.",
    articleSlugs: [
      "peptide-regulations-legal-landscape",
      "peptide-sourcing-risks",
      "what-are-peptides",
      "peptide-quality-purity-coa",
    ],
    relatedProductSlugs: ["ll-37", "ara-290", "bpc-157"],
    relatedCategorySlugs: [
      "antimicrobial-peptides",
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
    ],
  },
  {
    name: "Wholesale Supply",
    slug: "wholesale-supply",
    seoTitle: "Wholesale Peptide Supply Articles",
    metaDescription:
      "Explore wholesale peptide supply articles on MOQ planning, logistics, recurring supply, documentation, and quote-led commercial workflows.",
    intro:
      "Wholesale supply articles for teams planning repeat orders, category expansion, logistics, documentation requests, and supply continuity.",
    articleSlugs: [
      "peptide-supply-chain-logistics",
      "peptide-pricing-explained",
      "how-to-buy-peptides",
      "peptide-supplier-guide",
    ],
    relatedProductSlugs: ["tb-500-thymosin-beta-4-fragment", "semaglutide-demo-trending", "tesamorelin"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
    ],
  },
  {
    name: "Custom Peptides",
    slug: "custom-peptides",
    seoTitle: "Custom Peptide Sourcing Articles",
    metaDescription:
      "Review custom peptide sourcing and synthesis guidance for non-catalog sequences, documentation planning, MOQ review, and B2B quote workflows.",
    intro:
      "Custom peptide guidance for buyers evaluating non-catalog sequences, feasibility, documentation expectations, and quote-led sourcing workflows.",
    articleSlugs: [
      "custom-peptide-sourcing",
      "peptide-supplier-guide",
      "peptide-quality-purity-coa",
      "peptide-sourcing-risks",
    ],
    relatedProductSlugs: ["cjc-1295-with-dac", "ipamorelin", "mots-c"],
    relatedCategorySlugs: [
      "signal-peptides",
      "growth-repair-peptides",
      "trending-emerging-peptides",
    ],
  },
];

export function getBlogCategoryBySlug(slug: string) {
  return blogCategories.find((category) => category.slug === slug);
}

export function getBlogPostsForCategory(category: BlogCategory): BlogPost[] {
  const posts = getAllBlogPosts();
  const explicitlySelectedPosts = category.articleSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => post !== undefined);
  const frontmatterSelectedPosts = posts.filter(
    (post) => post.category === category.slug
  );
  const selectedPosts = [...explicitlySelectedPosts, ...frontmatterSelectedPosts]
    .filter(
      (post, index, allPosts) =>
        allPosts.findIndex((entry) => entry.slug === post.slug) === index
    );

  if (selectedPosts.length > 0) {
    return selectedPosts;
  }

  return posts.filter((post) =>
    post.tags.some((tag) =>
      category.name.toLowerCase().includes(tag.toLowerCase())
    )
  );
}
