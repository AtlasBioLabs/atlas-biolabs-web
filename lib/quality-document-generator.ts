/**
 * Document Generation Service
 * Automatically creates supporting documents when COA is generated
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/lib/site-content";
import {
  generateDocumentNumber,
  generateBundleNumber,
  createAuditLog,
} from "@/lib/quality-service";
import type {
  CoaDocument,
  HplcReport,
  MsReport,
  SDS,
  DocumentBundle,
  Batch,
} from "@/lib/quality-types";

/**
 * Creates HPLC report draft from product and batch data
 */
export async function createHplcReportDraft(
  supabase: SupabaseClient,
  product: Product,
  batch: Batch,
  coaDocument: CoaDocument,
  createdBy: string
): Promise<HplcReport> {
  const documentNumber = generateDocumentNumber("HPLC");
  const now = new Date().toISOString().split("T")[0];

  const hplcData = {
  product_id: product.slug,
  batch_id: batch.id,
  coa_id: coaDocument.id,
  document_number: documentNumber,
  issue_date: now,
  revision: 1,
  status: "draft",
  method_name: "HPLC - Purity Determination",
  method_code: "HPLC-001",
  instrument_name: "Analytical HPLC System",
  column_type: "C18 Reverse Phase",
  mobile_phase: "To be determined based on product",
  flow_rate: 1.0,
  detection_wavelength: 215,
  injection_volume: 10,
  run_time: 30,
  sample_concentration: null,
  retention_time: null,
  purity_percent: 0,
  main_peak_area: 0,
  total_peak_area: 0,
  impurities_json: null,
  peak_table_json: null,
  chromatogram_file_url: null,
  raw_data_file_url: null,
  analyst_name: createdBy,
  reviewer_name: null,
  result_summary: "Pending analytical execution",
  pass_fail_decision: "conditional",
  acceptance_criteria: `Purity ≥ 95% for ${product.name}`,
  notes: null,
  watermark_mode: "draft",
};

  const { data, error } = await supabase
    .from("hplc_reports")
    .insert(hplcData)
    .select()
    .single();

  if (error) {
    console.error("Failed to create HPLC report:", error);
    throw error;
  }

  await createAuditLog(
    supabase,
    "hplc_report",
    data.id,
    "created",
    createdBy,
    undefined,
    hplcData,
    "Auto-created with COA"
  );

  return data as HplcReport;
}

/**
 * Creates MS / LC-MS report draft from product and batch data
 */
export async function createMsReportDraft(
  supabase: SupabaseClient,
  product: Product,
  batch: Batch,
  coaDocument: CoaDocument,
  molecularWeight: number,
  createdBy: string
): Promise<MsReport> {
  const documentNumber = generateDocumentNumber("MS");
  const now = new Date().toISOString().split("T")[0];

     const msData = {
        product_id: product.slug,
        batch_id: batch.id,
        coa_id: coaDocument.id,
        document_number: documentNumber,
        issue_date: now,
        revision: 1,
        status: "draft",
        method_name: "LC-MS/MS - Identity Confirmation",
        method_code: "LCMS-001",
        instrument_name: "LC-MS/MS System",
        ionization_mode: "ESI+ or ESI-",
        expected_molecular_weight: molecularWeight,
        observed_mass: 0,
        mass_error: 0,
        mass_error_ppm: null,
        charge_state: null,
        spectrum_file_url: null,
        raw_data_file_url: null,
        identity_conclusion: "Pending mass spectrometry analysis",
        pass_fail_decision: "conditional",
        acceptance_criteria: `Observed mass [M+H]+ or [M-H]- within ±5 ppm of theoretical ${molecularWeight}`,
        analyst_name: createdBy,
        reviewer_name: null,
        notes: null,
        watermark_mode: "draft",
        };

  const { data, error } = await supabase
    .from("ms_reports")
    .insert(msData)
    .select()
    .single();

  if (error) {
    console.error("Failed to create MS report:", error);
    throw error;
  }

  await createAuditLog(
    supabase,
    "ms_report",
    data.id,
    "created",
    createdBy,
    undefined,
    msData,
    "Auto-created with COA"
  );

  return data as MsReport;
}

/**
 * Creates SDS draft from product if no active SDS exists
 */
