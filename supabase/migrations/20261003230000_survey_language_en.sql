alter table public.web_survey_responses drop constraint web_survey_responses_language_check;
alter table public.web_survey_responses
  add constraint web_survey_responses_language_check
  check (language in ('es', 'en', 'pt'));
