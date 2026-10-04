import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { AHP, tx } from "@/lib/surveys/radar-2027";
import { ahpLabel, formatRatio } from "@/lib/surveys/ahp";
import type { buildAnalysis } from "@/lib/surveys/export-model";

type Model = ReturnType<typeof buildAnalysis>;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 46;
const CHARCOAL = rgb(63 / 255, 55 / 255, 75 / 255);
const SLATE = rgb(84 / 255, 82 / 255, 109 / 255);
const ORANGE = rgb(252 / 255, 161 / 255, 0);
const CREAM = rgb(0.93, 0.91, 0.88);
const RULE = rgb(0.86, 0.84, 0.82);

function clean(value: string) {
  return value
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-")
    .replaceAll("\u2018", "'")
    .replaceAll("\u2019", "'")
    .replaceAll("\u201c", '"')
    .replaceAll("\u201d", '"')
    .replaceAll("\u00a0", " ")
    .replaceAll("\u202f", " ");
}

export async function analysisPdf(model: Model) {
  const doc = await PDFDocument.create();
  doc.setTitle("Radar de Compras LatAm 2027 - Análisis preliminar");
  doc.setAuthor("Xinergy");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages: PDFPage[] = [];
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN;

  const contentWidth = PAGE_WIDTH - MARGIN * 2;

  function newPage() {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensure(height: number) {
    if (y - height < MARGIN + 28) newPage();
  }

  function wrap(text: string, face: PDFFont, size: number, width: number) {
    const lines: string[] = [];
    for (const paragraph of clean(text).split(/\n+/)) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      let line = "";
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (face.widthOfTextAtSize(next, size) > width && line) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      }
      lines.push(line || "");
    }
    return lines;
  }

  function write(text: string, size: number, face: PDFFont, color = CHARCOAL, gap = 4) {
    const lines = wrap(text, face, size, contentWidth);
    const lineHeight = size + 4;
    ensure(lines.length * lineHeight + gap);
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y: y - size, size, font: face, color });
      y -= lineHeight;
    }
    y -= gap;
  }

  function heading(text: string) {
    ensure(28);
    page.drawRectangle({ x: MARGIN, y: y - 4, width: 28, height: 3, color: ORANGE });
    y -= 16;
    write(text, 14, bold, CHARCOAL, 8);
  }

  function bar(label: string, ratio: number, trailing: string) {
    const labelWidth = 250;
    const barWidth = 170;
    ensure(18);
    const safe = clean(label);
    const shown = font.widthOfTextAtSize(safe, 9) > labelWidth ? `${safe.slice(0, 42)}...` : safe;
    page.drawText(shown, { x: MARGIN, y: y - 9, size: 9, font, color: CHARCOAL });
    const barX = MARGIN + labelWidth;
    page.drawRectangle({ x: barX, y: y - 11, width: barWidth, height: 7, color: CREAM });
    page.drawRectangle({ x: barX, y: y - 11, width: Math.max(2, barWidth * Math.min(1, ratio)), height: 7, color: ORANGE });
    page.drawText(clean(trailing), { x: barX + barWidth + 8, y: y - 9, size: 9, font: bold, color: CHARCOAL });
    y -= 16;
  }

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 18, width: PAGE_WIDTH, height: 18, color: ORANGE });
  y = PAGE_HEIGHT - 48;
  write("XINERGY", 9, bold, ORANGE, 2);
  write("Radar de Compras LatAm 2027", 22, bold, CHARCOAL, 2);
  write("Análisis preliminar", 14, font, SLATE, 8);
  write(`${model.generated}  ·  ${model.count === 1 ? "1 respuesta" : `${model.count} respuestas`}`, 10, font, SLATE, 4);
  write("Documento interno. Las cifras son preliminares. Un corte se publica solo cuando el grupo tiene al menos 5 respuestas.", 9, font, SLATE, 12);

  heading("La muestra, hasta ahora");
  write(model.brief?.context || "El relato preliminar todavia no se ha generado. Las cifras de este documento igual corresponden a las respuestas recibidas.", 11, font, CHARCOAL, 10);

  for (const theme of model.brief?.themes ?? []) {
    heading(theme.title);
    write(theme.body, 11, font, CHARCOAL, 10);
  }

  heading("Quién respondió");
  for (const group of model.sample) {
    if (!group.rows.length) continue;
    write(group.title, 11, bold, CHARCOAL, 4);
    const top = Math.max(...group.rows.map((row) => row.count), 1);
    for (const row of group.rows) bar(row.label, row.count / top, `${row.count} · ${row.pct}%`);
    y -= 6;
  }

  if (model.ahp) {
    heading("Priorización consolidada");
    write("Los pesos suman 100%. Cada comparación entre personas se agrega con la media geométrica y después se recalcula el ranking.", 10, font, SLATE, 8);
    write(model.macros.map((macro) => `${macro.pct}  ${macro.label}`).join("     "), 11, bold, CHARCOAL, 8);
    const top = model.ranking[0]?.weight || 1;
    model.ranking.forEach((item, index) => bar(`${index + 1}. ${item.label}`, item.weight / top, item.pct));
    y -= 4;
    write(
      `Consistencia ${model.consistency.toLowerCase()}. Mayor CR observado: ${model.maxCr == null ? "-" : model.maxCr.toFixed(3).replace(".", ",")}. Un CR de hasta 0,10 es la referencia en matrices de 3x3.`,
      9,
      font,
      SLATE,
      10,
    );
  }

  let currentSection = "";
  for (const block of model.blocks) {
    if (block.section !== currentSection) {
      currentSection = block.section;
      heading(currentSection);
    }
    write(block.title, 11, bold, CHARCOAL, 3);
    if (block.kind !== "notes") write(block.note, 8, font, SLATE, 4);
    if (block.kind === "bars") {
      const top = Math.max(...block.rows.map((row) => row.count), 1);
      for (const row of block.rows) bar(row.label, row.count / top, `${row.count} · ${row.pct}%`);
    } else if (block.kind === "means") {
      for (const row of block.rows) bar(row.label, row.mean == null ? 0 : row.mean / 5, row.mean == null ? "-" : row.mean.toFixed(2).replace(".", ","));
    } else {
      for (const row of block.rows) write(`${row.who}. ${row.text}`, 10, font, CHARCOAL, 4);
    }
    y -= 6;
  }

  heading("Modelo y parámetros");
  for (const [field, value] of model.parameters) write(`${field}. ${value}`, 9, font, SLATE, 3);
  if (model.ahp) {
    y -= 8;
    write("Matrices agregadas", 11, bold, CHARCOAL, 6);
    const matrices = [
      { title: "Macro", ids: model.ahp.macro.ids, matrix: model.ahp.macro.matrix, cr: model.ahp.macro.cr },
      ...AHP.macros.map((macro) => ({ title: tx(macro.label, "es"), ...model.ahp!.groups[macro.id] })),
    ];
    for (const matrix of matrices) {
      if (!matrix.ids) continue;
      write(`${matrix.title} · CR ${matrix.cr.toFixed(3).replace(".", ",")}`, 10, bold, CHARCOAL, 3);
      matrix.ids.forEach((rowId, row) => {
        const cells = matrix.ids.map((columnId, column) => `${ahpLabel(columnId)} ${formatRatio(matrix.matrix[row][column])}`).join("   ");
        write(`${ahpLabel(rowId)}: ${cells}`, 8, font, SLATE, 2);
      });
      y -= 4;
    }
  }

  pages.forEach((item, index) => {
    item.drawLine({ start: { x: MARGIN, y: 32 }, end: { x: PAGE_WIDTH - MARGIN, y: 32 }, thickness: 0.4, color: RULE });
    item.drawText(clean(`Análisis preliminar  ·  Radar de Compras LatAm 2027  ·  ${index + 1}/${pages.length}`), {
      x: MARGIN,
      y: 18,
      size: 8,
      font,
      color: SLATE,
    });
  });

  return doc.save();
}
