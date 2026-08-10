import { getTranslations } from "next-intl/server";
import { InvitePartnerLogos } from "@/components/shared/InvitePartnerLogos";
import type { InviteId } from "@/lib/invites";

type Props = {
  inviteId: InviteId;
};

export async function InviteEventDetails({ inviteId }: Props) {
  const t = await getTranslations(`ui.registro.invites.${inviteId}`);

  if (inviteId === "evento") {
    const learnings = t.raw("learnings") as string[];
    const schedule = t.raw("schedule") as { zone: string; time: string }[];
    const facts = t.raw("facts") as { label: string; value: string }[];

    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="rounded-sm border border-xinergy-orange/35 bg-xinergy-orange/10 px-4 py-4 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xinergy-orange">
            {t("whatIsLabel")}
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/90 sm:text-base sm:text-white/85">
            {t("whatIs")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border border-white/10 bg-white/[0.04] px-2.5 py-3 sm:px-4"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-xinergy-orange sm:text-[10px] sm:tracking-[0.16em]">
                {fact.label}
              </p>
              <p className="mt-1.5 text-[0.8125rem] font-semibold leading-snug text-white sm:text-sm">
                {fact.value}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[0.9375rem] leading-relaxed text-white/75 sm:text-base sm:text-white/70">
          {t("intro")}
        </p>

        <div>
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white sm:text-xs sm:tracking-[0.18em]">
            {t("learningsTitle")}
          </h2>
          <ul className="mt-3 space-y-3 sm:mt-4">
            {learnings.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[0.9375rem] leading-relaxed text-white/75 sm:text-sm sm:text-white/70"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white sm:text-xs sm:tracking-[0.18em]">
            {t("scheduleTitle")}
          </h2>
          <ul className="mt-3 space-y-0 sm:mt-4">
            {schedule.map((row) => (
              <li
                key={row.zone}
                className="flex items-center justify-between gap-3 border-b border-white/10 py-3.5 text-[0.9375rem] sm:text-sm"
              >
                <span className="min-w-0 leading-snug text-white/70">{row.zone}</span>
                <span className="shrink-0 font-semibold tabular-nums text-xinergy-orange">
                  {row.time}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.75rem] leading-snug text-white/50 sm:text-xs sm:text-white/45">
            {t("dateNote")}
          </p>
        </div>

        <p className="border border-xinergy-orange/25 bg-gradient-to-r from-xinergy-orange/15 to-transparent px-4 py-4 text-[0.9375rem] leading-relaxed text-white/90 sm:text-sm sm:text-white/85">
          {t("accessNote")}
        </p>

        <InvitePartnerLogos caption={t("organizersCaption")} />
        <p className="pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[0.75rem] leading-relaxed text-white/45 sm:text-xs sm:text-white/40">
          {t("partnerNote")}
        </p>
      </div>
    );
  }

  const highlights = t.raw("highlights") as string[];
  const facts = t.raw("facts") as { label: string; value: string }[];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-sm border border-xinergy-orange/35 bg-xinergy-orange/10 px-4 py-4 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xinergy-orange">
          {t("whatIsLabel")}
        </p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/90 sm:text-base sm:text-white/85">
          {t("whatIs")}
        </p>
      </div>

      <p className="text-[0.9375rem] leading-relaxed text-white/75 sm:text-base sm:text-white/70">
        {t("intro")}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border border-white/10 bg-white/[0.04] px-3 py-3.5 sm:px-4 sm:py-4"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-xinergy-orange sm:text-[10px] sm:tracking-[0.16em]">
              {fact.label}
            </p>
            <p className="mt-1.5 font-display text-[1.05rem] leading-snug text-white sm:mt-2 sm:text-lg xl:text-xl">
              {fact.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white sm:text-xs sm:tracking-[0.18em]">
          {t("highlightsTitle")}
        </h2>
        <ul className="mt-3 space-y-3 sm:mt-4">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[0.9375rem] leading-relaxed text-white/75 sm:text-sm sm:text-white/70"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="border border-xinergy-orange/25 bg-gradient-to-r from-xinergy-orange/15 to-transparent px-4 py-4 text-[0.9375rem] leading-relaxed text-white/90 sm:text-sm sm:text-white/85">
        {t("contextNote")}
      </p>

      <InvitePartnerLogos caption={t("organizersCaption")} />
      <p className="pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[0.75rem] leading-relaxed text-white/45 sm:text-xs sm:text-white/40">
        {t("partnerNote")}
      </p>
    </div>
  );
}
