const SRC = "/invites/cinco-anos-xinergy.mp3";

let el: HTMLAudioElement | null = null;

function getPlayer(): HTMLAudioElement {
  if (!el) {
    el = new Audio(SRC);
    el.preload = "auto";
    el.loop = false;
    el.muted = false;
    el.volume = 1;
    el.setAttribute("playsinline", "true");
    el.setAttribute("webkit-playsinline", "true");
  }
  return el;
}

export function primeAnniversaryAudio(): void {
  if (typeof window === "undefined") return;
  getPlayer().load();
}

/** Call from a click/tap handler only — browsers block autoplay. */
export function startAnniversaryMusic(): void {
  if (typeof window === "undefined") return;
  const audio = getPlayer();
  audio.muted = false;
  audio.volume = 1;
  try {
    audio.currentTime = 0;
  } catch {
    /* not ready yet */
  }
  const attempt = audio.play();
  if (attempt) void attempt.catch(() => undefined);
}

export function stopAnniversaryMusic(): void {
  if (!el) return;
  el.pause();
  try {
    el.currentTime = 0;
  } catch {
    /* ignore */
  }
}

export function isAnniversaryMusicPlaying(): boolean {
  return Boolean(el && !el.paused && !el.ended);
}
