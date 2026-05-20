import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createPageMetadata, getBreadcrumbSchema, type BreadcrumbItem } from "@/lib/seo";

type VerifyPageProps = {
  searchParams: Promise<{
    verificationCode?: string | string[];
  }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "COA Verification",
  path: "/verify",
  description: "Verify Atlas Labs Certificate of Analysis records by COA verification code.",
  keywords: ["COA verification", "certificate verification", "Atlas Labs COA"],
});

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Verification", path: "/verify" },
];

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const verificationCode = getFirstValue(params.verificationCode).trim();

  if (verificationCode) {
    redirect(`/verify/${encodeURIComponent(verificationCode)}`);
  }

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd id="verify-breadcrumb-schema" data={breadcrumbSchema} />

      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] via-white to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Atlas Labs Verification
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Verify a Certificate of Analysis
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Enter the verification code printed on your Atlas Labs Certificate of
            Analysis.
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="surface-card border p-0">
            <CardHeader className="border-b border-border/70 py-6">
              <CardTitle className="text-2xl text-[var(--brand-navy)]">
                COA verification lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <form action="/verify" method="get" className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="verificationCode"
                    className="text-sm font-medium text-[var(--brand-navy)]"
                  >
                    Verification code
                  </label>
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="ATL-BPC157-2026-001-X9K4P2"
                    className="h-11 border-[#d5def0] bg-white px-4 font-medium text-[var(--brand-navy)] placeholder:text-slate-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 w-full bg-[#0A1A2F] text-white hover:bg-[#2E6BFF]"
                >
                  Verify COA
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="surface-card border p-0">
            <CardHeader className="border-b border-border/70 py-6">
              <CardTitle className="text-2xl text-[var(--brand-navy)]">
                Verification notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              <div className="rounded-xl border border-[#d5def0] bg-[#f7faff] p-4">
                <p className="text-sm leading-relaxed text-[var(--brand-navy)]">
                  Use this page to confirm whether an Atlas Labs Certificate of
                  Analysis record is released, pending review, or no longer valid
                  within the current verification register.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-relaxed text-amber-900">
                  Atlas BioLabs verification confirms document status only. It
                  does not provide dosage, treatment, medical, veterinary,
                  diagnostic, or human-use guidance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
