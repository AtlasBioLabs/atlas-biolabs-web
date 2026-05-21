import type { SupabaseClient, User } from "@supabase/supabase-js";

import {
  buildDefaultAnalyticalRecordRows,
  buildDefaultAnalyticalTestRows,
  deriveAnalyticalStatusValue,
  type CoaAnalyticalRecordDraftRow,
  type CoaAnalyticalRecordRowKey,
  type CoaAnalyticalTestDraftRow,
  type CoaAnalyticalTestRowKey,
} from "@/lib/coa-fixed-rows";
export {
  releaseDecisionOptions,
  verificationStatusOptions,
} from "@/lib/coa-select-options";
import type {
  CoaReleaseDecision,
  CoaVerificationRecord,
  CoaVerificationRow,
  CoaVerificationStatus,
} from "@/lib/coa-verification";

export type AdminUserRecord = {
  id: string;
  auth_user_id?: string | null;
  email?: string | null;
  is_active: boolean;
};

export type CoaVerificationFormValues = {
  coa_number: string;
  verification_code: string;
  verification_url: string;
  product_name: string;
  catalog_code: string;
  batch_lot_no: string;
  issue_date: string;
  revision: string;
  client_recipient: string;
  peptide_sequence: string;
  molecular_weight: string;
  molecular_formula: string;
  physical_form: string;
  appearance_spec: string;
  grade_scope: string;
  pack_size: string;
  storage: string;
  retest_period: string;
  manufacture_date: string;
  retest_expiry_date: string;
  batch_quantity: string;
  manufacturing_site: string;
  country_of_origin: string;
  release_site: string;
  packaging: string;
  label_option: string;
  shipping_conditions: string;
  intended_use_scope: string;
  identity_result: string;
  hplc_purity: string;
  water_content: string;
  release_decision: CoaReleaseDecision;
  verification_status: CoaVerificationStatus;
  document_pack: string;
  verification_message: string;
  appearance_result: string;
  purity_result: string;
  peptide_content_result: string;
  counter_ion_result: string;
  residual_solvents_result: string;
  heavy_metals_result: string;
  microbial_limits_result: string;
  endotoxin_sterility_result: string;
  hplc_file_name: string;
  lcms_file_name: string;
  sds_file_name: string;
  raw_data_archive_ref: string;
  coa_pdf_url: string;
  qr_code_url: string;
  created_by: string;
  prepared_at: string;
  reviewed_by: string;
  reviewed_at: string;
  approved_by: string;
  approved_at: string;
};

