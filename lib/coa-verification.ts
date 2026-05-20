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
};

const coaVerificationRecords: CoaVerificationRecord[] = [
  {
    verificationCode: "ATL-BPC157-2026-001-X9K4P2",
    coaNumber: "COA-ATL-BPC157-2026-001",
    productName: "BPC-157 Acetate",
    catalogCode: "ATL-BPC157",
    batchLotNo: "ABLL-BPC157-2026-001",
    issueDate: "20 May 2026",
    revision: "Rev. 01",
    clientRecipient: "MagLab / Qualified B2B Buyer",
    identityResult: "LC-MS/MS: Conforms",
    hplcPurity: "99.21%",
    waterContent: "1.6%",
    releaseDecision: "Released / Conforms",
    verificationStatus: "Released / Verified",
    documentPack: "COA, HPLC, MS/LC-MS, SDS",
    verificationMessage:
      "This COA matches Atlas Labs batch records and has been released by QA.",
  },
  {
    verificationCode: "ATL-SEMAGLUTIDE-2026-001-PENDING",
    coaNumber: "COA-ATL-SEMAGLUTIDE-2026-001",
    productName: "Semaglutide",
    catalogCode: "ATL-SEMAGLUTIDE",
    batchLotNo: "ABLL-SEMAGLUTIDE-2026-001",
    issueDate: "20 May 2026",
    revision: "Rev. 01",
    clientRecipient: "Qualified B2B Buyer",
    identityResult: "Pending LC-MS/MS review",
    hplcPurity: "Pending HPLC report",
    waterContent: "Pending KF result",
    releaseDecision: "Pending QA Review",
    verificationStatus: "Pending QA Review",
    documentPack: "COA, HPLC, MS/LC-MS, SDS on request",
    verificationMessage:
      "This COA has not yet been released for customer verification.",
  },
  {
    verificationCode: "ATL-REVOKED-TEST-001",
    coaNumber: "COA-ATL-REVOKED-TEST-001",
    productName: "Verification Test Record",
    catalogCode: "ATL-TEST",
    batchLotNo: "ABLL-TEST-001",
    issueDate: "20 May 2026",
    revision: "Rev. 01",
    clientRecipient: "Internal Test",
    identityResult: "N/A",
    hplcPurity: "N/A",
    waterContent: "N/A",
    releaseDecision: "Rejected / Non-Conforming",
    verificationStatus: "Revoked",
    documentPack: "N/A",
    verificationMessage:
      "This COA record has been revoked and should not be accepted.",
  },
];

export function getCoaVerificationByCode(verificationCode: string) {
  const normalizedCode = verificationCode.trim().toUpperCase();

  if (!normalizedCode) {
    return null;
  }

  return (
    coaVerificationRecords.find(
      (record) => record.verificationCode.toUpperCase() === normalizedCode
    ) ?? null
  );
}
