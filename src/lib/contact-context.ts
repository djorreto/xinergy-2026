export const contactContexts = {
  casos: {
    eyebrow: "Casos de éxito",
    title: "Llena el formulario para conocer más de nuestros casos de éxito",
    description: "Te compartimos el detalle de casos similares al tuyo. Respondemos en 24 horas hábiles.",
  },
  diagnostico: {
    eyebrow: "Diagnóstico",
    title: "Agenda tu diagnóstico sin costo",
    description:
      "Cuéntanos sobre tu operación y profundizamos la oportunidad que viste en el cálculo.",
  },
  insights: {
    eyebrow: "Insights",
    title: "¿Quieres profundizar en este tema?",
    description:
      "Escríbenos y te respondemos con más contexto sobre eficiencias y abastecimiento en LATAM.",
  },
  default: {
    eyebrow: "Contacto",
    title: "Primera conversación estratégica",
    description: "Sin compromiso. Te respondemos en 24 horas hábiles.",
  },
} as const;

export type ContactFrom = "casos" | "diagnostico" | "insights";

export function getContactContext(from?: string | null) {
  if (from && from in contactContexts && from !== "default") {
    return contactContexts[from as ContactFrom];
  }
  return contactContexts.default;
}

export function contactHref(from?: ContactFrom): string {
  return from ? `/contacto?from=${from}` : "/contacto";
}
