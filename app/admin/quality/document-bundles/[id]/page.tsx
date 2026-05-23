"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { AdminGuard } from "@/components/admin/admin-guard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BreadcrumbItem } from "@/lib/seo";
import { computeDocumentBundleStatus, refreshDocumentBundleStatusForBundle } from "@/lib/quality-service";
import { Trash2Icon } from "lucide-react";

type BundleRecord = {
  id: string;
  product_id: string;
  batch_id: string;
  coa_id: string;
  hplc_report_id?: string | null;
  ms_report_id?: string | null;
  sds_id?: string | null;
  bundle_number: string;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
};

type CoaDocumentRecord = {
  id: string;
  coa_number: string;
  issue_date: string;
  revision: number | string;
  document_status: string;
  release_decision: string;
  verification_code?: string | null;
};

type BatchRecord = {
  id: string;
  batch_number: string;
  lot_number?: string | null;
  manufacturing_date?: string | null;
  expiry_date?: string | null;
  status?: string | null;
  release_decision?: string | null;
};

type HplcReportRecord = {
  id: string;
  document_number: string;
  status: string;
  result_summary?: string | null;
};

type MsReportRecord = {
  id: string;
  document_number: string;
  status: string;
  identity_conclusion?: string | null;
};

type SdsRecord = {
  id: string;
  document_number: string;
  status: string;
  revision?: number | string | null;
};

type CoaVerificationBundleRecord = {
  id: string;
  coa_number?: string | null;
  product_name?: string | null;
  catalog_code?: string | null;
  batch_lot_no?: string | null;
  verification_code?: string | null;
  verification_status?: string | null;
  release_decision?: string | null;
};

type MaybeSingleResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

type MaybeSingleQuery<T> = {
  maybeSingle: () => PromiseLike<MaybeSingleResult<T>>;
};

type BundleDetailState = {
  bundle: BundleRecord;
  coa: CoaDocumentRecord | null;
  batch: BatchRecord | null;
  hplc: HplcReportRecord | null;
  ms: MsReportRecord | null;
  sds: SdsRecord | null;
  coaVerification: CoaVerificationBundleRecord | null;
};

type DownloadableDocumentType = "coa" | "hplc" | "ms" | "sds" | "bundle";

type DownloadMode = "open" | "download";

function getBadgeColor(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "draft":
    case "under_review":
      return "secondary";
    case "approved":
    case "released":
    case "active":
      return "default";
    case "correction_required":
    case "void":
    case "failed":
      return "destructive";
    case "incomplete":
    case "missing":
    default:
      return "outline";
  }
}

async function maybeSingle<T>(query: MaybeSingleQuery<T>): Promise<T | null> {
  const { data, error } = await query.maybeSingle();
  if (error) {
    console.warn("Bundle detail lookup failed:", error.message);
    return null;
  }
  return (data as T) || null;
}

function DocumentStatusCard({
  title,
  status,
  documentNumber,
  description,
  actions,
}: {
  title: string;
  status: string;
  documentNumber?: string | null;
  description?: string | null;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/50 p-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold">{title}</p>
        {documentNumber ? (
          <p className="text-xs text-muted-foreground">{documentNumber}</p>
        ) : null}
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getBadgeColor(status)}>{status}</Badge>
        {actions}
      </div>
    </div>
  );
}

