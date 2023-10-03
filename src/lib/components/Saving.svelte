<script lang="ts">
    export let saving: boolean;
    export let saveSuccess: boolean;
</script>

<div class="fixed z-50 bottom-2 right-2 w-20 h-10 bg-success text-success-content">
    {#if saving}
        <img src="/icons/nerdEmoji.gif" alt="nerd emoji" height="100px" width="100px">
        <p>saving...</p>
    {/if}
    {#if saveSuccess}
        <img src="/icons/gigaBubble.png" alt="giga bubble" height="100px" width="100px" class="rounded-full">
        <p>saved successfully</p>
    {/if}
</div>