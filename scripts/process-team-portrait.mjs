#!/usr/bin/env node
/**
 * Procesa un retrato: recorta bordes, encuadre cuadrado, B/N, nitidez.
 * Uso: node scripts/process-team-portrait.mjs <input> <output> [opciones JSON]
 */
import fs from "fs";
import sharp from "sharp";

const [input, output, optionsJson = "{}"] = process.argv.slice(2);
if (!input || !output) {
  console.error("Uso: node scripts/process-team-portrait.mjs <input> <output> [options]");
  process.exit(1);
}

const options = JSON.parse(optionsJson);
const {
  position = "attention",
  brightness = 1,
  headroom = false,
  trim = true,
  grayscale = true,
} = options;

const TARGET = 480;

let buffer = await sharp(input).rotate().toBuffer();

if (trim) {
  try {
    buffer = await sharp(buffer).trim({ threshold: 24 }).toBuffer();
  } catch {
    // sin bordes uniformes para recortar
  }
}

const trimmedMeta = await sharp(buffer).metadata();
if ((trimmedMeta.width ?? 0) > 6 && (trimmedMeta.height ?? 0) > 6) {
  buffer = await sharp(buffer)
    .extract({
      left: 1,
      top: 1,
      width: (trimmedMeta.width ?? 0) - 2,
      height: (trimmedMeta.height ?? 0) - 2,
    })
    .toBuffer();
}

let pipeline = sharp(buffer);

if (headroom) {
  pipeline = pipeline
    .resize(TARGET, Math.round(TARGET * 1.12), { fit: "cover", position })
    .extract({ left: 0, top: 0, width: TARGET, height: TARGET });
} else {
  pipeline = pipeline.resize(TARGET, TARGET, {
    fit: "cover",
    position,
    kernel: sharp.kernel.lanczos3,
  });
}

if (grayscale) {
  pipeline = pipeline.grayscale();
}

if (brightness !== 1) {
  pipeline = pipeline.modulate({ brightness });
}

await pipeline
  .sharpen({ sigma: 0.55, m1: 0.5, m2: 0.35 })
  .jpeg({ quality: 91, mozjpeg: true })
  .toFile(output);

const meta = await sharp(output).metadata();
const stats = await sharp(output).stats();
console.log(
  `${pathLabel(input)} → ${pathLabel(output)} (${meta.width}x${meta.height}, mean ${stats.channels[0].mean.toFixed(0)})`,
);

function pathLabel(p) {
  return p.split("/").pop();
}
