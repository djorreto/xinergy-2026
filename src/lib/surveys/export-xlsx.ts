import ExcelJS from "exceljs";

const HEADER = "FF3F374B";

export async function workbookBytes(sheets: { name: string; rows: string[][] }[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Xinergy";
  for (const source of sheets) {
    const sheet = workbook.addWorksheet(source.name.slice(0, 31));
    source.rows.forEach((row) => sheet.addRow(row));
    const width = source.rows[0]?.length ?? 1;
    sheet.columns = Array.from({ length: width }, (_, index) => {
      const longest = source.rows.reduce((max, row) => Math.max(max, String(row[index] ?? "").length), 12);
      return { width: Math.min(48, Math.max(14, longest + 2)) };
    });
    const header = sheet.getRow(1);
    header.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER } };
    header.alignment = { vertical: "middle", wrapText: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.eachRow((row, index) => {
      if (index === 1) return;
      row.alignment = { vertical: "top", wrapText: true };
    });
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buffer as ArrayBuffer);
}
