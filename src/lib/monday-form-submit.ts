import type { CalculatorInput } from "@/lib/calculator";
import {
  buildCalculatorLeadSummary,
  CALCULATOR_LEAD_SOURCE,
} from "@/lib/calculator-lead-summary";

export const MONDAY_FORM_TOKEN = "f9158027a499677bf868b39393bd5019";
export const MONDAY_FORM_REGION = "use1";

const SUBMIT_URL = `https://forms.monday.com/workforms/external/forms/${MONDAY_FORM_TOKEN}/submissions?r=${MONDAY_FORM_REGION}`;
const REFERER = `https://forms.monday.com/forms/embed/${MONDAY_FORM_TOKEN}?r=${MONDAY_FORM_REGION}`;

type MondaySubmitResponse = {
  id?: string;
  type?: string;
  errors?: { questionId?: string; message?: string }[];
};

/** Envía al formulario de Monday vía API pública de WorkForms (sin token). */
export async function submitMondayCalculatorForm(
  email: string,
  input: CalculatorInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const trimmed = email.trim();
  const payload = {
    answers: {
      name: CALCULATOR_LEAD_SOURCE,
      email: trimmed,
      text: CALCULATOR_LEAD_SOURCE,
      short_textssrguoyr: CALCULATOR_LEAD_SOURCE,
      short_text51ms18u4: CALCULATOR_LEAD_SOURCE,
      long_text: buildCalculatorLeadSummary(input, trimmed),
    },
    "form-timezone-offset": 240,
    tags: [] as string[],
  };

  let response: Response;
  try {
    response = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://forms.monday.com",
        Referer: REFERER,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "network_error" };
  }

  let data: MondaySubmitResponse = {};
  try {
    data = (await response.json()) as MondaySubmitResponse;
  } catch {
    return { ok: false, error: `http_${response.status}` };
  }

  if (response.ok && data.id) {
    return { ok: true, id: data.id };
  }

  const message =
    data.errors?.map((e) => e.message).join("; ") ??
    data.type ??
    `http_${response.status}`;
  return { ok: false, error: message };
}
