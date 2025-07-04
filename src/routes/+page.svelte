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

    let stats: {
        speed: number;
        stamina: number;
        power: number;
        guts: number;
        wit: number;
    } = {
        speed: 1200,
        stamina: 800,
        power: 1000,
        guts: 400,
        wit: 1000
    };
    let surfaceAptitudes: {
        turf: Aptitude;
        dirt: Aptitude
    } = { 
        turf: 'A',
        dirt: 'A' 
    };
    let distanceAptitudes: {
        sprint: Aptitude;
        mile: Aptitude;
        medium: Aptitude;
        long: Aptitude;
    } = {
        sprint: 'S',
        mile: 'A',
        medium: 'A',
        long: 'A'
    };
    let strategyAptitudes: {
        front: Aptitude;
        pace: Aptitude;
        late: Aptitude;
        end: Aptitude;
    } = {
        front: 'A',
        pace: 'A',
        late: 'A',
        end: 'A'
    };
    let selectedMood: Mood = 'Great';
    let selectedStrategy: Strategy = 'Front';
    let selectedSurface: Surface = 'Turf';
    let selectedCondition: Condition = 'Firm';
    let selectedDistance: string = '2000';

    function getTrackLength() {
        return distances[parseInt(selectedDistance)];
    };

    function getRealSpeed(): number {
        return calculateRealSpeed(
            stats.speed, 
            getMoodModifier(selectedMood), 
            getWeatherModifier(selectedSurface, selectedCondition), 
            getDistanceAptitudeModifiers(getTrackLength(), distanceAptitudes)
        );
    }

    function getRealStamina(): number {
        return calculateRealStamina(
            stats.stamina, 
            getMoodModifier(selectedMood)
        );
    }

    function getRealPower(): number {
        return calculateRealPower(
            stats.power, 
            getMoodModifier(selectedMood), 
            getWeatherModifier(selectedSurface, selectedCondition), 
            getDistanceAptitudeModifiers(getTrackLength(), distanceAptitudes)
        );
    }

    function getRealGuts(): number {
        return calculateRealGuts(
            stats.guts,
            getMoodModifier(selectedMood)
        );
    }

    function getRealWit(): number {
        return calculateRealWit(
            stats.wit,
            getMoodModifier(selectedMood),
            getStrategyAptitudeModifiers(selectedStrategy, strategyAptitudes).acceleration
        );
    }

    function getBaseSpeed(): number {
        return calculateBaseSpeed(parseInt(selectedDistance));
    }

    function getTargetSpeed(): number {
        return calculateTargetSpeed(getBaseSpeed())
    }

    function getStartingDashAcceleration(): number {
        const stageModifiers = getStageModifiers(selectedStrategy);
        return calculateAcceleration(
            getRealPower(),
            stageModifiers.accelerationCorrection.early,
            getDistanceAptitudeModifiers(getTrackLength(), distanceAptitudes).acceleration,
            getSurfaceAptitudeModifier(selectedSurface, surfaceAptitudes)
        );
    }

    function getStartingDashTimeInSeconds() : number {
        return calculateStartingDashDuration(
            getRealPower(), 
            parseInt(selectedDistance),
            getStageModifiers(selectedStrategy).accelerationCorrection.early,
            getDistanceAptitudeModifiers(getTrackLength(), distanceAptitudes).acceleration,
            getSurfaceAptitudeModifier(selectedSurface, surfaceAptitudes)
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
            selectedSurface,
            selectedCondition
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
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="speed" min=0 max=1200 bind:value={ stats.speed } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="stamina" min=0 max=1200 bind:value={ stats.stamina } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="power" min=0 max=1200 bind:value={ stats.power } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="guts" min=0 max=1200 bind:value={ stats.guts } />
                </td>
                <td class="px-4 pb-2 ">
                    <input class="w-full border border-border rounded px-3 py-2 bg-surface text-text-primary" type="number" name="wit" min=0 max=1200 bind:value={ stats.wit } />
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
                    <Dropdown options={ aptitudes } bind:value={ surfaceAptitudes.turf }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ surfaceAptitudes.dirt }/>
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
                    <Dropdown options={ aptitudes } bind:value={ distanceAptitudes.sprint }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ distanceAptitudes.mile }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ distanceAptitudes.medium }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ distanceAptitudes.long }/>
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
                    <Dropdown options={ aptitudes } bind:value={ strategyAptitudes.front }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ strategyAptitudes.pace }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ strategyAptitudes.late }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ aptitudes } bind:value={ strategyAptitudes.end }/>
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
                    <Dropdown options={ moods } bind:value={ selectedMood }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ strategies } bind:value={ selectedStrategy }/>
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
                    <Dropdown options={ surfaces } bind:value={ selectedSurface }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ conditions } bind:value={ selectedCondition }/>
                </td>
                <td class="px-4 pb-2">
                    <Dropdown options={ Object.keys(distances) } bind:value={ selectedDistance }/>
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
                <td class="px-4 pb-2 text-center">{ calculateBaseSpeed(parseInt(selectedDistance)) }</td>
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