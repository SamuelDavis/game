<script lang="ts">
  import Modal from "./Modal.svelte";
  import { getColor, getNeighbors } from "./generation.js";
  import { zoomMax, zoomMin } from "./config";
  import {
    anchor,
    cellSize,
    getCell,
    gridColumns,
    position,
    seed,
    zoom,
  } from "./store";
  import { prettyPrintCellDescriptor } from "./util.js";
  import type { Point } from "./types";
  import { writable } from "svelte/store";

  function onWheel(e: WheelEvent) {
    $zoom += e.deltaY < 0 ? -1 : 1;
  }

  function onPan(e: PointerEvent) {
    if (!$anchor) return;
    const {
      pointer: { x: x1, y: y1 },
      position: origin,
    } = $anchor;
    const { clientX: x2, clientY: y2 } = e;
    const dx = x2 - x1;
    const dy = y2 - y1;
    $position = {
      x: Math.floor(origin.x - dx / $cellSize),
      y: Math.floor(origin.y - dy / $cellSize),
    };
  }

  function onSetAnchor(e: PointerEvent) {
    $anchor = {
      pointer: { x: e.clientX, y: e.clientY },
      position: $position,
    };
  }

  function onResetAnchor() {
    $anchor = false;
  }

  function onResetPosition() {
    $position = { x: 0, y: 0 };
  }

  function onChangeSeed() {
    $seed = prompt("New seed value", $seed) ?? $seed;
  }

  const modal = writable<{ parent: HTMLOListElement; point: Point } | false>(
    false
  );

  function onOpenModal(e: PointerEvent, point: Point) {
    console.log({ e, point });
    $modal = { parent: e.target as HTMLOListElement, point };
  }

  function onCloseModal() {
    $modal = false;
  }
</script>

<svelte:window
  on:wheel={onWheel}
  on:pointerup={onResetAnchor}
  on:blur={onResetAnchor}
  on:pointermove={onPan}
  on:click={onCloseModal}
/>

<main>
  <header>
    <label>
      zoom: <output>{zoomMax - $zoom + 1}</output>
      <input type="range" bind:value={$zoom} min={zoomMin} max={zoomMax} />
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

  <ol style={`--grid-columns:${$gridColumns};`} on:pointerdown={onSetAnchor}>
    {#each Array.from(getNeighbors($position, $zoom)) as point (`${point.x},${point.y}`)}
      <li
        style={`--color:${getColor($getCell(point))};`}
        title={prettyPrintCellDescriptor($getCell(point))}
        on:click|stopPropagation={(e) => onOpenModal(e, point)}
        on:keydown|stopPropagation={(e) => onOpenModal(e, point)}
      />
    {/each}
  </ol>
</main>

{#if $modal}
  <Modal {...$modal} />
{/if}

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
