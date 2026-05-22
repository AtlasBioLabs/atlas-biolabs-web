-- Quality Documentation System Tables
-- Supports Batch, COA, HPLC, MS, SDS, Document Bundle, and Audit Logging

-- ============================================================================
-- BATCH / LOT TABLE
-- ============================================================================

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  batch_number text not null,
  lot_number text,
  manufacturing_date text not null,
  expiry_date text not null,
  retest_date text,
  country_of_origin text not null,
  supplier_name text,
  manufacturer_name text,
  status text not null default 'draft' check (status in ('draft', 'under_review', 'released', 'rejected', 'void')),
  release_decision text not null default 'pending' check (release_decision in ('pending', 'released', 'rejected', 'conditional')),
  created_by text not null,
  reviewed_by text,
  approved_by text,
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists batches_product_id_idx on public.batches (product_id);
create index if not exists batches_batch_number_idx on public.batches (batch_number);
create index if not exists batches_status_idx on public.batches (status);

-- ============================================================================
-- COA DOCUMENT TABLE
-- ============================================================================

create table if not exists public.coa_documents (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  batch_id uuid not null references public.batches(id) on delete restrict,
  coa_number text not null unique,
  issue_date text not null,
  revision integer not null default 1,
  document_status text not null default 'draft' check (document_status in ('draft', 'under_review', 'correction_required', 'approved', 'released', 'superseded', 'void')),
  document_type text not null default 'Certificate of Analysis',
  client_recipient text,
  prepared_by text not null,
  reviewed_by text,
  approved_by text,
  release_decision text not null default 'pending' check (release_decision in ('pending', 'released', 'rejected', 'conditional')),
  verification_code text not null unique,
  verification_url text,
  qr_code_value text,
  hplc_report_id uuid references public.hplc_reports(id) on delete set null,
  ms_report_id uuid references public.ms_reports(id) on delete set null,
  sds_id uuid references public.sds_documents(id) on delete set null,
  notes text,
  watermark_mode text not null default 'none' check (watermark_mode in ('none', 'draft', 'sample')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists coa_documents_product_id_idx on public.coa_documents (product_id);
create index if not exists coa_documents_batch_id_idx on public.coa_documents (batch_id);
create index if not exists coa_documents_coa_number_idx on public.coa_documents (coa_number);
create index if not exists coa_documents_document_status_idx on public.coa_documents (document_status);

-- ============================================================================
-- HPLC PURITY REPORT TABLE
-- ============================================================================

create table if not exists public.hplc_reports (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  batch_id uuid not null references public.batches(id) on delete restrict,
  coa_id uuid not null references public.coa_documents(id) on delete restrict,
  document_number text not null unique,
  issue_date text not null,
  revision integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'under_review', 'correction_required', 'approved', 'released', 'superseded', 'void')),
  method_name text not null,
  method_code text,
  instrument_name text not null,
  column_type text not null,
  mobile_phase text not null,
  flow_rate numeric not null,
  detection_wavelength numeric not null,
  injection_volume numeric not null,
  run_time numeric not null,
  sample_concentration text,
  retention_time numeric,
  purity_percent numeric not null,
  main_peak_area numeric not null,
  total_peak_area numeric not null,
  impurities_json jsonb,
  peak_table_json jsonb,
  chromatogram_file_url text,
  raw_data_file_url text,
  analyst_name text not null,
  reviewer_name text,
  result_summary text not null,
  pass_fail_decision text not null check (pass_fail_decision in ('pass', 'fail', 'conditional')),
  acceptance_criteria text not null,
  notes text,
  watermark_mode text not null default 'none' check (watermark_mode in ('none', 'draft', 'sample')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists hplc_reports_product_id_idx on public.hplc_reports (product_id);
create index if not exists hplc_reports_batch_id_idx on public.hplc_reports (batch_id);
create index if not exists hplc_reports_coa_id_idx on public.hplc_reports (coa_id);
create index if not exists hplc_reports_status_idx on public.hplc_reports (status);

-- ============================================================================
-- MS / LC-MS IDENTITY REPORT TABLE
-- ============================================================================

create table if not exists public.ms_reports (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  batch_id uuid not null references public.batches(id) on delete restrict,
  coa_id uuid not null references public.coa_documents(id) on delete restrict,
  document_number text not null unique,
  issue_date text not null,
  revision integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'under_review', 'correction_required', 'approved', 'released', 'superseded', 'void')),
  method_name text not null,
  method_code text,
  instrument_name text not null,
  ionization_mode text not null,
  expected_molecular_weight numeric not null,
  observed_mass numeric not null,
  mass_error numeric not null,
  mass_error_ppm numeric,
  charge_state integer,
  spectrum_file_url text,
  raw_data_file_url text,
  identity_conclusion text not null,
  pass_fail_decision text not null check (pass_fail_decision in ('pass', 'fail', 'conditional')),
  acceptance_criteria text not null,
  analyst_name text not null,
  reviewer_name text,
  notes text,
  watermark_mode text not null default 'none' check (watermark_mode in ('none', 'draft', 'sample')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists ms_reports_product_id_idx on public.ms_reports (product_id);
create index if not exists ms_reports_batch_id_idx on public.ms_reports (batch_id);
create index if not exists ms_reports_coa_id_idx on public.ms_reports (coa_id);
create index if not exists ms_reports_status_idx on public.ms_reports (status);

-- ============================================================================
-- SAFETY DATA SHEET (SDS) TABLE
-- ============================================================================

create table if not exists public.sds_documents (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  document_number text not null,
  revision integer not null default 1,
  issue_date text not null,
  revision_date text not null,
  status text not null default 'draft' check (status in ('draft', 'under_review', 'active', 'superseded', 'void')),
  language text not null default 'en',
  jurisdiction text not null default 'US',
  ghs_classification jsonb,
  signal_word text,
  pictograms_json jsonb,
  hazard_statements_json jsonb,
  precautionary_statements_json jsonb,
  section_1_identification text not null,
  section_2_hazard_identification text not null,
  section_3_composition text not null,
  section_4_first_aid text not null,
  section_5_fire_fighting text not null,
  section_6_accidental_release text not null,
  section_7_handling_storage text not null,
  section_8_exposure_controls text not null,
  section_9_physical_chemical text not null,
  section_10_stability_reactivity text not null,
  section_11_toxicological text not null,
  section_12_ecological text not null,
  section_13_disposal text not null,
  section_14_transport text not null,
  section_15_regulatory text not null,
  section_16_other text not null,
  prepared_by text not null,
  reviewed_by text,
  approved_by text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint unique_active_sds_per_product unique (product_id, status) where status = 'active'
);

create index if not exists sds_documents_product_id_idx on public.sds_documents (product_id);
create index if not exists sds_documents_status_idx on public.sds_documents (status);

-- ============================================================================
-- DOCUMENT BUNDLE TABLE
-- ============================================================================

create table if not exists public.document_bundles (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  batch_id uuid not null references public.batches(id) on delete restrict,
  coa_id uuid not null references public.coa_documents(id) on delete restrict,
  hplc_report_id uuid references public.hplc_reports(id) on delete set null,
  ms_report_id uuid references public.ms_reports(id) on delete set null,
  sds_id uuid references public.sds_documents(id) on delete set null,
  bundle_number text not null unique,
  status text not null default 'draft' check (status in ('draft', 'incomplete', 'under_review', 'approved', 'released', 'void')),
  created_by text not null,
  approved_by text,
  released_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists document_bundles_product_id_idx on public.document_bundles (product_id);
create index if not exists document_bundles_batch_id_idx on public.document_bundles (batch_id);
create index if not exists document_bundles_coa_id_idx on public.document_bundles (coa_id);
create index if not exists document_bundles_status_idx on public.document_bundles (status);

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================

create table if not exists public.quality_audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('batch', 'coa_document', 'hplc_report', 'ms_report', 'sds', 'document_bundle')),
  entity_id uuid not null,
  action text not null check (action in ('created', 'updated', 'approved', 'released', 'superseded', 'voided', 'rejected', 'reviewed')),
  old_value_json jsonb,
  new_value_json jsonb,
  performed_by text not null,
  performed_at timestamptz not null default timezone('utc'::text, now()),
  ip_address text,
  details text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists quality_audit_logs_entity_idx on public.quality_audit_logs (entity_type, entity_id);
create index if not exists quality_audit_logs_performed_by_idx on public.quality_audit_logs (performed_by);
create index if not exists quality_audit_logs_performed_at_idx on public.quality_audit_logs (performed_at);

-- ============================================================================
-- TRIGGER FUNCTIONS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_set_batches_updated_at on public.batches;
create trigger trg_set_batches_updated_at
before update on public.batches
for each row
execute function public.set_updated_at();

drop trigger if exists trg_set_coa_documents_updated_at on public.coa_documents;
create trigger trg_set_coa_documents_updated_at
before update on public.coa_documents
for each row
execute function public.set_updated_at();

drop trigger if exists trg_set_hplc_reports_updated_at on public.hplc_reports;
create trigger trg_set_hplc_reports_updated_at
before update on public.hplc_reports
for each row
execute function public.set_updated_at();

drop trigger if exists trg_set_ms_reports_updated_at on public.ms_reports;
create trigger trg_set_ms_reports_updated_at
before update on public.ms_reports
for each row
execute function public.set_updated_at();

drop trigger if exists trg_set_sds_documents_updated_at on public.sds_documents;
create trigger trg_set_sds_documents_updated_at
before update on public.sds_documents
for each row
execute function public.set_updated_at();

drop trigger if exists trg_set_document_bundles_updated_at on public.document_bundles;
create trigger trg_set_document_bundles_updated_at
before update on public.document_bundles
for each row
execute function public.set_updated_at();
