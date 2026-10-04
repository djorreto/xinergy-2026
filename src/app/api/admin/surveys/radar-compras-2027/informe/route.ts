import { SURVEY_SLUG } from "@/lib/surveys/radar-2027";
import { studyResponse } from "@/lib/surveys/study-build";

export const maxDuration = 60;

export async function GET() {
  return studyResponse(SURVEY_SLUG);
}
