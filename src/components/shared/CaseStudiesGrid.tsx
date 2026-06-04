import { cases } from "@/lib/content";
import { CaseStudyCard } from "@/components/shared/CaseStudyCard";

export function CaseStudiesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseStudy) => (
        <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} variant="carousel" />
      ))}
    </div>
  );
}
