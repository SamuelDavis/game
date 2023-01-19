export type Point = { x: number; y: number };
export type HSLString = `hsl(${number},${number}%,${number}%)`;
export type Cell = Map<CellDescriptor, number>;
export type CellDescriptor = "height" | "temperature" | "humidity";
export const CellDescriptors: CellDescriptor[] = [
  "height",
  "temperature",
  "humidity",
];

type CellColor = "Water" | "Grass" | "Sand";
type RGBValue = [number, number, number];
export const CellPallet = new Map<CellColor, RGBValue>([
  ["Water", [0, 28, 80]],
  ["Grass", [124, 252, 0]],
  ["Sand", [194, 178, 128]],
]);
