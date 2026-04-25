import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-space bg-gradient-to-b from-[#f8fbff] to-white">
      <div className="site-container">
        <article className="surface-card mx-auto max-w-3xl p-8 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Atlas BioLabs
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--brand-navy)]">
            Page not found
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page you requested is not available. Continue into the peptide
            catalog, category hub, or blog to keep browsing commercial supply
            content and product detail pages.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop">Browse Shop</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/categories">View Categories</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/blog">Read the Blog</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Atlas BioLabs</Link>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}
