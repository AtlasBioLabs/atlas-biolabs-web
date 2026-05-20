import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CoaVerificationResult } from "@/components/site/coa-verification-result";
import { JsonLd } from "@/components/site/json-ld";
import { createPageMetadata, getBreadcrumbSchema, type BreadcrumbItem } from "@/lib/seo";
import { getCoaVerificationByCode } from "@/lib/coa-verification";

type VerifyDetailPageProps = {
  params: Promise<{ verificationCode: string }>;
};

export async function generateMetadata({
  params,
}: VerifyDetailPageProps): Promise<Metadata> {
  const { verificationCode } = await params;

  return createPageMetadata({
    title: "COA Verification",
    path: `/verify/${encodeURIComponent(verificationCode)}`,
    description: "Verify Atlas Labs Certificate of Analysis records by COA verification code.",
    keywords: ["COA verification", "certificate verification", verificationCode],
  });
}

export default async function VerifyDetailPage({ params }: VerifyDetailPageProps) {
  const { verificationCode } = await params;
  const decodedCode = decodeURIComponent(verificationCode).trim();
  const record = getCoaVerificationByCode(decodedCode);

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "COA Verification", path: "/verify" },
    { name: decodedCode || "Verification Result", path: `/verify/${verificationCode}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd id="verify-detail-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] via-white to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Atlas Labs Verification
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            COA verification result
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Atlas BioLabs verification confirms document status only. It does not
            provide dosage, treatment, medical, veterinary, diagnostic, or
            human-use guidance.
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container">
          <CoaVerificationResult
            record={record}
            verificationCode={decodedCode}
          />
        </div>
      </section>
    </>
  );
}
