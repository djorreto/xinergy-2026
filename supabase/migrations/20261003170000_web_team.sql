create table if not exists public.web_team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  group_key text not null,
  image_path text,
  object_position text not null default 'center 20%',
  grayscale boolean not null default true,
  brightness smallint not null default 102,
  contrast smallint not null default 104,
  sort_order integer not null default 0,
  role_es text not null default '',
  role_en text not null default '',
  role_pt text not null default '',
  created_at timestamptz not null default now()
);

alter table public.web_team_members enable row level security;

drop policy if exists server_all on public.web_team_members;
create policy server_all on public.web_team_members
  for all to authenticated
  using (public.xinergy_server())
  with check (public.xinergy_server());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('team-photos', 'team-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "team photos public read" on storage.objects;
create policy "team photos public read"
  on storage.objects for select to public
  using (bucket_id = 'team-photos');

drop policy if exists "team photos server" on storage.objects;
create policy "team photos server"
  on storage.objects for all to authenticated
  using (bucket_id = 'team-photos' and public.xinergy_server())
  with check (bucket_id = 'team-photos' and public.xinergy_server());
