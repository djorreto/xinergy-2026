import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { CAPABILITIES, INITIATIVE_COPY, REALIZATION, SAVINGS, STATUSES } from "@/lib/surveys/radar-c/instrument";
import { buildBenchmarkC, type PersonC } from "@/lib/surveys/radar-c/report";
import { formatPercent } from "@/lib/surveys/ahp";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const BOTTOM = 46;
const CHARCOAL = rgb(63 / 255, 55 / 255, 75 / 255);
const SLATE = rgb(84 / 255, 82 / 255, 109 / 255);
const ORANGE = rgb(252 / 255, 161 / 255, 0);

export async function studyPdfC(people: PersonC[], stamp: string) {
  const included = people.filter((person) => person.included);
  const operational = included.filter((person) => person.operational && (person.rol === "cpo" || person.rol === "scm"));
  const benchmark = buildBenchmarkC(included);
  const priority = operational.filter((person) => benchmark.priorityIds.includes(person.id));
  const doc = await documentOf("Radar Compras 2027 · C (versión oficial) - Síntesis");
  const writer = pen(doc);
  const companies = benchmark.companies === 1 ? "1 empresa" : `${benchmark.companies} empresas`;
  await writer.cover("C (versión oficial) · Síntesis", stamp, `${included.length} respuestas · ${companies} en el benchmark operacional`);
  writer.heading("Qué busca este corte");
  writer.write("El estudio conecta la prioridad declarada para 2027, la capacidad actual, los resultados que cada empresa dice poder medir y la agenda que ya tiene decidida. El escenario es una alternativa bajo recursos de demostración. No es un ahorro ni un pronóstico.");
  writer.heading("Cómo se lee");
  writer.write("Cada empresa entra una vez, con la respuesta de Compras. Si hay dos del mismo rol en el mismo alcance, esa empresa queda fuera hasta consolidarla. El perfil es el promedio de los pesos de quienes compararon con consistencia de hasta 0,10. Finanzas y dirección general quedan en un panel aparte. Un rango elegido por varias personas no es el promedio del ahorro.");
  if (benchmark.aip) {
    writer.heading("La agenda de 2027");
    writer.bars(CAPABILITIES.map((item, index) => ({ label: item.short.es, ratio: benchmark.aip?.[index] ?? 0, trailing: formatPercent(benchmark.aip?.[index] ?? 0) })));
    writer.write(`El perfil usa ${priority.length} empresas. ${benchmark.duplicates.length ? `${benchmark.duplicates.length} empresas tienen dos respuestas del mismo rol y no entran hasta consolidarlas.` : "Ninguna empresa quedó fuera por duplicar el mismo rol."}`);
  } else writer.write("Todavía no hay un perfil principal. Hace falta al menos una respuesta de Compras con comparaciones consistentes.");
  const measured = operational.filter((person) => person.context.e2 && person.context.e2 !== "nm" && person.context.e2 !== "ns" && person.context.e2 !== "none");
  const band = measured.filter((person) => person.context.e2 === "50-75").length;
  writer.heading("Captura de valor");
  writer.write(measured.length
    ? `Entre quienes informan un rango de realización, ${band} de ${measured.length} eligen 50 a 75%. Esa cifra es la proporción de personas en el rango, no el ahorro realizado. “No medimos”, “no sé” y “no hubo ahorro que debiera materializarse” quedan fuera de esa base.`
    : "Este corte todavía no tiene rangos de realización para cruzar con la prioridad de costos.");
  const exposed = operational.filter((person) => person.context.e3 === "25-50" || person.context.e3 === ">50");
  const lowRisk = exposed.filter((person) => (person.levels[2] ?? 5) < 4);
  writer.heading("Continuidad");
  writer.write(operational.length
    ? `${exposed.length} respuestas operacionales ubican en 25% o más el gasto sin alternativa viable. ${lowRisk.length} de esas tienen riesgo y continuidad bajo el nivel 4. La agenda de riesgo se lee en el estado de esa iniciativa, no como un incidente que la encuesta no pregunta.`
    : "La ruta operacional todavía no tiene respuestas de continuidad.");
  const productive = operational.filter((person) => person.context.e5 === "produccion" || person.context.e5 === "extendido");
  const productiveBarrier = productive.filter((person) => person.barriers.includes("roi") || person.barriers.includes("sistemas") || person.barriers.includes("datos"));
  writer.heading("Datos e IA");
  writer.write(`${productive.length} declaran IA en producción o extendida. ${productiveBarrier.length} de ellas marcan integración, datos o un ROI poco claro. Esa barrera es una percepción, no un retorno medido. El nivel digital no sustituye la etapa ni la condición de datos.`);
  writer.heading("Qué queda abierto");
  writer.write("Los pares de Compras con Finanzas o dirección se leen solo cuando la empresa y el alcance coinciden. Un corte chico no es un ranking regional. Esta hoja es una síntesis. El paper aplicado desarrolla el método, los cruces y los portafolios.");
  writer.finish("C (versión oficial)");
  return new Uint8Array(await doc.save());
}

