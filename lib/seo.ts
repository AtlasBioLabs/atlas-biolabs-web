import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site-config";
import {
  contactDetails,
  type Product,
  type ProductCategory,
  type ProductCategoryId,
} from "@/lib/site-content";

const baseKeywords = [
  "Atlas BioLabs",
  "peptide supplier",
  "peptide sourcing",
  "wholesale peptides",
  "cosmetic peptides",
  "research peptides",
  "peptide manufacturers",
  "buy peptides",
  "peptide supply USA",
  "global peptide supply and sourcing",
];

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
};

export function mergeKeywords(...groups: Array<string[] | undefined>) {
  return Array.from(
    new Set(
      groups
        .flat()
        .filter(
          (keyword): keyword is string =>
            typeof keyword === "string" && keyword.trim().length > 0
        )
    )
  );
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  image = "/og-default.svg",
  imageAlt = `${siteConfig.name} - ${siteConfig.tagline}`,
  publishedTime,
  authors,
  tags,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const fullTitle =
    title === "Home"
      ? "Atlas BioLabs - Peptide Supply & Sourcing"
      : `${title} | ${siteConfig.name}`;
  const allKeywords = mergeKeywords(baseKeywords, keywords);
  const imageUrl = absoluteUrl(image);

  return {
    title:
      title === "Home"
        ? { absolute: "Atlas BioLabs - Peptide Supply & Sourcing" }
        : title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: canonical,
      siteName: siteConfig.name,
      publishedTime,
      authors,
      tags,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    foundingDate: "2024",
    email: contactDetails.recipientEmail,
    founder: {
      "@type": "Person",
      name: "Dr. Guy Citrin",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: contactDetails.recipientEmail,
        availableLanguage: ["English"],
      },
    ],
    description:
      "Atlas BioLabs supplies peptides for commercial buyers through global sourcing partners, with documentation support, batch transparency, and structured supply systems.",
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description:
      "Atlas BioLabs is a peptide supplier and sourcing platform built for wholesale peptides, documentation-backed procurement, and structured commercial supply.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/shop?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getProductSchema(product: Product, categoryLabel: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.summary} Atlas BioLabs supports ${categoryLabel.toLowerCase()} sourcing with documentation review, batch transparency support, and quote-based commercial supply.`,
    image: [absoluteUrl(product.image)],
    sku: product.slug,
    category: categoryLabel,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: String(product.priceFrom),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/shop/${product.slug}`),
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "MOQ",
        value: `${product.moq} units`,
      },
      {
        "@type": "PropertyValue",
        name: "Lead Time",
        value: product.leadTime,
      },
      {
        "@type": "PropertyValue",
        name: "Pack Sizes",
        value: product.packSizes.join(", "),
      },
    ],
  };
}

export function getProductSeoCopy(product: Product, categoryLabel: string) {
  const packSizes = product.packSizes.join(", ");
  const documentation = product.purityDocumentation.slice(0, 2).join(" ");
  const functionalRole = product.functionalRole.join(", ");
  const applications = product.commonApplications.join(", ");
  const characteristics = product.keyCharacteristics.join("; ");

  return [
    `${product.overview} Within our ${categoryLabel.toLowerCase()} catalog, we position ${product.name} around the functional roles of ${functionalRole} so commercial buyers can compare the peptide against similar sourcing options.`,
    `${product.mechanismInsight} In formulation and laboratory sourcing workflows, it is commonly referenced for ${applications}, which helps buyers align product context before requesting pricing or documentation.`,
    `Key characteristics include ${characteristics}. We supply ${product.name} in pack sizes such as ${packSizes}, with MOQ ${product.moq} units, ${product.leadTime} lead times, Atlas Labs quality review, and documentation support. ${documentation}`,
  ];
}

const categoryFocus: Record<
  ProductCategoryId,
  { useCase: string; demandNote: string; buyerIntent: string }
> = {
  "signal-peptides": {
    useCase: "anti-aging and collagen-focused cosmetic lines",
    demandNote: "private-label skin care and premium formulation pipelines",
    buyerIntent: "buyers looking to source signal peptides in repeatable commercial volume",
  },
  "carrier-peptides": {
    useCase: "repair-oriented and mineral-delivery concept portfolios",
    demandNote: "OEM and ODM formulation teams scaling specialized ingredient systems",
    buyerIntent: "buyers comparing carrier peptide suppliers for consistency and lot support",
  },
  "neurotransmitter-peptides": {
    useCase: "wrinkle-focused and expression-focused product positioning",
    demandNote: "high-velocity anti-aging SKU assortments in beauty channels",
    buyerIntent:
      "teams selecting neurotransmitter peptide products with practical MOQ and lead time visibility",
  },
  "enzyme-inhibitor-peptides": {
    useCase: "tone-control and anti-aging control concept development",
    demandNote: "category expansions that require precise product and documentation matching",
    buyerIntent:
      "buyers sourcing enzyme inhibitor peptides with scalable wholesale support",
  },
  "antimicrobial-peptides": {
    useCase: "specialty skin-protection and advanced formulation planning",
    demandNote: "innovation-led product teams balancing niche demand with reliable dispatch",
    buyerIntent:
      "commercial operators evaluating antimicrobial peptide options for recurring procurement",
  },
  "growth-repair-peptides": {
    useCase: "regeneration-focused catalog planning and repeat-order programs",
    demandNote: "buyers managing mixed demand across B2B and direct retail channels",
    buyerIntent:
      "teams sourcing growth peptides with MOQ clarity and responsive quote support",
  },
  "metabolic-advanced-peptides": {
    useCase: "advanced and trend-responsive peptide portfolio strategy",
    demandNote: "operators adapting inventory around fast-moving high-demand SKUs",
    buyerIntent:
      "buyers benchmarking metabolic peptide suppliers for speed, documentation, and scale",
  },
};

export function getCategorySeoCopy(
  category: ProductCategory,
  categoryProducts: Product[]
) {
  const focus = categoryFocus[category.id];
  const examples = categoryProducts.slice(0, 5).map((product) => product.name).join(", ");
  const moqRange = categoryProducts
    .map((product) => product.moq)
    .reduce(
      (range, value) => ({
        min: Math.min(range.min, value),
        max: Math.max(range.max, value),
      }),
      { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
    );

  return [
    `${category.label} are part of our commercial peptide supplier catalog for ${focus.useCase}. We built this category page to help buyers compare wholesale peptides, review category-specific sourcing context, and move directly into detailed product pages without losing track of commercial buying priorities. Products in this group include ${examples}, which gives procurement teams a clean starting point for comparing format, MOQ, and documentation expectations.`,
    `${category.label} demand often spans pilot orders, recurring replenishment, and multi-SKU wholesale planning. That is why we keep pricing entry points, MOQ visibility, and lead-time guidance in a consistent format across every listing in this category. MOQ coverage in this group ranges from ${moqRange.min} to ${moqRange.max} units depending on the SKU, and we support those programs through global sourcing with qualified manufacturing partners in China and Atlas Labs documentation review.`,
    `Buyers evaluating ${category.label.toLowerCase()} are usually balancing formulation fit, documentation readiness, and supply continuity at the same time. This category is designed for ${focus.demandNote}, so you can compare products with enough context to shortlist viable options before sending a quote request. We also connect this category page to quality assurance resources, research support, and related blog guidance so teams can understand sourcing considerations before commercial discussions begin.`,
    `If your team is ${focus.buyerIntent}, this page should function as more than a directory. It should help you move from category research into purchase planning with clearer expectations around pack sizes, commercial response time, and batch transparency support. Use the product listings below to compare candidates, then contact us with your target pack size, destination market, and delivery window so we can align supply notes and documentation around your program.`,
  ];
}
