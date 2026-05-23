"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DownloadIcon, FileSpreadsheetIcon, RefreshCwIcon, UploadIcon } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { AdminGuard } from "@/components/admin/admin-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildCoaNumberFromVerificationCode,
  buildVerificationUrl,
  createCoaVerificationRecord,
  generateVerificationCode,
  getDefaultCoaFormValues,
  listCoaVerificationRows,
  mapRowToFormValues,
  updateCoaVerificationRecord,
  verificationStatusOptions,
  releaseDecisionOptions,
  type CoaVerificationFormValues,
} from "@/lib/coa-verification-admin";
import type {
  CoaReleaseDecision,
  CoaVerificationRow,
  CoaVerificationStatus,
} from "@/lib/coa-verification";
import type { BreadcrumbItem } from "@/lib/seo";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Admin", path: "/admin/coa-verifications" },
  { name: "Import COA Records", path: "/admin/coa-verifications/import" },
];

const templateColumns = [
  "product_name",
  "catalog_code",
  "batch_lot_no",
  "issue_date",
  "client_recipient",
  "prepared_by",
  "reviewed_by",
  "approved_by",
  "release_decision",
  "verification_status",
  "peptide_sequence",
  "molecular_weight",
  "molecular_formula",
  "physical_form",
  "appearance",
  "purity",
  "hplc_purity",
  "identity_result",
  "water_content",
  "storage_condition",
  "manufacture_date",
  "retest_expiry_date",
  "country_of_origin",
  "manufacturing_site",
  "document_type",
  "revision",
  "pack_size",
  "batch_quantity",
  "packaging",
  "shipping_conditions",
  "coa_number",
  "verification_code",
  "verification_url",
  "hplc_file_name",
  "lcms_file_name",
  "sds_file_name",
  "raw_data_archive_ref",
  "notes",
];

const templateExample = [
  "BPC-157",
  "ATL-BPC157",
  "ABLL-BPC157-2026-001",
  "20 May 2026",
  "Qualified B2B Buyer",
  "Atlas Labs QA Documentation Officer",
  "Quality Assurance Manager",
  "",
  "Pending QA Review",
  "Pending QA Review",
  "",
  "1419.56 g/mol",
  "C62H98N16O22",
  "Lyophilized powder",
  "White to off-white powder",
  "99.21%",
  "99.21%",
  "LC-MS/MS: Conforms",
  "1.6%",
  "2-8°C, dry and light-protected",
  "Current month/year",
  "24 months from manufacture",
  "China",
  "Atlas qualified manufacturing partner",
  "Certificate of Analysis",
  "Rev. 01",
  "5 mg vial",
  "100 vials",
  "Sealed vial",
  "Cold-chain when required by product profile",
  "",
  "",
  "",
  "",
  "",
  "",
  "Internal QA record folder",
  "Imported from CSV",
];

type DuplicateMode = "skip" | "update";

type ImportStatus = "new" | "existing" | "invalid";

type CsvRow = Record<string, string>;

type PreviewRow = {
  index: number;
  raw: CsvRow;
  values: CoaVerificationFormValues;
  status: ImportStatus;
  existingRow: CoaVerificationRow | null;
  message: string;
  selected: boolean;
};

