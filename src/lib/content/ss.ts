export type SsAssessmentPhase = {
  title: string;
  bullets: readonly string[];
};

export type SsModelStep = {
  num: string;
  title: string;
  lane: "demand" | "offer" | "savings";
};

export type SsCaptureTrack = {
  id: string;
  name: string;
  tagline: string;
  focus: string;
  bullets: readonly string[];
  duration: string;
  savings: string;
};

export type SsMethodologyStep = {
  num: string;
  title: string;
  description: string;
  deliverables: readonly string[];
};

export type SsPillar = {
  title: string;
  description: string;
};

export type SsToolCategory = {
  title: string;
  bullets: readonly string[];
};

export type SsContent = {
  assessment: {
    eyebrow: string;
    title: string;
    intro: string;
    phases: readonly SsAssessmentPhase[];
  };
  model: {
    title: string;
    intro: string;
    laneLabels: { demand: string; offer: string; savings: string };
    steps: readonly SsModelStep[];
    benefits: readonly string[];
  };
  capture: {
    title: string;
    intro: string;
    tracks: readonly SsCaptureTrack[];
  };
  methodology: {
    title: string;
    intro: string;
    steps: readonly SsMethodologyStep[];
  };
  successPillars: {
    title: string;
    pillars: readonly SsPillar[];
  };
  tools: {
    title: string;
    intro: string;
    categories: readonly SsToolCategory[];
  };
};

export function getServiceSs(service: object): SsContent | null {
  if (!("ss" in service)) return null;
  const ss = (service as { ss?: SsContent }).ss;
  return ss ?? null;
}
