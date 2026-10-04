import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { paperDocument, type Block, type PaperDocument } from "@/lib/surveys/radar-c/paper-doc";
import { buildPaperCut } from "@/lib/surveys/radar-c/paper-cut";
import type { PersonC } from "@/lib/surveys/radar-c/report";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 58;
const BOTTOM = 52;
const CHARCOAL = rgb(63 / 255, 55 / 255, 75 / 255);
const SLATE = rgb(84 / 255, 82 / 255, 109 / 255);
const ORANGE = rgb(252 / 255, 161 / 255, 0);
const RULE = rgb(0.9, 0.88, 0.84);
const SIZE = 10.5;
const LEAD = 5.4;

export async function paperPdfC(people: PersonC[], stamp: string) {
  const cut = buildPaperCut(people);
  const doc = paperDocument(cut, stamp);
  return renderPaper(doc);
}

export async function renderPaper(doc: PaperDocument) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(doc.title);
  pdf.setAuthor("Xinergy");
  pdf.setSubject("Working paper de la versión C del Radar de Compras LatAm 2027");
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const pages: PDFPage[] = [];
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - 46;
  const width = PAGE_WIDTH - MARGIN * 2;

  function addPage() {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  }
  function room(height: number) {
    if (y - height < BOTTOM) addPage();
  }
  function draw(text: string, size: number, face: PDFFont, color = CHARCOAL, gap = 8, indent = 0) {
    const lines = wrap(clean(text), face, size, width - indent);
    for (const line of lines) {
      room(size + LEAD);
      page.drawText(line, { x: MARGIN + indent, y: y - size, size, font: face, color });
      y -= size + LEAD;
    }
    y -= gap;
  }

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 10, width: PAGE_WIDTH, height: 10, color: ORANGE });
  y = PAGE_HEIGHT - 40;
  draw("XINERGY", 8, bold, ORANGE, 2);
  draw(doc.kicker, 9, font, SLATE, 8);
  draw(doc.title, 16, bold, CHARCOAL, 6);
  draw(doc.stamp, 9, font, SLATE, 4);
  draw(`Palabras clave: ${doc.keywords.join("; ")}.`, 9, italic, SLATE, 8);
  draw("Resumen", 12, bold, CHARCOAL, 4);
  draw(doc.abstract, SIZE, font, CHARCOAL, 10);

  for (const block of doc.blocks) render(block);

  pages.forEach((item, index) => {
    item.drawText(clean(`Working paper  ·  ${index + 1}`), { x: MARGIN, y: 28, size: 8, font, color: SLATE });
  });
  return new Uint8Array(await pdf.save());

  function render(block: Block) {
    if (block.type === "h2") {
      room(88);
      y -= 8;
      page.drawRectangle({ x: MARGIN, y: y - 2, width: 28, height: 2, color: ORANGE });
      y -= 16;
      draw(block.text, 13, bold, CHARCOAL, 6);
      return;
    }
    if (block.type === "h3") {
      room(64);
      draw(block.text, 11, bold, CHARCOAL, 4);
      return;
    }
    if (block.type === "p") {
      draw(block.text, SIZE, font, CHARCOAL, 7);
      return;
    }
    draw(`${block.id}. ${block.title}`, 10, bold, CHARCOAL, 4);
    drawTable(block.headers, block.rows);
    draw(block.note, 8, italic, SLATE, 8);
  }

  function drawTable(headers: string[], rows: string[][]) {
    const columns = fitColumns(headers.length, width);
    const paint = (cells: string[], face: PDFFont, fill: boolean) => {
      const lines = cells.map((cell, index) => wrap(clean(cell), face, 8, columns[index] - 6));
      const height = Math.max(...lines.map((item) => item.length)) * 11 + 6;
      room(height + 2);
      if (fill) page.drawRectangle({ x: MARGIN, y: y - height, width, height, color: RULE });
      let x = MARGIN;
      lines.forEach((column, index) => {
        column.forEach((line, lineIndex) => {
          page.drawText(line, { x: x + 3, y: y - 12 - lineIndex * 11, size: 8, font: face, color: CHARCOAL });
        });
        x += columns[index];
      });
      y -= height;
    };
    paint(headers, bold, true);
    rows.forEach((row, index) => {
      if (y - 28 < BOTTOM) {
        addPage();
        paint(headers, bold, true);
      }
      paint(row, font, index % 2 === 1);
    });
    y -= 4;
  }
}

function fitColumns(count: number, width: number) {
  if (count <= 1) return [width];
  const first = Math.min(190, width * 0.34);
  const rest = (width - first) / (count - 1);
  return [first, ...Array.from({ length: count - 1 }, () => rest)];
}

function splitLong(word: string, face: PDFFont, size: number, box: number) {
  if (face.widthOfTextAtSize(word, size) <= box) return [word];
  const parts: string[] = [];
  let chunk = "";
  for (const char of word) {
    const next = chunk + char;
    if (face.widthOfTextAtSize(next, size) > box && chunk) {
      parts.push(chunk);
      chunk = char;
    } else chunk = next;
  }
  if (chunk) parts.push(chunk);
  return parts;
}

function wrap(value: string, face: PDFFont, size: number, box: number) {
  const lines: string[] = [];
  for (const paragraph of value.split(/\n+/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const parts = splitLong(word, face, size, box);
      for (const part of parts) {
        const next = line ? `${line} ${part}` : part;
        if (face.widthOfTextAtSize(next, size) > box && line) {
          lines.push(line);
          line = part;
        } else line = next;
      }
    }
    if (line) lines.push(line);
    if (!words.length) lines.push("");
  }
  return lines.length ? lines : [""];
}

function clean(value: string) {
  return value
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-")
    .replaceAll("\u2018", "'")
    .replaceAll("\u2019", "'")
    .replaceAll("\u201c", "\"")
    .replaceAll("\u201d", "\"")
    .replaceAll("\u00a0", " ")
    .replaceAll("\u2026", "...")
    .replace(/[^\u0000-\u00ff]/g, "");
}
