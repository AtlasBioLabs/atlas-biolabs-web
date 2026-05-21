export const verificationStatusOptions = [
  "Draft",
  "Pending QA Review",
  "Released / Verified",
  "Superseded",
  "Revoked",
  "Expired",
  "Rejected / Non-Conforming",
] as const;

export const releaseDecisionOptions = [
  "Pending QA Review",
  "Released / Conforms",
  "Released with Deviation",
  "Rejected / Non-Conforming",
  "Not Applicable",
] as const;

export const analyticalStatusPresets = [
  "Pending",
  "Pass",
  "Fail",
  "N/A",
  "Conforms",
  "Does not conform",
  "Requires review",
  "Not included unless ordered",
  "Attached",
  "Batch-specific",
  "Controlled access",
  "On request",
] as const;

export const physicalFormOptions = [
  "Lyophilized powder",
  "Lyophilized peptide powder",
  "Powder",
  "Crystalline powder",
  "Amorphous powder",
  "Solid",
  "Lyophilized cake",
  "Solution",
  "Sterile filtered solution",
  "Bulk powder",
  "Cosmetic ingredient powder",
  "Peptide blend powder",
  "Biologic lyophilized material",
  "As stated on final batch specification",
] as const;

export const appearanceSpecOptions = [
  "White to off-white powder",
  "White powder",
  "Off-white powder",
  "White to slightly yellow powder",
  "Pale yellow powder",
  "Blue to blue-violet powder",
  "Blue powder",
  "Clear colorless solution",
  "Colorless to pale yellow solution",
  "Lyophilized white cake",
  "Uniform powder with no visible foreign matter",
  "As stated on final batch specification",
] as const;

export const gradeScopeOptions = [
  "Research compound / B2B supply documentation",
  "Research-grade peptide / B2B documentation",
  "Cosmetic ingredient documentation",
  "B2B sourcing documentation",
  "Private-label supply documentation",
  "Custom synthesis documentation",
  "Peptide blend documentation",
  "Biologic sourcing documentation",
  "Analytical reference documentation",
  "Batch-specific QA documentation",
] as const;

export const packSizeOptions = [
  "Bulk or private-label pack as ordered",
  "1 g bulk pack",
  "5 g bulk pack",
  "10 g bulk pack",
  "25 g bulk pack",
  "50 g bulk pack",
  "100 g bulk pack",
  "500 g bulk pack",
  "1 kg bulk pack",
  "2 mg vial",
  "5 mg vial",
  "10 mg vial",
  "15 mg vial",
  "20 mg vial",
  "30 mg vial",
  "50 mg vial",
  "Custom vial program",
  "Custom buyer pack size",
  "Neutral label pack",
  "Private-label pack",
] as const;

export const storageOptions = [
  "-20 deg C, dry, protected from light",
  "2-8 deg C, dry, protected from light",
  "Store frozen at -20 deg C",
  "Store refrigerated at 2-8 deg C",
  "Store at room temperature, dry and protected from light",
  "Store under nitrogen, protected from moisture",
  "Keep container tightly closed",
  "Avoid repeated freeze-thaw cycles",
  "As stated on final batch label",
  "As stated on final SDS/TDS",
] as const;

export const retestPeriodOptions = [
  "12 months from manufacture",
  "18 months from manufacture",
  "24 months from manufacture",
  "36 months from manufacture",
  "Pending batch confirmation",
  "As stated on final batch label",
  "As stated on final COA",
] as const;

export const manufactureDateOptions = [
  "Pending batch confirmation",
  "Current month/year",
  "To be confirmed by final production batch",
  "As stated on production record",
] as const;

export const retestExpiryOptions = [
  "Pending batch confirmation",
  "12 months from manufacture",
  "24 months from manufacture",
  "36 months from manufacture",
  "As stated on final batch label",
  "As stated on final COA",
] as const;

export const batchQuantityOptions = [
  "Pending quotation / production confirmation",
  "Pilot batch",
  "Qualified stock batch",
  "Custom production batch",
  "10 g",
  "25 g",
  "50 g",
  "100 g",
  "500 g",
  "1 kg",
  "Buyer-specified batch quantity",
  "As stated on final production record",
] as const;

export const manufacturingSiteOptions = [
  "Qualified partner production facility",
  "Qualified peptide synthesis facility",
  "Qualified GMP/ISO-capable partner facility",
  "Qualified cosmetic ingredient facility",
  "Qualified biologic partner facility",
  "To be confirmed by final production batch",
  "Confidential supplier facility on file",
] as const;

