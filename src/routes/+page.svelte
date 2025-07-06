<script lang="ts">
    import {
        moods,
        aptitudes,
        conditions,
        strategies,
        surfaces, 
        distanceMap,
		distances,
    } from '$lib/constants';
    import { round } from '$lib/utils';

    import Dropdown from '$lib/dropdown.svelte';
	import type { InputData, Result } from '$lib/types';
	import { calculate } from '$lib/mainCalculator';
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

<div class="bg-surface w-4/5 mx-auto py-6">
    <table class="table-auto w-4/5 mx-auto border-separate">
        <!-- ——— Stats group ——— -->
         <tbody>
            <tr>
                <th class="px-4 text-center">Speed</th>
                <th class="px-4 text-center">Stamina</th>
                <th class="px-4 text-center">Power</th>
                <th class="px-4 text-center">Guts</th>
                <th class="px-4 text-center">Wit</th>
            </tr>
            <tr>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="speed" min=0 max=1200 bind:value={ inputData.stats.speed } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="stamina" min=0 max=1200 bind:value={ inputData.stats.stamina } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="power" min=0 max=1200 bind:value={ inputData.stats.power } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="guts" min=0 max=1200 bind:value={ inputData.stats.guts } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="wit" min=0 max=1200 bind:value={ inputData.stats.wit } />
                </td>
            </tr>
         </tbody>

        <!-- ——— Surface group ——— -->
        <tbody>
            <tr>
                <th class="px-4 text-center">Surface</th>
                <th class="px-4 text-center">Aptitude</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ surfaces } bind:value={ inputData.surface }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.surfaceAptitude }/>
                </td>
            </tr>
        </tbody>

        <!-- ——— Distance group ——— -->
        <tbody>
            <tr>
                <th class="px-4 text-center">Distance</th>
                <th class="px-4 text-center">Aptitude</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ Object.keys(distanceMap) } bind:value={ inputData.distance }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.distanceAptitude }/>
                </td>
            </tr>
        </tbody>

        <!-- ——— Pace group ——— -->
        <tbody>
            <tr>
                <th class="px-4 text-center">Strategy</th>
                <th class="px-4 text-center">Aptitude</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ strategies } bind:value={ inputData.strategy }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.strategyAptitude }/>
                </td>
            </tr>
        </tbody>

        <tbody>
            <tr>
                <th class="px-4 text-center">Mood</th>
                <th class="px-4 text-center">Condition</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ moods } bind:value={ inputData.mood }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ conditions } bind:value={ inputData.condition }/>
                </td>
            </tr>
        </tbody>
        
        <tbody>
            <tr>
                <th class="px-4 text-center">Distance</th>
                <th class="px-4 text-center">Length</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ surfaces } bind:value={ inputData.surface }/>
                </td>
                <td class="px-4 pb-2 text-center">
                    { getTrackLength() }
                </td>
            </tr>
        </tbody>
        
        <tbody>
            <tr>
                <th class="px-4 text-center">Gold Skills</th>
                <th class="px-4 text-center">White Skills</th>
                <th class="px-4 text-center">2* or below Uniques</th>
                <th class="px-4 text-center">3* or above Uniques</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="speed" min=0 max=1200 bind:value={ inputData.skills.goldRecovery } />
                </td>
                <td class="px-4 pb-2">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="speed" min=0 max=1200 bind:value={ inputData.skills.whiteRecovery } />
                </td>
                <td class="px-4 pb-2">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="speed" min=0 max=1200 bind:value={ inputData.skills.uniqueRecoveryTwoStarsOrBelow } />
                </td>
                <td class="px-4 pb-2 text-center">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="speed" min=0 max=1200 bind:value={ inputData.skills.uniqueRecoveryThreeStarsOrAbove } />
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div class="w-4/5 mx-auto my-6">
    <input type="button" value="Calculate" on:click={ onCalculateClicked } class="w-full bg-accent-amber font-semibold py-2 px-4 rounded" />
</div>

