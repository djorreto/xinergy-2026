import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { workbookBytes } from "@/lib/surveys/export-xlsx";
import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-c/instrument";
import { countryNames } from "@/lib/surveys/radar-c/report";
import { loadPeople } from "@/app/api/admin/surveys/radar-compras-2027-c/informe/route";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const people = await loadPeople();
  if (!people) return NextResponse.json({ ok: false }, { status: 404 });
  const header = ["Fecha", "Empresa", "Email", "Rol", "Países", "Alcance", "Ruta", "AHP", "E1", "E2", "E3", "E5", "R1", ...CAPABILITIES.map((item) => item.short.es), ...INITIATIVE_COPY.map((item) => item.name.es)];
  const rows = people.map((person) => [
    person.createdAt,
    person.empresa,
    person.email,
    person.rol,
    countryNames(person.paises),
    person.alcance,
    person.operational ? "operativa" : "ejecutiva",
    person.ahpClass ?? "",
    person.context.e1,
    person.context.e2,
    person.context.e3,
    person.context.e5,
    person.context.r1,
    ...person.levels.map((level) => (level == null ? "ns" : String(level))),
    ...INITIATIVE_COPY.map((item) => person.agenda[item.id] ?? ""),
  ]);
  const bytes = await workbookBytes([{ name: "Respuestas", rows: [header, ...rows] }]);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=\"radar-compras-2027-c.xlsx\"",
      "Cache-Control": "no-store",
    },
  });
}
