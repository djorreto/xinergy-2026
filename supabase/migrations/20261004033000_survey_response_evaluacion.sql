-- Una respuesta nace incluida en el análisis. Aislarla la conserva
-- y la deja fuera del cálculo, con quién y cuándo cambió el estado.

alter table public.web_survey_responses
  add column evaluacion text not null default 'Incluido en análisis'
    check (evaluacion in ('Incluido en análisis', 'Aislado de la evaluación')),
  add column evaluacion_at timestamptz,
  add column evaluacion_por text;

comment on column public.web_survey_responses.evaluacion is
  'Incluido en análisis entra al cálculo. Aislado de la evaluación se conserva y no entra al análisis.';