{#if result}

<h1 class="text-3xl font-semibold text-center mb-6">Results</h1>

<div class="bg-surface w-4/5 mx-auto py-6">
    <table class="table-auto w-4/5 mx-auto border-separate">
        <tbody>
            <tr>
                <th class="px-4 text-center">Speed</th>
                <th class="px-4 text-center">Stamina</th>
                <th class="px-4 text-center">Power</th>
                <th class="px-4 text-center">Guts</th>
                <th class="px-4 text-center">Wit</th>
            </tr>
            <tr>
                <td class="px-4 pb-2 text-center">{ round(result.realStats.speed) }</td>
                <td class="px-4 pb-2 text-center">{ round(result.realStats.stamina) }</td>
                <td class="px-4 pb-2 text-center">{ round(result.realStats.power) }</td>
                <td class="px-4 pb-2 text-center">{ round(result.realStats.guts) }</td>
                <td class="px-4 pb-2 text-center">{ round(result.realStats.wit) }</td>
            </tr>
        </tbody>
        <tbody>
            <tr>
                <th class="px-4 text-center">Stamina Needed</th>
                <th class="px-4 text-center"></th>
                <th class="px-4 text-center">Skill proc rate</th>
                <th class="px-4 text-center">Rushed rate</th>
            </tr>
            <tr>
                <td class="px-4 pb-2 text-center">{ round(result.requiredStamina) }</td>
                <td class="px-4 pb-2 text-center">{ hasEnoughStamina() }</td>
                <td class="px-4 pb-2 text-center">{ round(result.skillProcRate, 2) }%</td>
                <td class="px-4 pb-2 text-center">{ round(result.rushedRate, 2) }%</td>
            </tr>
        </tbody>
    </table>

    <label>
        <input type="checkbox" bind:checked={ showDebugData }/>
        Show debug data
    </label>
</div>

{#if showDebugData}
<h1 class="text-3xl font-semibold text-center mb-6">DEBUG</h1>

<div class="bg-surface w-4/5 mx-auto py-6">
    <table class="table-auto w-4/5 mx-auto border-separate">
        <tbody>
            <tr>
                <th class="px-4 text-center">Base Speed [m/s]</th>
                <th class="px-4 text-center">Initial HP</th>
                <th class="px-4 text-center">HP with Recovery</th>
                <th class="px-4 text-center">Last Spurt Distance</th>
                <th class="px-4 text-center">Last Spurt HP Coefficient</th>
            </tr>
            <tr>
                <td class="px-4 pb-2 text-center">{ round(result.baseSpeed, 2) }</td>
                <td class="px-4 pb-2 text-center">{ round(result.initialHitPoints, 2)}</td>
                <td class="px-4 pb-2 text-center">{ round(result.hitPointsWithRecovery, 2)}</td>
                <td class="px-4 pb-2 text-center">{ round(result.lastSpurtDistance, 2)}</td>
                <td class="px-4 pb-2 text-center">{ round(result.lastSpurtHitPointsConsumptionCoefficient, 2)}</td>
            </tr>
        </tbody>
        <tbody>
            <tr>
                <th class="px-4 text-center">Target hitpoints for Last Spurt</th>
                <th class="px-4 text-center">Required Stamina</th>
            </tr>
            <tr>
                <td class="px-4 pb-2 text-center">{ round(result.targetHitPointsForLastSpurt, 2)}</td>
                <td class="px-4 pb-2 text-center">{ result.requiredStamina }</td>
            </tr>
        </tbody>
    </table>

    <table class="table-auto w-4/5 mx-auto border-separate border-spacing-y-4">
        <tbody>
            <tr>
                <th class="p2-4 text-center "> </th>
                <th class="p2-4 text-center">Initial Speed [m/s]</th>
                <th class="p2-4 text-center">Target Speed [m/s]</th>
                <th class="p2-4 text-center">Acceleration [m/s^2]</th>
                <th class="p2-4 text-center">Time [s]</th>
                <th class="p2-4 text-center">Distance [m]</th>
                <th class="p2-4 text-center">HP Consumption</th>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">Starting Dash</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.startingDash.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.startingDash.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.startingDash.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.startingDash.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.startingDash.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.startingDash.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">phase 0 Acceleration</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">phase 0 Steady</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseZeroSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">phase 1 Acceleration</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">phase 1 Steady</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseOneSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">phase 2 Acceleration</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">phase 2, 3 Steady</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.phaseTwoAndThreeSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">Last Spurt Acceleration</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">Last Spurt Steady</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.lastSpurtSteady.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">HP0 / Deceleration</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.hitPointsZeroDeceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">Ideal Last Spurt Acceleration</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtAcceleration.hpConsumption, 2) }</td>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-left">Ideal Last Spurt Steady</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtSteady.initialSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtSteady.targetSpeed, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtSteady.acceleration, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtSteady.timeInSeconds, 3) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtSteady.distance, 2) }</td>
                <td class="p2-4 pb-2 text-right">{ round(result.detailedBreakdown.idealLastSpurtSteady.hpConsumption, 2) }</td>
            </tr>
        </tbody>
    </table>
</div>
{/if}

{/if}

<p class="w-full text-center">
    UmaCalc is not affiliated with the developers of Uma Musume. All the materials from the Uma Musume game are copyrights of Cygames, Inc.
</p>