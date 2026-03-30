import type { Metadata } from "next";

import { ContactForm } from "@/components/site/contact-form";
import { CtaSection } from "@/components/site/cta-section";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { createPageMetadata } from "@/lib/seo";
import { contactCta, contactDetails } from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Contact Atlas BioLabs sales for global peptide sourcing support, MOQ planning, documentation guidance, and wholesale quote requests for U.S. and international buyers.",
  keywords: [
    "contact peptide supplier",
    "request peptide quote",
    "Atlas BioLabs sales",
  ],
});

export default function ContactPage() {
  return (
    <>
      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Contact
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Talk with our sales team
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Share your peptide targets, quantity needs, and timeline. We will guide you through the right sourcing and quote process, including documentation and batch transparency support where needed.
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="surface-card space-y-4 p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              Sales Contact
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-[var(--brand-navy)]">Email: </span>
                {contactDetails.recipientEmail}
              </p>
            </div>
            <p className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
              {contactDetails.detailsNotice}
            </p>
          </article>

          <ContactForm />
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Need More Context?"
        title="Review the Pages Buyers Usually Open Before Contacting Us"
        description="These links help commercial buyers review products, wholesale planning, and documentation support before or after they submit a contact request."
        links={[
          {
            title: "Shop Peptides",
            href: "/shop",
            description:
              "Compare individual products, MOQ, pack sizes, and sourcing context across the catalog.",
            eyebrow: "Catalog",
          },
          {
            title: "Wholesale Supply",
            href: "/wholesale",
            description:
              "Learn how we support recurring supply, planning windows, and bulk peptide programs.",
            eyebrow: "Supply",
          },
          {
            title: "Quality Assurance",
            href: "/quality-assurance",
            description:
              "Understand our documentation review system, batch transparency support, and release workflow.",
            eyebrow: "Documentation",
          },
        ]}
      />

      <CtaSection content={contactCta} className="pt-0" />
    </>
  );
}
