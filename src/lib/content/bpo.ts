export type BpoPillar = {
  num: string;
  title: string;
  description: string;
};

export type BpoSpendSegment = {
  id: string;
  name: string;
  spendShare: string;
  txShare: string;
  focus: string;
  bullets: readonly string[];
};

export type BpoOperationModel = {
  id: string;
  name: string;
  tagline: string;
  bullets: readonly string[];
  economics: string;
};

export type BpoContent = {
  vision: {
    eyebrow: string;
    title: string;
    intro: string;
    pillars: readonly BpoPillar[];
    valueEnablersTitle: string;
    valueEnablers: readonly string[];
    automationEnablersTitle: string;
    automationEnablers: readonly string[];
  };
  operatingModel: {
    title: string;
    intro: string;
    layers: readonly { title: string; items: readonly string[] }[];
    technologyNote: string;
  };
  spendSegments: {
    title: string;
    intro: string;
    segments: readonly BpoSpendSegment[];
  };
  operationModels: {
    title: string;
    intro: string;
    models: readonly BpoOperationModel[];
  };
  measurement: {
    title: string;
    intro: string;
    bullets: readonly string[];
  };
  platform: {
    title: string;
    intro: string;
    capabilities: readonly string[];
    flexibilityNote: string;
  };
};

export function getServiceBpo(service: object): BpoContent | null {
  if (!("bpo" in service)) return null;
  const bpo = (service as { bpo?: BpoContent }).bpo;
  return bpo ?? null;
}
