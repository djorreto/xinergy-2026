import { SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";
import { studyResponse } from "@/lib/surveys/study-build";

export const maxDuration = 60;

export async function GET() {
  return studyResponse(SURVEY_SLUG_B);
}
