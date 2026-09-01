"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type SceneMode = "idle" | "party" | "hush" | "drop";

export type AnniversarySceneHandle = {
  setMode: (mode: SceneMode) => void;
  burst: (count?: number) => void;
};

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  life: number;
  decay: number;
  color: string;
  kind: "dot" | "confetti";
};

const COLORS = ["#fca100", "#ffd080", "#ffffff", "#f4f1ec", "#d88900", "#ffb84d"];

function piece(kind: Piece["kind"], x: number, y: number, explode: boolean): Piece {
  const angle = Math.random() * Math.PI * 2;
  const speed = explode ? 0.006 + Math.random() * 0.028 : 0.001 + Math.random() * 0.004;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed * (explode ? 1 : 0.35) + (explode ? 0 : (Math.random() - 0.5) * 0.002),
    vy: explode ? Math.sin(angle) * speed : 0.002 + Math.random() * 0.006,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
    w: kind === "confetti" ? 3 + Math.random() * 7 : 1 + Math.random() * 2,
    h: kind === "confetti" ? 1.2 + Math.random() * 3 : 1 + Math.random() * 2,
    life: 1,
    decay: explode ? 0.008 + Math.random() * 0.01 : 0.002 + Math.random() * 0.004,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    kind,
  };
}

export const AnniversaryScene = forwardRef<AnniversarySceneHandle>(function AnniversaryScene(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<SceneMode>("idle");
  const api = useRef<{ burst: (n?: number) => void } | null>(null);

  useImperativeHandle(ref, () => ({
    setMode: (mode) => {
      modeRef.current = mode;
    },
    burst: (count) => api.current?.burst(count),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bits: Piece[] = [];
    let pointer = { x: 0.5, y: 0.45 };
    let raf = 0;
    let spawnAcc = 0;

    const burst = (count = 220) => {
      for (let i = 0; i < count; i += 1) {
        bits.push(piece(i % 3 === 0 ? "dot" : "confetti", 0.5, 0.42, true));
      }
    };
    api.current = { burst };

    const onMove = (event: PointerEvent) => {
      pointer = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };
    };
    window.addEventListener("pointermove", onMove);

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const mode = modeRef.current;
      spawnAcc += 1;
      if (mode === "party" && spawnAcc % 2 === 0) {
        bits.push(piece("confetti", Math.random(), -0.04, false));
        bits.push(piece("dot", Math.random(), Math.random() * 0.3, false));
      }
      if (mode === "drop" && spawnAcc % 3 === 0) {
        bits.push(piece("confetti", Math.random(), -0.04, false));
      }

      for (let i = bits.length - 1; i >= 0; i -= 1) {
        const bit = bits[i];
        bit.vx += (pointer.x - 0.5) * 0.00005;
        bit.x += bit.vx;
        bit.y += bit.vy;
        bit.rot += bit.vr;
        bit.vy += 0.00008;
        bit.life -= mode === "hush" ? bit.decay * 2.4 : bit.decay;
        if (bit.life <= 0 || bit.y > 1.12) {
          bits.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(bit.x * w, bit.y * h);
        ctx.rotate(bit.rot);
        ctx.globalAlpha = Math.max(0, bit.life);
        ctx.fillStyle = bit.color;
        if (bit.kind === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, bit.w, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h);
        }
        ctx.restore();
      }

      raf = window.requestAnimationFrame(draw);
    };
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      api.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="anniv-particles" aria-hidden />;
});
