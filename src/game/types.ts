export type Dir = 'H' | 'V';

export interface Vehicle {
  id: string;
  row: number;
  col: number;
  len: number;
  dir: Dir;
}

export interface Level {
  id: number;
  vehicles: Vehicle[];
  minMoves: number;
}

export interface Hint {
  vehicleId: string;
  to: number; // target variable coord (col for H, row for V)
}

export const GRID_SIZE = 6;
export const EXIT_ROW = 2;
export const RED_ID = 'R';
