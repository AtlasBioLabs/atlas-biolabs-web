import type { MetadataRoute } from "next";

import { getAllBlogPosts, getBlogPostModifiedDate } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site-config";
import { productCategories, products } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/shop"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/categories"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/wholesale"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/custom-requests"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: absoluteUrl("/request-quote"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: absoluteUrl("/quality-assurance"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: absoluteUrl("/research"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/shop/${product.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = productCategories.map((category) => ({
    url: absoluteUrl(`/categories/${category.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.82,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(getBlogPostModifiedDate(post)),
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
