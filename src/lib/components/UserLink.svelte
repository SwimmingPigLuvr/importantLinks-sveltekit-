<script lang="ts">
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import { fade, fly, slide } from "svelte/transition";
    let mounted = false;
    export let iconURL = 'ha';
    export let icon = 'default';
    export let url = 'foo';
    export let title = 'some cool title';
    let userFont = 'elven';

  onMount(() => {
    setTimeout(() => {
      mounted = true;
    }, 0);
  });
</script>

    {#if mounted}
<a 
  in:fade={{delay: 100, duration: 1000}}
  href="{url}" class="m-auto hover:translate-x-1 hover:translate-y-1 stack w-full max-w-[94%] md:max-w-2xl text-center bg-black flex justify-between items-center p-[0.4rem] border-[0.1rem] no-underline relative">
    <img 
      
      src={iconURL} 
      alt={icon} 
      class="w-12 h-12">
    <span 
      in:fade={{delay: 1000, duration: 1000}}
      class={`text-[1rem] absolute text-white font-${userFont} text-center`}>{title}</span>
</a>
    {/if}