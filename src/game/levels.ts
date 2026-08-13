import data from './levelData.json';
import { Level } from './types';

/** 30 generated levels, each verified solvable; minMoves = BFS optimum. */
export const LEVELS: Level[] = data as Level[];

export const getLevel = (id: number): Level => LEVELS[id - 1];

/** Move limit for a level (when "unlimited moves" is off). */
export const moveLimit = (level: Level): number => level.minMoves + 10;

/** Star rating from moves used + hint penalty. */
export function starsFor(level: Level, moves: number, hintsUsed: number): number {
  let stars = 1;
  if (moves <= level.minMoves) stars = 3;
  else if (moves <= level.minMoves + 3) stars = 2;
  if (hintsUsed > 0) stars = Math.max(1, stars - 1);
  return stars;
}

export const coinsFor = (stars: number): number => 20 + stars * 10;
