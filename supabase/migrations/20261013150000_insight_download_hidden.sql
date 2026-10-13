alter table public.web_insight_downloads
  add column if not exists hidden_at timestamptz;

comment on column public.web_insight_downloads.hidden_at is
  'Si tiene fecha, la descarga sigue guardada pero no aparece en la base ni en el Excel.';
