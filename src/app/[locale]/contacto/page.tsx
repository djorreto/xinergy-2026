import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/shared/ContactForm";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";
import { getContactContext } from "@/lib/contact-context";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const context = getContactContext(undefined, locale);
  return {
    title: context.eyebrow,
    description: context.description,
  };
}

export default async function ContactoPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { from } = await searchParams;
  setRequestLocale(locale);
  const { brand, presenceLabel, officesLabel } = getContent(locale);
  const context = getContactContext(from, locale);
  const t = await getTranslations("ui.contact");

  return (
    <>
      <PageHero
        dark
        eyebrow={context.eyebrow}
        title={context.title}
        description={context.description}
      />
      <section className="py-12 sm:py-20">
        <Container>
          <div className="grid gap-10 sm:gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <ContactForm />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-xl font-bold text-xinergy-charcoal">{t("office")}</h2>
              <p className="type-body mt-4 text-xinergy-slate">{brand.address}</p>
              <a
                href={`mailto:${brand.email}`}
                className="mt-4 inline-block text-lg font-semibold text-xinergy-orange hover:underline"
              >
                {brand.email}
              </a>
              <div className="mt-12 rounded-2xl bg-xinergy-charcoal p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-xinergy-orange">
                  {t("commercialModel")}
                </p>
                <p className="type-body mt-4 text-white/75">
                  {t("commercialCopy")}{" "}
                  <span className="font-semibold text-white">{t("cashNeutral")}</span>
                  {": "}
                  {t("cashNeutralDetail")}
                </p>
              </div>
              <p className="type-body mt-8 text-xinergy-slate">
                {t("presence")}: {presenceLabel}
                <br />
                {t("offices")}: {officesLabel}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
