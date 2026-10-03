alter table public.web_insights
  add column if not exists kind text not null default 'documento'
    check (kind in ('noticia', 'documento')),
  add column if not exists source_url text,
  add column if not exists gallery_paths text[] not null default '{}';

comment on column public.web_insights.kind is
  'noticia: nota con imágenes. documento: newsletter con PDF.';