export async function personPdfC(person: PersonC, stamp: string) {
  const doc = await documentOf("Radar Compras 2027 · C (versión oficial) - Devolución");
  const writer = pen(doc);
  await writer.cover("Devolución de su alcance", stamp, `${scopeLabel(person.alcance)}${person.unidad ? ` · ${person.unidad}` : ""}`);
  writer.write("Este documento describe lo que usted declaró y, cuando el cálculo aplica, un escenario de demostración. No lo compara con un percentil de mercado si la base agregada no alcanza.");
  if (person.weights) {
    writer.heading("Prioridades");
    writer.bars(CAPABILITIES.map((item, index) => ({ label: item.short.es, ratio: person.weights?.[index] ?? 0, trailing: formatPercent(person.weights?.[index] ?? 0) })));
    writer.write(person.priorityMode === "hibrido"
      ? "Algunos bloques se aclararon repartiendo 100 puntos. Esos pesos reemplazan las comparaciones de ese bloque. La consistencia original se conserva como diagnóstico."
      : person.ahpClass === "excluido"
        ? "La consistencia supera 0,20 y no hay una aclaración completa. No hay un portafolio recomendado."
        : person.ahpClass === "exploratorio"
          ? "El perfil es exploratorio. El escenario, si aparece, no entra al promedio principal del corte."
          : "Las comparaciones entran en el rango principal de consistencia.");
  }
  if (person.operational) {
    writer.heading("Capacidad");
    writer.write(CAPABILITIES.map((item, index) => `${item.short.es}: ${person.levels[index] ?? "no sé"}`).join(". ") + ".");
    writer.heading("Contexto");
    writer.write(`Ahorro validado: ${label(SAVINGS, person.context.e1)}. Realización: ${label(REALIZATION, person.context.e2)}. Exposición sin alternativa: ${labelOfContext(person.context.e3)}. Etapa de IA: ${person.context.e5 || "sin dato"}. Condición de datos: ${person.context.r1 || "sin dato"}.`);
    writer.heading("Agenda y escenario");
    writer.write(INITIATIVE_COPY.map((item) => `${item.name.es}: ${label(STATUSES, person.agenda[item.id] ?? "")}`).join(". ") + ".");
    const balanced = person.scenarios.find((item) => item.id === "balanced");
    writer.write(balanced?.closure == null ? person.motorReason : `En el escenario intermedio, la alternativa modelada cierra ${formatPercent(balanced.closure)} de la brecha hacia el nivel 4. Similitud con lo aprobado: ${person.similarity == null ? "no aplica" : formatPercent(person.similarity)}. ${person.eta == null ? person.etaReason : `Contribución de la agenda aprobada, bajo sus propios recursos: ${formatPercent(person.eta)}.`}`);
  } else {
    writer.heading("Su rol");
    writer.write(person.rol === "cfo" ? `Expectativa de ahorro validado: ${person.context.f1 || "sin dato"}. Validación contra línea base: ${person.context.f2 || "sin dato"}.` : `Presupuesto de eficiencia: ${person.context.g1 || "sin dato"}. Momento en que participa Compras: ${person.context.g2 || "sin dato"}.`);
  }
  writer.write("Pregunta para su comité: dónde la prioridad declarada no tiene todavía una medición o una decisión del mismo alcance.");
  writer.finish("Devolución");
  return new Uint8Array(await doc.save());
}

