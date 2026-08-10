import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { InviteEventDetails } from "@/components/shared/InviteEventDetails";
import { InviteRegistrationForm } from "@/components/shared/InviteRegistrationForm";
import { InviteVenueBrands } from "@/components/shared/InviteVenueBrands";
import { Container } from "@/components/ui/Container";
import { routing, type Locale } from "@/i18n/routing";
import { getPublicFormInviteByToken, getPublicFormInvites } from "@/lib/invites";

type Props = {
  params: Promise<{ locale: string; token: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPublicFormInvites().map((invite) => ({ locale, token: invite.token })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, token } = await params;
  const invite = getPublicFormInviteByToken(token);
  if (!invite) {
    return { robots: { index: false, follow: false } };
  }

  const loc = locale as Locale;
  const title = invite.titles[loc] ?? invite.titles.es;
  const description = invite.descriptions[loc] ?? invite.descriptions.es;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  };
}

export default async function RegistroInvitePage({ params }: Props) {
  const { locale, token } = await params;
  const invite = getPublicFormInviteByToken(token);
  if (!invite) notFound();

  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("ui.registro");
  const tInvite = await getTranslations(`ui.registro.invites.${invite.id}`);
  const title = invite.titles[loc] ?? invite.titles.es;
  const description = invite.descriptions[loc] ?? invite.descriptions.es;

  return (
    <section className="invite-stage page-offset relative overflow-hidden text-white">
      <div className="hero-motion hero-motion--static absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 hidden h-72 w-72 rounded-full bg-xinergy-orange/20 blur-3xl sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 hidden h-80 w-80 rounded-full bg-xinergy-orange/10 blur-3xl sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-xinergy-orange/70 to-transparent"
      />

      <Container className="relative z-10 px-4 pb-8 pt-2 sm:px-6 sm:pb-14 sm:pt-4 lg:px-8 lg:pb-20 lg:pt-6">
        {/* Mobile: título → venue → form → detalle. Desktop: 2 columnas. */}
        <div className="grid items-start gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14 xl:gap-16">
          <header className="invite-copy order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xinergy-orange sm:tracking-[0.2em]">
              {t("eyebrow")}
            </p>
            <p className="label-editorial-light mt-3 text-[0.8125rem] sm:mt-4 sm:text-[length:var(--type-label)]">
              {tInvite("kicker")}
            </p>
            <h1 className="mt-3 max-w-xl font-display text-[clamp(1.75rem,6.5vw,var(--type-hero))] leading-[1.08] tracking-tight text-white sm:mt-4">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-[0.9875rem] leading-relaxed text-white/75 sm:mt-5 sm:text-[length:var(--type-lead)] sm:leading-[1.55] sm:text-white/70">
              {description}
            </p>

            <div className="mt-5 sm:mt-6 lg:hidden">
              <InviteVenueBrands
                caption={tInvite("venueCaption")}
                showKarai={invite.id === "almuerzo"}
              />
            </div>
          </header>

          <div className="invite-form-col order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-8">
            <div id="registro-form" className="scroll-mt-24">
              <InviteRegistrationForm token={invite.token} inviteId={invite.id} />
            </div>
            <p className="mt-3 px-1 text-center text-[11px] leading-snug text-white/45 sm:mt-4 sm:text-xs sm:text-white/40">
              {t("privateNote")}
            </p>
          </div>

          <div className="invite-copy order-3 space-y-5 sm:space-y-8 lg:col-start-1 lg:row-start-2">
            <div className="hidden lg:block">
              <InviteVenueBrands
                caption={tInvite("venueCaption")}
                showKarai={invite.id === "almuerzo"}
              />
            </div>
            <InviteEventDetails inviteId={invite.id} />
          </div>
        </div>
      </Container>
    </section>
  );
}
