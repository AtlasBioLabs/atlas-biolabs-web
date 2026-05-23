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

type SdsFormState = {
  document_number: string;
  status: string;
  revision: string;
  issue_date: string;
  revision_date: string;
  language: string;
  jurisdiction: string;
  signal_word: string;
  ghs_classification: string;
  pictograms_json: string;
  hazard_statements_json: string;
  precautionary_statements_json: string;
  prepared_by: string;
  reviewed_by: string;
  approved_by: string;
  section_1_identification: string;
  section_2_hazard_identification: string;
  section_3_composition: string;
  section_4_first_aid: string;
  section_5_fire_fighting: string;
  section_6_accidental_release: string;
  section_7_handling_storage: string;
  section_8_exposure_controls: string;
  section_9_physical_chemical: string;
  section_10_stability_reactivity: string;
  section_11_toxicological: string;
  section_12_ecological: string;
  section_13_disposal: string;
  section_14_transport: string;
  section_15_regulatory: string;
  section_16_other: string;
};

const statusOptions = ["draft", "under_review", "active", "superseded", "void"];
const languageOptions = ["en", "fr", "zh"];
const jurisdictionOptions = ["US", "EU", "CN", "International"];
const signalWordOptions = ["", "Warning", "Danger", "Not classified"];

function stringValue(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function jsonStringValue(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function jsonOrNull(value: string) {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function integerValue(value: string, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1 text-sm font-medium">
      <span>{label}</span>
      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option || "blank"} value={option}>{option || "None"}</option>)}
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

function TextAreaField({ label, value, onChange, rows = 5 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="space-y-1 text-sm font-medium md:col-span-2">
      <span>{label}</span>
      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SdsEditForm({ supabase, id }: { supabase: SupabaseClient; id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<SdsFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSds() {
      setIsLoading(true);
      setErrorMessage(null);
      const { data, error } = await supabase.from("sds_documents").select("*").eq("id", id).maybeSingle();
      if (!isMounted) return;
      if (error || !data) {
        setErrorMessage(error?.message || "SDS document was not found.");
        setForm(null);
        setIsLoading(false);
        return;
      }
      setForm({
        document_number: stringValue(data.document_number),
        status: stringValue(data.status || "draft"),
        revision: stringValue(data.revision || 1),
        issue_date: stringValue(data.issue_date),
        revision_date: stringValue(data.revision_date),
        language: stringValue(data.language || "en"),
        jurisdiction: stringValue(data.jurisdiction || "US"),
        signal_word: stringValue(data.signal_word),
        ghs_classification: jsonStringValue(data.ghs_classification),
        pictograms_json: jsonStringValue(data.pictograms_json),
        hazard_statements_json: jsonStringValue(data.hazard_statements_json),
        precautionary_statements_json: jsonStringValue(data.precautionary_statements_json),
        prepared_by: stringValue(data.prepared_by),
        reviewed_by: stringValue(data.reviewed_by),
        approved_by: stringValue(data.approved_by),
        section_1_identification: stringValue(data.section_1_identification),
        section_2_hazard_identification: stringValue(data.section_2_hazard_identification),
        section_3_composition: stringValue(data.section_3_composition),
        section_4_first_aid: stringValue(data.section_4_first_aid),
        section_5_fire_fighting: stringValue(data.section_5_fire_fighting),
        section_6_accidental_release: stringValue(data.section_6_accidental_release),
        section_7_handling_storage: stringValue(data.section_7_handling_storage),
        section_8_exposure_controls: stringValue(data.section_8_exposure_controls),
        section_9_physical_chemical: stringValue(data.section_9_physical_chemical),
        section_10_stability_reactivity: stringValue(data.section_10_stability_reactivity),
        section_11_toxicological: stringValue(data.section_11_toxicological),
        section_12_ecological: stringValue(data.section_12_ecological),
        section_13_disposal: stringValue(data.section_13_disposal),
        section_14_transport: stringValue(data.section_14_transport),
        section_15_regulatory: stringValue(data.section_15_regulatory),
        section_16_other: stringValue(data.section_16_other),
      });
      setIsLoading(false);
    }
    loadSds();
    return () => { isMounted = false; };
  }, [id, supabase]);

  function updateField<K extends keyof SdsFormState>(key: K, value: SdsFormState[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
  }

  async function handleSave() {
    if (!form) return;
    setIsSaving(true);
    setMessage(null);
    setErrorMessage(null);

    const payload = {
      status: form.status,
      revision: integerValue(form.revision),
      issue_date: form.issue_date,
      revision_date: form.revision_date,
      language: form.language,
      jurisdiction: form.jurisdiction,
      signal_word: form.signal_word || null,
      ghs_classification: jsonOrNull(form.ghs_classification),
      pictograms_json: jsonOrNull(form.pictograms_json),
      hazard_statements_json: jsonOrNull(form.hazard_statements_json),
      precautionary_statements_json: jsonOrNull(form.precautionary_statements_json),
      prepared_by: form.prepared_by,
      reviewed_by: form.reviewed_by || null,
      approved_by: form.approved_by || null,
      section_1_identification: form.section_1_identification,
      section_2_hazard_identification: form.section_2_hazard_identification,
      section_3_composition: form.section_3_composition,
      section_4_first_aid: form.section_4_first_aid,
      section_5_fire_fighting: form.section_5_fire_fighting,
      section_6_accidental_release: form.section_6_accidental_release,
      section_7_handling_storage: form.section_7_handling_storage,
      section_8_exposure_controls: form.section_8_exposure_controls,
      section_9_physical_chemical: form.section_9_physical_chemical,
      section_10_stability_reactivity: form.section_10_stability_reactivity,
      section_11_toxicological: form.section_11_toxicological,
      section_12_ecological: form.section_12_ecological,
      section_13_disposal: form.section_13_disposal,
      section_14_transport: form.section_14_transport,
      section_15_regulatory: form.section_15_regulatory,
      section_16_other: form.section_16_other,
    };

    const { error } = await supabase.from("sds_documents").update(payload).eq("id", id);
    setIsSaving(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setMessage("SDS saved.");
    router.refresh();
  }

  if (isLoading) return <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading SDS...</CardContent></Card>;
  if (!form) return <Card className="border-red-300 bg-red-50"><CardContent className="p-4 text-red-900">{errorMessage}</CardContent></Card>;

  return (
    <div className="space-y-6">
      {errorMessage ? <Card className="border-red-300 bg-red-50"><CardContent className="p-4 text-sm text-red-900">{errorMessage}</CardContent></Card> : null}
      {message ? <Card className="border-green-300 bg-green-50"><CardContent className="p-4 text-sm text-green-900">{message}</CardContent></Card> : null}
      <Card>
        <CardHeader><CardTitle>Edit Safety Data Sheet</CardTitle><CardDescription>{form.document_number}</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <SelectField label="Status" value={form.status} options={statusOptions} onChange={(value) => updateField("status", value)} />
          <InputField label="Revision" value={form.revision} type="number" onChange={(value) => updateField("revision", value)} />
          <InputField label="Issue Date" value={form.issue_date} type="date" onChange={(value) => updateField("issue_date", value)} />
          <InputField label="Revision Date" value={form.revision_date} type="date" onChange={(value) => updateField("revision_date", value)} />
          <SelectField label="Language" value={form.language} options={languageOptions} onChange={(value) => updateField("language", value)} />
          <SelectField label="Jurisdiction" value={form.jurisdiction} options={jurisdictionOptions} onChange={(value) => updateField("jurisdiction", value)} />
          <SelectField label="Signal Word" value={form.signal_word} options={signalWordOptions} onChange={(value) => updateField("signal_word", value)} />
          <InputField label="Prepared By" value={form.prepared_by} onChange={(value) => updateField("prepared_by", value)} />
          <InputField label="Reviewed By" value={form.reviewed_by} onChange={(value) => updateField("reviewed_by", value)} />
          <InputField label="Approved By" value={form.approved_by} onChange={(value) => updateField("approved_by", value)} />
          <TextAreaField label="GHS Classification JSON / Text" value={form.ghs_classification} onChange={(value) => updateField("ghs_classification", value)} rows={3} />
          <TextAreaField label="Pictograms JSON / Text" value={form.pictograms_json} onChange={(value) => updateField("pictograms_json", value)} rows={3} />
          <TextAreaField label="Hazard Statements JSON / Text" value={form.hazard_statements_json} onChange={(value) => updateField("hazard_statements_json", value)} rows={3} />
          <TextAreaField label="Precautionary Statements JSON / Text" value={form.precautionary_statements_json} onChange={(value) => updateField("precautionary_statements_json", value)} rows={3} />
          <TextAreaField label="1. Identification" value={form.section_1_identification} onChange={(value) => updateField("section_1_identification", value)} />
          <TextAreaField label="2. Hazard Identification" value={form.section_2_hazard_identification} onChange={(value) => updateField("section_2_hazard_identification", value)} />
          <TextAreaField label="3. Composition / Information on Ingredients" value={form.section_3_composition} onChange={(value) => updateField("section_3_composition", value)} />
          <TextAreaField label="4. First-Aid Measures" value={form.section_4_first_aid} onChange={(value) => updateField("section_4_first_aid", value)} />
          <TextAreaField label="5. Fire-Fighting Measures" value={form.section_5_fire_fighting} onChange={(value) => updateField("section_5_fire_fighting", value)} />
          <TextAreaField label="6. Accidental Release Measures" value={form.section_6_accidental_release} onChange={(value) => updateField("section_6_accidental_release", value)} />
          <TextAreaField label="7. Handling and Storage" value={form.section_7_handling_storage} onChange={(value) => updateField("section_7_handling_storage", value)} />
          <TextAreaField label="8. Exposure Controls / Personal Protection" value={form.section_8_exposure_controls} onChange={(value) => updateField("section_8_exposure_controls", value)} />
          <TextAreaField label="9. Physical and Chemical Properties" value={form.section_9_physical_chemical} onChange={(value) => updateField("section_9_physical_chemical", value)} />
          <TextAreaField label="10. Stability and Reactivity" value={form.section_10_stability_reactivity} onChange={(value) => updateField("section_10_stability_reactivity", value)} />
          <TextAreaField label="11. Toxicological Information" value={form.section_11_toxicological} onChange={(value) => updateField("section_11_toxicological", value)} />
          <TextAreaField label="12. Ecological Information" value={form.section_12_ecological} onChange={(value) => updateField("section_12_ecological", value)} />
          <TextAreaField label="13. Disposal Considerations" value={form.section_13_disposal} onChange={(value) => updateField("section_13_disposal", value)} />
          <TextAreaField label="14. Transport Information" value={form.section_14_transport} onChange={(value) => updateField("section_14_transport", value)} />
          <TextAreaField label="15. Regulatory Information" value={form.section_15_regulatory} onChange={(value) => updateField("section_15_regulatory", value)} />
          <TextAreaField label="16. Other Information" value={form.section_16_other} onChange={(value) => updateField("section_16_other", value)} />
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save SDS"}</Button>
        <Button asChild variant="outline"><Link href="/admin/quality/document-bundles">Back to Bundles</Link></Button>
      </div>
    </div>
  );
}

export default function EditSdsPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "COA Admin", path: "/admin/coa-verifications" },
    { name: "SDS", path: "/admin/quality/safety-data-sheets" },
    { name: "Edit SDS", path: `/admin/quality/safety-data-sheets/${id}/edit` },
  ];
  return <AdminGuard title="Edit Safety Data Sheet" description="Review and update SDS 16-section safety information." breadcrumbs={breadcrumbs}>{({ supabase }) => <SdsEditForm supabase={supabase} id={id} />}</AdminGuard>;
}
