import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function uiKeys(lang: "es" | "en" | "pt") {
  const instrument = readFileSync(resolve("src/lib/surveys/radar-c/instrument.ts"), "utf8");
  const start = instrument.indexOf("export const ui = {");
  let depth = 0;
  let end = start;
  for (let i = start; i < instrument.length; i += 1) {
    if (instrument[i] === "{") depth += 1;
    else if (instrument[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const block = instrument.slice(start, end);
  const marker = `\n  ${lang}: {`;
  const at = block.indexOf(marker);
  if (at < 0) throw new Error(`missing ${lang}`);
  let bodyDepth = 0;
  const open = at + marker.length - 1;
  for (let i = open; i < block.length; i += 1) {
    if (block[i] === "{") bodyDepth += 1;
    else if (block[i] === "}") {
      bodyDepth -= 1;
      if (bodyDepth === 0) {
        const body = block.slice(open + 1, i);
        return new Set([...body.matchAll(/^\s{4}([A-Za-z_][A-Za-z0-9_]*)\s*:/gm)].map((match) => match[1]));
      }
    }
  }
  throw new Error(`unclosed ${lang}`);
}

const es = uiKeys("es");
const en = uiKeys("en");
const pt = uiKeys("pt");
const missingEn = [...es].filter((key) => !en.has(key)).sort();
const missingPt = [...es].filter((key) => !pt.has(key)).sort();
console.log({ es: es.size, en: en.size, pt: pt.size, missingEn, missingPt });
if (missingEn.length || missingPt.length) process.exit(1);
console.log("I18N OK");
