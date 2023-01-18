import type { Writable } from "svelte/store";

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
