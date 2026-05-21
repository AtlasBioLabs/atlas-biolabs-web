import type { SupabaseClient, User } from "@supabase/supabase-js";

import type {
  CoaReleaseDecision,
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
  reviewed_by: string;
  approved_by: string;
  approved_at: string;
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

export const verificationStatusOptions: CoaVerificationStatus[] = [
  "Draft",
  "Pending QA Review",
  "Released / Verified",
  "Superseded",
  "Revoked",
  "Expired",
  "Rejected / Non-Conforming",
];

export const releaseDecisionOptions: CoaReleaseDecision[] = [
  "Pending QA Review",
  "Released / Conforms",
  "Released with Deviation",
  "Rejected / Non-Conforming",
  "Not Applicable",
];

export function formatReadableDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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
    counter_ion_result: "",
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
    reviewed_by: "Quality Assurance Manager",
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
    reviewed_by: row.reviewed_by ?? "",
    approved_by: row.approved_by ?? "",
    approved_at: row.approved_at ?? "",
  };
}

export function buildVerificationUrl(
  verificationCode: string,
  originFallback?: string | null
) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return "";
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    originFallback?.trim() ||
    "";

  if (!siteUrl) {
    return `/verify/${encodeURIComponent(normalizedCode)}`;
  }

  return `${siteUrl.replace(/\/$/, "")}/verify/${encodeURIComponent(normalizedCode)}`;
}

export function buildPublicVerificationPath(verificationCode: string) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return "/verify";
  }

  return `/verify/${encodeURIComponent(normalizedCode)}`;
}

export function getCoaAdminWarnings(values: CoaVerificationFormValues) {
  const warnings: string[] = [];
  const pendingFields = [
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
    pendingFields.some((value) => value.toLowerCase().includes("pending"))
  ) {
    warnings.push(
      "Released / Verified records should not keep Pending values in Identity Result, HPLC Purity, or Water Content."
    );
  }

  return warnings;
}

export async function getActiveAdminUser(
  supabase: SupabaseClient,
  user: User
): Promise<AdminUserRecord | null> {
  const { data: byAuthUserId } = await supabase
    .from("admin_users")
    .select("*")
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (byAuthUserId) {
    return byAuthUserId as AdminUserRecord;
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

export async function createCoaVerificationRecord(
  supabase: SupabaseClient,
  values: CoaVerificationFormValues
) {
  const payload = toMutationPayload(values);
  const { data, error } = await supabase
    .from("coa_verifications")
    .insert(payload)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as CoaVerificationRow | null) ?? null;
}

export async function updateCoaVerificationRecord(
  supabase: SupabaseClient,
  id: string,
  values: CoaVerificationFormValues
) {
  const payload = toMutationPayload(values);
  const { data, error } = await supabase
    .from("coa_verifications")
    .update(payload)
    .eq("id", id)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as CoaVerificationRow | null) ?? null;
}

export async function generateVerificationCode({
  supabase,
  catalogCode,
  year = new Date().getFullYear(),
}: GenerateCodeInput) {
  const cleanedCatalog = catalogCode
    .trim()
    .toUpperCase()
    .replace(/^ATL-/, "")
    .replace(/[^A-Z0-9]/g, "");

  if (!cleanedCatalog) {
    throw new Error("Catalog code is required before generating a verification code.");
  }

  const prefix = `ATL-${cleanedCatalog}-${year}-`;
  const { data } = await supabase
    .from("coa_verifications")
    .select("verification_code")
    .like("verification_code", `${prefix}%`);

  const codes = (data ?? []) as Array<{ verification_code?: string | null }>;
  const sequences = codes
    .map((record) => {
      const code = record.verification_code ?? "";
      const match = code.match(new RegExp(`^${prefix}(\\d{3})-[A-Z0-9]{6}$`));
      return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
    })
    .filter((value) => Number.isFinite(value) && value > 0);

  const nextSequence = String((Math.max(0, ...sequences) || 0) + 1).padStart(
    3,
    "0"
  );

  return `${prefix}${nextSequence}-${createRandomSuffix(6)}`;
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
    reviewed_by: emptyToNull(values.reviewed_by),
    approved_by: emptyToNull(values.approved_by),
    approved_at: emptyToNull(values.approved_at),
  };
}
