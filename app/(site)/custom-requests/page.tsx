import type { Metadata } from "next";

import { CtaSection } from "@/components/site/cta-section";
import { CustomRequestForm } from "@/components/site/custom-request-form";
import { ResourceLinksPanel } from "@/components/site/resource-links-panel";
import { createPageMetadata } from "@/lib/seo";
import {
  contactDetails,
  customCta,
  customRequestCapabilities,
  customRequestsIntro,
} from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Custom Requests",
  path: "/custom-requests",
  description:
    "Submit custom peptide sourcing requests to Atlas BioLabs for sequence feasibility, MOQ planning, Atlas Labs documentation review support, and commercial quote handling.",
  keywords: [
    "custom peptide request",
    "custom sequence peptide supplier",
    "peptide manufacturing inquiry",
  ],
});

export default function CustomRequestsPage() {
  return (
    <>
      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="site-container">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Custom Requests
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            {customRequestsIntro.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {customRequestsIntro.description}
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="surface-card space-y-4 p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[var(--brand-navy)]">
              What We Can Support
            </h2>
            <ul className="space-y-3">
              {customRequestCapabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-[var(--brand-navy)]"
                >
                  {capability}
                </li>
              ))}
            </ul>
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              We review custom submissions based on sourcing feasibility, MOQ fit, documentation readiness, and supply scheduling requirements.
            </p>
            <div className="rounded-lg border border-border/70 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Sales Contact
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--brand-navy)]">
                {contactDetails.recipientEmail}
              </p>
            </div>
          </article>
          <CustomRequestForm />
        </div>
      </section>

      <ResourceLinksPanel
        eyebrow="Helpful Links"
        title="Compare Standard Products Before You Submit a Custom Request"
        description="Buyers often review the existing catalog, wholesale supply notes, and research support pages before deciding whether a custom peptide request is the right path."
        links={[
          {
            title: "Shop Peptides",
            href: "/shop",
            description:
              "Check whether a standard product listing already covers your sequence or application needs.",
            eyebrow: "Catalog",
          },
          {
            title: "Wholesale Supply",
            href: "/wholesale",
            description:
              "Review MOQ planning and recurring supply context if the request is tied to larger-volume procurement.",
            eyebrow: "Supply",
          },
          {
            title: "Atlas Labs Research",
            href: "/research",
            description:
              "Understand how Atlas Labs supports classification, documentation review, and commercial handoff.",
            eyebrow: "Research",
          },
        ]}
      />

      <CtaSection content={customCta} className="pt-0" />
    </>
  );
}
