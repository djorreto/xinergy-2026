import type { Locale } from "@/i18n/routing";
import type { TeamGroup, TeamMember } from "@/lib/content/team-types";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";

const GROUPS: TeamGroup[] = ["direccion", "counselors", "comercial", "consultoria", "sourcing", "bpo", "corporate"];

export type TeamRow = {
  id: string;
  name: string;
  group_key: string;
  image_path: string | null;
  object_position: string;
  zoom: number;
  grayscale: boolean;
  brightness: number;
  contrast: number;
  sort_order: number;
  role_es: string;
  role_en: string;
  role_pt: string;
};

export function teamPhotoUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return "";
  return `${base}/storage/v1/object/public/team-photos/${path}`;
}

function isGroup(value: string): value is TeamGroup {
  return GROUPS.includes(value as TeamGroup);
}

export function toTeamMember(row: TeamRow, locale: Locale): TeamMember {
  const role = locale === "en" ? row.role_en : locale === "pt" ? row.role_pt : row.role_es;
  return {
    name: row.name,
    role: role || row.role_es,
    image: teamPhotoUrl(row.image_path),
    group: isGroup(row.group_key) ? row.group_key : "direccion",
    objectPosition: row.object_position,
    zoom: row.zoom,
    grayscale: row.grayscale,
    brightness: row.brightness,
    contrast: row.contrast,
  };
}

export async function getTeamRows(): Promise<TeamRow[] | null> {
  if (!supabaseConfigured()) return null;
  const admin = await createAdminClient();
  const { data, error } = await admin.from("web_team_members").select("*").order("sort_order");
  if (error || !data?.length) return null;
  return data as TeamRow[];
}
