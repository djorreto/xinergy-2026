import type { CalculatorInput } from "@/lib/calculator";
import {
  buildCalculatorLeadSummary,
  CALCULATOR_LEAD_SOURCE,
} from "@/lib/calculator-lead-summary";

const CTA_BOARD_ID = "18413857375";
const CTA_GROUP_ID = "topics";

type MondayCreateResponse = { data?: { create_item?: { id: string } }; errors?: { message: string }[] };

async function createCtaItem(name: string, columns: Record<string, unknown>): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const token = process.env.MONDAY_API_TOKEN?.trim();
  if (!token) return { ok: false, error: "monday_not_configured" };

  try {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "API-Version": "2025-04",
      },
      body: JSON.stringify({
        query: `mutation ($board: ID!, $group: String!, $name: String!, $cols: JSON!) {
          create_item(board_id: $board, group_id: $group, item_name: $name, column_values: $cols) { id }
        }`,
        variables: {
          board: CTA_BOARD_ID,
          group: CTA_GROUP_ID,
          name: name.slice(0, 255),
          cols: JSON.stringify(columns),
        },
      }),
    });
    const data = (await response.json()) as MondayCreateResponse;
    const id = data.data?.create_item?.id;
    if (!response.ok || !id) return { ok: false, error: data.errors?.[0]?.message || `http_${response.status}` };
    return { ok: true, id };
  } catch {
    return { ok: false, error: "network_error" };
  }
}

function ctaColumns(payload: { email: string; phone: string; company: string; role: string; message: string }) {
  return {
    email: { email: payload.email, text: payload.email },
    text: payload.phone,
    long_text: { text: payload.message },
    short_textssrguoyr: payload.company,
    short_text51ms18u4: payload.role,
  };
}

/** Tablero CTA Xinergy: Nombre, Correo, Teléfono, Empresa, Cargo, Hablemos. */
export async function submitMondayContactForm(payload: {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  message: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const name = payload.name.trim();
  const email = payload.email.trim();
  return createCtaItem(name, ctaColumns({
    email,
    phone: payload.phone.trim(),
    company: payload.company.trim(),
    role: payload.role.trim(),
    message: payload.message.trim(),
  }));
}

export async function submitMondayCalculatorForm(
  email: string,
  input: CalculatorInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const normalized = email.trim();
  return createCtaItem(CALCULATOR_LEAD_SOURCE, ctaColumns({
    email: normalized,
    phone: "",
    company: "",
    role: "",
    message: buildCalculatorLeadSummary(input, normalized),
  }));
}
