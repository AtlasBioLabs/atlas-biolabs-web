create extension if not exists pgcrypto;

create table if not exists public.coa_verifications (
  id uuid primary key default gen_random_uuid(),
  coa_number text not null,
  verification_code text not null unique,
  verification_url text,
  product_name text not null,
  catalog_code text not null,
  batch_lot_no text not null,
  issue_date text not null,
  revision text not null,
  client_recipient text not null,
  identity_result text not null,
  hplc_purity text not null,
  water_content text not null,
  release_decision text not null,
  verification_status text not null,
  document_pack text not null,
  verification_message text not null,
  appearance_result text,
  purity_result text,
  peptide_content_result text,
  counter_ion_result text,
  residual_solvents_result text,
  heavy_metals_result text,
  microbial_limits_result text,
  endotoxin_sterility_result text,
  hplc_file_name text,
  lcms_file_name text,
  sds_file_name text,
  raw_data_archive_ref text,
  coa_pdf_url text,
  qr_code_url text,
  created_by text,
  reviewed_by text,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists coa_verifications_verification_code_idx
  on public.coa_verifications (verification_code);

create index if not exists coa_verifications_coa_number_idx
  on public.coa_verifications (coa_number);

create or replace function public.set_coa_verifications_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_set_coa_verifications_updated_at on public.coa_verifications;

create trigger trg_set_coa_verifications_updated_at
before update on public.coa_verifications
for each row
execute function public.set_coa_verifications_updated_at();
