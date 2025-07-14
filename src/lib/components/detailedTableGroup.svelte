<script lang="ts">
	import type { PhaseData } from "$lib/types";
	import { round } from "$lib/utils";

    interface Props {
        label: string;
        data: PhaseData;
    }

    let {
        label,
        data
    }: Props = $props();
</script>

<div class="flex items-center border-y border-gray-200 py-2">
    <!-- fixed width for label -->
    <div class="w-1/5 pl-4 font-medium text-gray-700 flex-shrink-0">{label}</div>

    <!-- each stat gets an equal share of the remaining space -->
    <div class="flex-1 text-right pr-4 flex-shrink-0">{round(data.initialSpeed, 3)}</div>
    <div class="flex-1 text-right pr-4 flex-shrink-0">{round(data.targetSpeed, 3)}</div>
    <div class="flex-1 text-right pr-4 flex-shrink-0">{round(data.acceleration, 3)}</div>
    <div class="flex-1 text-right pr-4 flex-shrink-0">{round(data.duration, 3)}</div>
    <div class="flex-1 text-right pr-4 flex-shrink-0">{round(data.distance, 2)}</div>
    <div class="flex-1 text-right pr-4 flex-shrink-0">{round(data.hpConsumption, 2)}</div>
</div>