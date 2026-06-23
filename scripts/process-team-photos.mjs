#!/usr/bin/env node
/** @deprecated Use rebuild-team-photos.mjs — evita reprocesar JPGs ya exportados. */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "rebuild-team-photos.mjs");
const r = spawnSync(process.execPath, [script], { stdio: "inherit" });
process.exit(r.status ?? 1);
