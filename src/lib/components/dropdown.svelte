<script lang="ts">
  /**  
   * @prop options  – the list of choices, can be a readonly array
   * @prop value    – two-way bound selected value  
   */
  export let options: readonly (string|number)[] = [];
  export let value: string|number;
</script>

<select
  bind:value
  class="w-full px-3 py-1 bg-white font-semibold"
>
  {#each options as opt}
    <option value={opt}>{opt}</option>
  {/each}
</select>