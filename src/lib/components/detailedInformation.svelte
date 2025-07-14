<script lang="ts">
	import type { Result } from "$lib/types";
	import LabeledGridCell from "./labeledGridCell.svelte";

    interface Props {
        result: Result;
    }

    let {
        result
    }: Props = $props();
</script>

<div class="w-full mx-auto flex flex-col items-center md:w-5/6 lg:w-2/3">
    <div class="w-full flex flex-col gap-2 md:w-4/5">
        <div class="grid grid-cols-3">
            <LabeledGridCell label="Base Speed [m/s]" value={ result.baseSpeed } decimals={ 2 } />
            <LabeledGridCell label="Initial HP" value={ result.initialHitPoints } decimals={ 2 } />
            <LabeledGridCell label="HP with Recovery" value={ result.hitPointsWithRecovery } decimals={ 2 } />
        </div>
        
        <div class="grid grid-cols-4">
            <LabeledGridCell label="Target hitpoints for Last Spurt" value={ result.targetHitPointsForLastSpurt } decimals={ 2 } />
            <LabeledGridCell label="Required Stamina" value={ result.requiredStamina } />
            <LabeledGridCell label="Last Spurt Distance" value={ result.lastSpurtDistance } decimals={ 2 } />
            <LabeledGridCell label="Last Spurt HP Coefficient" value={ result.lastSpurtHitPointsConsumptionCoefficient } decimals={ 2 } />
        </div>
    </div>
</div>