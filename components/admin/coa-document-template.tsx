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
  getDefaultCoaFormValues,
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

const defaultCoaValues = getDefaultCoaFormValues();

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

function preferValue(
  primary?: string | null,
  fallback?: string | null,
  emptyFallback = "N/A"
) {
  const normalizedPrimary = primary?.trim();

  if (normalizedPrimary) {
    return normalizedPrimary;
  }

  const normalizedFallback = fallback?.trim();
  return normalizedFallback?.length ? normalizedFallback : emptyFallback;
}

function buildTemplateAnalyticalRows(
  coa: CoaVerificationRecord,
  analyticalResults?: CoaAnalyticalTestResultRow[]
) {
  const defaultRows = buildDefaultAnalyticalTestRows({
    appearance_spec: coa.appearanceSpec ?? defaultCoaValues.appearance_spec,
    appearance_result: coa.appearanceResult ?? defaultCoaValues.appearance_result,
    identity_result: coa.identityResult || defaultCoaValues.identity_result,
    hplc_purity: coa.hplcPurity || defaultCoaValues.hplc_purity,
    purity_result: coa.purityResult ?? defaultCoaValues.purity_result,
    peptide_content_result:
      coa.peptideContentResult ?? defaultCoaValues.peptide_content_result,
    water_content: coa.waterContent || defaultCoaValues.water_content,
    counter_ion_result: coa.counterIonResult ?? defaultCoaValues.counter_ion_result,
    residual_solvents_result:
      coa.residualSolventsResult ?? defaultCoaValues.residual_solvents_result,
    heavy_metals_result: coa.heavyMetalsResult ?? defaultCoaValues.heavy_metals_result,
    microbial_limits_result:
      coa.microbialLimitsResult ?? defaultCoaValues.microbial_limits_result,
    endotoxin_sterility_result:
      coa.endotoxinSterilityResult ?? defaultCoaValues.endotoxin_sterility_result,
  });

  const rowMap = new Map((analyticalResults ?? []).map((row) => [row.row_key, row]));

  return defaultRows.map((row) => {
    const existing = rowMap.get(row.row_key);
    const result = preferValue(existing?.batch_result, row.batch_result, "N/A");
    return {
      attribute: row.test_attribute,
      method: preferValue(existing?.method, row.method, "N/A"),
      specification: preferValue(existing?.specification, row.specification, "N/A"),
      result,
      status:
        preferValue(existing?.status, "", "") || deriveAnalyticalStatus(result),
    };
  });
}

