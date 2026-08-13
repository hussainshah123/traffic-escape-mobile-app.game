import { GRID_SIZE, Hint, RED_ID, Vehicle } from './types';

/**
 * BFS solver over the current board. Returns the number of remaining moves
 * and the first move of one shortest solution (used by the hint system).
 * A "move" is sliding one vehicle any distance, Rush-Hour style.
 */
export function solve(
  vehicles: Vehicle[],
): { movesLeft: number; hint: Hint | null } | null {
  const start = vehicles.map(v => (v.dir === 'H' ? v.col : v.row));
  const redIdx = vehicles.findIndex(v => v.id === RED_ID);
  if (redIdx < 0) return null;
  const goal = (s: number[]) => s[redIdx] + vehicles[redIdx].len === GRID_SIZE;
  const key = (s: number[]) => s.join(',');

  if (goal(start)) return { movesLeft: 0, hint: null };

  const startKey = key(start);
  const seen = new Set<string>([startKey]);
  // key -> [parentKey, hint that produced it]
  const parent = new Map<string, [string, Hint]>();
  let frontier: number[][] = [start];
  let depth = 0;

  const occ = new Array(GRID_SIZE * GRID_SIZE).fill(-1);
  const fill = (s: number[]) => {
    occ.fill(-1);
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      for (let k = 0; k < v.len; k++) {
        const r = v.dir === 'H' ? v.row : s[i] + k;
        const c = v.dir === 'H' ? s[i] + k : v.col;
        occ[r * GRID_SIZE + c] = i;
      }
    }
  };

  const trace = (goalKey: string, moves: number) => {
    let k = goalKey;
    let first: Hint | null = null;
    while (k !== startKey) {
      const entry = parent.get(k)!;
      first = entry[1];
      k = entry[0];
    }
    return { movesLeft: moves, hint: first };
  };

  while (frontier.length) {
    depth++;
    const next: number[][] = [];
    for (const s of frontier) {
      fill(s);
      for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const fixed = v.dir === 'H' ? v.row : v.col;
        const cellAt = (p: number) =>
          v.dir === 'H' ? occ[fixed * GRID_SIZE + p] : occ[p * GRID_SIZE + fixed];
        for (const step of [-1, 1]) {
          for (let np = s[i] + step; ; np += step) {
            if (np < 0 || np + v.len > GRID_SIZE) break;
            const probe = step < 0 ? np : np + v.len - 1;
            if (cellAt(probe) !== -1) break;
            const ns = s.slice();
            ns[i] = np;
            const k = key(ns);
            if (!seen.has(k)) {
              seen.add(k);
              parent.set(k, [key(s), { vehicleId: v.id, to: np }]);
              if (goal(ns)) return trace(k, depth);
              next.push(ns);
            }
          }
        }
      }
    }
    frontier = next;
  }
  return null;
}
