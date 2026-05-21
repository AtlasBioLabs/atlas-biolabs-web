"use client";
/* eslint-disable @next/next/no-img-element */

import QRCode from "react-qr-code";

import type { CoaBrandSettings } from "@/lib/coa-brand-settings";
import type { CoaVerificationRecord } from "@/lib/coa-verification";
import {
  deriveAnalyticalStatus,
  getCoaStatusLabel,
  getDefaultIntendedUseScope,
} from "@/lib/coa-verification-admin";

type CoaDocumentTemplateProps = {
  coa: CoaVerificationRecord;
  branding: CoaBrandSettings;
  verificationUrl: string;
};

function getStatusTone(status: CoaVerificationRecord["verificationStatus"]) {
  switch (status) {
    case "Released / Verified":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Pending QA Review":
    case "Draft":
      return "border-amber-200 bg-amber-50 text-amber-900";
    default:
      return "border-rose-200 bg-rose-50 text-rose-800";
  }
}

function displayValue(value?: string | null, fallback = "—") {
  return value && value.trim().length > 0 ? value : fallback;
}

function CoaHeader({
  branding,
  coa,
}: {
  branding: CoaBrandSettings;
  coa: CoaVerificationRecord;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-[#d9e1ec] pb-5">
      <div className="flex items-start gap-4">
        {branding.logo_url ? (
          <img
            src={branding.logo_url}
            alt={`${branding.company_name} logo`}
            className="max-h-16 w-auto object-contain"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9e1ec] bg-[#f7faff] text-center text-xs font-semibold text-[var(--brand-navy)]">
            {branding.company_name}
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xl font-semibold tracking-tight text-[var(--brand-navy)]">
            {branding.company_name}
          </p>
          <p className="text-sm font-medium text-[var(--brand-blue)]">
            {branding.quality_unit_name}
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-slate-600">
            {branding.tagline}
          </p>
        </div>
      </div>
      <div className="min-w-[210px] rounded-xl border border-[#d9e1ec] bg-[#f8fbff] p-4 text-sm text-[var(--brand-navy)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
          Controlled Document
        </p>
        <dl className="mt-3 space-y-2">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">COA Number</dt>
            <dd className="font-medium">{coa.coaNumber}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Revision</dt>
            <dd className="font-medium">{coa.revision}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Document Class</dt>
            <dd className="font-medium">{branding.document_class}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function InfoTable({
  rows,
  columns = 2,
}: {
  rows: Array<{ label: string; value?: string | null }>;
  columns?: 2 | 4;
}) {
  const gridClass =
    columns === 4
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid gap-0 border border-[#d9e1ec] ${gridClass}`}>
      {rows.map((row) => (
        <div
          key={`${row.label}-${row.value ?? ""}`}
          className="grid grid-cols-[160px_1fr] border-b border-[#d9e1ec] px-4 py-3 text-sm last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <div className="pr-4 font-semibold text-[var(--brand-navy)]">{row.label}</div>
          <div className="text-slate-700">{displayValue(row.value)}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
        {title}
      </p>
      {subtitle ? <p className="text-sm leading-relaxed text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

export function CoaDocumentTemplate({
  coa,
  branding,
  verificationUrl,
}: CoaDocumentTemplateProps) {
  const statusLabel = getCoaStatusLabel(coa.verificationStatus);
  const statusTone = getStatusTone(coa.verificationStatus);
  const intendedUseScope = coa.intendedUseScope || getDefaultIntendedUseScope();

  const analyticalRows = [
    {
      attribute: "Appearance",
      method: "Visual inspection",
      specification: coa.appearanceSpec || "White to off-white powder",
      result: coa.appearanceResult,
    },
    {
      attribute: "Identity",
      method: "LC-MS / MS",
      specification: "Consistent with reference MW / sequence",
      result: coa.identityResult,
    },
    {
      attribute: "Purity",
      method: "RP-HPLC",
      specification: ">= 98.0% by area normalization, unless otherwise specified",
      result: coa.purityResult || coa.hplcPurity,
    },
    {
      attribute: "Peptide content",
      method: "UV / HPLC calculation",
      specification: "Report result",
      result: coa.peptideContentResult,
    },
    {
      attribute: "Water content",
      method: "Karl Fischer",
      specification: "<= 5.0%",
      result: coa.waterContent,
    },
    {
      attribute: "Counter-ion",
      method: "Ion chromatography / declaration",
      specification: "Report result",
      result: coa.counterIonResult,
    },
    {
      attribute: "Residual solvents",
      method: "GC / ICH-oriented screening",
      specification: "Meets internal limit",
      result: coa.residualSolventsResult,
    },
    {
      attribute: "Heavy metals",
      method: "ICP-MS screen",
      specification: "<= 10 ppm total",
      result: coa.heavyMetalsResult,
    },
    {
      attribute: "Microbial limits",
      method: "USP/EP-oriented screen",
      specification: "As requested / applicable",
      result: coa.microbialLimitsResult,
    },
    {
      attribute: "Endotoxin / Sterility",
      method: "LAL / sterility test",
      specification: "Not standard unless requested",
      result: coa.endotoxinSterilityResult,
    },
  ];

  return (
    <div className="space-y-6">
      <article className="coa-print-page mx-auto w-full max-w-[8.5in] bg-white text-[13px] leading-relaxed text-[var(--brand-navy)]">
        <CoaHeader branding={branding} coa={coa} />

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_240px]">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--brand-navy)]">
              CERTIFICATE OF ANALYSIS
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Batch-specific quality documentation for qualified B2B sourcing review
            </p>
          </div>
          <div className={`rounded-xl border px-4 py-4 text-center ${statusTone}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              Status
            </p>
            <p className="mt-2 text-lg font-semibold">{statusLabel}</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#d9e1ec] bg-[#f8fbff] px-4 py-4 text-sm text-slate-700">
          This COA record is prepared for buyer review and must be matched to the final
          batch-specific HPLC, MS/LC-MS and QA release records before commercial shipment.
        </div>

        <div className="mt-6 space-y-6">
          <section className="space-y-3">
            <SectionTitle title="Document Summary" />
            <InfoTable
              rows={[
                { label: "COA Number", value: coa.coaNumber },
                { label: "Issue Date", value: coa.issueDate },
                { label: "Client / Recipient", value: coa.clientRecipient },
                { label: "Prepared By", value: coa.createdBy },
                { label: "Document Type", value: "Certificate of Analysis" },
                { label: "Revision", value: coa.revision },
              ]}
            />
          </section>

          <section className="space-y-3">
            <SectionTitle title="Product Identification" />
            <InfoTable
              rows={[
                { label: "Product Name", value: coa.productName },
                { label: "Catalog Code", value: coa.catalogCode },
                { label: "Peptide Sequence", value: coa.peptideSequence },
                { label: "Batch / Lot No.", value: coa.batchLotNo },
                { label: "Molecular Weight", value: coa.molecularWeight },
                { label: "Molecular Formula", value: coa.molecularFormula },
                { label: "Physical Form", value: coa.physicalForm },
                { label: "Appearance Spec", value: coa.appearanceSpec },
                { label: "Grade / Scope", value: coa.gradeScope },
                { label: "Pack Size", value: coa.packSize },
                { label: "Storage", value: coa.storage },
                { label: "Retest Period", value: coa.retestPeriod },
              ]}
            />
          </section>

          <section className="space-y-3">
            <SectionTitle title="Batch Summary" />
            <InfoTable
              rows={[
                { label: "Manufacture Date", value: coa.manufactureDate },
                { label: "Retest / Expiry", value: coa.retestExpiryDate },
                { label: "Batch Quantity", value: coa.batchQuantity },
                { label: "Manufacturing Site", value: coa.manufacturingSite },
                { label: "Country of Origin", value: coa.countryOfOrigin },
                { label: "Release Site", value: coa.releaseSite },
                { label: "Packaging", value: coa.packaging },
                { label: "Label Option", value: coa.labelOption },
                { label: "Shipping Conditions", value: coa.shippingConditions },
                { label: "Document Pack", value: coa.documentPack },
              ]}
            />
          </section>

          <section className="space-y-3">
            <SectionTitle title="Release Snapshot" />
            <InfoTable
              rows={[
                { label: "Identity", value: coa.identityResult },
                { label: "HPLC Purity", value: coa.hplcPurity },
                { label: "Water Content", value: coa.waterContent },
                { label: "Release Decision", value: coa.releaseDecision },
              ]}
            />
          </section>

          <section className="space-y-3">
            <SectionTitle title="Intended Use & Documentation Scope" />
            <div className="rounded-xl border border-[#d9e1ec] bg-[#f8fbff] px-4 py-4 text-sm leading-relaxed text-slate-700">
              {intendedUseScope}
            </div>
          </section>
        </div>

        <footer className="mt-8 border-t border-[#d9e1ec] pt-4 text-xs leading-relaxed text-slate-500">
          {branding.footer_text}
        </footer>
      </article>

      <div className="coa-print-break" />

      <article className="coa-print-page mx-auto w-full max-w-[8.5in] bg-white text-[13px] leading-relaxed text-[var(--brand-navy)]">
        <CoaHeader branding={branding} coa={coa} />

        <div className="mt-6 rounded-xl border border-[#d9e1ec] bg-[#f8fbff] px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Analytical Results & Quality Review
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--brand-navy)]">
            Analytical Results & Quality Review
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Batch-specific analytical summary aligned to the referenced release file set.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <section className="space-y-3">
            <SectionTitle title="Analytical Test Results" />
            <div className="overflow-hidden rounded-xl border border-[#d9e1ec]">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
                  <tr>
                    <th className="border-b border-[#d9e1ec] px-4 py-3 font-semibold">Test / Attribute</th>
                    <th className="border-b border-[#d9e1ec] px-4 py-3 font-semibold">Method</th>
                    <th className="border-b border-[#d9e1ec] px-4 py-3 font-semibold">Specification</th>
                    <th className="border-b border-[#d9e1ec] px-4 py-3 font-semibold">Batch Result</th>
                    <th className="border-b border-[#d9e1ec] px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticalRows.map((row) => (
                    <tr key={row.attribute} className="align-top">
                      <td className="border-b border-[#d9e1ec] px-4 py-3 font-medium text-[var(--brand-navy)]">
                        {row.attribute}
                      </td>
                      <td className="border-b border-[#d9e1ec] px-4 py-3 text-slate-700">{row.method}</td>
                      <td className="border-b border-[#d9e1ec] px-4 py-3 text-slate-700">{row.specification}</td>
                      <td className="border-b border-[#d9e1ec] px-4 py-3 text-slate-700">
                        {displayValue(row.result)}
                      </td>
                      <td className="border-b border-[#d9e1ec] px-4 py-3 text-slate-700">
                        {deriveAnalyticalStatus(row.result)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle title="Analytical Records Referenced" />
            <div className="overflow-hidden rounded-xl border border-[#d9e1ec]">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
                  <tr>
                    <th className="border-b border-[#d9e1ec] px-4 py-3 font-semibold">Reference</th>
                    <th className="border-b border-[#d9e1ec] px-4 py-3 font-semibold">File / Archive</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "HPLC chromatogram", value: coa.hplcFileName },
                    { label: "LC-MS identity report", value: coa.lcmsFileName },
                    { label: "SDS / Safety Data Sheet", value: coa.sdsFileName },
                    { label: "Raw data archive", value: coa.rawDataArchiveRef },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="border-b border-[#d9e1ec] px-4 py-3 font-medium text-[var(--brand-navy)]">
                        {row.label}
                      </td>
                      <td className="border-b border-[#d9e1ec] px-4 py-3 text-slate-700">
                        {displayValue(row.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle title="Certification Statement" />
            <div className="rounded-xl border border-[#d9e1ec] bg-[#f8fbff] px-4 py-4 text-sm leading-relaxed text-slate-700">
              Atlas Labs confirms that the product identity, specifications and release status
              listed in this document apply only to the batch/lot number referenced above.
              Final certification requires completed batch-specific analytical records and
              authorized signature. This document does not provide dosage, treatment, medical,
              diagnostic, veterinary or human-use instructions.
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle title="Authorization" />
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="overflow-hidden rounded-xl border border-[#d9e1ec]">
                <table className="min-w-full border-collapse text-left text-sm">
                  <tbody>
                    {[
                      { label: "Prepared By", value: coa.createdBy },
                      { label: "Reviewed By", value: coa.reviewedBy },
                      { label: "Approved By", value: coa.approvedBy },
                      { label: "Date", value: coa.approvedAt || coa.issueDate },
                      {
                        label: "Authorized Signature",
                        value: "Authorized QA release signature required",
                      },
                      {
                        label: "Company Seal",
                        value: branding.seal_url ? "See seal image" : "Atlas Labs Seal / Stamp",
                      },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className="border-b border-[#d9e1ec] px-4 py-3 font-medium text-[var(--brand-navy)]">
                          {row.label}
                        </td>
                        <td className="border-b border-[#d9e1ec] px-4 py-3 text-slate-700">
                          {displayValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 rounded-xl border border-[#d9e1ec] bg-[#f8fbff] p-4">
                {branding.seal_url ? (
                  <img
                    src={branding.seal_url}
                    alt={`${branding.company_name} seal`}
                    className="max-h-24 w-auto object-contain"
                  />
                ) : (
                  <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-[#9eb8ff] bg-white text-center text-sm font-medium text-[var(--brand-navy)]">
                    Atlas Labs Seal / Stamp
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                    Verification URL
                  </p>
                  <p className="mt-2 break-all text-sm leading-relaxed text-slate-700">
                    {verificationUrl}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <QRCode
                    value={verificationUrl}
                    size={128}
                    style={{ height: "auto", width: "100%" }}
                    fgColor="#0A1A2F"
                    bgColor="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-8 border-t border-[#d9e1ec] pt-4 text-xs leading-relaxed text-slate-500">
          {branding.footer_text}
        </footer>
      </article>
    </div>
  );
}
