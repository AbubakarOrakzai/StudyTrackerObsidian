// A tiny two-tone chime synthesized with the Web Audio API. Avoids bundling
// a binary audio asset just for a "ding" — and it's easy to retune (pitch,
// duration) right here if you want a different feel later.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(freq: number, startOffset: number, duration: number, gain: number) {
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  const now = audioCtx.currentTime + startOffset;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(g);
  g.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.05);
}

export function playChime(kind: "work-end" | "break-end" = "work-end") {
  // Work-end: a bright little upward "ding-dong". Break-end: softer, lower.
  if (kind === "work-end") {
    tone(880, 0, 0.25, 0.18);
    tone(1108.73, 0.15, 0.35, 0.15);
  } else {
    tone(587.33, 0, 0.3, 0.12);
    tone(440, 0.2, 0.4, 0.1);
  }
}