export type CoaAnalyticalTestResultRow = {
  id: string;
  coa_verification_id: string;
  row_key: CoaAnalyticalTestRowKey;
  position: number;
  test_attribute: string;
  method: string | null;
  specification: string | null;
  batch_result: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CoaAnalyticalRecordRow = {
  id: string;
  coa_verification_id: string;
  row_key: CoaAnalyticalRecordRowKey;
  position: number;
  record_type: string;
  reference_file_name: string | null;
  availability: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CoaVerificationEditorData = {
  row: CoaVerificationRow;
  values: CoaVerificationFormValues;
  analyticalResults: CoaAnalyticalTestDraftRow[];
  analyticalRecords: CoaAnalyticalRecordDraftRow[];
};

export type DuplicateCoaVerificationResult = {
  record: CoaVerificationRow;
  warnings: string[];
};

type CoaVerificationMutationPayload = Omit<
  CoaVerificationRow,
  "id" | "created_at" | "updated_at"
>;

type GenerateCodeInput = {
  supabase: SupabaseClient;
  catalogCode: string;
  year?: number;
};

type SaveCoaRecordOptions = {
  analyticalResults?: CoaAnalyticalTestDraftRow[];
  analyticalRecords?: CoaAnalyticalRecordDraftRow[];
};

const legacyCoaVerificationColumns = new Set([
  "coa_number",
  "verification_code",
  "verification_url",
  "product_name",
  "catalog_code",
  "batch_lot_no",
  "issue_date",
  "revision",
  "client_recipient",
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
]);

let extendedCoaSchemaSupport: boolean | null = null;
let analyticalTestResultsSupport: boolean | null = null;
let analyticalRecordsSupport: boolean | null = null;

export function formatReadableDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getDefaultIntendedUseScope() {
  return "This COA supports qualified B2B sourcing, documentation review, MOQ/bulk supply conversations, and private-label planning. No medical, therapeutic, diagnostic, veterinary, or human-use claims are made. Final release documentation must match the tested batch and analytical records referenced in this document.";
}

export function getDefaultCoaFormValues(): CoaVerificationFormValues {
  return {
    coa_number: "",
    verification_code: "",
    verification_url: "",
    product_name: "",
    catalog_code: "",
    batch_lot_no: "",
    issue_date: formatReadableDate(new Date()),
    revision: "Rev. 01",
    client_recipient: "Qualified B2B Buyer",
    peptide_sequence: "",
    molecular_weight: "",
    molecular_formula: "",
    physical_form: "Lyophilized powder",
    appearance_spec: "White to off-white powder",
    grade_scope: "Qualified B2B sourcing review",
    pack_size: "",
    storage: "",
    retest_period: "",
    manufacture_date: "",
    retest_expiry_date: "",
    batch_quantity: "",
    manufacturing_site: "",
    country_of_origin: "China",
    release_site: "",
    packaging: "",
    label_option: "",
    shipping_conditions: "",
    intended_use_scope: getDefaultIntendedUseScope(),
    identity_result: "Pending LC-MS/MS review",
    hplc_purity: "Pending HPLC report",
    water_content: "Pending KF result",
    release_decision: "Pending QA Review",
    verification_status: "Pending QA Review",
    document_pack: "COA, HPLC, MS/LC-MS, SDS on request",
    verification_message:
      "This COA has not yet been released for customer verification.",
    appearance_result: "Pending QA check",
    purity_result: "Pending purity report",
    peptide_content_result: "Pending batch calculation",
    counter_ion_result: "To be confirmed",
    residual_solvents_result: "Pending GC report",
    heavy_metals_result: "Pending ICP-MS report",
    microbial_limits_result: "Not included unless ordered",
    endotoxin_sterility_result: "Not included unless ordered",
    hplc_file_name: "",
    lcms_file_name: "",
    sds_file_name: "",
    raw_data_archive_ref: "Internal QA record folder",
    coa_pdf_url: "",
    qr_code_url: "",
    created_by: "Atlas Labs QA Documentation Officer",
    prepared_at: formatReadableDate(new Date()),
    reviewed_by: "Quality Assurance Manager",
    reviewed_at: formatReadableDate(new Date()),
    approved_by: "",
    approved_at: "",
  };
}

export function mapRowToFormValues(row: CoaVerificationRow): CoaVerificationFormValues {
  return {
    coa_number: row.coa_number,
    verification_code: row.verification_code,
    verification_url: row.verification_url ?? "",
    product_name: row.product_name,
    catalog_code: row.catalog_code,
    batch_lot_no: row.batch_lot_no,
    issue_date: row.issue_date,
    revision: row.revision,
    client_recipient: row.client_recipient,
    peptide_sequence: row.peptide_sequence ?? "",
    molecular_weight: row.molecular_weight ?? "",
    molecular_formula: row.molecular_formula ?? "",
    physical_form: row.physical_form ?? "",
    appearance_spec: row.appearance_spec ?? "",
    grade_scope: row.grade_scope ?? "",
    pack_size: row.pack_size ?? "",
    storage: row.storage ?? "",
    retest_period: row.retest_period ?? "",
    manufacture_date: row.manufacture_date ?? "",
    retest_expiry_date: row.retest_expiry_date ?? "",
    batch_quantity: row.batch_quantity ?? "",
    manufacturing_site: row.manufacturing_site ?? "",
    country_of_origin: row.country_of_origin ?? "",
    release_site: row.release_site ?? "",
    packaging: row.packaging ?? "",
    label_option: row.label_option ?? "",
    shipping_conditions: row.shipping_conditions ?? "",
    intended_use_scope: row.intended_use_scope ?? getDefaultIntendedUseScope(),
    identity_result: row.identity_result,
    hplc_purity: row.hplc_purity,
    water_content: row.water_content,
    release_decision: row.release_decision,
    verification_status: row.verification_status,
    document_pack: row.document_pack,
    verification_message: row.verification_message,
    appearance_result: row.appearance_result ?? "",
    purity_result: row.purity_result ?? "",
    peptide_content_result: row.peptide_content_result ?? "",
    counter_ion_result: row.counter_ion_result ?? "",
    residual_solvents_result: row.residual_solvents_result ?? "",
    heavy_metals_result: row.heavy_metals_result ?? "",
    microbial_limits_result: row.microbial_limits_result ?? "",
    endotoxin_sterility_result: row.endotoxin_sterility_result ?? "",
    hplc_file_name: row.hplc_file_name ?? "",
    lcms_file_name: row.lcms_file_name ?? "",
    sds_file_name: row.sds_file_name ?? "",
    raw_data_archive_ref: row.raw_data_archive_ref ?? "",
    coa_pdf_url: row.coa_pdf_url ?? "",
    qr_code_url: row.qr_code_url ?? "",
    created_by: row.created_by ?? "",
    prepared_at: row.prepared_at ?? "",
    reviewed_by: row.reviewed_by ?? "",
    reviewed_at: row.reviewed_at ?? "",
    approved_by: row.approved_by ?? "",
    approved_at: row.approved_at ?? "",
  };
}

export function buildVerificationUrl(
  verificationCode: string,
  originFallback?: string | null,
  preferredBaseUrl?: string | null
) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return "";
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    preferredBaseUrl?.trim() ||
    originFallback?.trim() ||
    "";

  if (!siteUrl) {
    return `/verify/${encodeURIComponent(normalizedCode)}`;
  }

  const normalizedBase = siteUrl.replace(/\/$/, "");
  return normalizedBase.endsWith("/verify")
    ? `${normalizedBase}/${encodeURIComponent(normalizedCode)}`
    : `${normalizedBase}/verify/${encodeURIComponent(normalizedCode)}`;
}

export function buildPublicVerificationPath(verificationCode: string) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return "/verify";
  }

  return `/verify/${encodeURIComponent(normalizedCode)}`;
}

