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
  "quality_batch_id",
  "quality_coa_document_id",
  "document_bundle_id",
  "hplc_report_id",
  "ms_report_id",
  "sds_id",
  "supporting_documents_status",
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
  "hplc_result_summary",
  "hplc_pass_fail_decision",
  "hplc_acceptance_criteria",
  "hplc_analyst_name",
  "hplc_reviewer_name",
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
  "sds_signal_word",
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
] as const;

const templateExampleValues: Record<string, string> = {
  product_name: "BPC-157",
  catalog_code: "ATL-BPC157",
  batch_lot_no: "ABLL-BPC157-2026-001",
  issue_date: "20 May 2026",
  client_recipient: "Qualified B2B Buyer",
  prepared_by: "Atlas Labs QA Documentation Officer",
  reviewed_by: "Quality Assurance Manager",
  release_decision: "Pending QA Review",
  verification_status: "Pending QA Review",
  molecular_weight: "1419.56 g/mol",
  molecular_formula: "C62H98N16O22",
  physical_form: "Lyophilized powder",
  appearance: "White to off-white powder",
  purity: "99.21%",
  hplc_purity: "99.21%",
  identity_result: "LC-MS/MS: Conforms",
  water_content: "1.6%",
  storage_condition: "2-8°C, dry and light-protected",
  manufacture_date: "Current month/year",
  retest_expiry_date: "24 months from manufacture",
  country_of_origin: "China",
  manufacturing_site: "Atlas qualified manufacturing partner",
  document_type: "Certificate of Analysis",
  revision: "Rev. 01",
  pack_size: "5 mg vial",
  batch_quantity: "100 vials",
  packaging: "Sealed vial",
  shipping_conditions: "Cold-chain when required by product profile",
  raw_data_archive_ref: "Internal QA record folder",
  notes: "Imported from CSV",
  hplc_method_name: "HPLC - Purity Determination",
  hplc_instrument_name: "Analytical HPLC System",
  hplc_column_type: "C18 Reverse Phase",
  hplc_mobile_phase: "Water/acetonitrile gradient with 0.1% TFA",
  hplc_flow_rate: "1.0",
  hplc_detection_wavelength: "215",
  hplc_injection_volume: "10",
  hplc_run_time: "30",
  hplc_purity_percent: "99.21",
  hplc_result_summary: "Main peak conforms to purity requirement.",
  hplc_pass_fail_decision: "pass",
  hplc_acceptance_criteria: "Purity ≥ 95%",
  hplc_analyst_name: "Atlas Labs QA Documentation Officer",
  ms_method_name: "LC-MS/MS - Identity Confirmation",
  ms_instrument_name: "LC-MS/MS System",
  ms_ionization_mode: "ESI+",
  ms_expected_molecular_weight: "1419.56",
  ms_observed_mass: "1419.62",
  ms_mass_error: "0.06",
  ms_mass_error_ppm: "42.27",
  ms_identity_conclusion: "Observed mass conforms to expected identity.",
  ms_pass_fail_decision: "pass",
  ms_acceptance_criteria: "Observed mass within acceptable method tolerance.",
  ms_analyst_name: "Atlas Labs QA Documentation Officer",
  sds_status: "draft",
  sds_language: "en",
  sds_jurisdiction: "US",
  sds_signal_word: "Warning",
  sds_prepared_by: "Atlas Labs QA Documentation Officer",
  sds_section_1_identification: "Product identification and supplier details.",
  sds_section_2_hazard_identification: "Classification and label information to be determined.",
  sds_section_3_composition: "Composition information for the listed research compound.",
  sds_section_4_first_aid: "Use standard laboratory first-aid practices.",
  sds_section_5_fire_fighting: "Use appropriate extinguishing media.",
  sds_section_6_accidental_release: "Avoid dust formation and collect safely.",
  sds_section_7_handling_storage: "Handle with PPE and store sealed in cool, dry conditions.",
  sds_section_8_exposure_controls: "Use gloves, lab coat, and eye protection.",
  sds_section_9_physical_chemical: "White to off-white lyophilized powder.",
  sds_section_10_stability_reactivity: "Stable under recommended storage conditions.",
  sds_section_11_toxicological: "Toxicological data to be provided upon request.",
  sds_section_12_ecological: "Ecological data to be provided upon request.",
  sds_section_13_disposal: "Dispose according to applicable regulations.",
  sds_section_14_transport: "Transport according to applicable regulations.",
  sds_section_15_regulatory: "For qualified commercial/research documentation context only.",
  sds_section_16_other: "No medical, dosing, or human-use claims are made.",
};

