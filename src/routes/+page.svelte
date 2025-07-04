<script lang="ts">
    import { 
        getMoodModifier, 
        getWeatherModifier, 
        getDistanceAptitudeModifiers,
        getStrategyAptitudeModifiers,
        calculateRealSpeed,
		calculateRealStamina,
        calculateRealPower,
		calculateRealGuts,
		calculateRealWit
    } from '$lib/statsCalculator';
    import {
        moods,
        aptitudes,
        conditions,
        strategies,
        surfaces, 
        distances,
        type Aptitude, 
        type Mood, 
		type Strategy,
		type Surface,
		type Condition
    } from '$lib/constants';
    import { round } from '$lib/utils';

    import Dropdown from '$lib/dropdown.svelte';
	import { 
        calculateAcceleration, 
        calculateBaseSpeed, 
        calculateDistanceInMeters, 
        calculateStartingDashDuration, 
        calculateStartingDashHitPointsConsumption, 
        calculateTargetSpeed, 
        getStageModifiers, 
        getSurfaceAptitudeModifier, 
        startingDashInitialSpeed 
    } from '$lib/startingDashCalculator';
	import type { InputData } from '$lib/modifierTypes';

    let inputData: InputData = {
        stats: {
            speed: 1200,
            stamina: 800,
            power: 1000,
            guts: 400,
            wit: 1000
        },
        surfaceAptitudes: {
            turf: 'A',
            dirt: 'A'
        },
        distanceAptitudes: {
            sprint: 'S',
            mile: 'A',
            medium: 'A',
            long: 'A'
        },
        strategyAptitudes: {
            front: 'A',
            pace: 'A',
            late: 'A',
            end: 'A'
        },
        mood: 'Great',
        strategy: 'Front',
        surface: 'Turf',
        condition: 'Firm',
        distance: '2000'
    }

    function getTrackLength() {
        return distances[parseInt(inputData.distance)];
    };

    function getRealSpeed(): number {
        return calculateRealSpeed(
            inputData.stats.speed, 
            getMoodModifier(inputData.mood), 
            getWeatherModifier(inputData.surface, inputData.condition), 
            getDistanceAptitudeModifiers(getTrackLength(), inputData.distanceAptitudes)
        );
    }

    function getRealStamina(): number {
        return calculateRealStamina(
            inputData.stats.stamina, 
            getMoodModifier(inputData.mood)
        );
    }

    function getRealPower(): number {
        return calculateRealPower(
            inputData.stats.power, 
            getMoodModifier(inputData.mood), 
            getWeatherModifier(inputData.surface, inputData.condition), 
            getDistanceAptitudeModifiers(getTrackLength(), inputData.distanceAptitudes)
        );
    }

    function getRealGuts(): number {
        return calculateRealGuts(
            inputData.stats.guts,
            getMoodModifier(inputData.mood)
        );
    }

    function getRealWit(): number {
        return calculateRealWit(
            inputData.stats.wit,
            getMoodModifier(inputData.mood),
            getStrategyAptitudeModifiers(inputData.strategy, inputData.strategyAptitudes).acceleration
        );
    }

    function getBaseSpeed(): number {
        return calculateBaseSpeed(parseInt(inputData.distance));
    }

    function getTargetSpeed(): number {
        return calculateTargetSpeed(getBaseSpeed())
    }

    function getStartingDashAcceleration(): number {
        const stageModifiers = getStageModifiers(inputData.strategy);
        return calculateAcceleration(
            getRealPower(),
            stageModifiers.accelerationCorrection.early,
            getDistanceAptitudeModifiers(getTrackLength(), inputData.distanceAptitudes).acceleration,
            getSurfaceAptitudeModifier(inputData.surface, inputData.surfaceAptitudes)
        );
    }

    function getStartingDashTimeInSeconds() : number {
        return calculateStartingDashDuration(
            getRealPower(), 
            parseInt(inputData.distance),
            getStageModifiers(inputData.strategy).accelerationCorrection.early,
            getDistanceAptitudeModifiers(getTrackLength(), inputData.distanceAptitudes).acceleration,
            getSurfaceAptitudeModifier(inputData.surface, inputData.surfaceAptitudes)
        );
    }

    function getStartingDashDistanceInMeters(): number {
        return calculateDistanceInMeters(
            getTargetSpeed(),
            getStartingDashTimeInSeconds()
        );
    }

    function getStartingdashHitPointsConsumption(): number {
        return calculateStartingDashHitPointsConsumption(
            getStartingDashTimeInSeconds(),
            inputData.surface,
            inputData.condition
        );
    }
</script>

<svelte:head>
    <title>UmaCalc</title> 
</svelte:head>

<h1 class="text-3xl font-semibold text-center mb-6">UmaCalc</h1>

