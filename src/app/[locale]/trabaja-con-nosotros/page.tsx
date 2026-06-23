import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { careersPage } = getContent(locale);
  return {
    title: careersPage.title,
    description: careersPage.lead,
  };
}

export default async function TrabajaConNosotrosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { brand, careersPage, cultureValues } = getContent(locale);

  return (
    <>
      <PageHero
        eyebrow={careersPage.eyebrow}
        title={careersPage.title}
        description={careersPage.lead}
      />
      <section className="border-t border-xinergy-charcoal/8 bg-xinergy-ivory py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-16">
            <div className="space-y-6 text-base leading-relaxed text-xinergy-slate">
              <p>{careersPage.socialIntro}</p>

              <a
                href={brand.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl border border-xinergy-charcoal/10 bg-white px-5 py-3.5 text-sm font-semibold text-xinergy-charcoal shadow-sm transition hover:border-xinergy-orange/40 hover:text-xinergy-orange"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.062 2.062 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {careersPage.linkedInLabel}
              </a>

              <p>
                {careersPage.emailIntro}{" "}
                <a
                  href={`mailto:${brand.careersEmail}?subject=Candidatura%20espont%C3%A1nea`}
                  className="font-semibold text-xinergy-orange hover:underline"
                >
                  {brand.careersEmail}
                </a>{" "}
                {careersPage.emailOutro}
              </p>
            </div>

            <div>
              <p className="label-editorial">{careersPage.cultureTitle}</p>
              <div className="mt-5 grid gap-4">
                {cultureValues.map((value) => (
                  <article
                    key={value.title}
                    className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-5 sm:p-6"
                  >
                    <h2 className="brand-phrase text-base text-xinergy-orange sm:text-lg">
                      {value.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-xinergy-slate">
                      {value.summary}
                    </p>
                  </article>
                ))}
              </div>
              <Link
                href="/nosotros"
                className="mt-6 inline-flex text-sm font-semibold text-xinergy-orange hover:underline"
              >
                {careersPage.cultureLink}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
