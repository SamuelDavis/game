<script lang="ts">
  import { writable } from "svelte/store";
  import type { Point } from "./types";
  import { getColor, getElevation, getNeighbors } from "./generation.js";
  import { clamp, clamp1, readLocalStorage, writeLocalStorage } from "./util";
  import { debounce } from "lodash/fp";

  const zoomMax = 20;
  const zoomMin = 1;
  const zoom = writable<number>(readLocalStorage("zoom", 1));
  zoom.subscribe((zoom) => writeLocalStorage("zoom", zoom));
  const position = writable<Point>(
    readLocalStorage("position", { x: 0, y: 0 })
  );
  position.subscribe((position) => writeLocalStorage("position", position));

  $: basis = $zoom * 2 + 1;
  $: $zoom = clamp(zoomMin, zoomMax, $zoom);

  function onWheel(e: WheelEvent) {
    $zoom += e.deltaY < 0 ? -1 : 1;
  }

  const onPan = debounce(5)((e: MouseEvent) => {
    const { buttons, movementX, movementY } = e;
    if (buttons !== 1) return;
    position.update(({ x, y }) => ({
      x: x + -clamp1(movementX),
      y: y + -clamp1(movementY),
    }));
  });

  function onResetPosition() {
    $position = { x: 0, y: 0 };
  }
</script>

<svelte:window on:wheel={onWheel} />

<header>
  <label>
    zoom: <input type="range" bind:value={$zoom} min={zoomMin} max={zoomMax} />
    <output>{$zoom}</output>
  </label>
  <button on:click={onResetPosition}>reset</button>
  <label>
    Position:
    {JSON.stringify($position)}
  </label>
</header>

<ol style={`--basis:${basis};`} on:mousemove={onPan}>
  {#each Array.from(getNeighbors($position, $zoom)) as point (`${point.x},${point.y}`)}
    <li style={`--color:${getColor(getElevation(point))}`} />
  {/each}
</ol>

<style>
  ol {
    user-select: none;
    --basis: 0;
    display: grid;
    grid-template-columns: repeat(var(--basis), 1fr);

    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    user-select: none;
    --color: white;
    background-color: var(--color);
    aspect-ratio: 1;
  }
</style>
