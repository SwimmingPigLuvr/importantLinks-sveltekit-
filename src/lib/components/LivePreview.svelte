<script lang="ts">
    import { onMount } from "svelte";
    import UserLink from "./UserLink.svelte";
    import { fly, blur, fade, slide } from "svelte/transition";
    import { backOut } from "svelte/easing";
  import type { CustomTheme } from "$lib/theme";

  // customTHeme prop
  export let customTheme: CustomTheme;

  // user data
  export let username: string = '';
  export let photoURL: string = '';
  export let bio: string = '';
  export let links: any[] = [];
  export let theme: string = '';

  let background: {
    style: string,
    value: string,
    opacity: number,
    hex: string | undefined,
  }

  let font: {
    family: string,
    value: string,
    opacity: number,
    hex: string | undefined,
  }

  let link: {
    radius: string;
    fill: {
      isVisible: boolean;
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    border: {
      isVisible: boolean;
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    shadow: {
      isVisible: boolean;
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    title: {
      value: string;
      opacity: number;
      hex: string | undefined;
      size: number;
      tracking: string;
      effect: string;
      onHover: boolean;
    }
  }

  $: if (customTheme) {
    background = customTheme.background;
    font = customTheme.font;
    link = customTheme.link;
  }

  let gradient: string[];
  // gradient values
  let fromHex: string;
  let toHex: string;
  let direction: string;

  $: if (background?.style === 'gradient') {
    // split the background var into from, to, direction
    gradient = background.value.split(', ');
    fromHex = gradient[0];
    toHex = gradient[1];
    direction = gradient[2];

    console.log('🐉' + fromHex, toHex, direction);
  }


  let showData = false;
  let showPreview = false;

  let mounted = false;
    
  function togglePreview() {
    showPreview = !showPreview;
  }

  function toggleShowData() {
    showData = !showData;
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
<div 
class="md:invisible z-50 fixed bottom-6 left-1/2 text-info-content -translate-x-1/3 bg-info hover:bg-accent duration-300 ease-in-out transition-all transform font-totally-gothic text-5xl p-6 px-8 rounded-full">
  <button 
    on:click={() => {
      togglePreview();
      console.log('showPreview? ', showPreview);
    }}>
    <p class="m-auto">
      {#if !showPreview}
        👀
      {:else}
         <div class="tooltip tooltip-success" data-tip="Back">
          <button>🙈</button>
         </div>
         <div class="tooltip tooltip-info" data-tip={`${showData ? 'Hide Data' : 'Data'}`}>
          <button
            on:click|stopPropagation={() => {
              toggleShowData();
              console.log('showData? ', showData);
            }}>🤓</button>
         </div>
      {/if}
    </p>
  </button>
</div>
<!-- end toggle button -->

<!-- view data button -->


<!-- end view data button -->


  

{#if mounted}
<!-- preview -->
<div 
    class={`${showPreview? 'visible' : 'hidden'} md:flex md:w-[38%] bg-accent fixed right-0 justify-center items-center h-screen z-40`}
    >
    <!-- phone div -->
    <div 
        in:fly={{ x: -50, duration: 1000, easing: backOut }}
        data-theme={theme}
        style={`
          ${showPreview? 'width: 100vw; height: 100vh' : 'width: 30vw; min-width: 190px; min-height: 380px; max-height: 600px; max-width: 300px;'} 
          color: ${font?.hex? font?.hex : `hsl(var(--a))`}; 
          ${background?.style === 'image' ? `background-image: url(${background.value}); background-size: 100% 100%; background-repeat: no-repeat; background-position: top;` : ''} 
          ${background?.style === 'solid' ? `background-color: ${background?.hex? background?.hex : `hsl(var(--s))`};` : ''}
          ${background?.style === 'gradient' ? `background: linear-gradient(${direction}, ${fromHex}, ${toHex});` : ''}
        `}
        class="{showPreview? 'border-none rounded-none w-screen' : 'border-black border-[0.75rem] rounded-[33px]'} flex flex-col justify-start overflow-auto">
        <div style="padding-top: 205%; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="p-4">

    <!-- preview container -->
    {#if !showData}
    <div
      in:blur={{ delay: 300, amount: 100, duration: 1000, easing: backOut }}
    >

      <div 
      style={`color: ${font?.hex? font?.hex : 'hsl(var(--p))'}`}
      class="flex flex-col items-center mt-8 mb-4 font-{font?.family}">
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
            <li class="m-auto py-[0.5rem]">
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
      {:else}
      <!-- data container -->
      <div
        in:fade={{duration: 1000, easing: backOut}}
        out:fade={{duration: 1000, easing: backOut}}
        style={`
          
        `}
        class={`
          ${link?.radius === 'full' ? `rounded-full` : ''}
          ${link?.radius === 'half' ? `rounded-[0.5rem]` : ''}
          ${link?.radius === 'none' ? `rounded-none` : ''}
          bg-${link?.fill?.value} fixed top-0 left-1/2 -translate-x-1/2 w-screen h-screen flex
        `}>
          <!-- data -->
          <div class="m-auto">
            <h1 class="font-{font} text-[2rem]">Data</h1>
            <!-- name pfp bio -->
            <div class="">
              <p>username: {username}</p>
              <p>bio: {bio}</p>
              <!-- pfp -->
              <div>
                <p>pfp:</p>
                <img src="{photoURL}" alt="">
              </div>
            </div>
            <!-- theme -->
            <p>theme: {theme}</p>
            <p>background: {background}</p>

            <!-- styles -->
          </div>

      </div>
      {/if}




            </div>
        </div>
    </div>
  </div>
  <!-- preview end -->
  {/if}

<!-- why isnt the customTheme being reflected in the livepreview? -->

<!-- find out where the error is -->