import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatCount, formatPoints, type StudyAction, type StudyBar, type StudyClaim, type StudyCutA } from "@/lib/surveys/study-a-cut";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const BOTTOM = 46;
const CHARCOAL = rgb(63 / 255, 55 / 255, 75 / 255);
const SLATE = rgb(84 / 255, 82 / 255, 109 / 255);
const ORANGE = rgb(252 / 255, 161 / 255, 0);
const CREAM = rgb(0.93, 0.91, 0.88);

export async function studyPdfA(input: { cut: StudyCutA; thesis: string; summary: string; cutLabel: string; generatedLabel: string }) {
  const doc = await PDFDocument.create();
  doc.setTitle("Radar de Compras LatAm 2027 - Versión A - Informe preliminar");
  doc.setAuthor("Xinergy");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages: PDFPage[] = [];
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN;
  let figure = 0;
  const width = PAGE_WIDTH - MARGIN * 2;
  const cut = input.cut;

  function newPage() {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  }
  function ensure(height: number) {
    if (y - height < BOTTOM) newPage();
  }
  function wrap(text: string, face: PDFFont, size: number, box: number) {
    const lines: string[] = [];
    for (const paragraph of clean(text).split(/\n+/)) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      if (!words.length) continue;
      let line = "";
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (face.widthOfTextAtSize(next, size) > box && line) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      if (line) lines.push(line);
      lines.push("");
    }
    if (lines.at(-1) === "") lines.pop();
    return lines;
  }
  function write(text: string, size: number, face: PDFFont = font, color = CHARCOAL, gap = 8) {
    const lines = wrap(text, face, size, width);
    const lineHeight = size + 4;
    for (const line of lines) {
      if (!line) {
        y -= 6;
        continue;
      }
      if (y - lineHeight < BOTTOM) newPage();
      page.drawText(line, { x: MARGIN, y: y - size, size, font: face, color });
      y -= lineHeight;
    }
    y -= gap;
  }
  function kicker(text: string) {
    ensure(28);
    write(text.toUpperCase(), 8, bold, ORANGE, 2);
  }
  function heading(text: string) {
    ensure(78);
    y -= 8;
    page.drawRectangle({ x: MARGIN, y, width: 28, height: 2.5, color: ORANGE });
    y -= 16;
    write(text, 13, bold, CHARCOAL, 8);
  }
  function note(text: string) {
    write(text, 8.5, font, SLATE, 8);
  }
  function bars(title: string, caption: string, rows: StudyBar[]) {
    figure += 1;
    ensure(52 + rows.length * 16);
    write(`Figura ${figure}. ${title}`, 11, bold, CHARCOAL, 2);
    note(caption);
    for (const row of rows) {
      const labelWidth = 188;
      const barWidth = 200;
      page.drawText(fit(row.label, font, 8, labelWidth), { x: MARGIN, y: y - 8, size: 8, font, color: CHARCOAL });
      const barX = MARGIN + labelWidth;
      page.drawRectangle({ x: barX, y: y - 10, width: barWidth, height: 7, color: CREAM });
      page.drawRectangle({ x: barX, y: y - 10, width: Math.max(1.5, barWidth * Math.max(0, Math.min(1, row.ratio))), height: 7, color: ORANGE });
      page.drawText(clean(row.trailing), { x: barX + barWidth + 6, y: y - 8, size: 8, font: bold, color: CHARCOAL });
      y -= 16;
    }
    y -= 8;
  }
  function table(headers: string[], rows: string[][], widths: number[]) {
    const rowHeight = 16;
    ensure(rowHeight * (rows.length + 1) + 8);
    const tableWidth = widths.reduce((sum, item) => sum + item, 0);
    const drawHeader = () => {
      page.drawRectangle({ x: MARGIN, y: y - rowHeight + 4, width: tableWidth, height: rowHeight, color: CREAM });
      let headerX = MARGIN;
      headers.forEach((header, index) => {
        page.drawText(fit(header, bold, 7.5, widths[index] - 6), { x: headerX + 3, y: y - 8, size: 7.5, font: bold, color: CHARCOAL });
        headerX += widths[index];
      });
      y -= rowHeight;
    };
    drawHeader();
    for (const row of rows) {
      if (y - rowHeight < BOTTOM) {
        newPage();
        drawHeader();
      }
      let x = MARGIN;
      row.forEach((cell, index) => {
        page.drawText(fit(cell, font, 8, widths[index] - 6), { x: x + 3, y: y - 8, size: 8, font, color: CHARCOAL });
        x += widths[index];
      });
      y -= rowHeight;
    }
    y -= 8;
  }
  function claim(item: StudyClaim) {
    write(item.observation, 10.5);
    write(item.tension, 10.5);
    write(item.interpretation, 10.5);
    write(item.implication, 10.5);
    note(item.limit);
  }
  function action(item: StudyAction) {
    const fields = [
      { label: item.title, face: bold, size: 10.5 },
      { label: `Señal. ${item.signal}`, face: font, size: 9.5 },
      { label: `A quién aplica. ${item.profile}`, face: font, size: 9.5 },
      { label: `Paso. ${item.step}`, face: font, size: 9.5 },
      { label: `Con quién. ${item.counterpart}`, face: font, size: 9.5 },
      { label: `Para decidir. ${item.criterion}`, face: font, size: 9.5 },
    ];
    const lines = fields.flatMap((field) => wrap(field.label, field.face, field.size, width - 16).map((line) => ({ ...field, line })));
    const height = 16 + lines.length * 13;
    ensure(height);
    page.drawRectangle({ x: MARGIN, y: y - height + 8, width, height: height - 4, color: CREAM });
    y -= 8;
    for (const line of lines) {
      page.drawText(line.line, { x: MARGIN + 8, y: y - line.size, size: line.size, font: line.face, color: CHARCOAL });
      y -= 13;
    }
    y -= 12;
  }

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 16, width: PAGE_WIDTH, height: 16, color: ORANGE });
  y = PAGE_HEIGHT - 48;
  write("XINERGY", 9, bold, ORANGE, 2);
  write("Radar de Compras LatAm 2027", 22, bold, CHARCOAL, 2);
  write("Versión A · Informe preliminar", 14, font, SLATE, 6);
  write(input.thesis, 13, bold, CHARCOAL, 6);
  write(`${input.cutLabel}  ·  ${input.generatedLabel}`, 9, font, SLATE, 2);
  write(`${cut.counts.responses} respuestas incluidas · ${cut.counts.companies} empresas · ${cut.counts.complete} perfiles de prioridad · ${cut.counts.consistent} dentro del umbral individual de 0,10`, 10, font, CHARCOAL, 6);
  write("Documento preliminar. Describe a quienes respondieron. No representa a América Latina y no estima un ahorro.", 9, font, SLATE, 8);
  write("Hallazgos de este corte", 11, bold, CHARCOAL, 4);
  for (const item of cut.claims) write(item.title, 10.5, font, CHARCOAL, 2);
  y -= 4;
  heading("Resumen ejecutivo");
  write(input.summary, 10.5);

  kicker("Para qué sirve");
  heading("Una lectura de la agenda declarada para 2027");
  write("El estudio pregunta qué prioridades relativas declaran los participantes y cómo se ven, en su operación, el ahorro, la continuidad, la tecnología y el talento. Sirve para contrastar la propia agenda y preparar la conversación con Finanzas y la dirección. No predice 2027.", 10.5);
  write("Cada ejecutivo entra una vez al perfil de prioridades. Ese perfil sale de la media geométrica de las comparaciones, no del promedio de los pesos. Entran al perfil principal quienes completan las diez comparaciones con una consistencia individual de hasta 0,10. Sus otras respuestas siguen en los módulos que contestaron. Cinco respuestas es el mínimo para mostrar un corte, no una prueba de que el grupo represente al mercado. Una celda vacía no significa no.", 10.5);

  const priority = byId(cut, "prioridades");
  if (priority && cut.principal) {
    kicker("La agenda de prioridades");
    heading(priority.title);
    bars(
      "Costos y caja lideran el perfil de quienes compararon de forma consistente",
      `Importancia relativa. ${cut.principal.n} perfiles con consistencia individual de hasta 0,10. No es un presupuesto ni una respuesta por empresa.`,
      [...cut.principal.criteria].sort((left, right) => right.weight - left.weight).map((item) => ({ label: item.name, ratio: item.weight, trailing: item.text })),
    );
    claim(priority);
  }

  const value = byId(cut, "valor");
  if (value) {
    kicker("Captura de valor");
    heading(value.title);
    bars(
      "El rango 50-75% es la respuesta más frecuente, no la tasa de ahorro realizado",
      `Módulo operativo. ${cut.realization.valid} respuestas válidas de ${cut.realization.eligible} elegibles. Cada persona elige un rango.`,
      cut.realization.rows.map((row) => ({ label: row.label, ratio: cut.realization.valid ? row.n / cut.realization.valid : 0, trailing: formatCount(row.n, cut.realization.valid) })),
    );
    note(`Validación de Finanzas, en la misma base: ${cut.validation.agree} de acuerdo, ${cut.validation.neutral} neutrales y ${cut.validation.disagree} en desacuerdo o muy en desacuerdo, sobre ${cut.validation.valid}.`);
    claim(value);
  }

  const continuity = byId(cut, "continuidad");
  if (continuity) {
    kicker("Continuidad");
    heading(continuity.title);
    bars(
      "Renegociar, diversificar y monitorear son acciones distintas",
      `Últimos 12 meses. ${cut.continuity.valid} respuestas. Una persona puede marcar más de una acción: la suma no es 100%.`,
      [
        { label: "Renegociación por inflación o tipo de cambio", ratio: cut.continuity.valid ? cut.continuity.renegotiated / cut.continuity.valid : 0, trailing: formatCount(cut.continuity.renegotiated, cut.continuity.valid) },
        { label: "Proveedores alternativos", ratio: cut.continuity.valid ? cut.continuity.alternatives / cut.continuity.valid : 0, trailing: formatCount(cut.continuity.alternatives, cut.continuity.valid) },
        { label: "Monitoreo de riesgo", ratio: cut.continuity.valid ? cut.continuity.monitoring / cut.continuity.valid : 0, trailing: formatCount(cut.continuity.monitoring, cut.continuity.valid) },
      ],
    );
    claim(continuity);
  }

  const digital = byId(cut, "digital");
  if (digital) {
    kicker("Digitalización e IA");
    heading(digital.title);
    table(
      ["Etapa declarada", "Personas"],
      [
        ["Producción o escalada", formatCount(cut.aiStage.production, cut.aiStage.valid)],
        ["Pilotos", formatCount(cut.aiStage.pilot, cut.aiStage.valid)],
        ["Uso individual", formatCount(cut.aiStage.individual, cut.aiStage.valid)],
      ],
      [240, 160],
    );
    note(`Etapa actual, ${cut.aiStage.valid} respuestas. No es la pregunta de usos actuales o previstos.`);
    claim(digital);
  }

  const talent = byId(cut, "talento");
  if (talent) {
    kicker("Talento y cobertura");
    heading(talent.title);
    claim(talent);
  }

  if (cut.actions.length) {
    kicker("Decisiones para revisar");
    heading("Qué puede examinar un CPO con este corte");
    write("Cada acción vale para el perfil que la activa. No es una instrucción de adoptar una tecnología ni un plazo calculado por la encuesta.", 10.5);
    for (const item of cut.actions) action(item);
  }

  kicker("Lo que sigue abierto");
  heading("Qué puede decir esta ola y qué tiene que esperar");
  for (const item of cut.hypotheses) write(`${item.title}. ${item.status === "pendiente" || item.status === "sin cobertura" ? "Pendiente." : "Indicio de este corte."} ${item.text}`, 10.5);
  write("Preguntas para devolver a los participantes", 11, bold, CHARCOAL, 4);
  for (const item of cut.openQuestions) write(item, 10.5, font, CHARCOAL, 3);

  kicker("Anexo");
  heading("Cómo se armó el corte");
  write(`Corte ${cut.snapshotId}. ${input.cutLabel}. ${input.generatedLabel}. Cuestionario ${cut.surveyVersion}. Método ${cut.methodVersion}.`, 10);
  write("El perfil principal agrega las comparaciones de los perfiles con consistencia individual de hasta 0,10 y vuelve a calcular los pesos. El perfil de referencia usa los perfiles completos, incluidos los que superan ese umbral. No es el promedio de los pesos ni una respuesta por empresa. Las matrices de dos criterios son consistentes por construcción. El CR que se publica como individual es el mayor entre el bloque general y los bloques de tres criterios.", 10);
  if (cut.principal && cut.reference) {
    table(
      ["Criterio", `${cut.reference.n} perfiles`, `${cut.principal.n} consistentes`],
      cut.principal.criteria.map((item) => [item.name, cut.reference?.criteria.find((entry) => entry.id === item.id)?.text ?? "—", item.text]),
      [220, 120, 140],
    );
    note(`Costos más caja, sin redondear cada línea: ${cut.reference.financialText} en los ${cut.reference.n} y ${cut.principal.financialText} en los ${cut.principal.n}. CR del perfil agregado: ${formatCr(cut.reference.maxCr)} y ${formatCr(cut.principal.maxCr)}.`);
  }
  write(`Perfiles fuera del umbral individual: ${cut.excludedCr.map((value) => formatCr(value)).join(" y ") || "ninguno"}. ${cut.leaveOneOut.rankChanges === 0 ? `Al retirar una empresa por vez, el criterio de mayor peso no cambia en las ${cut.leaveOneOut.companies} empresas del perfil consistente.` : `Al retirar una empresa por vez, el primer puesto cambia en ${cut.leaveOneOut.rankChanges} de ${cut.leaveOneOut.companies} empresas.`} El movimiento máximo de reducir costos es de ${formatPoints(cut.leaveOneOut.maxCostPoints)}. La empresa se identifica por el nombre escrito igual, no por similitud.`, 10);
  write(`Pares de Compras y Finanzas con esa misma grafía y comparaciones dentro de 0,10: ${cut.pairs.n}. En ${cut.pairs.financeHigher} Finanzas asigna más peso al bloque financiero. ${cut.pairs.n < 5 ? "No se generaliza." : "Describe este corte."}`, 10);
  table(
    ["Pregunta", "Elegibles", "Con respuesta", "En blanco"],
    cut.coverage.map((item) => [item.label, String(item.eligible), String(item.valid), String(item.eligible - item.valid)]),
    [250, 70, 90, 70],
  );
  note("El blanco no se interpreta como no, ninguno ni ausencia de la iniciativa. MRO y el reporte del líder de compras solo cubren a su ruta.");
  if (cut.themes.length) write(`Respuestas abiertas con contenido: ${cut.openAnswers.valid - cut.openAnswers.placeholder} de ${cut.openAnswers.valid}. Placeholders como "prueba": ${cut.openAnswers.placeholder}. Temas, y una respuesta puede tener varios: ${cut.themes.map((item) => `${item.label} ${item.n}`).join("; ")}. No se publican citas.`, 10);
  write(`País de quien responde, no la lista de países donde opera la empresa: ${cut.countries.map((item) => `${item.label} ${item.n}`).join(", ")}. Roles: ${cut.counts.roles.map((item) => `${item.label} ${item.n}`).join(", ")}. Ningún corte de este archivo se presenta como benchmark regional.`, 10);
  write("Reemplazar las respuestas recalcula el perfil, los cruces y el texto. No hace falta un filtro por el origen de los datos.", 10);

  pages.forEach((item, index) => {
    item.drawText(clean(`Preliminar  ·  Versión A  ·  ${index + 1} de ${pages.length}`), { x: MARGIN, y: 26, size: 8, font, color: SLATE });
  });
  return new Uint8Array(await doc.save());
}

function byId(cut: StudyCutA, id: string) {
  return cut.claims.find((claim) => claim.id === id);
}

function formatCr(value: number) {
  return value.toFixed(value >= 0.01 ? 2 : 4).replace(".", ",");
}

function fit(text: string, face: PDFFont, size: number, box: number) {
  const value = clean(text);
  if (face.widthOfTextAtSize(value, size) <= box) return value;
  let shown = value;
  while (shown.length > 1 && face.widthOfTextAtSize(`${shown}...`, size) > box) shown = shown.slice(0, -1);
  return `${shown}...`;
}

function clean(value: string) {
  return value
    .replaceAll("\u2010", "-")
    .replaceAll("\u2011", "-")
    .replaceAll("\u2012", "-")
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-")
    .replaceAll("\u2018", "'")
    .replaceAll("\u2019", "'")
    .replaceAll("\u201c", '"')
    .replaceAll("\u201d", '"')
    .replaceAll("\u00a0", " ")
    .replaceAll("\u202f", " ")
    .replaceAll("\u2026", "...")
    .replace(/[^\u0000-\u00ff]/g, "");
}
