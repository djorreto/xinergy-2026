#!/usr/bin/env node
/**
 * Rebuild team portraits from original PNGs — single pass, clean B/N.
 * Uso: node scripts/rebuild-team-photos.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = "/Users/diegojorreto/.cursor/projects/Users-diegojorreto-Cursor-Projects-Xinergy-2026/assets";
const OUT = path.join(ROOT, "public/team/people");
const TARGET = 480;
const TARGET_MEAN = 172;
const SHADOW_LIFT = 28;
const HIGHLIGHT_GAMMA = 1.06;

/** slug → original asset filename */
const SOURCES = {
  roberto: "Roberto_-_SOCIO-b24b1fe3-f3d9-47b1-aa92-2d119e362227.png",
  "gonzalo-de-la-barra": "Gonzalo_de_la_Barra_-_SOCIO-a5ec46ac-dcde-4a3a-898a-42d5ae627122.png",
  "diego-jorreto": "Diego_Jorreto_Gerente_Comercial__-c3800fb8-a6c0-4e31-9ae7-902b53f1573d.png",
  "ricardo-bartel": "Ricardo_Bartel_-_Director.png",
  sandra: "Sandra_director_comercial-7cc7eba4-0816-49f2-b8e3-af42784f295c.png",
  "esteban-vallejos": "Esteban_Vallejos__Country_Manager_Mexico-3aef99c5-669c-4ede-aafb-83dcfa52abb0.png",
  "javier-pachon": "Javier_Pachon_-_SME_Colombia.png",
  "celso-alberti": "Celso_Alberti__Socio_Director_Brasil__-7bf3fd53-3196-4bb2-8d8d-1413ae58900b.png",
  "christophe-le-flech": "Christophe_Le_Flech___VP_Consulting__-cf1ba240-0a84-45cd-b65d-ad6ef98917d5.png",
  "cecilia-leon": "Cecilia_Leo_n_-_Gerente_de_Consultori_a-1b2ce358-ea48-4b85-8415-202146de4119.png",
  "ricardo-cesario": "Ricardo_Cesario_-_Gerente_de_Consultori_a-fa17aa2a-838d-4d93-bffe-4d539e2c5e9b.png",
  // Prefer true originals (full-bleed) — not rembg/AI cutouts
  "maria-jesus-suarez": "Mari_a_Jesus_Suarez-90276175-a1f6-4fd3-bb66-476c612cbb40.png",
  "pablo-valencia": "Pablo_Valencia_-_VP_STRATEGIC_SOURCING__-be679d29-e61b-438d-aade-84d33ed6fd84.png",
  "ivan-leyton": "Iva_n_Leyton_-_Gerente_Strategic_Sourcing-bdac1b1c-cf01-4611-9b7f-afc0534555cf.png",
  "cristian-ubeda": "Cristian_Ubeda_-_Gerente_Strategic_Sourcing.png",
  "gonzalo-aguirre": "GONZALO_AGUIRREBEN_A__Gerente_de_Cumplimiento_y_Legal__-cfce8562-db10-4349-b1fa-5845ff391e19.png",
  "ignacia-perez": "Ignacia_Perez-7cd6049c-941b-4aef-8298-dfc6614a82d6.png",
  "karin-schuster": "karin_schuster-81d39081-700d-44de-a5b1-c5794c5c9f18.png",
  "pedro-pablo-maurel": "Pedro_Pablo_Maurel_-_Gerente_de_BPO___Managed_services-747f74c3-946b-447c-8a96-6cf799478f07.png",
};

