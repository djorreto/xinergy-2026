"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { contactHref } from "@/lib/contact-context";
import {
  industries,
  spendBands,
  maturityQuestions,
  toolQuestions,
  calculateOpportunity,
  formatUsd,
  type CalculatorInput,
  type IndustryId,
  type SpendBand,
} from "@/lib/calculator";
import { isValidEmail, submitCalculatorLead } from "@/lib/calculator-lead";

const STEPS = ["Empresa", "Madurez", "Resultado"] as const;
const defaultAnswers = [2, 2, 2, 2, 2];

export function EfficiencyCalculator() {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<IndustryId>("retail");
  const [spendBand, setSpendBand] = useState<SpendBand>("25-100");
  const [answers, setAnswers] = useState<number[]>(defaultAnswers);
  const [hasNegotiationTool, setHasNegotiationTool] = useState<boolean | null>(null);
  const [hasStockPlanningTool, setHasStockPlanningTool] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resultsUnlocked, setResultsUnlocked] = useState(false);

  const input: CalculatorInput = useMemo(
    () => ({
      industry,
      spendBand,
      maturityAnswers: answers,
      hasNegotiationTool: hasNegotiationTool ?? false,
      hasStockPlanningTool: hasStockPlanningTool ?? false,
    }),
    [industry, spendBand, answers, hasNegotiationTool, hasStockPlanningTool],
  );

  const toolsAnswered = hasNegotiationTool !== null && hasStockPlanningTool !== null;

  const result = useMemo(
    () => (step === 2 && resultsUnlocked ? calculateOpportunity(input) : null),
    [step, resultsUnlocked, input],
  );

  const setAnswer = (index: number, value: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleUnlockResults = async () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setEmailError("Ingresa un correo válido.");
      return;
    }

    setEmailError(null);
    setSubmitting(true);
    await submitCalculatorLead(trimmed, input);
    setSubmitting(false);
    setResultsUnlocked(true);
  };

  return (
    <div className="overflow-hidden border border-xinergy-charcoal/10 bg-white shadow-[0_32px_64px_-24px_rgba(63,55,75,0.18)]">
      {/* Progress */}
      <div className="border-b border-xinergy-charcoal/8 bg-xinergy-cream/60 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-xinergy-slate">
            Diagnóstico de eficiencias
          </p>
          <p className="text-xs text-xinergy-slate/70">
            Paso {step + 1} de {STEPS.length}
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-0.5 rounded-full transition-colors ${
                  i <= step ? "bg-xinergy-orange" : "bg-xinergy-charcoal/10"
                }`}
              />
              <span
                className={`mt-2 hidden text-[10px] uppercase tracking-wider sm:block ${
                  i === step ? "text-xinergy-charcoal font-semibold" : "text-xinergy-slate/50"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3 p-4 sm:p-6 lg:p-10">
          {step === 0 && (
            <div className="space-y-8 animate-in">
              <fieldset>
                <legend className="label-editorial">Industria</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setIndustry(ind.id)}
                      className={`option-tile ${industry === ind.id ? "option-tile-active" : ""}`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label-editorial">Gasto anual con proveedores (aprox.)</legend>
                <p className="mt-1 text-xs text-xinergy-slate/80">
                  Compras directas e indirectas consolidadas
                </p>
                <div className="mt-3 space-y-2">
                  {spendBands.map((band) => (
                    <button
                      key={band.id}
                      type="button"
                      onClick={() => setSpendBand(band.id)}
                      className={`option-tile w-full text-left ${spendBand === band.id ? "option-tile-active" : ""}`}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-10">
              <p className="text-sm leading-relaxed text-xinergy-slate">
                Siete preguntas para estimar madurez y herramientas. No hay respuestas
                correctas — solo diagnóstico.
              </p>
              {maturityQuestions.map((q, qi) => (
                <fieldset key={q.id}>
                  <legend className="text-sm font-medium leading-snug text-xinergy-charcoal">
                    {qi + 1}. {q.question}
                  </legend>
                  <div className="mt-4 flex flex-col gap-1 text-[10px] uppercase tracking-wider text-xinergy-slate/60 sm:flex-row sm:justify-between sm:gap-4">
                    <span className="sm:max-w-[42%]">{q.lowLabel}</span>
                    <span className="sm:max-w-[42%] sm:text-right">{q.highLabel}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAnswer(qi, v)}
                        className={`h-11 rounded-sm border text-sm font-medium transition ${
                          answers[qi] === v
                            ? "border-xinergy-orange bg-xinergy-orange/10 text-xinergy-charcoal"
                            : "border-xinergy-charcoal/12 text-xinergy-slate hover:border-xinergy-charcoal/25"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}

              <div className="space-y-8 border-t border-xinergy-charcoal/8 pt-8">
                <p className="label-editorial">Herramientas</p>
                {toolQuestions.map((q, qi) => {
                  const value =
                    qi === 0 ? hasNegotiationTool : hasStockPlanningTool;
                  const setValue =
                    qi === 0 ? setHasNegotiationTool : setHasStockPlanningTool;

                  return (
                    <fieldset key={q.id}>
                      <legend className="text-sm font-medium leading-snug text-xinergy-charcoal">
                        {qi + 6}. {q.question}
                      </legend>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {[
                          { label: "Sí", answer: true },
                          { label: "No", answer: false },
                        ].map(({ label, answer }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setValue(answer)}
                            className={`h-11 rounded-sm border text-sm font-medium transition ${
                              value === answer
                                ? "border-xinergy-orange bg-xinergy-orange/10 text-xinergy-charcoal"
                                : "border-xinergy-charcoal/12 text-xinergy-slate hover:border-xinergy-charcoal/25"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && !resultsUnlocked && (
            <div className="space-y-6">
              <div>
                <p className="label-editorial">Tu resultado está listo</p>
                <h3 className="mt-3 text-xl font-semibold text-xinergy-charcoal">
                  Ingresa tu correo para verlo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-xinergy-slate">
                  Te mostramos cuántas eficiencias puedes conseguir al instante. Solo usamos tu email para
                  dar seguimiento si quieres profundizar.
                </p>
              </div>
              <fieldset>
                <legend className="sr-only">Correo electrónico</legend>
                <label htmlFor="calculator-email" className="label-editorial">
                  Correo electrónico
                </label>
                <input
                  id="calculator-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="tu@empresa.com"
                  className={`mt-3 w-full border bg-white px-4 py-3 text-sm text-xinergy-charcoal outline-none transition focus:border-xinergy-orange ${
                    emailError
                      ? "border-red-400"
                      : "border-xinergy-charcoal/15"
                  }`}
                />
                {emailError && (
                  <p className="mt-2 text-xs text-red-600">{emailError}</p>
                )}
              </fieldset>
            </div>
          )}

          {step === 2 && resultsUnlocked && result && (
            <div className="space-y-8">
              <div>
                <p className="label-editorial">Eficiencias estimadas (año 1)</p>
                <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-xinergy-charcoal sm:mt-4 sm:text-4xl lg:text-5xl">
                  {formatUsd(result.savingsExpected)}
                </p>
                <p className="mt-2 text-sm text-xinergy-slate">
                  Rango prudente: {formatUsd(result.savingsConservative)} –{" "}
                  {formatUsd(result.savingsAggressive)} sobre{" "}
                  <strong>{formatUsd(result.addressableSpendUsd)}</strong> de gasto
                  addressable (~{result.addressablePct}% del total).
                </p>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="metric-cell">
                  <dt>Madurez en compras</dt>
                  <dd>{result.maturityLevel}</dd>
                </div>
                <div className="metric-cell">
                  <dt>Tasa esperada</dt>
                  <dd>{result.rateExpected}% del addressable</dd>
                </div>
              </dl>

              <div>
                <p className="label-editorial">Palancas prioritarias con Xinergy</p>
                <ul className="mt-3 space-y-2">
                  {result.priorityLevers.map((lever) => (
                    <li
                      key={lever}
                      className="flex gap-2 text-sm text-xinergy-charcoal before:content-[''] before:mt-2 before:h-px before:w-4 before:flex-shrink-0 before:bg-xinergy-orange"
                    >
                      {lever}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-xinergy-slate">
                  Servicios sugeridos:{" "}
                  <span className="font-medium text-xinergy-charcoal">
                    {result.recommendedServices.join(" · ")}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="calculator-actions mobile-actions mt-8 flex flex-col gap-3 border-t border-xinergy-charcoal/8 pt-6 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-8">
            {step > 0 && !(step === 2 && resultsUnlocked) && (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && !resultsUnlocked) {
                    setStep(1);
                    return;
                  }
                  setStep(step - 1);
                }}
                className="btn-secondary w-full sm:w-auto"
                disabled={submitting}
              >
                Atrás
              </button>
            )}
            {step < 1 && (
              <button type="button" onClick={() => setStep(step + 1)} className="btn-primary w-full sm:w-auto">
                Continuar
              </button>
            )}
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!toolsAnswered}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Ver mis eficiencias
              </button>
            )}
            {step === 2 && !resultsUnlocked && (
              <button
                type="button"
                onClick={handleUnlockResults}
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Un momento…" : "Ver mis eficiencias"}
              </button>
            )}
            {step === 2 && resultsUnlocked && (
              <Link href={contactHref("diagnostico")} className="btn-primary w-full text-center sm:w-auto">
                Agendar diagnóstico sin costo
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="border-t border-xinergy-charcoal/8 bg-xinergy-charcoal p-4 text-white sm:p-6 lg:col-span-2 lg:border-t-0 lg:border-l">
          {step < 2 || !resultsUnlocked ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-xinergy-orange">
                Sin costo para ustedes
              </p>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug">
                Próximos pasos con Xinergy
              </h3>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    n: "01",
                    t: "NDA y envío de información",
                    d: "Firmamos confidencialidad y recibimos la información base de su operación y categorías.",
                  },
                  {
                    n: "02",
                    t: "Opportunity assessment",
                    d: "Cuantificamos eficiencias por categoría con metodología audit-able.",
                  },
                  {
                    n: "03",
                    t: "Propuesta cash neutral",
                    d: "Honorarios ligados a eficiencias verificadas en P&L.",
                  },
                ].map((item) => (
                  <li key={item.n} className="flex gap-4">
                    <span className="text-xs font-bold text-xinergy-orange/80">{item.n}</span>
                    <div>
                      <p className="text-sm font-semibold">{item.t}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/55">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-xs leading-relaxed text-white/45">
                El assessment estará sujeto a una evaluación preliminar del equipo.
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-xinergy-orange">
                Cash neutral
              </p>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug">
                Ganamos cuando ustedes capturan valor
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                No cobramos por horas. El fee se vincula a eficiencias reales e impacto en el P&L
                — verificable por finanzas.
              </p>
              <p className="mt-8 text-[11px] italic text-white/40">
                *Estimación ilustrativa. La propuesta formal se define tras el diagnóstico sin
                costo.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
