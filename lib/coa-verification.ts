import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase";

export type CoaVerificationStatus =
  | "Draft"
  | "Pending QA Review"
  | "Released / Verified"
  | "Superseded"
  | "Revoked"
  | "Expired"
  | "Rejected / Non-Conforming";

export type CoaReleaseDecision =
  | "Pending QA Review"
  | "Released / Conforms"
  | "Released with Deviation"
  | "Rejected / Non-Conforming"
  | "Not Applicable";

export type CoaVerificationRecord = {
  verificationCode: string;
  coaNumber: string;
  verificationUrl: string | null;
  productName: string;
  catalogCode: string;
  batchLotNo: string;
  issueDate: string;
  revision: string;
  clientRecipient: string;
  identityResult: string;
  hplcPurity: string;
  waterContent: string;
  releaseDecision: CoaReleaseDecision;
  verificationStatus: CoaVerificationStatus;
  documentPack: string;
  verificationMessage: string;
  appearanceResult: string | null;
  purityResult: string | null;
  peptideContentResult: string | null;
  counterIonResult: string | null;
  residualSolventsResult: string | null;
  heavyMetalsResult: string | null;
  microbialLimitsResult: string | null;
  endotoxinSterilityResult: string | null;
  hplcFileName: string | null;
  lcmsFileName: string | null;
  sdsFileName: string | null;
  rawDataArchiveRef: string | null;
  coaPdfUrl: string | null;
  qrCodeUrl: string | null;
  createdBy: string | null;
  reviewedBy: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CoaVerificationRow = {
  id: string;
  coa_number: string;
  verification_code: string;
  verification_url: string | null;
  product_name: string;
  catalog_code: string;
  batch_lot_no: string;
  issue_date: string;
  revision: string;
  client_recipient: string;
  identity_result: string;
  hplc_purity: string;
  water_content: string;
  release_decision: CoaReleaseDecision;
  verification_status: CoaVerificationStatus;
  document_pack: string;
  verification_message: string;
  appearance_result: string | null;
  purity_result: string | null;
  peptide_content_result: string | null;
  counter_ion_result: string | null;
  residual_solvents_result: string | null;
  heavy_metals_result: string | null;
  microbial_limits_result: string | null;
  endotoxin_sterility_result: string | null;
  hplc_file_name: string | null;
  lcms_file_name: string | null;
  sds_file_name: string | null;
  raw_data_archive_ref: string | null;
  coa_pdf_url: string | null;
  qr_code_url: string | null;
  created_by: string | null;
  reviewed_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const mockCoaVerificationRows: CoaVerificationRow[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    verification_url: "https://atlasbiolabs.co/verify/ATL-BPC157-2026-001-X9K4P2",
    verification_code: "ATL-BPC157-2026-001-X9K4P2",
    coa_number: "COA-ATL-BPC157-2026-001",
    product_name: "BPC-157 Acetate",
    catalog_code: "ATL-BPC157",
    batch_lot_no: "ABLL-BPC157-2026-001",
    issue_date: "20 May 2026",
    revision: "Rev. 01",
    client_recipient: "MagLab / Qualified B2B Buyer",
    identity_result: "LC-MS/MS: Conforms",
    hplc_purity: "99.21%",
    water_content: "1.6%",
    release_decision: "Released / Conforms",
    verification_status: "Released / Verified",
    document_pack: "COA, HPLC, MS/LC-MS, SDS",
    verification_message:
      "This COA matches Atlas Labs batch records and has been released by QA.",
    appearance_result: "White lyophilized powder: Conforms",
    purity_result: "HPLC purity conforms to release specification",
    peptide_content_result: "Peptide content conforms",
    counter_ion_result: "Acetate counter ion detected: Conforms",
    residual_solvents_result: "Residual solvents: Conforms",
    heavy_metals_result: "Heavy metals: Conforms",
    microbial_limits_result: "Microbial limits: Conforms",
    endotoxin_sterility_result: "Not applicable for this document pack",
    hplc_file_name: "COA-ATL-BPC157-2026-001-HPLC.pdf",
    lcms_file_name: "COA-ATL-BPC157-2026-001-LCMS.pdf",
    sds_file_name: "ATL-BPC157-SDS.pdf",
    raw_data_archive_ref: "ATL-ARCHIVE-BPC157-2026-001",
    coa_pdf_url: null,
    qr_code_url: null,
    created_by: "atlas.qc.mock",
    reviewed_by: "atlas.qa.mock",
    approved_by: "atlas.qa.lead.mock",
    approved_at: "2026-05-20T11:45:00Z",
    created_at: "2026-05-20T09:00:00Z",
    updated_at: "2026-05-20T11:45:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    verification_code: "ATL-SEMAGLUTIDE-2026-001-PENDING",
    verification_url:
      "https://atlasbiolabs.co/verify/ATL-SEMAGLUTIDE-2026-001-PENDING",
    coa_number: "COA-ATL-SEMAGLUTIDE-2026-001",
    product_name: "Semaglutide",
    catalog_code: "ATL-SEMAGLUTIDE",
    batch_lot_no: "ABLL-SEMAGLUTIDE-2026-001",
    issue_date: "20 May 2026",
    revision: "Rev. 01",
    client_recipient: "Qualified B2B Buyer",
    identity_result: "Pending LC-MS/MS review",
    hplc_purity: "Pending HPLC report",
    water_content: "Pending KF result",
    release_decision: "Pending QA Review",
    verification_status: "Pending QA Review",
    document_pack: "COA, HPLC, MS/LC-MS, SDS on request",
    verification_message:
      "This COA has not yet been released for customer verification.",
    appearance_result: "Pending appearance review",
    purity_result: "Pending chromatographic review",
    peptide_content_result: "Pending assay review",
    counter_ion_result: "Pending counter ion review",
    residual_solvents_result: "Pending residual solvent review",
    heavy_metals_result: "Pending heavy metals review",
    microbial_limits_result: "Pending microbiology review",
    endotoxin_sterility_result: "Pending release decision",
    hplc_file_name: null,
    lcms_file_name: null,
    sds_file_name: "ATL-SEMAGLUTIDE-SDS.pdf",
    raw_data_archive_ref: "ATL-ARCHIVE-SEMAGLUTIDE-2026-001",
    coa_pdf_url: null,
    qr_code_url: null,
    created_by: "atlas.qc.mock",
    reviewed_by: null,
    approved_by: null,
    approved_at: null,
    created_at: "2026-05-20T10:15:00Z",
    updated_at: "2026-05-20T10:15:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    verification_code: "ATL-REVOKED-TEST-001",
    verification_url: "https://atlasbiolabs.co/verify/ATL-REVOKED-TEST-001",
    coa_number: "COA-ATL-REVOKED-TEST-001",
    product_name: "Verification Test Record",
    catalog_code: "ATL-TEST",
    batch_lot_no: "ABLL-TEST-001",
    issue_date: "20 May 2026",
    revision: "Rev. 01",
    client_recipient: "Internal Test",
    identity_result: "N/A",
    hplc_purity: "N/A",
    water_content: "N/A",
    release_decision: "Rejected / Non-Conforming",
    verification_status: "Revoked",
    document_pack: "N/A",
    verification_message:
      "This COA record has been revoked and should not be accepted.",
    appearance_result: "N/A",
    purity_result: "N/A",
    peptide_content_result: "N/A",
    counter_ion_result: "N/A",
    residual_solvents_result: "N/A",
    heavy_metals_result: "N/A",
    microbial_limits_result: "N/A",
    endotoxin_sterility_result: "N/A",
    hplc_file_name: null,
    lcms_file_name: null,
    sds_file_name: null,
    raw_data_archive_ref: null,
    coa_pdf_url: null,
    qr_code_url: null,
    created_by: "atlas.qc.mock",
    reviewed_by: "atlas.qa.mock",
    approved_by: "atlas.qa.lead.mock",
    approved_at: "2026-05-20T14:10:00Z",
    created_at: "2026-05-20T12:05:00Z",
    updated_at: "2026-05-20T14:10:00Z",
  },
];

function mapRowToRecord(row: CoaVerificationRow): CoaVerificationRecord {
  return {
    verificationCode: row.verification_code,
    coaNumber: row.coa_number,
    verificationUrl: row.verification_url,
    productName: row.product_name,
    catalogCode: row.catalog_code,
    batchLotNo: row.batch_lot_no,
    issueDate: row.issue_date,
    revision: row.revision,
    clientRecipient: row.client_recipient,
    identityResult: row.identity_result,
    hplcPurity: row.hplc_purity,
    waterContent: row.water_content,
    releaseDecision: row.release_decision,
    verificationStatus: row.verification_status,
    documentPack: row.document_pack,
    verificationMessage: row.verification_message,
    appearanceResult: row.appearance_result,
    purityResult: row.purity_result,
    peptideContentResult: row.peptide_content_result,
    counterIonResult: row.counter_ion_result,
    residualSolventsResult: row.residual_solvents_result,
    heavyMetalsResult: row.heavy_metals_result,
    microbialLimitsResult: row.microbial_limits_result,
    endotoxinSterilityResult: row.endotoxin_sterility_result,
    hplcFileName: row.hplc_file_name,
    lcmsFileName: row.lcms_file_name,
    sdsFileName: row.sds_file_name,
    rawDataArchiveRef: row.raw_data_archive_ref,
    coaPdfUrl: row.coa_pdf_url,
    qrCodeUrl: row.qr_code_url,
    createdBy: row.created_by,
    reviewedBy: row.reviewed_by,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getMockCoaVerificationByCode(verificationCode: string) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return null;
  }

  return (
    mockCoaVerificationRows.find(
      (record) => record.verification_code.toUpperCase() === normalizedCode
    ) ?? null
  );
}

export async function getCoaVerificationByCode(verificationCode: string) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return null;
  }

  if (!hasSupabaseEnv()) {
    if (process.env.NODE_ENV !== "production") {
      const mockRecord = getMockCoaVerificationByCode(normalizedCode);
      return mockRecord ? mapRowToRecord(mockRecord) : null;
    }

    return null;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("coa_verifications")
    .select("*")
    .eq("verification_code", normalizedCode)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch COA verification record from Supabase.", error);
    return null;
  }

  const row = data as CoaVerificationRow | null;

  return row ? mapRowToRecord(row) : null;
}