const templateExample = templateColumns.map(
  (column) => templateExampleValues[column] ?? "",
);

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


function readOptionalNumber(row: CsvRow, ...keys: string[]) {
  const value = readValue(row, ...keys);
  if (!value) return undefined;

  const parsed = Number.parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readOptionalInteger(row: CsvRow, ...keys: string[]) {
  const value = readValue(row, ...keys);
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function compactObject(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
}

const supportingDetailColumns = templateColumns.filter(
  (column) =>
    column.startsWith("hplc_") ||
    column.startsWith("ms_") ||
    column.startsWith("sds_") ||
    column.startsWith("bundle_"),
);

function hasSupportingDocumentDetails(row: CsvRow) {
  return supportingDetailColumns.some((column) => readValue(row, column).length > 0);
}

async function syncImportedQualityLinks(
  supabase: SupabaseClient,
  coaVerificationId: string,
  row: CsvRow,
) {
  const updatePayload = compactObject({
    quality_batch_id: readValue(row, "quality_batch_id") || undefined,
    quality_coa_document_id: readValue(row, "quality_coa_document_id") || undefined,
    document_bundle_id: readValue(row, "document_bundle_id") || undefined,
    hplc_report_id: readValue(row, "hplc_report_id") || undefined,
    ms_report_id: readValue(row, "ms_report_id") || undefined,
    sds_id: readValue(row, "sds_id") || undefined,
    supporting_documents_status:
      readValue(row, "supporting_documents_status") || undefined,
  });

  if (Object.keys(updatePayload).length === 0) {
    return;
  }

  const { error } = await supabase
    .from("coa_verifications")
    .update(updatePayload)
    .eq("id", coaVerificationId);

  if (error) {
    throw error;
  }
}

async function getCoaQualityLinks(
  supabase: SupabaseClient,
  coaVerificationId: string,
) {
  const { data, error } = await supabase
    .from("coa_verifications")
    .select(
      "quality_batch_id, quality_coa_document_id, document_bundle_id, hplc_report_id, ms_report_id, sds_id",
    )
    .eq("id", coaVerificationId)
    .single();

  if (error) {
    throw error;
  }

  return data as {
    quality_batch_id?: string | null;
    quality_coa_document_id?: string | null;
    document_bundle_id?: string | null;
    hplc_report_id?: string | null;
    ms_report_id?: string | null;
    sds_id?: string | null;
  };
}

async function updateImportedSupportingDocuments(
  supabase: SupabaseClient,
  coaVerificationId: string,
  row: CsvRow,
  generatedBy: string,
) {
  if (!hasSupportingDocumentDetails(row)) {
    return;
  }

  let links = await getCoaQualityLinks(supabase, coaVerificationId);

  if (!links.hplc_report_id || !links.ms_report_id || !links.sds_id) {
    await generateSupportingDocsForImportedRecord(supabase, coaVerificationId, generatedBy);
    links = await getCoaQualityLinks(supabase, coaVerificationId);
  }

  if (links.hplc_report_id) {
    const hplcPayload = compactObject({
      document_number: readValue(row, "hplc_document_number") || undefined,
      issue_date: readValue(row, "hplc_issue_date") || undefined,
      revision: readOptionalInteger(row, "hplc_revision"),
      status: readValue(row, "hplc_status") || undefined,
      method_name: readValue(row, "hplc_method_name") || undefined,
      method_code: readValue(row, "hplc_method_code") || undefined,
      instrument_name: readValue(row, "hplc_instrument_name") || undefined,
      column_type: readValue(row, "hplc_column_type") || undefined,
      mobile_phase: readValue(row, "hplc_mobile_phase") || undefined,
      flow_rate: readOptionalNumber(row, "hplc_flow_rate"),
      detection_wavelength: readOptionalNumber(row, "hplc_detection_wavelength"),
      injection_volume: readOptionalNumber(row, "hplc_injection_volume"),
      run_time: readOptionalNumber(row, "hplc_run_time"),
      sample_concentration: readValue(row, "hplc_sample_concentration") || undefined,
      retention_time: readOptionalNumber(row, "hplc_retention_time"),
      purity_percent: readOptionalNumber(row, "hplc_purity_percent"),
      main_peak_area: readOptionalNumber(row, "hplc_main_peak_area"),
      total_peak_area: readOptionalNumber(row, "hplc_total_peak_area"),
      result_summary: readValue(row, "hplc_result_summary") || undefined,
      pass_fail_decision: readValue(row, "hplc_pass_fail_decision") || undefined,
      acceptance_criteria: readValue(row, "hplc_acceptance_criteria") || undefined,
      analyst_name: readValue(row, "hplc_analyst_name") || undefined,
      reviewer_name: readValue(row, "hplc_reviewer_name") || undefined,
      notes: readValue(row, "hplc_notes") || undefined,
      watermark_mode: readValue(row, "hplc_watermark_mode") || undefined,
    });

    if (Object.keys(hplcPayload).length > 0) {
      const { error } = await supabase
        .from("hplc_reports")
        .update(hplcPayload)
        .eq("id", links.hplc_report_id);
      if (error) throw error;
    }
  }

  if (links.ms_report_id) {
    const msPayload = compactObject({
      document_number: readValue(row, "ms_document_number") || undefined,
      issue_date: readValue(row, "ms_issue_date") || undefined,
      revision: readOptionalInteger(row, "ms_revision"),
      status: readValue(row, "ms_status") || undefined,
      method_name: readValue(row, "ms_method_name") || undefined,
      method_code: readValue(row, "ms_method_code") || undefined,
      instrument_name: readValue(row, "ms_instrument_name") || undefined,
      ionization_mode: readValue(row, "ms_ionization_mode") || undefined,
      expected_molecular_weight: readOptionalNumber(row, "ms_expected_molecular_weight"),
      observed_mass: readOptionalNumber(row, "ms_observed_mass"),
      mass_error: readOptionalNumber(row, "ms_mass_error"),
      mass_error_ppm: readOptionalNumber(row, "ms_mass_error_ppm"),
      charge_state: readOptionalInteger(row, "ms_charge_state"),
      identity_conclusion: readValue(row, "ms_identity_conclusion") || undefined,
      pass_fail_decision: readValue(row, "ms_pass_fail_decision") || undefined,
      acceptance_criteria: readValue(row, "ms_acceptance_criteria") || undefined,
      analyst_name: readValue(row, "ms_analyst_name") || undefined,
      reviewer_name: readValue(row, "ms_reviewer_name") || undefined,
      notes: readValue(row, "ms_notes") || undefined,
      watermark_mode: readValue(row, "ms_watermark_mode") || undefined,
    });

    if (Object.keys(msPayload).length > 0) {
      const { error } = await supabase
        .from("ms_reports")
        .update(msPayload)
        .eq("id", links.ms_report_id);
      if (error) throw error;
    }
  }

  if (links.sds_id) {
    const sdsPayload = compactObject({
      document_number: readValue(row, "sds_document_number") || undefined,
      revision: readOptionalInteger(row, "sds_revision"),
      issue_date: readValue(row, "sds_issue_date") || undefined,
      revision_date: readValue(row, "sds_revision_date") || undefined,
      status: readValue(row, "sds_status") || undefined,
      language: readValue(row, "sds_language") || undefined,
      jurisdiction: readValue(row, "sds_jurisdiction") || undefined,
      signal_word: readValue(row, "sds_signal_word") || undefined,
      prepared_by: readValue(row, "sds_prepared_by") || undefined,
      reviewed_by: readValue(row, "sds_reviewed_by") || undefined,
      approved_by: readValue(row, "sds_approved_by") || undefined,
      section_1_identification: readValue(row, "sds_section_1_identification") || undefined,
      section_2_hazard_identification: readValue(row, "sds_section_2_hazard_identification") || undefined,
      section_3_composition: readValue(row, "sds_section_3_composition") || undefined,
      section_4_first_aid: readValue(row, "sds_section_4_first_aid") || undefined,
      section_5_fire_fighting: readValue(row, "sds_section_5_fire_fighting") || undefined,
      section_6_accidental_release: readValue(row, "sds_section_6_accidental_release") || undefined,
      section_7_handling_storage: readValue(row, "sds_section_7_handling_storage") || undefined,
      section_8_exposure_controls: readValue(row, "sds_section_8_exposure_controls") || undefined,
      section_9_physical_chemical: readValue(row, "sds_section_9_physical_chemical") || undefined,
      section_10_stability_reactivity: readValue(row, "sds_section_10_stability_reactivity") || undefined,
      section_11_toxicological: readValue(row, "sds_section_11_toxicological") || undefined,
      section_12_ecological: readValue(row, "sds_section_12_ecological") || undefined,
      section_13_disposal: readValue(row, "sds_section_13_disposal") || undefined,
      section_14_transport: readValue(row, "sds_section_14_transport") || undefined,
      section_15_regulatory: readValue(row, "sds_section_15_regulatory") || undefined,
      section_16_other: readValue(row, "sds_section_16_other") || undefined,
    });

    if (Object.keys(sdsPayload).length > 0) {
      const { error } = await supabase
        .from("sds_documents")
        .update(sdsPayload)
        .eq("id", links.sds_id);
      if (error) throw error;
    }
  }

  if (links.document_bundle_id) {
    const bundlePayload = compactObject({
      bundle_number: readValue(row, "bundle_number") || undefined,
      status: readValue(row, "bundle_status") || undefined,
    });

    if (Object.keys(bundlePayload).length > 0) {
      const { error } = await supabase
        .from("document_bundles")
        .update(bundlePayload)
        .eq("id", links.document_bundle_id);
      if (error) throw error;
    }
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
        : "Supporting documents will not be generated automatically unless the CSV contains hplc_, ms_, sds_, or bundle_ detail columns.",
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

            if (updatedRow) {
              await syncImportedQualityLinks(supabase, updatedRow.id, row.raw);
              const shouldGenerateDocs = autoGenerateDocs || hasSupportingDocumentDetails(row.raw);
              if (shouldGenerateDocs) {
                await updateImportedSupportingDocuments(
                  supabase,
                  updatedRow.id,
                  row.raw,
                  updateValues.approved_by || updateValues.reviewed_by || updateValues.created_by || adminEmail,
                );
                nextResult.generatedBundles += autoGenerateDocs ? 1 : 0;
              }
            }
            continue;
          }

          const createdRow = await createCoaVerificationRecord(supabase, row.values);
          if (!createdRow) {
            throw new Error("Created row was not returned by Supabase.");
          }
          nextResult.created += 1;

          await syncImportedQualityLinks(supabase, createdRow.id, row.raw);
          if (autoGenerateDocs || hasSupportingDocumentDetails(row.raw)) {
            await updateImportedSupportingDocuments(
              supabase,
              createdRow.id,
              row.raw,
              row.values.approved_by || row.values.reviewed_by || row.values.created_by || adminEmail,
            );
            nextResult.generatedBundles += autoGenerateDocs ? 1 : 0;
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
                Save your spreadsheet as CSV. Required fields are product_name, catalog_code, and batch_lot_no. Optional hplc_, ms_, sds_, and bundle_ columns are imported into linked supporting documents.
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
