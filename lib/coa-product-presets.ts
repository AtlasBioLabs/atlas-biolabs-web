import {
  buildDefaultAnalyticalRecordRows,
  buildDefaultAnalyticalTestRows,
  type CoaAnalyticalRecordDraftRow,
  type CoaAnalyticalTestDraftRow,
} from "@/lib/coa-fixed-rows";

export type CoaProductMaterialType =
  | "peptide"
  | "cosmetic_peptide"
  | "copper_peptide"
  | "blend"
  | "specialty_compound"
  | "biologic";

export type CoaProductPreset = {
  product_name: string;
  catalog_code: string;
  category: string;
  material_type: CoaProductMaterialType;
  default_physical_form: string;
  default_appearance_spec: string;
  default_grade_scope: string;
  default_pack_size: string;
  default_storage: string;
  default_retest_period: string;
  default_document_pack: string;
  default_shipping_conditions: string;
  default_label_option: string;
  default_packaging: string;
  default_peptide_sequence?: string;
  default_molecular_weight?: string;
  default_molecular_formula?: string;
  default_analytical_rows: CoaAnalyticalTestDraftRow[];
  default_analytical_records: CoaAnalyticalRecordDraftRow[];
};

type PresetOverrides = Partial<
  Omit<
    CoaProductPreset,
    | "product_name"
    | "catalog_code"
    | "category"
    | "material_type"
    | "default_analytical_rows"
    | "default_analytical_records"
  >
>;

type AnalyticalRowOverrides = Partial<
  Record<
    CoaAnalyticalTestDraftRow["row_key"],
    Partial<
      Pick<
        CoaAnalyticalTestDraftRow,
        "method" | "specification" | "batch_result" | "status"
      >
    >
  >
>;

function buildAnalyticalRows(
  overrides: AnalyticalRowOverrides = {},
  source: Partial<{
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
  }> = {}
) {
  return buildDefaultAnalyticalTestRows(source).map((row) => ({
    ...row,
    ...overrides[row.row_key],
  }));
}

function buildAnalyticalRecords(
  source: Partial<{
    hplc_file_name: string;
    lcms_file_name: string;
    sds_file_name: string;
    raw_data_archive_ref: string;
  }> = {}
) {
  return buildDefaultAnalyticalRecordRows({
    raw_data_archive_ref: "Internal QA record folder",
    ...source,
  });
}

function makePeptidePreset(
  product_name: string,
  catalog_code: string,
  category: string,
  overrides: PresetOverrides = {}
): CoaProductPreset {
  const defaultAppearance =
    overrides.default_appearance_spec ?? "White to off-white powder";

  return {
    product_name,
    catalog_code,
    category,
    material_type: "peptide",
    default_physical_form:
      overrides.default_physical_form ?? "Lyophilized peptide powder",
    default_appearance_spec: defaultAppearance,
    default_grade_scope:
      overrides.default_grade_scope ??
      "Research compound / B2B supply documentation",
    default_pack_size: overrides.default_pack_size ?? "10 mg vial",
    default_storage:
      overrides.default_storage ?? "-20 deg C, dry, protected from light",
    default_retest_period:
      overrides.default_retest_period ?? "24 months from manufacture",
    default_document_pack:
      overrides.default_document_pack ?? "COA, HPLC, MS/LC-MS, SDS on request",
    default_shipping_conditions:
      overrides.default_shipping_conditions ??
      "Ambient or cold-chain as applicable",
    default_label_option:
      overrides.default_label_option ?? "Neutral label or private label",
    default_packaging:
      overrides.default_packaging ?? "Amber vial / sealed pouch / bulk container",
    default_peptide_sequence: overrides.default_peptide_sequence,
    default_molecular_weight: overrides.default_molecular_weight,
    default_molecular_formula: overrides.default_molecular_formula,
    default_analytical_rows: buildAnalyticalRows(
      {},
      {
        appearance_spec: defaultAppearance,
        appearance_result: "Pending QA check",
        identity_result: "Pending LC-MS report",
        hplc_purity: "Pending HPLC report",
        purity_result: "Pending HPLC report",
        peptide_content_result: "Pending batch calculation",
        water_content: "Pending KF result",
        counter_ion_result: "Acetate - to be confirmed",
        residual_solvents_result: "Pending GC report",
        heavy_metals_result: "Pending ICP-MS report",
        microbial_limits_result: "Not included unless ordered",
        endotoxin_sterility_result: "Not included unless ordered",
      }
    ),
    default_analytical_records: buildAnalyticalRecords(),
  };
}

