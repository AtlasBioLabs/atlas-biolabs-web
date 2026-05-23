import type { SupabaseClient } from "@supabase/supabase-js";

import { products } from "@/lib/site-content";
import type { CoaVerificationRow } from "@/lib/coa-verification";
import { generateSupportingDocuments } from "@/lib/quality-document-generator";

function normalize(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function parseRevisionNumber(value: string | null | undefined) {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 1;
}

function mapReleaseDecision(
  value: string | null | undefined
): "pending" | "released" | "rejected" | "conditional" {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized.includes("released with deviation")) {
    return "conditional";
  }

  if (normalized.includes("released")) {
    return "released";
  }

  if (normalized.includes("rejected") || normalized.includes("non-conforming")) {
    return "rejected";
  }

  return "pending";
}

function mapBatchStatus(
  row: CoaVerificationRow
): "draft" | "under_review" | "released" | "rejected" | "void" {
  const status = String(row.verification_status ?? "").toLowerCase();
  const decision = String(row.release_decision ?? "").toLowerCase();

  if (status.includes("revoked") || status.includes("expired")) {
    return "void";
  }

  if (decision.includes("rejected") || decision.includes("non-conforming")) {
    return "rejected";
  }

  if (status.includes("released") || decision.includes("released")) {
    return "released";
  }

  if (status.includes("draft")) {
    return "draft";
  }

  return "under_review";
}

function mapCoaDocumentStatus(
  row: CoaVerificationRow
):
  | "draft"
  | "under_review"
  | "correction_required"
  | "approved"
  | "released"
  | "superseded"
  | "void" {
  const status = String(row.verification_status ?? "").toLowerCase();
  const decision = String(row.release_decision ?? "").toLowerCase();

  if (status.includes("revoked") || status.includes("expired")) {
    return "void";
  }

  if (status.includes("superseded")) {
    return "superseded";
  }

  if (decision.includes("rejected") || decision.includes("non-conforming")) {
    return "correction_required";
  }

  if (status.includes("released") || decision.includes("released")) {
    return "released";
  }

  if (status.includes("draft")) {
    return "draft";
  }

  return "under_review";
}

function findProductForCoa(row: CoaVerificationRow) {
  const catalogCode = normalize(row.catalog_code);
  const productName = normalize(row.product_name);

  return (
    products.find((product) => normalize(product.catalogCode) === catalogCode) ||
    products.find((product) => normalize(product.sku) === catalogCode) ||
    products.find((product) => normalize(product.name) === productName) ||
    products.find((product) => productName.includes(normalize(product.name))) ||
    null
  );
}

function getDocumentNumber(document: unknown) {
  const record = document as {
    document_number?: string | null;
    documentNumber?: string | null;
  };

  return record.document_number || record.documentNumber || "";
}

export type GenerateSupportingDocumentsFromCoaResult = {
  coaVerificationId: string;
  batchId: string;
  coaDocumentId: string;
  hplcReportId: string;
  msReportId: string;
  sdsId: string;
  bundleId: string;
};