function DocumentBundleDetailContent({
  supabase,
  id,
}: {
  supabase: SupabaseClient;
  id: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<BundleDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const [activeDelete, setActiveDelete] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBundle() {
      setIsLoading(true);
      setErrorMessage(null);

      const { data: bundle, error: bundleError } = await supabase
        .from("document_bundles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!isMounted) return;

      if (bundleError) {
        setErrorMessage(bundleError.message);
        setData(null);
        setIsLoading(false);
        return;
      }

      if (!bundle) {
        setErrorMessage(
          "Document bundle was not found or your admin session cannot access it."
        );
        setData(null);
        setIsLoading(false);
        return;
      }

      const [coa, batch, hplc, ms, sds, coaVerification] = await Promise.all([
        maybeSingle<CoaDocumentRecord>(
          supabase.from("coa_documents").select("*").eq("id", bundle.coa_id)
        ),
        maybeSingle<BatchRecord>(
          supabase.from("batches").select("*").eq("id", bundle.batch_id)
        ),
        bundle.hplc_report_id
          ? maybeSingle<HplcReportRecord>(
              supabase
                .from("hplc_reports")
                .select("*")
                .eq("id", bundle.hplc_report_id)
            )
          : Promise.resolve(null),
        bundle.ms_report_id
          ? maybeSingle<MsReportRecord>(
              supabase
                .from("ms_reports")
                .select("*")
                .eq("id", bundle.ms_report_id)
            )
          : Promise.resolve(null),
        bundle.sds_id
          ? maybeSingle<SdsRecord>(
              supabase
                .from("sds_documents")
                .select("*")
                .eq("id", bundle.sds_id)
            )
          : Promise.resolve(null),
        maybeSingle<CoaVerificationBundleRecord>(
          supabase
            .from("coa_verifications")
            .select("id, coa_number, product_name, catalog_code, batch_lot_no, verification_code, verification_status, release_decision")
            .eq("document_bundle_id", bundle.id)
        ),
      ]);

      if (!isMounted) return;

      const computedBundleStatus = computeDocumentBundleStatus({
        batchStatus: batch?.status,
        coaStatus: coa?.document_status,
        hplcStatus: hplc?.status,
        msStatus: ms?.status,
        sdsStatus: sds?.status,
        hasHplc: Boolean(bundle.hplc_report_id),
        hasMs: Boolean(bundle.ms_report_id),
        hasSds: Boolean(bundle.sds_id),
      });

      const normalizedBundle =
        bundle.status === computedBundleStatus
          ? (bundle as BundleRecord)
          : ({ ...bundle, status: computedBundleStatus } as BundleRecord);

      if (bundle.status !== computedBundleStatus) {
        await refreshDocumentBundleStatusForBundle(supabase, bundle.id);
      }

      setData({ bundle: normalizedBundle, coa, batch, hplc, ms, sds, coaVerification });
      setIsLoading(false);
    }

    loadBundle();

    return () => {
      isMounted = false;
    };
  }, [id, supabase]);

  async function handleDocumentAction(
    documentType: DownloadableDocumentType,
    documentId: string | null | undefined,
    mode: DownloadMode
  ) {
    if (!documentId) {
      setDownloadError("This document is not linked to the bundle yet.");
      return;
    }

    const actionKey = `${mode}-${documentType}-${documentId}`;
    setActiveDownload(actionKey);
    setDownloadError(null);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (sessionError || !accessToken) {
        throw new Error("Admin session expired. Log in again and retry.");
      }

      const response = await fetch("/api/internal/quality-documents/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          documentType,
          documentId,
          format: documentType === "bundle" && mode === "download" ? "zip" : "html",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "Document could not be generated.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const filename =
        response.headers.get("X-Document-Filename") ||
        `${documentType}-${documentId}.html`;

      if (mode === "open") {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
        return;
      }

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Document could not be generated."
      );
    } finally {
      setActiveDownload(null);
    }
  }

  async function handleDeleteRecord(
    recordType: "bundle" | "hplc" | "ms" | "sds",
    recordId: string | null | undefined
  ) {
    if (!recordId) {
      setDownloadError("This record is not linked yet.");
      return;
    }

    const label =
      recordType === "bundle"
        ? "this document bundle"
        : recordType === "hplc"
          ? "this HPLC report"
          : recordType === "ms"
            ? "this MS / LC-MS report"
            : "this SDS document";

    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    const deleteKey = `${recordType}-${recordId}`;
    setActiveDelete(deleteKey);
    setDownloadError(null);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (sessionError || !accessToken) {
        throw new Error("Admin session expired. Log in again and retry.");
      }

      const response = await fetch("/api/internal/quality-documents/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ recordType, ids: [recordId] }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Record could not be deleted.");
      }

      if (recordType === "bundle") {
        router.push("/admin/quality/document-bundles");
        router.refresh();
        return;
      }

      setData((currentData) => {
        if (!currentData) return currentData;

        return {
          ...currentData,
          bundle: {
            ...currentData.bundle,
            hplc_report_id:
              recordType === "hplc" ? null : currentData.bundle.hplc_report_id,
            ms_report_id:
              recordType === "ms" ? null : currentData.bundle.ms_report_id,
            sds_id: recordType === "sds" ? null : currentData.bundle.sds_id,
          },
          hplc: recordType === "hplc" ? null : currentData.hplc,
          ms: recordType === "ms" ? null : currentData.ms,
          sds: recordType === "sds" ? null : currentData.sds,
        };
      });

      router.refresh();
    } catch (error) {
      setDownloadError(
        error instanceof Error ? error.message : "Record could not be deleted."
      );
    } finally {
      setActiveDelete(null);
    }
  }

  function getEditHref(
    documentType: DownloadableDocumentType,
    documentId: string
  ) {
    if (documentType === "hplc") {
      return `/admin/quality/hplc-reports/${documentId}/edit`;
    }

    if (documentType === "ms") {
      return `/admin/quality/ms-reports/${documentId}/edit`;
    }

    if (documentType === "sds") {
      return `/admin/quality/safety-data-sheets/${documentId}/edit`;
    }

    return null;
  }

  function documentActions(
    documentType: DownloadableDocumentType,
    documentId: string | null | undefined,
    options: { allowDelete?: boolean } = {}
  ) {
    if (!documentId) return null;

    const openKey = `open-${documentType}-${documentId}`;
    const downloadKey = `download-${documentType}-${documentId}`;
    const deleteKey = `${documentType}-${documentId}`;
    const editHref = getEditHref(documentType, documentId);

    return (
      <>
        {editHref ? (
          <Button asChild size="sm" variant="outline">
            <Link href={editHref}>Edit</Link>
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="outline"
          disabled={activeDownload === openKey}
          onClick={() => handleDocumentAction(documentType, documentId, "open")}
        >
          {activeDownload === openKey ? "Opening..." : "Open / Print"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={activeDownload === downloadKey}
          onClick={() =>
            handleDocumentAction(documentType, documentId, "download")
          }
        >
          {activeDownload === downloadKey ? "Preparing..." : "Download"}
        </Button>
        {options.allowDelete && ["hplc", "ms", "sds"].includes(documentType) ? (
          <Button
            size="sm"
            variant="outline"
            disabled={activeDelete === deleteKey}
            onClick={() =>
              handleDeleteRecord(documentType as "hplc" | "ms" | "sds", documentId)
            }
            className="border-rose-200 text-rose-700 hover:border-rose-400 hover:text-rose-800"
          >
            <Trash2Icon className="mr-1 size-3.5" />
            {activeDelete === deleteKey ? "Deleting..." : "Delete"}
          </Button>
        ) : null}
      </>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading document bundle...
        </CardContent>
      </Card>
    );
  }

  if (errorMessage || !data) {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardContent className="space-y-4 p-6 text-red-900">
          <div>
            <h2 className="text-xl font-semibold">Bundle could not be loaded</h2>
            <p className="mt-2 text-sm">{errorMessage}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/coa-verifications">Back to COA Records</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { bundle, coa, batch, hplc, ms, sds, coaVerification } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{bundle.bundle_number}</h1>
          <p className="mt-2 text-muted-foreground">
            Product: {bundle.product_id} | Batch: {batch?.batch_number || String(bundle.batch_id).slice(0, 8)}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge variant={getBadgeColor(bundle.status)} className="text-lg">
            {bundle.status}
          </Badge>
          <Button
            variant="outline"
            disabled={activeDownload === `open-bundle-${bundle.id}`}
            onClick={() => handleDocumentAction("bundle", bundle.id, "open")}
          >
            {activeDownload === `open-bundle-${bundle.id}`
              ? "Opening..."
              : "Open Full Pack"}
          </Button>
          <Button
            disabled={activeDownload === `download-bundle-${bundle.id}`}
            onClick={() => handleDocumentAction("bundle", bundle.id, "download")}
          >
            {activeDownload === `download-bundle-${bundle.id}`
              ? "Preparing..."
              : "Download Full Pack ZIP"}
          </Button>
          <Button
            variant="outline"
            disabled={activeDelete === `bundle-${bundle.id}`}
            onClick={() => handleDeleteRecord("bundle", bundle.id)}
            className="border-rose-200 text-rose-700 hover:border-rose-400 hover:text-rose-800"
          >
            <Trash2Icon className="mr-1 size-4" />
            {activeDelete === `bundle-${bundle.id}` ? "Deleting..." : "Delete Bundle"}
          </Button>
        </div>
      </div>

      {downloadError ? (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 text-sm font-medium text-red-900">
            {downloadError}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Linked COA Record</CardTitle>
          <CardDescription>
            The source COA record used to generate this documentation bundle.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">COA Number</p>
            <p className="font-semibold">{coaVerification?.coa_number || coa?.coa_number || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verification Code</p>
            <p className="font-mono text-sm">{coaVerification?.verification_code || coa?.verification_code || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="font-semibold">{coaVerification?.product_name || bundle.product_id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Catalog Code</p>
            <p className="font-semibold">{coaVerification?.catalog_code || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verification Status</p>
            <Badge variant={getBadgeColor(coaVerification?.verification_status || coa?.document_status || "missing")}>
              {coaVerification?.verification_status || coa?.document_status || "—"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Release Decision</p>
            <Badge variant={getBadgeColor(coaVerification?.release_decision || coa?.release_decision || "missing")}>
              {coaVerification?.release_decision || coa?.release_decision || "—"}
            </Badge>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            {coaVerification?.id ? (
              <>
                <Button asChild variant="outline">
                  <Link href={`/admin/coa-verifications/${coaVerification.id}/edit`}>
                    Edit COA Record
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/admin/coa-verifications/${coaVerification.id}/print`}>
                    Print COA
                  </Link>
                </Button>
              </>
            ) : null}
            {coa ? documentActions("coa", coa.id) : null}
          </div>
        </CardContent>
      </Card>

      {batch ? (
        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Batch Number</p>
              <p className="font-semibold">{batch.batch_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lot Number</p>
              <p className="font-semibold">{batch.lot_number || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manufacturing Date</p>
              <p className="font-semibold">{batch.manufacturing_date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expiry / Retest Date</p>
              <p className="font-semibold">{batch.expiry_date}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
          <CardDescription>
            HPLC, MS / LC-MS, and SDS records generated from the COA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DocumentStatusCard
            title="HPLC Purity Report"
            status={hplc?.status || "missing"}
            documentNumber={hplc?.document_number}
            description={hplc?.result_summary}
            actions={documentActions("hplc", hplc?.id, { allowDelete: true })}
          />
          <DocumentStatusCard
            title="MS / LC-MS Identity Report"
            status={ms?.status || "missing"}
            documentNumber={ms?.document_number}
            description={ms?.identity_conclusion}
            actions={documentActions("ms", ms?.id, { allowDelete: true })}
          />
          <DocumentStatusCard
            title="Safety Data Sheet / SDS"
            status={sds?.status || "missing"}
            documentNumber={sds?.document_number}
            description={sds ? `Revision ${sds.revision}` : null}
            actions={documentActions("sds", sds?.id, { allowDelete: true })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Created</span>
              <span className="font-semibold">{bundle.created_at?.split("T")[0] || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-semibold">{bundle.updated_at?.split("T")[0] || "—"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/quality/document-bundles">Back to Bundles</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/coa-verifications">Back to COA Records</Link>
        </Button>
      </div>
    </div>
  );
}

export default function DocumentBundleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "COA Admin", path: "/admin/coa-verifications" },
    { name: "Document Bundles", path: "/admin/quality/document-bundles" },
    { name: "Bundle Detail", path: `/admin/quality/document-bundles/${id}` },
  ];

  return (
    <AdminGuard
      title="Document Bundle Details"
      description="View the COA-linked HPLC, MS / LC-MS, SDS, batch, and bundle references generated from a COA record."
      breadcrumbs={breadcrumbs}
    >
      {({ supabase }) => <DocumentBundleDetailContent supabase={supabase} id={id} />}
    </AdminGuard>
  );
}
