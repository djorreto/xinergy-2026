export type WcsPlatformStep = {
  id: string;
  title: string;
  subtitle: string;
};

export type WcsPillar = {
  num: string;
  title: string;
  partner?: string;
  bullets: readonly string[];
};

export type WcsDifferentiator = {
  title: string;
  description: string;
};

export type WcsContent = {
  platform: {
    eyebrow: string;
    title: string;
    intro: string;
    tourHintAuto: string;
    tourHintLocked: string;
  };
  platformSteps: readonly WcsPlatformStep[];
  pillarsTitle: string;
  pillarsIntro: string;
  pillars: readonly WcsPillar[];
  differentiatorsTitle: string;
  differentiators: readonly WcsDifferentiator[];
  partnersTitle: string;
  partnerNames: readonly string[];
};

export function getServiceWcs(service: object): WcsContent | null {
  if (!("wcs" in service)) return null;
  const wcs = (service as { wcs?: WcsContent }).wcs;
  return wcs ?? null;
}
