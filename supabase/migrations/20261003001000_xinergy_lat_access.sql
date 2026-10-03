-- Acceso del proyecto propio de xinergy.lat.
-- El servidor entra con el usuario insights-server@xinergy.lat.
-- Las portadas son públicas. Los PDF quedan privados.

create or replace function public.xinergy_server()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'insights-server@xinergy.lat';
$$;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'web_insights','web_insight_locales','web_insight_downloads','web_insight_attempts',
    'web_insight_competitor_domains','web_insight_settings','web_insight_admins','web_insight_login_codes'
  ]
  loop
    execute format('drop policy if exists server_all on public.%I', tbl);
    execute format(
      'create policy server_all on public.%I for all to authenticated using (public.xinergy_server()) with check (public.xinergy_server())',
      tbl
    );
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('insight-covers', 'insight-covers', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('insight-pdfs', 'insight-pdfs', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;

drop policy if exists "insight server storage" on storage.objects;
create policy "insight server storage"
  on storage.objects
  for all
  to authenticated
  using (bucket_id in ('insight-covers', 'insight-pdfs') and public.xinergy_server())
  with check (bucket_id in ('insight-covers', 'insight-pdfs') and public.xinergy_server());
