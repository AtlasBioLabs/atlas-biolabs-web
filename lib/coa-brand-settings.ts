import type { SupabaseClient } from "@supabase/supabase-js";

export type CoaBrandSettings = {
  id?: string;
  company_name: string;
  quality_unit_name: string;
  tagline: string;
  controlled_document_label: string;
  document_type: string;
  certificate_title: string;
  certificate_subtitle: string;
  document_note: string;
  certification_statement: string;
  authorized_signature_text: string;
  seal_text: string;
  logo_url: string;
  seal_url: string;
  footer_text: string;
  verification_base_url: string;
  document_class: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

type CoaBrandSettingsRow = {
  id: string;
  company_name: string;
  quality_unit_name: string;
  tagline: string;
  controlled_document_label: string | null;
  document_type: string | null;
  certificate_title: string | null;
  certificate_subtitle: string | null;
  document_note: string | null;
  certification_statement: string | null;
  authorized_signature_text: string | null;
  seal_text: string | null;
  logo_url: string | null;
  seal_url: string | null;
  footer_text: string;
  verification_base_url: string;
  document_class: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export function getDefaultCoaBrandSettings(): CoaBrandSettings {
  return {
    company_name: "Atlas Labs",
    quality_unit_name: "Quality Documentation Unit",
    tagline:
      "Precision Research Compounds - Batch Documentation - Analytical Traceability",
    controlled_document_label: "Controlled Document",
    document_type: "Certificate of Analysis",
    certificate_title: "CERTIFICATE OF ANALYSIS",
    certificate_subtitle:
      "Batch-specific quality documentation for qualified B2B sourcing review",
    document_note:
      "This COA record is prepared for buyer review and must be matched to the final batch-specific HPLC, MS/LC-MS and QA release records before commercial shipment.",
    certification_statement:
      "Atlas Labs confirms that the product identity, specifications and release status listed in this document apply only to the batch/lot number referenced above. Final certification requires completed batch-specific analytical records and authorized signature. This document does not provide dosage, treatment, medical, diagnostic, veterinary or human-use instructions.",
    authorized_signature_text: "Authorized QA release signature required",
    seal_text: "Atlas Labs Seal / Stamp",
    logo_url: "",
    seal_url: "",
    footer_text:
      "Atlas BioLabs / Atlas Labs - Batch documentation. Final release requires authorized signature and batch-specific analytical records.",
    verification_base_url: "https://atlasbiolabs.co/verify",
    document_class: "Batch QA record",
    is_active: true,
  };
}

function mapRow(row: CoaBrandSettingsRow): CoaBrandSettings {
  return {
    id: row.id,
    company_name: row.company_name,
    quality_unit_name: row.quality_unit_name,
    tagline: row.tagline,
    controlled_document_label:
      row.controlled_document_label ?? "Controlled Document",
    document_type: row.document_type ?? "Certificate of Analysis",
    certificate_title: row.certificate_title ?? "CERTIFICATE OF ANALYSIS",
    certificate_subtitle:
      row.certificate_subtitle ??
      "Batch-specific quality documentation for qualified B2B sourcing review",
    document_note:
      row.document_note ??
      "This COA record is prepared for buyer review and must be matched to the final batch-specific HPLC, MS/LC-MS and QA release records before commercial shipment.",
    certification_statement:
      row.certification_statement ??
      "Atlas Labs confirms that the product identity, specifications and release status listed in this document apply only to the batch/lot number referenced above. Final certification requires completed batch-specific analytical records and authorized signature. This document does not provide dosage, treatment, medical, diagnostic, veterinary or human-use instructions.",
    authorized_signature_text:
      row.authorized_signature_text ?? "Authorized QA release signature required",
    seal_text: row.seal_text ?? "Atlas Labs Seal / Stamp",
    logo_url: row.logo_url ?? "",
    seal_url: row.seal_url ?? "",
    footer_text: row.footer_text,
    verification_base_url: row.verification_base_url,
    document_class: row.document_class,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getActiveCoaBrandSettings(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("coa_brand_settings")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (/coa_brand_settings/i.test(error.message)) {
      return getDefaultCoaBrandSettings();
    }
    throw error;
  }

  if (!data) {
    return getDefaultCoaBrandSettings();
  }

  return mapRow(data as CoaBrandSettingsRow);
}

export async function saveCoaBrandSettings(
  supabase: SupabaseClient,
  values: CoaBrandSettings
) {
  const payload = {
    company_name: values.company_name.trim(),
    quality_unit_name: values.quality_unit_name.trim(),
    tagline: values.tagline.trim(),
    controlled_document_label: values.controlled_document_label.trim(),
    document_type: values.document_type.trim(),
    certificate_title: values.certificate_title.trim(),
    certificate_subtitle: values.certificate_subtitle.trim(),
    document_note: values.document_note.trim(),
    certification_statement: values.certification_statement.trim(),
    authorized_signature_text: values.authorized_signature_text.trim(),
    seal_text: values.seal_text.trim(),
    logo_url: values.logo_url.trim() || null,
    seal_url: values.seal_url.trim() || null,
    footer_text: values.footer_text.trim(),
    verification_base_url: values.verification_base_url.trim(),
    document_class: values.document_class.trim(),
    is_active: true,
  };

  const { data: existing } = await supabase
    .from("coa_brand_settings")
    .select("id")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from("coa_brand_settings")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return mapRow(data as CoaBrandSettingsRow);
  }

  const { data, error } = await supabase
    .from("coa_brand_settings")
    .insert(payload)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return mapRow(data as CoaBrandSettingsRow);
}
