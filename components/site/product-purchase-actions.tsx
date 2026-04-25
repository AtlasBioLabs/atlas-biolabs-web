import Link from "next/link";

import { AddToInquiryButton } from "@/components/site/add-to-inquiry-button";
import { Button } from "@/components/ui/button";

type ProductPurchaseActionsProps = {
  product: {
    slug: string;
    name: string;
    image: string;
    priceFrom: number;
    moq: number;
  };
};

export function ProductPurchaseActions({ product }: ProductPurchaseActionsProps) {
  const quoteHref = "/request-quote";

  return (
    <div className="flex flex-wrap gap-3">
      <AddToInquiryButton
        product={product}
        className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
      />
      <Button asChild variant="outline">
        <Link href={quoteHref}>Request Quote</Link>
      </Button>
    </div>
  );
}
