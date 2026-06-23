"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import type { WcsPlatformStep } from "@/lib/content/wcs";

export type { WcsPlatformStep };

type WorkingCapitalShowcaseProps = {
  eyebrow: string;
  title: string;
  intro: string;
  tourHintAuto: string;
  tourHintLocked: string;
  steps: readonly WcsPlatformStep[];
};

/** Tiempo por lámina antes de pasar a la siguiente */
const STEP_MS = 5200;

function useShowcaseCycle(
  stepCount: number,
  inView: boolean,
  lockedStep: number | null,
) {
  const [active, setActive] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  useEffect(() => {
    if (lockedStep !== null) {
      setActive(lockedStep);
      setStepProgress(1);
      return;
    }

    if (!inView || stepCount <= 1) return;

    const totalMs = stepCount * STEP_MS;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = (now - start) % totalMs;
      const index = Math.floor(elapsed / STEP_MS) % stepCount;
      const within = (elapsed % STEP_MS) / STEP_MS;
      setActive(index);
      setStepProgress(within);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stepCount, lockedStep]);

  return { active, stepProgress };
}

function BrowserChrome({ children }: { children: ReactNode }) {
  return (
    <div className="wcs-showcase__frame overflow-hidden rounded-lg border border-xinergy-charcoal/10 bg-white shadow-[0_24px_64px_-12px_rgba(63,55,75,0.18)]">
      <div className="flex items-center gap-2 border-b border-xinergy-charcoal/8 bg-xinergy-cream/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-xinergy-charcoal/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-xinergy-charcoal/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-xinergy-charcoal/15" />
        <div className="ml-3 flex-1 rounded bg-white/80 px-3 py-1 text-[10px] text-xinergy-slate/70">
          platform.xinergy · working capital
        </div>
      </div>
      <div className="relative min-h-[360px] aspect-[5/4] bg-gradient-to-br from-xinergy-cream/40 to-white sm:min-h-[400px]">
        {children}
      </div>
    </div>
  );
}

