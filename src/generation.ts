import type { Cell, HSLString, Point } from "./types";
import { CellPallet } from "./types";
import { lerp, normalizeNumber, rgb2h } from "./util";

export function* getNeighbors(point: Point, range = 1) {
  for (let y = point.y - range, maxY = point.y + range; y <= maxY; y++)
    for (let x = point.x - range, maxX = point.x + range; x <= maxX; x++)
      yield { x, y };
}

export function getColor(cell: Cell): HSLString {
  const height = cell.get("height");
  const temperature = cell.get("temperature");
  const humidity = cell.get("humidity");

  const h = rgb2h(
    CellPallet.get("Water").map((blue, i) =>
      lerp(
        humidity,
        CellPallet.get("Sand")[i],
        CellPallet.get("Grass")[i],
        blue
      )
    )
  );
  const s = normalizeNumber(temperature, 100);
  const l = normalizeNumber(lerp(height, 0.3, 0.8), 100);

  return `hsl(${h},${s}%,${l}%)`;
}
