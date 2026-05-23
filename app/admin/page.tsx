"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CopyIcon,
  CopyPlusIcon,
  DownloadIcon,
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
import type {
  CoaVerificationRow,
  CoaVerificationStatus,
} from "@/lib/coa-verification";
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

    return String(rawValue ?? "")
      .trim()
      .toLowerCase();
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

type CoaExportRecord = Record<string, unknown>;

const coaExportColumns = [
  "id",
  "coa_number",
  "verification_code",
  "verification_url",
  "product_name",
  "catalog_code",
  "batch_lot_no",
  "issue_date",
  "revision",
  "client_recipient",
  "peptide_sequence",
  "molecular_weight",
  "molecular_formula",
  "physical_form",
  "appearance_spec",
  "grade_scope",
  "pack_size",
  "storage",
  "retest_period",
  "manufacture_date",
  "retest_expiry_date",
  "batch_quantity",
  "manufacturing_site",
  "country_of_origin",
  "release_site",
  "packaging",
  "label_option",
  "shipping_conditions",
  "intended_use_scope",
  "identity_result",
  "hplc_purity",
  "water_content",
  "release_decision",
  "verification_status",
  "document_pack",
  "verification_message",
  "appearance_result",
  "purity_result",
  "peptide_content_result",
  "counter_ion_result",
  "residual_solvents_result",
  "heavy_metals_result",
  "microbial_limits_result",
  "endotoxin_sterility_result",
  "hplc_file_name",
  "lcms_file_name",
  "sds_file_name",
  "raw_data_archive_ref",
  "coa_pdf_url",
  "qr_code_url",
  "created_by",
  "prepared_at",
  "reviewed_by",
  "reviewed_at",
  "approved_by",
  "approved_at",
  "created_at",
  "updated_at",
  "quality_batch_id",
  "quality_coa_document_id",
  "document_bundle_id",
  "hplc_report_id",
  "ms_report_id",
  "sds_id",
  "supporting_documents_status",
  "supporting_documents_generated_at",
  "supporting_documents_generated_by",
  "supporting_documents_error",
  "batch_product_id",
  "batch_batch_number",
  "batch_lot_number",
  "batch_manufacturing_date",
  "batch_expiry_date",
  "batch_retest_date",
  "batch_country_of_origin",
  "batch_supplier_name",
  "batch_manufacturer_name",
  "batch_status",
  "batch_release_decision",
  "batch_reviewed_by",
  "batch_approved_by",
  "batch_notes",
  "quality_coa_product_id",
  "quality_coa_batch_id",
  "quality_coa_number",
  "quality_coa_issue_date",
  "quality_coa_revision",
  "quality_coa_document_status",
  "quality_coa_document_type",
  "quality_coa_client_recipient",
  "quality_coa_prepared_by",
  "quality_coa_reviewed_by",
  "quality_coa_approved_by",
  "quality_coa_release_decision",
  "quality_coa_verification_code",
  "quality_coa_verification_url",
  "quality_coa_qr_code_value",
  "quality_coa_notes",
  "quality_coa_watermark_mode",
  "hplc_document_number",
  "hplc_issue_date",
  "hplc_revision",
  "hplc_status",
  "hplc_method_name",
  "hplc_method_code",
  "hplc_instrument_name",
  "hplc_column_type",
  "hplc_mobile_phase",
  "hplc_flow_rate",
  "hplc_detection_wavelength",
  "hplc_injection_volume",
  "hplc_run_time",
  "hplc_sample_concentration",
  "hplc_retention_time",
  "hplc_purity_percent",
  "hplc_main_peak_area",
  "hplc_total_peak_area",
  "hplc_impurities_json",
  "hplc_peak_table_json",
  "hplc_chromatogram_file_url",
  "hplc_raw_data_file_url",
  "hplc_analyst_name",
  "hplc_reviewer_name",
  "hplc_result_summary",
  "hplc_pass_fail_decision",
  "hplc_acceptance_criteria",
  "hplc_notes",
  "hplc_watermark_mode",
  "ms_document_number",
  "ms_issue_date",
  "ms_revision",
  "ms_status",
  "ms_method_name",
  "ms_method_code",
  "ms_instrument_name",
  "ms_ionization_mode",
  "ms_expected_molecular_weight",
  "ms_observed_mass",
  "ms_mass_error",
  "ms_mass_error_ppm",
  "ms_charge_state",
  "ms_spectrum_file_url",
  "ms_raw_data_file_url",
  "ms_identity_conclusion",
  "ms_pass_fail_decision",
  "ms_acceptance_criteria",
  "ms_analyst_name",
  "ms_reviewer_name",
  "ms_notes",
  "ms_watermark_mode",
  "sds_document_number",
  "sds_revision",
  "sds_issue_date",
  "sds_revision_date",
  "sds_status",
  "sds_language",
  "sds_jurisdiction",
  "sds_ghs_classification",
  "sds_signal_word",
  "sds_pictograms_json",
  "sds_hazard_statements_json",
  "sds_precautionary_statements_json",
  "sds_prepared_by",
  "sds_reviewed_by",
  "sds_approved_by",
  "sds_section_1_identification",
  "sds_section_2_hazard_identification",
  "sds_section_3_composition",
  "sds_section_4_first_aid",
  "sds_section_5_fire_fighting",
  "sds_section_6_accidental_release",
  "sds_section_7_handling_storage",
  "sds_section_8_exposure_controls",
  "sds_section_9_physical_chemical",
  "sds_section_10_stability_reactivity",
  "sds_section_11_toxicological",
  "sds_section_12_ecological",
  "sds_section_13_disposal",
  "sds_section_14_transport",
  "sds_section_15_regulatory",
  "sds_section_16_other",
  "bundle_number",
  "bundle_status",
  "bundle_created_by",
  "bundle_approved_by",
  "bundle_released_at",
] as const;

