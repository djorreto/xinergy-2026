alter table public.web_insights
  add column if not exists pdf_filename text;

comment on column public.web_insights.pdf_filename is
  'Nombre con el que el visitante descarga el PDF. Si está vacío, se usa el slug.';
