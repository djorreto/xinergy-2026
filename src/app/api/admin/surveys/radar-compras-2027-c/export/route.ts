import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { loadPeople } from "@/app/api/admin/surveys/radar-compras-2027-c/informe/route";
import { workbookBytes } from "@/lib/surveys/export-xlsx";
import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-c/instrument";
import { buildPaperCut, capabilityName, initiativeName } from "@/lib/surveys/radar-c/paper-cut";
import { countryNames } from "@/lib/surveys/radar-c/report";

export const maxDuration = 60;

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const people = await loadPeople();
  if (!people) return NextResponse.json({ ok: false }, { status: 404 });
  const cut = buildPaperCut(people);
  const header = [
    "Fecha", "Empresa", "Nombre", "Apellido", "Cargo", "Email", "Teléfono", "LinkedIn", "Rol", "Países", "Alcance", "Ruta", "Clase AHP", "Modo", "CR",
    "E1 ahorro validado", "E2 realización", "E3 exposición", "E4 esfuerzo de datos", "E5 etapa IA", "R1 condición de datos", "Barreras",
    "IA proyectos en marcha", "IA cantidad", "IA proyectos de Compras", "IA presupuesto", "IA presupuesto de Compras %", "IA pilotos escalados", "IA cómo se hacen",
    "Equipo hoy", "Equipo próximo año",
    ...CAPABILITIES.map((item, index) => `capability_C${index + 1}_${item.id}`),
    ...CAPABILITIES.map((item) => `peso_${item.id}`),
    ...CAPABILITIES.map((item) => `peso_ahp_${item.id}`),
    ...INITIATIVE_COPY.map((item, index) => `initiative_I${index + 1}_${item.id}`),
  ];
  const rows = people.map((person) => [
    person.createdAt,
    person.empresa,
    person.nombre,
    person.apellido,
    person.cargo,
    person.email,
    person.telefono,
    person.linkedin,
    person.rol,
    countryNames(person.paises),
    person.alcance,
    person.operational ? "operativa" : "ejecutiva",
    person.ahpClass ?? "",
    person.priorityMode === "hibrido" ? "Hibrido" : "AHP",
    person.ahp ? String(person.ahp.maxCr) : "",
    person.context.e1,
    person.context.e2,
    person.context.e3,
    person.context.e4,
    person.context.e5,
    person.context.r1,
    person.barriers.join("|"),
    person.context.ia_activos,
    person.context.ia_activos_n,
    person.context.ia_compras_n,
    person.context.ia_presupuesto,
    person.context.ia_presupuesto_compras,
    person.context.ia_escala,
    person.context.ia_modo,
    person.context.equipo_n,
    person.context.equipo_proximo,
    ...person.levels.map((level) => (level == null ? "ns" : String(level))),
    ...CAPABILITIES.map((_, index) => (person.weights ? String(person.weights[index] ?? "") : "")),
    ...CAPABILITIES.map((_, index) => (person.ahpWeights ? String(person.ahpWeights[index] ?? "") : "")),
    ...INITIATIVE_COPY.map((item) => person.agenda[item.id] ?? ""),
  ]);
  const bases = [
    ["Base", "N"],
    ["Recibidas", String(cut.participants)],
    ["Incluidas", String(cut.included)],
    ["Operativas", String(cut.operational)],
    ["Ejecutivas", String(cut.executive)],
    ["Empresas", String(cut.companies)],
    ["AHP principal", String(cut.ahp.principal)],
    ["AHP exploratorio", String(cut.ahp.exploratory)],
    ["AHP excluido", String(cut.ahp.excluded)],
    ["Base ampliada", String(cut.expanded.n)],
    ["Portafolio", String(cut.motor)],
  ];
  const weights = [
    ["Criterio", "Identificador", "Peso medio AHP", "Peso medio ampliado", "Mínimo", "Máximo", "Desviación", "Brecha media"],
    ...CAPABILITIES.map((item, index) => [
      capabilityName(index),
      `capability_C${index + 1}`,
      String(cut.aip?.[index] ?? ""),
      String(cut.expanded.aip?.[index] ?? ""),
      String(cut.dispersion[index]?.min ?? ""),
      String(cut.dispersion[index]?.max ?? ""),
      String(cut.dispersion[index]?.sd ?? ""),
      String(cut.capability[index]?.gapMean ?? ""),
    ]),
  ];
  const portfolios = [
    ["Escenario", "Iniciativa", "Identificador", "Seleccionadas", "Aprobadas", "Base"],
    ...cut.selection.map((row) => [row.scenario, initiativeName(row.index), `initiative_I${row.index + 1}`, String(row.selected), String(row.approved), String(row.of)]),
  ];
  const sensitivity = [
    ["Nota", cut.sensitivity.note],
    ["Corridas", String(cut.sensitivity.runs)],
    ["Semilla", String(cut.sensitivity.seed)],
    ["Empresas estables", String(cut.sensitivity.stableCompanies)],
    ["Empresas", String(cut.sensitivity.companies)],
    ["Mediana de estabilidad", String(cut.sensitivity.medianStability ?? "")],
    [],
    ["Iniciativa", "Identificador", "Empresas en la base", "Frecuencia de permanencia"],
    ...cut.sensitivity.keep.map((row) => [initiativeName(row.index), `initiative_I${row.index + 1}`, String(row.base), String(row.rate ?? "")]),
  ];
  const bytes = await workbookBytes([
    { name: "Respuestas", rows: [header, ...rows] },
    { name: "Bases", rows: bases },
    { name: "Pesos y brechas", rows: weights },
    { name: "Portafolios", rows: portfolios },
    { name: "Sensibilidad", rows: sensitivity },
  ]);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=\"radar-compras-2027-c.xlsx\"",
      "Cache-Control": "no-store",
    },
  });
}
