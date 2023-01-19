import { derived, writable } from "svelte/store";
import { persistent, unitizeNoise } from "./util";
import type { Cell, Point } from "./types";
import { CellDescriptors } from "./types";
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
export const getCell = derived([seed], ([seed]) => {
  const noiseGenerators = CellDescriptors.map((descriptor) =>
    createNoise2D(alea(seed + descriptor))
  );
  return function (point: Point) {
    return noiseGenerators.reduce<Cell>(
      (acc, getNoise, i) =>
        acc.set(CellDescriptors[i], unitizeNoise(getNoise(point.x, point.y))),
      new Map()
    );
  };
});
export const cellSize = writable(19.297);
export const anchor = writable<{ pointer: Point; position: Point } | false>(
  false
);
zoom.subscribe(() => {
  let firstCell = window.document.querySelector("li");
  if (!firstCell) return;
  cellSize.set(parseFloat(window.getComputedStyle(firstCell).width));
});
