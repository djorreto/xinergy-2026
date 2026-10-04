import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { SCENARIOS } from "@/lib/surveys/radar-b/engine";
import {
  formatLevel,
  formatPercent,
  formatPoints,
  type StudyAction,
  type StudyBar,
  type StudyClaim,
  type StudyCut,
} from "@/lib/surveys/radar-b/study-cut";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const BOTTOM = 46;
const CHARCOAL = rgb(63 / 255, 55 / 255, 75 / 255);
const SLATE = rgb(84 / 255, 82 / 255, 109 / 255);
const ORANGE = rgb(252 / 255, 161 / 255, 0);
const CREAM = rgb(0.93, 0.91, 0.88);
const LEVELS = [
  rgb(0.33, 0.29, 0.4),
  rgb(0.52, 0.47, 0.56),
  rgb(0.74, 0.7, 0.64),
  rgb(252 / 255, 161 / 255, 0),
  rgb(0.98, 0.84, 0.48),
];
const SCENARIO_LABEL = { lean: "Ajustado (Lean)", balanced: "Intermedio (Balanced)", transformational: "Amplio (Transformational)" } as const;

export async function studyPdfB(input: { cut: StudyCut; thesis: string; summary: string; generatedLabel: string; cutLabel: string }) {
  const doc = await PDFDocument.create();
  doc.setTitle("Radar Compras 2027 · B (No oficial) - Informe preliminar");
  doc.setAuthor("Xinergy");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages: PDFPage[] = [];
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN;
  let figure = 0;
  const width = PAGE_WIDTH - MARGIN * 2;

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
    if (!lines.length) return;
    const lineHeight = size + 4;
    ensure(Math.min(lines.length, 6) * lineHeight);
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
    page.drawRectangle({ x: MARGIN, y: y, width: 28, height: 2.5, color: ORANGE });
    y -= 16;
    write(text, 14, bold, CHARCOAL, 8);
  }

  function note(text: string) {
    write(text, 8.5, font, SLATE, 8);
  }

  function bars(title: string, caption: string, rows: StudyBar[]) {
    figure += 1;
    const block = 36 + rows.length * 16;
    ensure(block + 28);
    write(`Figura ${figure}. ${title}`, 11, bold, CHARCOAL, 2);
    note(caption);
    for (const row of rows) {
      const labelWidth = 188;
      const barWidth = 210;
      const label = fit(row.label, font, 8, labelWidth);
      page.drawText(label, { x: MARGIN, y: y - 8, size: 8, font, color: CHARCOAL });
      const barX = MARGIN + labelWidth;
      page.drawRectangle({ x: barX, y: y - 10, width: barWidth, height: 7, color: CREAM });
      page.drawRectangle({ x: barX, y: y - 10, width: Math.max(1.5, barWidth * Math.max(0, Math.min(1, row.ratio))), height: 7, color: ORANGE });
      page.drawText(clean(row.trailing), { x: barX + barWidth + 6, y: y - 8, size: 8, font: bold, color: CHARCOAL });
      y -= 16;
    }
    y -= 8;
  }

  function stacks(title: string, caption: string) {
    figure += 1;
    const rows = input.cut.operationalCapabilities;
    ensure(48 + rows.length * 16 + 24);
    write(`Figura ${figure}. ${title}`, 11, bold, CHARCOAL, 2);
    note(caption);
    rows.forEach((row) => {
      const labelWidth = 168;
      const barWidth = 230;
      page.drawText(fit(row.name, font, 8, labelWidth), { x: MARGIN, y: y - 8, size: 8, font, color: CHARCOAL });
      let x = MARGIN + labelWidth;
      const total = row.n || 1;
      for (let level = 1; level <= 5; level += 1) {
        const slice = barWidth * ((row.counts[level] ?? 0) / total);
        if (slice > 0) page.drawRectangle({ x, y: y - 10, width: slice, height: 8, color: LEVELS[level - 1] });
        x += slice;
      }
      y -= 16;
    });
    let x = MARGIN;
    for (let level = 1; level <= 5; level += 1) {
      page.drawRectangle({ x, y: y - 10, width: 8, height: 8, color: LEVELS[level - 1] });
      page.drawText(`Nivel ${level}`, { x: x + 12, y: y - 8, size: 8, font, color: SLATE });
      x += 78;
    }
    y -= 28;
  }

  function table(headers: string[], rows: string[][], widths: number[]) {
    const rowHeight = 16;
    ensure(rowHeight * (rows.length + 1) + 8);
    const tableWidth = widths.reduce((sum, item) => sum + item, 0);
    page.drawRectangle({ x: MARGIN, y: y - rowHeight + 4, width: tableWidth, height: rowHeight, color: CREAM });
    let x = MARGIN;
    headers.forEach((header, index) => {
      page.drawText(fit(header, bold, 7.5, widths[index] - 6), { x: x + 3, y: y - 8, size: 7.5, font: bold, color: CHARCOAL });
      x += widths[index];
    });
    y -= rowHeight;
    for (const row of rows) {
      if (y - rowHeight < BOTTOM) {
        newPage();
        page.drawRectangle({ x: MARGIN, y: y - rowHeight + 4, width: tableWidth, height: rowHeight, color: CREAM });
        let headerX = MARGIN;
        headers.forEach((header, index) => {
          page.drawText(fit(header, bold, 7.5, widths[index] - 6), { x: headerX + 3, y: y - 8, size: 7.5, font: bold, color: CHARCOAL });
          headerX += widths[index];
        });
        y -= rowHeight;
      }
      x = MARGIN;
      row.forEach((cell, index) => {
        page.drawText(fit(cell, font, 8, widths[index] - 6), { x: x + 3, y: y - 8, size: 8, font, color: CHARCOAL });
        x += widths[index];
      });
      y -= rowHeight;
    }
    y -= 8;
  }

  function claim(item: StudyClaim, withLimit = true) {
    write(item.observation, 10.5, font, CHARCOAL, 6);
    write(item.tension, 10.5, font, CHARCOAL, 6);
    write(item.interpretation, 10.5, font, CHARCOAL, 6);
    write(item.implication, 10.5, font, CHARCOAL, 6);
    if (withLimit) note(item.limit);
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
      if (!line.line) continue;
      page.drawText(line.line, { x: MARGIN + 8, y: y - line.size, size: line.size, font: line.face, color: CHARCOAL });
      y -= 13;
    }
    y -= 12;
  }

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 16, width: PAGE_WIDTH, height: 16, color: ORANGE });
  y = PAGE_HEIGHT - 52;
  write("XINERGY", 9, bold, ORANGE, 2);
  write("Radar Compras 2027 · B (No oficial)", 18, bold, CHARCOAL, 2);
  write("Informe preliminar", 14, font, SLATE, 8);
  write(input.thesis, 13, bold, CHARCOAL, 8);
  write(`${input.cutLabel}  ·  ${input.generatedLabel}`, 9, font, SLATE, 2);
  write(universeLine(input.cut), 10, font, CHARCOAL, 8);
  write("Documento preliminar. Describe a las empresas que respondieron. No representa a América Latina y no estima un ahorro.", 9, font, SLATE, 10);
  write("Hallazgos de este corte", 11, bold, CHARCOAL, 4);
  for (const item of input.cut.claims) write(item.title, 10.5, font, CHARCOAL, 2);
  y -= 6;
  heading("Resumen ejecutivo");
  write(input.summary, 10.5, font, CHARCOAL, 10);

  kicker("Para qué sirve");
  heading("Una lectura para decidir qué revisar, no para predecir el año");
  write(
    "El estudio junta tres preguntas: qué se le pide a Compras, qué capacidad se declara hoy y si la agenda que está en marcha habla de las mismas empresas. Quien lo lee puede contrastar su caso y elegir qué revisar en los próximos 90 días. Una encuesta de este tipo no dice qué va a pasar en 2027, ni que una tendencia haya crecido, porque no hay una medición anterior comparable.",
    10.5,
  );
  write(
    "Cada empresa entra una vez, con la respuesta de quien conoce la operación. Las prioridades salen de comparaciones entre alternativas. La capacidad se lee de 1 a 5 y la referencia de planificación es el nivel 4. La distancia hasta esa referencia se calcula en cada empresa y después se promedia. El escenario de iniciativas recorre las combinaciones posibles dentro de un límite de recursos. La matriz que estima el aporte de cada iniciativa es de demostración: no está calibrada y no es un resultado observado. El apéndice guarda las fórmulas, los filtros y las versiones.",
    10.5,
  );

  const mandate = byId(input.cut, "mandato");
  if (mandate) {
    kicker("El mandato");
    heading(mandate.title);
    write(mandate.observation, 10.5);
    bars(input.cut.exhibits.macros.title, input.cut.exhibits.macros.note, input.cut.exhibits.macros.bars);
    bars(input.cut.exhibits.dimensions.title, input.cut.exhibits.dimensions.note, input.cut.exhibits.dimensions.bars);
    write(mandate.tension, 10.5);
    write(mandate.interpretation, 10.5);
    write(mandate.implication, 10.5);
    note(mandate.limit);
  }

  const capacity = byId(input.cut, "capacidad");
  if (capacity) {
    kicker("La capacidad para cumplirlo");
    heading(capacity.title);
    write(capacity.observation, 10.5);
    stacks(input.cut.exhibits.capabilities.title, input.cut.exhibits.capabilities.note);
    table(
      ["Capacidad", "Mediana", "Bajo nivel 4", "Niveles 1-2"],
      input.cut.operationalCapabilities.map((row) => [row.name, formatLevel(row.median), `${row.below}/${row.n}`, `${row.low}/${row.n}`]),
      [210, 70, 100, 90],
    );
    note(`Tabla de las ${input.cut.counts.operational} respuestas de Compras u Operaciones. En el subconjunto del escenario, N = ${input.cut.counts.motor}.`);
    if (input.cut.gapN) bars(input.cut.exhibits.gaps.title, input.cut.exhibits.gaps.note, input.cut.exhibits.gaps.bars);
    write(capacity.tension, 10.5);
    write(capacity.interpretation, 10.5);
    write(capacity.implication, 10.5);
    note(capacity.limit);
  }

  const digital = byId(input.cut, "digital");
  if (digital) {
    kicker("Una tensión de ejecución");
    heading(digital.title);
    claim(digital);
  }

  const agenda = byId(input.cut, "agenda");
  const scenario = byId(input.cut, "escenarios");
  if (agenda || scenario) {
    kicker("La agenda");
    if (agenda) {
      heading(agenda.title);
      write(agenda.observation, 10.5);
      const shown = coincidenceRows(input.cut);
      figure += 1;
      ensure(150);
      write(`Figura ${figure}. ${input.cut.exhibits.coincidence.title}`, 11, bold, CHARCOAL, 2);
      note(input.cut.exhibits.coincidence.note);
      table(
        ["Iniciativa", "Ambas", "Solo aprobada", "Solo seleccionada", "Ninguna"],
        shown.map((row) => [row.short, String(row.both), String(row.onlyApproved), String(row.onlySelected), String(row.neither)]),
        [150, 70, 90, 105, 70],
      );
      write(agenda.tension, 10.5);
      write(agenda.interpretation, 10.5);
      write(agenda.implication, 10.5);
      note(agenda.limit);
    }
    if (scenario) {
      heading(scenario.title);
      write(scenario.observation, 10.5);
      figure += 1;
      ensure(140);
      write(`Figura ${figure}. Cierre modelado al ampliar recursos`, 11, bold, CHARCOAL, 2);
      note(input.cut.exhibits.scenarios.note);
      table(
        ["Escenario", "Mediana de cierre", "Empresas", "Cambio mediano"],
        input.cut.scenarios.map((item, index) => [
          item.name,
          item.text,
          `${item.n}/${item.cohort}`,
          index === 0 ? "Base" : formatPoints(index === 1 ? input.cut.deltaLeanBalanced : input.cut.deltaBalancedTransformational),
        ]),
        [110, 120, 90, 140],
      );
      write(scenario.tension, 10.5);
      write(scenario.interpretation, 10.5);
      write(scenario.implication, 10.5);
      note(scenario.limit);
    }
  }

  if (input.cut.actions.length) {
    kicker("Noventa días");
    heading("Qué conviene revisar, y en qué caso");
    write("Cada acción vale solo para el perfil que la activa. No es una secuencia obligatoria ni un plazo calculado por el escenario. Noventa días es un horizonte de gestión.", 10.5);
    for (const item of input.cut.actions) action(item);
  }

  kicker("Lo que sigue abierto");
  heading("Qué puede decir esta ola y qué tiene que esperar");
  for (const item of input.cut.hypotheses) {
    write(`${item.title}. ${item.status === "pendiente" ? "Pendiente." : "Lectura descriptiva."} ${item.text}`, 10.5);
  }
  write("Preguntas que el corte deja planteadas", 11, bold, CHARCOAL, 4);
  for (const item of input.cut.openQuestions) write(item, 10.5, font, CHARCOAL, 3);

  kicker("Apéndice");
  heading("Cómo se armó el corte");
  write(`Corte ${input.cut.snapshotId}. ${input.cutLabel}. ${input.generatedLabel}.`, 10);
  table(
    ["Universo", "N", "Uso"],
    [
      ["Respuestas incluidas", String(input.cut.counts.responses), "Composición"],
      ["Empresas", String(input.cut.counts.companies), "Alcances distintos"],
      ["Compras u Operaciones", String(input.cut.counts.operational), `${input.cut.counts.operationalCpo} de Compras y ${input.cut.counts.operationalScm} de Operaciones`],
      ["Prioridad consistente", String(input.cut.counts.priority), "Promedio de importancia"],
      ["Escenario de demostración", String(input.cut.counts.motor), "Portafolios y cruces"],
      ["Finanzas", String(input.cut.counts.cfo), "Solo para pares, fuera del benchmark"],
      ["Dirección general", String(input.cut.counts.ceo), "No describe la capacidad"],
    ],
    [170, 50, 270],
  );
  write(
    input.cut.counts.duplicates
      ? `${input.cut.counts.duplicates} empresas quedaron fuera del benchmark porque tienen más de una respuesta del mismo rol. No se publica el nombre.`
      : "Ninguna empresa quedó fuera por tener dos respuestas del mismo rol.",
    10,
  );
  write("La capacidad normalizada es (nivel - 1) / 4. La meta de planificación es 0,75, el nivel 4. La brecha de una dimensión es lo que falta para esa meta, y nunca baja de cero. La brecha ponderada multiplica esa distancia por el peso de la misma empresa. La brecha total suma las ocho. El informe promedia esos productos. No multiplica el peso medio por la brecha media, ni resta un peso a una mediana. Si la brecha total es cero, no hay cierre porcentual.", 10);
  write("Una comparación consistente hasta 0,10 entra al promedio principal. Entre 0,10 y 0,20 el resultado es exploratorio y queda fuera de ese promedio. Sobre 0,20 queda fuera del promedio y del escenario. Una respuesta excluida puede seguir en la descripción de capacidad. Un “no sé” no se trata como cero.", 10);
  write("El escenario enumera las 2.048 combinaciones y se queda con la que más cierra la brecha dentro del límite. No es el optimizador lineal anterior. Los recursos son puntos relativos.", 10);
  table(
    ["Escenario", "Costo", "Esfuerzo", "Iniciativas"],
    SCENARIOS.map((item) => [SCENARIO_LABEL[item.id], String(item.budget), String(item.effort), String(item.maxCount)]),
    [200, 80, 90, 90],
  );
  write(`Matriz de aportes ${input.cut.matrixVersion}, de demostración y sin calibrar. Cuestionario ${input.cut.surveyVersion}. Metodología ${input.cut.methodVersion}. Informe ${input.cut.version}. La capacidad de innovación y la iniciativa de innovación se leen por separado.`, 10);
  write(input.cut.sensitivity.status === "ok"
    ? `${input.cut.sensitivity.note} Cada aporte distinto de cero se multiplica por un factor uniforme entre 0,80 y 1,20, con tope 0,95. La mediana de estabilidad es ${formatPercent(input.cut.sensitivity.medianStability)}.`
    : `Sensibilidad no incluida en este archivo. ${input.cut.sensitivity.note}`, 10);
  write(`Similitud entre la agenda aprobada y el escenario intermedio: mediana ${formatPercent(input.cut.jaccard.median)} en ${input.cut.jaccard.n} empresas. ${gapLine(input.cut.jaccard.missing, "sin resultado")}. Mide coincidencia de conjuntos, no calidad de la agenda.`, 10);
  write(`Contribución relativa de la agenda dentro de los límites del escenario: mediana ${formatPercent(input.cut.eta.median)} en ${input.cut.eta.n} empresas. ${gapLine(input.cut.eta.missing, "sin comparación")}.${reasonLine(input.cut.eta.reasons)} No es el cierre del escenario y los vacíos no valen cero.`, 10);
  write(`Otra comparación, con los recursos que la propia agenda ya usa: mediana ${formatPercent(input.cut.ownEta.median)} en ${input.cut.ownEta.n} empresas. ${gapLine(input.cut.ownEta.missing, "sin comparación")}. No se mezcla con la anterior.`, 10);
  write(input.cut.pairs.n
    ? `Pares Finanzas y Compras con prioridades consistentes, misma empresa y mismo alcance: ${input.cut.pairs.n}. En ${input.cut.pairs.financeHigher} Finanzas asigna más peso al valor financiero. Mediana de la diferencia: ${formatPoints(input.cut.pairs.medianPoints)}. ${input.cut.pairs.n < 5 ? "No se generaliza." : "Describe este corte."}`
    : "No hay pares consistentes de Finanzas y Compras.", 10);
  write(`Dirección general y Compras: ${input.cut.ceoPairs.n} pares consistentes. En ${input.cut.ceoPairs.financeHigher} la dirección asigna más peso financiero. Esa respuesta no entra a la capacidad operacional.`, 10);
  write(input.cut.evidence.present
    ? `La evidencia operacional E1 a E7 está completa en ${input.cut.evidence.complete} de ${input.cut.evidence.cohort} respuestas de Compras u Operaciones. Las categorías se cuentan. No se convierten en horas, montos ni porcentajes de ahorro.`
    : "Esta ola no trae evidencia operacional E1 a E7. No hay contraste entre el nivel declarado y una medición.", 10);
  const effort = input.cut.evidenceRows.find((item) => item.id === "e4");
  const stage = input.cut.evidenceRows.find((item) => item.id === "e5");
  if (effort) {
    note("Esfuerzo para validar el gasto con los 20 principales proveedores. Categorías, no horas.");
    table(["Categoría", "Empresas"], effort.rows.map((row) => [row.label, String(row.n)]), [360, 80]);
  }
  if (stage) {
    note("Etapa de uso de IA en Compras.");
    table(["Categoría", "Empresas"], stage.rows.map((row) => [row.label, String(row.n)]), [360, 80]);
  }
  if (input.cut.readiness.length) {
    note("Condición de datos en las empresas del escenario, e IA aprobada o en implementación.");
    table(
      ["Condición", "Empresas", "IA aprobada o en curso"],
      input.cut.readiness.map((row) => [row.label, String(row.n), String(row.iaActive)]),
      [250, 90, 140],
    );
  }
  write(`Cobertura operacional por país: ${input.cut.coverage.countries.map((row) => `${row.label} ${row.n}`).join(", ") || "sin dato"}. Una respuesta puede contar en más de un país. Por industria: ${input.cut.coverage.industries.map((row) => `${row.label} ${row.n}`).join(", ") || "sin dato"}. ${input.cut.publicSegments ? "Hay alguna celda de al menos 20 empresas." : "Ninguna celda llega a 20 empresas, así que no hay ranking de país ni de industria."} Roles de todas las respuestas: ${input.cut.coverage.roles.map((row) => `${row.label} ${row.n}`).join(", ")}.`, 10);
  write("Los límites de este preliminar son los de una participación voluntaria y un corte chico. El escenario no mide retorno. Las hipótesis de roles, de esfuerzo de validación y de datos para IA siguen con el contraste previsto y no se dan por confirmadas. Reemplazar las respuestas recalcula el corte, los cuadros y el texto. No hace falta un filtro por el origen de los datos.", 10);

  pages.forEach((item, index) => {
    item.drawText(clean(`Preliminar  ·  B (No oficial)  ·  ${index + 1} de ${pages.length}`), {
      x: MARGIN,
      y: 26,
      size: 8,
      font,
      color: SLATE,
    });
  });

  return new Uint8Array(await doc.save());
}

function universeLine(cut: StudyCut) {
  return `${cut.counts.responses} respuestas incluidas · ${cut.counts.companies} empresas · ${cut.counts.operational} de Compras u Operaciones · ${cut.counts.priority} con prioridad consistente · ${cut.counts.motor} con escenario de demostración`;
}

function byId(cut: StudyCut, id: string) {
  return cut.claims.find((claim) => claim.id === id);
}

function coincidenceRows(cut: StudyCut) {
  const ids = [...cut.highlighted];
  if (cut.rateId && !ids.includes(cut.rateId)) ids.push(cut.rateId);
  return ids.map((id) => cut.crosses.find((row) => row.id === id)).filter((row): row is NonNullable<typeof row> => Boolean(row));
}

function gapLine(missing: number, label: string) {
  return missing ? `${missing} ${label}, no promediados como cero` : "No quedaron casos vacíos";
}

function reasonLine(reasons: { label: string; n: number }[]) {
  if (!reasons.length) return "";
  return ` Motivo principal: ${reasons[0].label} (${reasons[0].n}).`;
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
