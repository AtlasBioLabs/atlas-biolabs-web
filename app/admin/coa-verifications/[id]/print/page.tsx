"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AdminGuard } from "@/components/admin/admin-guard";
import { CoaDocumentTemplate } from "@/components/admin/coa-document-template";
import { CoaPrintActions } from "@/components/admin/coa-print-actions";
import { Card, CardContent } from "@/components/ui/card";
import {
  getActiveCoaBrandSettings,
  getDefaultCoaBrandSettings,
  type CoaBrandSettings,
} from "@/lib/coa-brand-settings";
import {
  getCoaPrintWarnings,
  getCoaVerificationRowById,
  resolveVerificationUrl,
} from "@/lib/coa-verification-admin";
import {
  mapCoaVerificationRowToRecord,
  type CoaVerificationRecord,
} from "@/lib/coa-verification";
import type { BreadcrumbItem } from "@/lib/seo";

export default function PrintCoaVerificationPage() {
  const params = useParams<{ id: string }>();
  const recordId = Array.isArray(params.id) ? params.id[0] : params.id;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "COA Admin", path: "/admin/coa-verifications" },
    {
      name: "Print COA",
      path: `/admin/coa-verifications/${recordId}/print`,
    },
  ];

  return (
    <AdminGuard
      title="Printable COA preview"
      description="Preview the batch-specific Certificate of Analysis and print or save it as a PDF from the browser."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase }) => (
        <PrintableCoaView recordId={recordId} supabase={supabase} />
      )}
    </AdminGuard>
  );
}

function PrintableCoaView({
  recordId,
  supabase,
}: {
  recordId: string;
  supabase: Parameters<typeof getCoaVerificationRowById>[0];
}) {
  const [coa, setCoa] = useState<CoaVerificationRecord | null>(null);
  const [branding, setBranding] = useState<CoaBrandSettings>(getDefaultCoaBrandSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [row, activeBranding] = await Promise.all([
          getCoaVerificationRowById(supabase, recordId),
          getActiveCoaBrandSettings(supabase),
        ]);

        if (!isMounted) {
          return;
        }

        if (!row) {
          setErrorMessage("The requested COA record could not be found.");
          setIsLoading(false);
          return;
        }

        setCoa(mapCoaVerificationRowToRecord(row));
        setBranding(activeBranding);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "The COA preview could not be loaded."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [recordId, supabase]);

  if (isLoading) {
    return (
      <Card className="surface-card border p-0">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading printable COA...
        </CardContent>
      </Card>
    );
  }

  if (errorMessage || !coa) {
    return (
      <Card className="surface-card border border-rose-200 bg-rose-50/60 p-0">
        <CardContent className="py-6 text-sm text-rose-800">
          {errorMessage ?? "The COA record could not be prepared for printing."}
        </CardContent>
      </Card>
    );
  }

  const verificationUrl = resolveVerificationUrl({
    verificationCode: coa.verificationCode,
    verificationUrl: coa.verificationUrl,
    brandingBaseUrl: branding.verification_base_url,
    originFallback: typeof window !== "undefined" ? window.location.origin : null,
  });
  const warnings = getCoaPrintWarnings(coa);

  return (
    <div className="space-y-6">
      <CoaPrintActions
        backHref="/admin/coa-verifications"
        editHref={`/admin/coa-verifications/${recordId}/edit`}
        publicVerificationHref={`/verify/${encodeURIComponent(coa.verificationCode)}`}
        verificationUrl={verificationUrl}
        warnings={warnings}
      />
      <CoaDocumentTemplate
        coa={coa}
        branding={branding}
        verificationUrl={verificationUrl}
      />
    </div>
  );
}
