import {
  CAPABILITIES as CAPABILITIES_B,
  INDUSTRIES as INDUSTRIES_B,
  INITIATIVE_COPY as INITIATIVE_COPY_B,
  ROLES as ROLES_B,
  type Choice,
  type Copy,
} from "@/lib/surveys/radar-b/instrument";
import { IMPACT as IMPACT_B } from "@/lib/surveys/radar-b/engine";

const L = (es: string, en: string, pt: string): Copy => ({ es, en, pt });
const o = (v: string, es: string, en: string, pt: string): Choice => ({ v, es, en, pt });
const level = (n: number, es: string, en: string, pt: string) => ({ n, ...L(es, en, pt) });

export type SurveyVersionC = "radar-2027-c-v1" | "radar-2027-c-v2" | "radar-2027-c-v3";
export type AhpScaleKind = "saaty9" | "compact5";

export const SURVEY_VERSION_C = "radar-2027-c-v3" as const;
export const SURVEY_VERSION_C_LEGACY = ["radar-2027-c-v1", "radar-2027-c-v2"] as const;

export function isSurveyVersionC(value: unknown): value is SurveyVersionC {
  return value === "radar-2027-c-v1" || value === "radar-2027-c-v2" || value === "radar-2027-c-v3";
}

export function isLegacySurveyVersionC(value: unknown) {
  return value === "radar-2027-c-v1" || value === "radar-2027-c-v2";
}

export function ahpScaleForVersion(version: string | null | undefined): AhpScaleKind {
  return version === "radar-2027-c-v3" ? "compact5" : "saaty9";
}

/** Roles propios de C. No modifican la encuesta B. */
export const ROLES_C: Choice[] = [
  o("ceo", "CEO / Gerente general", "CEO / General manager", "CEO / Diretor geral"),
  o("cfo", "CFO / Finanzas", "CFO / Finance", "CFO / Finanças"),
  o("cpo", "CPO / Gerente de Compras", "CPO / Procurement manager", "CPO / Gerente de Compras"),
  o("lider_compras", "Jefe de Compras / Líder de Categoría o Excelencia", "Procurement lead / Category or Excellence lead", "Chefe de Compras / Líder de Categoria ou Excelência"),
  o("scm", "Supply chain / Operaciones", "Supply chain / Operations", "Supply chain / Operações"),
  o("otro", "Otro", "Other", "Outro"),
];

/** Industrias propias de C, con agro y forestal. */
export const INDUSTRIES_C: Choice[] = [
  ...INDUSTRIES_B.filter((item) => item.v !== "otra"),
  o("agro", "Agroindustria / alimentos", "Agribusiness / food", "Agronegócio / alimentos"),
  o("forestal", "Forestal / celulosa", "Forestry / pulp & paper", "Florestal / celulose"),
  o("otra", "Otra", "Other", "Outra"),
];

export const CAPABILITIES_C_V1 = CAPABILITIES_B;

