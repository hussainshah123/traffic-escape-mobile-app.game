/**
 * @format
 */

import { LEVELS, moveLimit, starsFor } from '../src/game/levels';
import { buildOccupancy, isWin, moveVehicle, slideRange } from '../src/game/engine';
import { solve } from '../src/game/solver';
import { GRID_SIZE, RED_ID } from '../src/game/types';

describe('levels', () => {
  test('30 levels exist with ascending ids', () => {
    expect(LEVELS).toHaveLength(30);
    LEVELS.forEach((l, i) => expect(l.id).toBe(i + 1));
  });

  test('every level has exactly one red car on the exit row', () => {
    LEVELS.forEach(l => {
      const reds = l.vehicles.filter(v => v.id === RED_ID);
      expect(reds).toHaveLength(1);
      expect(reds[0].dir).toBe('H');
      expect(reds[0].row).toBe(2);
    });
  });

  test('no overlapping vehicles in any level', () => {
    LEVELS.forEach(l => {
      const occ = buildOccupancy(l.vehicles);
      const cells = l.vehicles.reduce((n, v) => n + v.len, 0);
      expect(occ.filter(c => c !== -1)).toHaveLength(cells);
    });
  });

  test('every level is solvable in exactly minMoves', () => {
    LEVELS.forEach(l => {
      const res = solve(l.vehicles);
      expect(res).not.toBeNull();
      expect(res!.movesLeft).toBe(l.minMoves);
      expect(res!.hint).not.toBeNull();
    });
  });
});

describe('engine', () => {
  const vehicles = LEVELS[0].vehicles;

  test('slideRange stays inside the grid', () => {
    vehicles.forEach((v, i) => {
      const { min, max } = slideRange(vehicles, i);
      expect(min).toBeGreaterThanOrEqual(0);
      expect(max + v.len).toBeLessThanOrEqual(GRID_SIZE);
      const pos = v.dir === 'H' ? v.col : v.row;
      expect(min).toBeLessThanOrEqual(pos);
      expect(max).toBeGreaterThanOrEqual(pos);
    });
  });

  test('isWin only when the red car touches the right edge', () => {
    expect(isWin(vehicles)).toBe(false);
    const redIdx = vehicles.findIndex(v => v.id === RED_ID);
    const winning = moveVehicle(vehicles, redIdx, GRID_SIZE - vehicles[redIdx].len);
    expect(isWin(winning)).toBe(true);
  });
});

describe('scoring', () => {
  const level = LEVELS[0];

  test('star thresholds', () => {
    expect(starsFor(level, level.minMoves, 0)).toBe(3);
    expect(starsFor(level, level.minMoves + 3, 0)).toBe(2);
    expect(starsFor(level, level.minMoves + 9, 0)).toBe(1);
  });

  test('hints reduce stars but never below 1', () => {
    expect(starsFor(level, level.minMoves, 1)).toBe(2);
    expect(starsFor(level, level.minMoves + 9, 3)).toBe(1);
  });

  test('move limit leaves room above 2-star threshold', () => {
    LEVELS.forEach(l => expect(moveLimit(l)).toBeGreaterThan(l.minMoves + 3));
  });
});
