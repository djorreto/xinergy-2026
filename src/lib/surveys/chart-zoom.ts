import { aggregateAhp, ahpLabel, ahpTokenValue, analyzeAhp, formatPercent, formatRatio } from "@/lib/surveys/ahp";
import { AHP, AHP_SCALE, EMP, SETS, tx, type Question } from "@/lib/surveys/radar-2027";

export type ZoomPerson = {
  id: string;
  nombre: string;
  apellido: string;
  empresa: string;
  pais: string;
  rol: string;
  rubro: string;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
};

export type ZoomLine = { label: string; value: string };
export type ZoomSection = { heading: string; lines: ZoomLine[] };
export type ZoomSheet = { title: string; note: string; sections: ZoomSection[] };

export function zoomWho(person: { empresa: string; nombre: string; apellido: string }) {
  return `${person.empresa.trim()} - ${person.nombre.trim()} ${person.apellido.trim()}`.replace(/\s+/g, " ").trim();
}

function recordOf(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, string>;
}

function stored(question: Question, person: ZoomPerson) {
  return EMP.some((item) => item.id === question.id) ? person.company[question.id] : person.answers[question.id];
}

export function distributionZoom(title: string, note: string, people: ZoomPerson[], labelOf: (person: ZoomPerson) => string | string[], focus?: string | null): ZoomSheet {
  const groups = new Map<string, ZoomPerson[]>();
  for (const person of people) {
    const labels = labelOf(person);
    for (const label of Array.isArray(labels) ? labels : [labels]) {
      if (!label || label === "—") continue;
      const bucket = groups.get(label) ?? [];
      bucket.push(person);
      groups.set(label, bucket);
    }
  }
  const ordered = [...groups.entries()].sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0], "es"));
  const shown = focus ? ordered.filter(([label]) => label === focus) : ordered;
  const sections = shown.length
    ? shown.map(([label, members]) => ({
        heading: `${label} · ${members.length} · ${people.length ? Math.round((members.length / people.length) * 100) : 0}%`,
        lines: members.map((person) => ({ label: zoomWho(person), value: "" })),
      }))
    : [{ heading: focus ? `${focus} · 0` : "Sin respuestas", lines: [{ label: "Nadie de este corte entra en este dato.", value: "" }] }];
  return {
    title: focus ? `${title}: ${focus}` : title,
    note,
    sections,
  };
}

