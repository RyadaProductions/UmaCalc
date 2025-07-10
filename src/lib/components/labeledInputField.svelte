<script lang="ts">
    /**  
     * @prop label  – the label text
     * @prop value  – two-way bound value for text or number
     * @prop showGrade - determines if we should show the grade based on the number
     * @prop max - the maximum allowed value of the input field
     */
    export let label: string;
    export let value: number;
    export let showGrade: boolean = true;
    export let max: number = 1200;

    let min: number = 0;

    let grade: string = '';
    let gradeClass: string = '';
    
    let inputElement: HTMLInputElement;

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

    function handleClick() {
        inputElement?.focus();
        inputElement?.select();
    }
</script>

<button on:click="{handleClick}" tabindex="-1" class="cursor-text">
    <div class="bg-green-50 rounded text-center">
        <div class="p-1 text-xs font-semibold bg-green-500 rounded-t text-white">{label}</div>
        <div class="flex items-baseline justify-center space-x-1 pl-2 md:pl-0">
            {#if showGrade}<span class="{gradeClass} text-xl font-bold">{grade}</span>{/if}
            <input bind:this={ inputElement } 
                class="w-12 bg-transparent text-center text-sm font-semibold focus:outline-none no-spinner" 
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                name="speed"
                bind:value
                on:click|stopPropagation 
                on:focus={handleClick}/>
        </div>
    </div>
</button>