export const CAPABILITIES_C_V3 = CAPABILITIES_B.map((item) => {
  if (item.id === "costos") {
    return {
      ...item,
      short: L("Costo total (TCO)", "Total cost (TCO)", "Custo total (TCO)"),
      levels: [
        item.levels[0],
        item.levels[1],
        item.levels[2],
        level(4, "Pipeline de iniciativas, KPIs y seguimiento; Finanzas valida ahorros y su realización; se miden también costos evitados y costo total.", "Initiative pipeline, KPIs and follow-up; Finance validates savings and their realization; avoided costs and total cost are also measured.", "Pipeline de iniciativas, KPIs e acompanhamento; Finanças valida economias e sua realização; também se medem custos evitados e custo total."),
        level(5, "Gestión de valor integrada a la planificación: costo total, costos evitados, calidad y nivel de servicio con seguimiento continuo.", "Value management built into planning: total cost, avoided costs, quality and service level with continuous tracking.", "Gestão de valor integrada ao planejamento: custo total, custos evitados, qualidade e nível de serviço com acompanhamento contínuo."),
      ],
    };
  }
  if (item.id === "esg") {
    return {
      ...item,
      short: L("Compras sostenibles", "Sustainable procurement", "Compras sustentáveis"),
      question: L("Gestionar compras sostenibles en la cadena de proveedores", "Manage sustainable procurement in the supplier base", "Gerir compras sustentáveis na cadeia de fornecedores"),
      levels: [
        level(1, "Sin criterios de sostenibilidad en las compras.", "No sustainability criteria in purchasing.", "Sem critérios de sustentabilidade nas compras."),
        level(2, "Se piden declaraciones o antecedentes a algunos proveedores; acciones aisladas.", "Declarations or evidence are requested from some suppliers; isolated actions.", "Pedem-se declarações ou antecedentes a alguns fornecedores; ações isoladas."),
        level(3, "Política de compras sostenibles; criterios en categorías relevantes y due diligence según riesgo.", "Sustainable procurement policy; criteria in relevant categories and risk-based due diligence.", "Política de compras sustentáveis; critérios em categorias relevantes e due diligence conforme o risco."),
        level(4, "Criterios ponderados en adjudicaciones; KPIs (por ejemplo, emisiones alcance 3 de proveedores clave, % del gasto evaluado) y planes de mejora con proveedores.", "Weighted criteria in awards; KPIs (for example, scope 3 emissions of key suppliers, % of spend assessed) and improvement plans with suppliers.", "Critérios ponderados nas adjudicações; KPIs (por exemplo, emissões de escopo 3 de fornecedores-chave, % do gasto avaliado) e planos de melhoria com fornecedores."),
        level(5, "Sostenibilidad integrada a las estrategias de categoría y a las metas corporativas; desarrollo conjunto con proveedores y resultados verificados.", "Sustainability built into category strategies and corporate goals; joint development with suppliers and verified results.", "Sustentabilidade integrada às estratégias de categoria e às metas corporativas; desenvolvimento conjunto com fornecedores e resultados verificados."),
      ],
    };
  }
  if (item.id === "talento") {
    return {
      ...item,
      short: L("Talento y capacidades de Compras", "Procurement talent and capabilities", "Talento e capacidades de Compras"),
      question: L("Fortalecer talento y capacidades de Compras", "Strengthen Procurement talent and capabilities", "Fortalecer talento e capacidades de Compras"),
      levels: [
        level(1, "Equipo principalmente transaccional: cotizar, emitir órdenes de compra y hacer seguimiento.", "Mostly transactional team: quoting, issuing purchase orders and follow-up.", "Equipe principalmente transacional: cotar, emitir pedidos de compra e fazer acompanhamento."),
        level(2, "Algunas personas con habilidades de negociación y análisis; dependencia de personas clave.", "Some people with negotiation and analysis skills; dependence on key individuals.", "Algumas pessoas com habilidades de negociação e análise; dependência de pessoas-chave."),
        level(3, "Roles por categoría con capacidades definidas: análisis de mercado y costos, negociación, gestión de contratos y proveedores.", "Category roles with defined capabilities: market and cost analysis, negotiation, contract and supplier management.", "Papéis por categoria com capacidades definidas: análise de mercado e custos, negociação, gestão de contratos e fornecedores."),
        level(4, "Capacidades avanzadas en buena parte del equipo (TCO/should-cost, analítica, gestión de stakeholders), evaluadas por competencia.", "Advanced capabilities across much of the team (TCO/should-cost, analytics, stakeholder management), assessed by competency.", "Capacidades avançadas em boa parte da equipe (TCO/should-cost, analítica, gestão de stakeholders), avaliadas por competência."),
        level(5, "Socio del negocio: capacidades en datos, IA, innovación y gestión del cambio; se planifican las capacidades futuras.", "Business partner: capabilities in data, AI, innovation and change management; future capabilities are planned.", "Parceiro do negócio: capacidades em dados, IA, inovação e gestão da mudança; as capacidades futuras são planejadas."),
      ],
    };
  }
  return item;
});

