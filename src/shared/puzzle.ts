export type Gate = { y: number; span: number; phase: number; speed: number };

export type Level = {
  day: string;
  height: number;
  ballSpeed: number;
  gates: Gate[];
  targetMs: number;
};

export const WIDTH = 5;
export const GATE_ROWS = 5;
export const FREEZE_MS = 900;

export const dayKeyUTC = (now: Date = new Date()): string => now.toISOString().slice(0, 10);

export const dailySeed = (day: string): number => {
  let hash = 2166136261;
  const input = 'ecluse:' + day;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const generateLevel = (day: string): Level => {
  const rand = mulberry32(dailySeed(day));
  const height = 100;
  const gates: Gate[] = Array.from({ length: GATE_ROWS }, (_, i) => ({
    y: height * ((i + 1) / (GATE_ROWS + 1)),
    span: 2,
    phase: rand(),
    speed: 0.08 + rand() * 0.1,
  }));
  return { day, height, ballSpeed: 0.028 + rand() * 0.01, gates, targetMs: 60000 };
};

export const gatePositionAt = (gate: Gate, timeMs: number, frozenUntil: number): number => {
  if (timeMs < frozenUntil) return gate.phase * WIDTH;
  const t = (timeMs / 1000) * gate.speed + gate.phase * 2;
  return (Math.sin(t * Math.PI) + 1) / 2 * (WIDTH - gate.span);
};

export const gateBlocksBall = (gate: Gate, ballX: number, timeMs: number, frozenUntil: number): boolean => {
  const pos = gatePositionAt(gate, timeMs, frozenUntil);
  return ballX >= pos && ballX < pos + gate.span;
};
