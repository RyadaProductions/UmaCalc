<script lang="ts">
	import type { Result } from "$lib/types";
	import { round } from "$lib/utils";

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
            <div>
                <p class="text-center font-bold">Base Speed [m/s]</p>
                <p class="text-center">{ round(result.baseSpeed, 2) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Initial HP</p>
                <p class="text-center">{ round(result.initialHitPoints, 2) }</p>
            </div>
            <div>
                <p class="text-center font-bold">HP with Recovery</p>
                <p class="text-center">{ round(result.hitPointsWithRecovery, 2) }</p>
            </div>
        </div>
        
        <div class="grid grid-cols-4">
            <div>
                <p class="text-center font-bold">Target hitpoints for Last Spurt</p>
                <p class="text-center">{ round(result.targetHitPointsForLastSpurt, 2) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Required Stamina</p>
                <p class="text-center">{ result.requiredStamina }</p>
            </div>
            <div>
                <p class="text-center font-bold">Last Spurt Distance</p>
                <p class="text-center">{ round(result.lastSpurtDistance, 2) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Last Spurt HP Coefficient</p>
                <p class="text-center">{ round(result.lastSpurtHitPointsConsumptionCoefficient, 2) }</p>
            </div>
        </div>
    </div>
</div>