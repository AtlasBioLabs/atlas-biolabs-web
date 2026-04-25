import type { Metadata } from "next";
import type { BlogPost } from "contentlayer/generated";

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
  "custom peptide sourcing",
];

export const siteDefaultTitle = "Atlas BioLabs | Peptide Supply and Sourcing";
export const siteDescription =
  "Atlas BioLabs is a peptide supply and sourcing company serving U.S. and international buyers through qualified manufacturing and sourcing partners in China, supported by documentation, batch transparency, and commercial quote support.";
export const productManufacturerName =
  "Qualified manufacturing and sourcing partners in China";
const organizationLogoPath = "/atlas-biolabs-logo.svg";

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
  imageAlt = `${siteConfig.name} peptide supply and sourcing website preview`,
  publishedTime,
  authors,
  tags,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const fullTitle =
    title === "Home" ? siteDefaultTitle : `${title} | ${siteConfig.name}`;
  const allKeywords = mergeKeywords(baseKeywords, keywords);
  const imageUrl = absoluteUrl(image);

  return {
    title: title === "Home" ? { absolute: siteDefaultTitle } : title,
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

export function getProductIntro(productName: string) {
  return `${productName} is a peptide supplied for commercial sourcing, research applications, and formulation development. Atlas BioLabs provides structured sourcing support with documentation, batch transparency, and scalable supply options for ${productName} peptide buyers.`;
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(organizationLogoPath),
    },
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
    description: siteDescription,
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description:
      "Atlas BioLabs is a peptide supplier platform focused on peptide sourcing, wholesale peptides, custom peptide sourcing, and documentation-backed commercial supply.",
  };
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type StaticBreadcrumbKey =
  | "shop"
  | "categories"
  | "blog"
  | "wholesale"
  | "about"
  | "contact"
  | "customRequests"
  | "requestQuote"
  | "qualityAssurance"
  | "research";

const staticBreadcrumbTrails: Record<StaticBreadcrumbKey, BreadcrumbItem[]> = {
  shop: [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ],
  categories: [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
  ],
  blog: [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ],
  wholesale: [
    { name: "Home", path: "/" },
    { name: "Wholesale", path: "/wholesale" },
  ],
  about: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ],
  contact: [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ],
  customRequests: [
    { name: "Home", path: "/" },
    { name: "Custom Peptide Request", path: "/custom-requests" },
  ],
  requestQuote: [
    { name: "Home", path: "/" },
    { name: "Request Quote", path: "/request-quote" },
  ],
  qualityAssurance: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Quality Assurance", path: "/quality-assurance" },
  ],
  research: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Research", path: "/research" },
  ],
};

export function getStaticBreadcrumbItems(key: StaticBreadcrumbKey) {
  return staticBreadcrumbTrails[key];
}

export function getCategoryBreadcrumbItems(category: ProductCategory) {
  return [
    ...staticBreadcrumbTrails.shop,
    { name: category.label, path: `/categories/${category.id}` },
  ];
}

export function getProductBreadcrumbItems(product: Product, categoryLabel: string) {
  return [
    ...staticBreadcrumbTrails.shop,
    { name: categoryLabel, path: `/categories/${product.category}` },
    { name: product.name, path: `/shop/${product.slug}` },
  ];
}

export function getBlogPostBreadcrumbItems(post: Pick<BlogPost, "slug" | "title">) {
  return [
    ...staticBreadcrumbTrails.blog,
    { name: post.title, path: `/blog/${post.slug}` },
  ];
}

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

export function getArticleSchema(
  post: Pick<BlogPost, "author" | "date" | "description" | "image" | "slug" | "tags" | "title">,
  modifiedDate: string
) {
  const articleAuthor =
    post.author.toLowerCase().includes("atlas biolabs")
      ? {
          "@type": "Organization",
          name: post.author,
        }
      : {
          "@type": "Person",
          name: post.author,
        };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: modifiedDate,
    author: articleAuthor,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(organizationLogoPath),
      },
    },
    image: [absoluteUrl(post.image)],
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.tags[0] ?? "Peptide Supply",
    keywords: post.tags.join(", "),
  };
}

