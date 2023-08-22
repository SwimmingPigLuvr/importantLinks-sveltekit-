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
    <!-- login -->
    <div class="fixed top-0 left-0 w-10 h-10 p-2">
        <a href="/login">Login</a>
    </div>
{/if}