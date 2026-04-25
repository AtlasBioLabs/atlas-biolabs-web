"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { AddToInquiryButton } from "@/components/site/add-to-inquiry-button";
import { Button } from "@/components/ui/button";
import { Product, productCategories } from "@/lib/site-content";

type ProductCardProps = {
  product: Pick<
    Product,
    | "slug"
    | "name"
    | "category"
    | "status"
    | "image"
    | "shortDescription"
    | "packSizes"
    | "moq"
    | "priceFrom"
  >;
};

export function ProductCard({ product }: ProductCardProps) {
  const categoryLabel =
    productCategories.find((category) => category.id === product.category)?.label ??
    product.category;
  const statusClasses = {
    Standard: "border-border/70 bg-white text-[var(--brand-navy)]",
    Established: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Emerging: "border-amber-200 bg-amber-50 text-amber-700",
    Blend: "border-[var(--brand-blue)]/20 bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]",
  } as const;

  const quoteHref = "/request-quote";

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/3] w-full border-b border-border/70 bg-gradient-to-br from-[#f7faff] to-[#edf3ff]">
        <Image
          src={product.image}
          alt={`${product.name} peptide catalog image for ${categoryLabel}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/categories/${product.category}`}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)] hover:underline"
          >
            {categoryLabel}
          </Link>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusClasses[product.status]}`}
          >
            {product.status}
          </span>
        </div>
        <h3 className="mt-2 text-xl font-semibold text-[var(--brand-navy)]">
          <Link href={`/shop/${product.slug}`} className="hover:text-[var(--brand-blue)]">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-4 space-y-2 rounded-lg border border-border/70 bg-muted/35 px-3 py-3">
          <div className="flex items-end justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Starting from
            </p>
            <p className="text-base font-semibold text-[var(--brand-navy)]">
              ${product.priceFrom} USD
            </p>
          </div>
          <p className="text-xs text-muted-foreground">MOQ: {product.moq} units</p>
          <p className="text-xs text-muted-foreground">
            Pack sizes: {product.packSizes.join(" | ")}
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/shop/${product.slug}`} className="justify-center gap-2">
              View Product
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={quoteHref} className="justify-center">
              Request Quote
            </Link>
          </Button>
          <AddToInquiryButton
            product={product}
            className="w-full bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
          />
        </div>
      </div>
    </article>
  );
}
