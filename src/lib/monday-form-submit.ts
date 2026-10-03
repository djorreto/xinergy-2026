import type { CalculatorInput } from "@/lib/calculator";
import {
  buildCalculatorLeadSummary,
  CALCULATOR_LEAD_SOURCE,
} from "@/lib/calculator-lead-summary";

export const MONDAY_FORM_TOKEN = "f9158027a499677bf868b39393bd5019";
export const MONDAY_FORM_REGION = "use1";

type MondaySubmitResponse = {
  id?: string;
  type?: string;
  errors?: { questionId?: string; message?: string }[];
};

type MondayAnswers = Record<string, string | boolean>;

async function submitMondayWorkForm(
  formToken: string,
  answers: MondayAnswers,
  region: string = MONDAY_FORM_REGION,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const submitUrl = `https://forms.monday.com/workforms/external/forms/${formToken}/submissions?r=${region}`;
  const referer = `https://forms.monday.com/forms/embed/${formToken}?r=${region}`;

  let response: Response;
  try {
    response = await fetch(submitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://forms.monday.com",
        Referer: referer,
        Accept: "application/json",
      },
      body: JSON.stringify({
        answers,
        "form-timezone-offset": 240,
        tags: [] as string[],
      }),
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

  const errMessage =
    data.errors?.map((e) => e.message).join("; ") ??
    data.type ??
    `http_${response.status}`;
  return { ok: false, error: errMessage };
}

/** IDs del formulario Monday (token f9158027…): name, email, text=Teléfono, short_textssrguoyr=Empresa, short_text51ms18u4=Cargo, long_text=Hablemos */
export async function submitMondayContactForm(payload: {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  message: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  return submitMondayWorkForm(MONDAY_FORM_TOKEN, {
    name: payload.name.trim(),
    email: payload.email.trim(),
    text: payload.phone.trim(),
    short_textssrguoyr: payload.company.trim(),
    short_text51ms18u4: payload.role.trim(),
    long_text: payload.message.trim(),
  });
}

/** Envía al formulario de Monday vía API pública de WorkForms (sin token). */
export async function submitMondayCalculatorForm(
  email: string,
  input: CalculatorInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  return submitMondayWorkForm(MONDAY_FORM_TOKEN, {
    name: CALCULATOR_LEAD_SOURCE,
    email: email.trim(),
    text: "",
    short_textssrguoyr: "",
    short_text51ms18u4: "",
    long_text: buildCalculatorLeadSummary(input, email.trim()),
  });
}
