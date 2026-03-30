import Link from "next/link";

import { companyProofFacts } from "@/lib/site-proof";
import { brand, contactDetails, navItems } from "@/lib/site-content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-[var(--brand-navy)] text-white">
      <div className="site-container py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">{brand.name}</h2>
            <p className="max-w-md text-sm text-white/75">{brand.tagline}</p>
            <p className="max-w-md text-sm text-white/70">
              We support U.S. and international buyers through qualified manufacturing partners in China, Atlas Labs documentation review, and quote-based commercial workflows.
            </p>
            <div className="pt-1 text-sm text-white/80">
              <Link href="/request-quote" className="hover:text-white">
                Request Quote
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-white/75">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-white/75">
              <p>{contactDetails.recipientEmail}</p>
            </div>
            <p className="text-xs text-white/55">
              {contactDetails.detailsNotice}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              Company Signals
            </h3>
            <ul className="space-y-2 text-sm text-white/75">
              {companyProofFacts.slice(0, 2).map((fact) => (
                <li key={fact.label}>
                  <span className="font-medium text-white">{fact.label}: </span>
                  {fact.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-4 text-xs text-white/65">
          <p>
            (c) {year} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
