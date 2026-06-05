"use client";

import { useEffect, useRef, useState } from "react";

const ANIMATION_MIN_WIDTH = 1024;

type MotionVariant = "hero" | "band";

function useHeroAnimationEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia(`(min-width: ${ANIMATION_MIN_WIDTH}px)`);

    const update = () => {
      setEnabled(widthMq.matches && !motionMq.matches);
    };

    update();
    widthMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      widthMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}

/** Banda CTA: animación en móvil también (solo esta sección) */
function useBandAnimationEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!motionMq.matches);
    update();
    motionMq.addEventListener("change", update);
    return () => motionMq.removeEventListener("change", update);
  }, []);

  return enabled;
}

function HeroMotionStatic() {
  return (
    <div className="hero-motion hero-motion--static" aria-hidden>
      <div className="hero-motion__grain" />
    </div>
  );
}

type Blob = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
};

const BLOBS: Blob[] = [
  { x: 0.78, y: 0.18, r: 0.42, vx: 0.00035, vy: 0.00028, color: "252,161,0" },
  { x: 0.12, y: 0.72, r: 0.38, vx: -0.0003, vy: -0.00022, color: "84,82,109" },
  { x: 0.48, y: 0.52, r: 0.32, vx: 0.00022, vy: 0.00032, color: "162,143,109" },
  { x: 0.62, y: 0.78, r: 0.28, vx: -0.00025, vy: 0.00018, color: "252,161,0" },
];

const CYCLE_SEC = 34;
const DRAW_RATIO = 0.88;
const FADE_START = 0.92;
const CHART_POINTS = 96;

/** Eje tiempo normalizado (0–1) */
const X_BASE_END = 0.1;
const X_MARKET1 = 0.2;
const X_MARKET2 = 0.34;
const XINERGY_X = 0.44;

const SPEND_BASE = 0.52;
const SPEND_STRESS = 0.8;
const SPEND_PEAK = 0.92;
const SPEND_LOW = 0.36;

const EBITDA_GOOD = 0.46;
const EBITDA_MID = 0.3;
const EBITDA_LOW = 0.12;
const EBITDA_HIGH = 0.78;

type NarrativeEvent = {
  x: number;
  label: string;
  kind: "bad" | "good" | "xinergy";
  /** Solo para eventos de una banda (xinergy, good) */
  track?: "spend" | "ebitda";
};

const NARRATIVE_EVENTS: NarrativeEvent[] = [
  { x: X_MARKET1, label: "Mercado competitivo", kind: "bad" },
  { x: X_MARKET2, label: "Condiciones geopolíticas", kind: "bad" },
  { x: XINERGY_X, label: "XINERGY", kind: "xinergy", track: "ebitda" },
  { x: 0.68, label: "", kind: "good", track: "ebitda" },
];

/** Avance del trazo de izquierda a derecha (0→1), con pausa y fade al reiniciar */
function drawTimeline(elapsed: number, reducedMotion: boolean) {
  if (reducedMotion) return { reveal: 1, chartFade: 1 };
  const phase = (elapsed % CYCLE_SEC) / CYCLE_SEC;
  if (phase < DRAW_RATIO) {
    return { reveal: smootherstep(0, 1, phase / DRAW_RATIO), chartFade: 1 };
  }
  if (phase < FADE_START) {
    return { reveal: 1, chartFade: 1 };
  }
  const fade = 1 - smootherstep(FADE_START, 1, phase);
  return { reveal: 0, chartFade: fade };
}

