import { aggregateAhp, ahpLabel, analyzeAhp, formatPercent, formatRatio } from "@/lib/surveys/ahp";
import { formatStored } from "@/lib/surveys/present";
import {
  AHP,
  AHP_SCALE,
  CONSENTS,
  EMP,
  QUESTION_SECTIONS,
  S4,
  S5,
  S6,
  S7,
  SETS,
  SURVEY_TITLE,
  SURVEY_VERSION,
  isVisible,
  tx,
  type Question,
} from "@/lib/surveys/radar-2027";
import type { StoredBrief } from "@/lib/surveys/executive";

export type ExportPerson = {
  createdAt: string;
  language: "es" | "en" | "pt";
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  linkedin: string | null;
  cargo: string;
  empresa: string;
  pais: string;
  rol: string;
  rolGrupo: string;
  antiguedad: string;
  rubro: string;
  rubroGrupo: string | null;
  consents: Record<string, boolean>;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
  evaluacion: string;
  evaluacionAt: string | null;
  evaluacionPor: string | null;
};

const when = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

const QUESTIONS = [...EMP, ...S4, ...S5, ...S6, ...S7];

function languageName(language: ExportPerson["language"]) {
  if (language === "en") return "Inglés";
  if (language === "pt") return "Portugués";
  return "Español";
}

function recordOf(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, string>;
}

function stored(question: Question, person: ExportPerson) {
  return EMP.some((item) => item.id === question.id) ? person.company[question.id] : person.answers[question.id];
}

function scaleText(question: Extract<Question, { type: "scale" | "matrix" }>, score: string) {
  const anchors = question.type === "matrix" ? SETS[question.set] : (question.anchors ?? (question.set ? SETS[question.set] : []));
  const anchor = anchors[Number(score) - 1];
  return anchor ? `${score}. ${tx(anchor, "es")}` : score;
}

function pairEnds(pair: (typeof AHP.pairs)[number]) {
  const left = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.a)?.label : AHP.criteria[pair.a];
  const right = pair.group === "macro" ? AHP.macros.find((item) => item.id === pair.b)?.label : AHP.criteria[pair.b];
  return {
    left: left ? tx(left, "es") : pair.a,
    right: right ? tx(right, "es") : pair.b,
  };
}

function judgment(token: string) {
  const point = AHP_SCALE.find((item) => item.token === token);
  return point ? `${token} · ${point.es}` : token;
}

function sectionName(id: string) {
  if (id === "empresa") return "Su empresa";
  if (id === "s4") return "Entorno y riesgo";
  if (id === "s5") return "Tecnología, datos e IA";
  if (id === "s6") return "Su rol";
  return "Proyectos y talento";
}

