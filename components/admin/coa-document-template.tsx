"use client";
/* eslint-disable @next/next/no-img-element */

import QRCode from "react-qr-code";

import {
  buildDefaultAnalyticalRecordRows,
  buildDefaultAnalyticalTestRows,
} from "@/lib/coa-fixed-rows";
import type { CoaBrandSettings } from "@/lib/coa-brand-settings";
import type { CoaVerificationRecord } from "@/lib/coa-verification";
import {
  deriveAnalyticalStatus,
  getCoaStatusLabel,
  getDefaultIntendedUseScope,
  type CoaAnalyticalRecordRow,
  type CoaAnalyticalTestResultRow,
} from "@/lib/coa-verification-admin";

type CoaDocumentTemplateProps = {
  coa: CoaVerificationRecord;
  branding: CoaBrandSettings;
  verificationUrl: string;
  analyticalResults?: CoaAnalyticalTestResultRow[];
  analyticalRecords?: CoaAnalyticalRecordRow[];
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

function displayValue(value?: string | null, fallback = "N/A") {
  return value && value.trim().length > 0 ? value : fallback;
}

function buildTemplateAnalyticalRows(
  coa: CoaVerificationRecord,
  analyticalResults?: CoaAnalyticalTestResultRow[]
) {
  const defaultRows = buildDefaultAnalyticalTestRows({
    appearance_spec: coa.appearanceSpec ?? undefined,
    appearance_result: coa.appearanceResult ?? undefined,
    identity_result: coa.identityResult,
    hplc_purity: coa.hplcPurity,
    purity_result: coa.purityResult ?? undefined,
    peptide_content_result: coa.peptideContentResult ?? undefined,
    water_content: coa.waterContent,
    counter_ion_result: coa.counterIonResult ?? undefined,
    residual_solvents_result: coa.residualSolventsResult ?? undefined,
    heavy_metals_result: coa.heavyMetalsResult ?? undefined,
    microbial_limits_result: coa.microbialLimitsResult ?? undefined,
    endotoxin_sterility_result: coa.endotoxinSterilityResult ?? undefined,
  });

  const rowMap = new Map((analyticalResults ?? []).map((row) => [row.row_key, row]));

  return defaultRows.map((row) => {
    const existing = rowMap.get(row.row_key);
    return {
      attribute: row.test_attribute,
      method: existing?.method?.trim() || row.method,
      specification: existing?.specification?.trim() || row.specification,
      result: existing?.batch_result?.trim() || row.batch_result,
      status:
        existing?.status?.trim() ||
        deriveAnalyticalStatus(existing?.batch_result ?? row.batch_result),
    };
  });
}

function buildTemplateAnalyticalRecordRows(
  coa: CoaVerificationRecord,
  analyticalRecords?: CoaAnalyticalRecordRow[]
) {
  const defaultRows = buildDefaultAnalyticalRecordRows({
    hplc_file_name: coa.hplcFileName ?? undefined,
    lcms_file_name: coa.lcmsFileName ?? undefined,
    sds_file_name: coa.sdsFileName ?? undefined,
    raw_data_archive_ref: coa.rawDataArchiveRef ?? undefined,
  });

  const rowMap = new Map((analyticalRecords ?? []).map((row) => [row.row_key, row]));

  return defaultRows.map((row) => {
    const existing = rowMap.get(row.row_key);
    return {
      recordType: row.record_type,
      referenceFileName:
        existing?.reference_file_name?.trim() || row.reference_file_name,
      availability: existing?.availability?.trim() || row.availability,
    };
  });
}

function CoaHeader({
  branding,
  coa,
}: {
  branding: CoaBrandSettings;
  coa: CoaVerificationRecord;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-[#cad5e4] pb-4">
      <div className="flex items-start gap-4">
        {branding.logo_url ? (
          <img
            src={branding.logo_url}
            alt={`${branding.company_name} logo`}
            className="max-h-14 w-auto object-contain"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#cad5e4] bg-[#f7faff] px-2 text-center text-[10px] font-semibold text-[var(--brand-navy)]">
            {branding.company_name}
          </div>
        )}
        <div className="space-y-1">
          <p className="text-lg font-semibold tracking-tight text-[var(--brand-navy)]">
            {branding.company_name}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
            {branding.quality_unit_name}
          </p>
          <p className="max-w-xl text-[11px] leading-relaxed text-slate-600">
            {branding.tagline}
          </p>
        </div>
      </div>
        <div className="min-w-[220px] border border-[#cad5e4] bg-[#f8fbff] px-4 py-3 text-[11px] text-[var(--brand-navy)]">
          <p className="font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            {branding.controlled_document_label}
          </p>
        <dl className="mt-2 space-y-1.5">
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

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
        {title}
      </p>
      {subtitle ? <p className="text-[11px] leading-relaxed text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

function KeyValueTable({
  rows,
}: {
  rows: Array<{ label: string; value?: string | null }>;
}) {
  return (
    <div className="overflow-hidden border border-[#cad5e4]">
      <table className="min-w-full border-collapse text-left text-[11px]">
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.label}-${row.value ?? ""}`}>
              <td className="w-[28%] border-b border-[#cad5e4] bg-[#f8fbff] px-3 py-2 font-semibold text-[var(--brand-navy)]">
                {row.label}
              </td>
              <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                {displayValue(row.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CoaDocumentTemplate({
  coa,
  branding,
  verificationUrl,
  analyticalResults,
  analyticalRecords,
}: CoaDocumentTemplateProps) {
  const statusLabel = getCoaStatusLabel(coa.verificationStatus);
  const statusTone = getStatusTone(coa.verificationStatus);
  const intendedUseScope = coa.intendedUseScope || getDefaultIntendedUseScope();
  const analyticalRows = buildTemplateAnalyticalRows(coa, analyticalResults);
  const analyticalRecordRows = buildTemplateAnalyticalRecordRows(coa, analyticalRecords);

  return (
    <div className="space-y-6">
      <article className="coa-print-page mx-auto w-full max-w-[8.27in] bg-white text-[12px] leading-relaxed text-[var(--brand-navy)]">
        <CoaHeader branding={branding} coa={coa} />

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="space-y-2">
            <h2 className="text-[28px] font-semibold tracking-tight text-[var(--brand-navy)]">
              {branding.certificate_title}
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-600">
              {branding.certificate_subtitle}
            </p>
          </div>
          <div className={`border px-4 py-4 text-center ${statusTone}`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              Status
            </p>
            <p className="mt-2 text-base font-semibold">{statusLabel}</p>
          </div>
        </div>

        <div className="mt-4 border border-[#cad5e4] bg-[#f8fbff] px-4 py-3 text-[11px] text-slate-700">
          {branding.document_note}
        </div>

        <div className="mt-5 space-y-5">
          <section className="space-y-2.5">
            <SectionHeading title="Document Summary" />
            <KeyValueTable
              rows={[
                { label: "COA Number", value: coa.coaNumber },
                { label: "Issue Date", value: coa.issueDate },
                { label: "Client / Recipient", value: coa.clientRecipient },
                { label: "Prepared By", value: coa.createdBy },
                { label: "Document Type", value: branding.document_type },
                { label: "Revision", value: coa.revision },
              ]}
            />
          </section>

          <section className="space-y-2.5">
            <SectionHeading title="Product Identification" />
            <KeyValueTable
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

          <section className="space-y-2.5">
            <SectionHeading title="Batch Summary" />
            <KeyValueTable
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

          <section className="space-y-2.5">
            <SectionHeading title="Release Snapshot" />
            <KeyValueTable
              rows={[
                { label: "Identity", value: coa.identityResult },
                { label: "HPLC Purity", value: coa.hplcPurity },
                { label: "Water Content", value: coa.waterContent },
                { label: "Release Decision", value: coa.releaseDecision },
              ]}
            />
          </section>

          <section className="space-y-2.5">
            <SectionHeading title="Intended Use & Documentation Scope" />
            <div className="border border-[#cad5e4] bg-[#f8fbff] px-4 py-3 text-[11px] leading-relaxed text-slate-700">
              {intendedUseScope}
            </div>
          </section>
        </div>

        <footer className="mt-6 border-t border-[#cad5e4] pt-3 text-[10px] leading-relaxed text-slate-500">
          {branding.footer_text}
        </footer>
      </article>

      <div className="coa-print-break" />

      <article className="coa-print-page mx-auto w-full max-w-[8.27in] bg-white text-[12px] leading-relaxed text-[var(--brand-navy)]">
        <CoaHeader branding={branding} coa={coa} />

        <div className="mt-4 border border-[#cad5e4] bg-[#f8fbff] px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Analytical Results & Quality Review
          </p>
          <h3 className="mt-1 text-[24px] font-semibold tracking-tight text-[var(--brand-navy)]">
            Analytical Results & Quality Review
          </h3>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Batch-specific analytical summary aligned to the referenced release file set.
          </p>
        </div>

        <div className="mt-5 space-y-5">
          <section className="space-y-2.5">
            <SectionHeading title="Analytical Test Results" />
            <div className="overflow-hidden border border-[#cad5e4]">
              <table className="coa-print-table min-w-full border-collapse text-left text-[10.5px]">
                <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
                  <tr>
                    <th className="w-[18%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Test / Attribute
                    </th>
                    <th className="w-[20%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Method
                    </th>
                    <th className="w-[22%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Specification
                    </th>
                    <th className="w-[26%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Batch Result
                    </th>
                    <th className="w-[14%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticalRows.map((row) => (
                    <tr key={row.attribute} className="align-top">
                      <td className="border-b border-[#cad5e4] px-3 py-2 font-medium text-[var(--brand-navy)]">
                        {row.attribute}
                      </td>
                      <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                        {displayValue(row.method)}
                      </td>
                      <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                        {displayValue(row.specification)}
                      </td>
                      <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                        {displayValue(row.result)}
                      </td>
                      <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                        {displayValue(row.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2.5">
            <SectionHeading title="Analytical Records Referenced" />
            <div className="overflow-hidden border border-[#cad5e4]">
              <table className="coa-print-table min-w-full border-collapse text-left text-[10.5px]">
                <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
                  <tr>
                    <th className="w-[30%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Record Type
                    </th>
                    <th className="w-[45%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Reference / File Name
                    </th>
                    <th className="w-[25%] border-b border-[#cad5e4] px-3 py-2 font-semibold">
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticalRecordRows.map((row) => (
                    <tr key={row.recordType}>
                      <td className="border-b border-[#cad5e4] px-3 py-2 font-medium text-[var(--brand-navy)]">
                        {row.recordType}
                      </td>
                      <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                        {displayValue(row.referenceFileName)}
                      </td>
                      <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                        {displayValue(row.availability)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2.5">
            <SectionHeading title="Certification Statement" />
            <div className="border border-[#cad5e4] bg-[#f8fbff] px-4 py-3 text-[11px] leading-relaxed text-slate-700">
              {branding.certification_statement}
            </div>
          </section>

          <section className="space-y-2.5">
            <SectionHeading title="Authorization" />
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden border border-[#cad5e4]">
                <table className="min-w-full border-collapse text-left text-[10.5px]">
                  <tbody>
                    {[
                      { label: "Prepared By", value: coa.createdBy },
                      { label: "Prepared Date", value: coa.preparedAt || coa.issueDate },
                      { label: "Reviewed By", value: coa.reviewedBy },
                      { label: "Review Date", value: coa.reviewedAt || coa.issueDate },
                      { label: "Approved By", value: coa.approvedBy },
                      { label: "Approved Date", value: coa.approvedAt || coa.issueDate },
                      {
                        label: "Authorized Signature",
                        value: branding.authorized_signature_text,
                      },
                      {
                        label: "Company Seal",
                        value: branding.seal_url ? "See seal image" : branding.seal_text,
                      },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className="w-[34%] border-b border-[#cad5e4] bg-[#f8fbff] px-3 py-2 font-medium text-[var(--brand-navy)]">
                          {row.label}
                        </td>
                        <td className="border-b border-[#cad5e4] px-3 py-2 text-slate-700">
                          {displayValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border border-[#cad5e4] bg-[#f8fbff] p-4">
                <div className="space-y-4">
                  {branding.seal_url ? (
                    <img
                      src={branding.seal_url}
                      alt={`${branding.company_name} seal`}
                      className="max-h-20 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-20 items-center justify-center border border-dashed border-[#9eb8ff] bg-white text-center text-[11px] font-medium text-[var(--brand-navy)]">
                      {branding.seal_text}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                      Verification URL
                    </p>
                    <p className="mt-2 break-all text-[10.5px] leading-relaxed text-slate-700">
                      {verificationUrl}
                    </p>
                  </div>
                  <div className="mx-auto w-full max-w-[156px] bg-white p-3">
                    <QRCode
                      value={verificationUrl}
                      size={132}
                      style={{ height: "auto", width: "100%" }}
                      fgColor="#0A1A2F"
                      bgColor="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-6 border-t border-[#cad5e4] pt-3 text-[10px] leading-relaxed text-slate-500">
          {branding.footer_text}
        </footer>
      </article>
    </div>
  );
}
