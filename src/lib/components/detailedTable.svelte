<script lang="ts">
	import type { Result } from "$lib/types";
	import DetailedTableGroup from "./detailedTableGroup.svelte";

    interface Props {
        result: Result;
    }

    let {
        result
    }: Props = $props();
</script>

<div class="w-full mx-auto flex flex-col items-center py-6 lg:w-4/5">
    <!-- Table -->
    <div class="w-full mx-auto overflow-x-auto lg:w-full">
        <div class="min-w-[800px]">
            <!-- header -->
            <div class="flex items-center bg-gray-100 font-semibold">
                <div class="w-1/5 pl-4 font-medium text-gray-700 flex-shrink-0"></div>
                <div class="flex-1 text-center pr-4">Initial Speed [m/s]</div> 
                <div class="flex-1 text-center pr-4">Target Speed [m/s]</div>
                <div class="flex-1 text-center pr-4">Acceleration [m/s²]</div>
                <div class="flex-1 text-center pr-4">Time [s]</div>
                <div class="flex-1 text-center pr-4">Distance [m]</div>
                <div class="flex-1 text-center pr-4">HP Consumption</div>
            </div>

            <DetailedTableGroup label="Starting Dash" data={ result.detailedBreakdown.startingDash } />
            <DetailedTableGroup label="Early Acceleration" data={ result.detailedBreakdown.phaseZeroAcceleration } />
            <DetailedTableGroup label="Early Steady" data={ result.detailedBreakdown.phaseZeroSteady } />
            <DetailedTableGroup label="Middle Acceleration" data={ result.detailedBreakdown.phaseOneAcceleration } />
            <DetailedTableGroup label="Middle Steady" data={ result.detailedBreakdown.phaseOneSteady } />
            <DetailedTableGroup label="Late Acceleration" data={ result.detailedBreakdown.phaseTwoAcceleration } />
            <DetailedTableGroup label="Late Steady" data={ result.detailedBreakdown.phaseTwoAndThreeSteady } />
            <DetailedTableGroup label="Last Spurt Acceleration" data={ result.detailedBreakdown.lastSpurtAcceleration } />
            <DetailedTableGroup label="Last Spurt Steady" data={ result.detailedBreakdown.lastSpurtSteady } />
            <DetailedTableGroup label="HP0 / Deceleration" data={ result.detailedBreakdown.hitPointsZeroDeceleration } />
            <br/>
            <DetailedTableGroup label="Ideal Last Spurt Acceleration" data={ result.detailedBreakdown.idealLastSpurtAcceleration } />
            <DetailedTableGroup label="Ideal Last Spurt Steady" data={ result.detailedBreakdown.idealLastSpurtSteady } />
        </div>
    </div>
</div>