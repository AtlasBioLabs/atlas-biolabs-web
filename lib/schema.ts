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

export function productJsonLd(product: any, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku || product.catalogCode,
    brand: {
      "@type": "Brand",
      name: "Atlas BioLabs",
    },
    category: product.category,
    description: product.shortDescription || product.metaDescription,
    image: product.image ? `${siteUrl}${product.image}` : undefined,
    url: `${siteUrl}/shop/${product.slug}`,
    offers: product.startingPrice
      ? {
          "@type": "Offer",
          priceCurrency: product.priceCurrency || "USD",
          price: String(product.startingPrice),
          availability: product.availability || "https://schema.org/InStock",
          url: `${siteUrl}/shop/${product.slug}`,
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

export function productGroupJsonLd(product: any, siteUrl: string) {
  if (!product.packSizes || product.packSizes.length < 2) return null;

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
    url: `${siteUrl}/shop/${product.slug}`,
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
            url: `${siteUrl}/shop/${product.slug}`,
          }
        : undefined,
    })),
  };
}