alter table public.web_insights
  add column if not exists languages text[] not null default '{}';

alter table public.web_insights
  drop constraint if exists web_insights_languages_check;

alter table public.web_insights
  add constraint web_insights_languages_check
  check (languages <@ array['es', 'en', 'pt']::text[]);

update public.web_insights
set languages = array['es', 'en', 'pt']
where languages = '{}';

comment on column public.web_insights.languages is
  'Idiomas en los que está el documento o la noticia: es, en, pt.';
