import type { StudyCut } from "@/lib/surveys/radar-b/study-cut";

export type StudyNarrative = { thesis: string; summary: string };

export function fallbackNarrative(cut: StudyCut): StudyNarrative {
  return { thesis: cut.thesis, summary: composeSummary(cut) };
}

export async function writeNarrative(cut: StudyCut): Promise<StudyNarrative> {
  return fallbackNarrative(cut);
}

export function composeSummary(cut: StudyCut): string {
  const lead = (id: string, count: number) => sentences(cut.claims.find((claim) => claim.id === id)?.observation ?? "", count);
  const paragraphs = [
    [cut.thesis, lead("mandato", 2), lead("capacidad", 2)].filter(Boolean).join(" "),
    [lead("digital", 2), lead("agenda", 3)].filter(Boolean).join(" "),
    [lead("escenarios", 2), cut.claims.find((claim) => claim.id === "capacidad")?.implication, cut.claims.find((claim) => claim.id === "agenda")?.implication]
      .filter(Boolean)
      .join(" "),
  ].filter((paragraph) => paragraph.trim());
  return paragraphs.join("\n\n");
}

function sentences(text: string, count: number) {
  const parts = text.match(/[^.]+[.]/g) ?? [];
  return (parts.length ? parts.slice(0, count).join(" ") : text).trim();
}
