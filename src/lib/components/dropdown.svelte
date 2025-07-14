<script lang="ts">
  interface Props {
    options: readonly (string|number)[];
    value: string|number;
  }

  let {
    options = [],
    value = $bindable()
  }: Props = $props();
</script>

<select
  bind:value
  class="w-full px-3 py-1 bg-white font-semibold hover:cursor-pointer"
>
  {#each options as opt}
    <option value={opt}>{opt}</option>
  {/each}
</select>