type ImportResult = {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  generatedBundles: number;
  messages: string[];
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizeMatch(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index] ?? "";
    const nextChar = text[index + 1] ?? "";

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      currentRow.push(currentCell);
      if (currentRow.some((cell) => cell.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  if (currentRow.some((cell) => cell.trim().length > 0)) {
    rows.push(currentRow);
  }

  if (rows.length === 0) {
    return [] as CsvRow[];
  }

  const headers = rows[0].map(normalizeKey);
  return rows.slice(1).map((row) => {
    const record: CsvRow = {};
    headers.forEach((header, index) => {
      if (header) {
        record[header] = (row[index] ?? "").trim();
      }
    });
    return record;
  });
}

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildTemplateCsv() {
  return [templateColumns, templateExample]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
}

function downloadCsvTemplate() {
  const blob = new Blob([buildTemplateCsv()], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "atlas-coa-import-template.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function readValue(row: CsvRow, ...keys: string[]) {
  for (const key of keys) {
    const normalized = normalizeKey(key);
    const value = row[normalized];
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function coerceReleaseDecision(value: string, fallback: CoaReleaseDecision) {
  const normalized = value.trim().toLowerCase();
  const exact = releaseDecisionOptions.find(
    (option) => option.toLowerCase() === normalized
  );
  if (exact) return exact;
  if (normalized.includes("released with deviation")) return "Released with Deviation";
  if (normalized.includes("released") || normalized.includes("conform")) return "Released / Conforms";
  if (normalized.includes("reject") || normalized.includes("non")) return "Rejected / Non-Conforming";
  if (normalized.includes("not applicable") || normalized === "n/a") return "Not Applicable";
  return fallback;
}

function coerceVerificationStatus(value: string, fallback: CoaVerificationStatus) {
  const normalized = value.trim().toLowerCase();
  const exact = verificationStatusOptions.find(
    (option) => option.toLowerCase() === normalized
  );
  if (exact) return exact;
  if (normalized.includes("released") || normalized.includes("verified")) return "Released / Verified";
  if (normalized.includes("draft")) return "Draft";
  if (normalized.includes("revoked")) return "Revoked";
  if (normalized.includes("expired")) return "Expired";
  if (normalized.includes("reject") || normalized.includes("non")) return "Rejected / Non-Conforming";
  if (normalized.includes("superseded")) return "Superseded";
  return fallback;
}

function applyCsvRowToValues(
  baseValues: CoaVerificationFormValues,
  row: CsvRow,
  generated: {
    coaNumber: string;
    verificationCode: string;
    verificationUrl: string;
  }
) {
  const nextValues: CoaVerificationFormValues = {
    ...baseValues,
    coa_number:
      readValue(row, "coa_number", "coa number") || generated.coaNumber || baseValues.coa_number,
    verification_code:
      readValue(row, "verification_code", "verification code") ||
      generated.verificationCode ||
      baseValues.verification_code,
    verification_url:
      readValue(row, "verification_url", "verification url") ||
      generated.verificationUrl ||
      baseValues.verification_url,
    product_name:
      readValue(row, "product_name", "product name", "product") || baseValues.product_name,
    catalog_code:
      readValue(row, "catalog_code", "catalog code", "catalogue_code", "catalogue code") ||
      baseValues.catalog_code,
    batch_lot_no:
      readValue(row, "batch_lot_no", "batch lot no", "batch", "lot", "batch_number", "lot_number") ||
      baseValues.batch_lot_no,
    issue_date: readValue(row, "issue_date", "issue date") || baseValues.issue_date,
    revision: readValue(row, "revision", "document revision") || baseValues.revision,
    client_recipient:
      readValue(row, "client_recipient", "client", "recipient") || baseValues.client_recipient,
    peptide_sequence:
      readValue(row, "peptide_sequence", "peptide sequence", "sequence") || baseValues.peptide_sequence,
    molecular_weight:
      readValue(row, "molecular_weight", "molecular weight", "mw") || baseValues.molecular_weight,
    molecular_formula:
      readValue(row, "molecular_formula", "molecular formula", "formula") || baseValues.molecular_formula,
    physical_form:
      readValue(row, "physical_form", "physical form", "form") || baseValues.physical_form,
    appearance_spec:
      readValue(row, "appearance_spec", "appearance", "appearance specification") ||
      baseValues.appearance_spec,
    grade_scope:
      readValue(row, "grade_scope", "grade", "scope") || baseValues.grade_scope,
    pack_size: readValue(row, "pack_size", "pack size") || baseValues.pack_size,
    storage:
      readValue(row, "storage", "storage_condition", "storage condition") || baseValues.storage,
    retest_period:
      readValue(row, "retest_period", "retest period") || baseValues.retest_period,
    manufacture_date:
      readValue(row, "manufacture_date", "manufacturing_date", "manufacture date") ||
      baseValues.manufacture_date,
    retest_expiry_date:
      readValue(row, "retest_expiry_date", "expiry_date", "expiry date", "retest expiry date") ||
      baseValues.retest_expiry_date,
    batch_quantity:
      readValue(row, "batch_quantity", "batch quantity", "quantity") || baseValues.batch_quantity,
    manufacturing_site:
      readValue(row, "manufacturing_site", "manufacturing site", "manufacturer") ||
      baseValues.manufacturing_site,
    country_of_origin:
      readValue(row, "country_of_origin", "country of origin", "origin") ||
      baseValues.country_of_origin,
    release_site:
      readValue(row, "release_site", "release site") || baseValues.release_site,
    packaging: readValue(row, "packaging", "package") || baseValues.packaging,
    label_option:
      readValue(row, "label_option", "label option", "label") || baseValues.label_option,
    shipping_conditions:
      readValue(row, "shipping_conditions", "shipping conditions", "shipping") ||
      baseValues.shipping_conditions,
    intended_use_scope:
      readValue(row, "intended_use_scope", "intended use", "scope of use") ||
      baseValues.intended_use_scope,
    identity_result:
      readValue(row, "identity_result", "identity result", "lcms_result", "ms_result") ||
      baseValues.identity_result,
    hplc_purity:
      readValue(row, "hplc_purity", "hplc purity", "purity") || baseValues.hplc_purity,
    water_content:
      readValue(row, "water_content", "water content") || baseValues.water_content,
    release_decision: coerceReleaseDecision(
      readValue(row, "release_decision", "release decision"),
      baseValues.release_decision
    ),
    verification_status: coerceVerificationStatus(
      readValue(row, "verification_status", "verification status", "status"),
      baseValues.verification_status
    ),
    document_pack:
      readValue(row, "document_pack", "document pack", "documents") || baseValues.document_pack,
    verification_message:
      readValue(row, "verification_message", "verification message") ||
      baseValues.verification_message,
    appearance_result:
      readValue(row, "appearance_result", "appearance result", "appearance") ||
      baseValues.appearance_result,
    purity_result:
      readValue(row, "purity_result", "purity result", "purity") || baseValues.purity_result,
    peptide_content_result:
      readValue(row, "peptide_content_result", "peptide content") ||
      baseValues.peptide_content_result,
    counter_ion_result:
      readValue(row, "counter_ion_result", "counter ion") || baseValues.counter_ion_result,
    residual_solvents_result:
      readValue(row, "residual_solvents_result", "residual solvents") ||
      baseValues.residual_solvents_result,
    heavy_metals_result:
      readValue(row, "heavy_metals_result", "heavy metals") || baseValues.heavy_metals_result,
    microbial_limits_result:
      readValue(row, "microbial_limits_result", "microbial limits") ||
      baseValues.microbial_limits_result,
    endotoxin_sterility_result:
      readValue(row, "endotoxin_sterility_result", "endotoxin sterility") ||
      baseValues.endotoxin_sterility_result,
    hplc_file_name:
      readValue(row, "hplc_file_name", "hplc file name", "hplc reference") ||
      baseValues.hplc_file_name,
    lcms_file_name:
      readValue(row, "lcms_file_name", "lcms file name", "ms file name", "lc-ms identity report") ||
      baseValues.lcms_file_name,
    sds_file_name:
      readValue(row, "sds_file_name", "sds file name", "sds") || baseValues.sds_file_name,
    raw_data_archive_ref:
      readValue(row, "raw_data_archive_ref", "raw data archive", "raw data") ||
      baseValues.raw_data_archive_ref,
    coa_pdf_url: readValue(row, "coa_pdf_url", "coa pdf url") || baseValues.coa_pdf_url,
    qr_code_url: readValue(row, "qr_code_url", "qr code url") || baseValues.qr_code_url,
    created_by: readValue(row, "created_by", "prepared_by", "prepared by") || baseValues.created_by,
    prepared_at: readValue(row, "prepared_at", "prepared at") || baseValues.prepared_at,
    reviewed_by: readValue(row, "reviewed_by", "reviewed by") || baseValues.reviewed_by,
    reviewed_at: readValue(row, "reviewed_at", "reviewed at") || baseValues.reviewed_at,
    approved_by: readValue(row, "approved_by", "approved by") || baseValues.approved_by,
    approved_at: readValue(row, "approved_at", "approved at") || baseValues.approved_at,
  };

  return nextValues;
}

function findExistingRow(existingRows: CoaVerificationRow[], values: CoaVerificationFormValues) {
  const catalog = normalizeMatch(values.catalog_code);
  const batch = normalizeMatch(values.batch_lot_no);

  if (!catalog || !batch) {
    return null;
  }

  return (
    existingRows.find(
      (row) =>
        normalizeMatch(row.catalog_code) === catalog && normalizeMatch(row.batch_lot_no) === batch
    ) ?? null
  );
}

function validatePreviewRow(values: CoaVerificationFormValues) {
  const missing = [] as string[];
  if (!values.product_name.trim()) missing.push("product_name");
  if (!values.catalog_code.trim()) missing.push("catalog_code");
  if (!values.batch_lot_no.trim()) missing.push("batch_lot_no");
  return missing;
}

async function generateSupportingDocsForImportedRecord(
  supabase: SupabaseClient,
  coaVerificationId: string,
  generatedBy: string
) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("Admin session expired. Log in again before generating documents.");
  }

  const response = await fetch("/api/internal/quality-documents/generate-from-coa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ coaVerificationId, generatedBy }),
  });

  const payload = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.error || "Supporting documents could not be generated.");
  }
}

