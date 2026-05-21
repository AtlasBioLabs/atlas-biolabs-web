export type CoaAnalyticalTestRowKey =
  | "appearance"
  | "identity"
  | "purity"
  | "peptide_content"
  | "water_content"
  | "counter_ion"
  | "residual_solvents"
  | "heavy_metals"
  | "microbial_limits"
  | "endotoxin_sterility";

export type CoaAnalyticalRecordRowKey =
  | "hplc_chromatogram"
  | "lcms_identity_report"
  | "sds_safety_data_sheet"
  | "raw_data_archive";

export type CoaAnalyticalTestDraftRow = {
  row_key: CoaAnalyticalTestRowKey;
  position: number;
  test_attribute: string;
  method: string;
  specification: string;
  batch_result: string;
  status: string;
};

export type CoaAnalyticalRecordDraftRow = {
  row_key: CoaAnalyticalRecordRowKey;
  position: number;
  record_type: string;
  reference_file_name: string;
  availability: string;
};

type CoaSummarySource = Partial<{
  appearance_spec: string;
  appearance_result: string;
  identity_result: string;
  hplc_purity: string;
  purity_result: string;
  peptide_content_result: string;
  water_content: string;
  counter_ion_result: string;
  residual_solvents_result: string;
  heavy_metals_result: string;
  microbial_limits_result: string;
  endotoxin_sterility_result: string;
  hplc_file_name: string;
  lcms_file_name: string;
  sds_file_name: string;
  raw_data_archive_ref: string;
}>;

export const analyticalStatusPresets = [
  "Pending",
  "Pass",
  "Fail",
  "N/A",
  "Not included unless ordered",
  "Conforms",
  "Does not conform",
  "Requires review",
] as const;

export const analyticalMethodPresets = [
  "Visual inspection",
  "LC-MS / MS",
  "RP-HPLC",
  "UV / HPLC calculation",
  "Karl Fischer",
  "Ion chromatography / declaration",
  "GC / ICH-oriented screening",
  "ICP-MS screen",
  "USP/EP-oriented screen",
  "LAL / sterility test",
  "Assay / potency method",
  "Supplier identity record",
  "Not included unless ordered",
] as const;

export const analyticalSpecificationPresets = [
  "White to off-white powder",
  "Consistent with reference MW / sequence",
  ">= 98.0% by area normalization",
  "Report result",
  "<= 5.0%",
  "Meets internal limit",
  "<= 10 ppm total",
  "As requested / applicable",
  "Not standard unless requested",
  "Not included unless ordered",
  "Per final product specification",
] as const;

export const analyticalBatchResultPresets = [
  "Pending QA check",
  "Pending LC-MS report",
  "Pending HPLC report",
  "Pending batch calculation",
  "Pending KF result",
  "Acetate - to be confirmed",
  "Pending GC report",
  "Pending ICP-MS report",
  "Not included unless ordered",
  "Conforms",
  "To be attached to released batch COA",
] as const;

export const analyticalRecordAvailabilityPresets = [
  "Batch-specific",
  "On request",
  "Controlled access",
  "Not included unless ordered",
  "Attached",
  "Pending upload",
] as const;

export const fixedAnalyticalTestRowDefinitions: Array<
  Omit<CoaAnalyticalTestDraftRow, "batch_result" | "status">
> = [
  {
    row_key: "appearance",
    position: 1,
    test_attribute: "Appearance",
    method: "Visual inspection",
    specification: "White to off-white powder",
  },
  {
    row_key: "identity",
    position: 2,
    test_attribute: "Identity",
    method: "LC-MS / MS",
    specification: "Consistent with reference MW / sequence",
  },
  {
    row_key: "purity",
    position: 3,
    test_attribute: "Purity",
    method: "RP-HPLC",
    specification: ">= 98.0% by area normalization",
  },
  {
    row_key: "peptide_content",
    position: 4,
    test_attribute: "Peptide content",
    method: "UV / HPLC calculation",
    specification: "Report result",
  },
  {
    row_key: "water_content",
    position: 5,
    test_attribute: "Water content",
    method: "Karl Fischer",
    specification: "<= 5.0%",
  },
  {
    row_key: "counter_ion",
    position: 6,
    test_attribute: "Counter-ion",
    method: "Ion chromatography / declaration",
    specification: "Report result",
  },
  {
    row_key: "residual_solvents",
    position: 7,
    test_attribute: "Residual solvents",
    method: "GC / ICH-oriented screening",
    specification: "Meets internal limit",
  },
  {
    row_key: "heavy_metals",
    position: 8,
    test_attribute: "Heavy metals",
    method: "ICP-MS screen",
    specification: "<= 10 ppm total",
  },
  {
    row_key: "microbial_limits",
    position: 9,
    test_attribute: "Microbial limits",
    method: "USP/EP-oriented screen",
    specification: "As requested / applicable",
  },
  {
    row_key: "endotoxin_sterility",
    position: 10,
    test_attribute: "Endotoxin / Sterility",
    method: "LAL / sterility test",
    specification: "Not standard unless requested",
  },
];

