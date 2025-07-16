export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  type: "pen" | "eraser" | "shape";
  points: number[];
  color: string;
  thickness: number;
}

export interface Cursor {
  position: Point;
  color: string;
}
