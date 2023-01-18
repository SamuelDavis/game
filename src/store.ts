import { derived, writable } from "svelte/store";
import { persistent } from "./util";
import type { Point } from "./types";
import { zoomMax, zoomMin } from "./config";

export const zoom = persistent(writable(1), "zoom");
export const position = persistent(writable<Point>({ x: 0, y: 0 }), "position");
zoom.subscribe((value) => {
  if (value < zoomMin) return zoom.set(zoomMin);
  if (value > zoomMax) return zoom.set(zoomMax);
});
export const gridColumns = derived([zoom], ([zoom]) => zoom * 2 + 1);
