/**
 * Quality Documentation Service
 * Handles validation, document generation, and release rules for COA and supporting documents
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type CoaDocument,
  type HplcReport,
  type MsReport,
  type SDS,
  type DocumentBundle,
  type Batch,
  type DocumentValidationResult,
  type ReleaseValidationError,
} from "@/lib/quality-types";

/**
 * Generates a unique COA number based on product and timestamp
 */
export function generateCoaNumber(productId: string, timestamp?: Date): string {
  const date = timestamp || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `COA-${productId.toUpperCase()}-${year}${month}${day}-${random}`;
}

/**
 * Generates a unique verification code for a COA
 */
export function generateVerificationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generates a unique document number for reports
 */
export function generateDocumentNumber(
  prefix: "HPLC" | "MS" | "SDS",
  timestamp?: Date
): string {
  const date = timestamp || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  return `${prefix}-${year}${month}-${random}`;
}

/**
 * Generates a unique bundle number
 */
export function generateBundleNumber(timestamp?: Date): string {
  const date = timestamp || new Date();
  const year = date.getFullYear().toString().slice(-2);
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `BUNDLE-${year}${String(dayOfYear).padStart(3, "0")}-${random}`;
}

/**
 * Validates COA document for release
 */
export function validateCoaForRelease(coa: CoaDocument): DocumentValidationResult {
  const errors: ReleaseValidationError[] = [];
  const warnings: ReleaseValidationError[] = [];

  // Required fields
  if (!coa.issueDate) {
    errors.push({
      field: "issueDate",
      message: "Issue date is required",
      blocking: true,
    });
  }

  if (!coa.approvedBy) {
    errors.push({
      field: "approvedBy",
      message: "Approval signature is required",
      blocking: true,
    });
  }

  if (!coa.verificationCode) {
    errors.push({
      field: "verificationCode",
      message: "Verification code is required",
      blocking: true,
    });
  }

  if (coa.releaseDecision !== "released") {
    errors.push({
      field: "releaseDecision",
      message: "Release decision must be set to 'released'",
      blocking: true,
    });
  }

  return {
    isValid: errors.length === 0,
    canRelease: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates HPLC report for release
 */
export function validateHplcForRelease(
  hplc: HplcReport
): DocumentValidationResult {
  const errors: ReleaseValidationError[] = [];
  const warnings: ReleaseValidationError[] = [];

  if (!hplc.issueDate) {
    errors.push({
      field: "issueDate",
      message: "Issue date is required",
      blocking: true,
    });
  }

  if (!hplc.analytName) {
    errors.push({
      field: "analystName",
      message: "Analyst name is required",
      blocking: true,
    });
  }

  if (hplc.purityPercent === null || hplc.purityPercent === undefined) {
    errors.push({
      field: "purityPercent",
      message: "Purity percent must be entered",
      blocking: true,
    });
  }

  if (!hplc.resultSummary) {
    errors.push({
      field: "resultSummary",
      message: "Result summary is required",
      blocking: true,
    });
  }

  if (!hplc.acceptanceCriteria) {
    errors.push({
      field: "acceptanceCriteria",
      message: "Acceptance criteria is required",
      blocking: true,
    });
  }

  return {
    isValid: errors.length === 0,
    canRelease: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates MS report for release
 */
export function validateMsForRelease(ms: MsReport): DocumentValidationResult {
  const errors: ReleaseValidationError[] = [];
  const warnings: ReleaseValidationError[] = [];

  if (!ms.issueDate) {
    errors.push({
      field: "issueDate",
      message: "Issue date is required",
      blocking: true,
    });
  }

  if (!ms.analytName) {
    errors.push({
      field: "analystName",
      message: "Analyst name is required",
      blocking: true,
    });
  }

  if (
    ms.expectedMolecularWeight === null ||
    ms.expectedMolecularWeight === undefined
  ) {
    errors.push({
      field: "expectedMolecularWeight",
      message: "Expected molecular weight is required",
      blocking: true,
    });
  }

  if (ms.observedMass === null || ms.observedMass === undefined) {
    errors.push({
      field: "observedMass",
      message: "Observed mass is required",
      blocking: true,
    });
  }

  if (!ms.identityConclusion) {
    errors.push({
      field: "identityConclusion",
      message: "Identity conclusion is required",
      blocking: true,
    });
  }

  if (!ms.acceptanceCriteria) {
    errors.push({
      field: "acceptanceCriteria",
      message: "Acceptance criteria is required",
      blocking: true,
    });
  }

  return {
    isValid: errors.length === 0,
    canRelease: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates SDS for activation
 */
export function validateSdsForActivation(sds: SDS): DocumentValidationResult {
  const errors: ReleaseValidationError[] = [];
  const warnings: ReleaseValidationError[] = [];

  // Check all 16 sections are filled
  const sections = [
    { field: "section1Identification", name: "Section 1 (Identification)" },
    {
      field: "section2HazardIdentification",
      name: "Section 2 (Hazard Identification)",
    },
    { field: "section3Composition", name: "Section 3 (Composition)" },
    { field: "section4FirstAid", name: "Section 4 (First Aid)" },
    {
      field: "section5FireFighting",
      name: "Section 5 (Fire Fighting)",
    },
    {
      field: "section6AccidentalRelease",
      name: "Section 6 (Accidental Release)",
    },
    {
      field: "section7HandlingStorage",
      name: "Section 7 (Handling & Storage)",
    },
    {
      field: "section8ExposureControls",
      name: "Section 8 (Exposure Controls)",
    },
    {
      field: "section9PhysicalChemical",
      name: "Section 9 (Physical & Chemical)",
    },
    {
      field: "section10StabilityReactivity",
      name: "Section 10 (Stability & Reactivity)",
    },
    {
      field: "section11Toxicological",
      name: "Section 11 (Toxicological)",
    },
    { field: "section12Ecological", name: "Section 12 (Ecological)" },
    { field: "section13Disposal", name: "Section 13 (Disposal)" },
    { field: "section14Transport", name: "Section 14 (Transport)" },
    { field: "section15Regulatory", name: "Section 15 (Regulatory)" },
    { field: "section16Other", name: "Section 16 (Other)" },
  ];

  for (const section of sections) {
    const value = sds[section.field as keyof SDS] as string | undefined;
    if (!value || value.trim().length === 0) {
      errors.push({
        field: section.field,
        message: `${section.name} is required`,
        blocking: true,
      });
    }
  }

  if (!sds.issueDate) {
    errors.push({
      field: "issueDate",
      message: "Issue date is required",
      blocking: true,
    });
  }

  return {
    isValid: errors.length === 0,
    canRelease: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates entire COA bundle for release
 * Checks batch, COA, HPLC, MS, and SDS are all ready
 */
export async function validateBundleForRelease(
  supabase: SupabaseClient,
  bundle: DocumentBundle,
  batch: Batch,
  coa: CoaDocument,
  hplc: HplcReport | null,
  ms: MsReport | null,
  sds: SDS | null
): Promise<DocumentValidationResult> {
  const errors: ReleaseValidationError[] = [];
  const warnings: ReleaseValidationError[] = [];

  // Batch must be released or approved
  if (!["released", "approved"].includes(batch.status)) {
    errors.push({
      field: "batch.status",
      message: `Batch status must be 'released' or 'approved', got '${batch.status}'`,
      blocking: true,
    });
  }

  // COA validation
  const coaValidation = validateCoaForRelease(coa);
  errors.push(...coaValidation.errors);
  warnings.push(...coaValidation.warnings);

  // HPLC validation
  if (hplc) {
    if (!["approved", "released"].includes(hplc.status)) {
      errors.push({
        field: "hplc.status",
        message: `HPLC report must be 'approved' or 'released', got '${hplc.status}'`,
        blocking: true,
      });
    }
  } else {
    errors.push({
      field: "hplc",
      message: "HPLC report is required or must be marked as not required",
      blocking: true,
    });
  }

  // MS validation
  if (ms) {
    if (!["approved", "released"].includes(ms.status)) {
      errors.push({
        field: "ms.status",
        message: `MS report must be 'approved' or 'released', got '${ms.status}'`,
        blocking: true,
      });
    }
  } else {
    errors.push({
      field: "ms",
      message: "MS report is required or must be marked as not required",
      blocking: true,
    });
  }

  // SDS validation
  if (sds) {
    if (sds.status !== "active") {
      errors.push({
        field: "sds.status",
        message: `SDS must be 'active', got '${sds.status}'`,
        blocking: true,
      });
    }
  } else {
    errors.push({
      field: "sds",
      message: "Active SDS is required",
      blocking: true,
    });
  }

  return {
    isValid: errors.length === 0,
    canRelease: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Creates audit log entry
 */
export async function createAuditLog(
  supabase: SupabaseClient,
  entityType: string,
  entityId: string,
  action: string,
  performedBy: string,
  oldValue?: Record<string, unknown>,
  newValue?: Record<string, unknown>,
  details?: string
): Promise<void> {
  const { error } = await supabase.from("quality_audit_logs").insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    old_value_json: oldValue,
    new_value_json: newValue,
    performed_by: performedBy,
    details,
    performed_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to create audit log:", error);
    throw error;
  }
}

/**
 * Gets the blocking error message for COA release
 */
export function getCoaReleaseBlockingMessage(
  validation: DocumentValidationResult
): string | null {
  const blockingErrors = validation.errors.filter((e) => e.blocking);
  if (blockingErrors.length === 0) return null;

  return (
    "COA cannot be released because supporting documentation is incomplete:\n" +
    blockingErrors.map((e) => `• ${e.message}`).join("\n")
  );
}
