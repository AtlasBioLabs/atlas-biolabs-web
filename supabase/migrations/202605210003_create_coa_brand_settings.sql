create extension if not exists pgcrypto;

create table if not exists public.coa_brand_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  quality_unit_name text not null,
  tagline text not null,
  logo_url text,
  seal_url text,
  footer_text text not null,
  verification_base_url text not null,
  document_class text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_coa_brand_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_set_coa_brand_settings_updated_at on public.coa_brand_settings;

create trigger trg_set_coa_brand_settings_updated_at
before update on public.coa_brand_settings
for each row
execute function public.set_coa_brand_settings_updated_at();

alter table public.coa_brand_settings enable row level security;

drop policy if exists coa_brand_settings_public_select_active on public.coa_brand_settings;
create policy coa_brand_settings_public_select_active
on public.coa_brand_settings
for select
to public
using (is_active = true);

drop policy if exists coa_brand_settings_admin_manage on public.coa_brand_settings;
create policy coa_brand_settings_admin_manage
on public.coa_brand_settings
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.is_active = true
      and (
        (au.auth_user_id is not null and au.auth_user_id = auth.uid())
        or (
          au.email is not null
          and lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.is_active = true
      and (
        (au.auth_user_id is not null and au.auth_user_id = auth.uid())
        or (
          au.email is not null
          and lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      )
  )
);

insert into public.coa_brand_settings (
  company_name,
  quality_unit_name,
  tagline,
  logo_url,
  seal_url,
  footer_text,
  verification_base_url,
  document_class,
  is_active
)
select
  'Atlas Labs',
  'Quality Documentation Unit',
  'Precision Research Compounds - Batch Documentation - Analytical Traceability',
  null,
  null,
  'Atlas BioLabs / Atlas Labs - Batch documentation. Final release requires authorized signature and batch-specific analytical records.',
  'https://atlasbiolabs.co/verify',
  'Batch QA record',
  true
where not exists (
  select 1 from public.coa_brand_settings
);
