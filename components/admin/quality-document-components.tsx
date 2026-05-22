/**
 * Document Watermark and Branding Components
 * Provides components for displaying watermarks and using consistent branding across all documents
 */

import React from "react";

interface WatermarkProps {
  mode: "none" | "draft" | "sample";
  children: React.ReactNode;
}

/**
 * Wrapper component that adds watermark to document content
 */
export function DocumentWithWatermark({ mode, children }: WatermarkProps) {
  if (mode === "none") {
    return <>{children}</>;
  }

  const watermarkText =
    mode === "sample"
      ? "SAMPLE / DEMO — NOT FOR RELEASE OR CUSTOMER USE"
      : "DRAFT — DOCUMENT NOT YET APPROVED";

  return (
    <div className="relative">
      {/* Watermark background */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-10 ${
          mode === "sample" ? "bg-red-100" : "bg-yellow-100"
        }`}
        style={{
          transform: "rotate(-45deg)",
          textAlign: "center",
        }}
      >
        <div className="text-center">
          <p className="text-5xl font-bold tracking-wider text-gray-500">
            {watermarkText}
          </p>
        </div>
      </div>

      {/* Document content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Document header with Atlas BioLabs branding
 */
interface DocumentHeaderProps {
  logoUrl?: string;
  companyName?: string;
  documentType?: string;
}

export function DocumentHeader({
  logoUrl = "/images/atlas-biolabs-logo.png",
  companyName = "Atlas BioLabs",
  documentType = "Certificate of Analysis",
}: DocumentHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between border-b-2 border-[var(--brand-navy)] pb-6">
      <div className="flex items-center gap-4">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Atlas BioLabs Logo"
            className="h-16 w-auto"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-navy)]">
            {companyName}
          </h1>
          <p className="text-lg font-semibold text-gray-600">{documentType}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Document footer with compliance and contact information
 */
interface DocumentFooterProps {
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  usOffice?: string;
  chinaOffice?: string;
  complianceText?: string;
}

export function DocumentFooter({
  companyPhone = "+1 805 941 0541",
  companyEmail = "sales@atlasbiolabs.co",
  companyWebsite = "www.atlasbiolabs.co",
  usOffice = "29520 Kohoutek Way, Union City, CA 94587, USA",
  chinaOffice = "No.333 Guiping Road, Shanghai, China",
  complianceText = "This document is prepared for qualified buyers for research and commercial purposes. Not for human consumption or medical use.",
}: DocumentFooterProps) {
  return (
    <div className="mt-12 border-t border-gray-300 pt-6 text-xs text-gray-600">
      <div className="grid grid-cols-2 gap-8 pb-6">
        <div>
          <p className="font-semibold text-gray-800">Contact Information</p>
          <p>{companyPhone}</p>
          <p>{companyEmail}</p>
          <p>{companyWebsite}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Offices</p>
          <p>
            <span className="font-semibold">US:</span> {usOffice}
          </p>
          <p>
            <span className="font-semibold">China:</span> {chinaOffice}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-300 pt-4">
        <p className="italic">{complianceText}</p>
      </div>
    </div>
  );
}

/**
 * Signature block for analytical documents
 */
interface SignatureBlockProps {
  analystName?: string;
  analystTitle?: string;
  analystDate?: string;
  reviewerName?: string;
  reviewerTitle?: string;
  reviewerDate?: string;
  approverName?: string;
  approverTitle?: string;
  approverDate?: string;
}

export function SignatureBlock({
  analystName,
  analystTitle = "Analyst",
  analystDate,
  reviewerName,
  reviewerTitle = "Technical Reviewer",
  reviewerDate,
  approverName,
  approverTitle = "QA Manager",
  approverDate,
}: SignatureBlockProps) {
  return (
    <div className="mt-8">
      <p className="mb-6 font-semibold text-gray-800">Approvals and Signatures</p>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-8 text-center">
          <div className="h-16 border-b border-gray-400"></div>
          <div>
            {analystName && <p className="font-semibold">{analystName}</p>}
            <p className="text-xs text-gray-600">{analystTitle}</p>
            {analystDate && (
              <p className="text-xs text-gray-500">Date: {analystDate}</p>
            )}
          </div>
        </div>

        {reviewerName && (
          <div className="space-y-8 text-center">
            <div className="h-16 border-b border-gray-400"></div>
            <div>
              <p className="font-semibold">{reviewerName}</p>
              <p className="text-xs text-gray-600">{reviewerTitle}</p>
              {reviewerDate && (
                <p className="text-xs text-gray-500">Date: {reviewerDate}</p>
              )}
            </div>
          </div>
        )}

        {approverName && (
          <div className="space-y-8 text-center">
            <div className="h-16 border-b border-gray-400"></div>
            <div>
              <p className="font-semibold">{approverName}</p>
              <p className="text-xs text-gray-600">{approverTitle}</p>
              {approverDate && (
                <p className="text-xs text-gray-500">Date: {approverDate}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * QR code and verification reference block
 */
interface VerificationReferenceProps {
  verificationCode?: string;
  verificationUrl?: string;
  qrCodeUrl?: string;
  coaNumber?: string;
}

export function VerificationReference({
  verificationCode,
  verificationUrl,
  qrCodeUrl,
  coaNumber,
}: VerificationReferenceProps) {
  return (
    <div className="mt-8 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-4">
      <div>
        {coaNumber && (
          <p className="text-sm font-semibold text-gray-800">COA Number</p>
        )}
        <p className="font-mono text-sm text-gray-700">{coaNumber}</p>
        {verificationCode && (
          <>
            <p className="mt-2 text-sm font-semibold text-gray-800">
              Verification Code
            </p>
            <p className="font-mono text-sm text-gray-700">{verificationCode}</p>
          </>
        )}
        {verificationUrl && (
          <>
            <p className="mt-2 text-sm font-semibold text-gray-800">
              Verification URL
            </p>
            <p className="text-xs text-blue-600 break-all">{verificationUrl}</p>
          </>
        )}
      </div>
      {qrCodeUrl && (
        <div className="ml-4">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="h-24 w-24 border border-gray-300"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Results summary section for pass/fail decision
 */
interface ResultsSummaryProps {
  title?: string;
  resultSummary?: string;
  passFailDecision?: "pass" | "fail" | "conditional";
  acceptanceCriteria?: string;
}

export function ResultsSummary({
  title = "Results Summary",
  resultSummary,
  passFailDecision,
  acceptanceCriteria,
}: ResultsSummaryProps) {
  const resultColor =
    passFailDecision === "pass"
      ? "bg-green-50 border-green-300"
      : passFailDecision === "fail"
        ? "bg-red-50 border-red-300"
        : "bg-yellow-50 border-yellow-300";

  const resultTextColor =
    passFailDecision === "pass"
      ? "text-green-800"
      : passFailDecision === "fail"
        ? "text-red-800"
        : "text-yellow-800";

  return (
    <div className={`rounded-lg border-2 p-4 ${resultColor}`}>
      <p className="mb-2 font-semibold text-gray-800">{title}</p>
      {resultSummary && <p className="text-sm text-gray-700">{resultSummary}</p>}
      {acceptanceCriteria && (
        <p className="mt-2 text-xs text-gray-600">
          <span className="font-semibold">Acceptance Criteria:</span>{" "}
          {acceptanceCriteria}
        </p>
      )}
      {passFailDecision && (
        <p className={`mt-3 text-lg font-bold ${resultTextColor}`}>
          Result: {passFailDecision.toUpperCase()}
        </p>
      )}
    </div>
  );
}