function makeCosmeticPreset(
  product_name: string,
  catalog_code: string,
  category: string,
  overrides: PresetOverrides = {}
): CoaProductPreset {
  const defaultAppearance =
    overrides.default_appearance_spec ?? "White to off-white powder";

  return {
    product_name,
    catalog_code,
    category,
    material_type: "cosmetic_peptide",
    default_physical_form:
      overrides.default_physical_form ?? "Cosmetic ingredient powder",
    default_appearance_spec: defaultAppearance,
    default_grade_scope:
      overrides.default_grade_scope ?? "Cosmetic ingredient documentation",
    default_pack_size: overrides.default_pack_size ?? "Custom buyer pack size",
    default_storage:
      overrides.default_storage ??
      "2-8 deg C or -20 deg C as stated on final batch label",
    default_retest_period:
      overrides.default_retest_period ?? "24 months from manufacture",
    default_document_pack:
      overrides.default_document_pack ?? "COA, HPLC, MS/LC-MS, SDS on request",
    default_shipping_conditions:
      overrides.default_shipping_conditions ??
      "Ambient or cold-chain as applicable",
    default_label_option:
      overrides.default_label_option ?? "Cosmetic ingredient label / private label",
    default_packaging:
      overrides.default_packaging ?? "Bulk ingredient pack or private-label pack",
    default_peptide_sequence: overrides.default_peptide_sequence,
    default_molecular_weight: overrides.default_molecular_weight,
    default_molecular_formula: overrides.default_molecular_formula,
    default_analytical_rows: buildAnalyticalRows(
      {
        purity: {
          specification: "Per final product specification",
        },
        microbial_limits: {
          specification: "Cosmetic ingredient specification",
        },
      },
      {
        appearance_spec: defaultAppearance,
        appearance_result: "Pending QA check",
        identity_result: "Pending LC-MS report",
        hplc_purity: "Pending HPLC report",
        purity_result: "Pending purity report",
        peptide_content_result: "Pending batch calculation",
        water_content: "Pending KF result",
        counter_ion_result: "Acetate - to be confirmed",
        residual_solvents_result: "Pending GC report",
        heavy_metals_result: "Pending ICP-MS report",
        microbial_limits_result: "Not included unless ordered",
        endotoxin_sterility_result: "Not included unless ordered",
      }
    ),
    default_analytical_records: buildAnalyticalRecords(),
  };
}

