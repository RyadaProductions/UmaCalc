<script lang="ts">
	import Dropdown from "./dropdown.svelte";

    /**  
     * @prop label  – the label text
     * @prop value  – two-way bound value for text or number
     * @prop isNumber  – only allow number inputs
     */
    export let label: string;
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


<div class="flex items-center my-1">
    <div class="p-1 text-xl font-semibold rounded-t w-1/5">{label}</div>
    <div class="border border-green-500 rounded flex w-2/5">
        <Dropdown options={ option1 } bind:value={ value1 }/>
        <Dropdown options={ option2 } bind:value={ value2 }/>
    </div>
</div>