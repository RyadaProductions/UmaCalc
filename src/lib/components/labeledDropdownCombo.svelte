<script lang="ts">
	import Dropdown from "./dropdown.svelte";

    /**  
     * @prop label  – the label text
     * @prop extraLabel  – smaller extra label next to main label
     * @prop option1 - dropdown array for the first dropdown
     * @prop value1  – two-way bound value for text or number
     * @prop option2 - dropdown array for the second dropdown
     * @prop value2  – two-way bound value for text or number
     */
    export let label: string;
    export let extraLabel: string = '';
    export let option1: readonly (string|number)[] = [];
    export let value1: string|number;
    export let option2: readonly (string|number)[] = [];
    export let value2: string|number;

    let grade = '';
    let gradeClass = '';

    let gradeColors: Record<string, string> = {
        S: 'text-orange-500',
        A: 'text-orange-500',
        B: 'text-pink-500',
        C: 'text-green-600',
        D: 'text-blue-500',
        E: 'text-red-500',
        F: 'text-gray-500',
        G: 'text-gray-400'
    };

    $: {
        // Calculate grade and color
        gradeClass = gradeColors[grade] ?? 'text-gray-800';
    }
</script>


<div class="flex items-center my-1 space-x-2">
    <div class="text-xl font-semibold">{label}</div>
    <div class="text-sm pt-2">{extraLabel}</div>
    <div class="ml-auto flex border border-green-500 rounded w-3/5">
        <Dropdown options={ option1 } bind:value={ value1 }/>
        <Dropdown options={ option2 } bind:value={ value2 }/>
    </div>
</div>