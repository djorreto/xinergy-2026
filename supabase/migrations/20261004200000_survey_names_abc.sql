update public.web_surveys
set title = case slug
  when 'radar-compras-2027' then 'Radar Compras 2027 · A (No oficial)'
  when 'radar-compras-2027-b' then 'Radar Compras 2027 · B (No oficial)'
  when 'radar-compras-2027-c' then 'Radar Compras 2027 · C (versión oficial)'
  else title
end
where slug in ('radar-compras-2027', 'radar-compras-2027-b', 'radar-compras-2027-c');
