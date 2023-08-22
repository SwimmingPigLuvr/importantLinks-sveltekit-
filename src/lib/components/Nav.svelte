<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { blur } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import { page } from '$app/stores';

    function isActive(path: string) {
        // Check if the current page path matches the given path
        return $page.url.pathname === path;
    }


    export let username = '';
    let openNav = false;

    function toggleNav() {
        openNav = !openNav
    }
</script>

  <AuthCheck>
    <div class="fixed top-0 right-0 p-2 flex z-50">


    {#if !openNav}
      <button 
        on:mouseenter={() => toggleNav()}
        in:blur={{ amount: 100, delay: 200, duration: 500, easing: cubicInOut }}
        out:blur={{ amount: 100, duration: 500, easing: cubicInOut }}
        class="m-auto text-5xl">☯︎</button>
    {:else}
    <button 
      on:mouseleave={() => toggleNav()}
      class="fixed top-0 right-2 flex flex-col items-end justify-center p-2 space-y-1 text-sm">
      <a 
        in:blur={{ amount: 100, delay: 0, duration: 500, easing: cubicInOut }}
        out:blur={{ amount: 100, duration: 500, easing: cubicInOut }}
        href="/{username}" 
        class:active={isActive(`/${username}`)}
        class="flex filter hover:invert">
        <p class="m-auto">
          Home
        </p>
      </a>
      <a 
        in:blur={{ amount: 100, delay: 100, duration: 700, easing: cubicInOut }}
        out:blur={{ amount: 100, duration: 500, easing: cubicInOut }}
        href="/{username}/edit" 
        class:active={isActive(`/${username}/edit`)}
        class="flex filter hover:invert">
        <p class="m-auto">
          Edit Profile
        </p>
      </a>
      <a 
        in:blur={{ amount: 100, delay: 200, duration: 900, easing: cubicInOut }}
        out:blur={{ amount: 100, duration: 500, easing: cubicInOut }}
        href="/{username}/edit/appearance" 
        class:active={isActive(`/${username}/edit/appearance`)}
        class="flex filter hover:invert">
        <p class="m-auto">
          Appearance
        </p>
      </a>
    </button>
    {/if}
    
    </div>
    
  </AuthCheck>

  <style>
    .active {
        opacity: 50%;
    }
  </style>