export function questionZoom(question: Question, people: ZoomPerson[], focus?: string | null): ZoomSheet {
  const title = tx(question.label, "es");
  if (question.type === "textarea" || question.type === "text") {
    const notes = people
      .map((person) => {
        const value = stored(question, person);
        const text = typeof value === "string" ? value.trim() : "";
        return text ? { label: zoomWho(person), value: text } : null;
      })
      .filter((line): line is ZoomLine => Boolean(line));
    return { title, note: "Textos de las respuestas incluidas en este corte.", sections: [{ heading: `${notes.length} ${notes.length === 1 ? "texto" : "textos"}`, lines: notes }] };
  }
  if (question.type === "scale") {
    const anchors = question.anchors ?? (question.set ? SETS[question.set] : []);
    const rows = people
      .map((person) => {
        const score = Number(stored(question, person));
        if (score < 1 || score > 5) return null;
        const phrase = anchors[score - 1];
        return { person, score, phrase: phrase ? tx(phrase, "es") : "" };
      })
      .filter((row): row is { person: ZoomPerson; score: number; phrase: string } => Boolean(row));
    const shown = focus ? rows.filter((row) => String(row.score) === focus) : rows;
    const mean = rows.length ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length : 0;
    return {
      title: focus ? `${title}: ${focus}` : title,
      note: `El gráfico promedia las respuestas de 1 a 5. El promedio de este corte es ${mean.toFixed(2).replace(".", ",")}.`,
      sections: [
        {
          heading: focus ? `Quienes marcaron ${focus}` : "Cada respuesta",
          lines: shown.length ? shown.map((row) => ({ label: zoomWho(row.person), value: `${row.score}. ${row.phrase}` })) : [{ label: "Nadie marcó este puntaje.", value: "" }],
        },
      ],
    };
  }
  if (question.type === "matrix") {
    const row = focus ? question.rows.find((item) => tx(item, "es") === focus) : null;
    const rows = row ? [row] : question.rows;
    return {
      title: focus ? `${title}: ${focus}` : title,
      note: "Cada afirmación se lee de 1 a 5. El gráfico muestra el promedio de las respuestas incluidas.",
      sections: rows.map((item) => {
        const lines = people
          .map((person) => {
            const score = Number(recordOf(stored(question, person))?.[item.v]);
            if (score < 1 || score > 5) return null;
            const phrase = SETS[question.set][score - 1];
            return { label: zoomWho(person), value: `${score}. ${phrase ? tx(phrase, "es") : ""}` };
          })
          .filter((line): line is ZoomLine => Boolean(line));
        const mean = lines.length ? lines.reduce((sum, line) => sum + Number(line.value.slice(0, 1)), 0) / lines.length : 0;
        return { heading: `${tx(item, "es")} · promedio ${mean.toFixed(2).replace(".", ",")}`, lines };
      }),
    };
  }
  if (question.type === "multi") {
    return distributionZoom(title, "Una persona puede aparecer en más de una barra. El porcentaje es sobre las respuestas de este corte.", people, (person) => {
      const value = stored(question, person);
      if (!Array.isArray(value)) return [];
      return value.filter((item): item is string => typeof item === "string").map((item) => {
        const option = question.options.find((choice) => choice.v === item);
        return option ? tx(option, "es") : item;
      });
    }, focus);
  }
  if (question.type === "single" || question.type === "select") {
    return distributionZoom(title, "Cada barra junta a quienes eligieron esa opción.", people, (person) => {
      const value = stored(question, person);
      if (typeof value !== "string" || !value) return "";
      const option = question.options.find((choice) => choice.v === value);
      return option ? tx(option, "es") : value;
    }, focus);
  }
  return { title, note: "Este bloque no tiene un cálculo aparte de las respuestas.", sections: [] };
}

function judgment(token: string, left: string, right: string) {
  const point = AHP_SCALE.find((item) => item.token === token);
  if (!point || token === "1") return "Igual importancia (1)";
  const strength = point.es.replace(" izquierda", "").replace(" derecha", "");
  return `${strength} hacia ${token.includes("/") ? right : left} (${token})`;
}

function meanLabel(tokens: string[]) {
  const numbers = tokens.map((token) => ahpTokenValue(token)).filter((value): value is number => value != null && value > 0);
  if (!numbers.length) return "—";
  const mean = Math.exp(numbers.reduce((sum, value) => sum + Math.log(value), 0) / numbers.length);
  const exact = Object.keys({ "9": 9, "7": 7, "5": 5, "3": 3, "1": 1, "1/3": 1 / 3, "1/5": 1 / 5, "1/7": 1 / 7, "1/9": 1 / 9 }).find((token) => {
    const value = ahpTokenValue(token);
    return value != null && Math.abs(value - mean) < 1e-6;
  });
  return exact ?? formatRatio(mean).replace(".", ",");
}