export function capabilitiesForVersion(version: string | null | undefined) {
  return version === "radar-2027-c-v3" ? CAPABILITIES_C_V3 : CAPABILITIES_C_V1;
}

/** Iniciativas v1/v2: textos históricos. */
export const INITIATIVE_COPY_C_V1 = INITIATIVE_COPY_B;

/** Iniciativas v3: mismos 11 ids, textos actualizados. */
export const INITIATIVE_COPY_C_V3 = INITIATIVE_COPY_B.map((item) => {
  if (item.id === "i1") {
    return {
      ...item,
      name: L("Strategic sourcing", "Strategic sourcing", "Strategic sourcing"),
      scope: L("Olas de sourcing: licitación, negociación y adjudicación con seguimiento de valor.", "Sourcing waves: bidding, negotiation and award with value tracking.", "Ondas de sourcing: licitação, negociação e adjudicação com acompanhamento de valor."),
    };
  }
  if (item.id === "i2") {
    return {
      ...item,
      name: L("Working capital, inventario y SCF", "Working capital, inventory and SCF", "Working capital, estoque e SCF"),
      scope: L("Términos de pago, inventario y financiación con Finanzas y Operaciones.", "Payment terms, inventory and financing with Finance and Operations.", "Prazos de pagamento, estoque e financiamento com Finanças e Operações."),
    };
  }
  if (item.id === "i10") {
    return {
      ...item,
      name: L("Compras sostenibles", "Sustainable procurement", "Compras sustentáveis"),
      scope: L("Criterios de sostenibilidad por categoría, due diligence según riesgo y emisiones con proveedores.", "Category sustainability criteria, risk-based due diligence and supplier emissions.", "Critérios de sustentabilidade por categoria, due diligence conforme o risco e emissões com fornecedores."),
    };
  }
  if (item.id === "i11") {
    return {
      ...item,
      name: L("Category management", "Category management", "Category management"),
      scope: L("Estrategias por categoría, gestión de demanda y proveedores, plan plurianual.", "Category strategies, demand and supplier management, multi-year plan.", "Estratégias por categoria, gestão de demanda e fornecedores, plano plurianual."),
    };
  }
  return item;
});

export function initiativesForVersion(version: string | null | undefined) {
  return version === "radar-2027-c-v3" ? INITIATIVE_COPY_C_V3 : INITIATIVE_COPY_C_V1;
}

/**
 * Matriz de impacto de C.
 * PENDIENTE DE VALIDACIÓN POR CONSULTORÍA: i11 (Category management) parte de los valores de i1
 * (impacto, costo y esfuerzo). Puede ir a producción porque la devolución es solo administrativa.
 */
export const IMPACT_C: number[][] = IMPACT_B.map((row, index) => (index === 10 ? [...IMPACT_B[0]] : [...row]));
export const COST_C = [2, 3, 2, 5, 3, 3, 3, 3, 2, 2, 2] as const; // i11 provisional = costo de i1
export const EFFORT_C = [3, 3, 3, 5, 4, 4, 2, 4, 3, 3, 3] as const; // i11 provisional = esfuerzo de i1

export const AI_USES: Choice[] = [
  o("gasto", "Análisis y clasificación de gasto", "Spend analysis and classification", "Análise e classificação de gasto"),
  o("proveedores", "Búsqueda y evaluación de proveedores", "Supplier search and evaluation", "Busca e avaliação de fornecedores"),
  o("rfx", "Preparación de RFx y comparación de ofertas", "RFx preparation and bid comparison", "Preparação de RFx e comparação de ofertas"),
  o("negociacion", "Apoyo a negociaciones", "Negotiation support", "Apoio a negociações"),
  o("contratos", "Redacción o revisión de contratos", "Contract drafting or review", "Redação ou revisão de contratos"),
  o("riesgo", "Monitoreo de riesgo de proveedores", "Supplier risk monitoring", "Monitoramento de risco de fornecedores"),
  o("p2p", "P2P: órdenes, facturas, conciliación", "P2P: orders, invoices, reconciliation", "P2P: pedidos, faturas, conciliação"),
  o("usuarios", "Atención a usuarios internos", "Internal user support", "Atendimento a usuários internos"),
  o("otra", "Otra", "Other", "Outra"),
];