function makeCopperPreset(
  product_name: string,
  catalog_code: string,
  category: string,
  overrides: PresetOverrides = {}
): CoaProductPreset {
  return {
    product_name,
    catalog_code,
    category,
    material_type: "copper_peptide",
    default_physical_form: overrides.default_physical_form ?? "Powder or lyophilized solid",
    default_appearance_spec:
      overrides.default_appearance_spec ?? "Blue to blue-violet powder",
    default_grade_scope:
      overrides.default_grade_scope ??
      "Cosmetic / research copper peptide documentation",
    default_pack_size: overrides.default_pack_size ?? "Custom buyer pack size",
    default_storage:
      overrides.default_storage ??
      "2-8 deg C or -20 deg C as stated on final batch label",
    default_retest_period:
      overrides.default_retest_period ?? "24 months from manufacture",
    default_document_pack:
      overrides.default_document_pack ?? "COA, HPLC, MS/LC-MS, SDS on request",
    default_shipping_conditions:
      overrides.default_shipping_conditions ??
      "Ambient or cold-chain as applicable",
    default_label_option:
      overrides.default_label_option ?? "Cosmetic ingredient label / private label",
    default_packaging:
      overrides.default_packaging ?? "Bulk ingredient pack or private-label pack",
    default_peptide_sequence: overrides.default_peptide_sequence,
    default_molecular_weight: overrides.default_molecular_weight,
    default_molecular_formula: overrides.default_molecular_formula,
    default_analytical_rows: buildAnalyticalRows(
      {},
      {
        appearance_spec: "Blue to blue-violet powder",
        appearance_result: "Pending QA check",
        identity_result: "Pending LC-MS report",
        hplc_purity: "Pending HPLC report",
        purity_result: "Pending purity report",
        peptide_content_result: "Pending batch calculation",
        water_content: "Pending KF result",
        counter_ion_result: "Copper complex - to be confirmed",
        residual_solvents_result: "Pending GC report",
        heavy_metals_result: "Pending ICP-MS report",
        microbial_limits_result: "Not included unless ordered",
        endotoxin_sterility_result: "Not included unless ordered",
      }
    ),
    default_analytical_records: buildAnalyticalRecords(),
  };
}

function makeBlendPreset(
  product_name: string,
  catalog_code: string,
  category: string,
  overrides: PresetOverrides = {}
): CoaProductPreset {
  const defaultAppearance =
    overrides.default_appearance_spec ??
    "White to off-white powder, unless final blend specification states otherwise";

  return {
    product_name,
    catalog_code,
    category,
    material_type: "blend",
    default_physical_form:
      overrides.default_physical_form ?? "Peptide blend powder",
    default_appearance_spec: defaultAppearance,
    default_grade_scope:
      overrides.default_grade_scope ?? "Peptide blend documentation",
    default_pack_size: overrides.default_pack_size ?? "Custom vial program",
    default_storage:
      overrides.default_storage ?? "-20 deg C, dry, protected from light",
    default_retest_period:
      overrides.default_retest_period ?? "24 months from manufacture",
    default_document_pack:
      overrides.default_document_pack ?? "Batch COA + component documentation",
    default_shipping_conditions:
      overrides.default_shipping_conditions ??
      "Ambient or cold-chain as applicable",
    default_label_option:
      overrides.default_label_option ?? "Neutral label or private label",
    default_packaging:
      overrides.default_packaging ?? "Amber vial / sealed pouch / bulk container",
    default_peptide_sequence:
      overrides.default_peptide_sequence ??
      "Blend composition and ratios to be confirmed by final production specification",
    default_molecular_weight:
      overrides.default_molecular_weight ??
      "Not applicable - multi-component blend",
    default_molecular_formula:
      overrides.default_molecular_formula ??
      "Not applicable - multi-component blend",
    default_analytical_rows: buildAnalyticalRows(
      {
        identity: {
          specification: "Component identity confirmed by component-level records",
          batch_result: "Pending component documentation",
        },
        purity: {
          specification:
            "Component-specific purity to be confirmed by blend specification",
          batch_result: "Pending component documentation",
        },
        peptide_content: {
          batch_result: "Pending component documentation",
        },
      },
      {
        appearance_spec: defaultAppearance,
        appearance_result: "Pending QA check",
        identity_result: "Pending component documentation",
        hplc_purity: "Pending component documentation",
        purity_result: "Pending component documentation",
        peptide_content_result: "Pending component documentation",
        water_content: "Pending KF result",
        counter_ion_result: "To be confirmed",
        residual_solvents_result: "Pending GC report",
        heavy_metals_result: "Pending ICP-MS report",
        microbial_limits_result: "Not included unless ordered",
        endotoxin_sterility_result: "Not included unless ordered",
      }
    ),
    default_analytical_records: buildAnalyticalRecords(),
  };
}

