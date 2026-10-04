import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { aggregateAhp, ahpLabel, formatPercent } from "@/lib/surveys/ahp";
import { evaluationOf, isIncluded } from "@/lib/surveys/evaluacion";
import { buildExecutiveFacts, type FactAnswer } from "@/lib/surveys/executive-facts";
import { formatStored } from "@/lib/surveys/present";
import { SURVEY_SLUG } from "@/lib/surveys/radar-2027";
import { SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";
import { buildOptionBFacts } from "@/lib/surveys/radar-b/facts";
import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-b/instrument";
import { buildBenchmark, buildPerson, percent, type RadarBInput } from "@/lib/surveys/radar-b/report";
import { studyIsStale, studyStamp, writeStudy, type StoredStudy, type StudySection } from "@/lib/surveys/study";
import { studyPdf, type StudyFigure } from "@/lib/surveys/study-pdf";

const dateFormat = new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "America/Santiago" });

const METHOD_A = [
  "La opción A pregunta diez comparaciones de prioridades y, además, el entorno, la tecnología, el riesgo y el rol de quien responde. Nadie parte de una respuesta marcada.",
  "El peso de cada prioridad sale de esas comparaciones: primero el grupo (eficiencia, riesgo o transformación) y después la prioridad dentro del grupo. El perfil de la muestra es la media geométrica de las comparaciones, no el promedio de las notas sueltas.",
  "Entran solo las respuestas incluidas en el análisis. Cada ejecutivo cuenta una vez. Un corte se publica con al menos 5 respuestas. Este informe es preliminar: describe la muestra y no estima ahorro en dólares.",
];

const METHOD_B = [
  "La opción B usa las mismas diez comparaciones de prioridad y agrega capacidad, evidencia y el estado de once iniciativas. El benchmark operacional toma una respuesta de Compras por empresa. Si hay dos del mismo rol, esa empresa queda fuera hasta consolidarla.",
  "Una respuesta entra al promedio principal si su consistencia es de hasta 0,10. Entre 0,10 y 0,20 el portafolio es exploratorio. Sobre 0,20 queda fuera del agregado principal y del motor. La capacidad se lee de 1 a 5. La brecha de planificación mide la distancia hasta el nivel 4.",
  "El portafolio recorre las combinaciones posibles y elige la que más cierra esa brecha dentro de un límite de recursos. La matriz de impacto es de demostración: no está calibrada y no es un ahorro. Este informe es preliminar.",
];

export async function studyResponse(slug: typeof SURVEY_SLUG | typeof SURVEY_SLUG_B) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", slug).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });

  const built = slug === SURVEY_SLUG_B ? await buildB(admin, survey.id) : await buildA(admin, survey.id);
  if (!built.included.length) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

  const { data: existing } = await admin
    .from("web_survey_reports")
    .select("generated_at, response_count, latest_response_at, sections")
    .eq("survey_id", survey.id)
    .maybeSingle();
  let study = existing ? toStudy(existing) : null;
  if (studyIsStale(study, built.included)) {
    let sections: StudySection[];
    try {
      sections = await writeStudy(built.facts, built.note);
    } catch (error) {
      console.error("study", error instanceof Error ? error.message : error);
      return NextResponse.json({ ok: false, error: "ai" }, { status: 502 });
    }
    const saved = {
      survey_id: survey.id,
      generated_at: new Date().toISOString(),
      response_count: built.included.length,
      latest_response_at: studyStamp(built.included),
      sections,
      updated_at: new Date().toISOString(),
    };
    const { data: stored, error } = await admin.from("web_survey_reports").upsert(saved, { onConflict: "survey_id" }).select("generated_at, response_count, latest_response_at, sections").single();
    if (error || !stored) return NextResponse.json({ ok: false }, { status: 500 });
    study = toStudy(stored);
  }
  if (!study) return NextResponse.json({ ok: false }, { status: 500 });

  const bytes = await studyPdf({
    edition: built.edition,
    stamp: `Generado el ${dateFormat.format(new Date(study.generatedAt))}`,
    countLine: built.countLine,
    methodology: built.methodology,
    sections: study.sections,
    figures: built.figures,
  });
  const filename = slug === SURVEY_SLUG_B ? "radar-compras-2027-b-informe-preliminar.pdf" : "radar-compras-2027-informe-preliminar.pdf";
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function toStudy(row: { generated_at: string; response_count: number; latest_response_at: string | null; sections: StudySection[] }): StoredStudy {
  return {
    generatedAt: row.generated_at,
    responseCount: row.response_count,
    latestResponseAt: row.latest_response_at,
    sections: row.sections ?? [],
  };
}

