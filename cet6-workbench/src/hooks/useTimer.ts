import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimerLap {
  id: number;
  label: string;
  elapsedSeconds: number;
  deltaSeconds: number;
}

function playGentleChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.68);
  } catch {
    // Ignore audio restriction errors
  }
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function useTimer(initialMinutes: number) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [laps, setLaps] = useState<TimerLap[]>([]);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (soundRef.current) playGentleChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const setMinutes = useCallback((minutes: number) => {
    const secs = Math.max(60, Math.round(minutes * 60));
    setIsRunning(false);
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setLaps([]);
  }, []);

  const toggle = useCallback(() => {
    setRemainingSeconds((prev) => {
      if (prev === 0) return totalSeconds;
      return prev;
    });
    setIsRunning((prev) => !prev);
  }, [totalSeconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setLaps([]);
  }, [totalSeconds]);

  const addMinute = useCallback(() => {
    setTotalSeconds((prev) => prev + 60);
    setRemainingSeconds((prev) => prev + 60);
  }, []);

  const recordLap = useCallback(
    (label?: string) => {
      const elapsed = totalSeconds - remainingSeconds;
      setLaps((prev) => {
        const lastElapsed = prev.length > 0 ? prev[prev.length - 1].elapsedSeconds : 0;
        const delta = Math.max(0, elapsed - lastElapsed);
        return [
          ...prev,
          {
            id: prev.length + 1,
            label: label ?? `分段 ${prev.length + 1}`,
            elapsedSeconds: elapsed,
            deltaSeconds: delta,
          },
        ];
      });
    },
    [remainingSeconds, totalSeconds]
  );

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const elapsedSeconds = Math.max(0, totalSeconds - remainingSeconds);

  return {
    totalSeconds,
    remainingSeconds,
    elapsedSeconds,
    progress,
    isRunning,
    soundEnabled,
    laps,
    setSoundEnabled,
    setMinutes,
    toggle,
    reset,
    addMinute,
    recordLap,
  };
}
