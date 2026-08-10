import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { InviteConfirmClient } from "@/components/shared/InviteConfirmClient";
import { InviteVenueBrands } from "@/components/shared/InviteVenueBrands";
import { Container } from "@/components/ui/Container";
import { verifyInviteConfirmToken } from "@/lib/invite-confirm-token";
import { INVITES } from "@/lib/invites";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string }>;
};

export const metadata: Metadata = {
  title: "Confirmar invitación",
  robots: { index: false, follow: false, nocache: true },
};

export default async function InviteConfirmPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { t } = await searchParams;
  setRequestLocale(locale);

  const token = t?.trim() ?? "";
  const verified = token ? verifyInviteConfirmToken(token) : null;

  if (!verified || !verified.ok) {
    const message =
      verified && !verified.ok && verified.error === "expired_token"
        ? "Este enlace de confirmación expiró."
        : "Este enlace de confirmación no es válido.";

    return (
      <section className="invite-stage page-offset relative overflow-hidden text-white">
        <Container className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg border border-white/15 bg-white/5 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xinergy-orange">
              Invitación Xinergy
            </p>
            <h1 className="mt-3 font-display text-2xl">{message}</h1>
            <p className="mt-3 text-sm text-white/70">
              Si necesitas un nuevo enlace, escribe a tu contacto en Xinergy.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const invite = INVITES.find((item) => item.id === verified.payload.i)!;
  const title = invite.titles.es;
  const description = invite.descriptions.es;

  return (
    <section className="invite-stage page-offset relative overflow-hidden text-white">
      <div className="hero-motion hero-motion--static absolute inset-0" aria-hidden />
      <Container className="relative z-10 px-4 pb-12 pt-4 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xinergy-orange">
              Invitación privada Xinergy
            </p>
            <p className="label-editorial-light mt-3">
              {invite.id === "almuerzo"
                ? "Mesa C-Level · 19 de agosto · 13:00"
                : "19 de agosto 2026 · Hotel W"}
            </p>
            <h1 className="mt-4 font-display text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.08] text-white">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-[0.9875rem] leading-relaxed text-white/80">
              Hola {verified.payload.n.split(" ")[0]},
            </p>
            <p className="mt-2 max-w-xl text-[0.9875rem] leading-relaxed text-white/75">
              {description}
            </p>
            <div className="mt-6">
              <InviteVenueBrands
                caption={invite.id === "almuerzo" ? "El lugar" : "Sede del evento"}
                showKarai={invite.id === "almuerzo"}
              />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-white/45">
              Este enlace es personal para {verified.payload.n} ({verified.payload.e}). No lo
              reenvíes: si otra persona lo usa, quedaría a tu nombre.
            </p>
          </div>

          <div>
            <InviteConfirmClient
              token={token}
              name={verified.payload.n}
              email={verified.payload.e}
              inviteTitle={title}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
