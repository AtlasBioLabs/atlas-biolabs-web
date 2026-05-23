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

type HplcFormState = {
  document_number: string;
  status: string;
  method_name: string;
  method_code: string;
  instrument_name: string;
  column_type: string;
  mobile_phase: string;
  flow_rate: string;
  detection_wavelength: string;
  injection_volume: string;
  run_time: string;
  sample_concentration: string;
  retention_time: string;
  purity_percent: string;
  main_peak_area: string;
  total_peak_area: string;
  chromatogram_file_url: string;
  raw_data_file_url: string;
  analyst_name: string;
  reviewer_name: string;
  result_summary: string;
  pass_fail_decision: string;
  acceptance_criteria: string;
  notes: string;
  watermark_mode: string;
};

const statusOptions = ["draft", "under_review", "correction_required", "approved", "released", "superseded", "void"];
const passFailOptions = ["pass", "fail", "conditional"];
const watermarkOptions = ["none", "draft", "sample"];

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

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1 text-sm font-medium">
      <span>{label}</span>
      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
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

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="space-y-1 text-sm font-medium">
      <span>{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function HplcEditForm({ supabase, id }: { supabase: SupabaseClient; id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<HplcFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReport() {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase.from("hplc_reports").select("*").eq("id", id).maybeSingle();
      if (!isMounted) return;

      if (error || !data) {
        setErrorMessage(error?.message || "HPLC report was not found.");
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
        column_type: stringValue(data.column_type),
        mobile_phase: stringValue(data.mobile_phase),
        flow_rate: stringValue(data.flow_rate),
        detection_wavelength: stringValue(data.detection_wavelength),
        injection_volume: stringValue(data.injection_volume),
        run_time: stringValue(data.run_time),
        sample_concentration: stringValue(data.sample_concentration),
        retention_time: stringValue(data.retention_time),
        purity_percent: stringValue(data.purity_percent),
        main_peak_area: stringValue(data.main_peak_area),
        total_peak_area: stringValue(data.total_peak_area),
        chromatogram_file_url: stringValue(data.chromatogram_file_url),
        raw_data_file_url: stringValue(data.raw_data_file_url),
        analyst_name: stringValue(data.analyst_name),
        reviewer_name: stringValue(data.reviewer_name),
        result_summary: stringValue(data.result_summary),
        pass_fail_decision: stringValue(data.pass_fail_decision || "conditional"),
        acceptance_criteria: stringValue(data.acceptance_criteria),
        notes: stringValue(data.notes),
        watermark_mode: stringValue(data.watermark_mode || "draft"),
      });
      setIsLoading(false);
    }

    loadReport();
    return () => { isMounted = false; };
  }, [id, supabase]);

  function updateField<K extends keyof HplcFormState>(key: K, value: HplcFormState[K]) {
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
      column_type: form.column_type,
      mobile_phase: form.mobile_phase,
      flow_rate: numberValue(form.flow_rate),
      detection_wavelength: numberValue(form.detection_wavelength),
      injection_volume: numberValue(form.injection_volume),
      run_time: numberValue(form.run_time),
      sample_concentration: form.sample_concentration || null,
      retention_time: nullableNumberValue(form.retention_time),
      purity_percent: numberValue(form.purity_percent),
      main_peak_area: numberValue(form.main_peak_area),
      total_peak_area: numberValue(form.total_peak_area),
      chromatogram_file_url: form.chromatogram_file_url || null,
      raw_data_file_url: form.raw_data_file_url || null,
      analyst_name: form.analyst_name,
      reviewer_name: form.reviewer_name || null,
      result_summary: form.result_summary,
      pass_fail_decision: form.pass_fail_decision,
      acceptance_criteria: form.acceptance_criteria,
      notes: form.notes || null,
      watermark_mode: form.watermark_mode,
    };

    const { error } = await supabase.from("hplc_reports").update(payload).eq("id", id);
    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("HPLC report saved.");
    router.refresh();
  }

  if (isLoading) return <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading HPLC report...</CardContent></Card>;
  if (!form) return <Card className="border-red-300 bg-red-50"><CardContent className="p-4 text-red-900">{errorMessage}</CardContent></Card>;

  return (
    <div className="space-y-6">
      {errorMessage ? <Card className="border-red-300 bg-red-50"><CardContent className="p-4 text-sm text-red-900">{errorMessage}</CardContent></Card> : null}
      {message ? <Card className="border-green-300 bg-green-50"><CardContent className="p-4 text-sm text-green-900">{message}</CardContent></Card> : null}
      <Card>
        <CardHeader>
          <CardTitle>Edit HPLC Purity Report</CardTitle>
          <CardDescription>{form.document_number}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <SelectField label="Status" value={form.status} options={statusOptions} onChange={(value) => updateField("status", value)} />
          <SelectField label="Pass / Fail Decision" value={form.pass_fail_decision} options={passFailOptions} onChange={(value) => updateField("pass_fail_decision", value)} />
          <InputField label="Method Name" value={form.method_name} onChange={(value) => updateField("method_name", value)} />
          <InputField label="Method Code" value={form.method_code} onChange={(value) => updateField("method_code", value)} />
          <InputField label="Instrument Name" value={form.instrument_name} onChange={(value) => updateField("instrument_name", value)} />
          <InputField label="Column Type" value={form.column_type} onChange={(value) => updateField("column_type", value)} />
          <InputField label="Mobile Phase" value={form.mobile_phase} onChange={(value) => updateField("mobile_phase", value)} />
          <InputField label="Flow Rate" value={form.flow_rate} type="number" onChange={(value) => updateField("flow_rate", value)} />
          <InputField label="Detection Wavelength" value={form.detection_wavelength} type="number" onChange={(value) => updateField("detection_wavelength", value)} />
          <InputField label="Injection Volume" value={form.injection_volume} type="number" onChange={(value) => updateField("injection_volume", value)} />
          <InputField label="Run Time" value={form.run_time} type="number" onChange={(value) => updateField("run_time", value)} />
          <InputField label="Sample Concentration" value={form.sample_concentration} onChange={(value) => updateField("sample_concentration", value)} />
          <InputField label="Retention Time" value={form.retention_time} type="number" onChange={(value) => updateField("retention_time", value)} />
          <InputField label="Purity Percent" value={form.purity_percent} type="number" onChange={(value) => updateField("purity_percent", value)} />
          <InputField label="Main Peak Area" value={form.main_peak_area} type="number" onChange={(value) => updateField("main_peak_area", value)} />
          <InputField label="Total Peak Area" value={form.total_peak_area} type="number" onChange={(value) => updateField("total_peak_area", value)} />
          <InputField label="Chromatogram File URL" value={form.chromatogram_file_url} onChange={(value) => updateField("chromatogram_file_url", value)} />
          <InputField label="Raw Data File URL" value={form.raw_data_file_url} onChange={(value) => updateField("raw_data_file_url", value)} />
          <InputField label="Analyst Name" value={form.analyst_name} onChange={(value) => updateField("analyst_name", value)} />
          <InputField label="Reviewer Name" value={form.reviewer_name} onChange={(value) => updateField("reviewer_name", value)} />
          <SelectField label="Watermark" value={form.watermark_mode} options={watermarkOptions} onChange={(value) => updateField("watermark_mode", value)} />
          <TextAreaField label="Result Summary" value={form.result_summary} onChange={(value) => updateField("result_summary", value)} />
          <TextAreaField label="Acceptance Criteria" value={form.acceptance_criteria} onChange={(value) => updateField("acceptance_criteria", value)} />
          <TextAreaField label="Notes" value={form.notes} onChange={(value) => updateField("notes", value)} />
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save HPLC Report"}</Button>
        <Button asChild variant="outline"><Link href="/admin/quality/document-bundles">Back to Bundles</Link></Button>
      </div>
    </div>
  );
}

export default function EditHplcReportPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "COA Admin", path: "/admin/coa-verifications" },
    { name: "HPLC Reports", path: "/admin/quality/hplc-reports" },
    { name: "Edit HPLC", path: `/admin/quality/hplc-reports/${id}/edit` },
  ];

  return (
    <AdminGuard title="Edit HPLC Report" description="Review and update HPLC purity report details." breadcrumbs={breadcrumbs}>
      {({ supabase }) => <HplcEditForm supabase={supabase} id={id} />}
    </AdminGuard>
  );
}
