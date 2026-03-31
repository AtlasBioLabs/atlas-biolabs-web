"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
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

function SubmitInquiryButton({
  className,
  variant,
  size,
  children,
}: Pick<AddToInquiryButtonProps, "className" | "variant" | "size" | "children">) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={cn("w-full touch-manipulation", className)}
      disabled={pending}
    >
      {pending ? "Adding..." : children}
    </Button>
  );
}

export function AddToInquiryButton({
  product,
  className,
  variant = "default",
  size = "default",
  children = "Add to Inquiry",
}: AddToInquiryButtonProps) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/cart");
  }, [router]);

  return (
    <form action={addInquiryItemAction} className="w-full">
      <input type="hidden" name="slug" value={product.slug} />
      <input type="hidden" name="quantity" value={String(product.moq)} />
      <SubmitInquiryButton
        className={className}
        variant={variant}
        size={size}
      >
        {children}
      </SubmitInquiryButton>
    </form>
  );
}
