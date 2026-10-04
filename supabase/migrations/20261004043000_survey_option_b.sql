insert into public.web_surveys (slug, title)
values ('radar-compras-2027-b', 'Radar Compras 2027 · Opción B')
on conflict (slug) do nothing;
