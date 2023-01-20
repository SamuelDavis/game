<script lang="ts">
  import type { Point } from "./types";
  import { writable } from "svelte/store";
  import { getCell } from "./store.js";

  export let parent: HTMLOListElement;
  export let point: Point;

  const top = writable("0px");
  const left = writable("0px");
  const width = writable("0px");

  $: $top = parent.offsetTop + "px";
  $: $left = parent.offsetLeft + "px";
  $: $width = parent.clientWidth + "px";
  $: cell = Array.from($getCell(point).entries());
</script>

<div style:--top={$top} style:--left={$left} style:--width={$width}>
  <pre>{JSON.stringify(cell, null, 2)}</pre>
</div>

<style>
  :root {
    --top: 0px;
    --left: 0px;
    --width: 0px;
  }
  div {
    position: absolute;
    top: var(--top);
    left: calc(var(--left) + var(--width));
    background-color: rgba(155, 155, 155, 0.75);
    min-width: 5em;
    min-height: 10em;
  }
</style>
