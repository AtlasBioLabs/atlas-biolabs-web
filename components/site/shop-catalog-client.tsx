"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import type { Product, ProductCategory, ProductCategoryId } from "@/lib/site-content";

type ShopCatalogClientProps = {
  products: Product[];
  categories: ProductCategory[];
};

type CategoryFilter = "all" | ProductCategoryId;

export function ShopCatalogClient({ products, categories }: ShopCatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const filteredProducts = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory, products]
  );

  const countsByCategory = useMemo(() => {
    return categories.reduce((accumulator, category) => {
      accumulator[category.id] = products.filter(
        (product) => product.category === category.id
      ).length;
      return accumulator;
    }, {} as Record<ProductCategoryId, number>);
  }, [categories, products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={activeCategory === "all" ? "default" : "outline"}
          className={
            activeCategory === "all"
              ? "bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
              : ""
          }
          onClick={() => setActiveCategory("all")}
        >
          All ({products.length})
        </Button>
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <Button
              key={category.id}
              type="button"
              variant={isActive ? "default" : "outline"}
              className={
                isActive ? "bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]" : ""
              }
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label} ({countsByCategory[category.id] ?? 0})
            </Button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