function DashboardScene({ visible }: { visible: boolean }) {
  const kpis = [
    { label: "Días contractual", value: "42", unit: "días" },
    { label: "Oportunidad DPO", value: "+18", unit: "días" },
    { label: "DPO esperado", value: "60", unit: "días" },
    { label: "CF potencial", value: "USD 124", unit: "M" },
  ];

  const spendBars = [35, 52, 48, 68, 55, 72, 64, 78, 70, 85, 62, 90];

  return (
    <div
      className={`wcs-showcase__scene absolute inset-0 p-4 transition-all duration-700 sm:p-5 ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-xinergy-orange">
          Executive dashboard
        </span>
        <span className="rounded bg-xinergy-orange/15 px-2 py-0.5 text-[9px] font-medium text-xinergy-charcoal">
          Live · Q1 2026
        </span>
      </div>
      <p className="mb-2 text-[9px] text-xinergy-slate">Spend analizado · USD 890M · 847 proveedores</p>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded border border-xinergy-charcoal/8 bg-white p-2.5 sm:p-3">
            <p className="text-[8px] uppercase tracking-wide text-xinergy-slate sm:text-[9px]">
              {k.label}
            </p>
            <p className="mt-1 font-bold text-xinergy-charcoal">
              <span className="text-base sm:text-lg">{k.value}</span>
              <span className="ml-0.5 text-[10px] font-normal text-xinergy-slate">{k.unit}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded border border-xinergy-charcoal/8 bg-white p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[8px] uppercase tracking-wide text-xinergy-slate">Spend por categoría</p>
          <p className="text-[8px] font-medium text-xinergy-orange">+12% vs. benchmark</p>
        </div>
        <div className="mt-2 flex h-14 items-end gap-1 sm:h-16">
          {spendBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-xinergy-orange/70 transition-all duration-500"
              style={{ height: visible ? `${h}%` : "8%" }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[7px] text-xinergy-slate/80">
          <span>Directo</span>
          <span>Indirecto</span>
          <span>Servicios</span>
          <span>CAPEX</span>
        </div>
      </div>
    </div>
  );
}

function SegmentationScene({ visible }: { visible: boolean }) {
  /**
   * Matriz 9 cuadrantes — layout Calculum / lámina Assessment.
   * Filas: Alto → Medio → Bajo · Columnas: Bajo → Medio → Alto impacto CF
   */
  type CellPriority = "high" | "high-outline" | "mid" | "low" | "light";

  const cells: {
    num: number;
    cf: string;
    spend: string;
    suppliers: number;
    priority: CellPriority;
  }[] = [
    { num: 7, cf: "12.3m", spend: "424.8m", suppliers: 441, priority: "low" },
    { num: 4, cf: "13.2m", spend: "428.9m", suppliers: 37, priority: "high" },
    { num: 1, cf: "11.6m", spend: "177.9m", suppliers: 5, priority: "high-outline" },
    { num: 8, cf: "4.4m", spend: "44.9m", suppliers: 107, priority: "mid" },
    { num: 5, cf: "12.4m", spend: "95.8m", suppliers: 30, priority: "low" },
    { num: 2, cf: "35.5m", spend: "220.0m", suppliers: 13, priority: "high" },
    { num: 9, cf: "6.5m", spend: "54.8m", suppliers: 158, priority: "light" },
    { num: 6, cf: "20.6m", spend: "113.5m", suppliers: 57, priority: "mid" },
    { num: 3, cf: "39.0m", spend: "217.3m", suppliers: 15, priority: "low" },
  ];

  const cellTone: Record<CellPriority, string> = {
    high: "bg-xinergy-orange text-white",
    "high-outline": "border-2 border-xinergy-orange bg-white text-xinergy-charcoal",
    mid: "bg-xinergy-slate/55 text-white",
    low: "bg-xinergy-charcoal/75 text-white",
    light: "bg-xinergy-charcoal/12 text-xinergy-charcoal",
  };

  const badgeTone: Record<CellPriority, string> = {
    high: "bg-white/25 text-white",
    "high-outline": "bg-xinergy-orange text-white",
    mid: "bg-white/20 text-white",
    low: "bg-white/15 text-white",
    light: "bg-xinergy-charcoal/15 text-xinergy-charcoal",
  };

  return (
    <div
      className={`wcs-showcase__scene absolute inset-0 flex flex-col p-2 transition-all duration-700 sm:p-3 ${
        visible ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[0.98]"
      }`}
    >
      <div className="shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-xinergy-orange">
          Segmentación proveedores
        </p>
        <p className="text-[9px] text-xinergy-slate">
          Matriz 9 cuadrantes · 12 alta prioridad · USD 410M addressable
        </p>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 gap-1.5">
        <div className="flex w-5 shrink-0 flex-col justify-between py-1 text-[8px] font-semibold uppercase text-xinergy-slate">
          <span>Alto</span>
          <span>Medio</span>
          <span>Bajo</span>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-2 rounded-md bg-white p-1.5 ring-1 ring-xinergy-charcoal/8">
            {cells.map((cell, i) => (
              <div
                key={cell.num}
                className={`relative flex min-h-[5rem] flex-col justify-end rounded-md p-2 transition-transform duration-500 sm:min-h-[5.75rem] ${cellTone[cell.priority]}`}
                style={{
                  transform: visible ? "scale(1)" : "scale(0.94)",
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                <span
                  className={`absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold sm:h-6 sm:w-6 sm:text-[10px] ${badgeTone[cell.priority]}`}
                >
                  {cell.num}
                </span>
                <div className="space-y-1 leading-tight">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[7px] opacity-90 sm:text-[8px]">CF opp.</span>
                    <span className="text-[8px] font-bold sm:text-[9px]">{cell.cf}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[7px] opacity-90 sm:text-[8px]">Spend</span>
                    <span className="text-[8px] font-bold sm:text-[9px]">{cell.spend}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[7px] opacity-90 sm:text-[8px]">Suppliers</span>
                    <span className="text-[8px] font-bold sm:text-[9px]">{cell.suppliers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between px-0.5 text-[8px] font-medium uppercase tracking-wide text-xinergy-slate">
            <span>Bajo</span>
            <span>Medio</span>
            <span>Alto</span>
          </div>
          <p className="mt-0.5 text-center text-[8px] text-xinergy-slate">
            Impacto en el comprador (Cash Flow) →
          </p>
        </div>
      </div>

      <div className="mt-2 flex shrink-0 flex-wrap gap-3 text-[8px] text-xinergy-slate sm:text-[9px]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-xinergy-orange" /> Alta prioridad
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-xinergy-charcoal/55" /> Menor prioridad
        </span>
      </div>
    </div>
  );
}

function WaterfallScene({ visible }: { visible: boolean }) {
  const totalM = 155.4;
  const plotH = 72;

  const kpis = [
    { value: "13", label: "Días contractual" },
    { value: "42", label: "Oportunidad" },
    { value: "28", label: "Esperado" },
    { value: "155.4m", label: "CF oportunidad" },
    { value: "14.0m", label: "Profit oport." },
    { value: "1.8b", label: "Volumen analiz." },
  ];

  type BarVariant = "base" | "stack" | "increment" | "total";

  const bars: {
    label: string;
    shortLabel: string;
    value: number;
    display: string;
    variant: BarVariant;
  }[] = [
    { label: "Supplier Standard", shortLabel: "Supplier Std.", value: 14.7, display: "14.7m", variant: "base" },
    { label: "Peer Group Standard", shortLabel: "Peer Group", value: 103.8, display: "103.8m", variant: "stack" },
    { label: "Parent Supplier (Max)", shortLabel: "Parent Sup.", value: 13.5, display: "13.5m", variant: "increment" },
    { label: "Industry Region Standard", shortLabel: "Ind. Region", value: 0.945, display: "945.0k", variant: "increment" },
    { label: "Harmonization", shortLabel: "Harmon.", value: 7.8, display: "7.8m", variant: "increment" },
    { label: "Payment Float", shortLabel: "Pay. Float", value: 14.6, display: "14.6m", variant: "increment" },
    { label: "Cash Flow Opportunity", shortLabel: "CF oport.", value: totalM, display: "155.4m", variant: "total" },
  ];

  const barFill: Record<BarVariant, string> = {
    base: "#fca100",
    stack: "#3f374b",
    increment: "rgba(252, 161, 0, 0.38)",
    total: "#54526d",
  };

  const colCount = bars.length;
  const colW = 44;
  const barW = 30;
  const chartW = colCount * colW;

  let cumulative = 0;
  const rendered = bars.map((bar) => {
    if (bar.variant === "total") {
      const h = (bar.value / totalM) * plotH;
      return { ...bar, y: plotH - h, h, bottomM: 0 };
    }
    const bottomM = cumulative;
    cumulative += bar.value;
    const h = Math.max((bar.value / totalM) * plotH, bar.value < 2 ? 1.5 : 3);
    const y = plotH - ((bottomM + bar.value) / totalM) * plotH;
    return { ...bar, y, h, bottomM };
  });

  return (
    <div
      className={`wcs-showcase__scene absolute inset-0 flex flex-col p-2 transition-all duration-700 sm:p-3 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-xinergy-orange">
          Cascada cash flow
        </p>
        <p className="text-[9px] text-xinergy-slate">
          Extensión de plazos · CF potencial por estrategia
        </p>
      </div>

      <div className="mt-2 grid shrink-0 grid-cols-6 gap-1">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className="rounded border border-xinergy-charcoal/10 bg-white px-1 py-1.5 text-center transition-all duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(4px)",
              transitionDelay: `${i * 50}ms`,
            }}
          >
            <p className="text-[10px] font-bold leading-tight text-xinergy-charcoal sm:text-[11px]">
              {kpi.value}
            </p>
            <p className="mt-0.5 text-[7px] leading-tight text-xinergy-slate sm:text-[8px]">
              {kpi.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col rounded border border-xinergy-charcoal/8 bg-white px-1.5 pb-1.5 pt-2">
        <p className="mb-1 text-[9px] font-semibold text-xinergy-charcoal">
          Cash flow potencial por estrategia
        </p>

        <div className="min-h-0 flex-1">
          <svg
            viewBox={`0 0 ${chartW} ${plotH + 6}`}
            className="h-full w-full min-h-[5.5rem]"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Cascada de cash flow por estrategia"
          >
            {[0.25, 0.5, 0.75].map((pct) => (
              <line
                key={pct}
                x1={0}
                x2={chartW}
                y1={plotH * pct}
                y2={plotH * pct}
                stroke="rgba(63,55,75,0.08)"
                strokeDasharray="2 2"
              />
            ))}

            {rendered.map((bar, i) => {
              const x = i * colW + (colW - barW) / 2;
              const animatedH = visible ? bar.h : 0;
              const animatedY = visible ? bar.y : plotH;

              return (
                <g key={bar.label}>
                  <text
                    x={x + barW / 2}
                    y={animatedY - 3}
                    textAnchor="middle"
                    fill="#3f374b"
                    fontSize="6"
                    fontWeight="600"
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: `opacity 0.4s ease ${i * 70 + 120}ms`,
                    }}
                  >
                    {bar.display}
                  </text>
                  <rect
                    x={x}
                    y={animatedY}
                    width={barW}
                    height={animatedH}
                    rx={1.5}
                    fill={barFill[bar.variant]}
                    style={{
                      transition: `y 0.7s ease ${i * 80}ms, height 0.7s ease ${i * 80}ms`,
                    }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-1 grid grid-cols-7 gap-0.5">
          {bars.map((bar) => (
            <p
              key={bar.label}
              className="text-center text-[7px] leading-tight text-xinergy-slate sm:text-[8px]"
              title={bar.label}
            >
              {bar.shortLabel}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-2 flex shrink-0 items-center justify-between text-[8px] text-xinergy-slate/80">
        <span>Fuente: Plataforma Calculum</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-xinergy-charcoal" />
          Total CF oportunidad
        </span>
      </div>
    </div>
  );
}

function SupplierScene({ visible }: { visible: boolean }) {
  const rows = [
    { k: "Spend anual", v: "USD 18.4M" },
    { k: "DPO actual", v: "38 días" },
    { k: "Benchmark sector", v: "55 días" },
    { k: "Rate score", v: "A+" },
    { k: "CF oportunidad", v: "USD 2.1M" },
    { k: "Estrategia", v: "Extensión + SCF" },
  ];

  return (
    <div
      className={`wcs-showcase__scene absolute inset-0 p-4 transition-all duration-700 sm:p-5 ${
        visible ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-4"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-xinergy-orange">
        Ficha proveedor
      </p>
      <p className="mt-0.5 text-[9px] text-xinergy-slate">Cuadrante Q2 · Segmento estratégico</p>
      <div className="mt-2.5 rounded border border-xinergy-charcoal/10 bg-white p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-xinergy-charcoal">Empresa 123</p>
            <p className="text-[9px] text-xinergy-slate">Materias primas · Chile · ID #2847</p>
          </div>
          <span className="rounded bg-xinergy-orange px-2 py-0.5 text-[8px] font-bold text-xinergy-charcoal">
            P1
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.k}
              className="flex justify-between border-b border-xinergy-charcoal/5 pb-1 text-[9px]"
            >
              <span className="text-xinergy-slate">{row.k}</span>
              <span className="font-medium text-xinergy-charcoal">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <span className="rounded bg-xinergy-cream px-2 py-1 text-[8px] text-xinergy-charcoal">
          Confirming elegible
        </span>
        <span className="rounded bg-xinergy-cream px-2 py-1 text-[8px] text-xinergy-charcoal">
          Early pay 2.1%
        </span>
      </div>
    </div>
  );
}

const SCENE_RENDERERS = [
  DashboardScene,
  SegmentationScene,
  WaterfallScene,
  SupplierScene,
] as const;

export function WorkingCapitalShowcase({
  eyebrow,
  title,
  intro,
  tourHintAuto,
  tourHintLocked,
  steps,
}: WorkingCapitalShowcaseProps) {
  const [lockedStep, setLockedStep] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const { active, stepProgress } = useShowcaseCycle(steps.length, inView, lockedStep);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selectStep = useCallback((index: number) => {
    setLockedStep(index);
  }, []);

  const sceneCount = Math.min(steps.length, SCENE_RENDERERS.length);
  const isLocked = lockedStep !== null;
  const progressWidth =
    ((active + (isLocked ? 1 : stepProgress)) / sceneCount) * 100;

  return (
    <section
      ref={rootRef}
      className="wcs-showcase border-y border-xinergy-charcoal/8 bg-xinergy-cream/30 py-16 sm:py-20"
      aria-label={title}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-xinergy-orange">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-xinergy-charcoal sm:text-3xl">{title}</h2>
            <p className="type-body-sm mt-3 text-xinergy-slate">{intro}</p>

            <ol className="mt-8 space-y-3">
              {steps.slice(0, sceneCount).map((step, i) => (
                <li key={step.id}>
                  <button
                    type="button"
                    className={`wcs-showcase__step flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                      active === i
                        ? "border-xinergy-orange/40 bg-white shadow-sm"
                        : "border-transparent bg-transparent hover:bg-white/60"
                    }`}
                    onClick={() => selectStep(i)}
                    aria-current={active === i ? "step" : undefined}
                    aria-pressed={lockedStep === i}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        active === i
                          ? "bg-xinergy-orange text-xinergy-charcoal"
                          : "bg-xinergy-charcoal/10 text-xinergy-charcoal"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-xinergy-charcoal">
                        {step.title}
                      </span>
                      <span className="type-body-sm mt-0.5 block text-xinergy-slate">
                        {step.subtitle}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-6 h-1 overflow-hidden rounded-full bg-xinergy-charcoal/10">
              <div
                className={`h-full rounded-full bg-xinergy-orange ${
                  isLocked ? "" : "transition-[width] duration-150 linear"
                }`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            <p className="type-body-sm mt-2 text-xinergy-slate/80">
              {isLocked ? tourHintLocked : tourHintAuto}
            </p>
          </div>

          <div className="wcs-showcase__viewport relative">
            <BrowserChrome>
              {SCENE_RENDERERS.slice(0, sceneCount).map((Scene, i) => (
                <Scene key={steps[i]?.id ?? i} visible={active === i} />
              ))}
            </BrowserChrome>
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl bg-xinergy-orange/8 blur-2xl"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
