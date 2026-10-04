import type { StudyCutA } from "@/lib/surveys/study-a-cut";

export type StudyNarrativeA = { thesis: string; summary: string };

export function fallbackNarrativeA(cut: StudyCutA): StudyNarrativeA {
  return { thesis: cut.thesis, summary: composeSummaryA(cut) };
}

export async function writeNarrativeA(cut: StudyCutA): Promise<StudyNarrativeA> {
  return fallbackNarrativeA(cut);
}

export function composeSummaryA(cut: StudyCutA) {
  const lead = (id: string, count: number) => sentences(cut.claims.find((claim) => claim.id === id)?.observation ?? "", count);
  return [
    [cut.thesis, lead("prioridades", 2)].filter(Boolean).join(" "),
    [lead("valor", 3), lead("continuidad", 2)].filter(Boolean).join(" "),
    [lead("digital", 2), cut.claims.find((claim) => claim.id === "valor")?.implication].filter(Boolean).join(" "),
  ].filter((paragraph) => paragraph.trim()).join("\n\n");
}

function sentences(text: string, count: number) {
  const parts = text.match(/[^.]+[.]/g) ?? [];
  return (parts.length ? parts.slice(0, count).join(" ") : text).trim();
}
