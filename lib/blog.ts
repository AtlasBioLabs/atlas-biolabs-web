import { allBlogPosts, type BlogPost } from "contentlayer/generated";

import { absoluteUrl } from "@/lib/site-config";
import {
  productCategories,
  products,
  type Product,
  type ProductCategory,
  type ProductCategoryId,
} from "@/lib/site-content";

export type BlogHeading = {
  level: number;
  text: string;
  slug: string;
};

type BlogReadingTimeSource = Pick<BlogPost, "readingTime" | "readingTimeMinutes">;

function toTime(value: string) {
  return new Date(value).getTime();
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2);
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getBlogCorpus(post: BlogPost) {
  return normalizeText(
    [post.title, post.description, post.slug, post.tags.join(" "), post.body.raw].join(" ")
  );
}

function scorePost(post: BlogPost, keywords: string[]) {
  const corpus = getBlogCorpus(post);
  const titleAndTags = normalizeText(
    [post.title, post.description, post.tags.join(" ")].join(" ")
  );

  return uniqueStrings(
    keywords.flatMap((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      return normalizedKeyword.includes(" ")
        ? [normalizedKeyword]
        : [normalizedKeyword, ...tokenize(normalizedKeyword)];
    })
  ).reduce((score, keyword) => {
    if (!keyword) {
      return score;
    }

    if (titleAndTags.includes(keyword)) {
      return score + (keyword.includes(" ") ? 8 : 4);
    }

    if (corpus.includes(keyword)) {
      return score + (keyword.includes(" ") ? 4 : 2);
    }

    return score;
  }, 0);
}

function getProductCorpus(product: Product) {
  const category = productCategories.find((entry) => entry.id === product.category);

  return normalizeText(
    [
      product.name,
      category?.label ?? "",
      category?.description ?? "",
      product.shortDescription,
      product.overview,
      product.functionalRole.join(" "),
      product.commonApplications.join(" "),
      product.keyCharacteristics.join(" "),
      product.packSizes.join(" "),
    ].join(" ")
  );
}

function scoreProduct(product: Product, keywords: string[]) {
  const category = productCategories.find((entry) => entry.id === product.category);
  const corpus = getProductCorpus(product);
  const titleAndCategory = normalizeText(
    [product.name, category?.label ?? "", category?.description ?? ""].join(" ")
  );

  return uniqueStrings(
    keywords.flatMap((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      return normalizedKeyword.includes(" ")
        ? [normalizedKeyword]
        : [normalizedKeyword, ...tokenize(normalizedKeyword)];
    })
  ).reduce((score, keyword) => {
    if (!keyword) {
      return score;
    }

    if (titleAndCategory.includes(keyword)) {
      return score + (keyword.includes(" ") ? 8 : 4);
    }

    if (corpus.includes(keyword)) {
      return score + (keyword.includes(" ") ? 4 : 2);
    }

    return score;
  }, 0);
}

function getCategoryCorpus(category: ProductCategory) {
  const categoryProducts = products
    .filter((product) => product.category === category.id)
    .map((product) => product.name);

  return normalizeText(
    [category.label, category.description, categoryProducts.join(" ")].join(" ")
  );
}

function scoreCategory(category: ProductCategory, keywords: string[]) {
  const corpus = getCategoryCorpus(category);
  const labelAndDescription = normalizeText(
    [category.label, category.description].join(" ")
  );

  return uniqueStrings(
    keywords.flatMap((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      return normalizedKeyword.includes(" ")
        ? [normalizedKeyword]
        : [normalizedKeyword, ...tokenize(normalizedKeyword)];
    })
  ).reduce((score, keyword) => {
    if (!keyword) {
      return score;
    }

    if (labelAndDescription.includes(keyword)) {
      return score + (keyword.includes(" ") ? 8 : 4);
    }

    if (corpus.includes(keyword)) {
      return score + (keyword.includes(" ") ? 4 : 2);
    }

    return score;
  }, 0);
}

export function getAllBlogPosts() {
  return allBlogPosts.slice().sort((a, b) => toTime(b.date) - toTime(a.date));
}

export function getBlogPostBySlug(slug: string) {
  return allBlogPosts.find((post) => post.slug === slug);
}

export function getBlogPostModifiedDate(post: BlogPost) {
  return post.updated ?? post.date;
}

export function getBlogPostHeadings(post: BlogPost) {
  return Array.isArray(post.headings) ? (post.headings as BlogHeading[]) : [];
}

export function getBlogReadingTime(post: BlogReadingTimeSource) {
  if (typeof post.readingTime === "string" && post.readingTime.length > 0) {
    return post.readingTime;
  }

  const minutes =
    typeof post.readingTimeMinutes === "number" && post.readingTimeMinutes > 0
      ? post.readingTimeMinutes
      : 1;

  return `${minutes} min read`;
}