function makeSpecialtyPreset(
  product_name: string,
  catalog_code: string,
  category: string,
  overrides: PresetOverrides = {}
): CoaProductPreset {
  const isMk677 = product_name === "MK-677";

  return {
    product_name,
    catalog_code,
    category,
    material_type: "specialty_compound",
    default_physical_form:
      overrides.default_physical_form ??
      (isMk677
        ? "Powder or solid, as per final batch specification"
        : "Powder"),
    default_appearance_spec:
      overrides.default_appearance_spec ??
      (isMk677
        ? "White to off-white solid, unless final batch specification states otherwise"
        : "White to off-white powder"),
    default_grade_scope:
      overrides.default_grade_scope ??
      "Research compound / B2B supply documentation",
    default_pack_size: overrides.default_pack_size ?? "Custom buyer pack size",
    default_storage:
      overrides.default_storage ?? "-20 deg C, dry, protected from light",
    default_retest_period:
      overrides.default_retest_period ?? "24 months from manufacture",
    default_document_pack:
      overrides.default_document_pack ?? "COA, HPLC, MS/LC-MS, SDS on request",
    default_shipping_conditions:
      overrides.default_shipping_conditions ??
      "Ambient or cold-chain as applicable",
    default_label_option:
      overrides.default_label_option ?? "Neutral label or private label",
    default_packaging:
      overrides.default_packaging ?? "Amber vial / sealed pouch / bulk container",
    default_peptide_sequence:
      overrides.default_peptide_sequence ??
      (isMk677 ? "N/A - specialty research compound" : undefined),
    default_molecular_weight: overrides.default_molecular_weight,
    default_molecular_formula: overrides.default_molecular_formula,
    default_analytical_rows: buildAnalyticalRows(
      isMk677
        ? {
            identity: {
              method: "LC-MS / NMR / assay records as applicable",
            },
            purity: {
              method: "HPLC / GC / applicable assay",
            },
            peptide_content: {
              method: "Assay / potency method",
            },
          }
        : {},
      {
        appearance_spec:
          overrides.default_appearance_spec ??
          (isMk677
            ? "White to off-white solid, unless final batch specification states otherwise"
            : "White to off-white powder"),
        appearance_result: "Pending QA check",
        identity_result: "Pending LC-MS report",
        hplc_purity: "Pending HPLC report",
        purity_result: "Pending HPLC report",
        peptide_content_result: "Pending batch calculation",
        water_content: "Pending KF result",
        counter_ion_result: "To be confirmed",
        residual_solvents_result: "Pending GC report",
        heavy_metals_result: "Pending ICP-MS report",
        microbial_limits_result: "Not included unless ordered",
        endotoxin_sterility_result: "Not included unless ordered",
      }
    ),
    default_analytical_records: buildAnalyticalRecords(),
  };
}