function buildTemplateAnalyticalRecordRows(
  coa: CoaVerificationRecord,
  analyticalRecords?: CoaAnalyticalRecordRow[]
) {
  const defaultRows = buildDefaultAnalyticalRecordRows({
    hplc_file_name: coa.hplcFileName ?? defaultCoaValues.hplc_file_name,
    lcms_file_name: coa.lcmsFileName ?? defaultCoaValues.lcms_file_name,
    sds_file_name: coa.sdsFileName ?? defaultCoaValues.sds_file_name,
    raw_data_archive_ref: coa.rawDataArchiveRef ?? defaultCoaValues.raw_data_archive_ref,
  });

  const rowMap = new Map((analyticalRecords ?? []).map((row) => [row.row_key, row]));

  return defaultRows.map((row) => {
    const existing = rowMap.get(row.row_key);
    return {
      recordType: row.record_type,
      referenceFileName: preferValue(
        existing?.reference_file_name,
        row.reference_file_name,
        "N/A"
      ),
      availability: preferValue(existing?.availability, row.availability, "N/A"),
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
    <div className="flex items-start justify-between gap-3 border-b border-[#cfd8e6] pb-2.5">
      <div className="flex items-start gap-3">
        {branding.logo_url ? (
          <img
            src={branding.logo_url}
            alt={`${branding.company_name} logo`}
            className="max-h-11 w-auto object-contain"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center border border-[#cfd8e6] bg-[#f7faff] px-1 text-center text-[7px] font-semibold leading-tight text-[var(--brand-navy)]">
            {branding.company_name}
          </div>
        )}
        <div className="space-y-0.5">
          <p className="text-[15px] font-semibold tracking-tight text-[var(--brand-navy)]">
            {branding.company_name}
          </p>
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            {branding.quality_unit_name}
          </p>
          <p className="max-w-[4.7in] text-[7px] leading-[1.35] text-slate-600">
            {branding.tagline}
          </p>
        </div>
      </div>
      <div className="w-[2.08in] border border-[#cfd8e6] bg-[#f8fbff] px-2.5 py-2 text-[7px] text-[var(--brand-navy)]">
        <p className="font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
          {branding.controlled_document_label}
        </p>
        <dl className="mt-1.5 space-y-1">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-600">COA Number</dt>
            <dd className="text-right font-medium">{coa.coaNumber}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-600">Revision</dt>
            <dd className="text-right font-medium">{coa.revision}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-600">Document Class</dt>
            <dd className="text-right font-medium">{branding.document_class}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
      {title}
    </p>
  );
}

function KeyValueTable({
  rows,
}: {
  rows: Array<{ label: string; value?: string | null }>;
}) {
  return (
    <div className="overflow-hidden border border-[#cfd8e6]">
      <table className="coa-print-table coa-fixed-table min-w-full border-collapse text-left text-[7.2px] leading-[1.25]">
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.label}-${index}`}>
              <td className="w-[28%] border-b border-[#d6dce7] bg-[#f8fbff] px-[5px] py-[4px] font-semibold text-[var(--brand-navy)]">
                {row.label}
              </td>
              <td className="border-b border-[#d6dce7] px-[5px] py-[4px] text-slate-700">
                {preferValue(row.value)}
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
  const intendedUseScope = preferValue(
    coa.intendedUseScope,
    defaultCoaValues.intended_use_scope || getDefaultIntendedUseScope()
  );
  const analyticalRows = buildTemplateAnalyticalRows(coa, analyticalResults);
  const analyticalRecordRows = buildTemplateAnalyticalRecordRows(coa, analyticalRecords);

  return (
    <div className="coa-print-document">
      <section className="coa-page coa-page-one">
        <CoaHeader branding={branding} coa={coa} />

        <div className="mt-3 grid grid-cols-[1fr_1.72in] gap-3">
          <div className="space-y-1">
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--brand-navy)]">
              {branding.certificate_title}
            </h2>
            <p className="text-[7.5px] leading-[1.35] text-slate-600">
              {branding.certificate_subtitle}
            </p>
          </div>
          <div className={`border px-2.5 py-2 text-center ${statusTone}`}>
            <p className="text-[7px] font-semibold uppercase tracking-[0.16em]">Status</p>
            <p className="mt-1 text-[10px] font-semibold">{statusLabel}</p>
          </div>
        </div>

        <div className="mt-2.5 border border-[#cfd8e6] bg-[#f8fbff] px-3 py-2 text-[7.2px] leading-[1.35] text-slate-700">
          {branding.document_note}
        </div>

        <div className="mt-3 space-y-3">
          <section className="space-y-1.5">
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

          <section className="space-y-1.5">
            <SectionHeading title="Product Identification" />
            <KeyValueTable
              rows={[
                { label: "Product Name", value: coa.productName },
                { label: "Catalog Code", value: coa.catalogCode },
                { label: "Peptide Sequence", value: preferValue(coa.peptideSequence, defaultCoaValues.peptide_sequence, "N/A") },
                { label: "Batch / Lot No.", value: coa.batchLotNo },
                { label: "Molecular Weight", value: preferValue(coa.molecularWeight, defaultCoaValues.molecular_weight, "N/A") },
                { label: "Molecular Formula", value: preferValue(coa.molecularFormula, defaultCoaValues.molecular_formula, "N/A") },
                { label: "Physical Form", value: preferValue(coa.physicalForm, defaultCoaValues.physical_form, "N/A") },
                { label: "Appearance Spec", value: preferValue(coa.appearanceSpec, defaultCoaValues.appearance_spec, "N/A") },
                { label: "Grade / Scope", value: preferValue(coa.gradeScope, defaultCoaValues.grade_scope, "N/A") },
                { label: "Pack Size", value: preferValue(coa.packSize, defaultCoaValues.pack_size, "N/A") },
                { label: "Storage", value: preferValue(coa.storage, defaultCoaValues.storage, "N/A") },
                { label: "Retest Period", value: preferValue(coa.retestPeriod, defaultCoaValues.retest_period, "N/A") },
              ]}
            />
          </section>

          <section className="space-y-1.5">
            <SectionHeading title="Batch Summary" />
            <KeyValueTable
              rows={[
                { label: "Manufacture Date", value: preferValue(coa.manufactureDate, defaultCoaValues.manufacture_date, "N/A") },
                { label: "Retest / Expiry", value: preferValue(coa.retestExpiryDate, defaultCoaValues.retest_expiry_date, "N/A") },
                { label: "Batch Quantity", value: preferValue(coa.batchQuantity, defaultCoaValues.batch_quantity, "N/A") },
                { label: "Manufacturing Site", value: preferValue(coa.manufacturingSite, defaultCoaValues.manufacturing_site, "N/A") },
                { label: "Country of Origin", value: preferValue(coa.countryOfOrigin, defaultCoaValues.country_of_origin, "N/A") },
                { label: "Release Site", value: preferValue(coa.releaseSite, defaultCoaValues.release_site, "N/A") },
                { label: "Packaging", value: preferValue(coa.packaging, defaultCoaValues.packaging, "N/A") },
                { label: "Label Option", value: preferValue(coa.labelOption, defaultCoaValues.label_option, "N/A") },
                { label: "Shipping Conditions", value: preferValue(coa.shippingConditions, defaultCoaValues.shipping_conditions, "N/A") },
                { label: "Document Pack", value: preferValue(coa.documentPack, defaultCoaValues.document_pack, "N/A") },
              ]}
            />
          </section>

          <section className="space-y-1.5">
            <SectionHeading title="Release Snapshot" />
            <KeyValueTable
              rows={[
                { label: "Identity", value: preferValue(coa.identityResult, defaultCoaValues.identity_result, "N/A") },
                { label: "HPLC Purity", value: preferValue(coa.hplcPurity, defaultCoaValues.hplc_purity, "N/A") },
                { label: "Water Content", value: preferValue(coa.waterContent, defaultCoaValues.water_content, "N/A") },
                { label: "Release Decision", value: coa.releaseDecision },
              ]}
            />
          </section>

          <section className="space-y-1.5">
            <SectionHeading title="Intended Use & Documentation Scope" />
            <div className="border border-[#cfd8e6] bg-[#f8fbff] px-3 py-2 text-[7.2px] leading-[1.35] text-slate-700">
              {intendedUseScope}
            </div>
          </section>
        </div>

        <div className="mt-3 border-t border-[#cfd8e6] pt-2 text-[6.9px] leading-[1.3] text-slate-500">
          {branding.footer_text}
        </div>
      </section>

      <section className="coa-page coa-page-two">
        <CoaHeader branding={branding} coa={coa} />

        <div className="mt-3 border border-[#cfd8e6] bg-[#f8fbff] px-3 py-2.5">
          <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Analytical Results & Quality Review
          </p>
          <h3 className="mt-1 text-[14px] font-semibold tracking-tight text-[var(--brand-navy)]">
            Analytical Results & Quality Review
          </h3>
        </div>

        <div className="mt-3 space-y-3">
          <section className="space-y-1.5">
            <SectionHeading title="Analytical Test Results" />
            <div className="overflow-hidden border border-[#cfd8e6]">
              <table className="coa-print-table coa-fixed-table min-w-full border-collapse text-left text-[6.9px] leading-[1.2]">
                <thead className="bg-[var(--brand-navy)] text-white">
                  <tr>
                    <th className="w-[18%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Test / Attribute
                    </th>
                    <th className="w-[20%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Method
                    </th>
                    <th className="w-[22%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Specification
                    </th>
                    <th className="w-[26%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Batch Result
                    </th>
                    <th className="w-[14%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticalRows.map((row) => (
                    <tr key={row.attribute} className="align-top">
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] font-medium text-[var(--brand-navy)]">
                        {row.attribute}
                      </td>
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] text-slate-700">
                        {row.method}
                      </td>
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] text-slate-700">
                        {row.specification}
                      </td>
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] text-slate-700">
                        {row.result}
                      </td>
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] text-slate-700">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-1.5">
            <SectionHeading title="Analytical Records Referenced" />
            <div className="overflow-hidden border border-[#cfd8e6]">
              <table className="coa-print-table coa-fixed-table min-w-full border-collapse text-left text-[7px] leading-[1.2]">
                <thead className="bg-[var(--brand-navy)] text-white">
                  <tr>
                    <th className="w-[30%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Record Type
                    </th>
                    <th className="w-[45%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Reference / File Name
                    </th>
                    <th className="w-[25%] border border-[#cfd8e6] px-[4px] py-[4px] font-semibold">
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticalRecordRows.map((row) => (
                    <tr key={row.recordType}>
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] font-medium text-[var(--brand-navy)]">
                        {row.recordType}
                      </td>
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] text-slate-700">
                        {row.referenceFileName}
                      </td>
                      <td className="border border-[#d6dce7] px-[4px] py-[4px] text-slate-700">
                        {row.availability}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-1.5">
            <SectionHeading title="Certification Statement" />
            <div className="border border-[#cfd8e6] bg-[#f8fbff] px-3 py-2 text-[7.1px] leading-[1.35] text-slate-700">
              {branding.certification_statement}
            </div>
          </section>

          <section className="space-y-1.5">
            <SectionHeading title="Authorization" />
            <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
              <div className="overflow-hidden border border-[#cfd8e6]">
                <table className="coa-print-table coa-fixed-table min-w-full border-collapse text-left text-[7px] leading-[1.2]">
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
                        <td className="w-[34%] border border-[#d6dce7] bg-[#f8fbff] px-[4px] py-[4px] font-medium text-[var(--brand-navy)]">
                          {row.label}
                        </td>
                        <td className="border border-[#d6dce7] px-[4px] py-[4px] text-slate-700">
                          {preferValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border border-[#cfd8e6] bg-[#f8fbff] px-3 py-3">
                <div className="space-y-2.5">
                  {branding.seal_url ? (
                    <img
                      src={branding.seal_url}
                      alt={`${branding.company_name} seal`}
                      className="max-h-[0.78in] w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-[0.78in] items-center justify-center border border-dashed border-[#9eb8ff] bg-white px-2 text-center text-[7px] font-medium text-[var(--brand-navy)]">
                      {branding.seal_text}
                    </div>
                  )}
                  <div>
                    <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                      Verification URL
                    </p>
                    <p className="mt-1 break-all text-[7px] leading-[1.3] text-slate-700">
                      {verificationUrl}
                    </p>
                  </div>
                  <div className="mx-auto w-full max-w-[1.45in] bg-white p-1.5">
                    <QRCode
                      value={verificationUrl}
                      size={108}
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

        <div className="mt-3 border-t border-[#cfd8e6] pt-2 text-[6.9px] leading-[1.3] text-slate-500">
          {branding.footer_text}
        </div>
      </section>
    </div>
  );
}
