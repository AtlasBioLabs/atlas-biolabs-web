"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getActiveCoaBrandSettings,
  getDefaultCoaBrandSettings,
  saveCoaBrandSettings,
  type CoaBrandSettings,
} from "@/lib/coa-brand-settings";

type CoaBrandingFormProps = {
  supabase: SupabaseClient;
};

const inputClassName =
  "h-11 border-[#d5def0] bg-white px-4 text-[var(--brand-navy)] placeholder:text-slate-400";
const textareaClassName =
  "min-h-28 w-full rounded-lg border border-[#d5def0] bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function CoaBrandingForm({ supabase }: CoaBrandingFormProps) {
  const [values, setValues] = useState<CoaBrandSettings>(getDefaultCoaBrandSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const settings = await getActiveCoaBrandSettings(supabase);

        if (!isMounted) {
          return;
        }

        setValues(settings);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Branding settings could not be loaded."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  function updateField(name: keyof CoaBrandSettings, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const savedSettings = await saveCoaBrandSettings(supabase, values);
      setValues(savedSettings);
      setSuccessMessage("COA branding settings saved.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Branding settings could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="surface-card border p-0">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading COA branding settings...
        </CardContent>
      </Card>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card className="surface-card border p-0">
        <CardHeader className="border-b border-border/70 py-6">
          <CardTitle className="text-2xl text-[var(--brand-navy)]">
            COA branding settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 py-6">
          {errorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errorMessage}
            </div>
          ) : null}
          {successMessage ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {successMessage}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="company_name">
                Company Name
              </label>
              <Input
                id="company_name"
                value={values.company_name}
                onChange={(event) => updateField("company_name", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="quality_unit_name">
                Quality Unit Name
              </label>
              <Input
                id="quality_unit_name"
                value={values.quality_unit_name}
                onChange={(event) => updateField("quality_unit_name", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="tagline">
                Tagline
              </label>
              <Input
                id="tagline"
                value={values.tagline}
                onChange={(event) => updateField("tagline", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="controlled_document_label">
                Controlled Document Label
              </label>
              <Input
                id="controlled_document_label"
                value={values.controlled_document_label}
                onChange={(event) => updateField("controlled_document_label", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="document_type">
                Document Type
              </label>
              <Input
                id="document_type"
                value={values.document_type}
                onChange={(event) => updateField("document_type", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="certificate_title">
                Certificate Title
              </label>
              <Input
                id="certificate_title"
                value={values.certificate_title}
                onChange={(event) => updateField("certificate_title", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="certificate_subtitle">
                Certificate Subtitle
              </label>
              <textarea
                id="certificate_subtitle"
                value={values.certificate_subtitle}
                onChange={(event) => updateField("certificate_subtitle", event.target.value)}
                className={textareaClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="logo_url">
                Logo URL
              </label>
              <Input
                id="logo_url"
                value={values.logo_url}
                onChange={(event) => updateField("logo_url", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="seal_url">
                Seal URL
              </label>
              <Input
                id="seal_url"
                value={values.seal_url}
                onChange={(event) => updateField("seal_url", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="seal_text">
                Company Seal Text
              </label>
              <Input
                id="seal_text"
                value={values.seal_text}
                onChange={(event) => updateField("seal_text", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="verification_base_url">
                Verification Base URL
              </label>
              <Input
                id="verification_base_url"
                value={values.verification_base_url}
                onChange={(event) => updateField("verification_base_url", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="document_class">
                Document Class
              </label>
              <Input
                id="document_class"
                value={values.document_class}
                onChange={(event) => updateField("document_class", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="document_note">
                Document Note
              </label>
              <textarea
                id="document_note"
                value={values.document_note}
                onChange={(event) => updateField("document_note", event.target.value)}
                className={textareaClassName}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="certification_statement">
                Certification Statement
              </label>
              <textarea
                id="certification_statement"
                value={values.certification_statement}
                onChange={(event) => updateField("certification_statement", event.target.value)}
                className={textareaClassName}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="authorized_signature_text">
                Authorized Signature Text
              </label>
              <Input
                id="authorized_signature_text"
                value={values.authorized_signature_text}
                onChange={(event) => updateField("authorized_signature_text", event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--brand-navy)]" htmlFor="footer_text">
                Footer Text
              </label>
              <textarea
                id="footer_text"
                value={values.footer_text}
                onChange={(event) => updateField("footer_text", event.target.value)}
                className={textareaClassName}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-blue)]"
            >
              {isSaving ? "Saving..." : "Save Branding Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
