<script lang="ts">
	import { gradeColors, thresholds } from "$lib/constants";
	import { stopPropagation } from "svelte/legacy";

    /**  
     * @prop label  – the label text
     * @prop value  – two-way bound value for text or number
     * @prop showGrade - determines if we should show the grade based on the number
     * @prop min - the minimum allowed value of the input field
     * @prop max - the maximum allowed value of the input field
     */
    interface Props {
        label: string,
        value: number,
        showGrade?: boolean,
        min?: number,
        max?: number
    }
    let {
        label = '',
        value = $bindable(),
        showGrade = true,
        min = 0,
        max = 1200
    }: Props = $props();
      
    let inputElement: HTMLInputElement;

    let grade: string = $derived(thresholds.find(([min]) => value >= min)?.[1] ?? '');
    let gradeClass: string = $derived(gradeColors[grade] ?? 'text-gray-800');

    $effect(() => {
        if (value < min) value = min;
        if (value > max) value = max;
    });

    function handleClick() {
        inputElement?.focus();
        inputElement?.select();
    }
</script>

<button onclick="{handleClick}" tabindex="-1" class="cursor-text">
    <div class="bg-green-50 rounded text-center">
        <div class="p-1 text-xs font-semibold bg-green-500 rounded-t text-white">{label}</div>
        <div class="flex items-baseline justify-center space-x-1 pl-2 md:pl-0">
            {#if showGrade}
                <span class="{gradeClass} text-xl font-bold">{grade}</span>
            {/if}
            <input bind:this={ inputElement } 
                class="w-12 bg-transparent text-center text-sm font-semibold focus:outline-none no-spinner" 
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                name="speed"
                bind:value
                onfocus={handleClick}/>
        </div>
    </div>
</button>