import type { Writable } from "svelte/store";
import type { CellDescriptor } from "./types";
import { CellDescriptors } from "./types";

export function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

export const clamp1 = clamp.bind(null, -1, 1);

export function persistent<U>(store: Writable<U>, key: string) {
  const initialValue = localStorage.getItem(key);
  if (initialValue !== null) store.set(JSON.parse(initialValue));
  store.subscribe((value) => localStorage.setItem(key, JSON.stringify(value)));
  return store;
}

export function prettyPrintCellDescriptor(value: Map<CellDescriptor, number>) {
  return JSON.stringify(
    CellDescriptors.reduce(
      (acc, key) => ({ ...acc, [key]: value.get(key).toString().slice(2, 4) }),
      {}
    ),
    null,
    2
  );
}

export function unitizeNoise(noise: number): number {
  return (noise + 1) / 2;
}

export function normalizeNumber(value: number, scale: number): number {
  return Math.floor(value * scale);
}

export function* range<T>(max: number, min = 0, step = 1) {
  for (let i = min; i < max; i += step) {
    yield i;
  }
}

export function lerp(t: number, ...values: number[]): number {
  const numValues = values.length;
  const step = 1 / (numValues - 1);
  let lowerIndex = Math.floor(t / step);
  let upperIndex = lowerIndex + 1;
  if (upperIndex >= numValues) upperIndex = lowerIndex;
  const t0 = lowerIndex * step;
  const t1 = upperIndex * step;
  const v0 = values[lowerIndex];
  const v1 = values[upperIndex];
  const tn = (t - t0) / (t1 - t0);
  return (1 - tn) * v0 + tn * v1;
}

export function rgb2h([r, g, b]: number[]): number {
  return (
    ((Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180) / Math.PI +
      360) %
    360
  );
}
