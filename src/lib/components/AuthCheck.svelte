<script lang="ts">
    import { user, userData } from "$lib/firebase"; 

    let username, photoURL, bio, links, theme;

    $: if ($user && $userData) {
      ({ username, photoURL, bio, links, theme } = $userData);
    }
</script>

{#if $user}
    <slot />
{:else}
    <p class="text-error">
        please login to view this page
        <a href="/login" class="btn btn-primary">sign in</a>
    </p>
{/if}