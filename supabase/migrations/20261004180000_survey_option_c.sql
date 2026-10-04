insert into public.web_surveys (slug, title)
values ('radar-compras-2027-c', 'Radar Compras 2027 · Versión C')
on conflict (slug) do nothing;
