import { Dir, GRID_SIZE, RED_ID, Vehicle } from './types';

/** Variable-axis position of a vehicle (col for H, row for V). */
export const getPos = (v: Vehicle): number => (v.dir === 'H' ? v.col : v.row);

export const withPos = (v: Vehicle, pos: number): Vehicle =>
  v.dir === 'H' ? { ...v, col: pos } : { ...v, row: pos };

/** Grid of vehicle indices, -1 = empty. */
export function buildOccupancy(vehicles: Vehicle[]): number[] {
  const occ = new Array(GRID_SIZE * GRID_SIZE).fill(-1);
  vehicles.forEach((v, i) => {
    for (let k = 0; k < v.len; k++) {
      const r = v.dir === 'H' ? v.row : v.row + k;
      const c = v.dir === 'H' ? v.col + k : v.col;
      occ[r * GRID_SIZE + c] = i;
    }
  });
  return occ;
}

/**
 * Inclusive range [min, max] the vehicle at `index` can slide to along its
 * axis, given the other vehicles. Used to clamp drags in real time.
 */
export function slideRange(
  vehicles: Vehicle[],
  index: number,
): { min: number; max: number } {
  const occ = buildOccupancy(vehicles);
  const v = vehicles[index];
  const pos = getPos(v);
  const fixed = v.dir === 'H' ? v.row : v.col;
  const cellAt = (p: number) =>
    v.dir === 'H' ? occ[fixed * GRID_SIZE + p] : occ[p * GRID_SIZE + fixed];

  let min = pos;
  while (min - 1 >= 0 && cellAt(min - 1) === -1) min--;
  let max = pos;
  while (max + v.len < GRID_SIZE && cellAt(max + v.len) === -1) max++;
  return { min, max };
}

export function moveVehicle(
  vehicles: Vehicle[],
  index: number,
  pos: number,
): Vehicle[] {
  return vehicles.map((v, i) => (i === index ? withPos(v, pos) : v));
}

export function isWin(vehicles: Vehicle[]): boolean {
  const red = vehicles.find(v => v.id === RED_ID);
  return !!red && red.col + red.len === GRID_SIZE;
}

export const axisOf = (dir: Dir): 'x' | 'y' => (dir === 'H' ? 'x' : 'y');
