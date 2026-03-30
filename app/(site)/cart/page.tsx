import type { Metadata } from "next";

import { CartPageClient } from "@/components/site/cart-page-client";
import { getInquiryCart } from "@/lib/cart-session";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Inquiry Cart",
  path: "/cart",
  description:
    "Review selected peptides, adjust MOQ-based quantities, and submit one consolidated inquiry for Atlas BioLabs commercial sourcing and quote support.",
  keywords: [
    "peptide inquiry cart",
    "Atlas BioLabs inquiry cart",
  ],
  noIndex: true,
});

export default async function CartPage() {
  const items = await getInquiryCart();

  return (
    <>
      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Inquiry Cart
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--brand-navy)]">
            Review Your Inquiry Cart
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Add products, set quantities, and submit one inquiry for availability, documentation support options, and commercial quote follow-up.
          </p>
        </div>
      </section>
      <CartPageClient items={items} />
    </>
  );
}
