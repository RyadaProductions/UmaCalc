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

    import Dropdown from '$lib/components/dropdown.svelte';
	import type { InputData, Result } from '$lib/types';
	import { calculate } from '$lib/mainCalculator';
	import LabeledInputField from '$lib/components/labeledInputField.svelte';
	import LabeledDropdownCombo from '$lib/components/labeledDropdownCombo.svelte';
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

    function getTrackLength() {
        return distanceMap[parseInt(inputData.distance)];
    };

    function onCalculateClicked() {
        result = calculate(inputData);
    }

    function hasEnoughStamina() {
        if (result.realStats.stamina + 1 < result.requiredStamina) {
            return 'Not enough stamina/guts';
        }

        if (result.realStats.stamina / result.requiredStamina < 1.1 && result.requiredStamina >= 0) {
            return 'Borderline';
        }

        return 'You have enough';
    }
</script>

<svelte:head>
    <title>UmaCalc</title> 
</svelte:head>

<h1 class="font-dynamic-splash text-3xl font-semibold text-center mb-6">UmaCalc</h1>

<div class="w-4/5 mx-auto py-6">
    <div class="mx-auto w-2/3 grid grid-cols-5 gap-2 mb-6">
        <LabeledInputField label="Speed" bind:value={ inputData.stats.speed } />
        <LabeledInputField label="Stamina" bind:value={ inputData.stats.stamina } />
        <LabeledInputField label="Power" bind:value={ inputData.stats.power } />
        <LabeledInputField label="Guts" bind:value={ inputData.stats.guts } />
        <LabeledInputField label="Wit" bind:value={ inputData.stats.wit } />
    </div>
    <div class="mx-auto w-2/3 mb-6">
        <LabeledDropdownCombo label="Track" option1={ surfaces } bind:value1={ inputData.surface } option2={ aptitudes } bind:value2={ inputData.surfaceAptitude } />
        <LabeledDropdownCombo label="Distance" option1={ Object.keys(distanceMap) } bind:value1={ inputData.distance } option2={ aptitudes } bind:value2={ inputData.distanceAptitude } />
        <LabeledDropdownCombo label="Style" option1={ strategies } bind:value1={ inputData.strategy } option2={ aptitudes } bind:value2={ inputData.strategyAptitude } />
        <LabeledDropdownCombo label="Misc" option1={ moods } bind:value1={ inputData.mood } option2={ conditions } bind:value2={ inputData.condition } />
    </div>
    <div class="mx-auto w-2/3 grid grid-cols-4 gap-2 mb-6">
        <LabeledInputField label="Gold skills" showGrade={false} bind:value={ inputData.skills.goldRecovery } />
        <LabeledInputField label="White skills" showGrade={false} bind:value={ inputData.skills.whiteRecovery } />
        <LabeledInputField label="2* or below uniques" showGrade={false} bind:value={ inputData.skills.uniqueRecoveryTwoStarsOrBelow } />
        <LabeledInputField label="3* or above uniques" showGrade={false} bind:value={ inputData.skills.uniqueRecoveryThreeStarsOrAbove } />
    </div>
</div>

<div class="w-4/5 mx-auto mb-6">
    <input type="button" value="Calculate" on:click={ onCalculateClicked } class="w-full bg-amber-500 font-semibold py-2 px-4 rounded" />
</div>

{#if result}

<div class="w-4/5 mx-auto flex flex-col items-center">
    <h2 class="text-2xl font-semibold text-center my-4">Real Stats</h2>
    <div class="w-4/5 flex flex-col">
        <div class="grid grid-cols-5">
            <div>
                <p class="text-center font-bold">Speed</p>
                <p class="text-center">{ round(result.realStats.speed) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Stamina</p>
                <p class="text-center">{ round(result.realStats.stamina) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Power</p>
                <p class="text-center">{ round(result.realStats.power) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Guts</p>
                <p class="text-center">{ round(result.realStats.guts) }</p>
            </div>
            <div>
                <p class="text-center font-bold">Wit</p>
                <p class="text-center">{ round(result.realStats.wit) }</p>
            </div>
        </div>
        <h2 class="text-2xl font-semibold text-center my-4">Results</h2>
        <div class="grid grid-cols-4">
            <div>
                <p class="text-center font-bold">Stamina Needed</p>
                <p class="text-center">{ round(result.requiredStamina) }</p>
            </div>
            <div class="items-center">
                <p class="text-center font-bold">{ hasEnoughStamina() }</p>
            </div>
            <div>
                <p class="text-center font-bold">Skill proc rate</p>
                <p class="text-center">{ round(result.skillProcRate, 2) }%</p>
            </div>
            <div>
                <p class="text-center font-bold">Rushed rate</p>
                <p class="text-center">{ round(result.rushedRate, 2) }%</p>
            </div>
        </div>
    </div>

    <label class="my-4">
        <input type="checkbox" bind:checked={ showDebugData }/>
        Show debug data
    </label>
</div>

{#if showDebugData}
<div class="w-4/5 mx-auto py-6">
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

    <table class="table-auto w-4/5 mx-auto border-collapse">
        <tbody>
            <tr>
                <th class="p2-4 text-center"> </th>
                <th class="p2-4 text-center border-x">Initial Speed [m/s]</th>
                <th class="p2-4 text-center border-x">Target Speed [m/s]</th>
                <th class="p2-4 text-center border-x">Acceleration [m/s^2]</th>
                <th class="p2-4 text-center border-x">Time [s]</th>
                <th class="p2-4 text-center border-x">Distance [m]</th>
                <th class="p2-4 text-center border-x">HP Consumption</th>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">Starting Dash</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.startingDash.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.startingDash.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.startingDash.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.startingDash.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.startingDash.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.startingDash.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">phase 0 Acceleration</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">phase 0 Steady</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseZeroSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">phase 1 Acceleration</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">phase 1 Steady</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseOneSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">phase 2 Acceleration</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">phase 2, 3 Steady</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">Last Spurt Acceleration</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">Last Spurt Steady</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.lastSpurtSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">HP0 / Deceleration</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">Ideal Last Spurt Acceleration</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left border-x">Ideal Last Spurt Steady</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right border-x">{ round(result.detailedBreakdown.idealLastSpurtSteady.hpConsumption, 2) }</td>
            </tr>
        </tbody>
    </table>
</div>
{/if}

{/if}

<p class="w-full text-center">
    UmaCalc is not affiliated with the developers of Uma Musume. All the materials from the Uma Musume game are copyrights of Cygames, Inc.
</p>