import type { SupabaseClient } from "@supabase/supabase-js";

import { products, type Product } from "@/lib/site-content";
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

function isUsefulMatchValue(value: string) {
  return value.length >= 5;
}

function compactProductAlias(value: string | null | undefined) {
  return normalize(value)
    .replace(/^atl/, "")
    .replace(/withdac/g, "")
    .replace(/withoutdac/g, "")
    .replace(/acetate/g, "")
    .replace(/hydrochloride/g, "")
    .replace(/hcl/g, "")
    .replace(/peptide/g, "")
    .replace(/fragment/g, "");
}

function productMatchValues(product: (typeof products)[number]) {
  return Array.from(
    new Set(
      [
        normalize(product.catalogCode),
        normalize(product.sku),
        normalize(product.name),
        compactProductAlias(product.catalogCode),
        compactProductAlias(product.sku),
        compactProductAlias(product.name),
        ...product.name
          .split(/[(/,]/)
          .map((part) => compactProductAlias(part)),
      ].filter(isUsefulMatchValue)
    )
  );
}

function createFallbackProductFromCoa(row: CoaVerificationRow): Product {
  const fallbackSlug =
    normalize(row.catalog_code) || normalize(row.product_name) || "coa-product";
  const displayName = row.product_name || row.catalog_code || "COA Product";
  const catalogCode = row.catalog_code || `ATL-${fallbackSlug.toUpperCase()}`;

  return {
    slug: fallbackSlug,
    name: displayName,
    sku: catalogCode,
    catalogCode,
    category: "growth-repair-peptides",
    categorySlug: "growth-repair-peptides",
    status: "Standard",
    image: `/products/${fallbackSlug}.svg`,
    imageAlt: `${displayName} documentation product image for Atlas BioLabs`,
    shortDescription: `${displayName} documentation record generated from an Atlas BioLabs COA verification record.`,
    summary: "White to off-white lyophilized powder or product-specific physical form to be confirmed.",
    overview: `${displayName} supporting documentation generated from COA record ${row.coa_number}.`,
    longDescription: `${displayName} supporting documentation generated from COA record ${row.coa_number}.`,
    seoTitle: `${displayName} Documentation | Atlas BioLabs`,
    metaDescription: `${displayName} documentation support record generated from Atlas BioLabs COA data.`,
    canonicalUrl: "",
    functionalRole: [],
    mechanismInsight: "Product-specific context is maintained in the source COA record.",
    commonApplications: [],
    keyCharacteristics: [],
    associatedUses: [],
    packSizes: ["Batch-specific documentation"],
    moq: 1,
    startingPrice: 0,
    priceFrom: 0,
    priceCurrency: "USD",
    priceRangeText: "Quote-based",
    priceRange: "Quote-based",
    availability: "Documentation record",
    documentation: "COA, HPLC, MS / LC-MS, and SDS support documents",
    purityDocumentation: [],
    contentBenefits: [],
    storageHandling: ["Use product-specific storage conditions from the COA or SDS."],
    leadTime: "Documentation generated from COA record",
    relatedProductSlugs: [],
    relatedArticleSlugs: [],
    complianceNote:
      "Atlas BioLabs documentation is provided for qualified commercial sourcing, research, formulation, and documentation review contexts only. No medical, dosing, diagnostic, therapeutic, veterinary, or human-use claims are made.",
    intendedBuyerType: ["Qualified B2B buyers"],
    trustSupport: ["Batch-level documentation", "COA-linked supporting records"],
  };
}

function findProductForCoa(row: CoaVerificationRow): Product {
  const coaValues = Array.from(
    new Set(
      [
        normalize(row.catalog_code),
        normalize(row.product_name),
        compactProductAlias(row.catalog_code),
        compactProductAlias(row.product_name),
      ].filter(isUsefulMatchValue)
    )
  );

  const exactMatch = products.find((product) => {
    const candidates = productMatchValues(product);
    return coaValues.some((value) => candidates.includes(value));
  });

  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = products.find((product) => {
    const candidates = productMatchValues(product);
    return coaValues.some((value) =>
      candidates.some(
        (candidate) =>
          candidate.length >= 5 &&
          value.length >= 5 &&
          (candidate.includes(value) || value.includes(candidate))
      )
    );
  });

  if (partialMatch) {
    return partialMatch;
  }

  // Do not block supporting-document generation just because the product is
  // not currently in the public website catalog. COA records can exist for
  // private/custom items such as Sermorelin. Build a safe fallback Product
  // object from the COA fields so HPLC, MS, SDS, and bundles can still be
  // generated and prefilled from the COA.
  return createFallbackProductFromCoa(row);
}

function getDocumentNumber(document: unknown) {
  const record = document as {
    document_number?: string | null;
    documentNumber?: string | null;
  };

  return record.document_number || record.documentNumber || "";
}


function parsePercent(value: string | null | undefined) {
  const match = String(value ?? "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number.parseFloat(match[1]) : null;
}

function generatedAvailability(status: string | null | undefined) {
  const normalized = String(status ?? "").toLowerCase();

  if (normalized.includes("released")) {
    return "Released / available for review";
  }

  if (normalized.includes("approved")) {
    return "Approved / available for review";
  }

  if (normalized.includes("active")) {
    return "Active / available for review";
  }

  return "Draft generated / available for review";
}

function isMissingOptionalAnalyticalRecordsTable(error: { message?: string } | null) {
  return Boolean(
    error?.message &&
      /Could not find the table|relation .* does not exist|PGRST205|column .* does not exist/i.test(
        error.message
      )
  );
}

async function updateGeneratedAnalyticalReferences(
  supabase: SupabaseClient,
  coaVerificationId: string,
  references: {
    hplcDocumentNumber: string;
    msDocumentNumber: string;
    sdsDocumentNumber: string;
    hplcStatus?: string | null;
    msStatus?: string | null;
    sdsStatus?: string | null;
    rawDataArchiveRef?: string | null;
  }
) {
  const rows = [
    {
      coa_verification_id: coaVerificationId,
      row_key: "hplc_chromatogram",
      position: 1,
      record_type: "HPLC chromatogram",
      reference_file_name: references.hplcDocumentNumber || null,
      availability: references.hplcDocumentNumber
        ? generatedAvailability(references.hplcStatus)
        : "Pending upload",
    },
    {
      coa_verification_id: coaVerificationId,
      row_key: "lcms_identity_report",
      position: 2,
      record_type: "LC-MS identity report",
      reference_file_name: references.msDocumentNumber || null,
      availability: references.msDocumentNumber
        ? generatedAvailability(references.msStatus)
        : "Pending upload",
    },
    {
      coa_verification_id: coaVerificationId,
      row_key: "sds_safety_data_sheet",
      position: 3,
      record_type: "SDS / Safety Data Sheet",
      reference_file_name: references.sdsDocumentNumber || null,
      availability: references.sdsDocumentNumber
        ? generatedAvailability(references.sdsStatus)
        : "On request",
    },
    {
      coa_verification_id: coaVerificationId,
      row_key: "raw_data_archive",
      position: 4,
      record_type: "Raw data archive",
      reference_file_name: references.rawDataArchiveRef || "Internal QA record folder",
      availability: "Controlled access",
    },
  ];

  // Avoid relying on an ON CONFLICT constraint that may not exist yet in the
  // customer's database. Update existing fixed rows first, then insert only
  // missing rows.
  for (const row of rows) {
    const { data: updatedRow, error: updateError } = await supabase
      .from("coa_analytical_records")
      .update({
        position: row.position,
        record_type: row.record_type,
        reference_file_name: row.reference_file_name,
        availability: row.availability,
      })
      .eq("coa_verification_id", coaVerificationId)
      .eq("row_key", row.row_key)
      .select("id")
      .maybeSingle();

    if (isMissingOptionalAnalyticalRecordsTable(updateError)) {
      return;
    }

    if (updateError) {
      throw updateError;
    }

    if (!updatedRow) {
      const { error: insertError } = await supabase
        .from("coa_analytical_records")
        .insert(row);

      if (isMissingOptionalAnalyticalRecordsTable(insertError)) {
        return;
      }

      if (insertError) {
        throw insertError;
      }
    }
  }
}

async function prefillGeneratedReportSummaries(
  supabase: SupabaseClient,
  coaRow: CoaVerificationRow,
  hplcReportId: string,
  msReportId: string
) {
  const purityPercent =
    parsePercent(coaRow.purity_result) ?? parsePercent(coaRow.hplc_purity);

  if (purityPercent !== null) {
    await supabase
      .from("hplc_reports")
      .update({
        purity_percent: purityPercent,
        result_summary:
          coaRow.purity_result ||
          coaRow.hplc_purity ||
          `Draft HPLC purity report generated from COA ${coaRow.coa_number}`,
      })
      .eq("id", hplcReportId);
  } else {
    await supabase
      .from("hplc_reports")
      .update({
        result_summary:
          coaRow.purity_result ||
          coaRow.hplc_purity ||
          `Draft HPLC purity report generated from COA ${coaRow.coa_number}`,
      })
      .eq("id", hplcReportId);
  }

  await supabase
    .from("ms_reports")
    .update({
      identity_conclusion:
        coaRow.identity_result ||
        `Draft LC-MS identity report generated from COA ${coaRow.coa_number}`,
    })
    .eq("id", msReportId);
}

export type GenerateSupportingDocumentsFromCoaResult = {
  coaVerificationId: string;
  batchId: string;
  coaDocumentId: string;
  hplcReportId: string;
  msReportId: string;
  sdsId: string;
  bundleId: string;
  hplcDocumentNumber: string;
  msDocumentNumber: string;
  sdsDocumentNumber: string;
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
      hplcDocumentNumber: coaRow.hplc_file_name ?? "",
      msDocumentNumber: coaRow.lcms_file_name ?? "",
      sdsDocumentNumber: coaRow.sds_file_name ?? "",
    };
  }

  const product = findProductForCoa(coaRow);

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

    const hplcDocumentNumber = getDocumentNumber(result.hplc);
    const msDocumentNumber = getDocumentNumber(result.ms);
    const sdsDocumentNumber = getDocumentNumber(result.sds);

    await prefillGeneratedReportSummaries(
      supabase,
      coaRow,
      result.hplc.id,
      result.ms.id
    );

    await updateGeneratedAnalyticalReferences(supabase, coaVerificationId, {
      hplcDocumentNumber,
      msDocumentNumber,
      sdsDocumentNumber,
      hplcStatus: (result.hplc as { status?: string | null }).status,
      msStatus: (result.ms as { status?: string | null }).status,
      sdsStatus: (result.sds as { status?: string | null }).status,
      rawDataArchiveRef: coaRow.raw_data_archive_ref,
    });

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
        hplc_file_name: hplcDocumentNumber,
        lcms_file_name: msDocumentNumber,
        sds_file_name: sdsDocumentNumber,
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
      hplcDocumentNumber,
      msDocumentNumber,
      sdsDocumentNumber,
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