export function resolveVerificationUrl({
  verificationCode,
  verificationUrl,
  brandingBaseUrl,
  originFallback,
}: {
  verificationCode: string;
  verificationUrl?: string | null;
  brandingBaseUrl?: string | null;
  originFallback?: string | null;
}) {
  if (verificationUrl && verificationUrl.trim().length > 0) {
    return verificationUrl.trim();
  }

  return buildVerificationUrl(
    verificationCode,
    originFallback,
    brandingBaseUrl
  );
}

export function buildCoaNumberFromVerificationCode(verificationCode: string) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return "";
  }

  const parts = normalizedCode.split("-");
  return parts.length >= 4
    ? `COA-${parts.slice(0, 4).join("-")}`
    : `COA-${normalizedCode}`;
}

function buildDuplicateCoaNumber(
  verificationCode: string,
  sourceCoaNumber?: string | null
) {
  const baseCoaNumber = buildCoaNumberFromVerificationCode(verificationCode);
  const suffix = verificationCode.trim().toUpperCase().split("-").at(-1) ?? "COPY";

  if (sourceCoaNumber?.trim() && sourceCoaNumber.trim() !== baseCoaNumber) {
    return baseCoaNumber;
  }

  return `${baseCoaNumber}-${suffix}`;
}

export function buildDuplicateBatchLotNo(batchLotNo: string) {
  const normalizedBatchLot = batchLotNo.trim();
  return normalizedBatchLot ? `${normalizedBatchLot}-DRAFT` : "";
}

export function getCoaStatusLabel(status: CoaVerificationStatus) {
  switch (status) {
    case "Released / Verified":
      return "RELEASED / VERIFIED";
    case "Pending QA Review":
      return "PENDING QA REVIEW";
    case "Draft":
      return "DRAFT";
    case "Revoked":
      return "REVOKED";
    case "Expired":
      return "EXPIRED";
    case "Rejected / Non-Conforming":
      return "REJECTED / NON-CONFORMING";
    case "Superseded":
      return "SUPERSEDED";
  }
}

export function deriveAnalyticalStatus(value?: string | null) {
  return deriveAnalyticalStatusValue(value);
}