export const AI_USES_EXCLUSIVE: Choice[] = [
  o("ninguna", "Todavía en ninguna", "None yet", "Ainda em nenhuma"),
];

export const EFFORT_HOURS_V3: Choice[] = [
  o("<1h", "Está disponible al instante (dashboard o cubo de gasto actualizado)", "Available instantly (dashboard or up-to-date spend cube)", "Está disponível na hora (dashboard ou cubo de gasto atualizado)"),
  o("1-8h", "Lo armamos en horas desde el ERP", "We assemble it in hours from the ERP", "Montamos em horas a partir do ERP"),
  o("8-40h", "Toma días: consolidar, limpiar y clasificar a mano", "It takes days: consolidate, clean and classify manually", "Leva dias: consolidar, limpar e classificar à mão"),
  o("40h+", "Toma semanas", "It takes weeks", "Leva semanas"),
  o("imposible", "No podemos obtenerlo con fiabilidad", "We cannot obtain it reliably", "Não conseguimos obter com confiabilidade"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const CRITERION_LABEL_C: Record<string, Copy> = {
  costos: L("Reducir costo total", "Reduce total cost", "Reduzir custo total"),
};

export function roleIsProcurementLead(rol: string) {
  return rol === "cpo" || rol === "lider_compras";
}

export function roleIsOperationalBenchmark(rol: string) {
  return rol === "cpo" || rol === "lider_compras" || rol === "scm";
}

/** Preferencia de selección para el benchmark: cpo > lider_compras > scm. */
export function pickBenchmarkPerson<T extends { rol: string }>(group: T[]) {
  const cpos = group.filter((person) => person.rol === "cpo");
  if (cpos.length === 1) return { person: cpos[0], duplicate: false as const };
  if (cpos.length > 1) return { person: null, duplicate: true as const, sample: cpos[0] };
  const leads = group.filter((person) => person.rol === "lider_compras");
  if (leads.length === 1) return { person: leads[0], duplicate: false as const };
  if (leads.length > 1) return { person: null, duplicate: true as const, sample: leads[0] };
  const scms = group.filter((person) => person.rol === "scm");
  if (scms.length === 1) return { person: scms[0], duplicate: false as const };
  if (scms.length > 1) return { person: null, duplicate: true as const, sample: scms[0] };
  return { person: null, duplicate: false as const };
}

/**
 * Clasificación de exposición para el paper.
 * v1/v2: usa e3.
 * v3: usa el mayor tramo entre e3a y e3b con el mismo umbral histórico (<10, 10-25, 25-50, >50).
 */
const EXPOSURE_RANK: Record<string, number> = { "<10": 1, "10-25": 2, "25-50": 3, ">50": 4 };

export function exposureCodeOf(context: Record<string, string>, version?: string | null) {
  if (version === "radar-2027-c-v3") {
    const left = context.e3a ?? "";
    const right = context.e3b ?? "";
    const leftRank = EXPOSURE_RANK[left] ?? 0;
    const rightRank = EXPOSURE_RANK[right] ?? 0;
    if (!leftRank && !rightRank) return left || right || "";
    return leftRank >= rightRank ? left : right;
  }
  return context.e3 ?? "";
}

export function effortHoursForVersion(version: string | null | undefined) {
  return version === "radar-2027-c-v3" ? EFFORT_HOURS_V3 : null;
}

// Keep unused-import silence helpers for B roles when needed by callers.
export const _ROLES_B = ROLES_B;