function scopeLabel(value: string) {
  if (value === "unidad") return "Unidad de negocio";
  if (value === "multipais") return "Corporativo multipaís";
  if (value === "pais") return "Un país";
  return "Alcance";
}

function label(options: { v: string; es: string }[], value: string) {
  return options.find((item) => item.v === value)?.es ?? (value || "sin dato");
}

function labelOfContext(value: string) {
  return value || "sin dato";
}

async function documentOf(title: string) {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setAuthor("Xinergy");
  return doc;
}

function pen(doc: PDFDocument) {
  let font: PDFFont;
  let bold: PDFFont;
  let page: PDFPage;
  let y = 0;
  const pages: PDFPage[] = [];
  const width = PAGE_WIDTH - MARGIN * 2;
  async function start() {
    font = await doc.embedFont(StandardFonts.Helvetica);
    bold = await doc.embedFont(StandardFonts.HelveticaBold);
    add();
  }
  function add() {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  }
  function ensure(height: number) {
    if (y - height < BOTTOM) add();
  }
  function write(text: string, size = 11, face = font, color = CHARCOAL, gap = 8) {
    const lines = wrap(clean(text), face, size, width);
    for (const line of lines) {
      if (y - size - 4 < BOTTOM) add();
      page.drawText(line, { x: MARGIN, y: y - size, size, font: face, color });
      y -= size + 4;
    }
    y -= gap;
  }
  return {
    async cover(subtitle: string, stamp: string, line: string) {
      await start();
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 16, width: PAGE_WIDTH, height: 16, color: ORANGE });
      y = PAGE_HEIGHT - 56;
      write("XINERGY", 9, bold, ORANGE, 4);
      write("Radar Compras 2027 · C (versión oficial)", 18, bold, CHARCOAL, 4);
      write(subtitle, 14, font, SLATE, 8);
      write(stamp, 10, font, SLATE, 4);
      write(line, 11, font, CHARCOAL, 8);
    },
    heading(text: string) {
      ensure(36);
      y -= 8;
      page.drawRectangle({ x: MARGIN, y, width: 28, height: 2.5, color: ORANGE });
      y -= 16;
      write(text, 14, bold, CHARCOAL, 8);
    },
    write(text: string) {
      write(text, 11, font, CHARCOAL, 8);
    },
    bars(rows: { label: string; ratio: number; trailing: string }[]) {
      for (const row of rows) {
        ensure(18);
        page.drawText(fit(row.label, font, 8, 180), { x: MARGIN, y: y - 8, size: 8, font, color: CHARCOAL });
        page.drawRectangle({ x: MARGIN + 190, y: y - 10, width: 180, height: 7, color: rgb(0.93, 0.91, 0.88) });
        page.drawRectangle({ x: MARGIN + 190, y: y - 10, width: Math.max(1, 180 * Math.max(0, Math.min(1, row.ratio))), height: 7, color: ORANGE });
        page.drawText(clean(row.trailing), { x: MARGIN + 378, y: y - 8, size: 8, font: bold, color: CHARCOAL });
        y -= 16;
      }
      y -= 8;
    },
    finish(label: string) {
      pages.forEach((item, index) => item.drawText(clean(`${label}  ·  ${index + 1} de ${pages.length}`), { x: MARGIN, y: 26, size: 8, font, color: SLATE }));
    },
  };
  function wrap(value: string, face: PDFFont, size: number, box: number) {
    const lines: string[] = [];
    for (const paragraph of value.split(/\n+/)) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      let line = "";
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (face.widthOfTextAtSize(next, size) > box && line) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      if (line) lines.push(line);
    }
    return lines;
  }
}

function fit(text: string, face: PDFFont, size: number, box: number) {
  const value = clean(text);
  if (face.widthOfTextAtSize(value, size) <= box) return value;
  let shown = value;
  while (shown.length > 1 && face.widthOfTextAtSize(`${shown}...`, size) > box) shown = shown.slice(0, -1);
  return `${shown}...`;
}

function clean(value: string) {
  return value.replaceAll("\u2013", "-").replaceAll("\u2014", "-").replaceAll("\u2019", "'").replaceAll("\u00a0", " ").replace(/[^\u0000-\u00ff]/g, "");
}