export function syncSummaryFieldsFromAnalyticalTables(
  values: CoaVerificationFormValues,
  analyticalResults: CoaAnalyticalTestDraftRow[],
  analyticalRecords: CoaAnalyticalRecordDraftRow[]
) {
  const nextValues = { ...values };
  const analyticalResultMap = new Map(
    analyticalResults.map((row) => [row.row_key, row])
  );
  const analyticalRecordMap = new Map(
    analyticalRecords.map((row) => [row.row_key, row])
  );
  const getBatchResult = (rowKey: CoaAnalyticalTestDraftRow["row_key"]) =>
    analyticalResultMap.get(rowKey)?.batch_result?.trim() ?? "";
  const getReferenceFileName = (rowKey: CoaAnalyticalRecordDraftRow["row_key"]) =>
    analyticalRecordMap.get(rowKey)?.reference_file_name?.trim() ?? "";

  nextValues.appearance_result = getBatchResult("appearance");
  nextValues.identity_result = getBatchResult("identity");
  nextValues.hplc_purity = getBatchResult("purity");
  nextValues.purity_result = getBatchResult("purity");
  nextValues.peptide_content_result = getBatchResult("peptide_content");
  nextValues.water_content = getBatchResult("water_content");
  nextValues.counter_ion_result = getBatchResult("counter_ion");
  nextValues.residual_solvents_result = getBatchResult("residual_solvents");
  nextValues.heavy_metals_result = getBatchResult("heavy_metals");
  nextValues.microbial_limits_result = getBatchResult("microbial_limits");
  nextValues.endotoxin_sterility_result = getBatchResult("endotoxin_sterility");

  nextValues.hplc_file_name = getReferenceFileName("hplc_chromatogram");
  nextValues.lcms_file_name = getReferenceFileName("lcms_identity_report");
  nextValues.sds_file_name = getReferenceFileName("sds_safety_data_sheet");
  nextValues.raw_data_archive_ref = getReferenceFileName("raw_data_archive");

  return nextValues;
}

export function getCoaAdminWarnings(values: CoaVerificationFormValues) {
  const warnings: string[] = [];
  const releasePendingFields = [
    values.identity_result,
    values.hplc_purity,
    values.water_content,
  ];

  if (
    values.release_decision === "Released / Conforms" &&
    values.verification_status !== "Released / Verified"
  ) {
    warnings.push(
      "Release Decision is set to Released / Conforms, but Verification Status is not Released / Verified."
    );
  }

  if (
    values.verification_status === "Released / Verified" &&
    releasePendingFields.some((value) => value.toLowerCase().includes("pending"))
  ) {
    warnings.push(
      "Released / Verified records should not keep Pending values in Identity Result, HPLC Purity, or Water Content."
    );
  }

  return warnings;
}

export function getCoaPrintWarnings(
  record: Pick<
    CoaVerificationRecord,
    | "verificationStatus"
    | "identityResult"
    | "hplcPurity"
    | "waterContent"
    | "appearanceResult"
    | "purityResult"
    | "peptideContentResult"
    | "residualSolventsResult"
    | "heavyMetalsResult"
  >
) {
  if (record.verificationStatus !== "Released / Verified") {
    return [];
  }

  const valuesToCheck = [
    record.identityResult,
    record.hplcPurity,
    record.waterContent,
    record.appearanceResult,
    record.purityResult,
    record.peptideContentResult,
    record.residualSolventsResult,
    record.heavyMetalsResult,
  ];

  const hasPending = valuesToCheck.some((value) =>
    value?.toLowerCase().includes("pending")
  );

  return hasPending
    ? [
        "This record is marked Released / Verified but still contains pending analytical fields. Review before issuing the COA.",
      ]
    : [];
}

export async function getActiveAdminUser(
  supabase: SupabaseClient,
  user: User
): Promise<AdminUserRecord | null> {
  const authUserIdLookup = await supabase
    .from("admin_users")
    .select("*")
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (!authUserIdLookup.error && authUserIdLookup.data) {
    return authUserIdLookup.data as AdminUserRecord;
  }

  if (!user.email) {
    return null;
  }

  const { data: byEmail } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", user.email)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  return (byEmail as AdminUserRecord | null) ?? null;
}

export async function listCoaVerificationRows(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("coa_verifications")
    .select("*")
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as CoaVerificationRow[];
}

export async function getCoaVerificationRowById(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .from("coa_verifications")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as CoaVerificationRow | null) ?? null;
}

export async function listCoaAnalyticalTestResultRows(
  supabase: SupabaseClient,
  coaVerificationId: string
) {
  if (!(await detectAnalyticalTestResultsSupport(supabase))) {
    return [] as CoaAnalyticalTestResultRow[];
  }

  const { data, error } = await supabase
    .from("coa_analytical_test_results")
    .select("*")
    .eq("coa_verification_id", coaVerificationId)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as CoaAnalyticalTestResultRow[];
}

export async function listCoaAnalyticalRecordRows(
  supabase: SupabaseClient,
  coaVerificationId: string
) {
  if (!(await detectAnalyticalRecordsSupport(supabase))) {
    return [] as CoaAnalyticalRecordRow[];
  }

  const { data, error } = await supabase
    .from("coa_analytical_records")
    .select("*")
    .eq("coa_verification_id", coaVerificationId)
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as CoaAnalyticalRecordRow[];
}