export default function ImportCoaVerificationsPage() {
  return (
    <AdminGuard
      title="Import COA records"
      description="Upload a CSV exported from Google Sheets or Excel, preview duplicates, then bulk create or update COA verification records."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase, adminUser }) => (
        <ImportCoaVerificationsClient
          supabase={supabase}
          adminEmail={adminUser.email || "Atlas Labs QA Documentation Officer"}
        />
      )}
    </AdminGuard>
  );
}

function ImportCoaVerificationsClient({
  supabase,
  adminEmail,
}: {
  supabase: SupabaseClient;
  adminEmail: string;
}) {
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("skip");
  const [autoGenerateDocs, setAutoGenerateDocs] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const summary = useMemo(() => {
    return previewRows.reduce(
      (accumulator, row) => {
        accumulator.total += 1;
        accumulator[row.status] += 1;
        if (row.selected) accumulator.selected += 1;
        return accumulator;
      },
      { total: 0, new: 0, existing: 0, invalid: 0, selected: 0 }
    );
  }, [previewRows]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const text = await file.text();
      const csvRows = parseCsv(text);
      if (csvRows.length === 0) {
        throw new Error("The CSV file did not contain any import rows.");
      }

      const existingRows = await listCoaVerificationRows(supabase);
      const nextPreviewRows: PreviewRow[] = [];

      for (const [index, raw] of csvRows.entries()) {
        const defaultValues = {
          ...getDefaultCoaFormValues(),
          created_by: adminEmail,
          prepared_at: getDefaultCoaFormValues().prepared_at,
        };
        const productName = readValue(raw, "product_name", "product name", "product");
        const catalogCode = readValue(raw, "catalog_code", "catalog code", "catalogue code");
        const year = new Date().getFullYear();
        const fallbackCode = catalogCode || `ROW${index + 1}`;
        const generatedVerificationCode =
          readValue(raw, "verification_code", "verification code") ||
          (await generateVerificationCode({ supabase, catalogCode: fallbackCode, year }));
        const generatedCoaNumber =
          readValue(raw, "coa_number", "coa number") ||
          buildCoaNumberFromVerificationCode(generatedVerificationCode);
        const generatedVerificationUrl =
          readValue(raw, "verification_url", "verification url") ||
          buildVerificationUrl(generatedVerificationCode);

        const values = applyCsvRowToValues(
          {
            ...defaultValues,
            product_name: productName || defaultValues.product_name,
            catalog_code: catalogCode || defaultValues.catalog_code,
          },
          raw,
          {
            coaNumber: generatedCoaNumber,
            verificationCode: generatedVerificationCode,
            verificationUrl: generatedVerificationUrl,
          }
        );

        const missing = validatePreviewRow(values);
        const existingRow = findExistingRow(existingRows, values);
        const status: ImportStatus = missing.length > 0 ? "invalid" : existingRow ? "existing" : "new";

        nextPreviewRows.push({
          index: index + 1,
          raw,
          values,
          status,
          existingRow,
          message:
            status === "invalid"
              ? `Missing required fields: ${missing.join(", ")}`
              : status === "existing"
                ? `Existing record found: ${existingRow?.coa_number}`
                : "New COA record will be created.",
          selected: status !== "invalid",
        });
      }

      setPreviewRows(nextPreviewRows);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "CSV import preview failed.");
    } finally {
      setIsParsing(false);
      event.target.value = "";
    }
  }

  function togglePreviewRow(index: number) {
    setPreviewRows((currentRows) =>
      currentRows.map((row) =>
        row.index === index && row.status !== "invalid" ? { ...row, selected: !row.selected } : row
      )
    );
  }

  function selectAllValidRows(selected: boolean) {
    setPreviewRows((currentRows) =>
      currentRows.map((row) => (row.status === "invalid" ? row : { ...row, selected }))
    );
  }

  async function handleImport() {
    const rowsToImport = previewRows.filter((row) => row.selected && row.status !== "invalid");

    if (rowsToImport.length === 0) {
      setErrorMessage("Select at least one valid row before importing.");
      return;
    }

    const existingCount = rowsToImport.filter((row) => row.status === "existing").length;
    const confirmMessage = [
      `Import ${rowsToImport.length} selected COA rows?`,
      existingCount > 0
        ? duplicateMode === "update"
          ? `${existingCount} existing records will be updated using catalog code + batch/lot matching.`
          : `${existingCount} existing records will be skipped/discarded.`
        : "Only new records will be created.",
      autoGenerateDocs
        ? "Supporting HPLC, MS / LC-MS, SDS, and document bundles will be generated after import."
        : "Supporting documents will not be generated automatically.",
    ].join("\n\n");

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);
    setResult(null);

    const nextResult: ImportResult = {
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      generatedBundles: 0,
      messages: [],
    };

    try {
      for (const row of rowsToImport) {
        try {
          if (row.status === "existing" && row.existingRow) {
            if (duplicateMode === "skip") {
              nextResult.skipped += 1;
              continue;
            }

            const existingValues = mapRowToFormValues(row.existingRow);
            const preserveGeneratedValues = {
              coaNumber: row.raw.coa_number?.trim() ? row.values.coa_number : existingValues.coa_number,
              verificationCode: row.raw.verification_code?.trim()
                ? row.values.verification_code
                : existingValues.verification_code,
              verificationUrl: row.raw.verification_url?.trim()
                ? row.values.verification_url
                : existingValues.verification_url,
            };
            const updateValues = applyCsvRowToValues(existingValues, row.raw, preserveGeneratedValues);
            const updatedRow = await updateCoaVerificationRecord(
              supabase,
              row.existingRow.id,
              updateValues
            );
            nextResult.updated += 1;

            if (autoGenerateDocs && updatedRow) {
              await generateSupportingDocsForImportedRecord(
                supabase,
                updatedRow.id,
                updateValues.approved_by || updateValues.reviewed_by || updateValues.created_by || adminEmail
              );
              nextResult.generatedBundles += 1;
            }
            continue;
          }

          const createdRow = await createCoaVerificationRecord(supabase, row.values);
          if (!createdRow) {
            throw new Error("Created row was not returned by Supabase.");
          }
          nextResult.created += 1;

          if (autoGenerateDocs) {
            await generateSupportingDocsForImportedRecord(
              supabase,
              createdRow.id,
              row.values.approved_by || row.values.reviewed_by || row.values.created_by || adminEmail
            );
            nextResult.generatedBundles += 1;
          }
        } catch (error) {
          nextResult.failed += 1;
          nextResult.messages.push(
            `Row ${row.index} (${row.values.catalog_code} / ${row.values.batch_lot_no}): ${
              error instanceof Error ? error.message : "Import failed."
            }`
          );
        }
      }

      setResult(nextResult);
      if (nextResult.failed === 0) {
        setPreviewRows([]);
      }
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" className="border-[#d5def0] bg-white text-[var(--brand-navy)]">
          <Link href="/admin/coa-verifications">
            <ArrowLeftIcon className="mr-1 size-4" />
            Back to COA Records
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={downloadCsvTemplate}
          className="border-[#d5def0] bg-white text-[var(--brand-navy)]"
        >
          <DownloadIcon className="mr-1 size-4" />
          Download CSV Template
        </Button>
      </div>

      <Card className="surface-card border p-0">
        <CardContent className="space-y-5 py-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <label className="text-sm font-semibold text-[var(--brand-navy)]" htmlFor="coa-import-file">
                Upload CSV from Google Sheets or Excel
              </label>
              <p className="mt-1 text-sm text-muted-foreground">
                Save your spreadsheet as CSV. Required fields are product_name, catalog_code, and batch_lot_no.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#d5def0] bg-white px-4 text-sm font-medium text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                  <UploadIcon className="mr-2 size-4" />
                  Choose CSV File
                  <input
                    id="coa-import-file"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                {isParsing ? (
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <RefreshCwIcon className="mr-2 size-4 animate-spin" />
                    Reading file...
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-[#d5def0] bg-[#f8fbff] p-4">
              <label className="text-sm font-semibold text-[var(--brand-navy)]" htmlFor="duplicate-mode">
                Existing records action
              </label>
              <select
                id="duplicate-mode"
                value={duplicateMode}
                onChange={(event) => setDuplicateMode(event.target.value as DuplicateMode)}
                className="h-11 rounded-lg border border-[#d5def0] bg-white px-4 text-sm text-[var(--brand-navy)] outline-none"
              >
                <option value="skip">Skip/discard existing records</option>
                <option value="update">Update existing records</option>
              </select>
              <label className="flex items-start gap-2 text-sm text-[var(--brand-navy)]">
                <input
                  type="checkbox"
                  checked={autoGenerateDocs}
                  onChange={(event) => setAutoGenerateDocs(event.target.checked)}
                  className="mt-1"
                />
                <span>Generate HPLC, MS / LC-MS, SDS, and document bundles after import</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {errorMessage ? (
        <Card className="surface-card border border-rose-200 bg-rose-50/60 p-0">
          <CardContent className="py-5 text-sm text-rose-800">{errorMessage}</CardContent>
        </Card>
      ) : null}

      {result ? (
        <Card className="surface-card border border-emerald-200 bg-emerald-50/60 p-0">
          <CardContent className="space-y-3 py-5 text-sm text-emerald-900">
            <p className="font-semibold">Import completed.</p>
            <p>
              Created: {result.created} · Updated: {result.updated} · Skipped: {result.skipped} · Failed: {result.failed} · Generated document bundles: {result.generatedBundles}
            </p>
            {result.messages.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-rose-800">
                {result.messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className="surface-card border p-0">
        <CardContent className="space-y-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Import preview</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Match rule: catalog_code + batch_lot_no. Product name is used as a secondary warning/reference.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Total: {summary.total}</span>
              <span>New: {summary.new}</span>
              <span>Existing: {summary.existing}</span>
              <span>Invalid: {summary.invalid}</span>
              <span>Selected: {summary.selected}</span>
            </div>
          </div>

          {previewRows.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => selectAllValidRows(true)}
                className="border-[#d5def0] bg-white text-[var(--brand-navy)]"
              >
                Select all valid
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => selectAllValidRows(false)}
                className="border-[#d5def0] bg-white text-[var(--brand-navy)]"
              >
                Clear selection
              </Button>
              <Button
                type="button"
                disabled={isImporting || summary.selected === 0}
                onClick={handleImport}
                className="bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-blue)]"
              >
                <FileSpreadsheetIcon className="mr-1 size-4" />
                {isImporting ? "Importing..." : `Import selected (${summary.selected})`}
              </Button>
            </div>
          ) : null}

          {previewRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d5def0] bg-[#f8fbff] p-8 text-center text-sm text-muted-foreground">
              Upload a CSV to preview COA records before importing.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#d5def0]">
              <table className="min-w-full divide-y divide-border/70 text-sm">
                <thead className="bg-[#f8fbff] text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Import</th>
                    <th className="px-4 py-3">Row</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Catalog Code</th>
                    <th className="px-4 py-3">Batch / Lot</th>
                    <th className="px-4 py-3">COA Number</th>
                    <th className="px-4 py-3">Verification Code</th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {previewRows.map((row) => (
                    <tr key={row.index} className="align-top">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          disabled={row.status === "invalid"}
                          onChange={() => togglePreviewRow(row.index)}
                          aria-label={`Select import row ${row.index}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{row.index}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            row.status === "new"
                              ? "bg-emerald-50 text-emerald-700"
                              : row.status === "existing"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--brand-navy)]">
                        {row.values.product_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-[var(--brand-navy)]">{row.values.catalog_code || "—"}</td>
                      <td className="px-4 py-3 text-[var(--brand-navy)]">{row.values.batch_lot_no || "—"}</td>
                      <td className="px-4 py-3 text-[var(--brand-navy)]">{row.values.coa_number || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--brand-navy)]">
                        {row.values.verification_code || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
