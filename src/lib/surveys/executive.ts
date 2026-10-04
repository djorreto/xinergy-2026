export const EXECUTIVE_THEMES = [
  {
    id: "atencion",
    title: "Dónde está puesta la atención",
    ask: "Lee la priorización AHP. Cuenta, como un resultado que se va a presentar, qué están privilegiando estos líderes y qué queda detrás. Usa solo los pesos entregados. Si la consistencia pide revisión, dilo en una frase.",
  },
  {
    id: "resultado",
    title: "Lo que el resultado ya deja ver",
    ask: "Cruza esa prioridad con la operación: ahorro, fuga, caja, riesgo, tecnología, datos y, si hay respuestas, la mirada de CEO y CFO. Señala la brecha más clara entre lo que declaran y lo que las cifras muestran. Una pregunta con menos de 5 respuestas es una señal, no un hallazgo del mercado.",
  },
  {
    id: "relato",
    title: "Lo que vamos a contarles",
    ask: "Escribe el relato que Xinergy podría entregar a quienes respondieron: la historia de compras en América Latina que esta muestra permite contar hoy. Tres ideas en prosa, para un CEO, no un comentario interno. Cierra con la conversación que esto abre sobre costo, caja, riesgo o ejecución. No vendas un servicio y no prometas una cifra que no esté en los datos.",
  },
] as const;

export type ExecutiveThemeId = (typeof EXECUTIVE_THEMES)[number]["id"];

export type StoredBrief = {
  generatedAt: string;
  responseCount: number;
  latestResponseAt: string | null;
  context: string;
  themes: { id: ExecutiveThemeId; title: string; body: string }[];
};

function stamp(value: string | null | undefined) {
  if (!value) return "";
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? value : String(time);
}

export function newestResponseAt(responses: { createdAt: string }[]) {
  return responses.reduce((max, item) => (item.createdAt > max ? item.createdAt : max), "");
}

export function briefIsStale(brief: Pick<StoredBrief, "responseCount" | "latestResponseAt"> | null, responses: { createdAt: string }[]) {
  if (!responses.length) return false;
  if (!brief) return true;
  return brief.responseCount !== responses.length || stamp(brief.latestResponseAt) !== stamp(newestResponseAt(responses));
}