export const fixedAnalyticalRecordRowDefinitions: Array<
  Omit<CoaAnalyticalRecordDraftRow, "reference_file_name" | "availability">
> = [
  {
    row_key: "hplc_chromatogram",
    position: 1,
    record_type: "HPLC chromatogram",
  },
  {
    row_key: "lcms_identity_report",
    position: 2,
    record_type: "LC-MS identity report",
  },
  {
    row_key: "sds_safety_data_sheet",
    position: 3,
    record_type: "SDS / Safety Data Sheet",
  },
  {
    row_key: "raw_data_archive",
    position: 4,
    record_type: "Raw data archive",
  },
];

export function deriveAnalyticalStatusValue(value?: string | null) {
  const normalizedValue = value?.trim().toLowerCase() ?? "";

  if (!normalizedValue) {
    return "Pending";
  }

  if (normalizedValue.includes("pending")) {
    return "Pending";
  }

  if (
    normalizedValue.includes("not included") ||
    normalizedValue === "n/a" ||
    normalizedValue.includes("not applicable")
  ) {
    return "Not included unless ordered";
  }

  if (
    normalizedValue.includes("conform") ||
    normalizedValue.includes("meets") ||
    normalizedValue.includes("pass") ||
    normalizedValue.includes("complies")
  ) {
    return "Conforms";
  }

  if (
    normalizedValue.includes("reject") ||
    normalizedValue.includes("fail") ||
    normalizedValue.includes("revoke")
  ) {
    return "Does not conform";
  }

  return "Requires review";
}

export function buildDefaultAnalyticalTestRows(
  source: CoaSummarySource = {}
): CoaAnalyticalTestDraftRow[] {
  return fixedAnalyticalTestRowDefinitions.map((definition) => {
    let batchResult = "";
    let specification = definition.specification;

    switch (definition.row_key) {
      case "appearance":
        batchResult = source.appearance_result ?? "Pending QA check";
        specification = source.appearance_spec?.trim() || specification;
        break;
      case "identity":
        batchResult = source.identity_result ?? "Pending LC-MS/MS review";
        break;
      case "purity":
        batchResult =
          source.purity_result?.trim() || source.hplc_purity?.trim() || "Pending HPLC report";
        break;
      case "peptide_content":
        batchResult = source.peptide_content_result ?? "Pending batch calculation";
        break;
      case "water_content":
        batchResult = source.water_content ?? "Pending KF result";
        break;
      case "counter_ion":
        batchResult = source.counter_ion_result ?? "To be confirmed";
        break;
      case "residual_solvents":
        batchResult = source.residual_solvents_result ?? "Pending GC report";
        break;
      case "heavy_metals":
        batchResult = source.heavy_metals_result ?? "Pending ICP-MS report";
        break;
      case "microbial_limits":
        batchResult = source.microbial_limits_result ?? "Not included unless ordered";
        break;
      case "endotoxin_sterility":
        batchResult =
          source.endotoxin_sterility_result ?? "Not included unless ordered";
        break;
    }

    return {
      ...definition,
      specification,
      batch_result: batchResult,
      status: deriveAnalyticalStatusValue(batchResult),
    };
  });
}

export function buildDefaultAnalyticalRecordRows(
  source: CoaSummarySource = {}
): CoaAnalyticalRecordDraftRow[] {
  return fixedAnalyticalRecordRowDefinitions.map((definition) => {
    let referenceFileName = "";
    let availability = "Pending upload";

    switch (definition.row_key) {
      case "hplc_chromatogram":
        referenceFileName = source.hplc_file_name ?? "";
        availability = referenceFileName ? "Batch-specific" : "Pending upload";
        break;
      case "lcms_identity_report":
        referenceFileName = source.lcms_file_name ?? "";
        availability = referenceFileName ? "Batch-specific" : "Pending upload";
        break;
      case "sds_safety_data_sheet":
        referenceFileName = source.sds_file_name ?? "";
        availability = referenceFileName ? "Attached" : "On request";
        break;
      case "raw_data_archive":
        referenceFileName = source.raw_data_archive_ref ?? "Internal QA record folder";
        availability = referenceFileName ? "Controlled access" : "Pending upload";
        break;
    }

    return {
      ...definition,
      reference_file_name: referenceFileName,
      availability,
    };
  });
}
