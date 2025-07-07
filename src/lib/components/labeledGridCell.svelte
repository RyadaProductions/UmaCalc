<script lang="ts">
	import { round } from "$lib/utils";

    export let label: string;
    export let value: number;
    export let decimals: number = 0;
    export let valueSuffix: string = '';
</script>
<div>
    <p class="text-center font-bold">{label}</p>
    <p class="text-center">{ round(value, decimals) }{ valueSuffix }</p>
</div>