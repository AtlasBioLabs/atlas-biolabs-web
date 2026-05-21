"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CopyIcon,
  CopyPlusIcon,
  ExternalLinkIcon,
  EyeIcon,
  RefreshCcwIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { CoaAnalyticalRecordsEditor } from "@/components/admin/coa-analytical-records-editor";
import { CoaAnalyticalResultsEditor } from "@/components/admin/coa-analytical-results-editor";
import { CoaStatusBadge } from "@/components/admin/coa-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  analyticalBatchResultPresets,
  analyticalMethodPresets,
  analyticalRecordAvailabilityPresets,
  analyticalSpecificationPresets,
  analyticalStatusPresets,
  buildDefaultAnalyticalRecordRows,
  buildDefaultAnalyticalTestRows,
  type CoaAnalyticalRecordDraftRow,
  type CoaAnalyticalTestDraftRow,
} from "@/lib/coa-fixed-rows";
import {
  buildCoaNumberFromVerificationCode,
  buildPublicVerificationPath,
  buildVerificationUrl,
  createCoaVerificationRecord,
  duplicateCoaVerificationRecord,
  generateVerificationCode,
  getCoaAdminWarnings,
  getCoaVerificationEditorData,
  getDefaultCoaFormValues,
  releaseDecisionOptions,
  syncSummaryFieldsFromAnalyticalTables,
  updateCoaVerificationRecord,
  verificationStatusOptions,
  type CoaVerificationFormValues,
} from "@/lib/coa-verification-admin";
import { cn } from "@/lib/utils";

type CoaVerificationFormProps = {
  supabase: SupabaseClient;
  mode: "create" | "edit";
  recordId?: string;
};

type FieldConfig = {
  name: keyof CoaVerificationFormValues;
  label: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  datalistOptions?: readonly string[];
};

type FormSection = {
  title: string;
  description: string;
  fields: FieldConfig[];
};

const inputClassName =
  "h-11 border-[#d5def0] bg-white px-4 text-[var(--brand-navy)] placeholder:text-slate-400";
const textareaClassName =
  "min-h-28 w-full rounded-lg border border-[#d5def0] bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

const formSections: FormSection[] = [
  {
    title: "Header / Document Control",
    description: "Document identifiers, public verification routing, and release header fields.",
    fields: [
      { name: "coa_number", label: "COA Number", required: true },
      { name: "verification_code", label: "Verification Code", required: true },
      {
        name: "verification_url",
        label: "Verification URL",
        readOnly: true,
        placeholder: "Auto-generated from verification code",
      },
      { name: "issue_date", label: "Issue Date", required: true },
      { name: "revision", label: "Revision", required: true },
      {
        name: "verification_status",
        label: "Verification Status",
        required: true,
        datalistOptions: verificationStatusOptions,
      },
      {
        name: "release_decision",
        label: "Release Decision",
        required: true,
        datalistOptions: releaseDecisionOptions,
      },
    ],
  },
  {
    title: "Product Identification",
    description: "Core product identity, specification, and storage details shown on page 1.",
    fields: [
      { name: "product_name", label: "Product Name", required: true },
      { name: "catalog_code", label: "Catalog Code", required: true },
      { name: "client_recipient", label: "Client / Recipient", required: true },
      { name: "peptide_sequence", label: "Peptide Sequence" },
      { name: "molecular_weight", label: "Molecular Weight" },
      { name: "molecular_formula", label: "Molecular Formula" },
      { name: "physical_form", label: "Physical Form" },
      {
        name: "appearance_spec",
        label: "Appearance Spec",
        datalistOptions: analyticalSpecificationPresets,
      },
      { name: "grade_scope", label: "Grade / Scope" },
      { name: "pack_size", label: "Pack Size" },
      { name: "storage", label: "Storage" },
      { name: "retest_period", label: "Retest Period" },
    ],
  },
  {
    title: "Batch Summary",
    description: "Manufacturing, packaging, release site, and shipment details referenced in the COA body.",
    fields: [
      { name: "batch_lot_no", label: "Batch / Lot No.", required: true },
      { name: "manufacture_date", label: "Manufacture Date" },
      { name: "retest_expiry_date", label: "Retest / Expiry" },
      { name: "batch_quantity", label: "Batch Quantity" },
      { name: "manufacturing_site", label: "Manufacturing Site" },
      { name: "country_of_origin", label: "Country of Origin" },
      { name: "release_site", label: "Release Site" },
      { name: "packaging", label: "Packaging" },
      { name: "label_option", label: "Label Option" },
      { name: "shipping_conditions", label: "Shipping Conditions" },
      {
        name: "document_pack",
        label: "Document Pack",
        required: true,
        textarea: true,
      },
      {
        name: "intended_use_scope",
        label: "Intended Use & Documentation Scope",
        textarea: true,
      },
    ],
  },
  {
    title: "Authorization",
    description: "Internal preparation, review, and approval references displayed in the certification block.",
    fields: [
      { name: "created_by", label: "Prepared / Created By" },
      { name: "prepared_at", label: "Prepared Date" },
      { name: "reviewed_by", label: "Reviewed By" },
      { name: "reviewed_at", label: "Review Date" },
      { name: "approved_by", label: "Approved By" },
      { name: "approved_at", label: "Approved At" },
      { name: "coa_pdf_url", label: "COA PDF URL" },
      { name: "qr_code_url", label: "QR Code URL" },
    ],
  },
];

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#d9e1ec] bg-[#f8fbff] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--brand-navy)]">{value || "Pending"}</p>
    </div>
  );
}

