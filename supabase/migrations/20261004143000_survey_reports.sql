create table public.web_survey_reports (
  survey_id uuid primary key references public.web_surveys (id) on delete cascade,
  generated_at timestamptz not null default now(),
  response_count integer not null check (response_count >= 0),
  latest_response_at timestamptz,
  sections jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.web_survey_reports enable row level security;

create policy server_all on public.web_survey_reports
  for all to authenticated
  using (public.xinergy_server())
  with check (public.xinergy_server());
