<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { blur, slide } from "svelte/transition";
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

    

    <!-- nav -->
    <div data-theme={'black'} class="bg-opacity-0 font-mono text-accent fixed top-0 right-2 flex z-50">


    {#if !openNav}
      <button 
        on:mouseenter={() => toggleNav()}
        in:blur={{ amount: 100, delay: 200, duration: 500, easing: cubicInOut }}
        class=" m-auto text-5xl relative text-accent-focus">☯︎</button>
    {:else}
    <button 
      in:slide
      out:slide
      on:mouseleave={() => toggleNav()}
      class="fixed bg-lime-500 top-0 right-4 flex flex-col items-end justify-end space-y-1 ">
      
      <a 
        href="/{username}/edit" 
        class:active={isActive(`/${username}/edit`)}
        class="flex filter hover:text-primary text-sm">
        <p class="">
          Edit Profile
        </p>
      </a>
      <a 
        href="/{username}/edit/appearance" 
        class:active={isActive(`/${username}/edit/appearance`)}
        class="flex filter hover:text-primary text-sm">
        <p class="">
          Appearance
        </p>
      </a>
      <a 
        href="/{username}" 
        class:active={isActive(`/${username}`)}
        class="flex w-full filter hover:text-primary text-sm border-2 border-black">
        <p class="">
          magic.hat/{username}
        </p>
      </a>
    </button>
    {/if}
    
    </div>
    
  </AuthCheck>

  <style>
    .active {
        text-decoration-style: double;
    }
  </style>