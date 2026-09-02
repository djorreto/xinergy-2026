const SRC = "/invites/cinco-anos-xinergy.mp3";

let el: HTMLAudioElement | null = null;
let unlocked = false;
let pending = false;

function getPlayer(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (el) return el;
  el = new Audio(SRC);
  el.preload = "auto";
  el.loop = false;
  el.setAttribute("playsinline", "true");
  return el;
}

export function primeAnniversaryAudio(): void {
  getPlayer()?.load();
}

export async function unlockAnniversaryAudio(): Promise<void> {
  const audio = getPlayer();
  if (!audio) return;

  try {
    audio.muted = true;
    await audio.play();
    audio.pause();
    if (!pending) audio.currentTime = 0;
    audio.muted = false;
    unlocked = true;
    if (pending) {
      pending = false;
      await audio.play();
    }
  } catch {
    return;
  }
}

export function startAnniversaryMusic(): void {
  const audio = getPlayer();
  if (!audio) return;
  audio.muted = false;
  audio.currentTime = 0;
  const play = audio.play();
  if (play) {
    void play
      .then(() => {
        unlocked = true;
        pending = false;
      })
      .catch(() => {
        pending = true;
      });
  }
}

export function stopAnniversaryMusic(): void {
  pending = false;
  if (!el) return;
  el.pause();
  el.currentTime = 0;
}

export function isAnniversaryMusicPlaying(): boolean {
  return Boolean(el && !el.paused && !el.ended);
}

export function isAnniversaryAudioUnlocked(): boolean {
  return unlocked;
}
