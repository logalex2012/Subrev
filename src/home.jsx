import { ProgressCircle } from '@heroui/react';
import { useEffect, useState } from 'react';

export function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = 1800;
    const interval = 30;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          // Start fade-out, then notify parent after transition completes
          setTimeout(() => setFading(true), 150);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // When fade-out transition ends, tell Root we're done
  function handleTransitionEnd() {
    if (fading) onDone?.();
  }

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,rgba(99,102,241,0.18),transparent_55%)]"
      />

      <div
        className="relative z-10 flex flex-col items-center gap-10 transition-transform duration-500"
        style={{ transform: fading ? 'scale(0.96)' : 'scale(1)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <img
            src="/icon1ej.png"
            alt="SubreV"
            className="size-20 rounded-3xl shadow-[0_8px_32px_rgba(99,102,241,0.35)]"
          />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            SubreV
          </span>
        </div>

        <ProgressCircle
          value={Math.round(progress)}
          aria-label="Загрузка"
          color="accent"
          size="md"
        />

        <p className="text-sm text-muted">Загрузка…</p>
      </div>
    </div>
  );
}
