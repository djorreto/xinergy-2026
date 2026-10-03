alter table public.web_insights
  add column if not exists image_size text not null default 'lg'
  check (image_size in ('sm', 'md', 'lg'));

update public.web_insights
set image_size = 'md'
where kind = 'noticia';

comment on column public.web_insights.image_size is
  'Tamaño de la imagen en la nota: sm, md o lg.';
