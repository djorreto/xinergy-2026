"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_PHONE } from "@/lib/whatsapp";
import {
  AHP,
  AHP_SCALE,
  CONSENTS,
  EMP,
  REG,
  S4,
  S5,
  S6,
  S7,
  SETS,
  SURVEY_VERSION,
  consentSections,
  industryGroup,
  isVisible,
  roleGroup,
  tx,
  ui,
  type Lang,
  type Question,
} from "@/lib/surveys/radar-2027";

const STORE = "xinergy-radar-2027";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STEPS = 8;

type Draft = Record<string, unknown>;
type SurveyCopy = (typeof ui)[Lang];

const inputClass =
  "w-full border border-xinergy-charcoal/15 bg-white px-3 py-3 text-base outline-none focus:border-xinergy-orange";

export function RadarSurvey({ locale, linkedin }: { locale: string; linkedin: string }) {
  const [lang, setLang] = useState<Lang>(locale === "pt" ? "pt" : locale === "en" ? "en" : "es");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [companyUrl, setCompanyUrl] = useState("");
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [ready, setReady] = useState(false);
  const copy = ui[lang];
  const rol = roleGroup(typeof draft.rol === "string" ? draft.rol : undefined);
  const rubro = industryGroup(typeof draft.rubro === "string" ? draft.rubro : undefined);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null") as { lang?: string; step?: number; d?: Draft; sent?: boolean } | null;
      if (saved && !saved.sent && saved.d && typeof saved.d === "object") {
        if (saved.lang === "es" || saved.lang === "en" || saved.lang === "pt") setLang(saved.lang);
        if (typeof saved.step === "number") setStep(Math.min(7, Math.max(0, saved.step)));
        setDraft(saved.d);
      }
    } catch {
      /* el navegador puede bloquear el almacenamiento */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || sent) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ lang, step, d: draft, sent: false }));
    } catch {
      /* sin almacenamiento local la encuesta igual se puede enviar */
    }
  }, [ready, sent, lang, step, draft]);

  useEffect(() => {
    if (ready) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, sent, ready]);

  const questions = useMemo(() => {
    if (step === 4) return S4.filter((item) => isVisible(item, rol, rubro));
    if (step === 5) return S5.filter((item) => isVisible(item, rol, rubro));
    if (step === 6) return S6.filter((item) => isVisible(item, rol, rubro));
    if (step === 7) return S7.filter((item) => isVisible(item, rol, rubro));
    return [];
  }, [step, rol, rubro]);

  function patch(id: string, value: unknown) {
    setDraft((current) => ({ ...current, [id]: value }));
    setInvalid((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
    setBanner("");
  }

  function toggleMulti(question: Extract<Question, { type: "multi" }>, value: string) {
    const current = Array.isArray(draft[question.id]) ? (draft[question.id] as string[]) : [];
    const exclusive = value === "ninguno" || value === "ninguna";
    let next: string[];
    if (current.includes(value)) next = current.filter((item) => item !== value);
    else if (exclusive) next = [value];
    else {
      next = current.filter((item) => item !== "ninguno" && item !== "ninguna");
      if (question.max && next.length >= question.max) return;
      next = [...next, value];
    }
    patch(question.id, next);
  }

  async function submit() {
    setSending(true);
    setBanner("");
    try {
      const response = await fetch("/api/surveys/radar-compras-2027", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_url: companyUrl, d: { ...draft, lang, version: SURVEY_VERSION } }),
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
    if (sent) return;
    if (step > 0 && !validate()) return;
    if (step === 7) {
      submit();
      return;
    }
    setStep((current) => current + 1);
  }

  function validate() {
    const problems: Record<string, string> = {};
    const mark = (id: string, message: string = copy.required) => {
      problems[id] = message;
    };
    if (step === 1) REG.forEach((question) => check(question, mark));
    if (step === 2) CONSENTS.filter((item) => item.req && draft[item.id] !== true).forEach((item) => mark(item.id));
    if (step === 3) EMP.forEach((question) => check(question, mark));
    if (step >= 4) questions.forEach((question) => check(question, mark));
    setInvalid(problems);
    if (Object.keys(problems).length) {
      setBanner(copy.fixErrors);
      const first = Object.keys(problems)[0];
      document.getElementById(`q-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    setBanner("");
    return true;
  }

  function check(question: Question, mark: (id: string, message?: string) => void) {
    if (question.id === "linkedin" && String(draft.linkedin || "").trim() && !/^https?:\/\/\S+\.\S+/i.test(String(draft.linkedin).trim()) && !/linkedin\.com\/\S+/i.test(String(draft.linkedin).trim())) {
      mark(question.id, copy.invalidUrl);
      return;
    }
    if (question.optional && isEmpty(question, draft[question.id])) return;
    if (isEmpty(question, draft[question.id])) mark(question.id);
    else if (question.type === "email" && !EMAIL.test(String(draft.email || "").trim())) mark(question.id, copy.email);
  }

  const startNumber = countBefore(step, rol, rubro);
  const whatsappText =
    lang === "pt"
      ? "Olá, respondo o Radar de Compras da Xinergy. Gostaria de conversar sobre eficiências na minha empresa."
      : lang === "en"
        ? "Hello, I took Xinergy's Procurement Radar. I would like to talk about efficiencies in my company."
        : "Hola, respondo el Radar de Compras de Xinergy. Me gustaría conversar sobre eficiencias en mi empresa.";
  const whatsapp = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10 lg:px-10 [&_input]:scroll-mb-28 [&_label]:scroll-mb-28 [&_select]:scroll-mb-28 [&_textarea]:scroll-mb-28" lang={lang === "pt" ? "pt-BR" : lang}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="label-editorial">{sent ? copy.doneEyebrow : copy.steps[step]}</p>
        <div className="inline-flex border border-xinergy-charcoal/15" role="group" aria-label={copy.langLabel}>
          {(["es", "en", "pt"] as const).map((code) => (
            <button
              key={code}
              type="button"
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wide ${lang === code ? "bg-xinergy-charcoal text-white" : "text-xinergy-slate"}`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {!sent ? (
        <>
          <div className="mb-6 h-1 bg-xinergy-charcoal/10" aria-hidden>
            <div className="h-full bg-xinergy-orange transition-[width]" style={{ width: `${(step / (STEPS - 1)) * 100}%` }} />
          </div>
          <ol className="mb-8 grid grid-cols-8 gap-1.5 text-xs text-xinergy-slate sm:gap-3">
            {copy.steps.map((name, index) => (
              <li key={name} className={`min-w-0 ${index === step ? "text-xinergy-charcoal" : ""}`}>
                <span
                  className={`grid h-8 w-8 place-items-center border text-xs font-semibold ${
                    index === step ? "border-xinergy-orange bg-xinergy-orange text-xinergy-charcoal" : index < step ? "border-xinergy-charcoal bg-xinergy-charcoal text-white" : "border-xinergy-charcoal/20"
                  }`}
                >
                  {index < step ? "✓" : index + 1}
                </span>
                <span className="mt-1.5 hidden text-[11px] leading-snug lg:block">{name}</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {sent ? (
        <Done copy={copy} whatsapp={whatsapp} linkedin={linkedin} />
      ) : step === 0 ? (
        <Welcome copy={copy} />
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            forward();
          }}
          className="flex flex-col gap-8"
        >
          <header>
            <p className="text-sm text-xinergy-beige">{copy.stepOf(step + 1, STEPS)}</p>
            <h1 className="mt-2 font-display text-3xl leading-tight text-xinergy-charcoal sm:text-4xl">{heading(copy, step, rol).title}</h1>
            {heading(copy, step, rol).note ? <p className="mt-3 max-w-2xl text-xinergy-slate">{heading(copy, step, rol).note}</p> : null}
          </header>

          {step === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Honeypot value={companyUrl} onChange={setCompanyUrl} />
              {REG.map((question) => (
                <Field key={question.id} question={question} draft={draft} lang={lang} invalid={invalid[question.id]} copy={copy} onChange={patch} onToggle={toggleMulti} />
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-5">
              <div className="border border-xinergy-charcoal/10 bg-white p-5 text-sm leading-relaxed text-xinergy-slate">
                {consentSections[lang].map((section) => (
                  <section key={section.title} className="mb-4 last:mb-0">
                    <h2 className="font-display text-base text-xinergy-charcoal">{section.title}</h2>
                    <p className="mt-1">{section.body}</p>
                  </section>
                ))}
              </div>
              {CONSENTS.map((item) => (
                <div key={item.id} id={`q-${item.id}`}>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-5 w-5 accent-xinergy-orange" checked={draft[item.id] === true} onChange={(event) => patch(item.id, event.target.checked)} />
                    <span>
                      {tx(item.label, lang)} {!item.req ? <span className="text-xinergy-slate">{copy.optional}</span> : null}
                    </span>
                  </label>
                  {invalid[item.id] ? <p className="mt-1 text-sm text-red-700">{invalid[item.id]}</p> : null}
                </div>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {EMP.map((question) => (
                <Field key={question.id} question={question} draft={draft} lang={lang} invalid={invalid[question.id]} copy={copy} onChange={patch} onToggle={toggleMulti} />
              ))}
            </div>
          ) : null}

          {step >= 4 ? (
            <div className="flex flex-col gap-8">
              {questions.length === 0 ? <p className="text-xinergy-slate">{copy.s6Empty}</p> : null}
              {questions.map((question, index) => (
                <Field
                  key={question.id}
                  question={question}
                  number={startNumber + index + 1}
                  draft={draft}
                  lang={lang}
                  invalid={invalid[question.id]}
                  copy={copy}
                  onChange={patch}
                  onToggle={toggleMulti}
                />
              ))}
            </div>
          ) : null}

          {banner ? <p className="text-sm font-medium text-red-700">{banner}</p> : <p className="text-sm text-xinergy-slate">{copy.saved}</p>}

          <div className="sticky bottom-0 z-20 -mx-4 flex items-center gap-3 border-t border-xinergy-charcoal/10 bg-xinergy-ivory/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
            <button type="button" className="btn-secondary min-h-12 flex-1 sm:flex-none" onClick={() => setStep((current) => Math.max(0, current - 1))}>
              {copy.back}
            </button>
            <button type="submit" className="btn-primary min-h-12 flex-[1.6] sm:flex-none" disabled={sending}>
              {sending ? copy.sending : step === 7 ? copy.submit : copy.next}
            </button>
          </div>
        </form>
      )}

      {!sent && step === 0 ? (
        <div className="mt-8">
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={forward}>
            {copy.start}
          </button>
        </div>
      ) : null}
    </article>
  );
}

function Welcome({ copy }: { copy: SurveyCopy }) {
  return (
    <div>
      <p className="text-sm font-semibold text-xinergy-slate">{copy.welcomeEyebrow}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-xinergy-charcoal sm:text-5xl">{copy.welcomeTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-xinergy-slate">{copy.welcomeLead}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {copy.benefits.map(([title, text]) => (
          <div key={title} className="border-t-2 border-xinergy-orange pt-3">
            <p className="font-display text-base text-xinergy-charcoal">{title}</p>
            <p className="mt-1 text-sm text-xinergy-slate">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-xinergy-slate">
        {copy.meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </p>
    </div>
  );
}

function Done({ copy, whatsapp, linkedin }: { copy: SurveyCopy; whatsapp: string; linkedin: string }) {
  return (
    <div>
      <h1 className="font-display text-4xl leading-tight text-xinergy-charcoal sm:text-5xl">{copy.doneTitle}</h1>
      <p className="mt-4 text-lg text-xinergy-slate">{copy.doneLead}</p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-xinergy-slate">
        {copy.doneList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <section className="mt-10 border border-xinergy-charcoal/10 bg-white p-5 sm:p-7">
        <p className="label-editorial">{copy.talkEyebrow}</p>
        <h2 className="mt-3 font-display text-2xl text-xinergy-charcoal">{copy.talkTitle}</h2>
        <p className="mt-2 text-xinergy-slate">{copy.talkLead}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/contacto" className="btn-primary w-full">
            {copy.contact}
          </Link>
          <a href={whatsapp} className="btn-secondary w-full" target="_blank" rel="noreferrer">
            {copy.whatsapp}
          </a>
          <a href={linkedin} className="btn-secondary w-full" target="_blank" rel="noreferrer">
            {copy.linkedin}
          </a>
          <Link href="/" className="btn-secondary w-full">
            {copy.website}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
      <input name="xinergy_hp" value={value} onChange={(event) => onChange(event.target.value)} tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function Field({
  question,
  number,
  draft,
  lang,
  invalid,
  copy,
  onChange,
  onToggle,
}: {
  question: Question;
  number?: number;
  draft: Draft;
  lang: Lang;
  invalid?: string;
  copy: SurveyCopy;
  onChange: (id: string, value: unknown) => void;
  onToggle: (question: Extract<Question, { type: "multi" }>, value: string) => void;
}) {
  const wide = question.type !== "text" && question.type !== "email" && question.type !== "tel" && question.type !== "url" && question.type !== "select";
  return (
    <div id={`q-${question.id}`} className={question.full || wide ? "sm:col-span-2" : undefined}>
      <div className={wide ? "border-b border-xinergy-charcoal/10 pb-6" : undefined}>
        <div className="block">
          {number ? <span className="mb-1 block text-xs tracking-wide text-xinergy-beige">{String(number).padStart(2, "0")}</span> : null}
          <label className="font-semibold text-xinergy-charcoal" htmlFor={`f-${question.id}`}>
            {tx(question.label, lang)} {question.optional ? <span className="font-normal text-xinergy-slate">{copy.optional}</span> : null}
          </label>
          {question.help ? <span className="mt-1 block text-sm font-normal text-xinergy-slate">{tx(question.help, lang)}</span> : null}
        </div>
        <div className="mt-3">
          <Control question={question} draft={draft} lang={lang} copy={copy} onChange={onChange} onToggle={onToggle} />
        </div>
        {invalid ? <p className="mt-2 text-sm text-red-700">{invalid}</p> : null}
      </div>
    </div>
  );
}

function Control({
  question,
  draft,
  lang,
  copy,
  onChange,
  onToggle,
}: {
  question: Question;
  draft: Draft;
  lang: Lang;
  copy: SurveyCopy;
  onChange: (id: string, value: unknown) => void;
  onToggle: (question: Extract<Question, { type: "multi" }>, value: string) => void;
}) {
  const value = draft[question.id];
  if (question.type === "text" || question.type === "email" || question.type === "tel" || question.type === "url") {
    return (
      <input
        id={`f-${question.id}`}
        className={`${inputClass} ${draft ? "" : ""}`}
        type={question.type}
        autoComplete={question.auto}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(question.id, event.target.value)}
      />
    );
  }
  if (question.type === "textarea") {
    return <textarea id={`f-${question.id}`} className={`${inputClass} min-h-28`} value={typeof value === "string" ? value : ""} onChange={(event) => onChange(question.id, event.target.value)} />;
  }
  if (question.type === "select") {
    return (
      <select id={`f-${question.id}`} className={inputClass} value={typeof value === "string" ? value : ""} onChange={(event) => onChange(question.id, event.target.value)}>
        <option value="">—</option>
        {question.options.map((option) => (
          <option key={option.v} value={option.v}>
            {tx(option, lang)}
          </option>
        ))}
      </select>
    );
  }
  if (question.type === "single") {
    return (
      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => {
          const on = value === option.v;
          return (
            <label key={option.v} className={`cursor-pointer border px-3 py-3 text-sm leading-snug ${on ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15 bg-white"}`}>
              <input type="radio" className="sr-only" name={question.id} value={option.v} checked={on} onChange={() => onChange(question.id, option.v)} />
              {tx(option, lang)}
            </label>
          );
        })}
      </div>
    );
  }
  if (question.type === "multi") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div>
        {question.max ? (
          <p className="mb-2 text-xs text-xinergy-slate">
            {copy.pickMax(question.max)} · {copy.chosen(selected.length, question.max)}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {question.options.map((option) => {
            const on = selected.includes(option.v);
            const disabled = !on && Boolean(question.max && selected.length >= question.max);
            return (
              <label key={option.v} className={`cursor-pointer border px-3 py-3 text-sm leading-snug ${on ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15 bg-white"} ${disabled ? "opacity-45" : ""}`}>
                <input type="checkbox" className="sr-only" checked={on} disabled={disabled} onChange={() => onToggle(question, option.v)} />
                {tx(option, lang)}
              </label>
            );
          })}
        </div>
        {question.other && selected.includes("otro") ? (
          <input
            className={`${inputClass} mt-3`}
            placeholder={copy.otherPh}
            value={typeof draft[`${question.id}_otro`] === "string" ? (draft[`${question.id}_otro`] as string) : ""}
            onChange={(event) => onChange(`${question.id}_otro`, event.target.value)}
          />
        ) : null}
      </div>
    );
  }
  if (question.type === "scale") {
    const anchors = question.anchors ?? (question.set ? SETS[question.set] : []);
    return (
      <div className="grid gap-2 sm:grid-cols-5">
        {anchors.map((anchor, index) => {
          const score = String(index + 1);
          const on = value === score;
          return (
            <label key={score} className={`cursor-pointer border px-3 py-3 text-center sm:text-center ${on ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15 bg-white"}`}>
              <input type="radio" className="sr-only" name={question.id} value={score} checked={on} onChange={() => onChange(question.id, score)} />
              <span className="block font-display text-xl text-xinergy-charcoal">{score}</span>
              <span className="mt-1 block text-xs leading-snug text-xinergy-slate">{tx(anchor, lang)}</span>
            </label>
          );
        })}
      </div>
    );
  }
  if (question.type === "matrix") {
    const record = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
    const anchors = SETS[question.set];
    return (
      <div className="flex flex-col gap-4">
        {question.rows.map((row) => (
          <fieldset key={row.v}>
            <legend className="mb-2 text-sm">{tx(row, lang)}</legend>
            <div className="grid grid-cols-5 gap-1.5">
              {anchors.map((anchor, index) => {
                const score = String(index + 1);
                const on = record[row.v] === score;
                return (
                  <label key={score} title={tx(anchor, lang)} className={`cursor-pointer border px-1 py-2 text-center ${on ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15 bg-white"}`}>
                    <input
                      type="radio"
                      className="sr-only"
                      name={`${question.id}-${row.v}`}
                      checked={on}
                      onChange={() => onChange(question.id, { ...record, [row.v]: score })}
                    />
                    <span className="block text-sm font-semibold">{score}</span>
                    <span className="mt-0.5 hidden text-[10px] leading-tight text-xinergy-slate sm:block">{tx(anchor, lang)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    );
  }
  const selected = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
  const sections = [
    [copy.ahpA, "macro"],
    [copy.ahpB, "fin"],
    [copy.ahpC, "res"],
    [copy.ahpD, "trans"],
  ] as const;
  return (
    <div className="flex flex-col gap-5">
      <p className="hidden text-[11px] text-xinergy-slate sm:grid sm:grid-cols-[1fr_minmax(18rem,2fr)_1fr] sm:gap-3">
        <span>← {copy.leftMore}</span>
        <span className="flex justify-between">
          <i>9</i>
          <i>7</i>
          <i>5</i>
          <i>3</i>
          <i>1 = {copy.equal}</i>
          <i>3</i>
          <i>5</i>
          <i>7</i>
          <i>9</i>
        </span>
        <span className="text-right">{copy.rightMore} →</span>
      </p>
      {sections.map(([title, group]) => (
        <section key={group}>
          <h2 className="border-b border-xinergy-charcoal/15 pb-2 font-display text-sm text-xinergy-charcoal">{title}</h2>
          {AHP.pairs
            .filter((pair) => pair.group === group)
            .map((pair) => {
              const left = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.a)?.label : AHP.criteria[pair.a];
              const right = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.b)?.label : AHP.criteria[pair.b];
              return (
                <div key={pair.id} className="border-b border-xinergy-charcoal/10 py-3">
                  <div className="mb-2 grid grid-cols-2 gap-3 text-sm font-semibold sm:hidden">
                    <span>{left ? tx(left, lang) : pair.a}</span>
                    <span className="text-right">{right ? tx(right, lang) : pair.b}</span>
                  </div>
                  <div className="sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(16rem,2.4fr)_minmax(0,1fr)] sm:items-center sm:gap-4">
                    <span className="hidden text-sm font-semibold sm:block">{left ? tx(left, lang) : pair.a}</span>
                    <div className="grid grid-cols-9 gap-1">
                      {AHP_SCALE.map((point) => {
                        const on = selected[pair.id] === point.token;
                        return (
                          <label key={point.token} title={point[lang]} className="cursor-pointer">
                            <input type="radio" className="peer sr-only" name={pair.id} checked={on} onChange={() => onChange("prioridades_ahp", { ...selected, [pair.id]: point.token })} />
                            <span className="grid h-11 place-items-center border border-xinergy-charcoal/15 text-xs font-semibold peer-checked:border-xinergy-orange peer-checked:bg-[#FFF1D6] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-xinergy-orange">
                              {point.n}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-1.5 text-center text-[11px] text-xinergy-slate sm:hidden">
                      {selected[pair.id] ? AHP_SCALE.find((point) => point.token === selected[pair.id])?.[lang] : `← ${copy.leftMore} · 1 ${copy.equal} · ${copy.rightMore} →`}
                    </p>
                    <span className="hidden text-right text-sm font-semibold sm:block">{right ? tx(right, lang) : pair.b}</span>
                  </div>
                </div>
              );
            })}
        </section>
      ))}
    </div>
  );
}

function heading(copy: SurveyCopy, step: number, rol: string) {
  if (step === 1) return { title: copy.regTitle, note: copy.regNote };
  if (step === 2) return { title: copy.conTitle, note: "" };
  if (step === 3) return { title: copy.empTitle, note: copy.empNote };
  if (step === 4) return { title: copy.s4Title, note: "" };
  if (step === 5) return { title: copy.s5Title, note: "" };
  if (step === 6) {
    const titles = copy.s6Title as { cpo: string; cfo: string; ceo: string; otro: string };
    const notes = copy.s6Note as { cpo: string; cfo: string; ceo: string; otro: string };
    const key = rol === "cfo" || rol === "ceo" || rol === "cpo" ? rol : "otro";
    return { title: titles[key], note: notes[key] };
  }
  return { title: copy.s7Title, note: "" };
}

function isEmpty(question: Question, value: unknown) {
  if (question.type === "multi") return !Array.isArray(value) || value.length === 0;
  if (question.type === "ahp") {
    const record = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
    return AHP.pairs.some((pair) => !record[pair.id]);
  }
  if (question.type === "matrix") {
    const record = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
    return question.rows.some((row) => !record[row.v]);
  }
  return typeof value !== "string" || !value.trim();
}

function countBefore(step: number, rol: string, rubro: string | null) {
  const lists = step === 5 ? [S4] : step === 6 ? [S4, S5] : step === 7 ? [S4, S5, S6] : [];
  return lists.flat().filter((question) => isVisible(question, rol, rubro)).length;
}
