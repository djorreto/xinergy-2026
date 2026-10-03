alter table public.web_insights
  add column if not exists created_by text,
  add column if not exists intake_complete boolean not null default true;

comment on column public.web_insights.created_by is
  'Correo del administrador que cargó el insight.';

comment on column public.web_insights.intake_complete is
  'Falso mientras falte el PDF o los textos en español, inglés y portugués.';
