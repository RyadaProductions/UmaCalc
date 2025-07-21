<script lang="ts">
	import type { Result } from "$lib/types";
	import { getResultColor, hasEnoughStamina } from "$lib/utils";
	import LabeledGridCell from "./labeledGridCell.svelte";

    interface Props {
        result: Result;
    }

    let {
        result
    }: Props = $props();
</script>

<h2 class="text-2xl font-semibold text-center">Results</h2>
<div class="grid grid-cols-3">
    <LabeledGridCell label="Stamina Needed" value={ result.requiredStamina } />
    <p class="{ getResultColor(result) } text-center text-2xl font-bold self-center">{ hasEnoughStamina(result) }</p>
    <LabeledGridCell label="Time to finish" value={ result.detailedBreakdown.totalProjection.duration } decimals={ 2 } valueSuffix="s" />
</div>
<div class="grid grid-cols-2">
    <LabeledGridCell label="Skill proc rate" value={ result.skillProcRate } decimals={ 2 } valueSuffix="%" />
    <LabeledGridCell label="Rushed rate" value={ result.rushedRate } decimals={ 2 } valueSuffix="%" />
</div>