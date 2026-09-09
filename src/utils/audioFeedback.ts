// Subtle audio feedback using the Web Audio API for CEH Quiz Engine

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    console.warn('Web Audio API not supported or blocked:', err);
    return null;
  }
}

/**
 * Play a subtle, crisp two-tone ascending chime for correct answers.
 * Major third/fifth harmonic (C5 -> E5 -> G5) with exponential decay.
 */
export function playCorrectSound(volumeMultiplier: number = 1.0): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.12 * Math.min(Math.max(volumeMultiplier, 0), 1), now);
  masterGain.connect(ctx.destination);

  // Tone 1: 523.25 Hz (C5)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(523.25, now);
  gain1.gain.setValueAtTime(0.8, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc1.start(now);
  osc1.stop(now + 0.18);

  // Tone 2: 659.25 Hz (E5)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(659.25, now + 0.08);
  gain2.gain.setValueAtTime(0.001, now);
  gain2.gain.setValueAtTime(0.8, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  osc2.connect(gain2);
  gain2.connect(masterGain);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.28);

  // Tone 3: 783.99 Hz (G5)
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(783.99, now + 0.16);
  gain3.gain.setValueAtTime(0.001, now);
  gain3.gain.setValueAtTime(0.9, now + 0.16);
  gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
  osc3.connect(gain3);
  gain3.connect(masterGain);
  osc3.start(now + 0.16);
  osc3.stop(now + 0.45);
}

/**
 * Play a subtle, gentle low-frequency double tone for incorrect answers.
 * Soft sine wave transition from 220Hz to 174Hz with smooth release.
 */
export function playIncorrectSound(volumeMultiplier: number = 1.0): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.12 * Math.min(Math.max(volumeMultiplier, 0), 1), now);
  masterGain.connect(ctx.destination);

  // Pulse 1: 220 Hz (A3)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(220, now);
  gain1.gain.setValueAtTime(0.7, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc1.start(now);
  osc1.stop(now + 0.15);

  // Pulse 2: 174.61 Hz (F3)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(174.61, now + 0.12);
  gain2.gain.setValueAtTime(0.001, now);
  gain2.gain.setValueAtTime(0.7, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc2.connect(gain2);
  gain2.connect(masterGain);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.35);
}

/**
 * Play a celebratory finish chime when passing a full exam.
 */
export function playExamCelebrationSound(volumeMultiplier: number = 1.0): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.14 * Math.min(Math.max(volumeMultiplier, 0), 1), now);
  masterGain.connect(ctx.destination);

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + i * 0.1;
    const duration = i === notes.length - 1 ? 0.6 : 0.25;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.setValueAtTime(0.8, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}
