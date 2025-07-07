<script lang="ts">
    import {
        moods,
        aptitudes,
        conditions,
        strategies,
        surfaces, 
        distanceMap,
    } from '$lib/constants';
    import { round } from '$lib/utils';

	import type { InputData, Result } from '$lib/types';
	import { calculate } from '$lib/mainCalculator';
	import LabeledInputField from '$lib/components/labeledInputField.svelte';
	import LabeledDropdownCombo from '$lib/components/labeledDropdownCombo.svelte';
	import LabeledGridCell from '$lib/components/labeledGridCell.svelte';
	import DetailedTableGroup from '$lib/components/detailedTableGroup.svelte';
    let result: Result;
    let showDebugData = false;

    let inputData: InputData = {
        stats: {
            speed: 1200,
            stamina: 800,
            power: 1000,
            guts: 400,
            wit: 1000
        },
        surface: 'Turf',
        surfaceAptitude: 'A',
        distance: '2000',
        distanceAptitude: 'A',
        strategy: 'Front',
        strategyAptitude: 'A',
        mood: 'Great',
        condition: 'Firm',
        skills: {
            goldRecovery: 0,
            whiteRecovery: 0,
            uniqueRecoveryTwoStarsOrBelow: 0,
            uniqueRecoveryThreeStarsOrAbove: 0
        }
    }

    function getTrackLength(): string {
        return distanceMap[parseInt(inputData.distance)];
    };

    function onCalculateClicked(): void {
        result = calculate(inputData);
    }

    function hasEnoughStamina(): string {
        if (result.realStats.stamina + 1 < result.requiredStamina) {
            return 'Not enough stamina/guts';
        }

        if (result.realStats.stamina / result.requiredStamina < 1.1 && result.requiredStamina >= 0) {
            return 'Borderline';
        }

        return 'You have enough stamina!';
    }

    function getResultColor(): string {
        if (result.realStats.stamina + 1 < result.requiredStamina) {
            return 'text-red-600';
        }

        if (result.realStats.stamina / result.requiredStamina < 1.1 && result.requiredStamina >= 0) {
            return 'text-orange-400';
        }

        return 'text-green-600';
    }
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
    <div class="mx-auto w-full mb-6 md:w-5/6 lg:w-2/3">
        <LabeledDropdownCombo label="Track" option1={ surfaces } bind:value1={ inputData.surface } option2={ aptitudes } bind:value2={ inputData.surfaceAptitude } />
        <LabeledDropdownCombo label="Distance" extraLabel={ getTrackLength() } option1={ Object.keys(distanceMap) } bind:value1={ inputData.distance } option2={ aptitudes } bind:value2={ inputData.distanceAptitude } />
        <LabeledDropdownCombo label="Style" option1={ strategies } bind:value1={ inputData.strategy } option2={ aptitudes } bind:value2={ inputData.strategyAptitude } />
        <LabeledDropdownCombo label="Mood/Condition" option1={ moods } bind:value1={ inputData.mood } option2={ conditions } bind:value2={ inputData.condition } />
    </div>
    <div class="mx-auto w-full grid grid-cols-4 gap-2 mb-6 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Gold skills" showGrade={false} bind:value={ inputData.skills.goldRecovery } />
        <LabeledInputField label="White skills" showGrade={false} bind:value={ inputData.skills.whiteRecovery } />
        <LabeledInputField label="2* or below uniques" showGrade={false} bind:value={ inputData.skills.uniqueRecoveryTwoStarsOrBelow } />
        <LabeledInputField label="3* or above uniques" showGrade={false} bind:value={ inputData.skills.uniqueRecoveryThreeStarsOrAbove } />
    </div>
</div>

<div class="w-full mx-auto mb-6 px-2 md:w-4/5">
    <input type="button" value="Calculate" on:click={ onCalculateClicked } class="block mx-auto w-full bg-amber-400 font-semibold py-2 rounded md:w-5/6 lg:w-2/3 hover:cursor-pointer" />
</div>

{#if result}

<div class="w-full mx-auto flex flex-col items-center md:w-5/6 lg:w-2/3">
    <h2 class="text-2xl font-semibold text-center my-4">Real Stats</h2>
    <div class="w-full md:w-4/5 flex flex-col gap-2">
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
            <p class="{ getResultColor() } text-center text-2xl font-bold self-center">{ hasEnoughStamina() }</p>
        </div>
        <div class="grid grid-cols-2">
            <LabeledGridCell label="Skill proc rate" value={ result.skillProcRate } decimals={2} valueSuffix="%" />
            <LabeledGridCell label="Rushed rate" value={ result.rushedRate } decimals={2} valueSuffix="%" />
        </div>
    </div>

    <label class="my-4">
        <input type="checkbox" bind:checked={ showDebugData }/>
        Show debug data
    </label>
</div>

{#if showDebugData}
<div class="w-full mx-auto flex flex-col items-center py-6 lg:w-4/5">
    <div class="w-full flex flex-col md:w-4/5">
        <div class="grid grid-cols-5 mb-4">
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
            <div>
                <p class="text-center font-bold">Last Spurt Distance</p>
                <p class="text-center">{ round(result.lastSpurtDistance, 2) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Last Spurt HP Coefficient</p>
                <p class="text-center">{ round(result.lastSpurtHitPointsConsumptionCoefficient, 2) }</p>
            </div>
        </div>
        
        <div class="grid grid-cols-2 mb-6">
            <div>
                <p class="text-center font-bold">Target hitpoints for Last Spurt</p>
                <p class="text-center">{ round(result.targetHitPointsForLastSpurt, 2) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Required Stamina</p>
                <p class="text-center">{ result.requiredStamina }</p>
            </div>
        </div>
    </div>
    <div class="w-full mx-auto overflow-x-auto lg:w-full">
        <div class="min-w-[800px]">
            <!-- header  flex border-y border-gray-200 py-2 -->
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
            <DetailedTableGroup label="phase 0 Acceleration" data={ result.detailedBreakdown.phaseZeroAcceleration } />
            <DetailedTableGroup label="phase 0 Steady" data={ result.detailedBreakdown.phaseZeroSteady } />
            <DetailedTableGroup label="phase 1 Acceleration" data={ result.detailedBreakdown.phaseOneAcceleration } />
            <DetailedTableGroup label="phase 1 Steady" data={ result.detailedBreakdown.phaseOneSteady } />
            <DetailedTableGroup label="phase 2 Acceleration" data={ result.detailedBreakdown.phaseTwoAcceleration } />
            <DetailedTableGroup label="phase 2, 3 Steady" data={ result.detailedBreakdown.phaseTwoAndThreeSteady } />
            <DetailedTableGroup label="Last Spurt Acceleration" data={ result.detailedBreakdown.lastSpurtAcceleration } />
            <DetailedTableGroup label="Last Spurt Steady" data={ result.detailedBreakdown.lastSpurtSteady } />
            <DetailedTableGroup label="HP0 / Deceleration" data={ result.detailedBreakdown.hitPointsZeroDeceleration } />
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