function makeBiologicPreset(
  product_name: string,
  catalog_code: string,
  category: string,
  overrides: PresetOverrides = {}
): CoaProductPreset {
  const isHcg = product_name === "HCG";

  return {
    product_name,
    catalog_code,
    category,
    material_type: "biologic",
    default_physical_form:
      overrides.default_physical_form ??
      (isHcg
        ? "Lyophilized biologic material or as supplied"
        : "Biologic lyophilized material"),
    default_appearance_spec:
      overrides.default_appearance_spec ??
      (isHcg
        ? "White to off-white lyophilized powder, unless final batch specification states otherwise"
        : "White to off-white powder"),
    default_grade_scope:
      overrides.default_grade_scope ??
      (isHcg
        ? "B2B biologic sourcing documentation"
        : "Biologic sourcing documentation"),
    default_pack_size: overrides.default_pack_size ?? "Custom buyer pack size",
    default_storage:
      overrides.default_storage ??
      "2-8 deg C or -20 deg C as stated on final batch label",
    default_retest_period:
      overrides.default_retest_period ?? "24 months from manufacture",
    default_document_pack:
      overrides.default_document_pack ??
      (isHcg
        ? "COA/assay documentation where applicable"
        : "COA, HPLC, MS/LC-MS, SDS on request"),
    default_shipping_conditions:
      overrides.default_shipping_conditions ??
      "Ambient or cold-chain as applicable",
    default_label_option:
      overrides.default_label_option ?? "Neutral label or private label",
    default_packaging:
      overrides.default_packaging ?? "Sterile vial",
    default_peptide_sequence:
      overrides.default_peptide_sequence ??
      (isHcg ? "N/A - biologic/glycoprotein" : undefined),
    default_molecular_weight: overrides.default_molecular_weight,
    default_molecular_formula:
      overrides.default_molecular_formula ??
      (isHcg ? "Not applicable - biologic/glycoprotein material" : undefined),
    default_analytical_rows: buildAnalyticalRows(
      isHcg
        ? {
            identity: {
              method: "Assay / supplier identity records / applicable analytical method",
            },
            purity: {
              method: "Assay / potency / applicable purity method",
            },
            peptide_content: {
              method: "Assay / potency method",
            },
          }
        : {},
      {
        appearance_spec:
          overrides.default_appearance_spec ??
          (isHcg
            ? "White to off-white lyophilized powder, unless final batch specification states otherwise"
            : "White to off-white powder"),
        appearance_result: "Pending QA check",
        identity_result: "Pending identity report",
        hplc_purity: "Pending purity report",
        purity_result: "Pending purity report",
        peptide_content_result: "Pending batch calculation",
        water_content: "Pending KF result",
        counter_ion_result: "To be confirmed",
        residual_solvents_result: "Pending GC report",
        heavy_metals_result: "Pending ICP-MS report",
        microbial_limits_result: "Not included unless ordered",
        endotoxin_sterility_result: "Not included unless ordered",
      }
    ),
    default_analytical_records: buildAnalyticalRecords(),
  };
}

