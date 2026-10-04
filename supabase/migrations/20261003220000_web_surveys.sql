-- Encuestas públicas. Solo el servidor de xinergy.lat lee y escribe.
-- El sitio no expone estas tablas al navegador.

create table public.web_surveys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  created_at timestamptz not null default now()
);

create table public.web_survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.web_surveys (id) on delete cascade,
  created_at timestamptz not null default now(),
  language text not null check (language in ('es', 'pt')),
  nombre text not null,
  apellido text not null,
  email text not null,
  telefono text,
  linkedin text,
  cargo text not null,
  empresa text not null,
  pais text not null,
  rol text not null,
  rol_grupo text not null,
  antiguedad text not null,
  rubro text not null,
  rubro_grupo text,
  consents jsonb not null,
  company jsonb not null,
  answers jsonb not null,
  ahp jsonb
);

create index web_survey_responses_survey_created_idx
  on public.web_survey_responses (survey_id, created_at desc);

alter table public.web_surveys enable row level security;
alter table public.web_survey_responses enable row level security;

create policy server_all on public.web_surveys
  for all to authenticated
  using (public.xinergy_server())
  with check (public.xinergy_server());

create policy server_all on public.web_survey_responses
  for all to authenticated
  using (public.xinergy_server())
  with check (public.xinergy_server());

insert into public.web_surveys (slug, title)
values ('radar-compras-2027', 'Radar de Compras LatAm 2027')
on conflict (slug) do nothing;
