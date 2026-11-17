import { roleIsProcurementLead } from "../src/lib/surveys/radar-c/content";

type Step = "welcome" | "contact" | "profile" | "ahp" | "role" | "capacity" | "context" | "agenda" | "team" | "close";

function stepsOf(rol: string): Step[] {
  const head: Step[] = ["welcome", "contact", "profile", "ahp"];
  const tail: Step[] = ["capacity", "context", "agenda", "close"];
  if (rol === "ceo" || rol === "cfo") return [...head, "role", ...tail];
  if (roleIsProcurementLead(rol)) return [...head, "capacity", "context", "agenda", "team", "close"];
  return [...head, ...tail];
}

const expected: Record<string, Step[]> = {
  ceo: ["welcome", "contact", "profile", "ahp", "role", "capacity", "context", "agenda", "close"],
  cfo: ["welcome", "contact", "profile", "ahp", "role", "capacity", "context", "agenda", "close"],
  cpo: ["welcome", "contact", "profile", "ahp", "capacity", "context", "agenda", "team", "close"],
  lider_compras: ["welcome", "contact", "profile", "ahp", "capacity", "context", "agenda", "team", "close"],
  scm: ["welcome", "contact", "profile", "ahp", "capacity", "context", "agenda", "close"],
  otro: ["welcome", "contact", "profile", "ahp", "capacity", "context", "agenda", "close"],
};

let failed = 0;
for (const [rol, want] of Object.entries(expected)) {
  const got = stepsOf(rol);
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(ok ? `OK ${rol}` : `FAIL ${rol}`, got.join(" > "));
  if (!ok) failed += 1;
}
process.exit(failed === 0 ? 0 : 1);
