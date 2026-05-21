"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyIcon, ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { CoaStatusBadge } from "@/components/admin/coa-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  buildPublicVerificationPath,
  buildVerificationUrl,
  createCoaVerificationRecord,
  generateVerificationCode,
  getCoaAdminWarnings,
  getCoaVerificationRowById,
  getDefaultCoaFormValues,
  mapRowToFormValues,
  releaseDecisionOptions,
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
};

const inputClassName =
  "h-11 border-[#d5def0] bg-white px-4 text-[var(--brand-navy)] placeholder:text-slate-400";
const textareaClassName =
  "min-h-28 w-full rounded-lg border border-[#d5def0] bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";
const selectClassName =
  "h-11 w-full rounded-lg border border-[#d5def0] bg-white px-4 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

const groupedFields: Array<{
  title: string;
  description: string;
  fields: FieldConfig[];
}> = [
  {
    title: "Header / Document Control",
    description: "Core document identifiers and public verification routing.",
    fields: [
      { name: "coa_number", label: "COA Number", required: true },
      { name: "verification_code", label: "Verification Code", required: true },
      {
        name: "verification_url",
        label: "Verification URL",
        placeholder: "Auto-generated from verification code",
        readOnly: true,
      },
      { name: "issue_date", label: "Issue Date", required: true },
      { name: "revision", label: "Revision", required: true },
    ],
  },
  {
    title: "Product Identification",
    description: "Commercial product details printed on the COA header.",
    fields: [
      { name: "product_name", label: "Product Name", required: true },
      { name: "catalog_code", label: "Catalog Code", required: true },
      { name: "client_recipient", label: "Client / Recipient", required: true },
    ],
  },
  {
    title: "Batch Summary",
    description: "Batch and verification notes used for customer traceability.",
    fields: [
      { name: "batch_lot_no", label: "Batch / Lot No.", required: true },
      {
        name: "document_pack",
        label: "Document Pack",
        required: true,
        textarea: true,
      },
      {
        name: "verification_message",
        label: "Verification Message",
        required: true,
        textarea: true,
      },
    ],
  },
  {
    title: "Authorization",
    description: "Internal QA sign-off details and release ownership fields.",
    fields: [
      { name: "created_by", label: "Created By" },
      { name: "reviewed_by", label: "Reviewed By" },
      { name: "approved_by", label: "Approved By" },
      { name: "approved_at", label: "Approved At" },
    ],
  },
  {
    title: "Analytical Test Results",
    description: "Key result statements visible to Atlas Labs buyers and QA staff.",
    fields: [
      { name: "identity_result", label: "Identity Result", required: true, textarea: true },
      { name: "hplc_purity", label: "HPLC Purity", required: true },
      { name: "water_content", label: "Water Content", required: true },
      { name: "appearance_result", label: "Appearance Result", textarea: true },
      { name: "purity_result", label: "Purity Result", textarea: true },
      { name: "peptide_content_result", label: "Peptide Content Result", textarea: true },
      { name: "counter_ion_result", label: "Counter Ion Result", textarea: true },
      {
        name: "residual_solvents_result",
        label: "Residual Solvents Result",
        textarea: true,
      },
      { name: "heavy_metals_result", label: "Heavy Metals Result", textarea: true },
      { name: "microbial_limits_result", label: "Microbial Limits Result", textarea: true },
      {
        name: "endotoxin_sterility_result",
        label: "Endotoxin / Sterility Result",
        textarea: true,
      },
    ],
  },
  {
    title: "Analytical Records Referenced",
    description: "Supporting file references and internal archive pointers.",
    fields: [
      { name: "hplc_file_name", label: "HPLC File Name" },
      { name: "lcms_file_name", label: "LC-MS File Name" },
      { name: "sds_file_name", label: "SDS File Name" },
      { name: "raw_data_archive_ref", label: "Raw Data Archive Reference" },
      { name: "coa_pdf_url", label: "COA PDF URL" },
      { name: "qr_code_url", label: "QR Code URL" },
    ],
  },
];

