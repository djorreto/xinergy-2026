"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { analyzeAhp } from "@/lib/surveys/ahp";
import { AHP, AHP_SCALE } from "@/lib/surveys/radar-2027";
import { ahpClass, SURVEY_VERSION_B } from "@/lib/surveys/radar-b/engine";
import {
  AGENDA_STATUS,
  CAPABILITIES,
  CONSENTS,
  COUNTRIES,
  DATA_READY,
  EVIDENCE,
  INDUSTRIES,
  INITIATIVE_COPY,
  KNOWLEDGE,
  MANAGED,
  ORG,
  ROLES,
  SPEND,
  TEAM,
  text,
  ui,
  type Choice,
  type Lang,
} from "@/lib/surveys/radar-b/instrument";
import { WHATSAPP_PHONE } from "@/lib/whatsapp";

const STORE = "xinergy-radar-2027-b";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const inputClass = "w-full border border-xinergy-charcoal/15 bg-white px-3 py-3 text-base outline-none focus:border-xinergy-orange";

type Draft = Record<string, unknown>;
type Step = "welcome" | "contact" | "profile" | "ahp" | "knowledge" | "capacity" | "evidence" | "agenda" | "challenge";

const HEAD: Step[] = ["welcome", "contact", "profile", "ahp", "knowledge"];

function pathOf(knowledge: string): Step[] {
  if (knowledge === "si" || knowledge === "parcial") return [...HEAD, "capacity", "evidence", "agenda", "challenge"];
  if (knowledge === "no") return [...HEAD, "challenge"];
  return HEAD;
}

