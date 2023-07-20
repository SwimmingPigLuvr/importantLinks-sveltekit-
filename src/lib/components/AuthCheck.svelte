<script lang="ts">
    import { user } from "$lib/firebase";
</script>

{#if $user}
    <slot />
{:else}
    <p class="text-error">
        please login to view this page
        <a href="/login" class="btn btn-primary">sign in</a>
    </p>
{/if}