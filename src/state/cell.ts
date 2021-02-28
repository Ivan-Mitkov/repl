export type CellTypes = "code" | "text";
export type Direction = "up" | "down";
export interface Cell {
  id: string;
  type: "code" | "text";
  content: string;
}