export async function getCoaVerificationEditorData(
  supabase: SupabaseClient,
  id: string
): Promise<CoaVerificationEditorData | null> {
  const row = await getCoaVerificationRowById(supabase, id);

  if (!row) {
    return null;
  }

  const values = mapRowToFormValues(row);
  const analyticalResults = await ensureFixedAnalyticalTestRows(
    supabase,
    id,
    values
  );
  const analyticalRecords = await ensureFixedAnalyticalRecordRows(
    supabase,
    id,
    values
  );

  return {
    row,
    values: syncSummaryFieldsFromAnalyticalTables(
      values,
      analyticalResults,
      analyticalRecords
    ),
    analyticalResults,
    analyticalRecords,
  };
}

export async function createCoaVerificationRecord(
  supabase: SupabaseClient,
  values: CoaVerificationFormValues,
  options: SaveCoaRecordOptions = {}
) {
  const analyticalResults =
    options.analyticalResults ?? buildDefaultAnalyticalTestRows(values);
  const analyticalRecords =
    options.analyticalRecords ?? buildDefaultAnalyticalRecordRows(values);
  const syncedValues = syncSummaryFieldsFromAnalyticalTables(
    values,
    analyticalResults,
    analyticalRecords
  );
  const payload = toMutationPayload(syncedValues);
  const compatiblePayload = await getCompatibleCoaMutationPayload(
    supabase,
    payload
  );
  const { data, error } = await supabase
    .from("coa_verifications")
    .insert(compatiblePayload)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const createdRow = (data as CoaVerificationRow | null) ?? null;

  if (!createdRow) {
    return null;
  }

  await persistFixedAnalyticalRows(
    supabase,
    createdRow.id,
    analyticalResults,
    analyticalRecords
  );

  return createdRow;
}

export async function updateCoaVerificationRecord(
  supabase: SupabaseClient,
  id: string,
  values: CoaVerificationFormValues,
  options: SaveCoaRecordOptions = {}
) {
  const analyticalResults =
    options.analyticalResults ?? buildDefaultAnalyticalTestRows(values);
  const analyticalRecords =
    options.analyticalRecords ?? buildDefaultAnalyticalRecordRows(values);
  const syncedValues = syncSummaryFieldsFromAnalyticalTables(
    values,
    analyticalResults,
    analyticalRecords
  );
  const payload = toMutationPayload(syncedValues);
  const compatiblePayload = await getCompatibleCoaMutationPayload(
    supabase,
    payload
  );
  const { data, error } = await supabase
    .from("coa_verifications")
    .update(compatiblePayload)
    .eq("id", id)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  await persistFixedAnalyticalRows(
    supabase,
    id,
    analyticalResults,
    analyticalRecords
  );

  return (data as CoaVerificationRow | null) ?? null;
}