export function ahpZoom(people: ZoomPerson[], focus?: string | null): ZoomSheet {
  const ready = people.flatMap((person) => {
    const tokens = recordOf(person.answers.prioridades_ahp);
    const analysis = analyzeAhp(tokens);
    return tokens && analysis ? [{ person, tokens, analysis }] : [];
  });
  const aggregate = aggregateAhp(ready.map((item) => item.tokens));
  const focusLabel = focus ? ahpLabel(focus) : "";
  const macro = focus ? AHP.macros.find((item) => item.id === focus || item.children.includes(focus)) : null;
  const pairs = AHP.pairs.filter((pair) => {
    if (!focus) return true;
    if (AHP.macros.some((item) => item.id === focus)) return pair.group === "macro" || pair.group === focus;
    return pair.group === "macro" || pair.a === focus || pair.b === focus || (macro ? pair.group === macro.id : false);
  });
  const weight = aggregate && focus && aggregate.global[focus] != null ? aggregate.global[focus] : null;
  const familyWeight = aggregate && macro ? aggregate.macro.weights[AHP.macros.findIndex((item) => item.id === macro.id)] ?? 0 : null;
  const local = weight != null && familyWeight ? weight / familyWeight : null;
  const sections: ZoomSection[] = [
    {
      heading: ready.length === 1 ? "La respuesta que entra" : `${ready.length} respuestas que entran`,
      lines: ready.map((item) => {
        const own = focus ? item.analysis.global[focus] : null;
        return {
          label: zoomWho(item.person),
          value: own != null ? `Si se mira sola, este criterio pesa ${formatPercent(own)}` : "Priorización completa",
        };
      }),
    },
  ];
  if (people.length > ready.length) {
    sections.push({
      heading: "Fuera del cálculo",
      lines: [{ label: `${people.length - ready.length} ${people.length - ready.length === 1 ? "respuesta no tiene" : "respuestas no tienen"} la priorización completa.`, value: "" }],
    });
  }
  if (weight != null && macro && familyWeight != null && local != null) {
    sections.push({
      heading: "Cómo sale el peso",
      lines: [
        { label: `Familia ${tx(macro.label, "es")}`, value: formatPercent(familyWeight) },
        { label: `Dentro de la familia, ${focusLabel}`, value: formatPercent(local) },
        { label: "Peso global", value: `${formatPercent(familyWeight)} × ${formatPercent(local)} = ${formatPercent(weight)}` },
      ],
    });
  } else if (aggregate && focus && AHP.macros.some((item) => item.id === focus)) {
    const index = AHP.macros.findIndex((item) => item.id === focus);
    sections.push({
      heading: "Cómo sale el peso de la familia",
      lines: [{ label: focusLabel, value: formatPercent(aggregate.macro.weights[index] ?? 0) }, { label: "Método", value: "Media geométrica de las comparaciones entre las tres familias, y después el eigenvector." }],
    });
  }
  sections.push(
    ...pairs.map((pair) => {
      const left = ahpLabel(pair.a);
      const right = ahpLabel(pair.b);
      const tokens = ready.map((item) => String(item.tokens[pair.id] ?? "")).filter(Boolean);
      return {
        heading: `${left} frente a ${right}`,
        lines: [
          ...ready.map((item) => ({ label: zoomWho(item.person), value: judgment(String(item.tokens[pair.id] ?? ""), left, right) })),
          { label: ready.length > 1 ? "Media geométrica" : "Valor que entra a la matriz", value: meanLabel(tokens) },
        ],
      };
    }),
  );
  if (aggregate && !focus) {
    const ranking = Object.entries(aggregate.global).sort((left, right) => right[1] - left[1]);
    sections.push({
      heading: "Pesos que salen",
      lines: ranking.map(([id, value], index) => ({ label: `${index + 1}. ${ahpLabel(id)}`, value: formatPercent(value) })),
    });
  }
  const skipped = people.length - ready.length;
  return {
    title: focusLabel ? `Cómo se compuso: ${focusLabel}` : "Cómo se compuso la priorización",
    note: ready.length > 1
      ? "No se promedian los porcentajes. Se promedia cada comparación con la media geométrica y después se recalcula el peso. El peso global es el de la familia por el peso dentro de esa familia."
      : "Con una respuesta, cada comparación entra directa a la matriz. El peso global es el de la familia por el peso dentro de esa familia." + (skipped ? "" : ""),
    sections,
  };
}
