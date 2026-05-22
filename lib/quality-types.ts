/**
 * Quality Documentation System Type Definitions
 * Defines all types for Product, Batch, COA, HPLC, MS, SDS, Document Bundle, and Audit Log
 */

// ============================================================================
// BATCH / LOT TYPES
// ============================================================================

export type BatchStatus = "draft" | "under_review" | "released" | "rejected" | "void";
export type ReleaseDecision = "pending" | "released" | "rejected" | "conditional";

export type Batch = {
  id: string;
  productId: string;
  batchNumber: string;
  lotNumber?: string;
  manufacturingDate: string;
  expiryDate: string;
  retestDate?: string;
  countryOfOrigin: string;
  supplierName?: string;
  manufacturerName?: string;
  status: BatchStatus;
  releaseDecision: ReleaseDecision;
  createdBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
};

// ============================================================================
// COA DOCUMENT TYPES
// ============================================================================

export type DocumentStatus =
  | "draft"
  | "under_review"
  | "correction_required"
  | "approved"
  | "released"
  | "superseded"
  | "void";

export type WatermarkMode = "none" | "draft" | "sample";

export type CoaDocument = {
  id: string;
  productId: string;
  batchId: string;
  coaNumber: string;
  issueDate: string;
  revision: number;
  documentStatus: DocumentStatus;
  documentType: "Certificate of Analysis";
  clientRecipient?: string;
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  releaseDecision: ReleaseDecision;
  verificationCode: string;
  verificationUrl?: string;
  qrCodeValue?: string;
  hplcReportId?: string;
  msReportId?: string;
  sdsId?: string;
  notes?: string;
  watermarkMode: WatermarkMode;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// HPLC PURITY REPORT TYPES
// ============================================================================

export type HplcPeakData = {
  peakNumber: number;
  retentionTime: number;
  peakArea: number;
  peakHeight?: number;
  purityPercent?: number;
  peakName?: string;
  compoundId?: string;
};

export type HplcImpurityData = {
  retentionTime: number;
  peakArea: number;
  purityPercent: number;
  impurityId?: string;
  impurityName?: string;
  acceptableLimitPercent?: number;
};

export type HplcReport = {
  id: string;
  productId: string;
  batchId: string;
  coaId: string;
  documentNumber: string;
  issueDate: string;
  revision: number;
  status: DocumentStatus;
  methodName: string;
  methodCode?: string;
  instrumentName: string;
  columnType: string;
  mobilePhase: string;
  flowRate: number;
  detectionWavelength: number;
  injectionVolume: number;
  runTime: number;
  sampleConcentration?: string;
  retentionTime?: number;
  purityPercent: number;
  mainPeakArea: number;
  totalPeakArea: number;
  impuritiesJson?: HplcImpurityData[];
  peakTableJson?: HplcPeakData[];
  chromatogramFileUrl?: string;
  rawDataFileUrl?: string;
  analystName: string;
  reviewerName?: string;
  resultSummary: string;
  passFailDecision: "pass" | "fail" | "conditional";
  acceptanceCriteria: string;
  notes?: string;
  watermarkMode: WatermarkMode;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// MS / LC-MS IDENTITY REPORT TYPES
// ============================================================================

export type MsReport = {
  id: string;
  productId: string;
  batchId: string;
  coaId: string;
  documentNumber: string;
  issueDate: string;
  revision: number;
  status: DocumentStatus;
  methodName: string;
  methodCode?: string;
  instrumentName: string;
  ionizationMode: string;
  expectedMolecularWeight: number;
  observedMass: number;
  massError: number;
  massErrorPpm?: number;
  chargeState?: number;
  spectrumFileUrl?: string;
  rawDataFileUrl?: string;
  identityConclusion: string;
  passFailDecision: "pass" | "fail" | "conditional";
  acceptanceCriteria: string;
  analystName: string;
  reviewerName?: string;
  notes?: string;
  watermarkMode: WatermarkMode;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// SAFETY DATA SHEET (SDS) TYPES
// ============================================================================

export type SdsStatus = "draft" | "under_review" | "active" | "superseded" | "void";

export type GhsClassification = {
  hazardClass: string;
  hazardCategory: string;
  signalWord: "Danger" | "Warning";
};

export type SdsPictogram = {
  name: string;
  svgUrl?: string;
};

export type SdsStatement = {
  code: string;
  text: string;
};

export type SDS = {
  id: string;
  productId: string;
  documentNumber: string;
  revision: number;
  issueDate: string;
  revisionDate: string;
  status: SdsStatus;
  language: string;
  jurisdiction: string;
  ghsClassification?: GhsClassification[];
  signalWord?: string;
  pictogramsJson?: SdsPictogram[];
  hazardStatementsJson?: SdsStatement[];
  precautionaryStatementsJson?: SdsStatement[];
  section1Identification: string;
  section2HazardIdentification: string;
  section3Composition: string;
  section4FirstAid: string;
  section5FireFighting: string;
  section6AccidentalRelease: string;
  section7HandlingStorage: string;
  section8ExposureControls: string;
  section9PhysicalChemical: string;
  section10StabilityReactivity: string;
  section11Toxicological: string;
  section12Ecological: string;
  section13Disposal: string;
  section14Transport: string;
  section15Regulatory: string;
  section16Other: string;
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// DOCUMENT BUNDLE TYPES
// ============================================================================

export type BundleStatus =
  | "draft"
  | "incomplete"
  | "under_review"
  | "approved"
  | "released"
  | "void";

export type DocumentBundle = {
  id: string;
  productId: string;
  batchId: string;
  coaId: string;
  hplcReportId?: string;
  msReportId?: string;
  sdsId?: string;
  bundleNumber: string;
  status: BundleStatus;
  createdBy: string;
  approvedBy?: string;
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export type EntityType =
  | "batch"
  | "coa_document"
  | "hplc_report"
  | "ms_report"
  | "sds"
  | "document_bundle";

export type AuditAction =
  | "created"
  | "updated"
  | "approved"
  | "released"
  | "superseded"
  | "voided"
  | "rejected"
  | "reviewed";

export type AuditLog = {
  id: string;
  entityType: EntityType;
  entityId: string;
  action: AuditAction;
  oldValueJson?: Record<string, unknown>;
  newValueJson?: Record<string, unknown>;
  performedBy: string;
  performedAt: string;
  ipAddress?: string;
  details?: string;
};

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export type ReleaseValidationError = {
  field: string;
  message: string;
  blocking: boolean;
};

export type DocumentValidationResult = {
  isValid: boolean;
  canRelease: boolean;
  errors: ReleaseValidationError[];
  warnings: ReleaseValidationError[];
};
