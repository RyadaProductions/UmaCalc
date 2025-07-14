<script lang="ts">
    import {
        moods,
        aptitudes,
        conditions,
        strategies,
        surfaces, 
        distanceMap,
		DEFAULT_INPUT,
    } from '$lib/constants';
    import { getResultColor, getTrackLength, hasEnoughStamina, round } from '$lib/utils';

	import type { InputData, Result } from '$lib/types';
	import { calculate } from '$lib/mainCalculator';
	import LabeledInputField from '$lib/components/labeledInputField.svelte';
	import LabeledDropdownCombo from '$lib/components/labeledDropdownCombo.svelte';
	import LabeledGridCell from '$lib/components/labeledGridCell.svelte';
	import DetailedTableGroup from '$lib/components/detailedTableGroup.svelte';
    let result: Result;
    let showDetailedData = false;

    let inputData = { ...DEFAULT_INPUT }; 

    $: result = calculate(inputData);
</script>

<svelte:head>
    <title>UmaCalc</title> 
</svelte:head>

<h1 class="font-dynamic-splash text-3xl font-semibold text-center mb-6">UmaCalc</h1>

<div class="w-full mx-auto py-6 p-2 md:w-4/5">
    <div class="mx-auto w-full grid grid-cols-5 gap-2 mb-6 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Speed" bind:value={ inputData.stats.speed } />
        <LabeledInputField label="Stamina" bind:value={ inputData.stats.stamina } />
        <LabeledInputField label="Power" bind:value={ inputData.stats.power } />
        <LabeledInputField label="Guts" bind:value={ inputData.stats.guts } />
        <LabeledInputField label="Wit" bind:value={ inputData.stats.wit } />
    </div>
    <div class="mx-auto w-full mb-2 md:w-5/6 lg:w-2/3">
        <LabeledDropdownCombo label="Track" option1={ surfaces } bind:value1={ inputData.surface } option2={ aptitudes } bind:value2={ inputData.surfaceAptitude } />
        <LabeledDropdownCombo label="Distance" extraLabel={ getTrackLength(inputData) } option1={ Object.keys(distanceMap) } bind:value1={ inputData.distance } option2={ aptitudes } bind:value2={ inputData.distanceAptitude } />
        <LabeledDropdownCombo label="Style" option1={ strategies } bind:value1={ inputData.strategy } option2={ aptitudes } bind:value2={ inputData.strategyAptitude } />
        <LabeledDropdownCombo label="Mood/Condition" option1={ moods } bind:value1={ inputData.mood } option2={ conditions } bind:value2={ inputData.condition } />
    </div>
    <h2 class="text-xl font-semibold text-center">Recovery Skills</h2>
    <div class="mx-auto w-full grid grid-cols-4 gap-2 mb-2 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Gold skills" showGrade={ false } bind:value={ inputData.skills.goldRecovery } />
        <LabeledInputField label="White skills" showGrade={ false } bind:value={ inputData.skills.whiteRecovery } />
        <LabeledInputField label="unique <= 2* level" showGrade={ false } max={ 5 } bind:value={ inputData.skills.uniqueRecoveryLevelTwoStarsOrBelow } />
        <LabeledInputField label="unique >= 3* level" showGrade={ false } max={ 6 } bind:value={ inputData.skills.uniqueRecoveryLevelThreeStarsOrAbove } />
    </div>
</div>

{#if result}

<div class="w-full mx-auto flex flex-col items-center md:w-5/6 lg:w-2/3">
    <h2 class="text-2xl font-semibold text-center my-4">Real Stats</h2>
    <div class="w-full flex flex-col gap-2 md:w-4/5">
        <div class="grid grid-cols-5">
            <LabeledGridCell label="Speed" value={ result.realStats.speed } />
            <LabeledGridCell label="Stamina" value={ result.realStats.stamina } />
            <LabeledGridCell label="Power" value={ result.realStats.power } />
            <LabeledGridCell label="Guts" value={ result.realStats.guts } />
            <LabeledGridCell label="Wit" value={ result.realStats.wit } />
        </div>

        <h2 class="text-2xl font-semibold text-center">Results</h2>
        <div class="grid grid-cols-2">
            <LabeledGridCell label="Stamina Needed" value={ result.requiredStamina } />
            <p class="{ getResultColor(result) } text-center text-2xl font-bold self-center">{ hasEnoughStamina(result) }</p>
        </div>
        <div class="grid grid-cols-2">
            <LabeledGridCell label="Skill proc rate" value={ result.skillProcRate } decimals={ 2 } valueSuffix="%" />
            <LabeledGridCell label="Rushed rate" value={ result.rushedRate } decimals={ 2 } valueSuffix="%" />
        </div>
    </div>

    <label class="my-4">
        <input type="checkbox" bind:checked={ showDetailedData }/>
        Show detailed data
    </label>
</div>

{#if showDetailedData}
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
{/if}

{/if}

<p class="w-full text-center">
    UmaCalc is not affiliated with the developers of Uma Musume. All the materials from the Uma Musume game are copyrights of Cygames, Inc.
</p>