alter table public.web_team_members
  add column if not exists zoom smallint not null default 106
  check (zoom between 100 and 180);

comment on column public.web_team_members.zoom is
  'Zoom de la foto en porcentaje. 106 equivale al recorte actual de la web.';