function formatCsvCell(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value).replace(/"/g, '""');
  return /[",\n\r]/.test(stringValue) ? `"${stringValue}"` : stringValue;
}

function buildCoaCsv(rowsToExport: CoaExportRecord[]) {
  const header = coaExportColumns.map(formatCsvCell).join(",");
  const body = rowsToExport.map((row) =>
    coaExportColumns.map((column) => formatCsvCell(row[column])).join(","),
  );

  return [header, ...body].join("\r\n");
}

function buildExportFileName(scope: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

  return `atlas-coa-records-${scope}-${timestamp}.csv`;
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([`\ufeff${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


function uniqueDefinedIds(rowsToExport: CoaVerificationRow[], key: keyof CoaVerificationRow) {
  return Array.from(
    new Set(
      rowsToExport
        .map((row) => row[key])
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0),
    ),
  );
}

async function fetchRecordsById(
  supabase: SupabaseClient,
  table: string,
  ids: string[],
) {
  if (ids.length === 0) {
    return new Map<string, CoaExportRecord>();
  }

  const { data, error } = await supabase.from(table).select("*").in("id", ids);

  if (error) {
    throw error;
  }

  return new Map(
    ((data ?? []) as CoaExportRecord[])
      .filter((record) => typeof record.id === "string")
      .map((record) => [record.id as string, record]),
  );
}

function assignPrefixedFields(
  target: CoaExportRecord,
  prefix: string,
  source: CoaExportRecord | undefined,
  fieldMap: Record<string, string>,
) {
  for (const [sourceKey, exportKey] of Object.entries(fieldMap)) {
    target[`${prefix}_${exportKey}`] = source?.[sourceKey] ?? "";
  }
}

const batchExportFieldMap = {
  product_id: "product_id",
  batch_number: "batch_number",
  lot_number: "lot_number",
  manufacturing_date: "manufacturing_date",
  expiry_date: "expiry_date",
  retest_date: "retest_date",
  country_of_origin: "country_of_origin",
  supplier_name: "supplier_name",
  manufacturer_name: "manufacturer_name",
  status: "status",
  release_decision: "release_decision",
  reviewed_by: "reviewed_by",
  approved_by: "approved_by",
  notes: "notes",
};

const qualityCoaExportFieldMap = {
  product_id: "product_id",
  batch_id: "batch_id",
  coa_number: "number",
  issue_date: "issue_date",
  revision: "revision",
  document_status: "document_status",
  document_type: "document_type",
  client_recipient: "client_recipient",
  prepared_by: "prepared_by",
  reviewed_by: "reviewed_by",
  approved_by: "approved_by",
  release_decision: "release_decision",
  verification_code: "verification_code",
  verification_url: "verification_url",
  qr_code_value: "qr_code_value",
  notes: "notes",
  watermark_mode: "watermark_mode",
};

const hplcExportFieldMap = {
  document_number: "document_number",
  issue_date: "issue_date",
  revision: "revision",
  status: "status",
  method_name: "method_name",
  method_code: "method_code",
  instrument_name: "instrument_name",
  column_type: "column_type",
  mobile_phase: "mobile_phase",
  flow_rate: "flow_rate",
  detection_wavelength: "detection_wavelength",
  injection_volume: "injection_volume",
  run_time: "run_time",
  sample_concentration: "sample_concentration",
  retention_time: "retention_time",
  purity_percent: "purity_percent",
  main_peak_area: "main_peak_area",
  total_peak_area: "total_peak_area",
  impurities_json: "impurities_json",
  peak_table_json: "peak_table_json",
  chromatogram_file_url: "chromatogram_file_url",
  raw_data_file_url: "raw_data_file_url",
  analyst_name: "analyst_name",
  reviewer_name: "reviewer_name",
  result_summary: "result_summary",
  pass_fail_decision: "pass_fail_decision",
  acceptance_criteria: "acceptance_criteria",
  notes: "notes",
  watermark_mode: "watermark_mode",
};

const msExportFieldMap = {
  document_number: "document_number",
  issue_date: "issue_date",
  revision: "revision",
  status: "status",
  method_name: "method_name",
  method_code: "method_code",
  instrument_name: "instrument_name",
  ionization_mode: "ionization_mode",
  expected_molecular_weight: "expected_molecular_weight",
  observed_mass: "observed_mass",
  mass_error: "mass_error",
  mass_error_ppm: "mass_error_ppm",
  charge_state: "charge_state",
  spectrum_file_url: "spectrum_file_url",
  raw_data_file_url: "raw_data_file_url",
  identity_conclusion: "identity_conclusion",
  pass_fail_decision: "pass_fail_decision",
  acceptance_criteria: "acceptance_criteria",
  analyst_name: "analyst_name",
  reviewer_name: "reviewer_name",
  notes: "notes",
  watermark_mode: "watermark_mode",
};

const sdsExportFieldMap = {
  document_number: "document_number",
  revision: "revision",
  issue_date: "issue_date",
  revision_date: "revision_date",
  status: "status",
  language: "language",
  jurisdiction: "jurisdiction",
  ghs_classification: "ghs_classification",
  signal_word: "signal_word",
  pictograms_json: "pictograms_json",
  hazard_statements_json: "hazard_statements_json",
  precautionary_statements_json: "precautionary_statements_json",
  prepared_by: "prepared_by",
  reviewed_by: "reviewed_by",
  approved_by: "approved_by",
  section_1_identification: "section_1_identification",
  section_2_hazard_identification: "section_2_hazard_identification",
  section_3_composition: "section_3_composition",
  section_4_first_aid: "section_4_first_aid",
  section_5_fire_fighting: "section_5_fire_fighting",
  section_6_accidental_release: "section_6_accidental_release",
  section_7_handling_storage: "section_7_handling_storage",
  section_8_exposure_controls: "section_8_exposure_controls",
  section_9_physical_chemical: "section_9_physical_chemical",
  section_10_stability_reactivity: "section_10_stability_reactivity",
  section_11_toxicological: "section_11_toxicological",
  section_12_ecological: "section_12_ecological",
  section_13_disposal: "section_13_disposal",
  section_14_transport: "section_14_transport",
  section_15_regulatory: "section_15_regulatory",
  section_16_other: "section_16_other",
};

const bundleExportFieldMap = {
  bundle_number: "number",
  status: "status",
  created_by: "created_by",
  approved_by: "approved_by",
  released_at: "released_at",
};

async function buildFullCoaExportRows(
  supabase: SupabaseClient,
  rowsToExport: CoaVerificationRow[],
): Promise<CoaExportRecord[]> {
  const [batches, qualityCoas, hplcReports, msReports, sdsDocuments, bundles] =
    await Promise.all([
      fetchRecordsById(supabase, "batches", uniqueDefinedIds(rowsToExport, "quality_batch_id")),
      fetchRecordsById(supabase, "coa_documents", uniqueDefinedIds(rowsToExport, "quality_coa_document_id")),
      fetchRecordsById(supabase, "hplc_reports", uniqueDefinedIds(rowsToExport, "hplc_report_id")),
      fetchRecordsById(supabase, "ms_reports", uniqueDefinedIds(rowsToExport, "ms_report_id")),
      fetchRecordsById(supabase, "sds_documents", uniqueDefinedIds(rowsToExport, "sds_id")),
      fetchRecordsById(supabase, "document_bundles", uniqueDefinedIds(rowsToExport, "document_bundle_id")),
    ]);

  return rowsToExport.map((row) => {
    const exportRow: CoaExportRecord = { ...row };

    assignPrefixedFields(
      exportRow,
      "batch",
      row.quality_batch_id ? batches.get(row.quality_batch_id) : undefined,
      batchExportFieldMap,
    );
    assignPrefixedFields(
      exportRow,
      "quality_coa",
      row.quality_coa_document_id ? qualityCoas.get(row.quality_coa_document_id) : undefined,
      qualityCoaExportFieldMap,
    );
    assignPrefixedFields(
      exportRow,
      "hplc",
      row.hplc_report_id ? hplcReports.get(row.hplc_report_id) : undefined,
      hplcExportFieldMap,
    );
    assignPrefixedFields(
      exportRow,
      "ms",
      row.ms_report_id ? msReports.get(row.ms_report_id) : undefined,
      msExportFieldMap,
    );
    assignPrefixedFields(
      exportRow,
      "sds",
      row.sds_id ? sdsDocuments.get(row.sds_id) : undefined,
      sdsExportFieldMap,
    );
    assignPrefixedFields(
      exportRow,
      "bundle",
      row.document_bundle_id ? bundles.get(row.document_bundle_id) : undefined,
      bundleExportFieldMap,
    );

    return exportRow;
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

function AdminCoaVerificationIndex({ supabase }: { supabase: SupabaseClient }) {
  const router = useRouter();
  const [rows, setRows] = useState<CoaVerificationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [generatingRowId, setGeneratingRowId] = useState<string | null>(null);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [deletingRowId, setDeletingRowId] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    CoaVerificationStatus | "All"
  >("All");
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
            : "The COA verification records could not be loaded.",
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
    [filteredRows],
  );

  const allFilteredRowsSelected =
    filteredRowIds.length > 0 &&
    filteredRowIds.every((id) => selectedRowIds.includes(id));

  function toggleRowSelection(rowId: string) {
    setSelectedRowIds((currentIds) =>
      currentIds.includes(rowId)
        ? currentIds.filter((id) => id !== rowId)
        : [...currentIds, rowId],
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
        currentDirection === "asc" ? "desc" : "asc",
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

  async function exportCoaRows(rowsToExport: CoaVerificationRow[], scope: string) {
    if (rowsToExport.length === 0) {
      setErrorMessage("No COA records are available for export.");
      return;
    }

    setErrorMessage(null);
    setCopyMessage(null);

    try {
      const fullExportRows = await buildFullCoaExportRows(supabase, rowsToExport);
      const csv = buildCoaCsv(fullExportRows);
      downloadCsv(buildExportFileName(scope), csv);
      setCopyMessage(
        `${rowsToExport.length} COA ${rowsToExport.length === 1 ? "record" : "records"} exported with linked HPLC, MS / LC-MS, SDS, batch, and bundle fields.`,
      );
      window.setTimeout(() => setCopyMessage(null), 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The full COA/supporting-document export could not be generated.",
      );
    }
  }

  function exportSelectedRows() {
    const selectedRows = rows.filter((row) => selectedRowIds.includes(row.id));
    void exportCoaRows(selectedRows, "selected");
  }

  type GenerateDocsResult = {
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

  function applyGeneratedDocsToRow(
    rowId: string,
    result: GenerateDocsResult,
    generatedBy: string,
  ) {
    setRows((currentRows) =>
      currentRows.map((currentRow) =>
        currentRow.id === rowId
          ? {
              ...currentRow,
              quality_batch_id: result.batchId ?? currentRow.quality_batch_id,
              quality_coa_document_id:
                result.coaDocumentId ?? currentRow.quality_coa_document_id,
              document_bundle_id:
                result.bundleId ?? currentRow.document_bundle_id,
              hplc_report_id: result.hplcReportId ?? currentRow.hplc_report_id,
              ms_report_id: result.msReportId ?? currentRow.ms_report_id,
              sds_id: result.sdsId ?? currentRow.sds_id,
              supporting_documents_status: "generated",
              supporting_documents_generated_at: new Date().toISOString(),
              supporting_documents_generated_by: generatedBy,
              supporting_documents_error: null,
              document_pack: "COA, HPLC, MS/LC-MS, SDS",
              hplc_file_name:
                result.hplcDocumentNumber ?? currentRow.hplc_file_name,
              lcms_file_name:
                result.msDocumentNumber ?? currentRow.lcms_file_name,
              sds_file_name: result.sdsDocumentNumber ?? currentRow.sds_file_name,
            }
          : currentRow,
      ),
    );
  }

  async function generateDocsForRow(
    row: CoaVerificationRow,
    accessToken: string,
  ): Promise<GenerateDocsResult> {
    const generatedBy =
      row.approved_by ||
      row.reviewed_by ||
      row.created_by ||
      "Atlas Labs QA Documentation Officer";

    const response = await fetch(
      "/api/internal/quality-documents/generate-from-coa",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          coaVerificationId: row.id,
          generatedBy,
        }),
      },
    );

    const result = (await response.json()) as GenerateDocsResult;

    if (!response.ok || !result.bundleId) {
      throw new Error(
        result.error ||
          `Supporting documents could not be generated for ${row.coa_number}.`,
      );
    }

    applyGeneratedDocsToRow(row.id, result, generatedBy);
    return result;
  }

  async function handleBulkGenerateSupportingDocuments() {
    const selectedRows = rows.filter((row) => selectedRowIds.includes(row.id));
    const rowsToGenerate = selectedRows.filter(
      (row) =>
        !(
          row.document_bundle_id &&
          row.hplc_report_id &&
          row.ms_report_id &&
          row.sds_id
        ),
    );

    if (selectedRows.length === 0) {
      setErrorMessage("Select at least one COA record before generating documents.");
      return;
    }

    if (rowsToGenerate.length === 0) {
      setCopyMessage(
        "All selected COA records already have supporting documents.",
      );
      window.setTimeout(() => setCopyMessage(null), 2500);
      return;
    }

    if (
      !window.confirm(
        `Generate HPLC, MS / LC-MS, SDS, and document bundles for ${rowsToGenerate.length} selected COA ${rowsToGenerate.length === 1 ? "record" : "records"}? Already-generated records will be skipped.`,
      )
    ) {
      return;
    }

    setIsBulkGenerating(true);
    setErrorMessage(null);
    setCopyMessage(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error(
          "Admin session expired. Please log in again before generating documents.",
        );
      }

      const failures: string[] = [];
      let generatedCount = 0;

      for (const row of rowsToGenerate) {
        setGeneratingRowId(row.id);

        try {
          await generateDocsForRow(row, session.access_token);
          generatedCount += 1;
        } catch (error) {
          failures.push(
            `${row.coa_number}: ${
              error instanceof Error
                ? error.message
                : "Supporting documents could not be generated."
            }`,
          );
        }
      }

      if (failures.length > 0) {
        setErrorMessage(
          `${generatedCount} ${generatedCount === 1 ? "record was" : "records were"} generated. ${failures.length} failed:\n${failures.join("\n")}`,
        );
      } else {
        setSelectedRowIds([]);
        setCopyMessage(
          `${generatedCount} COA ${generatedCount === 1 ? "record" : "records"} generated successfully.`,
        );
        window.setTimeout(() => setCopyMessage(null), 3000);
      }

      router.refresh();
    } finally {
      setGeneratingRowId(null);
      setIsBulkGenerating(false);
    }
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
        "You are duplicating this COA as a new record. A new COA number, verification code, and verification URL will be generated.",
      )
    ) {
      return;
    }

    try {
      const duplicatedRecord = await duplicateCoaVerificationRecord(
        supabase,
        row.id,
      );

      if (!duplicatedRecord.record) {
        throw new Error(
          "The duplicated COA record was not returned after creation.",
        );
      }

      if (duplicatedRecord.warnings.length > 0) {
        window.alert(duplicatedRecord.warnings.join("\n\n"));
      }

      router.push(
        `/admin/coa-verifications/${duplicatedRecord.record.id}/edit?duplicated=1`,
      );
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The COA record could not be duplicated.",
      );
    }
  }

  async function handleGenerateSupportingDocuments(row: CoaVerificationRow) {
    const alreadyGenerated =
      row.document_bundle_id &&
      row.hplc_report_id &&
      row.ms_report_id &&
      row.sds_id;

    if (alreadyGenerated) {
      router.push(`/admin/quality/document-bundles/${row.document_bundle_id}`);
      return;
    }

    if (
      !window.confirm(
        `Generate HPLC, MS / LC-MS, SDS, and document bundle for ${row.coa_number}?`,
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
        throw new Error(
          "Admin session expired. Please log in again before generating documents.",
        );
      }

      const result = await generateDocsForRow(row, session.access_token);

      router.push(`/admin/quality/document-bundles/${result.bundleId}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Supporting documents could not be generated.",
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
          : `Delete ${ids.length} selected COA verification records? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingRowId(ids.length === 1 ? (ids[0] ?? null) : "bulk");
    setErrorMessage(null);
    setCopyMessage(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error(
          "Admin session expired. Please log in again before deleting records.",
        );
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
        throw new Error(
          payload?.error || "Selected COA records could not be deleted.",
        );
      }

      setRows((currentRows) =>
        currentRows.filter((row) => !ids.includes(row.id)),
      );
      setSelectedRowIds((currentIds) =>
        currentIds.filter((id) => !ids.includes(id)),
      );
      setCopyMessage(
        ids.length === 1
          ? "COA verification record deleted."
          : `${payload?.deletedCount ?? ids.length} COA verification records deleted.`,
      );
      window.setTimeout(() => setCopyMessage(null), 2500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Selected COA records could not be deleted.",
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
                setStatusFilter(
                  event.target.value as CoaVerificationStatus | "All",
                )
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
              <>
                <Button
                  variant="outline"
                  onClick={exportSelectedRows}
                  className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                >
                  <DownloadIcon className="mr-1 size-4" />
                  Export selected ({selectedRowIds.length})
                </Button>
                <Button
                  variant="outline"
                  disabled={isBulkGenerating}
                  onClick={handleBulkGenerateSupportingDocuments}
                  className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                >
                  <FileTextIcon className="mr-1 size-4" />
                  {isBulkGenerating
                    ? "Generating docs..."
                    : `Generate docs (${selectedRowIds.length})`}
                </Button>
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
              </>
            ) : null}
            <Button
              variant="outline"
              onClick={() => void exportCoaRows(sortedRows, "visible")}
              className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              <DownloadIcon className="mr-1 size-4" />
              Export visible
            </Button>
            <Button
              variant="outline"
              onClick={() => void exportCoaRows(rows, "all")}
              className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              <DownloadIcon className="mr-1 size-4" />
              Export all
            </Button>
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
            <Button
              asChild
              className="h-11 bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-blue)]"
            >
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
          <CardContent className="py-5 text-sm text-rose-800">
            {errorMessage}
          </CardContent>
        </Card>
      ) : null}

      {copyMessage ? (
        <Card className="surface-card border border-emerald-200 bg-emerald-50/60 p-0">
          <CardContent className="py-4 text-sm text-emerald-800">
            {copyMessage}
          </CardContent>
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
                    {renderSortableHeader(
                      "verification_code",
                      "Verification Code",
                    )}
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
                    {renderSortableHeader(
                      "verification_status",
                      "Verification Status",
                    )}
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    {renderSortableHeader(
                      "release_decision",
                      "Release Decision",
                    )}
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
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {row.product_name}
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {row.catalog_code}
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {row.batch_lot_no}
                    </td>
                    <td className="px-4 py-4">
                      <CoaStatusBadge status={row.verification_status} />
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {row.release_decision}
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {row.issue_date}
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {formatDateTime(row.updated_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
                          <Link
                            href={`/admin/coa-verifications/${row.id}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
                          <Link
                            href={`/admin/coa-verifications/${row.id}/print`}
                          >
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
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
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
                          onClick={() => void exportCoaRows([row], "single")}
                          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
                          <DownloadIcon className="mr-1 size-3.5" />
                          Export
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
