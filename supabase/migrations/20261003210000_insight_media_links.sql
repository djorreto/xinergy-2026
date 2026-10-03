alter table public.web_insights
  add column if not exists media_links jsonb not null default '{}'::jsonb;

update public.web_insights
set languages = '{}'
where kind = 'noticia';

comment on column public.web_insights.media_links is
  'Enlaces a medios externos por idioma. Solo para noticias.';
comment on column public.web_insights.languages is
  'Noticia: idiomas con enlace a un medio. Documento: idiomas del PDF adjunto.';
