import './index.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { gateBlocksBall, gatePositionAt, FREEZE_MS, WIDTH } from '../shared/puzzle';
import type { Level } from '../shared/puzzle';

type Init = {
  day: string;
  username: string;
  streak: number;
  solvedToday: boolean;
  startedAt: number;
  level: Level;
};

type Result = { won: boolean; streak: number; elapsedMs: number };

type Run = { ballY: number; ballX: number; time: number; frozenUntil: number };

const CELL = 52;

const App = () => {
  const [init, setInit] = useState<Init | null>(null);
  const [phase, setPhase] = useState<'ready' | 'run' | 'hit' | 'done'>('ready');
  const [run, setRun] = useState<Run>({ ballY: 0, ballX: WIDTH / 2, time: 0, frozenUntil: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const startedAt = useRef(0);
  const frozenUntil = useRef(0);

  const submit = useCallback(
    async (cleared: boolean, elapsed: number, tries: number) => {
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cleared, elapsedMs: Math.round(elapsed), attempts: tries }),
        });
        const data = await res.json();
        if (data.status === 'error') throw new Error(data.message);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'submit failed');
      }
    },
    []
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/init');
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message);
      setInit(data);
      setPhase('ready');
      setResult(null);
      setAttempts(0);
      setRun({ ballY: 0, ballX: WIDTH / 2, time: 0, frozenUntil: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'load failed');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (phase !== 'run' || !init) return;
    let raf = 0;
    const step = (): void => {
      const time = performance.now() - startedAt.current;
      const ballY = (time * init.level.ballSpeed) / 10;
      const gate = init.level.gates.find((g) => ballY >= g.y && ballY < g.y + 8);
      if (gate && gateBlocksBall(gate, WIDTH / 2, time, frozenUntil.current)) {
        setAttempts((a) => a + 1);
        setPhase('hit');
        return;
      }
      if (ballY >= init.level.height) {
        setRun({ ballY, ballX: WIDTH / 2, time, frozenUntil: frozenUntil.current });
        setPhase('done');
        void submit(true, time, attempts);
        return;
      }
      setRun({ ballY, ballX: WIDTH / 2, time, frozenUntil: frozenUntil.current });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, init, attempts, submit]);

  const freeze = (row: number) => {
    if (phase !== 'run' || !init) return;
    const gate = init.level.gates[row];
    if (!gate) return;
    if (Math.abs(run.ballY - gate.y) > 25) return;
    frozenUntil.current = run.time + FREEZE_MS;
    setRun((current) => ({ ...current, frozenUntil: frozenUntil.current }));
  };

  const start = () => {
    startedAt.current = performance.now();
    frozenUntil.current = 0;
    setRun({ ballY: 0, ballX: WIDTH / 2, time: 0, frozenUntil: 0 });
    setPhase('run');
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c1c26] text-[#cfe8f3]">
        <p>{error}</p>
      </div>
    );
  }
  if (!init) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c1c26] text-[#5f8fa5]">
        <p className="animate-pulse">Filling the canal…</p>
      </div>
    );
  }

  const level = init.level;
  const seconds = Math.floor(run.time / 1000);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-[#0c1c26] px-4 py-6 text-[#cfe8f3]">
      <header className="flex w-full max-w-md items-center justify-between">
        <h1 className="text-xl font-black tracking-[0.3em] text-[#4cc9f0]">ECLUSE</h1>
        <div className="text-sm font-semibold text-[#5f8fa5]">
          <span className="mr-3">{clock}</span>
          <span>🔥 {result ? result.streak : init.streak}</span>
        </div>
      </header>
      <p className="max-w-md text-center text-[13px] leading-snug text-[#5f8fa5]">
        The crate sinks through five sweeping sluice gates. Tap a gate row to freeze its sweep
        and let the crate pass.
      </p>
      <div
        className="relative overflow-hidden rounded-xl border-2 border-[#173a4d] bg-[#0e2836]"
        style={{ width: WIDTH * CELL, height: level.height * 3.4 }}
      >
        {level.gates.map((gate, row) => {
          const pos = gatePositionAt(gate, run.time, run.frozenUntil);
          return (
            <button
              key={row}
              onClick={() => freeze(row)}
              className="absolute flex w-full cursor-pointer items-center"
              style={{ top: `${gate.y}%`, height: 24 }}
              aria-label={`gate ${row + 1}`}
            >
              <span
                className="block h-3 rounded bg-[#4cc9f0] opacity-90"
                style={{ width: gate.span * CELL, marginLeft: pos * CELL }}
              />
            </button>
          );
        })}
        <span
          className="absolute flex h-6 w-6 items-center justify-center rounded bg-[#ffd166] text-[11px]"
          style={{
            top: `${Math.min(run.ballY, 99)}%`,
            left: (run.ballX - 0.5) * CELL,
          }}
        >
          ●
        </span>
      </div>
      {phase === 'ready' && (
        <button
          onClick={start}
          className="w-full max-w-md rounded-full bg-[#4cc9f0] py-3 text-base font-black uppercase tracking-widest text-[#0c1c26]"
        >
          Release the crate
        </button>
      )}
      {phase === 'hit' && (
        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-xl border-2 border-[#173a4d] bg-[#0e2836] p-5 text-center">
          <p className="text-2xl font-black tracking-widest">GATE JAMMED</p>
          <p className="text-sm text-[#5f8fa5]">The crate bounced off a moving gate.</p>
          <button
            onClick={start}
            className="rounded-full border-2 border-[#4cc9f0] px-6 py-2 text-sm font-bold uppercase tracking-widest text-[#4cc9f0]"
          >
            Drop again
          </button>
        </div>
      )}
      {phase === 'done' && result && (
        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-xl border-2 border-[#173a4d] bg-[#0e2836] p-5 text-center">
          <p className="text-2xl font-black tracking-widest">LOCK CLEARED</p>
          <p className="text-sm text-[#5f8fa5]">
            Through the five gates in {clock} — streak 🔥 {result.streak}. A new canal tomorrow.
          </p>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