export function RadarSurveyB({ locale, linkedin }: { locale: string; linkedin: string }) {
  const [lang, setLang] = useState<Lang>(locale === "pt" ? "pt" : locale === "en" ? "en" : "es");
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [companyUrl, setCompanyUrl] = useState("");
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState("");
  const [crAccepted, setCrAccepted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [ready, setReady] = useState(false);
  const copy = ui[lang];
  const knowledge = typeof draft.conocimiento === "string" ? draft.conocimiento : "";
  const steps = pathOf(knowledge);
  const position = Math.min(index, steps.length - 1);
  const step = steps[position];

  useEffect(() => {
    if (index > steps.length - 1) setIndex(steps.length - 1);
  }, [index, steps.length]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null") as { lang?: Lang; index?: number; d?: Draft } | null;
      if (saved?.d && typeof saved.d === "object") {
        if (saved.lang === "es" || saved.lang === "en" || saved.lang === "pt") setLang(saved.lang);
        if (typeof saved.index === "number") setIndex(saved.index);
        const restored = { ...saved.d };
        if (!Array.isArray(restored.paises) && typeof restored.pais === "string" && restored.pais) restored.paises = restored.pais.split(",").map((item) => item.trim()).filter(Boolean);
        setDraft(restored);
      }
    } catch {
      /* el navegador puede bloquear el almacenamiento */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || sent) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ lang, index, d: draft }));
    } catch {
      /* sin almacenamiento local la encuesta igual se puede enviar */
    }
  }, [ready, sent, lang, index, draft]);

  useEffect(() => {
    if (ready) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, sent, ready]);

  const pairs = record(draft.prioridades_ahp);
  const ahp = useMemo(() => (AHP.pairs.every((pair) => pairs[pair.id]) ? analyzeAhp(pairs) : null), [pairs]);
  const inconsistent = Boolean(ahp && ahpClass(ahp.maxCr) !== "principal");

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
    if (step === "contact") {
      if (!String(draft.nombre || "").trim()) mark("nombre");
      if (!String(draft.apellido || "").trim()) mark("apellido");
      if (!EMAIL.test(String(draft.email || "").trim())) mark("email", copy.email);
      CONSENTS.filter((item) => item.req && draft[item.id] !== true).forEach((item) => mark(item.id));
    }
    if (step === "profile") {
      for (const id of ["empresa", "rol", "alcance", "rubro", "spend", "managed", "organizacion", "equipo"]) {
        if (!String(draft[id] || "").trim()) mark(id);
      }
      const countries = countryDraft(draft);
      if (!countries.length) mark("paises");
      if (draft.alcance === "unidad" && !String(draft.unidad || "").trim()) mark("unidad");
      if (countries.some((code) => code === "otro" || code === "regional") && !String(draft.pais_detalle || "").trim()) mark("pais_detalle");
      if (draft.rubro === "otra" && !String(draft.rubro_detalle || "").trim()) mark("rubro_detalle");
    }
    if (step === "ahp") AHP.pairs.forEach((pair) => {
      if (!pairs[pair.id]) mark(pair.id);
    });
    if (step === "knowledge" && !knowledge) mark("conocimiento");
    if (step === "capacity") CAPABILITIES.forEach((item) => {
      if (!record(draft.capacidades)[item.id]) mark(item.id);
    });
    if (step === "evidence") {
      EVIDENCE.forEach((item) => {
        if (!record(draft.evidencia)[item.id]) mark(item.id);
      });
      if (!draft.datos_ia) mark("datos_ia");
    }
    if (step === "agenda") INITIATIVE_COPY.forEach((item) => {
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
      const response = await fetch("/api/surveys/radar-compras-2027-b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_url: companyUrl, d: { ...draft, lang, version: SURVEY_VERSION_B } }),
      });
      const payload = (await response.json()) as { ok?: boolean };
      if (!response.ok || !payload.ok) {
        setBanner(copy.sendErr);
        setSending(false);
        return;
      }
      setSent(true);
      try {
        localStorage.removeItem(STORE);
      } catch {
        /* no impide el agradecimiento */
      }
    } catch {
      setBanner(copy.sendErr);
      setSending(false);
    }
  }

  function forward() {
    if (sent || !validate()) return;
    if (position >= steps.length - 1) {
      submit();
      return;
    }
    setIndex(position + 1);
  }

  const whatsappText = lang === "pt" ? "Olá, respondi a opção B do Radar de Compras da Xinergy." : lang === "en" ? "Hello, I completed option B of Xinergy's Procurement Radar." : "Hola, respondí la opción B del Radar de Compras de Xinergy.";
  const whatsapp = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappText)}`;

  const tracker: Step[] = knowledge === "no"
    ? ["welcome", "contact", "profile", "ahp", "knowledge", "challenge"]
    : ["welcome", "contact", "profile", "ahp", "knowledge", "capacity", "evidence", "agenda", "challenge"];
  const labels = tracker.map((item) => copy.steps[stepIndex(item)] ?? "");

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10 lg:px-10 [&_input]:scroll-mb-28 [&_label]:scroll-mb-28 [&_select]:scroll-mb-28 [&_textarea]:scroll-mb-28" lang={lang === "pt" ? "pt-BR" : lang}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="label-editorial">{sent ? copy.eyebrow : labels[Math.min(position, labels.length - 1)]}</p>
        <div className="inline-flex border border-xinergy-charcoal/15" role="group" aria-label={copy.lang}>
          {(["es", "en", "pt"] as const).map((code) => (
            <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)} className={`px-3 py-1.5 text-xs font-semibold tracking-wide ${lang === code ? "bg-xinergy-charcoal text-white" : "text-xinergy-slate"}`}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {sent ? (
        <section>
          <h1 className="font-display text-4xl leading-tight text-xinergy-charcoal sm:text-5xl">{copy.doneTitle}</h1>
          <p className="mt-4 max-w-xl text-lg text-xinergy-slate">{copy.doneLead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href={whatsapp}>{copy.whatsapp}</a>
            <Link href="/" className="btn-secondary">{copy.doneHome}</Link>
          </div>
          <p className="mt-6 text-sm text-xinergy-slate">{linkedin}</p>
        </section>
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
          {step === "welcome" ? <WelcomeB copy={copy} /> : (
            <form onSubmit={(event) => { event.preventDefault(); forward(); }} className="flex flex-col gap-8">
              <header>
                <p className="text-sm text-xinergy-beige">{copy.stepOf(position + 1, tracker.length)}</p>
                <h1 className="mt-2 font-display text-3xl leading-tight text-xinergy-charcoal sm:text-4xl">{titleOf(copy, step)}</h1>
                <p className="mt-3 max-w-2xl text-xinergy-slate">{noteOf(copy, step)}</p>
              </header>
              {step === "contact" ? <Contact lang={lang} copy={copy} draft={draft} invalid={invalid} onChange={patch} honeypot={companyUrl} onHoneypot={setCompanyUrl} /> : null}
              {step === "profile" ? <Profile lang={lang} copy={copy} draft={draft} invalid={invalid} onChange={patch} /> : null}
              {step === "ahp" ? <Pairs lang={lang} copy={copy} selected={pairs} invalid={invalid} onChange={(value) => patch("prioridades_ahp", value)} /> : null}
              {step === "knowledge" ? <Choices name="conocimiento" options={KNOWLEDGE} lang={lang} value={knowledge} invalid={invalid.conocimiento} onChange={(value) => patch("conocimiento", value)} /> : null}
              {step === "capacity" ? <Capability lang={lang} copy={copy} selected={record(draft.capacidades)} invalid={invalid} onChange={(id, value) => patch("capacidades", { ...record(draft.capacidades), [id]: value })} /> : null}
              {step === "evidence" ? <Evidence lang={lang} copy={copy} draft={draft} invalid={invalid} onChange={patch} /> : null}
              {step === "agenda" ? <Agenda lang={lang} selected={record(draft.agenda)} invalid={invalid} onChange={(id, value) => patch("agenda", { ...record(draft.agenda), [id]: value })} /> : null}
              {step === "challenge" ? (
                <label id="q-desafio" className="block">
                  <span className="mb-2 block font-semibold text-xinergy-charcoal">{copy.challenge}</span>
                  <textarea className={`${inputClass} min-h-32`} maxLength={4000} value={String(draft.desafio || "")} onChange={(event) => patch("desafio", event.target.value)} />
                </label>
              ) : null}
              {banner ? <p className="text-sm font-medium text-red-700">{banner}</p> : <p className="text-sm text-xinergy-slate">{copy.saved}</p>}
              {step === "ahp" && inconsistent && !crAccepted ? (
                <button type="button" className="w-fit text-left text-sm font-semibold text-xinergy-charcoal underline" onClick={() => { setCrAccepted(true); setBanner(""); }}>{copy.crContinue}</button>
              ) : null}
              <div className="sticky bottom-0 z-20 -mx-4 flex items-center gap-3 border-t border-xinergy-charcoal/10 bg-xinergy-ivory/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
                <button type="button" className="btn-secondary min-h-12 flex-1 sm:flex-none" onClick={() => setIndex(Math.max(0, position - 1))} disabled={sending}>{copy.back}</button>
                <button type="submit" className="btn-primary min-h-12 flex-[1.6] sm:flex-none" disabled={sending}>{sending ? copy.sending : position >= steps.length - 1 ? copy.submit : copy.next}</button>
              </div>
            </form>
          )}
          {step === "welcome" ? (
            <div className="mt-8">
              <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => setIndex(1)}>{copy.start}</button>
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}

function WelcomeB({ copy }: { copy: (typeof ui)[Lang] }) {
  return (
    <div>
      <h1 className="font-display text-4xl leading-tight text-xinergy-charcoal sm:text-5xl">{copy.welcomeTitle}</h1>
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

function stepIndex(step: Step) {
  return ["welcome", "contact", "profile", "ahp", "knowledge", "capacity", "evidence", "agenda", "challenge"].indexOf(step);
}

function titleOf(copy: (typeof ui)[Lang], step: Step) {
  if (step === "contact") return copy.contactTitle;
  if (step === "profile") return copy.profileTitle;
  if (step === "ahp") return copy.ahpTitle;
  if (step === "knowledge") return copy.knowTitle;
  if (step === "capacity") return copy.capTitle;
  if (step === "evidence") return copy.evTitle;
  if (step === "agenda") return copy.agendaTitle;
  return copy.closeTitle;
}

function noteOf(copy: (typeof ui)[Lang], step: Step) {
  if (step === "contact") return copy.contactNote;
  if (step === "profile") return copy.profileNote;
  if (step === "ahp") return copy.ahpNote;
  if (step === "knowledge") return copy.knowNote;
  if (step === "capacity") return copy.capNote;
  if (step === "evidence") return copy.evNote;
  if (step === "agenda") return copy.agendaNote;
  return copy.closeNote;
}

function Contact({ lang, draft, invalid, onChange, honeypot, onHoneypot }: { lang: Lang; copy: (typeof ui)[Lang]; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void; honeypot: string; onHoneypot: (value: string) => void }) {
  return (
    <div className="grid gap-5">
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <input name="xinergy_hp" value={honeypot} onChange={(event) => onHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <Text id="nombre" label={text(langLabel("Nombre", "First name", "Nome"), lang)} draft={draft} invalid={invalid} onChange={onChange} />
      <Text id="apellido" label={text(langLabel("Apellido", "Last name", "Sobrenome"), lang)} draft={draft} invalid={invalid} onChange={onChange} />
      <Text id="email" label="Email" type="email" draft={draft} invalid={invalid} onChange={onChange} />
      {CONSENTS.map((item) => (
        <label key={item.id} id={`q-${item.id}`} className={`flex gap-3 border px-4 py-3 ${invalid[item.id] ? "border-red-700" : "border-xinergy-charcoal/15"}`}>
          <input type="checkbox" className="mt-1" checked={draft[item.id] === true} onChange={(event) => onChange(item.id, event.target.checked)} />
          <span>{text(item.label, lang)}</span>
        </label>
      ))}
    </div>
  );
}

function langLabel(es: string, en: string, pt: string) {
  return { es, en, pt };
}

function Text({ id, label, draft, invalid, onChange, type = "text" }: { id: string; label: string | { es: string; en: string; pt: string }; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void; type?: string }) {
  return (
    <label id={`q-${id}`} className="block">
      <span className="mb-2 block font-semibold">{typeof label === "string" ? label : label.es}</span>
      <input className={`${inputClass} ${invalid[id] ? "border-red-700" : ""}`} type={type} value={String(draft[id] || "")} onChange={(event) => onChange(id, event.target.value)} />
      {invalid[id] ? <span className="mt-1 block text-sm text-red-700">{invalid[id]}</span> : null}
    </label>
  );
}

function countryDraft(draft: Draft) {
  if (Array.isArray(draft.paises)) return draft.paises.filter((item): item is string => typeof item === "string" && item.length > 0);
  if (typeof draft.pais === "string" && draft.pais) return draft.pais.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function Profile({ lang, copy, draft, invalid, onChange }: { lang: Lang; copy: (typeof ui)[Lang]; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void }) {
  const countries = countryDraft(draft);
  const scopes = [
    ["empresa", copy.scopeCompany, copy.scopeCompanyHelp],
    ["unidad", copy.scopeUnit, copy.scopeUnitHelp],
  ] as const;
  return (
    <div className="grid gap-5">
      <Text id="empresa" label={text(langLabel("Empresa", "Company", "Empresa"), lang)} draft={draft} invalid={invalid} onChange={onChange} />
      <fieldset id="q-alcance">
        <legend className="mb-2 font-semibold">{lang === "en" ? "Scope" : lang === "pt" ? "Escopo" : "Alcance"}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {scopes.map(([value, label, help]) => (
            <label key={value} className={`border px-4 py-3 ${draft.alcance === value ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
              <input type="radio" className="sr-only" name="alcance" checked={draft.alcance === value} onChange={() => onChange("alcance", value)} />
              <span className="block font-semibold">{label}</span>
              <span className="mt-1 block text-sm leading-5 text-xinergy-slate">{help}</span>
            </label>
          ))}
        </div>
        {invalid.alcance ? <span className="mt-1 block text-sm text-red-700">{invalid.alcance}</span> : null}
      </fieldset>
      {draft.alcance === "unidad" ? <Text id="unidad" label={copy.unit} draft={draft} invalid={invalid} onChange={onChange} /> : null}
      <Select id="rol" label={lang === "en" ? "Main role" : lang === "pt" ? "Papel principal" : "Rol principal"} options={ROLES} lang={lang} value={String(draft.rol || "")} invalid={invalid.rol} onChange={(value) => onChange("rol", value)} />
      <fieldset id="q-paises">
        <legend className="mb-2 font-semibold">{lang === "en" ? "Countries of operation" : lang === "pt" ? "Países de operação" : "Países de operación"}</legend>
        <div className={`grid gap-2 sm:grid-cols-2 ${invalid.paises ? "rounded-sm border border-red-700 p-2" : ""}`}>
          {COUNTRIES.map((option) => {
            const on = countries.includes(option.v);
            return (
              <label key={option.v} className={`flex gap-3 border px-3 py-2 ${on ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={on}
                  onChange={() => onChange("paises", on ? countries.filter((code) => code !== option.v) : [...countries, option.v])}
                />
                <span>{option[lang]}</span>
              </label>
            );
          })}
        </div>
        {invalid.paises ? <span className="mt-1 block text-sm text-red-700">{invalid.paises}</span> : null}
      </fieldset>
      {countries.some((code) => code === "otro" || code === "regional") ? <Text id="pais_detalle" label={copy.countryDetail} draft={draft} invalid={invalid} onChange={onChange} /> : null}
      <Select id="rubro" label={lang === "en" ? "Main industry" : lang === "pt" ? "Indústria principal" : "Industria principal"} options={INDUSTRIES} lang={lang} value={String(draft.rubro || "")} invalid={invalid.rubro} onChange={(value) => onChange("rubro", value)} />
      {draft.rubro === "otra" ? <Text id="rubro_detalle" label={copy.industryDetail} draft={draft} invalid={invalid} onChange={onChange} /> : null}
      <Select id="spend" label={lang === "en" ? "Annual third-party spend, about, in USD" : lang === "pt" ? "Gasto anual com terceiros, aproximado, em USD" : "Gasto anual de terceros, aproximado, en USD"} options={SPEND} lang={lang} value={String(draft.spend || "")} invalid={invalid.spend} onChange={(value) => onChange("spend", value)} />
      <Select id="managed" label={lang === "en" ? "What share of that spend does Procurement manage?" : lang === "pt" ? "Que percentual desse gasto a Compras gere?" : "¿Qué porcentaje de ese gasto gestiona Compras?"} options={MANAGED} lang={lang} value={String(draft.managed || "")} invalid={invalid.managed} onChange={(value) => onChange("managed", value)} />
      <Select id="organizacion" label={lang === "en" ? "How is Procurement organized?" : lang === "pt" ? "Como Compras se organiza?" : "¿Cómo se organiza Compras?"} options={ORG} lang={lang} value={String(draft.organizacion || "")} invalid={invalid.organizacion} onChange={(value) => onChange("organizacion", value)} />
      <Select id="equipo" label={lang === "en" ? "How many people are in the Procurement team of this scope?" : lang === "pt" ? "Quantas pessoas integram a equipe de Compras desse escopo?" : "¿Cuántas personas integran el equipo de Compras del alcance?"} options={TEAM} lang={lang} value={String(draft.equipo || "")} invalid={invalid.equipo} onChange={(value) => onChange("equipo", value)} />
    </div>
  );
}

function Select({ id, label, options, lang, value, invalid, onChange }: { id: string; label: string; options: Choice[]; lang: Lang; value: string; invalid?: string; onChange: (value: string) => void }) {
  return (
    <label id={`q-${id}`} className="block">
      <span className="mb-2 block font-semibold">{label}</span>
      <select className={`${inputClass} ${invalid ? "border-red-700" : ""}`} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{lang === "en" ? "Select" : lang === "pt" ? "Selecione" : "Seleccione"}</option>
        {options.map((option) => (
          <option key={option.v} value={option.v}>{option[lang]}</option>
        ))}
      </select>
      {invalid ? <span className="mt-1 block text-sm text-red-700">{invalid}</span> : null}
    </label>
  );
}

function Pairs({ lang, copy, selected, invalid, onChange }: { lang: Lang; copy: (typeof ui)[Lang]; selected: Record<string, string>; invalid: Record<string, string>; onChange: (value: Record<string, string>) => void }) {
  const sections = [
    ["macro", lang === "en" ? "Between groups" : lang === "pt" ? "Entre grupos" : "Entre grupos"],
    ["fin", text(AHP.macros[0].label, lang)],
    ["res", text(AHP.macros[1].label, lang)],
    ["trans", text(AHP.macros[2].label, lang)],
  ] as const;
  return (
    <div className="flex flex-col gap-6">
      {sections.map(([group, title]) => (
        <section key={group}>
          <h2 className="border-b border-xinergy-charcoal/15 pb-2 font-display text-lg">{title}</h2>
          {AHP.pairs.filter((pair) => pair.group === group).map((pair) => {
            const left = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.a)?.label : AHP.criteria[pair.a];
            const right = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.b)?.label : AHP.criteria[pair.b];
            return (
              <div key={pair.id} id={`q-${pair.id}`} className={`border-b py-4 ${invalid[pair.id] ? "border-red-700" : "border-xinergy-charcoal/10"}`}>
                <div className="mb-3 grid grid-cols-2 gap-3 text-sm font-semibold">
                  <span>{left ? text(left, lang) : pair.a}</span>
                  <span className="text-right">{right ? text(right, lang) : pair.b}</span>
                </div>
                <div className="grid grid-cols-9 gap-1">
                  {AHP_SCALE.map((point) => {
                    const on = selected[pair.id] === point.token;
                    return (
                      <label key={point.token} title={point[lang]} className="cursor-pointer">
                        <input type="radio" className="peer sr-only" name={pair.id} checked={on} onChange={() => onChange({ ...selected, [pair.id]: point.token })} />
                        <span className="grid h-11 place-items-center border border-xinergy-charcoal/15 text-xs font-semibold peer-checked:border-xinergy-orange peer-checked:bg-[#FFF1D6]">{point.n}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-2 text-center text-xs text-xinergy-slate">{selected[pair.id] ? AHP_SCALE.find((point) => point.token === selected[pair.id])?.[lang] : `← ${copy.left} · 1 ${copy.equal} · ${copy.right} →`}</p>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

function Choices({ name, options, lang, value, invalid, onChange }: { name: string; options: Choice[]; lang: Lang; value: string; invalid?: string; onChange: (value: string) => void }) {
  return (
    <div id={`q-${name}`} className="grid gap-2">
      {options.map((option) => (
        <label key={option.v} className={`border px-4 py-3 ${value === option.v ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"} ${invalid ? "border-red-700" : ""}`}>
          <input type="radio" className="mr-3" name={name} checked={value === option.v} onChange={() => onChange(option.v)} />
          {option[lang]}
        </label>
      ))}
    </div>
  );
}

function Capability({ lang, copy, selected, invalid, onChange }: { lang: Lang; copy: (typeof ui)[Lang]; selected: Record<string, string>; invalid: Record<string, string>; onChange: (id: string, value: string) => void }) {
  return (
    <div className="flex flex-col gap-8">
      {CAPABILITIES.map((item) => (
        <fieldset key={item.id} id={`q-${item.id}`} className={invalid[item.id] ? "border border-red-700 p-3" : ""}>
          <legend className="font-display text-xl text-xinergy-charcoal">{text(item.short, lang)}</legend>
          <p className="mt-1 text-sm text-xinergy-slate">{text(item.question, lang)}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {item.levels.map((level) => (
              <label key={level.n} className={`cursor-pointer border px-2 py-3 text-center ${selected[item.id] === String(level.n) ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
                <input type="radio" className="sr-only" name={item.id} checked={selected[item.id] === String(level.n)} onChange={() => onChange(item.id, String(level.n))} />
                <span className="text-lg font-semibold">{level.n}</span>
              </label>
            ))}
            <label className={`cursor-pointer border px-2 py-3 text-center text-sm ${selected[item.id] === "ns" ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
              <input type="radio" className="sr-only" name={item.id} checked={selected[item.id] === "ns"} onChange={() => onChange(item.id, "ns")} />
              {lang === "en" ? "Don't know" : lang === "pt" ? "Não sei" : "No sé"}
            </label>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-xinergy-slate">{copy.seeLevel}</summary>
            <ol className="mt-2 flex flex-col gap-2 text-sm text-xinergy-slate">
              {item.levels.map((level) => (
                <li key={level.n}><span className="font-semibold text-xinergy-charcoal">{level.n}. </span>{level[lang]}</li>
              ))}
            </ol>
          </details>
        </fieldset>
      ))}
    </div>
  );
}

function Evidence({ lang, copy, draft, invalid, onChange }: { lang: Lang; copy: (typeof ui)[Lang]; draft: Draft; invalid: Record<string, string>; onChange: (id: string, value: unknown) => void }) {
  const evidencia = record(draft.evidencia);
  return (
    <div className="grid gap-6">
      {EVIDENCE.map((item) => (
        <Select key={item.id} id={item.id} label={text(item.label, lang)} options={item.options} lang={lang} value={evidencia[item.id] ?? ""} invalid={invalid[item.id]} onChange={(value) => onChange("evidencia", { ...evidencia, [item.id]: value })} />
      ))}
      <div>
        <h2 className="font-display text-xl">{copy.dataTitle}</h2>
        <p className="mt-2 mb-3 text-sm text-xinergy-slate">{copy.dataNote}</p>
        <Choices name="datos_ia" options={DATA_READY} lang={lang} value={String(draft.datos_ia || "")} invalid={invalid.datos_ia} onChange={(value) => onChange("datos_ia", value)} />
      </div>
    </div>
  );
}

function Agenda({ lang, selected, invalid, onChange }: { lang: Lang; selected: Record<string, string>; invalid: Record<string, string>; onChange: (id: string, value: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      {INITIATIVE_COPY.map((item) => (
        <div key={item.id} id={`q-${item.id}`} className={invalid[item.id] ? "border border-red-700 p-3" : ""}>
          <h2 className="font-semibold text-xinergy-charcoal">{text(item.name, lang)}</h2>
          <p className="mt-1 mb-3 text-sm text-xinergy-slate">{text(item.scope, lang)}</p>
          <div className="grid gap-2">
            {AGENDA_STATUS.map((option) => (
              <label key={option.v} className={`border px-3 py-2 text-sm ${selected[item.id] === option.v ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
                <input type="radio" className="mr-2" name={item.id} checked={selected[item.id] === option.v} onChange={() => onChange(item.id, option.v)} />
                {option[lang]}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) if (typeof item === "string") output[key] = item;
  return output;
}
