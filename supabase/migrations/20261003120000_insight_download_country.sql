alter table public.web_insight_downloads
  add column if not exists country_code text;
