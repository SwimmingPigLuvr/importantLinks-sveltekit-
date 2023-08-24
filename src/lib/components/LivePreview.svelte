<script lang="ts">
    import { onMount } from "svelte";
    import UserLink from "./UserLink.svelte";
    import { fly } from "svelte/transition";
    import { backOut } from "svelte/easing";
  import { convert, type CustomTheme } from "$lib/theme";

  // customTHeme prop
  export let customTheme: CustomTheme;

  // user data
  export let username: string = '';
  export let photoURL: string = '';
  export let bio: string = '';
  export let links: any[] = [];
  export let theme: string = '';

  let background = '';
  let font = '';
  let fontColor = '';
  let fontColorHex = convert(fontColor);

  if (customTheme) {
    background = customTheme.background.value;
    font = customTheme.font.family;
    fontColor = customTheme.font.color;
  }


  

  let showPreview = false;

  let mounted = false;
    
  function togglePreview() {
    showPreview = !showPreview;
  }

  $: previewMode = !showPreview;

  onMount(() => { 
    
    mounted = true;
    console.log('mounted');

    function handleResize() {
      if (window.innerWidth >= 768) {
        showPreview = false
      }
    }
    
    window.addEventListener('resize', handleResize);

    handleResize();
    console.log('showPreview: ', showPreview)

    

        
      }
  );
    

    

</script>

<!-- toggle button -->
<button 
  on:click={() => {
    togglePreview();
    console.log('showPreview? ', showPreview);
  }}
  class="md:invisible z-50 fixed bottom-6 left-1/2 text-info-content -translate-x-1/2 bg-info hover:bg-accent duration-300 ease-in-out transition-all transform font-totally-gothic text-5xl p-4 px-8 rounded-full">
    <p class="m-auto">
      {#if !showPreview}
        👀
      {:else}
         🙈
      {/if}
    </p>
  </button>
<!-- end toggle button -->


  

{#if mounted}
<!-- preview -->
<div 
    class={`${showPreview? 'visible' : 'hidden'} md:flex md:w-[38%] bg-accent fixed right-0 justify-center items-center h-screen z-40`}
    >
    <!-- phone div -->
    <div 
        in:fly={{ x: -50, duration: 1000, easing: backOut }}
        data-theme={theme}
        style="{showPreview? 'width: 100vw; height: 100vh' : 'width: 30vw; min-width: 190px; min-height: 380px; max-height: 600px; max-width: 300px;'}" 
        class="{showPreview? 'border-none rounded-none w-screen' : 'border-black border-[0.75rem] rounded-[33px]'} bg-{background? background : 'primary'} flex flex-col justify-start overflow-auto">
        <div style="padding-top: 205%; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="p-4">

      <div 
      style={`color: ${fontColorHex}`}
      class="flex flex-col items-center mt-8 mb-4 font-{font}">
        <!-- pfp -->
        <img class="min-w-[38px] min-h-[38px] max-h-[88px] max-w-[88px]"  src="{photoURL}" alt="pfp">
        <!-- Username -->
        <p class="text-[1rem]">@{username? username : 'error fetching username'}</p>
        <!-- bio -->
        <p class="text-[0.75rem] text-center">{bio? bio : 'error retrieving bio'}</p>
      </div>
        <!-- links -->
        <ul>
          {#each links as link}
            <li class="m-auto py-[0.33rem]">
              <UserLink 
                iconURL={link.iconURL} 
                title={link.title}
                url={link.url}
                customTheme={customTheme}
              />
            </li>
          {/each}
        </ul>
            </div>
        </div>
    </div>
  </div>
  <!-- preview end -->
  {/if}

<!-- why isnt the customTheme being reflected in the livepreview? -->

<!-- find out where the error is -->