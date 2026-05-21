alter table public.coa_verifications
  add column if not exists prepared_at text,
  add column if not exists reviewed_at text;

alter table public.coa_brand_settings
  add column if not exists controlled_document_label text,
  add column if not exists document_type text,
  add column if not exists certificate_title text,
  add column if not exists certificate_subtitle text,
  add column if not exists document_note text,
  add column if not exists certification_statement text,
  add column if not exists authorized_signature_text text,
  add column if not exists seal_text text;

update public.coa_brand_settings
set
  controlled_document_label = coalesce(controlled_document_label, 'Controlled Document'),
  document_type = coalesce(document_type, 'Certificate of Analysis'),
  certificate_title = coalesce(certificate_title, 'CERTIFICATE OF ANALYSIS'),
  certificate_subtitle = coalesce(
    certificate_subtitle,
    'Batch-specific quality documentation for qualified B2B sourcing review'
  ),
  document_note = coalesce(
    document_note,
    'This COA record is prepared for buyer review and must be matched to the final batch-specific HPLC, MS/LC-MS and QA release records before commercial shipment.'
  ),
  certification_statement = coalesce(
    certification_statement,
    'Atlas Labs confirms that the product identity, specifications and release status listed in this document apply only to the batch/lot number referenced above. Final certification requires completed batch-specific analytical records and authorized signature. This document does not provide dosage, treatment, medical, diagnostic, veterinary or human-use instructions.'
  ),
  authorized_signature_text = coalesce(
    authorized_signature_text,
    'Authorized QA release signature required'
  ),
  seal_text = coalesce(seal_text, 'Atlas Labs Seal / Stamp')
where true;
