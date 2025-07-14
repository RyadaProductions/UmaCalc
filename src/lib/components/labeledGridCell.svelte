<script lang="ts">
	import { round } from "$lib/utils";

    interface Props {
        label: string;
        value: number;
        decimals?: number;
        valueSuffix?: string;
    }

    let {
        label,
        value,
        decimals = 0,
        valueSuffix = ''
    }: Props = $props();
</script>
<div>
    <p class="text-center font-bold">{ label }</p>
    <p class="text-center">{ round(value, decimals) }{ valueSuffix }</p>
</div>