export function responseTable(people: ExportPerson[]) {
  const columns = [
    "Fecha",
    "Evaluación",
    "Evaluación actualizada",
    "Evaluación por",
    "Idioma",
    "Nombre",
    "Apellido",
    "Email",
    "Teléfono",
    "LinkedIn",
    "Cargo",
    "Empresa",
    "País",
    "Rol",
    "Grupo de rol",
    "Antigüedad",
    "Rubro",
    "Grupo de rubro",
    ...CONSENTS.map((item) => tx(item.label, "es")),
  ];

  const extras: { header: string; value: (person: ExportPerson) => string }[] = [];
  for (const question of QUESTIONS) {
    if (question.type === "matrix") {
      for (const row of question.rows) {
        extras.push({
          header: `${tx(question.label, "es")} — ${tx(row, "es")}`,
          value: (person) => {
            const score = recordOf(stored(question, person))?.[row.v];
            return score ? scaleText(question, String(score)) : "";
          },
        });
      }
      continue;
    }
    if (question.type === "ahp") {
      for (const pair of AHP.pairs) {
        const ends = pairEnds(pair);
        extras.push({
          header: `AHP ${ends.left} frente a ${ends.right}`,
          value: (person) => {
            const token = recordOf(person.answers[question.id])?.[pair.id];
            return token ? judgment(String(token)) : "";
          },
        });
      }
      for (const macro of AHP.macros) {
        extras.push({
          header: `Peso AHP ${tx(macro.label, "es")}`,
          value: (person) => {
            const analysis = analyzeAhp(recordOf(person.answers.prioridades_ahp));
            const index = analysis?.macro.ids.indexOf(macro.id) ?? -1;
            return analysis && index >= 0 ? formatPercent(analysis.macro.weights[index] ?? 0) : "";
          },
        });
      }
      for (const [id, label] of Object.entries(AHP.criteria)) {
        extras.push({
          header: `Peso AHP ${tx(label, "es")}`,
          value: (person) => {
            const analysis = analyzeAhp(recordOf(person.answers.prioridades_ahp));
            return analysis ? formatPercent(analysis.global[id] ?? 0) : "";
          },
        });
      }
      continue;
    }
    extras.push({
      header: tx(question.label, "es"),
      value: (person) => {
        const value = stored(question, person);
        if (question.type === "scale") {
          return typeof value === "string" && value ? scaleText(question, value) : "";
        }
        const text = formatStored(question.id, value);
        return text === "—" ? "" : text;
      },
    });
    if (question.type === "multi" && question.other) {
      extras.push({
        header: `${tx(question.label, "es")} — otro`,
        value: (person) => {
          const other = person.answers[`${question.id}_otro`];
          return typeof other === "string" ? other : "";
        },
      });
    }
  }

  columns.push(...extras.map((column) => column.header));
  const rows = people.map((person) => [
    when.format(new Date(person.createdAt)),
    person.evaluacion,
    person.evaluacionAt ? when.format(new Date(person.evaluacionAt)) : "",
    person.evaluacionPor ?? "",
    languageName(person.language),
    person.nombre,
    person.apellido,
    person.email,
    person.telefono ?? "",
    person.linkedin ?? "",
    person.cargo,
    person.empresa,
    formatStored("pais", person.pais),
    formatStored("rol", person.rol),
    person.rolGrupo,
    formatStored("antiguedad", person.antiguedad),
    formatStored("rubro", person.rubro),
    person.rubroGrupo ?? "",
    ...CONSENTS.map((item) => (person.consents[item.id] ? "Sí" : "No")),
    ...extras.map((column) => column.value(person)),
  ]);
  return { columns, rows };
}

export type BarRow = { label: string; count: number; pct: number };
export type MeanRow = { label: string; mean: number | null };

export type AnalysisBlock =
  | { kind: "bars"; section: string; title: string; note: string; rows: BarRow[] }
  | { kind: "means"; section: string; title: string; note: string; rows: MeanRow[] }
  | { kind: "notes"; section: string; title: string; rows: { who: string; text: string }[] };

function tally(labels: string[], base?: number) {
  const counts = new Map<string, number>();
  for (const label of labels) {
    if (!label || label === "—") continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const total = base ?? [...counts.values()].reduce((sum, count) => sum + count, 0);
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([label, count]) => ({ label, count, pct: total ? Math.round((count / total) * 100) : 0 }));
}

