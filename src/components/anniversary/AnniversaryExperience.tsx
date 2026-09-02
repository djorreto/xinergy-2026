"use client";

import { useEffect, useRef, useState } from "react";
import { AnniversaryCountdown } from "@/components/anniversary/AnniversaryCountdown";
import { AnniversaryScene, type AnniversarySceneHandle } from "@/components/anniversary/AnniversaryScene";
import { AnniversaryWord } from "@/components/anniversary/AnniversaryWord";
import { FiveSculpture } from "@/components/anniversary/FiveSculpture";
import { primeAnniversaryAudio, startAnniversaryMusic, stopAnniversaryMusic } from "@/lib/anniversary-audio";
import {
  ANNIVERSARY_ADDRESS,
  ANNIVERSARY_MAPS_URL,
  ANNIVERSARY_VENUE,
  getAnniversaryCalendarUrl,
  getAnniversaryIcsHref,
} from "@/lib/anniversary";

type Copy = {
  eyebrow: string;
  kicker: string;
  title: string;
  lead: string;
  surprise: string;
  whenLabel: string;
  when: string;
  whenTime: string;
  whereLabel: string;
  dressLabel: string;
  dress: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  live: string;
  maps: string;
  calendar: string;
  privateNote: string;
  skip: string;
  enter: string;
  enterHint: string;
  hint: string;
};

type Act = "gate" | "boot" | "slam" | "party" | "hush" | "drop" | "five" | "show";

export function AnniversaryExperience({ copy }: { copy: Copy }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<AnniversarySceneHandle>(null);
  const timers = useRef<number[]>([]);
  const dropped = useRef(false);
  const entered = useRef(false);
  const [act, setAct] = useState<Act>("gate");

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const drop = () => {
    if (dropped.current) return;
    dropped.current = true;
    clearTimers();
    setAct("drop");
    sceneRef.current?.setMode("drop");
    sceneRef.current?.burst(280);
    later(220, () => setAct("five"));
    later(1400, () => {
      setAct("show");
      sceneRef.current?.setMode("party");
    });
  };

  const play = () => {
    clearTimers();
    dropped.current = false;
    startAnniversaryMusic();
    setAct("boot");
    sceneRef.current?.setMode("idle");
    later(180, () => setAct("slam"));
    later(1700, () => {
      setAct("party");
      sceneRef.current?.setMode("party");
    });
    later(4800, () => {
      setAct("hush");
      sceneRef.current?.setMode("hush");
    });
    later(6100, drop);
  };

  const enter = () => {
    if (entered.current) return;
    entered.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAnniversaryMusic();
      dropped.current = true;
      setAct("show");
      return;
    }
    play();
  };

  useEffect(() => {
    primeAnniversaryAudio();
    return () => {
      clearTimers();
      stopAnniversaryMusic();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let t = 0;

    const loop = () => {
      t += 0.012;
      if (!fine) {
        tx = Math.sin(t) * 16;
        ty = Math.cos(t * 0.7) * 10;
      }
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty("--rx", `${cy.toFixed(2)}deg`);
      root.style.setProperty("--ry", `${cx.toFixed(2)}deg`);
      root.style.setProperty("--sx", `${(cy * 1.3).toFixed(2)}deg`);
      root.style.setProperty("--sy", `${(cx * 1.5).toFixed(2)}deg`);
      root.style.setProperty("--lx", `${50 + cx * 1.5}%`);
      root.style.setProperty("--ly", `${40 + cy * 1.3}%`);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    const onMove = (event: PointerEvent) => {
      if (!fine) return;
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tx = x * 28;
      ty = y * -18;
    };

    root.addEventListener("pointermove", onMove);
    return () => {
      window.cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  const onStageClick = () => {
    if (act === "party" || act === "hush") drop();
  };

  const showing = act === "show";
  const fiveOn = act === "five" || act === "show";

  return (
    <div ref={rootRef} className={`anniv-root is-${act}`} onClick={onStageClick}>
      <div className="anniv-world" aria-hidden>
        <AnniversaryScene ref={sceneRef} />
        <div className="anniv-glow" />
        <div className="anniv-spots">
          <i className="anniv-spot anniv-spot-a" />
          <i className="anniv-spot anniv-spot-b" />
          <i className="anniv-spot anniv-spot-c" />
        </div>
        <div className="anniv-vignette" />
        <div className="anniv-grain" />
        <div className="anniv-flash" />
        <div className="anniv-shock" />
        <FiveSculpture active={fiveOn} />
      </div>

      <div className={`anniv-drop5 font-display ${fiveOn ? "is-on" : ""}`} aria-hidden>
        <span>5</span>
      </div>

      <div className="anniv-hero">
        <AnniversaryWord onEncore={showing ? play : undefined} />
      </div>

      {act === "gate" ? (
        <button type="button" className="anniv-gate" onPointerDown={enter} onClick={enter}>
          <span className="anniv-gate-bars" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="anniv-gate-title font-display">{copy.enter}</span>
          <span className="anniv-gate-hint">{copy.enterHint}</span>
        </button>
      ) : null}

      {!showing && act !== "gate" ? (
        <p className="anniv-skip">{copy.skip}</p>
      ) : showing ? (
        <div className="anniv-after" onClick={(event) => event.stopPropagation()}>
          <p className="anniv-kicker font-display">{copy.kicker}</p>
          <h1 className="anniv-title font-display">{copy.title}</h1>
          <p className="anniv-lead">{copy.lead}</p>

          <AnniversaryCountdown
            daysLabel={copy.days}
            hoursLabel={copy.hours}
            minutesLabel={copy.minutes}
            secondsLabel={copy.seconds}
            liveLabel={copy.live}
          />

          <dl className="anniv-facts">
            <div>
              <dt>{copy.whenLabel}</dt>
              <dd>
                {copy.when}
                <span>{copy.whenTime}</span>
              </dd>
            </div>
            <div>
              <dt>{copy.whereLabel}</dt>
              <dd>
                {ANNIVERSARY_VENUE}
                <span>{ANNIVERSARY_ADDRESS}</span>
              </dd>
            </div>
            <div>
              <dt>{copy.dressLabel}</dt>
              <dd>{copy.dress}</dd>
            </div>
          </dl>

          <p className="anniv-surprise">{copy.surprise}</p>

          <div className="anniv-actions">
            <a className="btn-primary" href={ANNIVERSARY_MAPS_URL} target="_blank" rel="noreferrer">
              {copy.maps}
            </a>
            <a className="btn-light" href={getAnniversaryCalendarUrl()} target="_blank" rel="noreferrer">
              {copy.calendar}
            </a>
            <a className="anniv-ics" href={getAnniversaryIcsHref()} download="xinergy-5-anos.ics">
              .ics
            </a>
          </div>
          <p className="anniv-hint">{copy.hint}</p>
          <p className="anniv-private">{copy.privateNote}</p>
        </div>
      )}
    </div>
  );
}