async function buildA(admin: Awaited<ReturnType<typeof createAdminClient>>, surveyId: string) {
  const { data } = await admin
    .from("web_survey_responses")
    .select("created_at, language, pais, rol, rol_grupo, antiguedad, rubro, rubro_grupo, company, answers, evaluacion")
    .eq("survey_id", surveyId);
  const rows = data ?? [];
  const included = rows.filter((row) => isIncluded(row.evaluacion));
  const factsInput: FactAnswer[] = included.map((row) => ({
    createdAt: row.created_at,
    language: row.language,
    pais: row.pais,
    rol: row.rol,
    rolGrupo: row.rol_grupo,
    antiguedad: row.antiguedad,
    rubro: row.rubro,
    rubroGrupo: row.rubro_grupo,
    company: row.company ?? {},
    answers: row.answers ?? {},
  }));
  const ahp = aggregateAhp(
    factsInput.map((item) => (item.answers.prioridades_ahp && typeof item.answers.prioridades_ahp === "object" ? (item.answers.prioridades_ahp as Record<string, string>) : null)).filter((item): item is Record<string, string> => Boolean(item)),
  );
  const ranking = ahp
    ? Object.entries(ahp.global)
        .sort((left, right) => right[1] - left[1])
        .map(([id, weight]) => ({ label: ahpLabel(id), ratio: weight, trailing: formatPercent(weight) }))
    : [];
  return {
    included: included.map((row) => ({ createdAt: row.created_at })),
    facts: buildExecutiveFacts(factsInput),
    note: "Instrumento: opción A. El perfil de prioridad es la media geométrica de las comparaciones de todas las respuestas incluidas.",
    edition: "Opción A · prioridades y operación",
    methodology: METHOD_A,
    countLine: `${included.length} respuestas incluidas${rows.length - included.length ? ` · ${rows.length - included.length} aisladas, fuera de este informe` : ""}`,
    figures: [
      figure("Países de la muestra", "Cada barra es la parte de las respuestas incluidas que opera en ese país.", tally(included.map((row) => formatStored("pais", row.pais)))),
      figure("Roles", "Cada ejecutivo cuenta una vez. No es una respuesta por empresa.", tally(included.map((row) => formatStored("rol", row.rol)))),
      { title: "Prioridades de la muestra", note: "Perfil colectivo. La barra más larga es la prioridad con más peso.", bars: ranking },
      figure("Industria", "Rubro declarado por quien respondió.", tally(included.map((row) => formatStored("rubro", row.rubro)))),
    ],
  };
}

async function buildB(admin: Awaited<ReturnType<typeof createAdminClient>>, surveyId: string) {
  const { data } = await admin
    .from("web_survey_responses")
    .select("id, created_at, nombre, apellido, email, empresa, pais, rol, rubro, evaluacion, company, answers")
    .eq("survey_id", surveyId);
  const people = ((data ?? []) as Array<RadarBInput & { created_at?: string; evaluacion?: string }>).map((row) =>
    buildPerson({
      id: row.id,
      createdAt: String(row.created_at ?? ""),
      nombre: row.nombre,
      apellido: row.apellido,
      email: row.email,
      empresa: row.empresa,
      pais: row.pais,
      rol: row.rol,
      rubro: row.rubro,
      evaluacion: evaluationOf(row.evaluacion),
      company: row.company ?? {},
      answers: row.answers ?? {},
    }),
  );
  const included = people.filter((person) => person.included);
  const benchmark = buildBenchmark(people);
  const facts = {
    ...buildOptionBFacts(people, benchmark),
    escenarios: {
      lean: topPortfolio(benchmark, "lean"),
      balanced: topPortfolio(benchmark, "balanced"),
      transformational: topPortfolio(benchmark, "transformational"),
    },
  };
  const priority = benchmark.ahpMean
    ? CAPABILITIES.map((item, index) => ({ label: item.short.es, ratio: benchmark.ahpMean?.[index] ?? 0, trailing: percent(benchmark.ahpMean?.[index]) }))
    : [];
  return {
    included,
    facts,
    note: "Instrumento: opción B. El benchmark de prioridad es el promedio de las empresas con respuesta de Compras y consistencia de hasta 0,10. El portafolio usa la matriz de demostración.",
    edition: "Opción B · prioridades, brechas y portafolios",
    methodology: METHOD_B,
    countLine: `${included.length} respuestas incluidas · ${benchmark.companies} empresas en el benchmark operacional`,
    figures: [
      figure("Países", "País de operación del alcance evaluado, sobre las respuestas incluidas.", tally(included.map((person) => person.pais))),
      { title: "Prioridades del benchmark", note: "Una empresa, una vez. Solo consistencia de hasta 0,10.", bars: priority },
      {
        title: "Capacidad, mediana de 1 a 5",
        note: "No es un porcentaje. La meta de planificación visible es el nivel 4.",
        bars: CAPABILITIES.map((item, index) => {
          const median = benchmark.capability[index]?.median;
          return { label: item.short.es, ratio: median ? median / 5 : 0, trailing: median ? `nivel ${String(median).replace(".", ",")}` : "—" };
        }),
      },
      {
        title: "Escenario Balanced",
        note: "Parte de las empresas con motor de demostración en las que la iniciativa entra al portafolio calculado.",
        bars: INITIATIVE_COPY.map((item, index) => ({
          label: item.name.es,
          ratio: benchmark.action.balanced[index]?.selected ?? 0,
          trailing: percent(benchmark.action.balanced[index]?.selected),
        })),
      },
    ],
  };
}

function topPortfolio(benchmark: ReturnType<typeof buildBenchmark>, scenario: "lean" | "balanced" | "transformational") {
  return INITIATIVE_COPY.map((item, index) => ({
    iniciativa: item.name.es,
    seleccion: percent(benchmark.action[scenario][index]?.selected),
  })).filter((item) => item.seleccion !== "0,0%" && item.seleccion !== "—");
}

function tally(labels: string[]) {
  const counts = new Map<string, number>();
  for (const label of labels) {
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([label, count]) => ({ label, ratio: total ? count / total : 0, trailing: formatPercent(total ? count / total : 0) }));
}

function figure(title: string, note: string, bars: StudyFigure["bars"]): StudyFigure {
  return { title, note, bars };
}
