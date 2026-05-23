"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CopyIcon,
  CopyPlusIcon,
  ExternalLinkIcon,
  PlusIcon,
  PrinterIcon,
  SearchIcon,
  Settings2Icon,
  FileTextIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AdminGuard } from "@/components/admin/admin-guard";
import { CoaStatusBadge } from "@/components/admin/coa-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  duplicateCoaVerificationRecord,
  listCoaVerificationRows,
  verificationStatusOptions,
} from "@/lib/coa-verification-admin";
import type { CoaVerificationRow, CoaVerificationStatus } from "@/lib/coa-verification";
import type { BreadcrumbItem } from "@/lib/seo";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Admin", path: "/admin/coa-verifications" },
];

function formatDateTime(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.valueOf())
    ? value
    : parsedDate.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

type SortKey =
  | "coa_number"
  | "verification_code"
  | "product_name"
  | "catalog_code"
  | "batch_lot_no"
  | "verification_status"
  | "release_decision"
  | "issue_date"
  | "updated_at";

type SortDirection = "asc" | "desc";

function getSortableValue(row: CoaVerificationRow, sortKey: SortKey) {
  if (sortKey === "issue_date" || sortKey === "updated_at") {
    const rawValue = sortKey === "issue_date" ? row.issue_date : row.updated_at;
    const parsedDate = new Date(String(rawValue ?? ""));

    if (!Number.isNaN(parsedDate.valueOf())) {
      return parsedDate.valueOf();
    }

    return String(rawValue ?? "").trim().toLowerCase();
  }

  switch (sortKey) {
    case "coa_number":
      return row.coa_number.trim().toLowerCase();
    case "verification_code":
      return row.verification_code.trim().toLowerCase();
    case "product_name":
      return row.product_name.trim().toLowerCase();
    case "catalog_code":
      return row.catalog_code.trim().toLowerCase();
    case "batch_lot_no":
      return row.batch_lot_no.trim().toLowerCase();
    case "verification_status":
      return row.verification_status.trim().toLowerCase();
    case "release_decision":
      return row.release_decision.trim().toLowerCase();
    default:
      return "";
  }
}

function compareSortableValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export default function AdminCoaVerificationsPage() {
  return (
    <AdminGuard
      title="COA verification records"
      description="Manage Atlas Labs QA verification records, verification status changes, and public COA lookup outputs."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase }) => <AdminCoaVerificationIndex supabase={supabase} />}
    </AdminGuard>
  );
}

