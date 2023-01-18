export function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

export const clamp1 = clamp.bind(null, -1, 1);

export function readLocalStorage<T>(key: string, def: T): T {
  return JSON.parse(window.localStorage.getItem(key) ?? JSON.stringify(def));
}

export function writeLocalStorage<T>(key: string, value: T) {
  return window.localStorage.setItem(key, JSON.stringify(value));
}
