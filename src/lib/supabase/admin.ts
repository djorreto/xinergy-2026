import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SERVER_EMAIL = "insights-server@xinergy.lat";

let cached: { client: SupabaseClient; expiresAt: number } | null = null;

export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.INSIGHTS_SERVER_PASSWORD,
  );
}

export async function createAdminClient(): Promise<SupabaseClient> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const password = process.env.INSIGHTS_SERVER_PASSWORD;
  const email = process.env.INSIGHTS_SERVER_EMAIL?.trim() || DEFAULT_SERVER_EMAIL;
  if (!url || !key || !password) {
    throw new Error("Falta configurar Supabase");
  }

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    throw new Error("No se pudo abrir el proyecto de xinergy.lat");
  }

  cached = { client, expiresAt: (data.session.expires_at ?? 0) * 1000 };
  return client;
}