export function CoaVerificationForm({
  supabase,
  mode,
  recordId,
}: CoaVerificationFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CoaVerificationFormValues>(getDefaultCoaFormValues);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const warnings = useMemo(() => getCoaAdminWarnings(values), [values]);
  const publicVerificationPath = buildPublicVerificationPath(values.verification_code);

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
        const row = await getCoaVerificationRowById(supabase, safeRecordId);

        if (!isMounted) {
          return;
        }

        if (!row) {
          setFormError("The requested COA record could not be found.");
          setIsLoading(false);
          return;
        }

        const nextValues = mapRowToFormValues(row);
        nextValues.verification_url = buildVerificationUrl(
          nextValues.verification_code,
          window.location.origin
        );
        setValues(nextValues);
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

  function updateField(
    name: keyof CoaVerificationFormValues,
    value: string | CoaVerificationFormValues["release_decision"] | CoaVerificationFormValues["verification_status"]
  ) {
    setValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [name]: value,
      } as CoaVerificationFormValues;

      if (name === "verification_code") {
        nextValues.verification_code = String(value).toUpperCase();
        nextValues.verification_url = buildVerificationUrl(
          nextValues.verification_code,
          typeof window !== "undefined" ? window.location.origin : null
        );
      }

      return nextValues;
    });
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
      const nextValues = {
        ...values,
        verification_code: values.verification_code.trim().toUpperCase(),
        verification_url: buildVerificationUrl(
          values.verification_code,
          window.location.origin
        ),
      };

      if (mode === "create") {
        const createdRecord = await createCoaVerificationRecord(supabase, nextValues);

        if (!createdRecord) {
          throw new Error("The COA record was not returned after creation.");
        }

        setFormSuccess("COA record created successfully.");
        router.replace(`/admin/coa-verifications/${createdRecord.id}/edit?created=1`);
        router.refresh();
        return;
      }

      if (!recordId) {
        throw new Error("Record id is required for edits.");
      }

      await updateCoaVerificationRecord(supabase, recordId, nextValues);
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
                Atlas Labs verification status must remain aligned with the record contents
                and public verification output.
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
          {groupedFields.map((group) => (
            <section key={group.title} className="space-y-4 border-b border-border/70 pb-8 last:border-b-0 last:pb-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  {group.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {group.fields.map((field) => (
                  <div
                    key={field.name}
                    className={cn(
                      "space-y-2",
                      field.textarea ? "md:col-span-2" : ""
                    )}
                  >
                    <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor={field.name}>
                      {field.label}
                    </label>
                    {field.name === "verification_code" ? (
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
                    ) : field.name === "verification_url" ? (
                      <Input
                        id={field.name}
                        value={values[field.name]}
                        readOnly
                        className={cn(inputClassName, "bg-slate-50")}
                        placeholder={field.placeholder}
                      />
                    ) : field.name === "release_decision" ? (
                      <select
                        id={field.name}
                        value={values.release_decision}
                        onChange={(event) => updateField(field.name, event.target.value as CoaVerificationFormValues["release_decision"])}
                        className={selectClassName}
                      >
                        {releaseDecisionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.name === "verification_status" ? (
                      <select
                        id={field.name}
                        value={values.verification_status}
                        onChange={(event) => updateField(field.name, event.target.value as CoaVerificationFormValues["verification_status"])}
                        className={selectClassName}
                      >
                        {verificationStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.textarea ? (
                      <textarea
                        id={field.name}
                        value={values[field.name]}
                        onChange={(event) => updateField(field.name, event.target.value)}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={textareaClassName}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        value={values[field.name]}
                        onChange={(event) => updateField(field.name, event.target.value)}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={inputClassName}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Release Snapshot
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Final public-facing release state that controls how the verification page should
                present this COA.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="release_decision">
                  Release Decision
                </label>
                <select
                  id="release_decision"
                  value={values.release_decision}
                  onChange={(event) =>
                    updateField(
                      "release_decision",
                      event.target.value as CoaVerificationFormValues["release_decision"]
                    )
                  }
                  className={selectClassName}
                >
                  {releaseDecisionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="verification_status">
                  Verification Status
                </label>
                <select
                  id="verification_status"
                  value={values.verification_status}
                  onChange={(event) =>
                    updateField(
                      "verification_status",
                      event.target.value as CoaVerificationFormValues["verification_status"]
                    )
                  }
                  className={selectClassName}
                >
                  {verificationStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </form>
  );
}
