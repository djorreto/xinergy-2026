"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { analyzeAhp } from "@/lib/surveys/ahp";
import { AHP, AHP_SCALE } from "@/lib/surveys/radar-2027";
import { ahpClass } from "@/lib/surveys/radar-b/engine";
import {
  AI_STAGE,
  BARRIERS,
  BARRIER_EXCLUSIVE,
  BUDGET_DIRECTION,
  CAPABILITIES,
  CONSENT_DETAILS,
  CONSENTS,
  COUNTRIES,
  DATA_READY,
  EFFORT_HOURS,
  EXPOSURE,
  INDUSTRIES,
  INITIATIVE_COPY,
  PARTICIPATION,
  REALIZATION,
  ROLES,
  SAVINGS,
  SAVINGS_EXPECTATION,
  SCOPES,
  SCOPE_HELP,
  SPEND_C,
  STATUSES,
  SURVEY_VERSION_C,
  VALIDATE_FREQ,
  text,
  ui,
  type Choice,
  type Lang,
} from "@/lib/surveys/radar-c/instrument";

const STORE = "xinergy-radar-2027-c";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const inputClass = "w-full border border-xinergy-charcoal/15 bg-white px-3 py-3 text-base outline-none focus:border-xinergy-orange";

type Draft = Record<string, unknown>;
type Step = "welcome" | "contact" | "profile" | "ahp" | "role" | "capacity" | "context" | "agenda" | "close";