export async function createSdsDraft(
  supabase: SupabaseClient,
  product: Product,
  createdBy: string
): Promise<SDS> {
  const documentNumber = generateDocumentNumber("SDS");
  const now = new Date().toISOString().split("T")[0];

  const sdsData = {
        product_id: product.slug,
        document_number: documentNumber,
        revision: 1,
        issue_date: now,
        revision_date: now,
        status: "draft",
        language: "en",
        jurisdiction: "US",
        ghs_classification: null,
        signal_word: null,
        pictograms_json: null,
        hazard_statements_json: null,
        precautionary_statements_json: null,
        prepared_by: createdBy,
        reviewed_by: null,
        approved_by: null,
        section_1_identification: `Product: ${product.name}\nCatalog Code: ${product.catalogCode}\nManufacturer: Atlas BioLabs`,
        section_2_hazard_identification:
            "Classification and label information to be determined.",
        section_3_composition: `Active substance: ${product.name}\nPurity: To be specified\nMolecular Weight: To be confirmed`,
        section_4_first_aid:
            "In case of eye contact, rinse with water. In case of inhalation, move to fresh air. Seek professional assistance if irritation persists.",
        section_5_fire_fighting:
            "Use appropriate extinguishing media. No specific fire-fighting measures known.",
        section_6_accidental_release:
            "Avoid dust formation. Sweep up and collect in an appropriate container.",
        section_7_handling_storage:
            `Handle with care. Store in a cool, dry place at the temperature specified on the product label. Keep container tightly closed.\n\nHandling: ${product.storageHandling?.join(", ") || "Store in cool, dry conditions"}`,
        section_8_exposure_controls:
            "Use appropriate personal protective equipment such as lab coat, gloves, and eye protection.",
        section_9_physical_chemical:
            `Physical form: ${product.status || "Solid"}\nAppearance: ${product.summary || "White to off-white solid"}`,
        section_10_stability_reactivity:
            "Stable under normal storage conditions. Avoid heat, light, and moisture.",
        section_11_toxicological:
            "Toxicological data to be provided upon request.",
        section_12_ecological:
            "Ecological data to be provided upon request.",
        section_13_disposal:
            "Dispose of according to applicable local, regional, and national regulations.",
        section_14_transport:
            "Transport in accordance with applicable regulations.",
        section_15_regulatory:
            "Product is intended for qualified commercial, documentation, research, or formulation context only. No medical, dosing, or human-use claims are made.",
        section_16_other:
            "Prepared for Atlas BioLabs documentation support. No medical, dosing, therapeutic, diagnostic, or human-use claims are made.",
        };

  const { data, error } = await supabase
    .from("sds_documents")
    .insert(sdsData)
    .select()
    .single();

  if (error) {
    console.error("Failed to create SDS:", error);
    throw error;
  }

  await createAuditLog(
    supabase,
    "sds",
    data.id,
    "created",
    createdBy,
    undefined,
    sdsData,
    "Auto-created with COA"
  );

  return data as SDS;
}

/**
 * Gets or creates active SDS for product
 */
export async function getOrCreateActiveSds(
  supabase: SupabaseClient,
  product: Product,
  createdBy: string
): Promise<SDS> {
  // Check if active SDS exists
  const { data: existingSds } = await supabase
    .from("sds_documents")
    .select("*")
    .eq("product_id", product.slug)
    .eq("status", "active")
    .single();

  if (existingSds) {
    return existingSds as SDS;
  }

  // Create new SDS draft
  return createSdsDraft(supabase, product, createdBy);
}

/**
 * Creates or updates document bundle linking COA, HPLC, MS, and SDS
 */
