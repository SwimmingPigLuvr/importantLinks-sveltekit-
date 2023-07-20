<script lang="ts">
  import { page } from "$app/stores";
  import { backIn, backInOut, backOut, cubicIn, cubicInOut, cubicOut } from "svelte/easing";
  import { fade, fly, scale } from "svelte/transition";
</script>

<!-- key rebuilds children when $page.url changes -->
{#key $page.url} 
    <div in:fly={{ x: '-7%', duration: 1000, easing: cubicOut}}>
        <slot />
    </div>
{/key}