function questionBlocks(people: ExportPerson[]): AnalysisBlock[] {
  const blocks: AnalysisBlock[] = [];
  const groups = [{ id: "empresa", questions: EMP }, ...QUESTION_SECTIONS];
  for (const group of groups) {
    for (const question of group.questions) {
      if (question.type === "ahp" || question.type === "text" || question.type === "email" || question.type === "tel" || question.type === "url") continue;
      const audience = people.filter((person) => isVisible(question, person.rolGrupo, person.rubroGrupo));
      if (!audience.length) continue;
      const section = sectionName(group.id);
      if (question.type === "select" || question.type === "single") {
        const rows = tally(audience.map((person) => formatStored(question.id, stored(question, person))));
        if (rows.length) blocks.push({ kind: "bars", section, title: tx(question.label, "es"), note: `${audience.length} respuestas`, rows });
      } else if (question.type === "multi") {
        const rows = question.options
          .map((option) => {
            const count = audience.filter((person) => {
              const value = stored(question, person);
              return Array.isArray(value) && value.includes(option.v);
            }).length;
            return { label: tx(option, "es"), count, pct: audience.length ? Math.round((count / audience.length) * 100) : 0 };
          })
          .filter((row) => row.count > 0);
        if (rows.length) blocks.push({ kind: "bars", section, title: tx(question.label, "es"), note: `${audience.length} respuestas`, rows });
      } else if (question.type === "scale") {
        const scores = audience.map((person) => Number(stored(question, person))).filter((value) => value >= 1 && value <= 5);
        if (!scores.length) continue;
        const anchors = question.anchors ?? (question.set ? SETS[question.set] : []);
        const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
        blocks.push({
          kind: "bars",
          section,
          title: tx(question.label, "es"),
          note: `Promedio ${mean.toFixed(2).replace(".", ",")} de 5 · ${scores.length} respuestas`,
          rows: [1, 2, 3, 4, 5].map((score) => ({
            label: anchors[score - 1] ? `${score}. ${tx(anchors[score - 1], "es")}` : String(score),
            count: scores.filter((value) => value === score).length,
            pct: scores.length ? Math.round((scores.filter((value) => value === score).length / scores.length) * 100) : 0,
          })),
        });
      } else if (question.type === "matrix") {
        const anchors = SETS[question.set];
        blocks.push({
          kind: "means",
          section,
          title: tx(question.label, "es"),
          note: anchors.length ? `1 = ${tx(anchors[0], "es")} · 5 = ${tx(anchors[anchors.length - 1], "es")}` : "1 a 5",
          rows: question.rows.map((row) => {
            const scores = audience.map((person) => Number(recordOf(stored(question, person))?.[row.v])).filter((value) => value >= 1 && value <= 5);
            const mean = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : null;
            return { label: tx(row, "es"), mean };
          }),
        });
      } else if (question.type === "textarea") {
        const rows = audience
          .map((person) => {
            const value = stored(question, person);
            const text = typeof value === "string" ? value.trim() : "";
            return text ? { who: person.empresa, text } : null;
          })
          .filter((row): row is { who: string; text: string } => Boolean(row));
        if (rows.length) blocks.push({ kind: "notes", section, title: tx(question.label, "es"), rows });
      }
    }
  }
  return blocks;
}

export function buildAnalysis(people: ExportPerson[], brief: StoredBrief | null, isolated = 0) {
  const ahp = aggregateAhp(people.map((person) => recordOf(person.answers.prioridades_ahp)).filter((item): item is Record<string, string> => Boolean(item)));
  const generated = when.format(new Date());
  const parameters: [string, string][] = [
    ["Instrumento", SURVEY_TITLE],
    ["Versión", SURVEY_VERSION],
    ["Respuestas incluidas", String(people.length)],
    ["Aisladas de la evaluación", String(isolated)],
    ["Archivo generado", generated],
    ["Etiquetas", "Español, idioma fuente del estudio"],
    ["Método", "AHP jerárquico. Escala de Saaty 1, 3, 5, 7 y 9. Si la preferencia apunta a la derecha, se guarda el recíproco 1/3, 1/5, 1/7 o 1/9."],
    ["Agregación", "Media geométrica de cada comparación entre personas. Después se recalcula el eigenvector."],
    ["Peso global", "Peso de la macroprioridad × peso local dentro de esa macroprioridad."],
    ["Consistencia", "CR = CI/RI. Referencia 0,10 en matrices de 3×3. Las matrices de 2×2 son consistentes por construcción."],
    ["Publicación", "Un corte se publica con al menos 5 respuestas. Este archivo muestra el corte actual, aunque haya menos."],
    ["Alcance", "Solo las respuestas incluidas en el análisis. Las aisladas se conservan en el Excel de respuestas y no entran a este cálculo. No aplica el filtro de país, rol o rubro de la pantalla."],
    ["Relato preliminar", brief ? `Generado el ${when.format(new Date(brief.generatedAt))} con ${brief.responseCount} respuestas.` : "Todavía no se ha generado."],
  ];
  const sample = [
    { title: "País", rows: tally(people.map((person) => formatStored("pais", person.pais)), people.length) },
    { title: "Rol", rows: tally(people.map((person) => formatStored("rol", person.rol)), people.length) },
    { title: "Rubro", rows: tally(people.map((person) => formatStored("rubro", person.rubro)), people.length) },
    { title: "Idioma", rows: tally(people.map((person) => languageName(person.language)), people.length) },
  ];
  const ranking = ahp
    ? Object.entries(ahp.global)
        .sort((left, right) => right[1] - left[1])
        .map(([id, weight]) => ({ label: ahpLabel(id), weight, pct: formatPercent(weight) }))
    : [];
  const macros = ahp
    ? ahp.macro.ids.map((id, index) => ({ label: ahpLabel(id), weight: ahp.macro.weights[index] ?? 0, pct: formatPercent(ahp.macro.weights[index] ?? 0) }))
    : [];
  return {
    generated,
    count: people.length,
    brief,
    parameters,
    sample,
    ahp,
    ranking,
    macros,
    consistency: ahp ? (ahp.maxCr <= 0.1 ? "Adecuada" : "Revisar") : "",
    maxCr: ahp ? ahp.maxCr : null,
    blocks: questionBlocks(people),
  };
}

