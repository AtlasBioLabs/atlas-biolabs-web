create extension if not exists pgcrypto;

create or replace function public.is_active_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.is_active = true
      and (
        coalesce(to_jsonb(au) ->> 'auth_user_id', '') = coalesce(auth.uid()::text, '')
        or (
          au.email is not null
          and lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      )
  );
$$;

create table if not exists public.coa_analytical_test_results (
  id uuid primary key default gen_random_uuid(),
  coa_verification_id uuid not null references public.coa_verifications(id) on delete cascade,
  row_key text not null,
  position integer not null,
  test_attribute text not null,
  method text,
  specification text,
  batch_result text,
  status text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint coa_analytical_test_results_row_key_check check (
    row_key in (
      'appearance',
      'identity',
      'purity',
      'peptide_content',
      'water_content',
      'counter_ion',
      'residual_solvents',
      'heavy_metals',
      'microbial_limits',
      'endotoxin_sterility'
    )
  ),
  constraint coa_analytical_test_results_unique unique (coa_verification_id, row_key)
);

create table if not exists public.coa_analytical_records (
  id uuid primary key default gen_random_uuid(),
  coa_verification_id uuid not null references public.coa_verifications(id) on delete cascade,
  row_key text not null,
  position integer not null,
  record_type text not null,
  reference_file_name text,
  availability text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint coa_analytical_records_row_key_check check (
    row_key in (
      'hplc_chromatogram',
      'lcms_identity_report',
      'sds_safety_data_sheet',
      'raw_data_archive'
    )
  ),
  constraint coa_analytical_records_unique unique (coa_verification_id, row_key)
);

create or replace function public.set_coa_fixed_rows_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_set_coa_analytical_test_results_updated_at on public.coa_analytical_test_results;
create trigger trg_set_coa_analytical_test_results_updated_at
before update on public.coa_analytical_test_results
for each row
execute function public.set_coa_fixed_rows_updated_at();

drop trigger if exists trg_set_coa_analytical_records_updated_at on public.coa_analytical_records;
create trigger trg_set_coa_analytical_records_updated_at
before update on public.coa_analytical_records
for each row
execute function public.set_coa_fixed_rows_updated_at();

create index if not exists coa_analytical_test_results_coa_idx
  on public.coa_analytical_test_results (coa_verification_id, position);

create index if not exists coa_analytical_records_coa_idx
  on public.coa_analytical_records (coa_verification_id, position);

alter table public.coa_analytical_test_results enable row level security;
alter table public.coa_analytical_records enable row level security;

drop policy if exists coa_analytical_test_results_admin_manage on public.coa_analytical_test_results;
create policy coa_analytical_test_results_admin_manage
on public.coa_analytical_test_results
for all
to authenticated
using (public.is_active_admin_user())
with check (public.is_active_admin_user());

drop policy if exists coa_analytical_records_admin_manage on public.coa_analytical_records;
create policy coa_analytical_records_admin_manage
on public.coa_analytical_records
for all
to authenticated
using (public.is_active_admin_user())
with check (public.is_active_admin_user());
