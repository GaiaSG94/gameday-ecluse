import assert from 'node:assert/strict';
import { test } from 'node:test';

import { dailySeed, gateBlocksBall, gatePositionAt, generateLevel } from './puzzle.ts';

test('seed deterministe', () => {
  assert.equal(dailySeed('2026-12-01'), dailySeed('2026-12-01'));
});

test('le niveau du jour est deterministe', () => {
  const a = generateLevel('2026-12-01');
  const b = generateLevel('2026-12-01');
  assert.deepEqual(a.gates, b.gates);
  assert.equal(a.ballSpeed, b.ballSpeed);
});

test('une vanne gelee reste immobile', () => {
  const level = generateLevel('2026-12-01');
  const gate = level.gates[0] ?? { y: 50, span: 2, phase: 0.5, speed: 0.1 };
  const at = (t: number): number => gatePositionAt(gate, t, t + 5000);
  assert.equal(at(1000), at(4000));
});

test('une vanne en mouvement couvre une plage valide', () => {
  const level = generateLevel('2026-12-02');
  const gate = level.gates[1] ?? { y: 30, span: 2, phase: 0.2, speed: 0.12 };
  for (let t = 0; t < 20000; t += 250) {
    const pos = gatePositionAt(gate, t, 0);
    assert.ok(pos >= 0 && pos <= 5 - gate.span);
  }
});

test('la vanne bloque la bille dans sa portee', () => {
  const level = generateLevel('2026-12-03');
  const gate = level.gates[2] ?? { y: 60, span: 2, phase: 0.3, speed: 0.09 };
  const pos = gatePositionAt(gate, 0, 0);
  assert.equal(gateBlocksBall(gate, pos + 0.5, 0, 0), true);
  assert.equal(gateBlocksBall(gate, pos + gate.span + 1, 0, 0), false);
});