export function RadarSurveyC({ locale }: { locale: string }) {
  const [lang, setLang] = useState<Lang>(locale === "pt" ? "pt" : locale === "en" ? "en" : "es");
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [companyUrl, setCompanyUrl] = useState("");
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState("");
  const [crAccepted, setCrAccepted] = useState(false);
  const [sending, setSending] = useState(false);
  const [downloadId, setDownloadId] = useState("");
  const [ready, setReady] = useState(false);
  const copy = ui[lang];
  const rol = typeof draft.rol === "string" ? draft.rol : "";
  const procurement = rol === "cpo" || rol === "scm";
  const steps = stepsOf(rol);
  const step = steps[Math.min(index, steps.length - 1)];

  useEffect(() => {
    if (index > steps.length - 1) setIndex(steps.length - 1);
  }, [index, steps.length]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null") as { lang?: Lang; index?: number; d?: Draft } | null;
      if (saved?.d && typeof saved.d === "object") {
        if (saved.lang) setLang(saved.lang);
        if (typeof saved.index === "number") setIndex(saved.index);
        setDraft(saved.d);
      }
    } catch {
      /* el navegador puede bloquear el almacenamiento */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || downloadId) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ lang, index, d: draft }));
    } catch {
      /* la encuesta igual se puede enviar */
    }
  }, [ready, downloadId, lang, index, draft]);

  useEffect(() => {
    if (ready) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, downloadId, ready]);

  const pairs = record(draft.prioridades_ahp);
  const ahp = useMemo(() => (AHP.pairs.every((pair) => pairs[pair.id]) ? analyzeAhp(pairs) : null), [pairs]);
  const inconsistent = Boolean(ahp && ahpClass(ahp.maxCr) !== "principal");
  const suggestions = useMemo(() => (inconsistent ? suggestPairs(pairs) : []), [inconsistent, pairs]);

  function patch(id: string, value: unknown) {
    setDraft((current) => ({ ...current, [id]: value }));
    setInvalid((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
    setBanner("");
    if (id === "prioridades_ahp") setCrAccepted(false);
  }

  function validate() {
    const problems: Record<string, string> = {};
    const mark = (id: string, message?: string) => {
      problems[id] = message ?? copy.required;
    };
    const countries = list(draft.paises);
    if (step === "contact") {
      if (!String(draft.empresa || "").trim()) mark("empresa");
      if (!EMAIL.test(String(draft.email || "").trim())) mark("email", copy.email);
      CONSENTS.filter((item) => item.req && draft[item.id] !== true).forEach((item) => mark(item.id));
    }
    if (step === "profile") {
      if (!rol) mark("rol");
      if (!draft.alcance) mark("alcance");
      if (!draft.rubro) mark("rubro");
      if (!countries.length) mark("paises");
      if (draft.alcance === "pais" && countries.length > 1) mark("paises", copy.oneCountry);
      if (draft.alcance === "multipais" && countries.length < 2) mark("paises", copy.manyCountries);
      if (draft.alcance === "unidad" && !String(draft.unidad || "").trim()) mark("unidad");
      if (countries.some((code) => code === "otro" || code === "regional") && !String(draft.pais_detalle || "").trim()) mark("pais_detalle");
      if (draft.rubro === "otra" && !String(draft.rubro_detalle || "").trim()) mark("rubro_detalle");
    }
    if (step === "ahp") AHP.pairs.forEach((pair) => {
      if (!pairs[pair.id]) mark(pair.id);
    });
    if (step === "role") {
      if (rol === "cfo") {
        if (!draft.f1) mark("f1");
        if (!draft.f2) mark("f2");
      }
      if (rol === "ceo") {
        if (!draft.g1) mark("g1");
        if (!draft.g2) mark("g2");
      }
    }
    if (step === "capacity" && procurement) CAPABILITIES.forEach((item) => {
      if (!record(draft.capacidades)[item.id]) mark(item.id);
    });
    if (step === "context" && procurement) {
      for (const id of ["e1", "e2", "e3", "e4", "e5", "r1"]) if (!draft[id]) mark(id);
      if (!list(draft.e6).length) mark("e6");
    }
    if (step === "agenda" && procurement) INITIATIVE_COPY.forEach((item) => {
      if (!record(draft.agenda)[item.id]) mark(item.id);
    });
    setInvalid(problems);
    if (Object.keys(problems).length) {
      setBanner(copy.fix);
      document.getElementById(`q-${Object.keys(problems)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    if (step === "ahp" && inconsistent && !crAccepted) {
      setBanner(copy.crWarn);
      return false;
    }
    setBanner("");
    return true;
  }

  async function submit() {
    setSending(true);
    setBanner("");
    try {
      const response = await fetch("/api/surveys/radar-compras-2027-c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_url: companyUrl, d: { ...draft, lang, version: SURVEY_VERSION_C, ruta_operativa: procurement } }),
      });
      const payload = (await response.json()) as { ok?: boolean; id?: string };
      if (!response.ok || !payload.ok || !payload.id) {
        setBanner(copy.sendErr);
        setSending(false);
        return;
      }
      setDownloadId(payload.id);
      try {
        localStorage.removeItem(STORE);
      } catch {
        /* no impide el agradecimiento */
      }
    } catch {
      setBanner(copy.sendErr);
    }
    setSending(false);
  }

  function next() {
    if (!validate()) return;
    if (step === "close") {
      void submit();
      return;
    }
    setIndex((current) => current + 1);
  }

  if (!ready) return null;

  const tracker = stepsOf(rol);
  const labels = tracker.map((item) => labelOf(copy, item));
  const position = Math.min(index, tracker.length - 1);

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10 lg:px-10 [&_input]:scroll-mb-28 [&_label]:scroll-mb-28 [&_select]:scroll-mb-28 [&_textarea]:scroll-mb-28" lang={lang === "pt" ? "pt-BR" : lang}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="label-editorial">{downloadId ? copy.doneEyebrow : labels[position]}</p>
        <div className="inline-flex border border-xinergy-charcoal/15" role="group" aria-label={lang === "en" ? "Language" : lang === "pt" ? "Idioma" : "Idioma"}>
          {(["es", "en", "pt"] as const).map((code) => (
            <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)} className={`px-3 py-1.5 text-xs font-semibold tracking-wide ${lang === code ? "bg-xinergy-charcoal text-white" : "text-xinergy-slate"}`}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {downloadId ? (
        <div>
          <h1 className="font-display text-4xl leading-tight text-xinergy-charcoal sm:text-5xl">{copy.doneTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-xinergy-slate">{copy.doneLead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href={`/api/surveys/radar-compras-2027-c/devolucion?id=${downloadId}`}>{copy.doneDownload}</a>
            <Link href="/" className="btn-secondary">{copy.doneHome}</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 h-1 bg-xinergy-charcoal/10" aria-hidden>
            <div className="h-full bg-xinergy-orange transition-[width]" style={{ width: `${(position / Math.max(tracker.length - 1, 1)) * 100}%` }} />
          </div>
          <ol className="mb-8 grid gap-1.5 text-xs text-xinergy-slate sm:gap-3" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
            {labels.map((name, item) => (
              <li key={name} className={`min-w-0 ${item === position ? "text-xinergy-charcoal" : ""}`} aria-current={item === position ? "step" : undefined}>
                <span className={`grid h-8 w-8 place-items-center border text-xs font-semibold ${item === position ? "border-xinergy-orange bg-xinergy-orange text-xinergy-charcoal" : item < position ? "border-xinergy-charcoal bg-xinergy-charcoal text-white" : "border-xinergy-charcoal/20"}`}>
                  {item < position ? "✓" : item + 1}
                </span>
                <span className="mt-1.5 hidden text-[11px] leading-snug lg:block">{name}</span>
              </li>
            ))}
          </ol>
          {step === "welcome" ? <Welcome copy={copy} /> : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                next();
              }}
              className="flex flex-col gap-8"
            >
              <header>
                <p className="text-sm text-xinergy-beige">{copy.stepOf(position + 1, tracker.length)}</p>
                <h1 className="mt-2 font-display text-3xl leading-tight text-xinergy-charcoal sm:text-4xl">{heading(copy, step, procurement).title}</h1>
                {heading(copy, step, procurement).notes.map((note) => <p key={note} className="mt-3 max-w-2xl text-xinergy-slate">{note}</p>)}
              </header>
              <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
                <input name="xinergy_hp" value={companyUrl} onChange={(event) => setCompanyUrl(event.target.value)} tabIndex={-1} autoComplete="off" />
              </div>
              {step === "contact" ? <Contact lang={lang} draft={draft} invalid={invalid} onChange={patch} /> : null}
              {step === "profile" ? <Profile lang={lang} copy={copy} draft={draft} invalid={invalid} onChange={patch} /> : null}
              {step === "ahp" ? <Pairs lang={lang} copy={copy} selected={pairs} invalid={invalid} suggestions={suggestions} onChange={(value) => patch("prioridades_ahp", value)} /> : null}
              {step === "role" ? <RoleQuestions lang={lang} rol={rol} draft={draft} invalid={invalid} onChange={patch} /> : null}
              {step === "capacity" ? <Capabilities lang={lang} selected={record(draft.capacidades)} invalid={invalid} onChange={(id, value) => patch("capacidades", { ...record(draft.capacidades), [id]: value })} /> : null}
              {step === "context" ? <Context lang={lang} draft={draft} invalid={invalid} onChange={patch} /> : null}
              {step === "agenda" ? <Agenda lang={lang} selected={record(draft.agenda)} invalid={invalid} onChange={(id, value) => patch("agenda", { ...record(draft.agenda), [id]: value })} /> : null}
              {step === "close" ? (
                <>
                  <label className="block" id="q-desafio">
                    <span className="mb-2 block font-semibold">{copy.challenge}</span>
                    <textarea className={`${inputClass} min-h-32`} value={String(draft.desafio || "")} onChange={(event) => patch("desafio", event.target.value)} />
                  </label>
                  <label className="block" id="q-spend">
                    <span className="mb-2 block font-semibold">{copy.spend}</span>
                    <SelectOptions lang={lang} options={SPEND_C} value={String(draft.spend || "")} onChange={(value) => patch("spend", value)} />
                  </label>
                </>
              ) : null}
              {banner ? <p className="text-sm font-medium text-red-700">{banner}</p> : <p className="text-sm text-xinergy-slate">{copy.saved}</p>}
              {step === "ahp" && inconsistent ? (
                <button type="button" className="text-left text-sm font-semibold text-xinergy-charcoal underline" onClick={() => setCrAccepted(true)}>{copy.crWarn}</button>
              ) : null}
              <div className="sticky bottom-0 z-20 -mx-4 flex items-center gap-3 border-t border-xinergy-charcoal/10 bg-xinergy-ivory/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
                <button type="button" className="btn-secondary min-h-12 flex-1 sm:flex-none" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={sending}>{copy.back}</button>
                <button type="submit" className="btn-primary min-h-12 flex-[1.6] sm:flex-none" disabled={sending}>{step === "close" ? (sending ? copy.sending : copy.submit) : copy.next}</button>
              </div>
            </form>
          )}
          {step === "welcome" ? (
            <div className="mt-8">
              <button type="button" className="btn-primary w-full sm:w-auto" onClick={next}>{copy.start}</button>
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}

function labelOf(copy: (typeof ui)[Lang], step: Step) {
  const operational: Record<Step, string> = {
    welcome: copy.stepsOperational[0],
    contact: copy.stepsOperational[1],
    profile: copy.stepsOperational[2],
    ahp: copy.stepsOperational[3],
    capacity: copy.stepsOperational[4],
    context: copy.stepsOperational[5],
    agenda: copy.stepsOperational[6],
    close: copy.stepsOperational[7],
    role: copy.stepsExecutive[4],
  };
  return operational[step];
}

function heading(copy: (typeof ui)[Lang], step: Step, procurement: boolean) {
  const optional = procurement ? [] : [copy.optionalStep];
  if (step === "contact") return { title: copy.contactTitle, notes: [copy.contactNote] };
  if (step === "profile") return { title: copy.profileTitle, notes: [copy.profileNote] };
  if (step === "ahp") return { title: copy.ahpTitle, notes: [copy.ahpExample, copy.ahpNote] };
  if (step === "role") return { title: copy.roleTitle, notes: [] as string[] };
  if (step === "capacity") return { title: copy.capTitle, notes: [copy.capNote, ...optional] };
  if (step === "context") return { title: copy.contextTitle, notes: [copy.contextNote, ...optional] };
  if (step === "agenda") return { title: copy.agendaTitle, notes: [copy.agendaNote, ...optional] };
  return { title: copy.closeTitle, notes: [copy.closeNote] };
}

function Welcome({ copy }: { copy: (typeof ui)[Lang] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-xinergy-slate">{copy.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-xinergy-charcoal sm:text-5xl">{copy.welcomeTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-xinergy-slate">{copy.welcomeLead}</p>
      <p className="mt-3 max-w-2xl text-xinergy-slate">{copy.welcomeNote}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {copy.benefits.map(([title, text]) => (
          <div key={title} className="border-t-2 border-xinergy-orange pt-3">
            <p className="font-display text-base text-xinergy-charcoal">{title}</p>
            <p className="mt-1 text-sm text-xinergy-slate">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-xinergy-slate">
        {copy.meta.map((item) => <span key={item}>{item}</span>)}
      </p>
    </div>
  );
}

function stepsOf(rol: string): Step[] {
  const head: Step[] = ["welcome", "contact", "profile", "ahp"];
  const tail: Step[] = ["capacity", "context", "agenda", "close"];
  if (rol === "ceo" || rol === "cfo") return [...head, "role", ...tail];
  return [...head, ...tail];
}

function suggestPairs(tokens: Record<string, string>) {
  const base = analyzeAhp(tokens);
  if (!base) return [];
  return AHP.pairs
    .map((pair) => {
      const again = analyzeAhp({ ...tokens, [pair.id]: "1" });
      return { id: pair.id, drop: again ? base.maxCr - again.maxCr : 0 };
    })
    .sort((left, right) => right.drop - left.drop)
    .filter((item) => item.drop > 0.01)
    .slice(0, 2)
    .map((item) => item.id);
}

function Contact({ lang, draft, invalid, onChange }: { lang: Lang; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void }) {
  const [details, setDetails] = useState(false);
  const copy = ui[lang];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field id="empresa" label={lang === "en" ? "Company" : "Empresa"} value={String(draft.empresa || "")} invalid={invalid.empresa} onChange={(value) => onChange("empresa", value)} />
      <Field id="email" label="Email" type="email" value={String(draft.email || "")} invalid={invalid.email} onChange={(value) => onChange("email", value)} />
      <div className="sm:col-span-2">
        <button type="button" className="text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange underline-offset-4" aria-expanded={details} onClick={() => setDetails((open) => !open)}>
          {details ? copy.detailsHide : copy.detailsShow}
        </button>
        {details ? (
          <div className="mt-3 border border-xinergy-charcoal/10 bg-white p-4 text-sm leading-relaxed text-xinergy-slate">
            {CONSENT_DETAILS[lang].map((section) => (
              <section key={section.title} className="mb-4 last:mb-0">
                <h2 className="font-display text-base text-xinergy-charcoal">{section.title}</h2>
                <p className="mt-1">{section.body}</p>
              </section>
            ))}
          </div>
        ) : null}
      </div>
      {CONSENTS.map((item) => (
        <label key={item.id} id={`q-${item.id}`} className={`flex gap-3 border px-4 py-3 sm:col-span-2 ${invalid[item.id] ? "border-red-700" : "border-xinergy-charcoal/15"}`}>
          <input type="checkbox" className="mt-1" checked={draft[item.id] === true} onChange={(event) => onChange(item.id, event.target.checked)} />
          <span>{text(item.label, lang)}</span>
        </label>
      ))}
    </div>
  );
}

function Profile({ lang, copy, draft, invalid, onChange }: { lang: Lang; copy: (typeof ui)[Lang]; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void }) {
  const countries = list(draft.paises);
  return (
    <div className="grid gap-5">
      <SelectField id="rol" label={lang === "en" ? "Role" : lang === "pt" ? "Papel" : "Rol"} options={ROLES} lang={lang} value={String(draft.rol || "")} invalid={invalid.rol} onChange={(value) => onChange("rol", value)} />
      <fieldset id="q-alcance">
        <legend className="mb-2 font-semibold">{lang === "en" ? "Scope" : lang === "pt" ? "Escopo" : "Alcance"}</legend>
        <div className="grid gap-2">
          {SCOPES.map((option) => (
            <label key={option.v} className={`border px-4 py-3 ${draft.alcance === option.v ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
              <input type="radio" className="sr-only" name="alcance" checked={draft.alcance === option.v} onChange={() => onChange("alcance", option.v)} />
              <span className="block font-semibold">{option[lang]}</span>
              <span className="mt-1 block text-sm leading-5 text-xinergy-slate">{text(SCOPE_HELP[option.v], lang)}</span>
            </label>
          ))}
        </div>
        {invalid.alcance ? <span className="mt-1 block text-sm text-red-700">{invalid.alcance}</span> : null}
      </fieldset>
      {draft.alcance === "unidad" ? <Field id="unidad" label={copy.unit} value={String(draft.unidad || "")} invalid={invalid.unidad} onChange={(value) => onChange("unidad", value)} /> : null}
      <fieldset id="q-paises">
        <legend className="mb-2 font-semibold">{copy.countries}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {COUNTRIES.filter((option) => option.v !== "regional").map((option) => {
            const on = countries.includes(option.v);
            return (
              <label key={option.v} className={`flex gap-3 border px-3 py-2 ${on ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
                <input type="checkbox" className="mt-1" checked={on} onChange={() => onChange("paises", on ? countries.filter((code) => code !== option.v) : [...countries, option.v])} />
                <span>{option[lang]}</span>
              </label>
            );
          })}
        </div>
        {invalid.paises ? <span className="mt-1 block text-sm text-red-700">{invalid.paises}</span> : null}
      </fieldset>
      {countries.includes("otro") ? <Field id="pais_detalle" label={copy.countryDetail} value={String(draft.pais_detalle || "")} invalid={invalid.pais_detalle} onChange={(value) => onChange("pais_detalle", value)} /> : null}
      <SelectField id="rubro" label={lang === "en" ? "Industry" : lang === "pt" ? "Indústria" : "Industria"} options={INDUSTRIES} lang={lang} value={String(draft.rubro || "")} invalid={invalid.rubro} onChange={(value) => onChange("rubro", value)} />
      {draft.rubro === "otra" ? <Field id="rubro_detalle" label={copy.industryDetail} value={String(draft.rubro_detalle || "")} invalid={invalid.rubro_detalle} onChange={(value) => onChange("rubro_detalle", value)} /> : null}
    </div>
  );
}

function Pairs({ lang, copy, selected, invalid, suggestions, onChange }: { lang: Lang; copy: (typeof ui)[Lang]; selected: Record<string, string>; invalid: Record<string, string>; suggestions: string[]; onChange: (value: Record<string, string>) => void }) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {AHP.pairs.map((pair) => {
          const left = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.a)?.label : AHP.criteria[pair.a];
          const right = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.b)?.label : AHP.criteria[pair.b];
          return (
            <div key={pair.id} id={`q-${pair.id}`} className={`border p-4 ${invalid[pair.id] ? "border-red-700" : suggestions.includes(pair.id) ? "border-xinergy-orange" : "border-xinergy-charcoal/15"}`}>
              {suggestions.includes(pair.id) ? <p className="mb-2 text-sm font-semibold text-xinergy-orange">{copy.crReview}</p> : null}
              <div className="mb-3 grid grid-cols-2 gap-3 text-sm font-semibold">
                <span>{left ? text(left, lang) : pair.a}</span>
                <span className="text-right">{right ? text(right, lang) : pair.b}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {AHP_SCALE.map((point) => {
                  const on = selected[pair.id] === point.token;
                  const towardRight = point.token.startsWith("1/");
                  return (
                    <button key={point.token} type="button" className={`min-w-16 flex-1 border px-2 py-2 text-xs ${on ? "border-xinergy-orange bg-[#FFF1D6] font-semibold" : "border-xinergy-charcoal/15"}`} onClick={() => onChange({ ...selected, [pair.id]: point.token })}>
                      {point.token === "1" ? copy.equal : towardRight ? copy.right : copy.left}
                      <span className="mt-1 block">{point.n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Capabilities({ lang, selected, invalid, onChange }: { lang: Lang; selected: Record<string, string>; invalid: Record<string, string>; onChange: (id: string, value: string) => void }) {
  return (
    <div className="grid gap-6">
      {CAPABILITIES.map((item) => (
        <fieldset key={item.id} id={`q-${item.id}`} className={invalid[item.id] ? "border border-red-700 p-3" : ""}>
          <legend className="mb-2 font-semibold">{text(item.short, lang)}</legend>
          <div className="grid gap-2">
            {item.levels.map((level) => (
              <label key={level.n} className={`border px-3 py-2 text-sm ${selected[item.id] === String(level.n) ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
                <input type="radio" className="mr-2" name={item.id} checked={selected[item.id] === String(level.n)} onChange={() => onChange(item.id, String(level.n))} />
                <span className="font-semibold">{level.n}. </span>{level[lang]}
              </label>
            ))}
            <label className={`border px-3 py-2 text-sm ${selected[item.id] === "ns" ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
              <input type="radio" className="mr-2" name={item.id} checked={selected[item.id] === "ns"} onChange={() => onChange(item.id, "ns")} />
              {lang === "en" ? "I don't know" : lang === "pt" ? "Não sei" : "No sé"}
            </label>
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function Context({ lang, draft, invalid, onChange }: { lang: Lang; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void }) {
  const barriers = list(draft.e6);
  const exclusive = barriers.some((code) => BARRIER_EXCLUSIVE.some((item) => item.v === code));
  return (
    <div className="grid gap-5">
      <ChoiceField id="e1" lang={lang} label={lang === "en" ? "Savings validated by Finance, last closed year" : lang === "pt" ? "Economia validada por Finanças, último exercício" : "Ahorro validado por Finanzas, último ejercicio cerrado"} options={SAVINGS} value={String(draft.e1 || "")} invalid={invalid.e1} onChange={(value) => onChange("e1", value)} />
      <ChoiceField id="e2" lang={lang} label={lang === "en" ? "Share of negotiated savings recognized by Finance" : lang === "pt" ? "Parte da economia negociada reconhecida por Finanças" : "Parte del ahorro negociado reconocida por Finanzas"} options={REALIZATION} value={String(draft.e2 || "")} invalid={invalid.e2} onChange={(value) => onChange("e2", value)} />
      <ChoiceField id="e3" lang={lang} label={lang === "en" ? "Spend without a viable alternative in the time the operation needs" : lang === "pt" ? "Gasto sem alternativa viável no prazo da operação" : "Gasto sin alternativa viable en el plazo que la operación necesita"} options={EXPOSURE} value={String(draft.e3 || "")} invalid={invalid.e3} onChange={(value) => onChange("e3", value)} />
      <ChoiceField id="e4" lang={lang} label={lang === "en" ? "Work to obtain and validate spend with the top 20 suppliers" : lang === "pt" ? "Trabalho para obter e validar o gasto com os 20 principais fornecedores" : "Trabajo para obtener y validar el gasto con los 20 principales proveedores"} options={EFFORT_HOURS} value={String(draft.e4 || "")} invalid={invalid.e4} onChange={(value) => onChange("e4", value)} />
      <ChoiceField id="e5" lang={lang} label={lang === "en" ? "Current stage of AI in Procurement" : lang === "pt" ? "Etapa atual de IA em Compras" : "Etapa actual de IA en Compras"} options={AI_STAGE} value={String(draft.e5 || "")} invalid={invalid.e5} onChange={(value) => onChange("e5", value)} />
      <ChoiceField id="r1" lang={lang} label={lang === "en" ? "Data and governance for enterprise AI" : lang === "pt" ? "Dados e governança para IA empresarial" : "Datos y gobierno para IA empresarial"} options={DATA_READY} value={String(draft.r1 || "")} invalid={invalid.r1} onChange={(value) => onChange("r1", value)} />
      <fieldset id="q-e6">
        <legend className="mb-2 font-semibold">{lang === "en" ? "Two main barriers to enterprise AI" : lang === "pt" ? "Duas barreiras principais para IA empresarial" : "Dos barreras principales para la IA empresarial"}</legend>
        <div className="grid gap-2">
          {[...BARRIERS, ...BARRIER_EXCLUSIVE].map((option) => {
            const on = barriers.includes(option.v);
            return (
              <label key={option.v} className={`flex gap-3 border px-3 py-2 ${on ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
                <input type="checkbox" className="mt-1" checked={on} onChange={() => onChange("e6", toggleBarrier(barriers, option.v, exclusive))} />
                <span>{option[lang]}</span>
              </label>
            );
          })}
        </div>
        {invalid.e6 ? <span className="mt-1 block text-sm text-red-700">{invalid.e6}</span> : null}
      </fieldset>
    </div>
  );
}

function Agenda({ lang, selected, invalid, onChange }: { lang: Lang; selected: Record<string, string>; invalid: Record<string, string>; onChange: (id: string, value: string) => void }) {
  return (
    <div className="grid gap-4">
      {INITIATIVE_COPY.map((item) => (
        <label key={item.id} id={`q-${item.id}`} className="block border border-xinergy-charcoal/10 p-3">
          <span className="mb-1 block font-semibold">{text(item.name, lang)}</span>
          <span className="mb-2 block text-sm text-xinergy-slate">{text(item.scope, lang)}</span>
          <SelectOptions lang={lang} options={STATUSES} value={selected[item.id] ?? ""} invalid={Boolean(invalid[item.id])} onChange={(value) => onChange(item.id, value)} />
        </label>
      ))}
    </div>
  );
}

function RoleQuestions({ lang, rol, draft, invalid, onChange }: { lang: Lang; rol: string; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void }) {
  return (
    <div className="grid gap-5">
      {rol === "cfo" ? (
        <>
          <ChoiceField id="f1" lang={lang} label={lang === "en" ? "What validated savings do you expect from Procurement in 2027?" : lang === "pt" ? "Que economia validada você espera de Compras em 2027?" : "¿Qué ahorro validado espera de Compras para 2027?"} options={SAVINGS_EXPECTATION} value={String(draft.f1 || "")} invalid={invalid.f1} onChange={(value) => onChange("f1", value)} />
          <ChoiceField id="f2" lang={lang} label={lang === "en" ? "How often does Finance validate savings against an agreed baseline?" : lang === "pt" ? "Com que frequência Finanças valida economias contra uma linha de base?" : "¿Con qué frecuencia Finanzas valida los ahorros contra una línea base acordada?"} options={VALIDATE_FREQ} value={String(draft.f2 || "")} invalid={invalid.f2} onChange={(value) => onChange("f2", value)} />
        </>
      ) : (
        <>
          <ChoiceField id="g1" lang={lang} label={lang === "en" ? "For 2027, the budget for efficiency initiatives..." : lang === "pt" ? "Para 2027, o orçamento de iniciativas de eficiência..." : "Para 2027, el presupuesto de iniciativas de eficiencia..."} options={BUDGET_DIRECTION} value={String(draft.g1 || "")} invalid={invalid.g1} onChange={(value) => onChange("g1", value)} />
          <ChoiceField id="g2" lang={lang} label={lang === "en" ? "When does Procurement join relevant budget or investment decisions?" : lang === "pt" ? "Quando Compras participa de decisões relevantes de orçamento ou investimento?" : "¿En qué momento participa Compras en decisiones relevantes de presupuesto o inversión?"} options={PARTICIPATION} value={String(draft.g2 || "")} invalid={invalid.g2} onChange={(value) => onChange("g2", value)} />
        </>
      )}
    </div>
  );
}

function ChoiceField({ id, lang, label, options, value, invalid, onChange }: { id: string; lang: Lang; label: string; options: Choice[]; value: string; invalid?: string; onChange: (value: string) => void }) {
  return (
    <label id={`q-${id}`} className="block">
      <span className="mb-2 block font-semibold">{label}</span>
      <SelectOptions lang={lang} options={options} value={value} invalid={Boolean(invalid)} onChange={onChange} />
      {invalid ? <span className="mt-1 block text-sm text-red-700">{invalid}</span> : null}
    </label>
  );
}

function SelectField({ id, label, options, lang, value, invalid, onChange }: { id: string; label: string; options: Choice[]; lang: Lang; value: string; invalid?: string; onChange: (value: string) => void }) {
  return (
    <label id={`q-${id}`} className="block">
      <span className="mb-2 block font-semibold">{label}</span>
      <SelectOptions lang={lang} options={options} value={value} invalid={Boolean(invalid)} onChange={onChange} />
      {invalid ? <span className="mt-1 block text-sm text-red-700">{invalid}</span> : null}
    </label>
  );
}

function SelectOptions({ lang, options, value, invalid, onChange }: { lang: Lang; options: Choice[]; value: string; invalid?: boolean; onChange: (value: string) => void }) {
  return (
    <select className={`${inputClass} ${invalid ? "border-red-700" : ""}`} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{lang === "en" ? "Select" : lang === "pt" ? "Selecione" : "Seleccione"}</option>
      {options.map((option) => <option key={option.v} value={option.v}>{option[lang]}</option>)}
    </select>
  );
}

function Field({ id, label, value, invalid, onChange, type = "text" }: { id: string; label: string; value: string; invalid?: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label id={`q-${id}`} className="block">
      <span className="mb-2 block font-semibold">{label}</span>
      <input className={`${inputClass} ${invalid ? "border-red-700" : ""}`} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      {invalid ? <span className="mt-1 block text-sm text-red-700">{invalid}</span> : null}
    </label>
  );
}

function toggleBarrier(current: string[], code: string, exclusiveOn: boolean) {
  const exclusive = BARRIER_EXCLUSIVE.some((item) => item.v === code);
  if (exclusive) return current.length === 1 && current[0] === code ? [] : [code];
  if (exclusiveOn) return [code];
  if (current.includes(code)) return current.filter((item) => item !== code);
  if (current.length >= 2) return current;
  return [...current, code];
}

function list(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function record(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, string>;
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) if (typeof item === "string") output[key] = item;
  return output;
}
