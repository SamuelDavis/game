import { derived, writable } from "svelte/store";
import { persistent } from "./util";
import type { Point } from "./types";
import { zoomMax, zoomMin } from "./config";
import alea from "alea";
import { createNoise2D } from "simplex-noise";

export const zoom = persistent(writable(1), "zoom");
export const position = persistent(writable<Point>({ x: 0, y: 0 }), "position");
zoom.subscribe((value) => {
  if (value < zoomMin) return zoom.set(zoomMin);
  if (value > zoomMax) return zoom.set(zoomMax);
});
export const gridColumns = derived([zoom], ([zoom]) => zoom * 2 + 1);

export const seed = persistent(
  writable(Math.random().toString(36).slice(2)),
  "seed"
);
export const getNoise = derived([seed], ([seed]) => {
  const prng = alea(seed);
  const noise2D = createNoise2D(prng);

  return (point: Point) => noise2D(point.x, point.y);
});