/** Recorta curva hasta el avance actual + punta interpolada suave */
function trimToReveal(
  coords: { x: number; y: number }[],
  reveal: number,
): { x: number; y: number }[] {
  if (reveal <= 0) return [];
  if (reveal >= 1) return coords;

  const idxFloat = reveal * (coords.length - 1);
  const idx = Math.floor(idxFloat);
  const frac = idxFloat - idx;
  const visible = coords.slice(0, idx + 1);

  if (frac > 0.001 && idx + 1 < coords.length) {
    const a = coords[idx];
    const b = coords[idx + 1];
    visible.push({
      x: a.x + (b.x - a.x) * frac,
      y: a.y + (b.y - a.y) * frac,
    });
  }
  return visible;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Curva más suave que smoothstep estándar */
function smootherstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function xinergyRecoveryAt(xNorm: number) {
  if (xNorm <= XINERGY_X) return 0;
  return easeInOut(smootherstep(XINERGY_X, 0.96, xNorm));
}

/** Gasto: estable → sube (mercado/geo) → baja con Xinergy */
function spendHeightAt(xNorm: number): number {
  const wobble = xNorm < X_BASE_END ? Math.sin(xNorm * 36) * 0.018 : 0;

  if (xNorm <= X_BASE_END) return SPEND_BASE + wobble;
  if (xNorm <= X_MARKET1 + 0.06) {
    const t = easeInOut((xNorm - X_BASE_END) / (X_MARKET1 + 0.06 - X_BASE_END));
    return SPEND_BASE + (SPEND_STRESS - SPEND_BASE) * t;
  }
  if (xNorm <= XINERGY_X) {
    const t = easeInOut((xNorm - (X_MARKET1 + 0.06)) / (XINERGY_X - (X_MARKET1 + 0.06)));
    return SPEND_STRESS + (SPEND_PEAK - SPEND_STRESS) * t;
  }

  const tail = easeInOut((xNorm - XINERGY_X) / (1 - XINERGY_X));
  return SPEND_PEAK + (SPEND_LOW - SPEND_PEAK) * tail;
}

/** EBITDA: bueno → baja (presión externa) → recupera con Xinergy */
function ebitdaHeightAt(xNorm: number): number {
  if (xNorm <= X_BASE_END) return EBITDA_GOOD;
  if (xNorm <= X_MARKET1 + 0.04) {
    const t = easeInOut((xNorm - X_BASE_END) / (X_MARKET1 + 0.04 - X_BASE_END));
    return EBITDA_GOOD + (EBITDA_MID - EBITDA_GOOD) * t;
  }
  if (xNorm <= XINERGY_X) {
    const t = easeInOut((xNorm - (X_MARKET1 + 0.04)) / (XINERGY_X - (X_MARKET1 + 0.04)));
    return EBITDA_MID + (EBITDA_LOW - EBITDA_MID) * t;
  }

  const tail = easeInOut((xNorm - XINERGY_X) / (1 - XINERGY_X));
  return EBITDA_LOW + (EBITDA_HIGH - EBITDA_LOW) * tail;
}

/** SLA sigue a EBITDA con leve offset (sin retraso post-Xinergy) */
function slaHeightAt(xNorm: number): number {
  const ebitda = ebitdaHeightAt(xNorm);
  const offset = xNorm <= XINERGY_X ? -0.06 : -0.04;
  return clamp(ebitda + offset, 0.1, 0.82);
}

/** Spline cúbico para trazos sin “esquinas” entre muestras */
function strokeSmoothPath(ctx: CanvasRenderingContext2D, coords: { x: number; y: number }[]) {
  const n = coords.length;
  if (n < 2) return;
  if (n === 2) {
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    ctx.lineTo(coords[1].x, coords[1].y);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(coords[0].x, coords[0].y);

  for (let i = 0; i < n - 1; i++) {
    const p0 = coords[Math.max(i - 1, 0)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(i + 2, n - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

function strokeGlowPath(
  ctx: CanvasRenderingContext2D,
  coords: { x: number; y: number }[],
  color: string,
  width: number,
  glow: number,
  dashed?: number[],
) {
  if (coords.length < 2) return;

  ctx.save();
  if (dashed) ctx.setLineDash(dashed);
  strokeSmoothPath(ctx, coords);
  ctx.strokeStyle = color;
  ctx.lineWidth = width + glow * 0.65;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.22;
  ctx.stroke();

  ctx.globalAlpha = 1;
  strokeSmoothPath(ctx, coords);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.restore();
}

function fillUnderCurve(
  ctx: CanvasRenderingContext2D,
  coords: { x: number; y: number }[],
  floorY: number,
  gradient: CanvasGradient,
) {
  if (coords.length < 2) return;
  ctx.beginPath();
  strokeSmoothPath(ctx, coords);
  ctx.lineTo(coords[coords.length - 1].x, floorY);
  ctx.lineTo(coords[0].x, floorY);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
}

/** Destello rojo (impacto negativo) o verde (mejora) */
function drawImpactFlash(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kind: "bad" | "good" | "xinergy",
  intensity: number,
  elapsed: number,
) {
  if (intensity < 0.03) return;

  const pulse = 0.75 + Math.sin(elapsed * 5.5 + x * 0.02) * 0.25;
  const size =
    kind === "xinergy" ? 52 : kind === "bad" ? 46 : 40;
  const r = size * pulse * intensity;

  const core =
    kind === "bad"
      ? "240, 88, 72"
      : kind === "good"
        ? "95, 215, 135"
        : "252, 161, 0";

  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, `rgba(${core}, ${0.5 * intensity})`);
  grad.addColorStop(0.25, `rgba(${core}, ${0.22 * intensity})`);
  grad.addColorStop(0.6, `rgba(${core}, ${0.06 * intensity})`);
  grad.addColorStop(1, `rgba(${core}, 0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  if (kind !== "xinergy") {
    ctx.strokeStyle = `rgba(${core}, ${0.35 * intensity})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function flashIntensity(reveal: number, eventX: number, width = 0.07) {
  const d = reveal - eventX;
  if (d < 0 || d > width * 2.2) return 0;
  if (d < width) return smootherstep(0, width, d);
  return 1 - smootherstep(width, width * 2.2, d);
}

/** Etiqueta: entra suave y queda visible el resto del ciclo */
function labelPersistOpacity(reveal: number, eventX: number) {
  if (reveal < eventX) return 0;
  return smootherstep(eventX, eventX + 0.04, reveal);
}

/** Impacto que atraviesa EBITDA y GASTO: flecha + línea vertical + etiqueta fija */
function drawCrossChartShock(
  ctx: CanvasRenderingContext2D,
  x: number,
  outcomeTop: number,
  spendBot: number,
  ebitdaY: number,
  spendY: number,
  label: string,
  opacity: number,
  strike: number,
  elapsed: number,
  compact = false,
) {
  if (opacity < 0.03 || strike < 0.02) return;

  const yTop = outcomeTop - 18;
  const yBottom = spendBot + 8;
  const yStrike = yTop + (yBottom - yTop) * strike;
  const pulse = 0.82 + Math.sin(elapsed * 4.5 + x * 0.015) * 0.18;
  const lineAlpha = (0.22 + opacity * 0.45) * pulse;

  ctx.save();
  ctx.strokeStyle = `rgba(240, 95, 80, ${lineAlpha})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 6]);
  ctx.beginPath();
  ctx.moveTo(x, yTop);
  ctx.lineTo(x, yStrike);
  ctx.stroke();
  ctx.setLineDash([]);

  if (strike > 0.06) {
    const arrowAlpha = opacity * smootherstep(0.06, 0.18, strike);
    ctx.fillStyle = `rgba(248, 115, 98, ${arrowAlpha * 0.95})`;
    ctx.beginPath();
    ctx.moveTo(x, yTop - 1);
    ctx.lineTo(x - 6, yTop - 13);
    ctx.lineTo(x + 6, yTop - 13);
    ctx.closePath();
    ctx.fill();
  }

  const drawHit = (curveY: number, threshold: number) => {
    if (strike < threshold) return;
    const hitAlpha = opacity * smootherstep(threshold, threshold + 0.12, strike);
    const grad = ctx.createRadialGradient(x, curveY, 0, x, curveY, 14);
    grad.addColorStop(0, `rgba(248, 100, 85, ${hitAlpha * 0.55})`);
    grad.addColorStop(1, "rgba(248, 100, 85, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, curveY, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 160, 145, ${hitAlpha * 0.75})`;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.arc(x, curveY, 4.5, 0, Math.PI * 2);
    ctx.stroke();
  };

  drawHit(ebitdaY, 0.28);
  drawHit(spendY, 0.62);

  if (label && strike > 0.75) {
    const labelY = (ebitdaY + spendY) * 0.5 + (compact ? 4 : 6);
    drawNarrativeLabel(ctx, x, labelY, label, "bad", opacity, compact);
  }

  ctx.restore();
}

function drawXinergyLine(
  ctx: CanvasRenderingContext2D,
  coords: { x: number; y: number }[],
  xinergyIndex: number,
  postXinergyReveal: number,
  yOffset: number,
  reveal: number,
  recoveryAtTip: number,
) {
  if (reveal <= XINERGY_X + 0.04) return;

  const full: { x: number; y: number }[] = [];
  for (let i = xinergyIndex; i < coords.length; i++) {
    full.push({ x: coords[i].x, y: coords[i].y + yOffset });
  }

  const visible = trimToReveal(full, postXinergyReveal);
  if (visible.length < 2) return;

  const opacity = smootherstep(XINERGY_X + 0.06, 0.72, reveal) * recoveryAtTip;
  strokeGlowPath(
    ctx,
    visible,
    `rgba(252, 161, 0, ${0.3 + opacity * 0.58})`,
    2.25,
    11,
    [3, 6],
  );
}

function drawNarrativeLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  kind: NarrativeEvent["kind"],
  opacity: number,
  compact = false,
) {
  if (!label || opacity < 0.08) return;

  const fontSize = compact ? 7.5 : 8;
  ctx.font = `600 ${fontSize}px Helvetica, Arial, sans-serif`;
  const color =
    kind === "bad"
      ? `rgba(248, 140, 125, ${opacity * 0.9})`
      : kind === "xinergy"
        ? `rgba(252, 180, 70, ${opacity * 0.95})`
        : `rgba(130, 230, 165, ${opacity * 0.85})`;
  ctx.fillStyle = color;

  if (compact && label.length > 16) {
    const words = label.split(" ");
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    const w1 = ctx.measureText(line1).width;
    const w2 = ctx.measureText(line2).width;
    ctx.fillText(line1, x - w1 / 2, y - 4);
    ctx.fillText(line2, x - w2 / 2, y + 5);
    return;
  }

  const w = ctx.measureText(label).width;
  ctx.fillText(label, x - w / 2, y);
}

function chartLayout(w: number, h: number, variant: MotionVariant = "hero") {
  const wide = w >= 900;
  const mobile = w < 640;

  if (variant === "band") {
    const amp = h * (mobile ? 0.072 : 0.062);
    const outcomeAmp = h * (mobile ? 0.068 : 0.058);

    if (mobile) {
      const topPad = h * 0.14;
      const bottomPad = h * 0.2;
      const usable = h - topPad - bottomPad;
      const chartAmp = usable * 0.34;
      const chartOutcomeAmp = usable * 0.32;
      const mid = topPad + usable * 0.5;
      return {
        left: w * 0.03,
        right: w * 0.99,
        baseY: mid + chartAmp * 0.5,
        amp: chartAmp,
        outcomeAmp: chartOutcomeAmp,
        outcomeBaseY: mid - chartOutcomeAmp * 0.62,
        compact: true,
      };
    }

    const topPad = h * 0.17;
    const bottomPad = h * 0.26;
    const usable = h - topPad - bottomPad;
    const mid = topPad + usable * 0.5;
    const baseY = mid + amp * 0.95;
    const outcomeBaseY = mid - outcomeAmp * 0.78;
    return {
      left: w * 0.08,
      right: w * 0.94,
      baseY,
      amp,
      outcomeAmp,
      outcomeBaseY,
      compact: false,
    };
  }

  if (mobile) {
    const zoneTop = h * 0.52;
    const zoneH = h * 0.44;
    const amp = zoneH * 0.13;
    const outcomeAmp = zoneH * 0.15;
    const baseY = zoneTop + zoneH * 0.74;
    return {
      left: w * 0.05,
      right: w * 0.95,
      baseY,
      amp,
      outcomeAmp,
      outcomeBaseY: zoneTop + zoneH * 0.26,
      compact: true,
    };
  }

  const amp = h * (wide ? 0.09 : 0.085);
  const outcomeAmp = h * (wide ? 0.092 : 0.088);
  const baseY = wide ? h * 0.57 : h * 0.6;
  const outcomeBaseY = baseY - amp - outcomeAmp * 0.32;
  return {
    left: wide ? w * 0.54 : w * 0.42,
    right: wide ? w * 0.97 : w * 0.94,
    baseY,
    amp,
    outcomeAmp,
    outcomeBaseY,
    compact: false,
  };
}

/** Pistas mínimas: plata arriba (gasto), tiempo a la derecha */
function drawSpendChartChrome(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  baseY: number,
  amp: number,
  outcomeBaseY: number,
  outcomeAmp: number,
  reveal: number,
  compact = false,
  isBand = false,
) {
  const axisX = left - (compact ? 6 : isBand ? 14 : 10);
  const spendTop = baseY - amp;
  const spendBot = baseY + amp * 0.12;
  const outcomeTop = outcomeBaseY - outcomeAmp;
  const fade = 0.55 + xinergyRecoveryAt(reveal) * 0.45;
  const labelSize = compact && isBand ? 10 : compact ? 8 : isBand ? 10 : 9;
  const smallSize = compact && isBand ? 8 : compact ? 7 : isBand ? 8 : 8;

  const zoneGrad = ctx.createRadialGradient(
    (left + right) * 0.5,
    (outcomeTop + spendBot) * 0.5,
    0,
    (left + right) * 0.5,
    (outcomeTop + spendBot) * 0.5,
    (right - left) * 0.55,
  );
  zoneGrad.addColorStop(0, `rgba(252, 161, 0, ${0.04 * fade})`);
  zoneGrad.addColorStop(0.5, `rgba(110, 200, 140, ${0.03 * fade})`);
  zoneGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = zoneGrad;
  ctx.fillRect(left - 20, outcomeTop - 30, right - left + 40, spendBot - outcomeTop + 50);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(axisX, outcomeTop - 8);
  ctx.lineTo(axisX, spendBot);
  ctx.stroke();

  const timeGrad = ctx.createLinearGradient(left, spendBot, right, spendBot);
  timeGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  timeGrad.addColorStop(0.15, "rgba(255, 255, 255, 0.06)");
  timeGrad.addColorStop(1, "rgba(255, 255, 255, 0.1)");
  ctx.strokeStyle = timeGrad;
  ctx.beginPath();
  ctx.moveTo(left, spendBot);
  ctx.lineTo(right, spendBot);
  ctx.stroke();

  ctx.font = `500 ${smallSize}px Helvetica, Arial, sans-serif`;
  ctx.fillStyle = `rgba(255, 255, 255, ${0.22 * fade})`;
  if (!compact) ctx.fillText("↑ $", axisX - 22, spendTop + 4);

  ctx.font = `600 ${labelSize}px Helvetica, Arial, sans-serif`;
  ctx.fillStyle = `rgba(255, 255, 255, ${0.36 * fade})`;
  ctx.fillText("GASTO", left - 4, spendTop - (compact ? 10 : isBand ? 16 : 14));

  if (reveal > 0.02) {
    const ebitdaLabelFade = smootherstep(0.02, 0.1, reveal);
    ctx.font = `600 ${labelSize}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = `rgba(140, 225, 170, ${0.5 * fade * ebitdaLabelFade})`;
    ctx.fillText("EBITDA", left - 2, outcomeTop - (compact ? 8 : isBand ? 14 : 12));
    ctx.fillStyle = `rgba(170, 210, 255, ${0.4 * fade * ebitdaLabelFade})`;
    ctx.fillText("SLA", left + (compact ? 36 : isBand ? 48 : 44), outcomeTop - (compact ? 8 : isBand ? 14 : 12));
  }

  if (!compact) {
    ctx.font = `500 ${smallSize}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.18 * fade})`;
    ctx.fillText("tiempo →", right - 52, spendBot + (isBand ? 20 : 18));
  }
}

/** Narrativa: el trazo avanza en el tiempo (izq → der); la forma ya está en el eje X */
function drawSpendStory(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  elapsed: number,
  reducedMotion: boolean,
  variant: MotionVariant = "hero",
) {
  const { left, right, baseY, amp, outcomeAmp, outcomeBaseY, compact } = chartLayout(w, h, variant);
  const points = CHART_POINTS;
  const { reveal, chartFade } = drawTimeline(elapsed, reducedMotion);

  if (reveal <= 0.01 && chartFade < 0.05) return;

  const coords: { x: number; y: number }[] = [];
  const ebitdaCoords: { x: number; y: number }[] = [];
  const slaCoords: { x: number; y: number }[] = [];

  for (let i = 0; i <= points; i++) {
    const xNorm = i / points;
    const x = left + xNorm * (right - left);
    coords.push({ x, y: baseY - spendHeightAt(xNorm) * amp });
    ebitdaCoords.push({
      x,
      y: outcomeBaseY - ebitdaHeightAt(xNorm) * outcomeAmp,
    });
    slaCoords.push({
      x,
      y: outcomeBaseY - slaHeightAt(xNorm) * outcomeAmp,
    });
  }

  const spendVisible = trimToReveal(coords, reveal);
  if (spendVisible.length < 2) return;

  const recoveryAtTip = xinergyRecoveryAt(reveal);
  const spendFloor = baseY + amp * 0.12;
  const outcomeFloor = outcomeBaseY + outcomeAmp * 0.08;
  const xinergyIndex = Math.floor(XINERGY_X * points);
  const postXinergyReveal = Math.max(0, (reveal - XINERGY_X) / (1 - XINERGY_X));

  const coordAt = (xNorm: number, track: "spend" | "ebitda") => {
    const x = left + xNorm * (right - left);
    if (track === "spend") {
      return { x, y: baseY - spendHeightAt(xNorm) * amp };
    }
    return { x, y: outcomeBaseY - ebitdaHeightAt(xNorm) * outcomeAmp };
  };

  ctx.save();
  ctx.globalAlpha = chartFade;

  drawSpendChartChrome(ctx, left, right, baseY, amp, outcomeBaseY, outcomeAmp, reveal, compact, variant === "band");

  const ebitdaVisible = trimToReveal(ebitdaCoords, reveal);
  const slaVisible = trimToReveal(slaCoords, reveal);
  const trackReveal = smootherstep(0, 0.06, reveal);
  const recoveryBoost = xinergyRecoveryAt(reveal);

  const outcomeAlpha = 0.38 + trackReveal * 0.35 + recoveryBoost * 0.28;

  if (trackReveal > 0.04 && slaVisible.length >= 2) {
    const sFill = ctx.createLinearGradient(left, outcomeBaseY - outcomeAmp, right, outcomeFloor);
    sFill.addColorStop(0, `rgba(140, 185, 245, ${0.03 * trackReveal})`);
    sFill.addColorStop(1, `rgba(140, 185, 245, ${0.05 + recoveryBoost * 0.08})`);
    fillUnderCurve(ctx, slaVisible, outcomeFloor, sFill);

    strokeGlowPath(
      ctx,
      slaVisible,
      `rgba(150, 195, 255, ${outcomeAlpha * 0.85})`,
      1.5,
      9,
      [6, 5],
    );
  }

  if (trackReveal > 0.02 && ebitdaVisible.length >= 2) {
    const eFill = ctx.createLinearGradient(left, outcomeBaseY - outcomeAmp, right, outcomeFloor);
    eFill.addColorStop(0, `rgba(110, 200, 140, ${0.04 * trackReveal})`);
    eFill.addColorStop(1, `rgba(110, 200, 140, ${0.06 + recoveryBoost * 0.1})`);
    fillUnderCurve(ctx, ebitdaVisible, outcomeFloor, eFill);

    strokeGlowPath(
      ctx,
      ebitdaVisible,
      `rgba(125, 215, 155, ${outcomeAlpha})`,
      2,
      12,
    );

    drawXinergyLine(
      ctx,
      ebitdaCoords,
      xinergyIndex,
      postXinergyReveal,
      6,
      reveal,
      recoveryAtTip,
    );
  }

  if (trackReveal > 0.35 && !compact) {
    const sLabel = slaVisible[Math.min(slaVisible.length - 1, Math.floor(slaVisible.length * 0.7))];
    if (sLabel) {
      ctx.font = "600 8px Helvetica, Arial, sans-serif";
      ctx.fillStyle = `rgba(170, 210, 255, ${0.4 + recoveryBoost * 0.4})`;
      ctx.fillText("SLA ↑", sLabel.x - 20, sLabel.y + 14);
    }
  }

  const spendFillGrad = ctx.createLinearGradient(left, baseY - amp, right, spendFloor);
  spendFillGrad.addColorStop(0, "rgba(255,255,255,0.03)");
  spendFillGrad.addColorStop(0.22, "rgba(232, 92, 78, 0.06)");
  spendFillGrad.addColorStop(0.42, "rgba(232, 92, 78, 0.08)");
  spendFillGrad.addColorStop(0.55, `rgba(252, 161, 0, ${0.04 + recoveryAtTip * 0.04})`);
  spendFillGrad.addColorStop(1, `rgba(88, 178, 118, ${0.07 + recoveryAtTip * 0.06})`);
  fillUnderCurve(ctx, spendVisible, spendFloor, spendFillGrad);

  strokeGlowPath(
    ctx,
    spendVisible,
    `rgba(255, 255, 255, ${0.36 + recoveryAtTip * 0.14})`,
    2.25,
    14,
  );

  drawXinergyLine(
    ctx,
    coords,
    xinergyIndex,
    postXinergyReveal,
    7,
    reveal,
    recoveryAtTip,
  );

  for (const event of NARRATIVE_EVENTS) {
    const labelOpacity = labelPersistOpacity(reveal, event.x);
    if (reveal < event.x - 0.02 && labelOpacity < 0.01) continue;

    if (event.kind === "bad") {
      const spendPt = coordAt(event.x, "spend");
      const ebitdaPt = coordAt(event.x, "ebitda");
      const outcomeTop = outcomeBaseY - outcomeAmp;
      drawCrossChartShock(
        ctx,
        spendPt.x,
        outcomeTop,
        spendFloor,
        ebitdaPt.y,
        spendPt.y,
        event.label,
        labelOpacity,
        labelOpacity,
        elapsed,
        compact,
      );
      continue;
    }

    const tracks: Array<"spend" | "ebitda"> =
      event.kind === "xinergy" ? ["ebitda", "spend"] : [event.track ?? "ebitda"];

    for (const track of tracks) {
      const pt = coordAt(event.x, track);
      const flash = flashIntensity(reveal, event.x, event.kind === "xinergy" ? 0.09 : 0.075);

      if (event.kind === "good" || event.kind === "xinergy") {
        drawImpactFlash(ctx, pt.x, pt.y, event.kind, flash, elapsed);
      }

      if (event.label && labelOpacity > 0.01 && track === event.track) {
        const labelY = track === "spend" ? pt.y - 22 : pt.y + 16;
        drawNarrativeLabel(ctx, pt.x, labelY, event.label, event.kind, labelOpacity, compact);
      }
    }
  }

  if (!reducedMotion && reveal > 0.04 && reveal < 0.98) {
    const tip = spendVisible[spendVisible.length - 1];
    const tipKind: "bad" | "good" | "xinergy" =
      reveal < XINERGY_X ? "bad" : reveal < 0.62 ? "xinergy" : "good";
    const pulse = 0.85 + Math.sin(elapsed * 5) * 0.15;
    drawImpactFlash(ctx, tip.x, tip.y, tipKind, 0.55, elapsed);

    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 3, 0, Math.PI * 2);
    ctx.fillStyle =
      tipKind === "bad"
        ? "rgba(255, 180, 170, 0.9)"
        : tipKind === "good"
          ? "rgba(180, 255, 210, 0.9)"
          : "rgba(255, 220, 160, 0.92)";
    ctx.fill();
  }

  ctx.restore();
}

function HeroMotionCanvas({ variant = "hero" }: { variant?: MotionVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef(BLOBS.map((b) => ({ ...b })));
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const variantRef = useRef(variant);
  variantRef.current = variant;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const draw = (time: number) => {
      if (startRef.current === null) startRef.current = time;
      const elapsed = (time - startRef.current) / 1000;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#2e2838");
      base.addColorStop(0.45, "#3f374b");
      base.addColorStop(1, "#352f42");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      const t = elapsed;
      const blobs = blobsRef.current;

      for (const blob of blobs) {
        if (!reducedMotion) {
          blob.x += blob.vx;
          blob.y += blob.vy;
          if (blob.x < 0.05 || blob.x > 0.95) blob.vx *= -1;
          if (blob.y < 0.05 || blob.y > 0.95) blob.vy *= -1;
        }

        const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 0.8 + blob.x * 6) * 0.06;
        const cx = blob.x * w;
        const cy = blob.y * h;
        const radius = blob.r * Math.min(w, h) * pulse;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0, `rgba(${blob.color}, 0.42)`);
        g.addColorStop(0.45, `rgba(${blob.color}, 0.18)`);
        g.addColorStop(1, `rgba(${blob.color}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      const gridStep = 56;
      const offset = reducedMotion ? 0 : (t * 12) % gridStep;
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = -gridStep + offset; x < w + gridStep; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -gridStep + offset; y < h + gridStep; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      drawSpendStory(ctx, w, h, elapsed, reducedMotion, variantRef.current);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`hero-motion${variant === "band" ? " hero-motion--band" : ""}`} aria-hidden>
      <canvas ref={canvasRef} className="hero-motion__canvas" />
      <div className="hero-motion__grain" />
    </div>
  );
}

export function HeroMotion({ variant = "hero" }: { variant?: MotionVariant }) {
  if (variant === "band") {
    return (
      <div className="absolute inset-0">
        <HeroMotionBand />
      </div>
    );
  }

  return (
    <>
      <div className="hero-motion hero-motion--static lg:hidden" aria-hidden />
      <div className="hidden lg:contents">
        <HeroMotionDesktop variant="hero" />
      </div>
    </>
  );
}

function HeroMotionBand() {
  const animationEnabled = useBandAnimationEnabled();
  if (!animationEnabled) {
    return <div className="hero-motion hero-motion--static absolute inset-0" aria-hidden />;
  }
  return <HeroMotionCanvas variant="band" />;
}

function HeroMotionDesktop({ variant = "hero" }: { variant?: MotionVariant }) {
  const animationEnabled = useHeroAnimationEnabled();
  if (!animationEnabled) return <HeroMotionStatic />;
  return <HeroMotionCanvas variant={variant} />;
}