/** Per-person crop + tone (brightness nudges after global lift) */
const PROFILE = {
  roberto: { position: "attention", brightness: 1.02 },
  "gonzalo-de-la-barra": {
    position: "top",
    brightness: 1.04,
    insets: { top: 10, right: 6, bottom: 5, left: 3 },
    shave: 4,
  },
  "diego-jorreto": { position: "attention", brightness: 1 },
  "ricardo-bartel": {
    position: "north",
    brightness: 1.02,
    insets: { left: 64, right: 16, top: 16, bottom: 16 },
  },
  sandra: { position: "attention", brightness: 1.02 },
  "esteban-vallejos": { position: "attention", brightness: 1.06 },
  "javier-pachon": { position: "attention", brightness: 1.05 },
  "celso-alberti": { position: "attention", brightness: 1.03 },
  "christophe-le-flech": { position: "north", brightness: 1.1 },
  "cecilia-leon": { position: "north", brightness: 1.04 },
  "ricardo-cesario": { position: "north", brightness: 1.03 },
  "maria-jesus-suarez": { position: "north", brightness: 1.04 },
  "pablo-valencia": { mode: "pablo", brightness: 1.04 },
  "ivan-leyton": {
    position: "north",
    brightness: 1.02,
    insets: { top: 2, right: 4, bottom: 2, left: 4 },
    shave: 2,
  },
  "cristian-ubeda": { position: "north", brightness: 1.04 },
  "gonzalo-aguirre": { position: "top", brightness: 1.04 },
  // Dark original BG — lift harder; keep full-bleed (no cutout)
  "ignacia-perez": { position: "centre", brightness: 1.18, lift: 48 },
  "karin-schuster": { position: "attention", brightness: 1.08 },
  "pedro-pablo-maurel": {
    position: "attention",
    brightness: 1.05,
    insets: { left: 5, right: 3, top: 3, bottom: 3 },
    shave: 4,
  },
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

async function prepareSource(input, insets = null) {
  let buffer = await sharp(input).rotate().toBuffer();
  try {
    buffer = await sharp(buffer).trim({ threshold: 12 }).toBuffer();
  } catch {
    /* sin bordes uniformes */
  }

  if (insets) {
    const meta = await sharp(buffer).metadata();
    const top = insets.top ?? 0;
    const right = insets.right ?? 0;
    const bottom = insets.bottom ?? 0;
    const left = insets.left ?? 0;
    const width = (meta.width ?? 0) - left - right;
    const height = (meta.height ?? 0) - top - bottom;
    if (width > 24 && height > 24) {
      buffer = await sharp(buffer)
        .extract({ left, top, width, height })
        .toBuffer();
    }
  }

  return buffer;
}

async function shaveEdges(buffer, px) {
  if (px <= 0) return buffer;
  const inner = TARGET - px * 2;
  return sharp(buffer)
    .extract({ left: px, top: px, width: inner, height: inner })
    .resize(TARGET, TARGET, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();
}

async function squareCrop(buffer, position, shave = 0) {
  let out = await sharp(buffer)
    .resize(TARGET, TARGET, {
      fit: "cover",
      position,
      kernel: sharp.kernel.lanczos3,
    })
    .toBuffer();
  return shaveEdges(out, shave);
}

async function pabloCrop(buffer) {
  return sharp(buffer)
    .resize(TARGET, Math.round(TARGET * 1.32), {
      fit: "cover",
      position: "attention",
      kernel: sharp.kernel.lanczos3,
    })
    .extract({ left: 0, top: Math.round(TARGET * 0.05), width: TARGET, height: TARGET })
    .toBuffer();
}

async function processOne(slug, assetFile) {
  const input = path.join(ASSETS, assetFile);
  const output = path.join(OUT, `${slug}.jpg`);
  const profile = PROFILE[slug] ?? { position: "attention", brightness: 1 };

  if (!fs.existsSync(input)) {
    console.warn(`skip ${slug}: missing ${assetFile}`);
    return;
  }

  let buffer = await prepareSource(input, profile.insets);

  if (profile.mode === "pablo") {
    buffer = await pabloCrop(buffer);
  } else {
    buffer = await squareCrop(buffer, profile.position ?? "attention", profile.shave ?? 0);
  }

  buffer = await sharp(buffer)
    .grayscale()
    .linear(1, profile.lift ?? SHADOW_LIFT)
    .toBuffer();

  const mean = (await sharp(buffer).stats()).channels[0].mean;
  const tone = clamp((TARGET_MEAN / mean) * (profile.brightness ?? 1), 0.88, 1.35);

  await sharp(buffer)
    .modulate({ brightness: tone })
    .gamma(HIGHLIGHT_GAMMA)
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(output);

  const outMean = (await sharp(output).stats()).channels[0].mean;
  console.log(`${slug}.jpg  mean ${mean.toFixed(0)} → ${outMean.toFixed(0)}`);
}

fs.mkdirSync(OUT, { recursive: true });

for (const [slug, file] of Object.entries(SOURCES)) {
  await processOne(slug, file);
}
