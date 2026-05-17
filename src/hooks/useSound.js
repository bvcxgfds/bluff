import { useMemo, useRef } from 'react';

function beep(ctx, frequency, duration, type = 'sine', gainValue = 0.04) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = gainValue;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

export function useSound() {
  const ctxRef = useRef(null);
  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  };

  return useMemo(() => ({
    tick: () => beep(getCtx(), 900, 0.035, 'square', 0.02),
    deal: () => beep(getCtx(), 260, 0.08, 'triangle', 0.05),
    place: () => beep(getCtx(), 180, 0.09, 'sawtooth', 0.04),
    bluff: () => beep(getCtx(), 120, 0.2, 'square', 0.06),
    reveal: () => beep(getCtx(), 640, 0.14, 'triangle', 0.05),
    victory: () => {
      const ctx = getCtx();
      beep(ctx, 523, 0.12, 'triangle', 0.04);
      setTimeout(() => beep(ctx, 659, 0.12, 'triangle', 0.04), 120);
      setTimeout(() => beep(ctx, 784, 0.18, 'triangle', 0.04), 240);
    }
  }), []);
}
