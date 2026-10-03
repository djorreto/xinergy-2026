-- Accesos del administrador de Insights.
-- Independiente de los usuarios de Reporte Comercial.

create table if not exists public.web_insight_admins (
  email text primary key,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.web_insight_login_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null references public.web_insight_admins (email) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  attempts integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists web_insight_login_codes_email_idx
  on public.web_insight_login_codes (email, created_at desc);

alter table public.web_insight_admins enable row level security;
alter table public.web_insight_login_codes enable row level security;

insert into public.web_insight_admins (email)
values ('diego.jorreto@xinergy.cl')
on conflict (email) do nothing;
