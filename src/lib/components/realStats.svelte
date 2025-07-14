<script lang="ts">
	import type { Stats } from "$lib/types";
	import LabeledGridCell from "./labeledGridCell.svelte";

    export let stats: Stats;
</script>

<h2 class="text-2xl font-semibold text-center my-4">Real Stats</h2>
<div class="grid grid-cols-5">
    <LabeledGridCell label="Speed" value={ stats.speed } />
    <LabeledGridCell label="Stamina" value={ stats.stamina } />
    <LabeledGridCell label="Power" value={ stats.power } />
    <LabeledGridCell label="Guts" value={ stats.guts } />
    <LabeledGridCell label="Wit" value={ stats.wit } />
</div>