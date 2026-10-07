import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { AHP } from "@/lib/surveys/radar-2027";
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
  const who = [person.nombre, person.apellido].filter(Boolean).join(" ");
  await writer.cover("Reporte de su alcance", stamp, [person.empresa, who, person.cargo, scopeLabel(person.alcance), person.unidad].filter(Boolean).join(" · "));
  writer.note("Este reporte describe lo declarado para este alcance. El escenario usa una matriz de demostración: no es un ahorro ni un pronóstico, y no compara el alcance con un percentil de mercado.");
  if (person.finalMacro && person.finalMacro.length === 3) {
    writer.heading("Los tres grupos");
    writer.bars(AHP.macros.map((item, index) => ({ label: item.label.es, ratio: person.finalMacro?.[index] ?? 0, trailing: formatPercent(person.finalMacro?.[index] ?? 0) })));
  }
  if (person.weights) {
    writer.heading("Prioridades para 2027");
    writer.bars([...person.weights].map((weight, index) => ({ weight, index })).sort((left, right) => right.weight - left.weight).map((item) => ({
      label: CAPABILITIES[item.index]?.short.es ?? "",
      ratio: item.weight,
      trailing: formatPercent(item.weight),
    })));
    writer.write(priorityReading(person));
  }
  if (person.operational) {
    writer.heading("Capacidad actual");
    writer.write("Cada barra marca el nivel declarado, de 1 a 5. “No sé” no se dibuja como el nivel más bajo.");
    writer.levels(CAPABILITIES.map((item, index) => ({ label: item.short.es, level: person.levels[index] ?? null })));
    if (person.strategic && person.g0 != null && person.g0 > 0) {
      const peak = Math.max(...person.strategic);
      writer.heading("Dónde pesa la brecha");
      writer.write("Cada barra es el peso de la prioridad por la distancia hasta el nivel 4. La más larga es la que más combina atención declarada y práctica todavía por construir.");
      writer.bars(person.strategic.map((value, index) => ({ label: CAPABILITIES[index]?.short.es ?? "", ratio: peak > 0 ? value / peak : 0, trailing: formatPercent(person.g0 ? value / person.g0 : 0) })));
    }
    writer.heading("Lo que ya está decidido");
    writer.facts([
      ["Ahorro que se puede informar", label(SAVINGS, person.context.e1)],
      ["Realización de ese ahorro", label(REALIZATION, person.context.e2)],
      ["Gasto sin alternativa", person.context.e3 || "sin dato"],
      ["Etapa de IA", person.context.e5 || "sin dato"],
      ["Condición de datos", person.context.r1 || "sin dato"],
    ]);
    writer.pairs(INITIATIVE_COPY.map((item) => ({ label: item.name.es, value: label(STATUSES, person.agenda[item.id] ?? "") })));
    const named = [
      ["lean", "Ajustado"],
      ["balanced", "Intermedio"],
      ["transformational", "Amplio"],
    ] as const;
    const closures = named.map(([id, label]) => {
      const scenario = person.scenarios.find((item) => item.id === id);
      return { label, ratio: scenario?.closure ?? null, trailing: scenario?.closure == null ? "—" : formatPercent(scenario.closure) };
    });
    writer.heading("Escenario de demostración");
    if (closures.some((item) => item.ratio != null)) {
      writer.write("Cierre modelado de la brecha hacia el nivel 4, bajo tres topes de recurso. No es un ahorro prometido.");
      writer.columns(closures);
      const balanced = person.scenarios.find((item) => item.id === "balanced");
      if (balanced?.ids.length) {
        writer.write(`En el escenario intermedio entran: ${balanced.ids.map((id) => INITIATIVE_COPY.find((item) => item.id === id)?.name.es ?? id).join(", ")}.`);
      }
      writer.write(`Similitud con lo aprobado: ${person.similarity == null ? "no aplica" : formatPercent(person.similarity)}. ${person.eta == null ? person.etaReason : `La agenda aprobada, con sus propios recursos, cubre ${formatPercent(person.eta)} de la mejor combinación de ese mismo recurso.`}`);
    } else writer.write(person.motorReason);
  } else {
    writer.heading("Su rol");
    writer.facts(person.rol === "cfo"
      ? [["Expectativa de ahorro validado", person.context.f1 || "sin dato"], ["Validación contra línea base", person.context.f2 || "sin dato"]]
      : [["Presupuesto de eficiencia", person.context.g1 || "sin dato"], ["Momento en que participa Compras", person.context.g2 || "sin dato"]]);
  }
  writer.heading("Para el comité");
  writer.write("Dónde la prioridad declarada todavía no tiene una medición o una decisión del mismo alcance.");
  writer.finish("Reporte");
  return new Uint8Array(await doc.save());
}

