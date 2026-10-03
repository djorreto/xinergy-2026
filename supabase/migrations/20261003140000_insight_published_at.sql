alter table public.web_insights
  add column if not exists published_at timestamptz;

comment on column public.web_insights.published_at is
  'Momento en que el insight se publicó en el sitio. Se conserva al volver a borrador.';

-- Los ocho documentos se publicaron juntos. Headcount volvió a borrador y perdió available_at.
update public.web_insights
set published_at = coalesce(available_at, timestamptz '2026-10-03 03:59:00+00')
where published_at is null
  and (
    status = 'published'
    or available_at is not null
    or slug = 'del-headcount-al-resultado'
  );

-- La portada dice septiembre 2026. El día sale de la fecha del PDF.
update public.web_insight_locales as locale
set published_on = case
  when insight.slug in ('conoce-a-sus-proveedores', 'la-ia-ya-esta-comprando') then date '2026-09-27'
  else date '2026-09-26'
end
from public.web_insights as insight
where locale.insight_id = insight.id
  and locale.published_on = date '2026-09-01';
