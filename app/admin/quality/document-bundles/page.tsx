"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";

import { AdminGuard } from "@/components/admin/admin-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BreadcrumbItem } from "@/lib/seo";

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
  created_by?: string | null;
  released_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type LinkedCoaRecord = {
  id: string;
  coa_number?: string | null;
  product_name?: string | null;
  catalog_code?: string | null;
  batch_lot_no?: string | null;
  verification_status?: string | null;
  release_decision?: string | null;
  document_bundle_id?: string | null;
};

type BundleRow = BundleRecord & {
  linkedCoa?: LinkedCoaRecord | null;
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Admin", path: "/admin/coa-verifications" },
  { name: "Document Bundles", path: "/admin/quality/document-bundles" },
];

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function getBadgeClass(status?: string | null) {
  const value = normalize(status);

  if (value.includes("released") || value.includes("active")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (value.includes("approved")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (value.includes("incomplete") || value.includes("failed") || value.includes("void")) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (value.includes("review")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function downloadBlob(blob: Blob, fallbackFileName: string, response?: Response) {
  const headerFilename = response?.headers.get("X-Document-Filename");
  const filename = headerFilename || fallbackFileName;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function readDownloadError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || "The selected bundles could not be downloaded.";
  } catch {
    return "The selected bundles could not be downloaded.";
  }
}

export default function DocumentBundlesPage() {
  return (
    <AdminGuard
      title="Document bundles"
      description="Manage COA, HPLC, MS / LC-MS, and SDS documentation bundles generated from COA verification records."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase }) => <DocumentBundlesIndex supabase={supabase} />}
    </AdminGuard>
  );
}