function priorityReading(person: PersonC) {
  if (person.priorityMode === "hibrido") return "Algunos bloques se aclararon repartiendo 100 puntos. Esos pesos reemplazan las comparaciones de ese bloque. La consistencia original queda como diagnóstico.";
  if (person.ahpClass === "excluido") return "La consistencia supera 0,20 y no hay una aclaración completa. No hay un portafolio recomendado.";
  if (person.ahpClass === "exploratorio") return "El perfil es exploratorio. El escenario, si aparece, no entra al promedio principal del corte.";
  return "Las comparaciones entran en el rango principal de consistencia.";
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
    note(text: string) {
      const lines = wrap(clean(text), font, 10, width - 20);
      const height = lines.length * 14 + 16;
      ensure(height + 8);
      page.drawRectangle({ x: MARGIN, y: y - height, width, height, color: rgb(0.97, 0.95, 0.92) });
      page.drawRectangle({ x: MARGIN, y: y - height, width: 3, height, color: ORANGE });
      lines.forEach((line, index) => page.drawText(line, { x: MARGIN + 12, y: y - 18 - index * 14, size: 10, font, color: CHARCOAL }));
      y -= height + 12;
    },
    bars(rows: { label: string; ratio: number; trailing: string }[]) {
      for (const row of rows) {
        ensure(22);
        page.drawText(fit(row.label, font, 9, 168), { x: MARGIN, y: y - 9, size: 9, font, color: CHARCOAL });
        page.drawRectangle({ x: MARGIN + 176, y: y - 11, width: 250, height: 9, color: rgb(0.93, 0.91, 0.88) });
        page.drawRectangle({ x: MARGIN + 176, y: y - 11, width: Math.max(row.ratio > 0 ? 2 : 0, 250 * Math.max(0, Math.min(1, row.ratio))), height: 9, color: ORANGE });
        page.drawText(clean(row.trailing), { x: MARGIN + 434, y: y - 9, size: 9, font: bold, color: CHARCOAL });
        y -= 18;
      }
      y -= 6;
    },
    levels(rows: { label: string; level: number | null }[]) {
      for (const row of rows) {
        ensure(20);
        page.drawText(fit(row.label, font, 9, 168), { x: MARGIN, y: y - 9, size: 9, font, color: CHARCOAL });
        for (let step = 1; step <= 5; step += 1) {
          const on = row.level != null && step <= row.level;
          page.drawRectangle({ x: MARGIN + 176 + (step - 1) * 28, y: y - 12, width: 22, height: 12, color: on ? ORANGE : rgb(0.93, 0.91, 0.88) });
        }
        page.drawText(row.level == null ? "no sé" : String(row.level), { x: MARGIN + 324, y: y - 9, size: 9, font: bold, color: CHARCOAL });
        y -= 18;
      }
      y -= 6;
    },
    columns(rows: { label: string; ratio: number | null; trailing: string }[]) {
      ensure(128);
      const slot = width / Math.max(rows.length, 1);
      const base = y - 92;
      rows.forEach((row, index) => {
        const x = MARGIN + index * slot;
        const height = row.ratio == null ? 0 : Math.max(3, 70 * Math.max(0, Math.min(1, row.ratio)));
        page.drawRectangle({ x: x + 28, y: base, width: 42, height: 70, color: rgb(0.93, 0.91, 0.88) });
        if (height) page.drawRectangle({ x: x + 28, y: base, width: 42, height, color: ORANGE });
        page.drawText(clean(row.trailing), { x: x + 28, y: base + 76, size: 10, font: bold, color: CHARCOAL });
        page.drawText(clean(row.label), { x: x + 28, y: base - 16, size: 9, font, color: SLATE });
      });
      y = base - 28;
    },
    facts(rows: [string, string][]) {
      for (const [name, value] of rows) {
        ensure(18);
        page.drawText(fit(name, font, 9, 220), { x: MARGIN, y: y - 9, size: 9, font, color: SLATE });
        page.drawText(fit(value, bold, 9, width - 230), { x: MARGIN + 230, y: y - 9, size: 9, font: bold, color: CHARCOAL });
        y -= 16;
      }
      y -= 6;
    },
    pairs(rows: { label: string; value: string }[]) {
      for (const row of rows) {
        ensure(16);
        page.drawText(fit(row.label, font, 8, 280), { x: MARGIN, y: y - 8, size: 8, font, color: CHARCOAL });
        page.drawText(fit(row.value, font, 8, width - 290), { x: MARGIN + 290, y: y - 8, size: 8, font, color: SLATE });
        y -= 14;
      }
      y -= 6;
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
