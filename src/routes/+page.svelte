<script lang="ts">
    import {
		DEFAULT_INPUT,
    } from '$lib/constants';

	import type { Result } from '$lib/types';
	import { calculate } from '$lib/mainCalculator';
    import InputForm from '$lib/components/inputForm.svelte';
	import RealStats from '$lib/components/realStats.svelte';
	import SummaryResult from '$lib/components/summaryResult.svelte';
	import DetailedTable from '$lib/components/detailedTable.svelte';
	import DetailedInformation from '$lib/components/detailedInformation.svelte';

    let result: Result;
    let showDetailedData = false;

    let inputData = { ...DEFAULT_INPUT }; 

    $: result = calculate(inputData);
</script>

<svelte:head>
    <title>UmaCalc</title> 
</svelte:head>

<h1 class="font-dynamic-splash text-3xl font-semibold text-center mb-6">UmaCalc</h1>

<InputForm bind:inputData={inputData} />

{#if result}

<div class="w-full mx-auto flex flex-col items-center md:w-5/6 lg:w-2/3">
    <div class="w-full flex flex-col gap-2 md:w-4/5">
        <RealStats stats={ result.realStats } />

        <SummaryResult result={ result } />
    </div>

    <label class="my-4">
        <input type="checkbox" bind:checked={ showDetailedData }/>
        Show detailed data
    </label>
</div>

{#if showDetailedData}
    <DetailedInformation result={ result } />
    <DetailedTable result={ result } />
{/if}

{/if}

<p class="w-full text-center">
    UmaCalc is not affiliated with the developers of Uma Musume. All the materials from the Uma Musume game are copyrights of Cygames, Inc.
</p>