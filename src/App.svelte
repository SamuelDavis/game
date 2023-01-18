<script lang="ts">
  import { getColor, getElevation, getNeighbors } from "./generation.js";
  import { clamp1 } from "./util";
  import { zoomMax, zoomMin } from "./config";
  import { position, zoom, gridColumns, seed, getNoise } from "./store";

  function onWheel(e: WheelEvent) {
    $zoom += e.deltaY < 0 ? -1 : 1;
  }

  const onPan = (e: MouseEvent) => {
    const { buttons, movementX, movementY } = e;
    if (buttons !== 1) return;
    position.update(({ x, y }) => ({
      x: x + -clamp1(movementX),
      y: y + -clamp1(movementY),
    }));
  };

  function onResetPosition() {
    $position = { x: 0, y: 0 };
  }

  function onChangeSeed() {
    $seed = prompt("New seed value", $seed) ?? $seed;
  }
</script>

<svelte:window on:wheel={onWheel} />

<main>
  <header>
    <label>
      zoom: <input
        type="range"
        bind:value={$zoom}
        min={zoomMin}
        max={zoomMax}
      />
      <output>{zoomMax - $zoom + 1}</output>
    </label>
    <span>
      Seed: {@html $seed.replace(/\s/g, "&nbsp;")}
      <button on:click={onChangeSeed}>change</button>
    </span>
    <span>
      Position:
      {JSON.stringify($position)}
      <button on:click={onResetPosition}>reset</button>
    </span>
  </header>

  <hr />

  <ol style={`--grid-columns:${$gridColumns};`} on:pointermove={onPan}>
    {#each Array.from(getNeighbors($position, $zoom)) as point (`${point.x},${point.y}`)}
      <li style={`--color:${getColor(getElevation($getNoise, point))}`} />
    {/each}
  </ol>
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  ol {
    touch-action: none;
    user-select: none;
    --grid-columns: 0;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), 1fr);

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
