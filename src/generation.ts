import type { NoiseFunction, Point } from "./types";
import { ElevationHeightMap, Elevation } from "./types";

export function* getNeighbors(point: Point, range = 1) {
  for (let y = point.y - range, maxY = point.y + range; y <= maxY; y++)
    for (let x = point.x - range, maxX = point.x + range; x <= maxX; x++)
      yield { x, y };
}

export function getElevation(getNoise: NoiseFunction, point: Point): Elevation {
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