export function analysisSheets(model: ReturnType<typeof buildAnalysis>) {
  const sheets: { name: string; rows: string[][] }[] = [
    { name: "Parametros", rows: [["Campo", "Valor"], ...model.parameters] },
    {
      name: "Muestra",
      rows: [["Corte", "Categoría", "N", "Porcentaje"], ...model.sample.flatMap((group) => group.rows.map((row) => [group.title, row.label, String(row.count), `${row.pct}%`]))],
    },
  ];

  if (model.ahp) {
    const weightRows = [["Nivel", "Nombre", "Peso", "CR del grupo"]];
    model.macros.forEach((macro) => weightRows.push(["Macroprioridad", macro.label, macro.pct, model.maxCr == null ? "" : model.maxCr.toFixed(3).replace(".", ",")]));
    model.ranking.forEach((item, index) => weightRows.push([`Criterio ${index + 1}`, item.label, item.pct, ""]));
    sheets.push({ name: "AHP pesos", rows: weightRows });

    const matrixRows = [["Matriz", "Fila", "Columna", "Juicio", "CR"]];
    const pushMatrix = (title: string, ids: string[], matrix: number[][], cr: number) => {
      ids.forEach((rowId, row) => {
        ids.forEach((columnId, column) => {
          matrixRows.push([title, ahpLabel(rowId), ahpLabel(columnId), formatRatio(matrix[row][column]), cr.toFixed(3).replace(".", ",")]);
        });
      });
    };
    pushMatrix("Macro", model.ahp.macro.ids, model.ahp.macro.matrix, model.ahp.macro.cr);
    for (const macro of AHP.macros) {
      const group = model.ahp.groups[macro.id];
      if (group) pushMatrix(tx(macro.label, "es"), group.ids, group.matrix, group.cr);
    }
    sheets.push({ name: "AHP matrices", rows: matrixRows });
  }

  const distributions = [["Sección", "Pregunta", "Opción", "N", "Porcentaje", "Nota"]];
  const means = [["Sección", "Pregunta", "Ítem", "Promedio de 5", "Nota"]];
  const notes = [["Sección", "Pregunta", "Empresa", "Respuesta"]];
  for (const block of model.blocks) {
    if (block.kind === "bars") {
      for (const row of block.rows) distributions.push([block.section, block.title, row.label, String(row.count), `${row.pct}%`, block.note]);
    } else if (block.kind === "means") {
      for (const row of block.rows) means.push([block.section, block.title, row.label, row.mean == null ? "" : row.mean.toFixed(2).replace(".", ","), block.note]);
    } else {
      for (const row of block.rows) notes.push([block.section, block.title, row.who, row.text]);
    }
  }
  sheets.push({ name: "Distribuciones", rows: distributions }, { name: "Promedios", rows: means }, { name: "Textos", rows: notes });

  const story = [["Bloque", "Texto"]];
  if (model.brief) {
    story.push(["La muestra, hasta ahora", model.brief.context]);
    for (const theme of model.brief.themes) story.push([theme.title, theme.body]);
  } else {
    story.push(["Relato", "Todavía no se ha generado el análisis preliminar."]);
  }
  sheets.push({ name: "Relato preliminar", rows: story });
  return sheets;
}
