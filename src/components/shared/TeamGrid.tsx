import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { TeamGroup, TeamMember } from "@/lib/content/team-types";

type TeamGridProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  members: readonly TeamMember[];
  groupLabels: Record<TeamGroup, string>;
};

export function TeamGrid({
  eyebrow,
  title,
  lead,
  members,
  groupLabels,
}: TeamGridProps) {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="label-editorial">{eyebrow}</p>
          <h2 className="font-display mt-3 text-[length:var(--type-section)] text-xinergy-charcoal">
            {title}
          </h2>
          {lead ? (
            <p className="type-body mt-4 max-w-xl text-xinergy-slate">{lead}</p>
          ) : null}
        </div>

        <ul className="team-grid mt-10 flex flex-wrap justify-center gap-x-3 gap-y-8 sm:gap-x-4 lg:gap-x-5 lg:gap-y-9">
          {members.map((member) => (
            <li
              key={member.name}
              className="team-grid-item flex flex-col items-center text-center"
            >
              <div className="team-photo-frame aspect-square w-[7.25rem] overflow-hidden rounded-xl border border-xinergy-charcoal/10 bg-[#f5f2ed] sm:w-[8rem] sm:rounded-2xl">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={320}
                  height={320}
                  unoptimized
                  sizes="(max-width: 640px) 28vw, (max-width: 1024px) 18vw, 128px"
                  className="team-photo h-full w-full object-cover"
                  style={{ objectPosition: member.objectPosition ?? "center 22%" }}
                />
              </div>
              <p className="team-group-tag mt-2.5">
                {groupLabels[member.group]}
              </p>
              <p className="mt-1 w-full text-[0.8125rem] font-semibold leading-tight text-xinergy-charcoal sm:text-sm">
                {member.name}
              </p>
              <p className="mt-1 w-full text-[0.6875rem] leading-snug text-xinergy-slate [text-wrap:balance] sm:text-xs">
                {member.role}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
