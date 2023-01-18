import { createNoise2D } from "simplex-noise";
import alea from "alea";
import type { Point } from "./types";
import { ElevationHeightMap, Elevation } from "./types";
const prng = alea("seed");
const noise2D = createNoise2D(prng);

export function getNoise(point: Point): number {
  return noise2D(point.x, point.y);
}
export function* getNeighbors(point: Point, range = 1) {
  for (let y = point.y - range, maxY = point.y + range; y <= maxY; y++)
    for (let x = point.x - range, maxX = point.x + range; x <= maxX; x++)
      yield {
        x,
        y,
      };
}

export function getElevation(point: Point): Elevation {
  for (const [key, value] of Object.entries(ElevationHeightMap)) {
    if (getNoise(point) >= value) return parseInt(key);
  }
}

export function getColor(elevation: Elevation): string {
  switch (elevation) {
    case Elevation.High:
      return "lightgray";
    case Elevation.Middle:
      return "forestgreen";
    case Elevation.Low:
      return "dodgerblue";
  }
}
