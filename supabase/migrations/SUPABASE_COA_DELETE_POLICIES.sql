-- Run this in Supabase SQL Editor if COA record deletes fail with RLS errors.
-- Your quality document tables already have delete policies, but coa_verifications currently does not.

create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and is_active = true
  );
$$;

grant execute on function public.is_admin_user() to authenticated;

alter table public.coa_verifications enable row level security;

drop policy if exists "Active admins can delete COA records" on public.coa_verifications;
create policy "Active admins can delete COA records"
on public.coa_verifications
for delete
to authenticated
using (public.is_admin_user());

-- Child analytical reference tables used by the COA admin. Run these if the tables exist.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'coa_analytical_test_results'
  ) then
    execute 'alter table public.coa_analytical_test_results enable row level security';
    execute 'drop policy if exists "Active admins can delete COA analytical test results" on public.coa_analytical_test_results';
    execute 'create policy "Active admins can delete COA analytical test results" on public.coa_analytical_test_results for delete to authenticated using (public.is_admin_user())';
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'coa_analytical_records'
  ) then
    execute 'alter table public.coa_analytical_records enable row level security';
    execute 'drop policy if exists "Active admins can delete COA analytical records" on public.coa_analytical_records';
    execute 'create policy "Active admins can delete COA analytical records" on public.coa_analytical_records for delete to authenticated using (public.is_admin_user())';
  end if;
end $$;

notify pgrst, 'reload schema';
