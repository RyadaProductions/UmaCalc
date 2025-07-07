<script lang="ts">
    /**  
     * @prop label  – the label text
     * @prop value  – two-way bound value for text or number
     */
    export let label: string;
    export let value: number;
    export let showGrade: boolean = true;

    let min = 0;
    let max = 1200;

    let grade = '';
    let gradeClass = '';

    // default grade thresholds: [minValue, Grade]
    const thresholds: [number, string][] = [
        [1100, 'SS'],
        [1000, 'S'],
        [800, 'A'],
        [600, 'B'],
        [400, 'C'],
        [300, 'D'],
        [200, 'E'],
        [100, 'F'],
        [0, 'G']
    ];

    let gradeColors: Record<string, string> = {
        SS: 'text-orange-500',
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
        // Clamp the min and max
        if (value < min) value = min;
        if (value > max) value = max;

        // Calculate grade and color
        grade = thresholds.find(([min]) => value >= min)?.[1] ?? '';
        gradeClass = gradeColors[grade] ?? 'text-gray-800';
    }
</script>


<div class="bg-green-50 rounded text-center">
    <div class="p-1 text-xs font-semibold bg-green-500 rounded-t text-white">{label}</div>
    <div class="flex items-baseline justify-center space-x-1">
        {#if showGrade}<span class="{gradeClass} text-xl font-bold">{grade}</span>{/if}
        <input class="w-12 bg-transparent text-center text-sm font-semibold focus:outline-none" type="number" name="speed" {min} {max} bind:value />
    </div>
</div>