export async function duplicateCoaVerificationRecord(
  supabase: SupabaseClient,
  id: string
): Promise<DuplicateCoaVerificationResult> {
  const source = await getCoaVerificationEditorData(supabase, id);

  if (!source) {
    throw new Error("The source COA record could not be found.");
  }

  const warnings: string[] = [];
  const testRowsSupported = await detectAnalyticalTestResultsSupport(supabase);
  const recordRowsSupported = await detectAnalyticalRecordsSupport(supabase);
  const childRowsCopied = testRowsSupported || recordRowsSupported;

  if (!testRowsSupported || !recordRowsSupported) {
    warnings.push(
      "The fixed analytical child tables are not fully available yet. The main COA record was duplicated and any missing analytical rows were recreated from defaults."
    );
  }

  const analyticalResults =
    source.analyticalResults.length > 0
      ? source.analyticalResults.map((row) => ({
          ...row,
          status:
            row.batch_result.trim().toLowerCase().includes("pending")
              ? "Pending"
              : row.status,
        }))
      : buildDefaultAnalyticalTestRows(source.values);
  const analyticalRecords =
    source.analyticalRecords.length > 0
      ? source.analyticalRecords.map((row) => ({ ...row }))
      : buildDefaultAnalyticalRecordRows(source.values);

  if (source.analyticalResults.length === 0 || source.analyticalRecords.length === 0) {
    warnings.push(
      "One or more fixed analytical row sets were missing on the source COA and were recreated from defaults during duplication."
    );
  }

  let lastError: unknown = null;
  let generatedVerificationCode = "";
  let generatedCoaNumber = "";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    generatedVerificationCode = await generateVerificationCode({
      supabase,
      catalogCode: source.values.catalog_code,
    });
    generatedCoaNumber = buildDuplicateCoaNumber(
      generatedVerificationCode,
      source.values.coa_number
    );

    const duplicatedValues = syncSummaryFieldsFromAnalyticalTables(
      {
        ...source.values,
        coa_number: generatedCoaNumber,
        verification_code: generatedVerificationCode,
        verification_url: buildVerificationUrl(generatedVerificationCode),
        batch_lot_no: buildDuplicateBatchLotNo(source.values.batch_lot_no),
        verification_status: "Pending QA Review",
        release_decision: "Pending QA Review",
        verification_message:
          "This COA has not yet been released for customer verification.",
        coa_pdf_url: "",
        qr_code_url: "",
        approved_by: "",
        approved_at: "",
      },
      analyticalResults,
      analyticalRecords
    );

    try {
      const createdRecord = await createCoaVerificationRecord(supabase, duplicatedValues, {
        analyticalResults,
        analyticalRecords,
      });

      if (!createdRecord) {
        throw new Error("The duplicated COA record was not returned after creation.");
      }

      return {
        record: createdRecord,
        warnings,
      };
    } catch (error) {
      lastError = error;

      const structuredError =
        typeof error === "object" && error !== null
          ? {
              code: "code" in error ? String(error.code) : undefined,
              message: "message" in error ? String(error.message) : "Unknown error",
              details: "details" in error ? String(error.details) : undefined,
              hint: "hint" in error ? String(error.hint) : undefined,
            }
          : { message: String(error) };

      console.error("COA duplication failed.", {
        sourceCoaId: id,
        generatedCoaNumber,
        generatedVerificationCode,
        supabaseError: structuredError,
        childRowsCopied,
        childRowsSkipped: !childRowsCopied,
      });

      if (attempt === 0 && isUniqueViolationError(error)) {
        continue;
      }

      break;
    }
  }

  if (lastError instanceof Error) {
    throw new Error(lastError.message);
  }

  throw new Error("The COA record could not be duplicated.");
}

export async function generateVerificationCode({
  supabase,
  catalogCode,
  year = new Date().getFullYear(),
}: GenerateCodeInput) {
  void supabase;
  const cleanedCatalog = catalogCode
    .trim()
    .toUpperCase()
    .replace(/^ATL-/, "")
    .replace(/[^A-Z0-9]/g, "");

  if (!cleanedCatalog) {
    throw new Error("Catalog code is required before generating a verification code.");
  }

  return `ATL-${cleanedCatalog}-${year}-001-${createRandomSuffix(6)}`;
}

function createRandomSuffix(length: number) {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * characters.length);
    return characters[index] ?? "X";
  }).join("");
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toMutationPayload(
  values: CoaVerificationFormValues
): CoaVerificationMutationPayload {
  const verificationCode = values.verification_code.trim().toUpperCase();
  const verificationUrl = buildVerificationUrl(
    verificationCode,
    typeof window !== "undefined" ? window.location.origin : null
  );

  return {
    coa_number: values.coa_number.trim(),
    verification_code: verificationCode,
    verification_url: verificationUrl || null,
    product_name: values.product_name.trim(),
    catalog_code: values.catalog_code.trim().toUpperCase(),
    batch_lot_no: values.batch_lot_no.trim(),
    issue_date: values.issue_date.trim(),
    revision: values.revision.trim(),
    client_recipient: values.client_recipient.trim(),
    peptide_sequence: emptyToNull(values.peptide_sequence),
    molecular_weight: emptyToNull(values.molecular_weight),
    molecular_formula: emptyToNull(values.molecular_formula),
    physical_form: emptyToNull(values.physical_form),
    appearance_spec: emptyToNull(values.appearance_spec),
    grade_scope: emptyToNull(values.grade_scope),
    pack_size: emptyToNull(values.pack_size),
    storage: emptyToNull(values.storage),
    retest_period: emptyToNull(values.retest_period),
    manufacture_date: emptyToNull(values.manufacture_date),
    retest_expiry_date: emptyToNull(values.retest_expiry_date),
    batch_quantity: emptyToNull(values.batch_quantity),
    manufacturing_site: emptyToNull(values.manufacturing_site),
    country_of_origin: emptyToNull(values.country_of_origin),
    release_site: emptyToNull(values.release_site),
    packaging: emptyToNull(values.packaging),
    label_option: emptyToNull(values.label_option),
    shipping_conditions: emptyToNull(values.shipping_conditions),
    intended_use_scope: emptyToNull(values.intended_use_scope),
    identity_result: values.identity_result.trim(),
    hplc_purity: values.hplc_purity.trim(),
    water_content: values.water_content.trim(),
    release_decision: values.release_decision,
    verification_status: values.verification_status,
    document_pack: values.document_pack.trim(),
    verification_message: values.verification_message.trim(),
    appearance_result: emptyToNull(values.appearance_result),
    purity_result: emptyToNull(values.purity_result),
    peptide_content_result: emptyToNull(values.peptide_content_result),
    counter_ion_result: emptyToNull(values.counter_ion_result),
    residual_solvents_result: emptyToNull(values.residual_solvents_result),
    heavy_metals_result: emptyToNull(values.heavy_metals_result),
    microbial_limits_result: emptyToNull(values.microbial_limits_result),
    endotoxin_sterility_result: emptyToNull(values.endotoxin_sterility_result),
    hplc_file_name: emptyToNull(values.hplc_file_name),
    lcms_file_name: emptyToNull(values.lcms_file_name),
    sds_file_name: emptyToNull(values.sds_file_name),
    raw_data_archive_ref: emptyToNull(values.raw_data_archive_ref),
    coa_pdf_url: emptyToNull(values.coa_pdf_url),
    qr_code_url: emptyToNull(values.qr_code_url),
    created_by: emptyToNull(values.created_by),
    prepared_at: emptyToNull(values.prepared_at),
    reviewed_by: emptyToNull(values.reviewed_by),
    reviewed_at: emptyToNull(values.reviewed_at),
    approved_by: emptyToNull(values.approved_by),
    approved_at: emptyToNull(values.approved_at),
  };
}

