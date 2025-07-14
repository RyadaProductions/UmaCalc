<script lang="ts">
	import Dropdown from "./dropdown.svelte";

    interface Props {
        label: string;
        extraLabel?: string;
        options1: readonly (string|number)[];
        value1: string|number;
        options2: readonly (string|number)[];
        value2: string|number;
    }

    let {
        label = '',
        extraLabel = '',
        options1 = [],
        value1 = $bindable(),
        options2 = [],
        value2 = $bindable()
    }: Props = $props();
</script>


<div class="flex items-center my-1 space-x-2">
    <div class="text-xl font-semibold">{label}</div>
    <div class="text-sm pt-2">{extraLabel}</div>
    <div class="ml-auto flex border border-green-500 rounded w-3/5">
        <Dropdown options={ options1 } bind:value={ value1 }/>
        <Dropdown options={ options2 } bind:value={ value2 }/>
    </div>
</div>