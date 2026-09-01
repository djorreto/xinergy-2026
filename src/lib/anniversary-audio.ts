type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let unlocked = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const C = window.AudioContext || (window as AudioWindow).webkitAudioContext;
  if (!C) return null;
  ctx = new C();
  return ctx;
}

export async function unlockAnniversaryAudio(): Promise<void> {
  const audio = getContext();
  if (!audio) return;
  if (audio.state === "suspended") {
    try {
      await audio.resume();
    } catch {
      return;
    }
  }
  unlocked = audio.state === "running";
}

function noiseBuffer(audio: AudioContext, seconds: number): AudioBuffer {
  const frames = Math.floor(audio.sampleRate * seconds);
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function burst(
  audio: AudioContext,
  dest: AudioNode,
  now: number,
  opts: {
    type: OscillatorType;
    start: number;
    end: number;
    attack: number;
    hold: number;
    decay: number;
    gain: number;
    delay?: number;
  },
) {
  const osc = audio.createOscillator();
  const g = audio.createGain();
  const t = now + (opts.delay ?? 0);
  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.start, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(opts.end, 1), t + opts.hold + opts.decay);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.gain, t + opts.attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.attack + opts.hold + opts.decay);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + opts.attack + opts.hold + opts.decay + 0.02);
}

function noiseHit(
  audio: AudioContext,
  dest: AudioNode,
  now: number,
  opts: {
    seconds: number;
    type: BiquadFilterType;
    freq: number;
    endFreq?: number;
    q?: number;
    gain: number;
    decay: number;
    delay?: number;
  },
) {
  const src = audio.createBufferSource();
  src.buffer = noiseBuffer(audio, opts.seconds);
  const filter = audio.createBiquadFilter();
  filter.type = opts.type;
  filter.Q.value = opts.q ?? 0.8;
  const t = now + (opts.delay ?? 0);
  filter.frequency.setValueAtTime(opts.freq, t);
  if (opts.endFreq) {
    filter.frequency.exponentialRampToValueAtTime(opts.endFreq, t + opts.decay);
  }
  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.decay);
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  src.start(t);
}

function bell(
  audio: AudioContext,
  dest: AudioNode,
  now: number,
  freq: number,
  delay: number,
  gain: number,
  decay = 0.55,
) {
  const t = now + delay;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.97, t + decay);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + decay + 0.02);
}

/** Popper + fanfarria + destellos. */
export function playAnniversaryCelebration(): void {
  const audio = getContext();
  if (!audio) return;
  void audio.resume();

  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.value = 0.58;
  master.connect(audio.destination);

  const brass = audio.createBiquadFilter();
  brass.type = "lowpass";
  brass.frequency.setValueAtTime(2400, now);
  brass.frequency.exponentialRampToValueAtTime(4200, now + 0.18);
  brass.Q.value = 0.9;
  brass.connect(master);

  noiseHit(audio, master, now, {
    seconds: 0.18,
    type: "highpass",
    freq: 2200,
    endFreq: 900,
    q: 0.6,
    gain: 0.42,
    decay: 0.14,
  });
  burst(audio, master, now, {
    type: "sine",
    start: 1680,
    end: 280,
    attack: 0.006,
    hold: 0.02,
    decay: 0.12,
    gain: 0.38,
  });
  burst(audio, master, now, {
    type: "triangle",
    start: 520,
    end: 180,
    attack: 0.008,
    hold: 0.03,
    decay: 0.16,
    gain: 0.22,
  });

  noiseHit(audio, master, now, {
    seconds: 0.45,
    type: "bandpass",
    freq: 2800,
    endFreq: 900,
    q: 1.1,
    gain: 0.28,
    decay: 0.38,
    delay: 0.02,
  });

  const fanfare = [523.25, 659.25, 783.99, 1046.5];
  fanfare.forEach((freq, i) => {
    const delay = 0.05 + i * 0.07;
    burst(audio, brass, now, {
      type: "sawtooth",
      start: freq,
      end: freq * 0.99,
      attack: 0.018,
      hold: 0.08,
      decay: 0.28,
      gain: 0.16 - i * 0.018,
      delay,
    });
    burst(audio, brass, now, {
      type: "triangle",
      start: freq * 2,
      end: freq * 1.96,
      attack: 0.02,
      hold: 0.05,
      decay: 0.22,
      gain: 0.07,
      delay,
    });
  });

  burst(audio, brass, now, {
    type: "triangle",
    start: 261.63,
    end: 246,
    attack: 0.04,
    hold: 0.35,
    decay: 0.7,
    gain: 0.14,
    delay: 0.08,
  });
  burst(audio, brass, now, {
    type: "sine",
    start: 329.63,
    end: 311,
    attack: 0.05,
    hold: 0.32,
    decay: 0.65,
    gain: 0.1,
    delay: 0.1,
  });

  const sparkles = [2093, 2637, 3136, 3520, 4186, 2794, 2349, 3951];
  sparkles.forEach((freq, i) => {
    bell(audio, master, now, freq, 0.09 + i * 0.055, 0.09 - i * 0.006, 0.42);
  });

  for (let i = 0; i < 10; i += 1) {
    noiseHit(audio, master, now, {
      seconds: 0.12,
      type: "highpass",
      freq: 2400 + i * 180,
      q: 1.4,
      gain: 0.1,
      decay: 0.08,
      delay: 0.12 + i * 0.055 + (i % 3) * 0.012,
    });
  }

  unlocked = true;
}

export function isAnniversaryAudioUnlocked(): boolean {
  return unlocked && ctx?.state === "running";
}
