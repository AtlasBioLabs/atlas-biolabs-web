import type { BlogPost } from "contentlayer/generated";

import { absoluteUrl } from "@/lib/site-config";
import type { Product } from "@/lib/site-content";
import { contactDetails } from "@/lib/site-content";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site";

export function itemListJsonLd(
  items: Array<{ name: string; url: string; position: number }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

export function collectionPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(product: Product, siteUrl = "") {
  const productUrl = siteUrl
    ? `${siteUrl.replace(/\/$/, "")}/shop/${product.slug}`
    : absoluteUrl(`/shop/${product.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    description: product.shortDescription || product.metaDescription,
    image: product.image ? absoluteUrl(product.image) : undefined,
    url: productUrl,
    offers: product.startingPrice
      ? {
          "@type": "Offer",
          priceCurrency: product.priceCurrency || "USD",
          price: String(product.startingPrice),
          availability: product.availability || "https://schema.org/InStock",
          url: productUrl,
        }
      : undefined,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "MOQ",
        value: product.moq,
      },
      {
        "@type": "PropertyValue",
        name: "Lead Time",
        value: product.leadTime,
      },
      {
        "@type": "PropertyValue",
        name: "Documentation",
        value: product.documentation,
      },
    ].filter((property) => property.value),
  };
}

export function productGroupJsonLd(product: Product, siteUrl = "") {
  if (!product.packSizes || product.packSizes.length < 2) return null;
  const productUrl = siteUrl
    ? `${siteUrl.replace(/\/$/, "")}/shop/${product.slug}`
    : absoluteUrl(`/shop/${product.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: product.name,
    productGroupID: product.sku || product.catalogCode,
    brand: {
      "@type": "Brand",
      name: "Atlas BioLabs",
    },
    description: product.shortDescription || product.metaDescription,
    url: productUrl,
    variesBy: ["https://schema.org/size"],
    hasVariant: product.packSizes.map((size: string, index: number) => ({
      "@type": "Product",
      name: `${product.name} - ${size}`,
      sku: `${product.sku || product.catalogCode}-${index + 1}`,
      size,
      isVariantOf: {
        "@type": "ProductGroup",
        productGroupID: product.sku || product.catalogCode,
      },
      offers: product.startingPrice
        ? {
            "@type": "Offer",
            priceCurrency: product.priceCurrency || "USD",
            price: String(product.startingPrice),
            availability:
              product.availability || "https://schema.org/InStock",
            url: productUrl,
          }
        : undefined,
    })),
  };
}

export function webPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
  };
}

export function articleJsonLd(post: BlogPost) {
  const modifiedDate = post.updatedAt ?? post.updated ?? post.date;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.description,
    datePublished: post.date,
    dateModified: modifiedDate,
    image: [absoluteUrl(post.image)],
    author: {
      "@type": post.author.toLowerCase().includes("atlas biolabs")
        ? "Organization"
        : "Person",
      name: post.author,
    },
    publisher: organizationJsonLd(),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/atlas-biolabs-logo.svg"),
    description: DEFAULT_DESCRIPTION,
    telephone: "+18059410541",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "29520 Kohoutek Way",
        addressLocality: "Union City",
        addressRegion: "CA",
        postalCode: "94587",
        addressCountry: "US",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "No.333 Guiping Road",
        addressLocality: "Shanghai",
        addressCountry: "CN",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+18059410541",
        areaServed: ["US", "CN", "International"],
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+18059410541",
        areaServed: ["US", "CN", "International"],
        availableLanguage: ["English"],
      },
    ],
  };
}
