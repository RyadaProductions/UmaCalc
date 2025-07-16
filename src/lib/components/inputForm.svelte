<script lang="ts">
	import { aptitudes, conditions, distanceMap, moods, strategies, surfaces } from "$lib/constants";
	import type { InputData } from "$lib/types";
	import { getTrackLength } from "$lib/utils";
	import LabeledDropdownCombo from "./labeledDropdownCombo.svelte";
	import LabeledInputField from "./labeledInputField.svelte";
    interface Props {
        inputData: InputData;
    };

    let {
        inputData = $bindable()
    }: Props = $props();
</script>

<div class="w-full mx-auto py-6 p-2 md:w-4/5">
    <div class="mx-auto w-full grid grid-cols-5 gap-2 mb-6 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Speed" bind:value={ inputData.stats.speed } />
        <LabeledInputField label="Stamina" bind:value={ inputData.stats.stamina } />
        <LabeledInputField label="Power" bind:value={ inputData.stats.power } />
        <LabeledInputField label="Guts" bind:value={ inputData.stats.guts } />
        <LabeledInputField label="Wit" bind:value={ inputData.stats.wit } />
    </div>
    <div class="mx-auto w-full mb-2 md:w-5/6 lg:w-2/3">
        <LabeledDropdownCombo label="Track" options1={ surfaces } bind:value1={ inputData.surface } options2={ aptitudes } bind:value2={ inputData.surfaceAptitude } />
        <LabeledDropdownCombo label="Distance" extraLabel={ getTrackLength(inputData) } options1={ Object.keys(distanceMap) } bind:value1={ inputData.distance } options2={ aptitudes } bind:value2={ inputData.distanceAptitude } />
        <LabeledDropdownCombo label="Style" options1={ strategies } bind:value1={ inputData.strategy } options2={ aptitudes } bind:value2={ inputData.strategyAptitude } />
        <LabeledDropdownCombo label="Mood/Condition" options1={ moods } bind:value1={ inputData.mood } options2={ conditions } bind:value2={ inputData.condition } />
    </div>
    <h2 class="text-xl font-semibold text-center">Recovery Skills</h2>
    <div class="mx-auto w-full grid grid-cols-4 gap-2 mb-2 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Gold skills" showGrade={ false } bind:value={ inputData.skills.goldRecovery } />
        <LabeledInputField label="White skills" showGrade={ false } bind:value={ inputData.skills.whiteRecovery } />
        <LabeledInputField label="unique <= 2* level" showGrade={ false } max={ 5 } bind:value={ inputData.skills.uniqueRecoveryLevelTwoStarsOrBelow } />
        <LabeledInputField label="unique >= 3* level" showGrade={ false } max={ 6 } bind:value={ inputData.skills.uniqueRecoveryLevelThreeStarsOrAbove } />
    </div>
    <!-- TODO: Move this into it's own seperate part -->
    <h2 class="text-xl font-semibold text-center">Condition Skills</h2>
    <h3 class="text-l font-semibold text-center">Single Circle</h3>
    <div class="mx-auto w-full grid grid-cols-6 gap-2 mb-2 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Speed" showGrade={ false } bind:value={ inputData.skills.singleCircle.speed } />
        <LabeledInputField label="Stamina" showGrade={ false } bind:value={ inputData.skills.singleCircle.stamina } />
        <LabeledInputField label="Power" showGrade={ false } bind:value={ inputData.skills.singleCircle.power } />
        <LabeledInputField label="Guts" showGrade={ false } bind:value={ inputData.skills.singleCircle.guts } />
        <LabeledInputField label="Wit" showGrade={ false } bind:value={ inputData.skills.singleCircle.wit } />
        <LabeledInputField label="All" showGrade={ false } bind:value={ inputData.skills.singleCircle.all } />
    </div>
    <h3 class="text-l font-semibold text-center">Double Circle</h3>
    <div class="mx-auto w-full grid grid-cols-6 gap-2 mb-2 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Speed" showGrade={ false } bind:value={ inputData.skills.doubleCircle.speed } />
        <LabeledInputField label="Stamina" showGrade={ false } bind:value={ inputData.skills.doubleCircle.stamina } />
        <LabeledInputField label="Power" showGrade={ false } bind:value={ inputData.skills.doubleCircle.power } />
        <LabeledInputField label="Guts" showGrade={ false } bind:value={ inputData.skills.doubleCircle.guts } />
        <LabeledInputField label="Wit" showGrade={ false } bind:value={ inputData.skills.doubleCircle.wit } />
        <LabeledInputField label="All" showGrade={ false } bind:value={ inputData.skills.doubleCircle.all } />
    </div>
</div>