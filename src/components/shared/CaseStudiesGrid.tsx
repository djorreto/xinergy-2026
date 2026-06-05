import { cases } from "@/lib/content";
import { CaseStudyCarouselCard } from "@/components/shared/CaseStudyCarouselCard";

export function CaseStudiesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {cases.map((caseStudy, i) => (
        <CaseStudyCarouselCard key={caseStudy.slug} caseStudy={caseStudy} index={i} />
      ))}
    </div>
  );
}
