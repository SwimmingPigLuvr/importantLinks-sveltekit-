<script lang="ts">
  import { onMount } from "svelte";
  import UserLink from "./UserLink.svelte";
  import { fly, blur, fade, slide } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import type { CustomTheme, Gradient, Color, Image, RepeatValue, PositionValue, Border, BorderImage, Fill, Shadow, Title, Effect, TitleFont, Font } from "$lib/theme";


  // user's customTheme settings 
  export let customTheme: CustomTheme;

  // user's data
  export let username: string = '';
  export let photoURL: string = '';
  export let bio: string = '';
  export let links: any[] = [];
  export let theme: string = '';

  let element: HTMLElement;

  let previewMode: boolean = true;

  let background: {
    gradient: Gradient;
    hex: string | undefined;
    image: Image;
    opacity: number;
    style: string;
  }

  let link: {
    border: Border;
    fill: Fill;
    radius: string;
    shadow: Shadow;
    title: Title;
  };

  let font: Font;

  $: if (customTheme) {
    background = customTheme.background;
    font = customTheme.font;
    link = customTheme.link;
  }

  // gradient constructors
  let gradient;
  // gradient values
  let fromHex: string;
  let fromOpacity: number;
  let toHex: string;
  let toOpacity: number;
  let direction: string;

  $: if (background?.style === 'background-gradient') {
    gradient = background?.gradient;
    fromHex = gradient?.from?.hex;
    fromOpacity = gradient?.from?.opacity;
    toHex = gradient?.to?.hex;
    toOpacity = gradient?.to?.opacity;
    direction = gradient?.direction;
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

  let newClasses: string[] = [];
  let combinedClass: string;
  let combinedStyle: string;
  let rootStyle;

  // $: if (background?.style === 'solid-background') {
  //   // newClasses.push
  // }

  $: if (background) {
    rootStyle = document.documentElement.style;
    newClasses = [];
    newClasses.push(background?.style ?? 'no background style?');
    combinedClass = newClasses.join(' ');
    console.log('LIVEPREVIEW_ newClasses: ', newClasses);
    console.log('LIVEPREVIEW_ combined class: ', combinedClass);

    // background-solid
    rootStyle.setProperty('--background-color', background?.hex || 'hsl(var(--s))');
    // background-gradient
    rootStyle.setProperty('--background-gradient-direction', direction || '0deg');
    rootStyle.setProperty('--background-gradient-from', fromHex || 'hsl(var(--a))');
    rootStyle.setProperty('--background-gradient-to', toHex || 'hsl(var(--s))');
    // background-image
    rootStyle.setProperty('--background-url', `url(${background.image.url})` || `url('/static/linkDefault.png')`);
    rootStyle.setProperty('--background-position', background?.image?.position || 'center');
    rootStyle.setProperty('--background-size', background?.image?.size || 'cover');
    rootStyle.setProperty('--background-repeat', background?.image?.repeat || 'no-repeat');
  }


  onMount(() => { 
      mounted = true;
      

      function handleResize() {
        if (window.innerWidth >= 768) {
          showPreview = false
        }
      }
      window.addEventListener('resize', handleResize);
      handleResize(); 
      

      
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
        bind:this={element}
        class={`
          ${showPreview ? 'full-preview' : 'small-preview'} common-preview ${combinedClass}
        `}>
        <div style="padding-top: 205%; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="p-4">

    <!-- preview container -->
    {#if !showData}
    <div
      in:blur={{ delay: 300, amount: 100, duration: 1000, easing: backOut }}
    >

      <div 
      style={`color: ${font?.hex? font?.hex : 'hsl(var(--p))'}`}
      class="flex flex-col space-y-1 items-center mt-8 mb-4 font-{font?.family}">
        <!-- pfp -->
        <img class="min-w-[30px] min-h-[30px] max-h-[72px] max-w-[72px]"  src="{photoURL}" alt="pfp">
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
                previewMode={previewMode}
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
          bg-${link?.fill?.hex} fixed top-0 left-1/2 -translate-x-1/2 w-screen h-screen flex
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
  
  <h1 id="custom" class="hover:text-accent text-secondary-content absolute bottom-6 left-1/2 -translate-x-[40%] px-2 z-10 font-blix text-[1rem]">Magic<span class="font-oblique">Hat</span> 🎩🪄</h1>




            </div>
        </div>
    </div>
  </div>
  <!-- preview end -->
  {/if}

<style>



</style>