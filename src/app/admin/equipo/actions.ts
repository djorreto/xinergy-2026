"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { translateRoleFromSpanish } from "@/lib/team/translate";
import { createAdminClient } from "@/lib/supabase/admin";

const GROUPS = ["direccion", "counselors", "comercial", "consultoria", "sourcing", "bpo", "corporate"];

export type TeamInput = {
  id?: string;
  name: string;
  groupKey: string;
  roleEs: string;
  roleEn: string;
  rolePt: string;
  objectPosition: string;
  zoom: number;
  grayscale: boolean;
  brightness: number;
  contrast: number;
};

function refreshTeam() {
  for (const locale of ["es", "en", "pt"]) revalidatePath(`/${locale}/nosotros`);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export async function saveTeamMember(input: TeamInput): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  await requireAdminUser();
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "Escribe el nombre." };
  if (!GROUPS.includes(input.groupKey)) return { ok: false, error: "Elige un grupo." };
  const admin = await createAdminClient();
  const row = {
    name,
    group_key: input.groupKey,
    role_es: input.roleEs.trim(),
    role_en: input.roleEn.trim(),
    role_pt: input.rolePt.trim(),
    object_position: input.objectPosition || "50% 20%",
    zoom: clamp(input.zoom, 100, 180),
    grayscale: input.grayscale,
    brightness: clamp(input.brightness, 70, 150),
    contrast: clamp(input.contrast, 70, 150),
  };
  if (input.id) {
    const { error } = await admin.from("web_team_members").update(row).eq("id", input.id);
    if (error) return { ok: false, error: "No se pudo guardar." };
    refreshTeam();
    return { ok: true, id: input.id };
  }
  const { data: last } = await admin.from("web_team_members").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await admin
    .from("web_team_members")
    .insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "No se pudo agregar." };
  refreshTeam();
  return { ok: true, id: data.id };
}

export async function removeTeamMember(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminUser();
  const admin = await createAdminClient();
  const { error } = await admin.from("web_team_members").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo quitar." };
  refreshTeam();
  return { ok: true };
}

export async function moveTeamMember(id: string, direction: "up" | "down"): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminUser();
  const admin = await createAdminClient();
  const { data: rows } = await admin.from("web_team_members").select("id, sort_order").order("sort_order");
  const list = rows ?? [];
  const index = list.findIndex((row) => row.id === id);
  const swap = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swap < 0 || swap >= list.length) return { ok: true };
  const current = list[index];
  const other = list[swap];
  await admin.from("web_team_members").update({ sort_order: other.sort_order }).eq("id", current.id);
  await admin.from("web_team_members").update({ sort_order: current.sort_order }).eq("id", other.id);
  refreshTeam();
  return { ok: true };
}

export async function translateTeamRole(roleEs: string): Promise<{ ok: true; en: string; pt: string } | { ok: false; error: string }> {
  await requireAdminUser();
  try {
    const translated = await translateRoleFromSpanish(roleEs);
    if (!translated.en || !translated.pt) return { ok: false, error: "Groq no devolvió la traducción." };
    return { ok: true, ...translated };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "missing_key") return { ok: false, error: "Falta la clave de Groq para traducir." };
    if (message === "empty_source") return { ok: false, error: "Escribe el cargo en español antes de traducir." };
    return { ok: false, error: "Groq no pudo traducir este cargo." };
  }
}