function mergeAnalyticalTestRows(
  values: CoaVerificationFormValues,
  rows: Array<Partial<CoaAnalyticalTestResultRow>>
) {
  const defaultRows = buildDefaultAnalyticalTestRows(values);
  const rowMap = new Map(rows.map((row) => [row.row_key, row]));

  return defaultRows.map((defaultRow) => {
    const existingRow = rowMap.get(defaultRow.row_key);

    return {
      ...defaultRow,
      method: existingRow?.method?.trim() || defaultRow.method,
      specification: existingRow?.specification?.trim() || defaultRow.specification,
      batch_result: existingRow?.batch_result?.trim() || defaultRow.batch_result,
      status: existingRow?.status?.trim() || defaultRow.status,
    };
  });
}

function mergeAnalyticalRecordRows(
  values: CoaVerificationFormValues,
  rows: Array<Partial<CoaAnalyticalRecordRow>>
) {
  const defaultRows = buildDefaultAnalyticalRecordRows(values);
  const rowMap = new Map(rows.map((row) => [row.row_key, row]));

  return defaultRows.map((defaultRow) => {
    const existingRow = rowMap.get(defaultRow.row_key);

    return {
      ...defaultRow,
      reference_file_name:
        existingRow?.reference_file_name?.trim() || defaultRow.reference_file_name,
      availability: existingRow?.availability?.trim() || defaultRow.availability,
    };
  });
}

async function ensureFixedAnalyticalTestRows(
  supabase: SupabaseClient,
  coaVerificationId: string,
  values: CoaVerificationFormValues
) {
  const defaultRows = buildDefaultAnalyticalTestRows(values);

  if (!(await detectAnalyticalTestResultsSupport(supabase))) {
    return defaultRows;
  }

  const existingRows = await listCoaAnalyticalTestResultRows(supabase, coaVerificationId);
  const mergedRows = mergeAnalyticalTestRows(values, existingRows);
  const existingKeys = new Set(existingRows.map((row) => row.row_key));
  const missingRows = mergedRows.filter((row) => !existingKeys.has(row.row_key));

  if (missingRows.length > 0) {
    const { error } = await supabase.from("coa_analytical_test_results").insert(
      missingRows.map((row) => ({
        coa_verification_id: coaVerificationId,
        row_key: row.row_key,
        position: row.position,
        test_attribute: row.test_attribute,
        method: emptyToNull(row.method),
        specification: emptyToNull(row.specification),
        batch_result: emptyToNull(row.batch_result),
        status: emptyToNull(row.status),
      }))
    );

    if (error && !isMissingRelationError(error)) {
      throw error;
    }
  }

  return mergedRows;
}

