import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { StudySection } from "@/lib/surveys/study";

export type StudyBar = { label: string; ratio: number; trailing: string };
export type StudyFigure = { title: string; note: string; bars: StudyBar[] };

export type StudyPdfInput = {
  edition: string;
  stamp: string;
  countLine: string;
  methodology: string[];
  sections: StudySection[];
  figures: StudyFigure[];
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const CHARCOAL = rgb(63 / 255, 55 / 255, 75 / 255);
const SLATE = rgb(84 / 255, 82 / 255, 109 / 255);
const ORANGE = rgb(252 / 255, 161 / 255, 0);
const CREAM = rgb(0.93, 0.91, 0.88);

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

export async function studyPdf(input: StudyPdfInput) {
  const doc = await PDFDocument.create();
  doc.setTitle(`Radar de Compras LatAm 2027 - Informe preliminar - ${input.edition}`);
  doc.setAuthor("Xinergy");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages: PDFPage[] = [];
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN;
  const width = PAGE_WIDTH - MARGIN * 2;

  function newPage() {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensure(height: number) {
    if (y - height < MARGIN + 36) newPage();
  }

  function wrap(text: string, face: PDFFont, size: number, box: number) {
    const lines: string[] = [];
    for (const paragraph of clean(text).split(/\n+/)) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      let line = "";
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (face.widthOfTextAtSize(next, size) > box && line) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      lines.push(line || "");
    }
    return lines;
  }

  function write(text: string, size: number, face: PDFFont, color = CHARCOAL, gap = 4) {
    const lines = wrap(text, face, size, width);
    const lineHeight = size + 4;
    ensure(lines.length * lineHeight + gap);
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y: y - size, size, font: face, color });
      y -= lineHeight;
    }
    y -= gap;
  }

  function heading(text: string) {
    ensure(36);
    page.drawRectangle({ x: MARGIN, y: y - 2, width: 28, height: 3, color: ORANGE });
    y -= 18;
    write(text, 15, bold, CHARCOAL, 8);
  }

  function figure(block: StudyFigure) {
    heading(block.title);
    if (block.note) write(block.note, 9, font, SLATE, 8);
    for (const bar of block.bars.slice(0, 12)) {
      ensure(18);
      const labelWidth = 230;
      const barWidth = 180;
      const safe = clean(bar.label);
      const shown = font.widthOfTextAtSize(safe, 9) > labelWidth ? `${safe.slice(0, 38)}...` : safe;
      page.drawText(shown, { x: MARGIN, y: y - 9, size: 9, font, color: CHARCOAL });
      const barX = MARGIN + labelWidth;
      page.drawRectangle({ x: barX, y: y - 11, width: barWidth, height: 7, color: CREAM });
      page.drawRectangle({ x: barX, y: y - 11, width: Math.max(2, barWidth * Math.max(0, Math.min(1, bar.ratio))), height: 7, color: ORANGE });
      page.drawText(clean(bar.trailing), { x: barX + barWidth + 8, y: y - 9, size: 9, font: bold, color: CHARCOAL });
      y -= 16;
    }
    y -= 8;
  }

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 18, width: PAGE_WIDTH, height: 18, color: ORANGE });
  y = PAGE_HEIGHT - 56;
  write("XINERGY", 9, bold, ORANGE, 2);
  write("Radar de Compras LatAm 2027", 22, bold, CHARCOAL, 2);
  write("Informe y estudio preliminar", 16, font, SLATE, 6);
  write(input.edition, 12, bold, CHARCOAL, 8);
  write(input.stamp, 10, font, SLATE, 2);
  write(input.countLine, 10, font, SLATE, 8);
  write("Documento preliminar para uso interno. Describe esta muestra. No es un corte representativo de América Latina ni una estimación de ahorro.", 9, font, SLATE, 14);

  const resumen = input.sections.find((section) => section.id === "resumen");
  if (resumen) {
    heading(resumen.title);
    write(resumen.body, 11, font, CHARCOAL, 12);
  }

  heading("Metodología, en breve");
  for (const paragraph of input.methodology) write(paragraph, 10, font, CHARCOAL, 8);

  heading("Lo que muestran los datos");
  write("Los gráficos usan las respuestas incluidas en el análisis. El texto de las secciones siguientes los interpreta. No agregan cifras que no estén aquí.", 10, font, SLATE, 8);
  for (const block of input.figures) figure(block);

  for (const section of input.sections.filter((item) => item.id !== "resumen")) {
    heading(section.title);
    write(section.body, 11, font, CHARCOAL, 12);
  }

  pages.forEach((item, index) => {
    item.drawText(clean(`Preliminar  ·  ${input.edition}  ·  ${index + 1} de ${pages.length}`), {
      x: MARGIN,
      y: 28,
      size: 8,
      font,
      color: SLATE,
    });
  });

  return new Uint8Array(await doc.save());
}
