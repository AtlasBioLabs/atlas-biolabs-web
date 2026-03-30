"use client";

import { type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";

import { addInquiryItemAction } from "@/app/(site)/cart/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InquiryProduct = {
  slug: string;
  moq: number;
};

type AddToInquiryButtonProps = {
  product: InquiryProduct;
  className?: string;
  children?: ReactNode;
} & VariantProps<typeof buttonVariants>;

export function AddToInquiryButton({
  product,
  className,
  variant = "default",
  size = "default",
  children = "Add to Inquiry",
}: AddToInquiryButtonProps) {
  return (
    <form action={addInquiryItemAction} className="w-full">
      <input type="hidden" name="slug" value={product.slug} />
      <input type="hidden" name="quantity" value={String(product.moq)} />
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={cn("w-full touch-manipulation", className)}
      >
        {children}
      </Button>
    </form>
  );
}