export function getRecentBlogPosts(limit = 3, excludeSlug?: string) {
  return getAllBlogPosts()
    .filter((post) => post.slug !== excludeSlug)
    .slice(0, limit);
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const genericTokens = new Set([
    "atlas",
    "biolabs",
    "guide",
    "market",
    "commercial",
    "buyers",
    "buyer",
    "sourcing",
    "peptide",
    "peptides",
  ]);

  const keywordPool = uniqueStrings([
    ...post.tags,
    ...tokenize(post.title).filter((token) => !genericTokens.has(token)),
    ...tokenize(post.description).filter((token) => !genericTokens.has(token)),
  ]);

  const rankedPosts = getAllBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: scorePost(candidate, keywordPool),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || toTime(getBlogPostModifiedDate(b.post)) - toTime(getBlogPostModifiedDate(a.post)));

  const topMatches = rankedPosts.slice(0, limit).map((entry) => entry.post);

  if (topMatches.length >= limit) {
    return topMatches;
  }

  const fallbackPosts = getRecentBlogPosts(limit, post.slug).filter(
    (candidate) => !topMatches.some((entry) => entry.slug === candidate.slug)
  );

  return [...topMatches, ...fallbackPosts].slice(0, limit);
}

function getPostsForKeywords(keywords: string[], limit = 3, excludeSlugs: string[] = []) {
  const rankedPosts = getAllBlogPosts()
    .filter((post) => !excludeSlugs.includes(post.slug))
    .map((post) => ({
      post,
      score: scorePost(post, keywords),
    }))
    .sort((a, b) => b.score - a.score || toTime(getBlogPostModifiedDate(b.post)) - toTime(getBlogPostModifiedDate(a.post)));

  const matchingPosts = rankedPosts
    .filter((entry) => entry.score > 0)
    .map((entry) => entry.post)
    .slice(0, limit);

  if (matchingPosts.length >= limit) {
    return matchingPosts;
  }

  const fallbackPosts = getRecentBlogPosts(limit + excludeSlugs.length)
    .filter((post) => !excludeSlugs.includes(post.slug))
    .filter((post) => !matchingPosts.some((entry) => entry.slug === post.slug));

  return [...matchingPosts, ...fallbackPosts].slice(0, limit);
}

export function getRelevantBlogPostsForCategory(
  categoryId: ProductCategoryId,
  limit = 3
) {
  const category = productCategories.find((entry) => entry.id === categoryId);
  const categoryProducts = products
    .filter((product) => product.category === categoryId)
    .slice(0, 4);

  if (!category) {
    return getRecentBlogPosts(limit);
  }

  return getPostsForKeywords(
    [
      category.label,
      category.description,
      ...categoryProducts.map((product) => product.name),
      "peptide supplier",
      "documentation",
      "wholesale peptides",
    ],
    limit
  );
}

export function getRelevantBlogPostsForProduct(product: Product, limit = 3) {
  const category = productCategories.find((entry) => entry.id === product.category);

  return getPostsForKeywords(
    [
      product.name,
      category?.label ?? product.category,
      ...product.commonApplications,
      ...product.functionalRole,
      "peptide supplier",
      "batch transparency",
      "documentation support",
    ],
    limit
  );
}

export function getRelevantProductsForBlogPost(post: BlogPost, limit = 3) {
  const genericTokens = new Set([
    "atlas",
    "biolabs",
    "guide",
    "market",
    "commercial",
    "buyers",
    "buyer",
    "sourcing",
    "peptide",
    "peptides",
    "supply",
  ]);

  const keywordPool = uniqueStrings([
    ...post.tags,
    ...tokenize(post.title).filter((token) => !genericTokens.has(token)),
    ...tokenize(post.description).filter((token) => !genericTokens.has(token)),
  ]);

  const rankedProducts = products
    .map((product) => ({
      product,
      score: scoreProduct(product, keywordPool),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  const matches = rankedProducts.slice(0, limit).map((entry) => entry.product);

  if (matches.length >= limit) {
    return matches;
  }

  const fallbackProducts = products.filter(
    (product) => !matches.some((entry) => entry.slug === product.slug)
  );

  return [...matches, ...fallbackProducts].slice(0, limit);
}

export function getRelevantCategoriesForBlogPost(post: BlogPost, limit = 2) {
  const genericTokens = new Set([
    "atlas",
    "biolabs",
    "guide",
    "market",
    "commercial",
    "buyers",
    "buyer",
    "sourcing",
    "peptide",
    "peptides",
    "supply",
  ]);

  const keywordPool = uniqueStrings([
    ...post.tags,
    ...tokenize(post.title).filter((token) => !genericTokens.has(token)),
    ...tokenize(post.description).filter((token) => !genericTokens.has(token)),
  ]);

  const rankedCategories = productCategories
    .map((category) => ({
      category,
      score: scoreCategory(category, keywordPool),
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.category.label.localeCompare(b.category.label)
    );

  const matches = rankedCategories.slice(0, limit).map((entry) => entry.category);

  if (matches.length >= limit) {
    return matches;
  }

  const fallbackCategories = productCategories.filter(
    (category) => !matches.some((entry) => entry.id === category.id)
  );

  return [...matches, ...fallbackCategories].slice(0, limit);
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function toCanonicalBlogUrl(slug?: string) {
  if (!slug) {
    return absoluteUrl("/blog");
  }

  return absoluteUrl(`/blog/${slug}`);
}

export function toOpenGraphImage(post: BlogPost) {
  return absoluteUrl(post.image);
}