<div class="bg-surface w-4/5 mx-auto">
    <table class="table-auto w-4/5 mx-auto border-separate border-spacing-y-4">
        <!-- ——— Stats group ——— -->
         <tbody>
            <tr>
                <th class="px-4 pt-2 text-center">Speed</th>
                <th class="px-4 pt-2 text-center">Stamina</th>
                <th class="px-4 pt-2 text-center">Power</th>
                <th class="px-4 pt-2 text-center">Guts</th>
                <th class="px-4 pt-2 text-center">Wit</th>
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
                <th class="px-4 pt-2 text-center">Turf</th>
                <th class="px-4 pt-2 text-center">Dirt</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.surfaceAptitudes.turf }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.surfaceAptitudes.dirt }/>
                </td>
            </tr>
        </tbody>

        <!-- ——— Distance group ——— -->
        <tbody>
            <tr>
                <th class="px-4 pt-2 text-center">Sprint</th>
                <th class="px-4 pt-2 text-center">Mile</th>
                <th class="px-4 pt-2 text-center">Medium</th>
                <th class="px-4 pt-2 text-center">Long</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.distanceAptitudes.sprint }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.distanceAptitudes.mile }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.distanceAptitudes.medium }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.distanceAptitudes.long }/>
                </td>
            </tr>
        </tbody>

        <!-- ——— Pace group ——— -->
        <tbody>
            <tr>
                <th class="px-4 pt-2 text-center">Front</th>
                <th class="px-4 pt-2 text-center">Pace</th>
                <th class="px-4 pt-2 text-center">Late</th>
                <th class="px-4 pt-2 text-center">End</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.strategyAptitudes.front }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.strategyAptitudes.pace }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.strategyAptitudes.late }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ inputData.strategyAptitudes.end }/>
                </td>
            </tr>
        </tbody>

        <tbody>
            <tr>
                <th class="px-4 pt-2 text-center">Mood</th>
                <th class="px-4 pt-2 text-center">Strategy</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ moods } bind:value={ inputData.mood }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ strategies } bind:value={ inputData.strategy }/>
                </td>
            </tr>
        </tbody>
        
        <tbody>
            <tr>
                <th class="px-4 pt-2 text-center">Surface</th>
                <th class="px-4 pt-2 text-center">Condition</th>
                <th class="px-4 pt-2 text-center">Distance</th>
                <th class="px-4 pt-2 text-center">Length</th>
            </tr>
            <tr>
                <td class="px-4 pb-2">
                    <Dropdown options={ surfaces } bind:value={ inputData.surface }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ conditions } bind:value={ inputData.condition }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ Object.keys(distances) } bind:value={ inputData.distance }/>
                </td>
                <td class="px-4 pb-2 text-center">
                    { getTrackLength() }
                </td>
            </tr>
        </tbody>
    </table>
</div>

<h1 class="text-3xl font-semibold text-center mb-6">Results</h1>

<div class="bg-surface w-4/5 mx-auto">
    <table class="table-auto w-4/5 mx-auto border-separate border-spacing-y-4">
        <tbody>
            <tr>
                <th class="px-4 pt-2 text-center">Speed</th>
                <th class="px-4 pt-2 text-center">Stamina</th>
                <th class="px-4 pt-2 text-center">Power</th>
                <th class="px-4 pt-2 text-center">Guts</th>
                <th class="px-4 pt-2 text-center">Wit</th>
            </tr>
            <tr>
                <td class="px-4 pb-2 text-center">{ round(getRealSpeed()) }</td>
                <td class="px-4 pb-2 text-center">{ round(getRealStamina()) }</td>
                <td class="px-4 pb-2 text-center">{ round(getRealPower()) }</td>
                <td class="px-4 pb-2 text-center">{ round(getRealGuts()) }</td>
                <td class="px-4 pb-2 text-center">{ round(getRealWit()) }</td>
            </tr>
        </tbody>
    </table>
</div>

<h1 class="text-3xl font-semibold text-center mb-6">DEBUG</h1>

<div class="bg-surface w-4/5 mx-auto">
    <table class="table-auto w-4/5 mx-auto border-separate border-spacing-y-4">
        <tbody>
            <tr>
                <th class="px-4 pt-2 text-center">Base Speed</th>
                <th class="px-4 pt-2 text-center">Initial HP</th>
                <th class="px-4 pt-2 text-center">HP with Recovery</th>
            </tr>
            <tr>
                <td class="px-4 pb-2 text-center">{ calculateBaseSpeed(parseInt(inputData.distance)) }</td>
                <td class="px-4 pb-2 text-center"></td>
                <td class="px-4 pb-2 text-center"></td>
            </tr>
        </tbody>
    </table>

    <table class="table-auto w-4/5 mx-auto border-separate border-spacing-y-4">
        <tbody>
            <tr>
                <th class="p2-4 pt-2 text-center"> </th>
                <th class="p2-4 pt-2 text-center">Initial Speed [m/s]</th>
                <th class="p2-4 pt-2 text-center">Base Speed</th>
                <th class="p2-4 pt-2 text-center">Target Speed [m/s]</th>
                <th class="p2-4 pt-2 text-center">Acceleration [m/s^2]</th>
                <th class="p2-4 pt-2 text-center">Time [s]</th>
                <th class="p2-4 pt-2 text-center">Distance [m]</th>
                <th class="p2-4 pt-2 text-center">HP Consumption</th>
            </tr>
            <tr>
                <td class="p2-4 pb-2 text-center">Starting Dash</td>
                <td class="p2-4 pb-2 text-center">{ startingDashInitialSpeed }</td>
                <td class="p2-4 pb-2 text-center">{ round(getBaseSpeed(), 2) }</td>
                <td class="p2-4 pb-2 text-center">{ round(getTargetSpeed(), 3) }</td>
                <td class="p2-4 pb-2 text-center">{ round(getStartingDashAcceleration(), 3) }</td>
                <td class="p2-4 pb-2 text-center">{ round(getStartingDashTimeInSeconds(), 3) }</td>
                <td class="p2-4 pb-2 text-center">{ round(getStartingDashDistanceInMeters(), 3) }</td>
                <td class="p2-4 pb-2 text-center">{ round(getStartingdashHitPointsConsumption(), 2) }</td>
            </tr>
        </tbody>
    </table>
</div>