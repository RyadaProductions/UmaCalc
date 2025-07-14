<script lang="ts">
	import { aptitudes, conditions, distanceMap, moods, strategies, surfaces } from "$lib/constants";
	import type { InputData } from "$lib/types";
	import { getTrackLength } from "$lib/utils";
	import LabeledDropdownCombo from "./labeledDropdownCombo.svelte";
	import LabeledInputField from "./labeledInputField.svelte";

    export let inputData: InputData;
</script>

<div class="w-full mx-auto py-6 p-2 md:w-4/5">
    <div class="mx-auto w-full grid grid-cols-5 gap-2 mb-6 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Speed" bind:value={ inputData.stats.speed } />
        <LabeledInputField label="Stamina" value={ inputData.stats.stamina } />
        <LabeledInputField label="Power" value={ inputData.stats.power } />
        <LabeledInputField label="Guts" value={ inputData.stats.guts } />
        <LabeledInputField label="Wit" value={ inputData.stats.wit } />
    </div>
    <div class="mx-auto w-full mb-2 md:w-5/6 lg:w-2/3">
        <LabeledDropdownCombo label="Track" option1={ surfaces } bind:value1={ inputData.surface } option2={ aptitudes } bind:value2={ inputData.surfaceAptitude } />
        <LabeledDropdownCombo label="Distance" extraLabel={ getTrackLength(inputData) } option1={ Object.keys(distanceMap) } bind:value1={ inputData.distance } option2={ aptitudes } bind:value2={ inputData.distanceAptitude } />
        <LabeledDropdownCombo label="Style" option1={ strategies } bind:value1={ inputData.strategy } option2={ aptitudes } bind:value2={ inputData.strategyAptitude } />
        <LabeledDropdownCombo label="Mood/Condition" option1={ moods } bind:value1={ inputData.mood } option2={ conditions } bind:value2={ inputData.condition } />
    </div>
    <h2 class="text-xl font-semibold text-center">Recovery Skills</h2>
    <div class="mx-auto w-full grid grid-cols-4 gap-2 mb-2 md:w-5/6 lg:w-2/3">
        <LabeledInputField label="Gold skills" showGrade={ false } value={ inputData.skills.goldRecovery } />
        <LabeledInputField label="White skills" showGrade={ false } value={ inputData.skills.whiteRecovery } />
        <LabeledInputField label="unique <= 2* level" showGrade={ false } max={ 5 } value={ inputData.skills.uniqueRecoveryLevelTwoStarsOrBelow } />
        <LabeledInputField label="unique >= 3* level" showGrade={ false } max={ 6 } value={ inputData.skills.uniqueRecoveryLevelThreeStarsOrAbove } />
    </div>
</div>