async function ensureFixedAnalyticalRecordRows(
  supabase: SupabaseClient,
  coaVerificationId: string,
  values: CoaVerificationFormValues
) {
  const defaultRows = buildDefaultAnalyticalRecordRows(values);

  if (!(await detectAnalyticalRecordsSupport(supabase))) {
    return defaultRows;
  }

  const existingRows = await listCoaAnalyticalRecordRows(supabase, coaVerificationId);
  const mergedRows = mergeAnalyticalRecordRows(values, existingRows);
  const existingKeys = new Set(existingRows.map((row) => row.row_key));
  const missingRows = mergedRows.filter((row) => !existingKeys.has(row.row_key));

  if (missingRows.length > 0) {
    const { error } = await supabase.from("coa_analytical_records").insert(
      missingRows.map((row) => ({
        coa_verification_id: coaVerificationId,
        row_key: row.row_key,
        position: row.position,
        record_type: row.record_type,
        reference_file_name: emptyToNull(row.reference_file_name),
        availability: emptyToNull(row.availability),
      }))
    );

    if (error && !isMissingRelationError(error)) {
      throw error;
    }
  }

  return mergedRows;
}

async function persistFixedAnalyticalRows(
  supabase: SupabaseClient,
  coaVerificationId: string,
  analyticalResults: CoaAnalyticalTestDraftRow[],
  analyticalRecords: CoaAnalyticalRecordDraftRow[]
) {
  if (await detectAnalyticalTestResultsSupport(supabase)) {
    const { error } = await supabase.from("coa_analytical_test_results").upsert(
      analyticalResults.map((row) => ({
        coa_verification_id: coaVerificationId,
        row_key: row.row_key,
        position: row.position,
        test_attribute: row.test_attribute,
        method: emptyToNull(row.method),
        specification: emptyToNull(row.specification),
        batch_result: emptyToNull(row.batch_result),
        status: emptyToNull(row.status),
      })),
      {
        onConflict: "coa_verification_id,row_key",
      }
    );

    if (error && !isMissingRelationError(error)) {
      throw error;
    }
  }

  if (await detectAnalyticalRecordsSupport(supabase)) {
    const { error } = await supabase.from("coa_analytical_records").upsert(
      analyticalRecords.map((row) => ({
        coa_verification_id: coaVerificationId,
        row_key: row.row_key,
        position: row.position,
        record_type: row.record_type,
        reference_file_name: emptyToNull(row.reference_file_name),
        availability: emptyToNull(row.availability),
      })),
      {
        onConflict: "coa_verification_id,row_key",
      }
    );

    if (error && !isMissingRelationError(error)) {
      throw error;
    }
  }
}

async function getCompatibleCoaMutationPayload(
  supabase: SupabaseClient,
  payload: CoaVerificationMutationPayload
) {
  const supportsExtendedSchema = await detectExtendedCoaSchemaSupport(supabase);

  if (supportsExtendedSchema) {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => legacyCoaVerificationColumns.has(key))
  ) as Partial<CoaVerificationMutationPayload>;
}

async function detectExtendedCoaSchemaSupport(supabase: SupabaseClient) {
  if (extendedCoaSchemaSupport !== null) {
    return extendedCoaSchemaSupport;
  }

  const { error } = await supabase
    .from("coa_verifications")
    .select("id, peptide_sequence")
    .limit(1);

  if (error && /peptide_sequence/i.test(error.message)) {
    extendedCoaSchemaSupport = false;
    return extendedCoaSchemaSupport;
  }

  extendedCoaSchemaSupport = true;
  return extendedCoaSchemaSupport;
}

async function detectAnalyticalTestResultsSupport(supabase: SupabaseClient) {
  if (analyticalTestResultsSupport !== null) {
    return analyticalTestResultsSupport;
  }

  const { error } = await supabase
    .from("coa_analytical_test_results")
    .select("id")
    .limit(1);

  analyticalTestResultsSupport = !error || !isMissingRelationError(error);
  return analyticalTestResultsSupport;
}

async function detectAnalyticalRecordsSupport(supabase: SupabaseClient) {
  if (analyticalRecordsSupport !== null) {
    return analyticalRecordsSupport;
  }

  const { error } = await supabase
    .from("coa_analytical_records")
    .select("id")
    .limit(1);

  analyticalRecordsSupport = !error || !isMissingRelationError(error);
  return analyticalRecordsSupport;
}

function isMissingRelationError(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    /Could not find the table/i.test(error.message ?? "") ||
    /relation .* does not exist/i.test(error.message ?? "")
  );
}

function isUniqueViolationError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";

  return code === "23505" || /duplicate key|unique constraint/i.test(message);
}
