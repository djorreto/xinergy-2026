import type { Locale } from "@/i18n/routing";

export type InviteId = "almuerzo" | "evento";

export type Invite = {
  id: InviteId;
  /** Token opaco en la URL — no adivinable, no indexable. */
  token: string;
  /** Si true, existe página pública de formulario. Almuerzo = solo confirmación por mail. */
  publicForm: boolean;
  mondayFormToken: string;
  mondayRegion: "use1";
  /** Campo Boolean obligatorio de consentimiento en Monday. */
  mondayConsentField: string;
  titles: Record<Locale, string>;
  descriptions: Record<Locale, string>;
};

export const INVITES: Invite[] = [
  {
    id: "almuerzo",
    token: "665f2f6b6a192d080c9417d9b032084a",
    publicForm: false,
    mondayFormToken: "c8b96c687e31df3956b9ba0f1f90d410",
    mondayRegion: "use1",
    mondayConsentField: "booleanj2klu8v4",
    titles: {
      es: "Almuerzo ejecutivo en Karai",
      en: "Executive lunch at Karai",
      pt: "Almoço executivo no Karai",
    },
    descriptions: {
      es: "Almuerzo privado en Karai: una mesa pequeña para conversar, entre pares, sobre IA agéntica y decisiones de negocio.",
      en: "Private lunch at Karai: a small table to talk, among peers, about agentic AI and business decisions.",
      pt: "Almoço privado no Karai: uma mesa pequena para conversar, entre pares, sobre IA agêntica e decisões de negócio.",
    },
  },
  {
    id: "evento",
    token: "212a8166f3f26d77f78528b2a3d6772f",
    publicForm: true,
    mondayFormToken: "2ce543270cd58e7d196512e2da04a0c2",
    mondayRegion: "use1",
    mondayConsentField: "booleankfuxguo4",
    titles: {
      es: "LTC 2026 · Hotel W Santiago",
      en: "LTC 2026 · Hotel W Santiago",
      pt: "LTC 2026 · Hotel W Santiago",
    },
    descriptions: {
      es: "La cumbre presencial de IA agéntica de Latinoamérica. 19 de agosto en el Hotel W, Las Condes.",
      en: "Latin America’s in-person agentic AI summit. August 19 at Hotel W, Las Condes.",
      pt: "A cúpula presencial de IA agêntica da América Latina. 19 de agosto no Hotel W, Las Condes.",
    },
  },
];

const byToken = new Map(INVITES.map((invite) => [invite.token, invite]));

export function getInviteByToken(token: string): Invite | undefined {
  return byToken.get(token);
}

/** Solo invitaciones con formulario web público (hoy: evento LTC). */
export function getPublicFormInviteByToken(token: string): Invite | undefined {
  const invite = byToken.get(token);
  return invite?.publicForm ? invite : undefined;
}

export function getPublicFormInvites(): Invite[] {
  return INVITES.filter((invite) => invite.publicForm);
}

export function getInvitePath(inviteId: InviteId, locale: Locale = "es"): string {
  const invite = INVITES.find((item) => item.id === inviteId);
  if (!invite) throw new Error(`Unknown invite: ${inviteId}`);
  if (!invite.publicForm) {
    throw new Error(`Invite ${inviteId} has no public registration form`);
  }
  return `/${locale}/registro/${invite.token}`;
}
