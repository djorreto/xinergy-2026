-- Contenido y descargas de Insights (Point of View).
-- El registro comercial vive en Monday. Estas tablas solo sostienen
-- el contenido público, la validación del correo y el acceso temporal al PDF.
-- RLS activo. El acceso del servidor se define en la migración de acceso del proyecto xinergy.lat.

create table if not exists public.web_insights (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  cover_path text,
  pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.web_insight_locales (
  id uuid primary key default gen_random_uuid(),
  insight_id uuid not null references public.web_insights (id) on delete cascade,
  locale text not null check (locale in ('es', 'en', 'pt')),
  title text not null default '',
  excerpt text not null default '',
  body text not null default '',
  type_label text not null default 'Point of View',
  tag text not null default '',
  author text not null default '',
  published_on date,
  unique (insight_id, locale)
);

create table if not exists public.web_insight_downloads (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  insight_id uuid not null references public.web_insights (id) on delete cascade,
  locale text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  email_domain text not null,
  is_competitor boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  validated_at timestamptz,
  monday_item_id text,
  monday_error text
);

create index if not exists web_insight_downloads_insight_idx
  on public.web_insight_downloads (insight_id, validated_at);

create table if not exists public.web_insight_attempts (
  id bigint generated always as identity primary key,
  ip_hash text,
  email text not null,
  created_at timestamptz not null default now()
);

create index if not exists web_insight_attempts_ip_idx
  on public.web_insight_attempts (ip_hash, created_at);

create index if not exists web_insight_attempts_email_idx
  on public.web_insight_attempts (email, created_at);

create table if not exists public.web_insight_competitor_domains (
  domain text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.web_insight_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.web_insights enable row level security;
alter table public.web_insight_locales enable row level security;
alter table public.web_insight_downloads enable row level security;
alter table public.web_insight_attempts enable row level security;
alter table public.web_insight_competitor_domains enable row level security;
alter table public.web_insight_settings enable row level security;

drop policy if exists "insight covers public read" on storage.objects;
create policy "insight covers public read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'insight-covers');
