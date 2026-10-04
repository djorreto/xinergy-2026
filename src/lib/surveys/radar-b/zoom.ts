import { zoomWho, type ZoomSheet } from "@/lib/surveys/chart-zoom";
import type { InitiativeId } from "@/lib/surveys/radar-b/engine";
import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-b/instrument";
import { percent, type PersonReport } from "@/lib/surveys/radar-b/report";

export function peopleZoom(title: string, note: string, people: PersonReport[], line: (person: PersonReport) => string): ZoomSheet {
  return {
    title,
    note,
    sections: [
      {
        heading: people.length === 1 ? "1 respuesta" : `${people.length} respuestas`,
        lines: people.length
          ? people.map((person) => ({ label: zoomWho(person), value: line(person) }))
          : [{ label: "Nadie de este corte entra en este dato.", value: "" }],
      },
    ],
  };
}

export function priorityZoom(name: string, index: number, people: PersonReport[], mean: number | null): ZoomSheet {
  return peopleZoom(
    name,
    `Cada empresa del benchmark aporta su propio peso. El gráfico muestra el promedio: ${percent(mean)}.`,
    people,
    (person) => percent(person.weights?.[index]),
  );
}

export function capabilityZoom(index: number, people: PersonReport[]): ZoomSheet {
  const name = CAPABILITIES[index]?.short.es ?? "Capacidad";
  return peopleZoom(
    name,
    "El nivel es una práctica observada, de 1 a 5. El gráfico usa la mediana de estas empresas. “No sé” no entra en la mediana.",
    people.filter((person) => person.levels[index] != null),
    (person) => `Nivel ${person.levels[index]}`,
  );
}

export function portfolioZoom(initiativeIndex: number, people: PersonReport[], scenarioId: "lean" | "balanced" | "transformational" = "balanced"): ZoomSheet {
  const name = INITIATIVE_COPY[initiativeIndex]?.name.es ?? "Iniciativa";
  const id = INITIATIVE_COPY[initiativeIndex]?.id as InitiativeId | undefined;
  return peopleZoom(
    name,
    `Escenario ${scenarioId}, con la matriz de demostración. Aquí está quién la tiene en el portafolio calculado y quién ya la tiene aprobada.`,
    people,
    (person) => {
      const scenario = person.scenarios.find((item) => item.id === scenarioId);
      const selected = id && scenario?.portfolio?.ids.includes(id) ? "entra en el portafolio" : "no entra";
      const approved = id && person.agenda[id] === "2" ? "aprobada" : "sin aprobación nueva";
      return `${selected} · ${approved}`;
    },
  );
}
