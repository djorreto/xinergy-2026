import type { ExecutiveThemeId } from "@/lib/surveys/executive";
import { CAPABILITIES, COUNTRIES, INDUSTRIES, INITIATIVE_COPY, ROLES } from "@/lib/surveys/radar-b/instrument";
import { percent, type Benchmark, type PersonReport } from "@/lib/surveys/radar-b/report";

export const OPTION_B_ASKS: { id: ExecutiveThemeId; ask: string }[] = [
  {
    id: "atencion",
    ask: "Lee las prioridades AHP del benchmark. Cuenta qué objetivos concentran la atención y cuáles quedan detrás. Usa solo los pesos entregados. Si hay menos de 5 empresas, habla de quien respondió.",
  },
  {
    id: "resultado",
    ask: "Cruza esa prioridad con la capacidad y la brecha hacia nivel 4. Una mediana de capacidad es un nivel de 1 a 5, no un porcentaje. Si aparece un portafolio, dilo como escenario de demostración: no es ahorro, no es ROI y la matriz no está calibrada.",
  },
  {
    id: "relato",
    ask: "Escribe el relato que Xinergy podría entregar a quien respondió. Tres ideas en prosa, para un CEO. Cierra con la conversación que esto abre. No vendas un servicio y no prometas una cifra que no esté en los datos. Recuerda que la recomendación de iniciativas es de demostración.",
  },
];

export function buildOptionBFacts(people: PersonReport[], benchmark: Benchmark) {
  const included = people.filter((person) => person.included);
  const radarCountries = COUNTRIES.filter((item) => item.v !== "otro" && item.v !== "regional");
  const present = [...new Set(included.map((person) => person.pais))];
  return {
    respuestasIncluidas: included.length,
    empresasEnElBenchmark: benchmark.companies,
    empresasConPrioridadConsistente: benchmark.priorityIds.length,
    empresasConPortafolioDeDemostracion: benchmark.motorIds.length,
    paisesPresentes: present.map((code) => label(COUNTRIES, code)),
    paisesDelRadarSinRespuesta: radarCountries.filter((item) => !present.includes(item.v)).map((item) => item.es),
    roles: tally(included.map((person) => label(ROLES, person.rol))),
    industrias: tally(included.map((person) => label(INDUSTRIES, person.rubro))),
    prioridades: benchmark.ahpMean
      ? CAPABILITIES.map((item, index) => ({ nombre: item.short.es, peso: percent(benchmark.ahpMean?.[index]) }))
      : [],
    grupos: benchmark.macroMean
      ? ["Eficiencia y valor financiero", "Riesgo, sostenibilidad y control", "Transformación y capacidades"].map((nombre, index) => ({
          nombre,
          peso: percent(benchmark.macroMean?.[index]),
        }))
      : [],
    capacidades: CAPABILITIES.map((item, index) => ({
      nombre: item.short.es,
      medianaNivel1a5: benchmark.capability[index]?.median,
      empresas: benchmark.capability[index]?.n ?? 0,
      nota: "La mediana es un nivel de práctica, no un porcentaje.",
    })),
    brechaEstrategica: benchmark.gapMean
      ? CAPABILITIES.map((item, index) => ({ nombre: item.short.es, pesoPorBrecha: percent(benchmark.gapMean?.[index]) }))
      : [],
    brechaTotalMedia: percent(benchmark.g0Mean),
    metaDePlanificacion: "nivel 4",
    portafolioBalanced: INITIATIVE_COPY.map((item, index) => ({
      iniciativa: item.name.es,
      seleccionModelada: percent(benchmark.action.balanced[index]?.selected),
      aprobacionNueva: percent(benchmark.action.balanced[index]?.approved),
    })),
    paresCfoCpo: benchmark.pairs.length,
    diferenciaMediaDelGrupoFinancieroCfoMenosCompras: benchmark.pairs.length
      ? percent(benchmark.pairs.reduce((sum, pair) => sum + pair.fin, 0) / benchmark.pairs.length)
      : null,
    textosAbiertos: benchmark.open.length,
    umbralParaPublicarUnCorte: 5,
    aviso: "La matriz de impacto es de demostración. El cierre modelado no es ahorro en USD ni un resultado medido.",
  };
}

function label(list: { v: string; es: string }[], value: string) {
  return list.find((item) => item.v === value)?.es ?? value;
}

function tally(labels: string[]) {
  const counts = new Map<string, number>();
  for (const label of labels) counts.set(label, (counts.get(label) ?? 0) + 1);
  return [...counts.entries()].map(([nombre, n]) => ({ nombre, n }));
}