export function getProductSchema(product: Product, categoryLabel: string) {
  const productUrl = absoluteUrl(`/shop/${product.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: getProductIntro(product.name),
    image: [absoluteUrl(product.image)],
    url: productUrl,
    sku: product.slug,
    productID: product.slug,
    category: categoryLabel,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: productManufacturerName,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: String(product.priceFrom),
      availability: "https://schema.org/InStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };
}

export function getProductSeoCopy(product: Product, categoryLabel: string) {
  const packSizes = product.packSizes.join(", ");
  const documentation = product.purityDocumentation.slice(0, 2).join(" ");
  const functionalRole = product.functionalRole.join(", ");
  const applications = product.commonApplications.join(", ");
  const characteristics = product.keyCharacteristics.join("; ");

  return [
    `${product.overview} Within our ${categoryLabel.toLowerCase()} catalog, we position ${product.name} around the functional roles of ${functionalRole} so commercial buyers can compare the peptide against adjacent sourcing options used in formulation, laboratory review, and health-adjacent product-development conversations.`,
    `${product.mechanismInsight} In research-aware formulation and laboratory sourcing workflows, ${product.name} is commonly discussed for ${applications}, which helps buyers frame the peptide inside realistic signaling, cosmetic, repair-focused, metabolic, or technical-evaluation contexts before requesting pricing or documentation.`,
    `Key characteristics include ${characteristics}. We supply ${product.name} in pack sizes such as ${packSizes}, with MOQ ${product.moq} units, ${product.leadTime} lead times, Atlas Labs quality review, and documentation support. ${documentation}`,
  ];
}

const categoryFocus: Record<
  ProductCategoryId,
  { useCase: string; demandNote: string; buyerIntent: string }
> = {
  "signal-peptides": {
    useCase: "skin-signaling, barrier-support, and collagen-oriented formulation programs",
    demandNote: "private-label skin care systems and premium formulation pipelines with strong research language",
    buyerIntent:
      "buyers looking to source signal peptides in repeatable commercial volume for cosmetic and formulation-led portfolios",
  },
  "carrier-peptides": {
    useCase: "repair-oriented, mineral-delivery, and cosmetic support systems",
    demandNote: "OEM and ODM formulation teams scaling specialized ingredient systems with clearer technical positioning",
    buyerIntent:
      "buyers comparing carrier peptide suppliers for consistency, lot support, and stronger research-facing product narratives",
  },
  "neurotransmitter-peptides": {
    useCase: "expression-line, smoothing, and advanced cosmetic positioning",
    demandNote: "high-velocity anti-aging assortments and formulation concepts in beauty channels",
    buyerIntent:
      "teams selecting neurotransmitter peptide products with practical MOQ visibility and academically credible formulation context",
  },
  "enzyme-inhibitor-peptides": {
    useCase: "tone-control, complexion-focused, and anti-aging concept development",
    demandNote: "category expansions that require precise product positioning and documentation matching",
    buyerIntent:
      "buyers sourcing enzyme inhibitor peptides with scalable wholesale support and clearer commercial-research positioning",
  },
  "antimicrobial-peptides": {
    useCase: "specialty skin-protection, surface-defense, and advanced formulation planning",
    demandNote: "innovation-led product teams balancing niche demand with reliable dispatch and stronger scientific storytelling",
    buyerIntent:
      "commercial operators evaluating antimicrobial peptide options for recurring procurement and health-adjacent catalog development",
  },
  "growth-repair-peptides": {
    useCase: "repair-focused, regeneration-oriented, and recovery-adjacent product planning",
    demandNote: "buyers managing mixed demand across B2B and direct retail channels with formulation-led growth categories",
    buyerIntent:
      "teams sourcing growth peptides with MOQ clarity, responsive quote support, and realistic research-aware positioning",
  },
  "metabolic-advanced-peptides": {
    useCase: "advanced metabolic, performance-discussion, and trend-responsive peptide portfolio strategy",
    demandNote: "operators adapting inventory around fast-moving high-demand SKUs that sit close to current health and peptide-research conversations",
    buyerIntent:
      "buyers benchmarking metabolic peptide suppliers for speed, documentation, scale, and stronger research-aware commercial framing",
  },
  "trending-emerging-peptides": {
    useCase: "current-demand peptide discovery, blend-led formulation planning, and emerging advanced-category sourcing programs",
    demandNote: "catalog operators and wholesale teams tracking newer peptide discussions, specialty blends, and commercially relevant research-aware sequences",
    buyerIntent:
      "buyers sourcing trending and emerging peptides with status visibility, documentation support, and direct links into rankable current-interest product pages",
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
    `${category.label} are part of our commercial peptide supplier catalog for ${focus.useCase}. We built this category page to help buyers compare wholesale peptides, review category-specific sourcing context, and move directly into detailed product pages without losing track of commercial buying priorities. Products in this group include ${examples}, which gives procurement teams a clean starting point for comparing format, MOQ, documentation expectations, and the kinds of health-adjacent or formulation-led conversations these peptides typically sit inside.`,
    `${category.label} demand often spans pilot orders, recurring replenishment, and multi-SKU wholesale planning. That is why we keep pricing entry points, MOQ visibility, and lead-time guidance in a consistent format across every listing in this category. MOQ coverage in this group ranges from ${moqRange.min} to ${moqRange.max} units depending on the SKU, and we support those programs through global sourcing with qualified manufacturing partners in China and Atlas Labs documentation review.`,
    `Buyers evaluating ${category.label.toLowerCase()} are usually balancing formulation fit, documentation readiness, scientific positioning, and supply continuity at the same time. This category is designed for ${focus.demandNote}, so you can compare products with enough context to shortlist viable options before sending a quote request. We also connect this category page to quality assurance resources, research support, and related blog guidance so teams can understand sourcing considerations before commercial discussions begin.`,
    `If your team is ${focus.buyerIntent}, this page should function as more than a directory. It should help you move from category research into purchase planning with clearer expectations around pack sizes, commercial response time, batch transparency support, and the broader peptide-research language surrounding the category. Use the product listings below to compare candidates, then contact us with your target pack size, destination market, and delivery window so we can align supply notes and documentation around your program.`,
  ];
}
