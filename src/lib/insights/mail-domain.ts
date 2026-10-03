import { resolveMx } from "node:dns/promises";
import { isFreemailDomain } from "@/lib/insights/validate";

const cache = new Map<string, { ok: boolean; until: number }>();

export async function domainAcceptsMail(domain: string): Promise<boolean> {
  const name = domain.trim().toLowerCase();
  if (!name.includes(".")) return false;
  if (isFreemailDomain(name)) return true;

  const hit = cache.get(name);
  if (hit && hit.until > Date.now()) return hit.ok;

  const ok = await lookupMx(name);
  cache.set(name, { ok, until: Date.now() + 10 * 60 * 1000 });
  return ok;
}

async function lookupMx(domain: string): Promise<boolean> {
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) => {
        const error = new Error("timeout") as NodeJS.ErrnoException;
        error.code = "ETIMEOUT";
        setTimeout(() => reject(error), 2500);
      }),
    ]);
    return records.some((record) => Boolean(record.exchange));
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "EFORMERR") return false;
    return true;
  }
}
