alter table public.web_insights
  add column if not exists available_at timestamptz;

comment on column public.web_insights.available_at is
  'Momento UTC desde el cual un insight publicado es visible. La hora se elige en America/Santiago.';
