import { insights as enInsights } from "@/lib/content/en";
import { insights as esInsights } from "@/lib/content/es";
import { insights as ptInsights } from "@/lib/content/pt";

export function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug;
}

export function reservedInsightSlugs(): Set<string> {
  return new Set([...esInsights, ...enInsights, ...ptInsights].map((item) => item.slug));
}
