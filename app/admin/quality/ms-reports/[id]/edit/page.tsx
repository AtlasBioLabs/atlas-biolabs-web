"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { AdminGuard } from "@/components/admin/admin-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BreadcrumbItem } from "@/lib/seo";

type MsFormState = {
  document_number: string;
  status: string;
  method_name: string;
  method_code: string;
  instrument_name: string;
  ionization_mode: string;
  expected_molecular_weight: string;
  observed_mass: string;
  mass_error: string;
  mass_error_ppm: string;
  charge_state: string;
  spectrum_file_url: string;
  raw_data_file_url: string;
  identity_conclusion: string;
  pass_fail_decision: string;
  acceptance_criteria: string;
  analyst_name: string;
  reviewer_name: string;
  notes: string;
  watermark_mode: string;
};

const statusOptions = ["draft", "under_review", "correction_required", "approved", "released", "superseded", "void"];
const passFailOptions = ["pass", "fail", "conditional"];
const watermarkOptions = ["none", "draft", "sample"];
const ionizationOptions = ["ESI+", "ESI-", "ESI+ or ESI-", "APCI+", "APCI-", "MALDI"];

function stringValue(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function numberValue(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNumberValue(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function nullableIntegerValue(value: string) {
  if (!value.trim()) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1 text-sm font-medium">
      <span>{label}</span>
      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="space-y-1 text-sm font-medium">
      <span>{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="space-y-1 text-sm font-medium md:col-span-2">
      <span>{label}</span>
      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function MsEditForm({ supabase, id }: { supabase: SupabaseClient; id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<MsFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadReport() {
      setIsLoading(true);
      setErrorMessage(null);
      const { data, error } = await supabase.from("ms_reports").select("*").eq("id", id).maybeSingle();
      if (!isMounted) return;
      if (error || !data) {
        setErrorMessage(error?.message || "MS / LC-MS report was not found.");
        setForm(null);
        setIsLoading(false);
        return;
      }
      setForm({
        document_number: stringValue(data.document_number),
        status: stringValue(data.status || "draft"),
        method_name: stringValue(data.method_name),
        method_code: stringValue(data.method_code),
        instrument_name: stringValue(data.instrument_name),
        ionization_mode: stringValue(data.ionization_mode || "ESI+ or ESI-"),
        expected_molecular_weight: stringValue(data.expected_molecular_weight),
        observed_mass: stringValue(data.observed_mass),
        mass_error: stringValue(data.mass_error),
        mass_error_ppm: stringValue(data.mass_error_ppm),
        charge_state: stringValue(data.charge_state),
        spectrum_file_url: stringValue(data.spectrum_file_url),
        raw_data_file_url: stringValue(data.raw_data_file_url),
        identity_conclusion: stringValue(data.identity_conclusion),
        pass_fail_decision: stringValue(data.pass_fail_decision || "conditional"),
        acceptance_criteria: stringValue(data.acceptance_criteria),
        analyst_name: stringValue(data.analyst_name),
        reviewer_name: stringValue(data.reviewer_name),
        notes: stringValue(data.notes),
        watermark_mode: stringValue(data.watermark_mode || "draft"),
      });
      setIsLoading(false);
    }
    loadReport();
    return () => { isMounted = false; };
  }, [id, supabase]);

  function updateField<K extends keyof MsFormState>(key: K, value: MsFormState[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
  }

  async function handleSave() {
    if (!form) return;
    setIsSaving(true);
    setErrorMessage(null);
    setMessage(null);

    const payload = {
      status: form.status,
      method_name: form.method_name,
      method_code: form.method_code || null,
      instrument_name: form.instrument_name,
      ionization_mode: form.ionization_mode,
      expected_molecular_weight: numberValue(form.expected_molecular_weight),
      observed_mass: numberValue(form.observed_mass),
      mass_error: numberValue(form.mass_error),
      mass_error_ppm: nullableNumberValue(form.mass_error_ppm),
      charge_state: nullableIntegerValue(form.charge_state),
      spectrum_file_url: form.spectrum_file_url || null,
      raw_data_file_url: form.raw_data_file_url || null,
      identity_conclusion: form.identity_conclusion,
      pass_fail_decision: form.pass_fail_decision,
      acceptance_criteria: form.acceptance_criteria,
      analyst_name: form.analyst_name,
      reviewer_name: form.reviewer_name || null,
      notes: form.notes || null,
      watermark_mode: form.watermark_mode,
    };

    const { error } = await supabase.from("ms_reports").update(payload).eq("id", id);
    setIsSaving(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setMessage("MS / LC-MS report saved.");
    router.refresh();
  }

  if (isLoading) return <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading MS / LC-MS report...</CardContent></Card>;
  if (!form) return <Card className="border-red-300 bg-red-50"><CardContent className="p-4 text-red-900">{errorMessage}</CardContent></Card>;

  return (
    <div className="space-y-6">
      {errorMessage ? <Card className="border-red-300 bg-red-50"><CardContent className="p-4 text-sm text-red-900">{errorMessage}</CardContent></Card> : null}
      {message ? <Card className="border-green-300 bg-green-50"><CardContent className="p-4 text-sm text-green-900">{message}</CardContent></Card> : null}
      <Card>
        <CardHeader><CardTitle>Edit MS / LC-MS Identity Report</CardTitle><CardDescription>{form.document_number}</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <SelectField label="Status" value={form.status} options={statusOptions} onChange={(value) => updateField("status", value)} />
          <SelectField label="Pass / Fail Decision" value={form.pass_fail_decision} options={passFailOptions} onChange={(value) => updateField("pass_fail_decision", value)} />
          <InputField label="Method Name" value={form.method_name} onChange={(value) => updateField("method_name", value)} />
          <InputField label="Method Code" value={form.method_code} onChange={(value) => updateField("method_code", value)} />
          <InputField label="Instrument Name" value={form.instrument_name} onChange={(value) => updateField("instrument_name", value)} />
          <SelectField label="Ionization Mode" value={form.ionization_mode} options={ionizationOptions} onChange={(value) => updateField("ionization_mode", value)} />
          <InputField label="Expected Molecular Weight" value={form.expected_molecular_weight} type="number" onChange={(value) => updateField("expected_molecular_weight", value)} />
          <InputField label="Observed Mass" value={form.observed_mass} type="number" onChange={(value) => updateField("observed_mass", value)} />
          <InputField label="Mass Error" value={form.mass_error} type="number" onChange={(value) => updateField("mass_error", value)} />
          <InputField label="Mass Error PPM" value={form.mass_error_ppm} type="number" onChange={(value) => updateField("mass_error_ppm", value)} />
          <InputField label="Charge State" value={form.charge_state} type="number" onChange={(value) => updateField("charge_state", value)} />
          <InputField label="Spectrum File URL" value={form.spectrum_file_url} onChange={(value) => updateField("spectrum_file_url", value)} />
          <InputField label="Raw Data File URL" value={form.raw_data_file_url} onChange={(value) => updateField("raw_data_file_url", value)} />
          <InputField label="Analyst Name" value={form.analyst_name} onChange={(value) => updateField("analyst_name", value)} />
          <InputField label="Reviewer Name" value={form.reviewer_name} onChange={(value) => updateField("reviewer_name", value)} />
          <SelectField label="Watermark" value={form.watermark_mode} options={watermarkOptions} onChange={(value) => updateField("watermark_mode", value)} />
          <TextAreaField label="Identity Conclusion" value={form.identity_conclusion} onChange={(value) => updateField("identity_conclusion", value)} />
          <TextAreaField label="Acceptance Criteria" value={form.acceptance_criteria} onChange={(value) => updateField("acceptance_criteria", value)} />
          <TextAreaField label="Notes" value={form.notes} onChange={(value) => updateField("notes", value)} />
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save MS Report"}</Button>
        <Button asChild variant="outline"><Link href="/admin/quality/document-bundles">Back to Bundles</Link></Button>
      </div>
    </div>
  );
}

export default function EditMsReportPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "COA Admin", path: "/admin/coa-verifications" },
    { name: "MS Reports", path: "/admin/quality/ms-reports" },
    { name: "Edit MS", path: `/admin/quality/ms-reports/${id}/edit` },
  ];
  return <AdminGuard title="Edit MS / LC-MS Report" description="Review and update mass spectrometry identity report details." breadcrumbs={breadcrumbs}>{({ supabase }) => <MsEditForm supabase={supabase} id={id} />}</AdminGuard>;
}