export async function generateSupportingDocumentsFromCoaVerification(
  supabase: SupabaseClient,
  coaVerificationId: string,
  generatedBy = "Atlas Labs QA Documentation Officer"
): Promise<GenerateSupportingDocumentsFromCoaResult> {
  const { data: row, error: rowError } = await supabase
    .from("coa_verifications")
    .select("*")
    .eq("id", coaVerificationId)
    .single();

  if (rowError || !row) {
    throw new Error(
      rowError?.message || "COA verification record could not be found."
    );
  }

  const coaRow = row as CoaVerificationRow & {
    quality_batch_id?: string | null;
    quality_coa_document_id?: string | null;
    document_bundle_id?: string | null;
    hplc_report_id?: string | null;
    ms_report_id?: string | null;
    sds_id?: string | null;
  };

  if (
    coaRow.document_bundle_id &&
    coaRow.quality_batch_id &&
    coaRow.quality_coa_document_id &&
    coaRow.hplc_report_id &&
    coaRow.ms_report_id &&
    coaRow.sds_id
  ) {
    return {
      coaVerificationId,
      batchId: coaRow.quality_batch_id,
      coaDocumentId: coaRow.quality_coa_document_id,
      hplcReportId: coaRow.hplc_report_id,
      msReportId: coaRow.ms_report_id,
      sdsId: coaRow.sds_id,
      bundleId: coaRow.document_bundle_id,
    };
  }

  const product = findProductForCoa(coaRow);

  if (!product) {
    await supabase
      .from("coa_verifications")
      .update({
        supporting_documents_status: "failed",
        supporting_documents_error: `No matching product found for catalog code "${coaRow.catalog_code}" and product "${coaRow.product_name}".`,
      })
      .eq("id", coaVerificationId);

    throw new Error(
      `No matching product found for catalog code "${coaRow.catalog_code}" and product "${coaRow.product_name}".`
    );
  }

  await supabase
    .from("coa_verifications")
    .update({
      supporting_documents_status: "generating",
      supporting_documents_error: null,
    })
    .eq("id", coaVerificationId);

  try {
    const now = todayIsoDate();

    const { data: existingBatch, error: existingBatchError } = await supabase
      .from("batches")
      .select("*")
      .eq("product_id", product.slug)
      .eq("batch_number", coaRow.batch_lot_no)
      .maybeSingle();

    if (existingBatchError) {
      throw existingBatchError;
    }

    let batch = existingBatch;

    if (!batch) {
      const { data: createdBatch, error: batchError } = await supabase
        .from("batches")
        .insert({
          product_id: product.slug,
          batch_number: coaRow.batch_lot_no,
          lot_number: coaRow.batch_lot_no,
          manufacturing_date: coaRow.manufacture_date || coaRow.issue_date || now,
          expiry_date:
            coaRow.retest_expiry_date ||
            coaRow.retest_period ||
            coaRow.issue_date ||
            now,
          retest_date: coaRow.retest_expiry_date || coaRow.retest_period || null,
          country_of_origin: coaRow.country_of_origin || "China",
          supplier_name: null,
          manufacturer_name: coaRow.manufacturing_site || null,
          status: mapBatchStatus(coaRow),
          release_decision: mapReleaseDecision(coaRow.release_decision),
          created_by: generatedBy,
          reviewed_by: coaRow.reviewed_by || null,
          approved_by: coaRow.approved_by || null,
          notes: `Created from COA verification record ${coaRow.coa_number}`,
        })
        .select("*")
        .single();

      if (batchError) {
        throw batchError;
      }

      batch = createdBatch;
    }

    const { data: existingCoaDocument, error: existingCoaDocumentError } =
      await supabase
        .from("coa_documents")
        .select("*")
        .eq("coa_number", coaRow.coa_number)
        .maybeSingle();

    if (existingCoaDocumentError) {
      throw existingCoaDocumentError;
    }

    let coaDocument = existingCoaDocument;

    if (!coaDocument) {
      const { data: createdCoaDocument, error: coaError } = await supabase
        .from("coa_documents")
        .insert({
          product_id: product.slug,
          batch_id: batch.id,
          coa_number: coaRow.coa_number,
          issue_date: coaRow.issue_date || now,
          revision: parseRevisionNumber(coaRow.revision),
          document_status: mapCoaDocumentStatus(coaRow),
          document_type: "Certificate of Analysis",
          client_recipient: coaRow.client_recipient || null,
          prepared_by: coaRow.created_by || generatedBy,
          reviewed_by: coaRow.reviewed_by || null,
          approved_by: coaRow.approved_by || null,
          release_decision: mapReleaseDecision(coaRow.release_decision),
          verification_code: coaRow.verification_code,
          verification_url: coaRow.verification_url || null,
          qr_code_value: coaRow.qr_code_url || coaRow.verification_url || null,
          hplc_report_id: null,
          ms_report_id: null,
          sds_id: null,
          notes: `Generated from COA verification record ${coaVerificationId}`,
          watermark_mode:
            mapCoaDocumentStatus(coaRow) === "released" ? "none" : "draft",
        })
        .select("*")
        .single();

      if (coaError) {
        throw coaError;
      }

      coaDocument = createdCoaDocument;
    }

    const result = await generateSupportingDocuments(
      supabase,
      product,
      batch,
      coaDocument,
      generatedBy
    );

    await supabase
      .from("coa_verifications")
      .update({
        quality_batch_id: batch.id,
        quality_coa_document_id: coaDocument.id,
        document_bundle_id: result.bundle.id,
        hplc_report_id: result.hplc.id,
        ms_report_id: result.ms.id,
        sds_id: result.sds.id,
        supporting_documents_status: "generated",
        supporting_documents_generated_at: new Date().toISOString(),
        supporting_documents_generated_by: generatedBy,
        supporting_documents_error: null,
        document_pack: "COA, HPLC, MS/LC-MS, SDS",
        hplc_file_name: getDocumentNumber(result.hplc),
        lcms_file_name: getDocumentNumber(result.ms),
        sds_file_name: getDocumentNumber(result.sds),
      })
      .eq("id", coaVerificationId);

    return {
      coaVerificationId,
      batchId: batch.id,
      coaDocumentId: coaDocument.id,
      hplcReportId: result.hplc.id,
      msReportId: result.ms.id,
      sdsId: result.sds.id,
      bundleId: result.bundle.id,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Supporting documents could not be generated.";

    await supabase
      .from("coa_verifications")
      .update({
        supporting_documents_status: "failed",
        supporting_documents_error: message,
      })
      .eq("id", coaVerificationId);

    throw error;
  }
}