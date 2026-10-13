alter table public.web_insight_locales
  add column if not exists pdf_path text,
  add column if not exists pdf_filename text;

comment on column public.web_insight_locales.pdf_path is
  'PDF privado correspondiente exclusivamente a este idioma.';

comment on column public.web_insight_locales.pdf_filename is
  'Nombre localizado con el que el visitante descarga el PDF.';

-- Compatibilidad durante el despliegue: hasta que se suban los archivos
-- monolingües, cada idioma conserva acceso al PDF trilingüe existente.
update public.web_insight_locales as locale
set
  pdf_path = coalesce(locale.pdf_path, insight.pdf_path),
  pdf_filename = coalesce(locale.pdf_filename, insight.pdf_filename)
from public.web_insights as insight
where insight.id = locale.insight_id
  and insight.kind = 'documento';

comment on column public.web_insights.pdf_path is
  'Obsoleto: respaldo temporal. Los PDF activos viven en web_insight_locales.pdf_path.';

comment on column public.web_insights.pdf_filename is
  'Obsoleto: respaldo temporal. Los nombres activos viven en web_insight_locales.pdf_filename.';