export async function createOrUpdateDocumentBundle(
  supabase: SupabaseClient,
  productId: string,
  batchId: string,
  coaId: string,
  hplcReportId?: string,
  msReportId?: string,
  sdsId?: string,
  createdBy?: string
): Promise<DocumentBundle> {
  const bundleNumber = generateBundleNumber();

  // Check if bundle exists for this batch
  const { data: existingBundle } = await supabase
    .from("document_bundles")
    .select("*")
    .eq("batch_id", batchId)
    .eq("coa_id", coaId)
    .single();

  const bundleData = {
    product_id: productId,
    batch_id: batchId,
    coa_id: coaId,
    hplc_report_id: hplcReportId,
    ms_report_id: msReportId,
    sds_id: sdsId,
    bundle_number: existingBundle?.bundle_number || bundleNumber,
    status: determineDocumentBundleStatus(hplcReportId, msReportId, sdsId),
    created_by: createdBy || "system",
  };

  if (existingBundle) {
    const { data, error } = await supabase
      .from("document_bundles")
      .update(bundleData)
      .eq("id", existingBundle.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update document bundle:", error);
      throw error;
    }

    await createAuditLog(
      supabase,
      "document_bundle",
      data.id,
      "updated",
      createdBy || "system",
      { bundle_number: existingBundle.bundle_number },
      bundleData
    );

    return data as DocumentBundle;
  } else {
    const { data, error } = await supabase
      .from("document_bundles")
      .insert(bundleData)
      .select()
      .single();

    if (error) {
      console.error("Failed to create document bundle:", error);
      throw error;
    }

    await createAuditLog(
      supabase,
      "document_bundle",
      data.id,
      "created",
      createdBy || "system",
      undefined,
      bundleData,
      "Auto-created with COA"
    );

    return data as DocumentBundle;
  }
}

/**
 * Determines bundle status based on document statuses
 */
function determineDocumentBundleStatus(
  hplcId?: string,
  msId?: string,
  sdsId?: string
): string {
  // If any supporting doc is missing, mark as incomplete
  if (!hplcId || !msId || !sdsId) {
    return "incomplete";
  }
  return "draft";
}

/**
 * Updates COA with supporting document references
 */
export async function updateCoaWithSupportingDocuments(
  supabase: SupabaseClient,
  coaId: string,
  hplcReportId?: string,
  msReportId?: string,
  sdsId?: string,
  updatedBy?: string
): Promise<CoaDocument> {
  const { data, error } = await supabase
    .from("coa_documents")
    .update({
      hplc_report_id: hplcReportId,
      ms_report_id: msReportId,
      sds_id: sdsId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", coaId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update COA with supporting documents:", error);
    throw error;
  }

  await createAuditLog(
    supabase,
    "coa_document",
    coaId,
    "updated",
    updatedBy || "system",
    undefined,
    {
      hplc_report_id: hplcReportId,
      ms_report_id: msReportId,
      sds_id: sdsId,
    },
    "Linked supporting documents"
  );

  return data as CoaDocument;
}

/**
 * Automatically generates all supporting documents for a COA
 * This is the main entry point for COA document generation workflow
 */
export async function generateSupportingDocuments(
  supabase: SupabaseClient,
  product: Product,
  batch: Batch,
  coaDocument: CoaDocument,
  createdBy: string
): Promise<{
  hplc: HplcReport;
  ms: MsReport;
  sds: SDS;
  bundle: DocumentBundle;
}> {
  // Step 1: Create or get HPLC report
  const hplc = await createHplcReportDraft(
    supabase,
    product,
    batch,
    coaDocument,
    createdBy
  );

  // Step 2: Create or get MS report
  // Extract molecular weight from product - in this case, we'd need to get it from product data
  // For now, use a placeholder that should be filled from product data
  const molecularWeight = parseMolecularWeight(product) || 500;

  const ms = await createMsReportDraft(
    supabase,
    product,
    batch,
    coaDocument,
    molecularWeight,
    createdBy
  );

  // Step 3: Get or create active SDS
  const sds = await getOrCreateActiveSds(supabase, product, createdBy);

  // Step 4: Create document bundle
  const bundle = await createOrUpdateDocumentBundle(
    supabase,
    product.slug,
    batch.id,
    coaDocument.id,
    hplc.id,
    ms.id,
    sds.id,
    createdBy
  );

  // Step 5: Update COA with supporting document references
  await updateCoaWithSupportingDocuments(
    supabase,
    coaDocument.id,
    hplc.id,
    ms.id,
    sds.id,
    createdBy
  );

  return { hplc, ms, sds, bundle };
}

/**
 * Extracts molecular weight from product description
 * Product data may contain molecular weight in various formats
 */
function parseMolecularWeight(product: Product): number | null {
  // Look for molecular weight in product description
  const mwMatch = product.longDescription?.match(/molecular\s+weight[:\s]+(\d+)/i);
  if (mwMatch && mwMatch[1]) {
    return parseInt(mwMatch[1], 10);
  }

  // Try other fields
  const shortDescMatch = product.shortDescription?.match(/MW[:\s]+(\d+)/i);
  if (shortDescMatch && shortDescMatch[1]) {
    return parseInt(shortDescMatch[1], 10);
  }

  return null;
}
