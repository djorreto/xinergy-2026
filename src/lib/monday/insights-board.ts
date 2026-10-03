import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export const INSIGHTS_BOARD_NAME = "INSIGHTS | DESCARGAS";
const SETTINGS_KEY = "monday_board";

export type MondayBoardConfig = {
  boardId: string;
  columns: {
    email: string;
    domain: string;
    pov: string;
    requested: string;
    validated: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent: string;
    utmTerm: string;
    referrer: string;
    status: string;
    competitor: string;
  };
};

const COLUMN_SPECS: { key: keyof MondayBoardConfig["columns"]; title: string; type: "email" | "text" | "date" }[] = [
  { key: "email", title: "Email", type: "email" },
  { key: "domain", title: "Dominio", type: "text" },
  { key: "pov", title: "Point of View", type: "text" },
  { key: "requested", title: "Fecha solicitud", type: "date" },
  { key: "validated", title: "Fecha validación", type: "date" },
  { key: "utmSource", title: "Fuente", type: "text" },
  { key: "utmMedium", title: "Medio", type: "text" },
  { key: "utmCampaign", title: "Campaña", type: "text" },
  { key: "utmContent", title: "Contenido", type: "text" },
  { key: "utmTerm", title: "Término", type: "text" },
  { key: "referrer", title: "Referrer", type: "text" },
  { key: "status", title: "Estado", type: "text" },
  { key: "competitor", title: "Competidor", type: "text" },
];

type GraphQlResponse<T> = { data?: T; errors?: { message: string }[] };

async function monday<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) throw new Error("Falta MONDAY_API_TOKEN");
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      "API-Version": "2024-10",
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
  });
  const json = (await response.json()) as GraphQlResponse<T>;
  if (!response.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.message || `Monday respondió ${response.status}`);
  }
  if (!json.data) throw new Error("Monday no devolvió datos");
  return json.data;
}

async function workspaceId(): Promise<string> {
  const fromEnv = process.env.MONDAY_WORKSPACE_ID?.trim();
  if (fromEnv) return fromEnv;
  const name = process.env.MONDAY_WORKSPACE_NAME?.trim() || "CRM EQUIPO COMERCIAL";
  const data = await monday<{ workspaces: { id: string; name: string }[] }>(
    `query Workspaces { workspaces(limit: 100) { id name } }`,
  );
  const match = data.workspaces.find((workspace) => workspace.name.trim().toLowerCase() === name.toLowerCase());
  if (!match) throw new Error(`No encontré el workspace ${name}`);
  return match.id;
}

async function findBoard(id: string): Promise<{ id: string; name: string } | null> {
  const data = await monday<{ boards: { id: string; name: string; state: string }[] }>(
    `query BoardsByWorkspace($ids: [ID!]) { boards(workspace_ids: $ids, limit: 200) { id name state } }`,
    { ids: [id] },
  );
  return (
    data.boards.find(
      (board) => board.state !== "deleted" && board.name.trim().toLowerCase() === INSIGHTS_BOARD_NAME.toLowerCase(),
    ) ?? null
  );
}

async function columnMap(boardId: string): Promise<MondayBoardConfig["columns"]> {
  const data = await monday<{ boards: { columns: { id: string; title: string }[] }[] }>(
    `query BoardColumns($ids: [ID!]) { boards(ids: $ids) { columns { id title } } }`,
    { ids: [boardId] },
  );
  const existing = new Map((data.boards[0]?.columns ?? []).map((column) => [column.title.trim().toLowerCase(), column.id]));
  const columns = {} as MondayBoardConfig["columns"];

  for (const spec of COLUMN_SPECS) {
    const found = existing.get(spec.title.toLowerCase());
    if (found) {
      columns[spec.key] = found;
      continue;
    }
    const created = await monday<{ create_column: { id: string } }>(
      `mutation CreateInsightColumn($boardId: ID!, $title: String!, $type: ColumnType!) {
        create_column(board_id: $boardId, title: $title, column_type: $type) { id }
      }`,
      { boardId, title: spec.title, type: spec.type },
    );
    columns[spec.key] = created.create_column.id;
  }

  return columns;
}

export async function ensureInsightsBoard(client?: SupabaseClient): Promise<MondayBoardConfig> {
  const admin = client ?? (await createAdminClient());
  const { data: stored } = await admin.from("web_insight_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
  const cached = stored?.value as MondayBoardConfig | undefined;
  if (cached?.boardId && cached.columns?.email && cached.columns?.competitor) return cached;

  const spaceId = await workspaceId();
  const existing = await findBoard(spaceId);
  let boardId = existing?.id;
  if (!boardId) {
    const created = await monday<{ create_board: { id: string } }>(
      `mutation CreateInsightsBoard($name: String!, $workspaceId: ID!) {
        create_board(board_name: $name, board_kind: public, workspace_id: $workspaceId) { id }
      }`,
      { name: INSIGHTS_BOARD_NAME, workspaceId: spaceId },
    );
    boardId = created.create_board.id;
  }

  const config: MondayBoardConfig = { boardId, columns: await columnMap(boardId) };
  await admin.from("web_insight_settings").upsert({
    key: SETTINGS_KEY,
    value: config,
    updated_at: new Date().toISOString(),
  });
  return config;
}

export type InsightLead = {
  firstName: string;
  lastName: string;
  email: string;
  domain: string;
  pov: string;
  requestedOn: string;
  validatedOn: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
  competitor: boolean;
};

export async function createInsightLead(lead: InsightLead): Promise<string> {
  const admin = await createAdminClient();
  const board = await ensureInsightsBoard(admin);
  const columns = board.columns;
  const columnValues: Record<string, unknown> = {
    [columns.email]: { email: lead.email, text: lead.email },
    [columns.domain]: lead.domain,
    [columns.pov]: lead.pov,
    [columns.requested]: { date: lead.requestedOn },
    [columns.validated]: { date: lead.validatedOn },
    [columns.utmSource]: lead.utmSource ?? "",
    [columns.utmMedium]: lead.utmMedium ?? "",
    [columns.utmCampaign]: lead.utmCampaign ?? "",
    [columns.utmContent]: lead.utmContent ?? "",
    [columns.utmTerm]: lead.utmTerm ?? "",
    [columns.referrer]: lead.referrer ?? "",
    [columns.status]: "Validado",
    [columns.competitor]: lead.competitor ? "Sí" : "No",
  };

  const created = await monday<{ create_item: { id: string } }>(
    `mutation CreateInsightDownload($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) { id }
    }`,
    {
      boardId: board.boardId,
      itemName: `${lead.firstName} ${lead.lastName}`.slice(0, 255),
      columnValues: JSON.stringify(columnValues),
    },
  );
  return created.create_item.id;
}

export async function saveMondayBoardConfig(admin: SupabaseClient, config: MondayBoardConfig) {
  await admin.from("web_insight_settings").upsert({
    key: SETTINGS_KEY,
    value: config,
    updated_at: new Date().toISOString(),
  });
}