function DocumentBundlesIndex({ supabase }: { supabase: SupabaseClient }) {
  const [rows, setRows] = useState<BundleRow[]>([]);
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBundles() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { data: bundles, error: bundlesError } = await supabase
          .from("document_bundles")
          .select("*")
          .order("updated_at", { ascending: false });

        if (bundlesError) {
          throw new Error(bundlesError.message);
        }

        const bundleRows = ((bundles || []) as BundleRecord[]).map((bundle) => ({
          ...bundle,
          linkedCoa: null,
        }));

        const bundleIds = bundleRows.map((bundle) => bundle.id);

        if (bundleIds.length > 0) {
          const { data: linkedCoas, error: linkedCoasError } = await supabase
            .from("coa_verifications")
            .select(
              "id, coa_number, product_name, catalog_code, batch_lot_no, verification_status, release_decision, document_bundle_id"
            )
            .in("document_bundle_id", bundleIds);

          if (linkedCoasError) {
            throw new Error(linkedCoasError.message);
          }

          const coaByBundleId = new Map(
            ((linkedCoas || []) as LinkedCoaRecord[]).map((coa) => [
              coa.document_bundle_id,
              coa,
            ])
          );

          for (const bundle of bundleRows) {
            bundle.linkedCoa = coaByBundleId.get(bundle.id) || null;
          }
        }

        if (isMounted) {
          setRows(bundleRows);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Document bundles could not be loaded."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBundles();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const filteredRows = useMemo(() => {
    const query = normalize(searchValue);

    if (!query) return rows;

    return rows.filter((row) => {
      const linkedCoa = row.linkedCoa;
      return [
        row.bundle_number,
        row.status,
        row.product_id,
        linkedCoa?.coa_number,
        linkedCoa?.product_name,
        linkedCoa?.catalog_code,
        linkedCoa?.batch_lot_no,
      ]
        .map(normalize)
        .some((value) => value.includes(query));
    });
  }, [rows, searchValue]);

  const visibleBundleIds = filteredRows.map((row) => row.id);
  const selectedVisibleCount = visibleBundleIds.filter((id) =>
    selectedBundleIds.includes(id)
  ).length;
  const allVisibleSelected =
    visibleBundleIds.length > 0 && selectedVisibleCount === visibleBundleIds.length;

  function toggleBundleSelection(bundleId: string) {
    setSelectedBundleIds((current) =>
      current.includes(bundleId)
        ? current.filter((id) => id !== bundleId)
        : [...current, bundleId]
    );
  }

  function toggleAllVisible() {
    setSelectedBundleIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleBundleIds.includes(id));
      }

      return Array.from(new Set([...current, ...visibleBundleIds]));
    });
  }

  async function downloadBundles(bundleIds: string[], scopeLabel: string) {
    const uniqueBundleIds = Array.from(new Set(bundleIds));

    if (uniqueBundleIds.length === 0) {
      setErrorMessage("Select at least one document bundle before downloading.");
      return;
    }

    if (
      !window.confirm(
        `Download ${uniqueBundleIds.length} ${uniqueBundleIds.length === 1 ? "documentation bundle" : "documentation bundles"} as one ZIP? Each bundle folder will contain the COA, HPLC, MS / LC-MS, and SDS PDFs.`
      )
    ) {
      return;
    }

    setIsDownloading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Admin session expired. Please log in again before downloading bundles.");
      }

      const response = await fetch("/api/internal/quality-documents/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          documentType: "bundles",
          bundleIds: uniqueBundleIds,
          format: "zip",
        }),
      });

      if (!response.ok) {
        throw new Error(await readDownloadError(response));
      }

      const blob = await response.blob();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      downloadBlob(blob, `Atlas-${scopeLabel}-Document-Bundles-${timestamp}.zip`, response);
      setSuccessMessage(`${uniqueBundleIds.length} document ${uniqueBundleIds.length === 1 ? "bundle was" : "bundles were"} prepared for download.`);
      window.setTimeout(() => setSuccessMessage(null), 3500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The selected document bundles could not be downloaded."
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>Documentation bundles</CardTitle>
            <CardDescription>
              Select multiple records and download all linked COA, HPLC, MS / LC-MS, and SDS PDFs in one ZIP.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/coa-verifications">Create from COA records</Link>
            </Button>
            <Button
              type="button"
              disabled={isDownloading || selectedBundleIds.length === 0}
              onClick={() => downloadBundles(selectedBundleIds, "Selected")}
            >
              {isDownloading
                ? "Preparing ZIP..."
                : `Download selected (${selectedBundleIds.length})`}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isDownloading || filteredRows.length === 0}
              onClick={() => downloadBundles(visibleBundleIds, "Visible")}
            >
              Download all visible ({filteredRows.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by COA, product, catalog, batch, bundle..."
              className="w-full rounded-xl border border-[#d5def0] bg-white px-3 py-2 text-sm text-[var(--brand-navy)] outline-none focus:border-[var(--brand-blue)] md:max-w-md"
            />
            <div className="text-sm text-slate-600">
              {filteredRows.length} visible · {selectedBundleIds.length} selected
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-dashed border-[#d5def0] bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              Loading document bundles...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d5def0] bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              No document bundles found. Create them from COA verification records.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#d5def0]">
              <table className="min-w-full divide-y divide-[#d5def0] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAllVisible}
                        aria-label="Select all visible bundles"
                      />
                    </th>
                    <th className="px-4 py-3">Bundle</th>
                    <th className="px-4 py-3">Linked COA</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Documents</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2fa] bg-white">
                  {filteredRows.map((row) => {
                    const linkedCoa = row.linkedCoa;
                    const isSelected = selectedBundleIds.includes(row.id);
                    const hasAllDocuments =
                      row.coa_id && row.hplc_report_id && row.ms_report_id && row.sds_id;

                    return (
                      <tr key={row.id} className={isSelected ? "bg-blue-50/40" : ""}>
                        <td className="px-4 py-4 align-top">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleBundleSelection(row.id)}
                            aria-label={`Select bundle ${row.bundle_number}`}
                          />
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-[var(--brand-navy)]">
                            {row.bundle_number}
                          </div>
                          <div className="mt-1 font-mono text-xs text-slate-500">
                            {row.id}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-[var(--brand-navy)]">
                            {linkedCoa?.coa_number || "Linked COA not found"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {linkedCoa?.batch_lot_no || row.batch_id}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-[var(--brand-navy)]">
                            {linkedCoa?.product_name || row.product_id}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {linkedCoa?.catalog_code || row.product_id}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline">COA</Badge>
                            <Badge variant="outline" className={row.hplc_report_id ? "" : "opacity-40"}>
                              HPLC
                            </Badge>
                            <Badge variant="outline" className={row.ms_report_id ? "" : "opacity-40"}>
                              MS / LC-MS
                            </Badge>
                            <Badge variant="outline" className={row.sds_id ? "" : "opacity-40"}>
                              SDS
                            </Badge>
                          </div>
                          {!hasAllDocuments ? (
                            <div className="mt-2 text-xs text-amber-700">
                              Some linked documents are missing.
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <Badge variant="outline" className={getBadgeClass(row.status)}>
                            {row.status}
                          </Badge>
                          {linkedCoa?.release_decision ? (
                            <div className="mt-2 text-xs text-slate-500">
                              {linkedCoa.release_decision}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 align-top text-slate-600">
                          {formatDateTime(row.updated_at || row.created_at)}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/admin/quality/document-bundles/${row.id}`}>
                                View
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={isDownloading}
                              onClick={() => downloadBundles([row.id], "Single")}
                            >
                              Download
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