export function CoaVerificationForm({
  supabase,
  mode,
  recordId,
}: CoaVerificationFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CoaVerificationFormValues>(getDefaultCoaFormValues);
  const [analyticalResults, setAnalyticalResults] = useState<CoaAnalyticalTestDraftRow[]>(
    () => buildDefaultAnalyticalTestRows(getDefaultCoaFormValues())
  );
  const [analyticalRecords, setAnalyticalRecords] = useState<CoaAnalyticalRecordDraftRow[]>(
    () => buildDefaultAnalyticalRecordRows(getDefaultCoaFormValues())
  );
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const warnings = useMemo(() => getCoaAdminWarnings(values), [values]);
  const publicVerificationPath = buildPublicVerificationPath(values.verification_code);
  const printRoute = recordId ? `/admin/coa-verifications/${recordId}/print` : null;

  useEffect(() => {
    if (mode !== "edit" || !recordId) {
      return;
    }

    const safeRecordId = recordId;
    let isMounted = true;

    async function loadRecord() {
      setIsLoading(true);
      setFormError(null);

      try {
        const editorData = await getCoaVerificationEditorData(supabase, safeRecordId);

        if (!isMounted) {
          return;
        }

        if (!editorData) {
          setFormError("The requested COA record could not be found.");
          setIsLoading(false);
          return;
        }

        const nextValues = {
          ...editorData.values,
          verification_url: buildVerificationUrl(
            editorData.values.verification_code,
            window.location.origin
          ),
        };
        setValues(nextValues);
        setAnalyticalResults(editorData.analyticalResults);
        setAnalyticalRecords(editorData.analyticalRecords);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setFormError(
          error instanceof Error
            ? error.message
            : "The COA record could not be loaded."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRecord();

    return () => {
      isMounted = false;
    };
  }, [mode, recordId, supabase]);

  function commitAnalyticalState(
    nextResults: CoaAnalyticalTestDraftRow[],
    nextRecords: CoaAnalyticalRecordDraftRow[]
  ) {
    setAnalyticalResults(nextResults);
    setAnalyticalRecords(nextRecords);
    setValues((currentValues) =>
      syncSummaryFieldsFromAnalyticalTables(currentValues, nextResults, nextRecords)
    );
  }

  function updateField(name: keyof CoaVerificationFormValues, value: string) {
    setValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [name]: value,
      } as CoaVerificationFormValues;

      if (name === "verification_code") {
        nextValues.verification_code = value.toUpperCase();
        nextValues.verification_url = buildVerificationUrl(
          nextValues.verification_code,
          typeof window !== "undefined" ? window.location.origin : null
        );

        if (!currentValues.coa_number.trim()) {
          nextValues.coa_number = buildCoaNumberFromVerificationCode(
            nextValues.verification_code
          );
        }
      }

      return nextValues;
    });
  }

  function updateAnalyticalResultRow(
    rowKey: CoaAnalyticalTestDraftRow["row_key"],
    field: "method" | "specification" | "batch_result" | "status",
    value: string
  ) {
    const nextResults = analyticalResults.map((row) =>
      row.row_key === rowKey ? { ...row, [field]: value } : row
    );
    commitAnalyticalState(nextResults, analyticalRecords);
  }

  function updateAnalyticalRecordRow(
    rowKey: CoaAnalyticalRecordDraftRow["row_key"],
    field: "reference_file_name" | "availability",
    value: string
  ) {
    const nextRecords = analyticalRecords.map((row) =>
      row.row_key === rowKey ? { ...row, [field]: value } : row
    );
    commitAnalyticalState(analyticalResults, nextRecords);
  }

  async function handleGenerateCode() {
    if (!values.catalog_code.trim()) {
      setFormError("Enter a catalog code before generating a verification code.");
      return;
    }

    setIsGeneratingCode(true);
    setFormError(null);

    try {
      const verificationCode = await generateVerificationCode({
        supabase,
        catalogCode: values.catalog_code,
      });

      setValues((currentValues) => ({
        ...currentValues,
        verification_code: verificationCode,
        verification_url: buildVerificationUrl(
          verificationCode,
          typeof window !== "undefined" ? window.location.origin : null
        ),
        coa_number:
          currentValues.coa_number.trim() ||
          buildCoaNumberFromVerificationCode(verificationCode),
      }));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Verification code generation failed."
      );
    } finally {
      setIsGeneratingCode(false);
    }
  }

  async function handleCopyVerificationUrl() {
    const verificationUrl =
      values.verification_url ||
      buildVerificationUrl(
        values.verification_code,
        typeof window !== "undefined" ? window.location.origin : null
      );

    if (!verificationUrl) {
      setCopyMessage("Add a verification code first.");
      return;
    }

    await navigator.clipboard.writeText(verificationUrl);
    setCopyMessage("Verification URL copied.");
    window.setTimeout(() => setCopyMessage(null), 2500);
  }

  async function handleDuplicateRecord() {
    if (!recordId) {
      return;
    }

    if (
      !window.confirm(
        "You are duplicating this COA as a new record. A new COA number, verification code, and verification URL will be generated."
      )
    ) {
      return;
    }

    setIsDuplicating(true);
    setFormError(null);

    try {
      const duplicatedRecord = await duplicateCoaVerificationRecord(supabase, recordId);

      if (!duplicatedRecord) {
        throw new Error("The duplicated COA record was not returned after creation.");
      }

      router.push(`/admin/coa-verifications/${duplicatedRecord.id}/edit?duplicated=1`);
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "The COA record could not be duplicated."
      );
    } finally {
      setIsDuplicating(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (
      warnings.length > 0 &&
      !window.confirm(
        `Please confirm you want to save with the following warning(s):\n\n${warnings.join("\n")}`
      )
    ) {
      return;
    }

    setIsSaving(true);

    try {
      const nextValues = syncSummaryFieldsFromAnalyticalTables(
        {
          ...values,
          verification_code: values.verification_code.trim().toUpperCase(),
          verification_url: buildVerificationUrl(
            values.verification_code,
            window.location.origin
          ),
        },
        analyticalResults,
        analyticalRecords
      );

      if (mode === "create") {
        const createdRecord = await createCoaVerificationRecord(supabase, nextValues, {
          analyticalResults,
          analyticalRecords,
        });

        if (!createdRecord) {
          throw new Error("The COA record was not returned after creation.");
        }

        router.replace(`/admin/coa-verifications/${createdRecord.id}/edit?created=1`);
        router.refresh();
        return;
      }

      if (!recordId) {
        throw new Error("Record id is required for edits.");
      }

      await updateCoaVerificationRecord(supabase, recordId, nextValues, {
        analyticalResults,
        analyticalRecords,
      });
      setFormSuccess("COA record updated successfully.");
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "The COA record could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function renderField(field: FieldConfig) {
    const datalistId = `coa-${field.name}-options`;

    if (field.name === "verification_code") {
      return (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id={field.name}
              value={values[field.name]}
              onChange={(event) => updateField(field.name, event.target.value)}
              required={field.required}
              autoComplete="off"
              spellCheck={false}
              className={cn(inputClassName, "flex-1")}
              placeholder="ATL-BPC157-2026-001-X9K4P2"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateCode}
              disabled={isGeneratingCode}
              className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              <RefreshCcwIcon className="mr-1 size-4" />
              {isGeneratingCode ? "Generating..." : "Generate Code"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            The generated format uses catalog code, year, sequence, and a random
            uppercase suffix. You can still edit the code manually.
          </p>
        </div>
      );
    }

    if (field.readOnly) {
      return (
        <Input
          id={field.name}
          value={values[field.name]}
          readOnly
          className={cn(inputClassName, "bg-slate-50")}
          placeholder={field.placeholder}
        />
      );
    }

    if (field.textarea) {
      return (
        <textarea
          id={field.name}
          value={values[field.name]}
          onChange={(event) => updateField(field.name, event.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={textareaClassName}
        />
      );
    }

    return (
      <>
        <Input
          id={field.name}
          list={field.datalistOptions ? datalistId : undefined}
          value={values[field.name]}
          onChange={(event) => updateField(field.name, event.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={inputClassName}
        />
        {field.datalistOptions ? (
          <datalist id={datalistId}>
            {field.datalistOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        ) : null}
      </>
    );
  }

  if (isLoading) {
    return (
      <Card className="surface-card border p-0">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading COA record...
        </CardContent>
      </Card>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card className="surface-card border p-0">
        <CardHeader className="border-b border-border/70 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl text-[var(--brand-navy)]">
                {mode === "create" ? "New COA verification record" : "Edit COA verification record"}
              </CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Atlas Labs verification status must remain aligned with the record contents,
                printable COA layout, and public verification output.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CoaStatusBadge status={values.verification_status} />
              <Button
                type="button"
                variant="outline"
                className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                onClick={handleCopyVerificationUrl}
              >
                <CopyIcon className="mr-1 size-4" />
                Copy Verification URL
              </Button>
              {recordId ? (
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                  onClick={handleDuplicateRecord}
                  disabled={isDuplicating}
                >
                  <CopyPlusIcon className="mr-1 size-4" />
                  {isDuplicating ? "Duplicating..." : "Duplicate / Copy as New"}
                </Button>
              ) : null}
              {printRoute ? (
                <Button
                  asChild
                  variant="outline"
                  className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                >
                  <Link href={printRoute}>
                    <EyeIcon className="mr-1 size-4" />
                    Preview / Print COA
                  </Link>
                </Button>
              ) : null}
              <Button
                asChild
                variant="outline"
                className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                <Link href="/admin/coa-verifications">Back to Records</Link>
              </Button>
              {values.verification_code ? (
                <Button
                  asChild
                  variant="outline"
                  className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                >
                  <Link href={publicVerificationPath} target="_blank" rel="noreferrer">
                    <ExternalLinkIcon className="mr-1 size-4" />
                    View Public Verification
                  </Link>
                </Button>
              ) : null}
              <Button
                type="submit"
                className="bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-blue)]"
                disabled={isSaving}
              >
                {isSaving
                  ? mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : mode === "create"
                    ? "Create COA Record"
                    : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 py-6">
          {formError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {formError}
            </div>
          ) : null}
          {formSuccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {formSuccess}
            </div>
          ) : null}
          {copyMessage ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {copyMessage}
            </div>
          ) : null}
          {warnings.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
              <p className="font-semibold">QA release warning</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="surface-card border p-0">
        <CardContent className="space-y-8 py-6">
          {formSections.slice(0, 3).map((section) => (
            <section
              key={section.title}
              className="space-y-4 border-b border-border/70 pb-8 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  {section.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    className={cn("space-y-2", field.textarea ? "md:col-span-2" : "")}
                  >
                    <label
                      className="text-sm font-medium text-[var(--brand-navy)]"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="space-y-4 border-b border-border/70 pb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Release Snapshot
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The public verification summary and page-1 release snapshot stay synced
                from the fixed analytical table below.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Verification Status" value={values.verification_status} />
              <SummaryCard label="Release Decision" value={values.release_decision} />
              <SummaryCard label="Identity Summary" value={values.identity_result} />
              <SummaryCard label="HPLC Purity Summary" value={values.hplc_purity} />
              <SummaryCard label="Water Content Summary" value={values.water_content} />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[var(--brand-navy)]"
                htmlFor="verification_message"
              >
                Verification Message
              </label>
              <textarea
                id="verification_message"
                value={values.verification_message}
                onChange={(event) => updateField("verification_message", event.target.value)}
                required
                className={textareaClassName}
              />
            </div>
          </section>

          <section className="space-y-4 border-b border-border/70 pb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Analytical Test Results
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Fixed analytical rows mirror the printable COA. Row labels are locked,
                but methods, specifications, batch results, and status remain editable.
              </p>
            </div>
            <CoaAnalyticalResultsEditor
              rows={analyticalResults}
              methodOptions={analyticalMethodPresets}
              specificationOptions={analyticalSpecificationPresets}
              batchResultOptions={analyticalBatchResultPresets}
              statusOptions={analyticalStatusPresets}
              onChange={updateAnalyticalResultRow}
            />
          </section>

          <section className="space-y-4 border-b border-border/70 pb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Analytical Records Referenced
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Fixed reference rows stay aligned with the COA template while allowing
                batch-specific file names and access notes to be updated.
              </p>
            </div>
            <CoaAnalyticalRecordsEditor
              rows={analyticalRecords}
              availabilityOptions={analyticalRecordAvailabilityPresets}
              onChange={updateAnalyticalRecordRow}
            />
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Authorization
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Internal preparation, review, and approval references displayed in the certification block.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {formSections[3]?.fields.map((field) => (
                <div
                  key={field.name}
                  className={cn("space-y-2", field.textarea ? "md:col-span-2" : "")}
                >
                  <label
                    className="text-sm font-medium text-[var(--brand-navy)]"
                    htmlFor={field.name}
                  >
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </form>
  );
}