function AdminCoaVerificationIndex({
  supabase,
}: {
  supabase: SupabaseClient;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<CoaVerificationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [generatingRowId, setGeneratingRowId] = useState<string | null>(null);
  const [deletingRowId, setDeletingRowId] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<CoaVerificationStatus | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    let isMounted = true;

    async function loadRows() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextRows = await listCoaVerificationRows(supabase);

        if (!isMounted) {
          return;
        }

        setRows(nextRows);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "The COA verification records could not be loaded."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRows();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === "All" || row.verification_status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.product_name.toLowerCase().includes(normalizedSearch) ||
        row.coa_number.toLowerCase().includes(normalizedSearch) ||
        row.batch_lot_no.toLowerCase().includes(normalizedSearch) ||
        row.verification_code.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [rows, searchValue, statusFilter]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((firstRow, secondRow) => {
      const firstValue = getSortableValue(firstRow, sortKey);
      const secondValue = getSortableValue(secondRow, sortKey);
      const result = compareSortableValues(firstValue, secondValue);

      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredRows, sortDirection, sortKey]);

  const filteredRowIds = useMemo(
    () => filteredRows.map((row) => row.id),
    [filteredRows]
  );

  const allFilteredRowsSelected =
    filteredRowIds.length > 0 &&
    filteredRowIds.every((id) => selectedRowIds.includes(id));

  function toggleRowSelection(rowId: string) {
    setSelectedRowIds((currentIds) =>
      currentIds.includes(rowId)
        ? currentIds.filter((id) => id !== rowId)
        : [...currentIds, rowId]
    );
  }

  function toggleSelectAllFilteredRows() {
    setSelectedRowIds((currentIds) => {
      if (allFilteredRowsSelected) {
        return currentIds.filter((id) => !filteredRowIds.includes(id));
      }

      return Array.from(new Set([...currentIds, ...filteredRowIds]));
    });
  }

  function handleSort(nextSortKey: SortKey) {
    if (sortKey === nextSortKey) {
      setSortDirection((currentDirection) =>
        currentDirection === "asc" ? "desc" : "asc"
      );
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection("asc");
  }

  function getSortIndicator(nextSortKey: SortKey) {
    if (sortKey !== nextSortKey) {
      return "↕";
    }

    return sortDirection === "asc" ? "↑" : "↓";
  }

  function renderSortableHeader(nextSortKey: SortKey, label: string) {
    const isActive = sortKey === nextSortKey;

    return (
      <button
        type="button"
        onClick={() => handleSort(nextSortKey)}
        className={`inline-flex items-center gap-1 rounded-md text-left font-semibold uppercase tracking-[0.14em] transition-colors hover:text-[var(--brand-blue)] ${
          isActive ? "text-[var(--brand-navy)]" : "text-muted-foreground"
        }`}
        aria-label={`Sort by ${label} ${
          isActive && sortDirection === "asc" ? "descending" : "ascending"
        }`}
      >
        <span>{label}</span>
        <span className="text-[0.7rem] leading-none" aria-hidden="true">
          {getSortIndicator(nextSortKey)}
        </span>
      </button>
    );
  }

  async function handleCopyVerificationUrl(row: CoaVerificationRow) {
    const verificationUrl =
      row.verification_url ||
      `${window.location.origin}/verify/${encodeURIComponent(row.verification_code)}`;
    await navigator.clipboard.writeText(verificationUrl);
    setCopyMessage(`Verification URL copied for ${row.coa_number}.`);
    window.setTimeout(() => setCopyMessage(null), 2500);
  }

  async function handleDuplicate(row: CoaVerificationRow) {
    if (
      !window.confirm(
        "You are duplicating this COA as a new record. A new COA number, verification code, and verification URL will be generated."
      )
    ) {
      return;
    }

    try {
      const duplicatedRecord = await duplicateCoaVerificationRecord(supabase, row.id);

      if (!duplicatedRecord.record) {
        throw new Error("The duplicated COA record was not returned after creation.");
      }

      if (duplicatedRecord.warnings.length > 0) {
        window.alert(duplicatedRecord.warnings.join("\n\n"));
      }

      router.push(`/admin/coa-verifications/${duplicatedRecord.record.id}/edit?duplicated=1`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The COA record could not be duplicated."
      );
    }
  }

  async function handleGenerateSupportingDocuments(row: CoaVerificationRow) {
    const alreadyGenerated =
      row.document_bundle_id && row.hplc_report_id && row.ms_report_id && row.sds_id;

    if (alreadyGenerated) {
      router.push(`/admin/quality/document-bundles/${row.document_bundle_id}`);
      return;
    }

    if (
      !window.confirm(
        `Generate HPLC, MS / LC-MS, SDS, and document bundle for ${row.coa_number}?`
      )
    ) {
      return;
    }

    setGeneratingRowId(row.id);
    setErrorMessage(null);
    setCopyMessage(null);

    try {
      const generatedBy =
        row.approved_by ||
        row.reviewed_by ||
        row.created_by ||
        "Atlas Labs QA Documentation Officer";

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Admin session expired. Please log in again before generating documents.");
      }

      const response = await fetch("/api/internal/quality-documents/generate-from-coa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          coaVerificationId: row.id,
          generatedBy,
        }),
      });

      const result = (await response.json()) as {
        batchId?: string;
        coaDocumentId?: string;
        hplcReportId?: string;
        msReportId?: string;
        sdsId?: string;
        bundleId?: string;
        hplcDocumentNumber?: string;
        msDocumentNumber?: string;
        sdsDocumentNumber?: string;
        error?: string;
      };

      if (!response.ok || !result.bundleId) {
        throw new Error(result.error || "Supporting documents could not be generated.");
      }

      setRows((currentRows) =>
        currentRows.map((currentRow) =>
          currentRow.id === row.id
            ? {
                ...currentRow,
                quality_batch_id: result.batchId ?? null,
                quality_coa_document_id: result.coaDocumentId ?? null,
                document_bundle_id: result.bundleId ?? null,
                hplc_report_id: result.hplcReportId ?? null,
                ms_report_id: result.msReportId ?? null,
                sds_id: result.sdsId ?? null,
                supporting_documents_status: "generated",
                supporting_documents_generated_at: new Date().toISOString(),
                supporting_documents_generated_by: generatedBy,
                supporting_documents_error: null,
                document_pack: "COA, HPLC, MS/LC-MS, SDS",
                hplc_file_name: result.hplcDocumentNumber ?? currentRow.hplc_file_name,
                lcms_file_name: result.msDocumentNumber ?? currentRow.lcms_file_name,
                sds_file_name: result.sdsDocumentNumber ?? currentRow.sds_file_name,
              }
            : currentRow
        )
      );

      router.push(`/admin/quality/document-bundles/${result.bundleId}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Supporting documents could not be generated."
      );
    } finally {
      setGeneratingRowId(null);
    }
  }



  async function deleteCoaRecords(ids: string[]) {
    if (ids.length === 0) return;

    if (
      !window.confirm(
        ids.length === 1
          ? "Delete this COA verification record? This cannot be undone."
          : `Delete ${ids.length} selected COA verification records? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingRowId(ids.length === 1 ? ids[0] ?? null : "bulk");
    setErrorMessage(null);
    setCopyMessage(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Admin session expired. Please log in again before deleting records.");
      }

      const response = await fetch("/api/internal/quality-documents/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ recordType: "coa_verification", ids }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        deletedCount?: number;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Selected COA records could not be deleted.");
      }

      setRows((currentRows) => currentRows.filter((row) => !ids.includes(row.id)));
      setSelectedRowIds((currentIds) => currentIds.filter((id) => !ids.includes(id)));
      setCopyMessage(
        ids.length === 1
          ? "COA verification record deleted."
          : `${payload?.deletedCount ?? ids.length} COA verification records deleted.`
      );
      window.setTimeout(() => setCopyMessage(null), 2500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Selected COA records could not be deleted."
      );
    } finally {
      setDeletingRowId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="surface-card border p-0">
        <CardContent className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-4 md:grid-cols-[1fr_220px] lg:w-[760px]">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search product, COA number, batch lot, or verification code"
                className="h-11 border-[#d5def0] bg-white pr-4 pl-10 text-[var(--brand-navy)]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as CoaVerificationStatus | "All")
              }
              className="h-11 rounded-lg border border-[#d5def0] bg-white px-4 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <option value="All">All statuses</option>
              {verificationStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {selectedRowIds.length > 0 ? (
              <Button
                variant="outline"
                disabled={deletingRowId === "bulk"}
                onClick={() => deleteCoaRecords(selectedRowIds)}
                className="h-11 border-rose-200 bg-white text-rose-700 hover:border-rose-400 hover:text-rose-800"
              >
                <Trash2Icon className="mr-1 size-4" />
                {deletingRowId === "bulk"
                  ? "Deleting..."
                  : `Delete selected (${selectedRowIds.length})`}
              </Button>
            ) : null}
            <Button
              asChild
              variant="outline"
              className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              <Link href="/admin/settings/coa-branding">
                <Settings2Icon className="mr-1 size-4" />
                COA Branding
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              <Link href="/admin/coa-verifications/import">
                <UploadIcon className="mr-1 size-4" />
                Import COA CSV
              </Link>
            </Button>
            <Button asChild className="h-11 bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-blue)]">
              <Link href="/admin/coa-verifications/new">
                <PlusIcon className="mr-1 size-4" />
                Create COA Record
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {errorMessage ? (
        <Card className="surface-card border border-rose-200 bg-rose-50/60 p-0">
          <CardContent className="py-5 text-sm text-rose-800">{errorMessage}</CardContent>
        </Card>
      ) : null}

      {copyMessage ? (
        <Card className="surface-card border border-emerald-200 bg-emerald-50/60 p-0">
          <CardContent className="py-4 text-sm text-emerald-800">{copyMessage}</CardContent>
        </Card>
      ) : null}

      <Card className="surface-card border p-0">
        <CardContent className="overflow-x-auto py-0">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading COA verification records...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No COA records matched the current search or filter.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border/70 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-4 py-4 font-semibold">
                    <input
                      type="checkbox"
                      checked={allFilteredRowsSelected}
                      onChange={toggleSelectAllFilteredRows}
                      aria-label="Select all visible COA records"
                    />
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("coa_number", "COA Number")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("verification_code", "Verification Code")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("product_name", "Product Name")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("catalog_code", "Catalog Code")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("batch_lot_no", "Batch / Lot No.")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("verification_status", "Verification Status")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("release_decision", "Release Decision")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("issue_date", "Issue Date")}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader("updated_at", "Updated At")}
                  </th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sortedRows.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                        aria-label={`Select ${row.coa_number}`}
                      />
                    </td>
                    <td className="px-4 py-4 font-medium text-[var(--brand-navy)]">
                      {row.coa_number}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-[var(--brand-navy)]">
                      {row.verification_code}
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.product_name}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.catalog_code}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.batch_lot_no}</td>
                    <td className="px-4 py-4">
                      <CoaStatusBadge status={row.verification_status} />
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.release_decision}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.issue_date}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {formatDateTime(row.updated_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline" className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                          <Link href={`/admin/coa-verifications/${row.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                          <Link href={`/admin/coa-verifications/${row.id}/print`}>
                            <PrinterIcon className="mr-1 size-3.5" />
                            Print COA
                          </Link>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={generatingRowId === row.id}
                            onClick={() => handleGenerateSupportingDocuments(row)}
                            className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                          >
                            <FileTextIcon className="mr-1 size-3.5" />
                            {row.document_bundle_id
                              ? "View Docs"
                              : generatingRowId === row.id
                                ? "Generating..."
                                : "Generate Docs"}
                          </Button>
                        <Button asChild size="sm" variant="outline" className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                          <Link
                            href={`/verify/${encodeURIComponent(row.verification_code)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLinkIcon className="mr-1 size-3.5" />
                            View Public Verification
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyVerificationUrl(row)}
                          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
                          <CopyIcon className="mr-1 size-3.5" />
                          Copy Verification URL
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(row)}
                          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
                          <CopyPlusIcon className="mr-1 size-3.5" />
                          Duplicate / Copy as New
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={deletingRowId === row.id}
                          onClick={() => deleteCoaRecords([row.id])}
                          className="border-rose-200 bg-white text-rose-700 hover:border-rose-400 hover:text-rose-800"
                        >
                          <Trash2Icon className="mr-1 size-3.5" />
                          {deletingRowId === row.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
