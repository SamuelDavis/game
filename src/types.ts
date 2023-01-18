export type Point = { x: number; y: number };

export enum Elevation {
  High,
  Middle,
  Low,
}
export const ElevationHeightMap: Record<Elevation, number> = {
  [Elevation.High]: 0.5,
  [Elevation.Middle]: -0.5,
  [Elevation.Low]: -1,
};

export type NoiseFunction = (point: Point) => number;