export const coaProductPresets: CoaProductPreset[] = [
  makePeptidePreset("Ipamorelin", "ATL-IPAMORELIN", "Growth Peptides"),
  makePeptidePreset("CJC-1295", "ATL-CJC1295", "Growth Peptides"),
  makePeptidePreset("Sermorelin", "ATL-SERMORELIN", "Growth Peptides"),
  makePeptidePreset("Tesamorelin", "ATL-TESAMORELIN", "Growth Peptides"),
  makePeptidePreset("GHRP-2", "ATL-GHRP2", "Growth Peptides"),
  makePeptidePreset("GHRP-6", "ATL-GHRP6", "Growth Peptides"),
  makeSpecialtyPreset("MK-677", "ATL-MK677", "Growth Support Compounds"),
  makePeptidePreset("BPC-157 Acetate", "ATL-BPC157", "Repair Peptides"),
  makePeptidePreset("TB-500", "ATL-TB500", "Repair Peptides"),
  makeCopperPreset("GHK-Cu", "ATL-GHKCU", "Cosmetic / Copper Peptides"),
  makePeptidePreset("Thymosin Alpha-1", "ATL-THYMOSINALPHA1", "Immune Peptides"),
  makePeptidePreset("ARA-290", "ATL-ARA290", "Repair Peptides"),
  makePeptidePreset("LL-37", "ATL-LL37", "Immune Peptides"),
  makePeptidePreset("KPV Peptide", "ATL-KPV", "Repair Peptides"),
  makeBlendPreset("KLOW Blend", "ATL-KLOWBLEND", "Trending & Emerging Peptides"),
  makeBlendPreset("GLOW Blend", "ATL-GLOWBLEND", "Trending & Emerging Peptides"),
  makePeptidePreset("Epitalon", "ATL-EPITALON", "Longevity Peptides"),
  makePeptidePreset("MOTS-c", "ATL-MOTSC", "Longevity Peptides"),
  makePeptidePreset("Humanin", "ATL-HUMANIN", "Longevity Peptides"),
  makePeptidePreset("FOXO4-DRI", "ATL-FOXO4DRI", "Longevity Peptides"),
  makePeptidePreset("Pinealon", "ATL-PINEALON", "Longevity Peptides"),
  makePeptidePreset("Vesugen", "ATL-VESUGEN", "Longevity Peptides"),
  makeBiologicPreset("Cortexin", "ATL-CORTEXIN", "Biologic Peptides"),
  makePeptidePreset("Semaglutide", "ATL-SEMAGLUTIDE", "Metabolic Peptides"),
  makePeptidePreset("Tirzepatide", "ATL-TIRZEPATIDE", "Metabolic Peptides"),
  makePeptidePreset("Retatrutide", "ATL-RETATRUTIDE", "Trending & Emerging Peptides"),
  makePeptidePreset("Liraglutide", "ATL-LIRAGLUTIDE", "Metabolic Peptides"),
  makePeptidePreset("Cagrilintide", "ATL-CAGRILINTIDE", "Trending & Emerging Peptides"),
  makePeptidePreset("Kisspeptin-10", "ATL-KISSPEPTIN10", "Reproductive Peptides"),
  makePeptidePreset("Gonadorelin", "ATL-GONADORELIN", "Reproductive Peptides"),
  makePeptidePreset("PT-141", "ATL-PT141", "Reproductive Peptides"),
  makePeptidePreset("Oxytocin", "ATL-OXYTOCIN", "Reproductive Peptides"),
  makeBiologicPreset("HCG", "ATL-HCG", "Biologic Hormonal Materials"),
  makeCosmeticPreset(
    "Acetyl Hexapeptide-8 (Argireline)",
    "ATL-ARGIRELINE",
    "Cosmetic Peptides"
  ),
  makeCosmeticPreset("Copper Peptides", "ATL-COPPERPEPTIDES", "Cosmetic Peptides"),
  makeBiologicPreset("IGF-1", "ATL-IGF1", "Growth Factors"),
  makeBiologicPreset("VEGF Peptides", "ATL-VEGFPEPTIDES", "Growth Factors"),
  makeCosmeticPreset(
    "Palmitoyl Pentapeptide-4 (Matrixyl)",
    "ATL-MATRIXYL",
    "Cosmetic Peptides"
  ),
  makeCosmeticPreset(
    "Dipeptide Diaminobutyroyl Benzylamide Diacetate (Syn-Ake)",
    "ATL-SYNAKE",
    "Cosmetic Peptides"
  ),
  makeCosmeticPreset(
    "Acetyl Octapeptide-3 (SNAP-8)",
    "ATL-SNAP8",
    "Cosmetic Peptides"
  ),
  makeCosmeticPreset("Nonapeptide-1", "ATL-NONAPEPTIDE1", "Cosmetic Peptides"),
];

export const coaProductNameOptions = coaProductPresets.map(
  (preset) => preset.product_name
);

export const coaProductCatalogCodeOptions = coaProductPresets.map(
  (preset) => preset.catalog_code
);

export function findCoaProductPreset(input: {
  productName?: string | null;
  catalogCode?: string | null;
}) {
  const normalizedProductName = input.productName?.trim().toLowerCase();
  const normalizedCatalogCode = input.catalogCode?.trim().toUpperCase();

  return (
    coaProductPresets.find((preset) => {
      if (
        normalizedCatalogCode &&
        preset.catalog_code.toUpperCase() === normalizedCatalogCode
      ) {
        return true;
      }

      if (
        normalizedProductName &&
        preset.product_name.trim().toLowerCase() === normalizedProductName
      ) {
        return true;
      }

      return false;
    }) ?? null
  );
}