export const countryOfOriginOptions = [
  "China",
  "United States",
  "European Union",
  "United Kingdom",
  "India",
  "Switzerland",
  "Germany",
  "To be confirmed by final production batch",
  "As stated on final commercial invoice",
] as const;

export const releaseSiteOptions = [
  "Atlas Labs QA Documentation",
  "Atlas BioLabs QA Documentation",
  "Partner QA Documentation Unit",
  "Supplier QA Release Unit",
  "Third-party laboratory review",
  "To be confirmed by final release file",
] as const;

export const packagingOptions = [
  "Amber vial / sealed pouch / bulk container",
  "Amber glass vial",
  "Clear glass vial",
  "Sterile vial",
  "HDPE bottle",
  "Aluminum foil pouch",
  "Double PE bag",
  "Vacuum-sealed pouch",
  "Bulk sealed container",
  "Desiccant-packed container",
  "Cold-chain insulated pack",
  "Neutral label packaging",
  "Private-label packaging",
  "As ordered",
] as const;

export const labelOptionOptions = [
  "Neutral label",
  "Private label",
  "Atlas Labs documentation label",
  "Buyer-branded label",
  "Research-use label",
  "Cosmetic ingredient label",
  "Bulk material label",
  "Custom compliance label",
  "No retail label",
  "As ordered",
] as const;

export const shippingConditionsOptions = [
  "Ambient or cold-chain as applicable",
  "Ambient shipment",
  "Cold-chain shipment",
  "2-8 deg C cold-chain",
  "Frozen shipment",
  "Dry ice shipment",
  "Insulated packaging",
  "Moisture-protected packaging",
  "Light-protected packaging",
  "Courier shipment",
  "Freight-forwarder shipment",
  "As required by product stability",
  "As confirmed before dispatch",
] as const;

export const documentPackOptions = [
  "COA, HPLC, MS/LC-MS, SDS on request",
  "COA only",
  "COA + HPLC",
  "COA + HPLC + MS/LC-MS",
  "COA + HPLC + MS/LC-MS + SDS",
  "COA + SDS",
  "COA + third-party testing",
  "Batch COA + component documentation",
  "COA/assay documentation where applicable",
  "Supplier COA + Atlas QA documentation",
  "Full batch documentation pack on request",
] as const;

export const analyticalMethodPresets = [
  "Visual inspection",
  "LC-MS / MS",
  "LC-MS",
  "MS",
  "RP-HPLC",
  "HPLC",
  "UPLC",
  "UV / HPLC calculation",
  "Karl Fischer",
  "Ion chromatography / declaration",
  "GC / ICH-oriented screening",
  "GC-MS",
  "ICP-MS screen",
  "USP/EP-oriented screen",
  "LAL / sterility test",
  "Assay / potency method",
  "Supplier identity record",
  "NMR",
  "Amino acid analysis",
  "Peptide mapping",
  "Not included unless ordered",
] as const;

export const analyticalSpecificationPresets = [
  "White to off-white powder",
  "Blue to blue-violet powder",
  "Consistent with reference MW / sequence",
  "Consistent with supplier identity record",
  ">= 95.0% by area normalization",
  ">= 98.0% by area normalization",
  ">= 99.0% by area normalization",
  "Report result",
  "<= 2.0%",
  "<= 5.0%",
  "Meets internal limit",
  "<= 10 ppm total",
  "As requested / applicable",
  "Not standard unless requested",
  "Not included unless ordered",
  "Per final product specification",
  "Per final supplier TDS",
  "Per batch-specific release specification",
  "Cosmetic ingredient specification",
  "Component identity confirmed by component-level records",
  "Component-specific purity to be confirmed by blend specification",
] as const;

export const analyticalBatchResultPresets = [
  "Pending QA check",
  "Pending identity report",
  "Pending LC-MS report",
  "Pending LC-MS/MS review",
  "Pending HPLC report",
  "Pending purity report",
  "Pending batch calculation",
  "Pending KF result",
  "Pending GC report",
  "Pending ICP-MS report",
  "Acetate - to be confirmed",
  "TFA - to be confirmed",
  "Chloride - to be confirmed",
  "Copper complex - to be confirmed",
  "Conforms",
  "Does not conform",
  "White powder",
  "White to off-white powder",
  "Blue to blue-violet powder",
  "< 10 ppm",
  "Not included unless ordered",
  "To be attached to released batch COA",
  "As stated on final report",
  "Pending component documentation",
] as const;

export const analyticalRecordAvailabilityPresets = [
  "Batch-specific",
  "On request",
  "Controlled access",
  "Attached",
  "Pending upload",
  "Not included unless ordered",
  "Available after QA release",
  "Supplier record on file",
  "Third-party report on file",
  "Not applicable",
] as const;
