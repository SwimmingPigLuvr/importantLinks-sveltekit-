<script lang="ts">
    import { onMount } from "svelte";
    import UserLink from "./UserLink.svelte";
    import { fly, blur, fade, slide } from "svelte/transition";
    import { backOut } from "svelte/easing";
  import { concatOpacity, convert, type CustomTheme } from "$lib/theme";
  import Page from "../../routes/+page.svelte";
  import { userData } from "$lib/firebase";

  // customTHeme prop
  export let customTheme: CustomTheme;

  // user data
  export let username: string = '';
  export let photoURL: string = '';
  export let bio: string = '';
  export let links: any[] = [];
  export let theme: string = '';

  let background: string;
  let bgOpacity: number;
  let backgroundStyle: "gradient" | "solid" | "image" | 'theme';
  let backgroundHex: string | undefined;
  let font: string;
  let fontColor: string;
  let fontColorHex: string | undefined;
  let buttonColor: string;

  let bgchwo: string;

  $: if (customTheme && customTheme?.background && customTheme?.font) {
    background = customTheme.background.value;
    bgOpacity = customTheme.background.opacity;

    backgroundStyle = customTheme.background.style;
    font = customTheme.font.family;
    fontColor = customTheme?.font?.color;

    buttonColor = customTheme?.button?.color;

    fontColorHex = convert(fontColor);
    backgroundHex = convert(background);

    bgchwo = concatOpacity(backgroundHex, bgOpacity);

    // add all the styles here


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
        style={`${showPreview? 'width: 100vw; height: 100vh' : 'width: 30vw; min-width: 190px; min-height: 380px; max-height: 600px; max-width: 300px;'} color: ${fontColorHex}; ${backgroundStyle === 'image' ? `background-image: url(${background}); background-size: 100% 100%; background-repeat: no-repeat; background-position: top;` : (backgroundStyle === 'solid' ? `background-color: ${bgchwo};` : '')}`}
        class="{showPreview? 'border-none rounded-none w-screen' : 'border-black border-[0.75rem] rounded-[33px]'} bg- flex flex-col justify-start overflow-auto">
        <div style="padding-top: 205%; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="p-4">

    <!-- preview container -->
    {#if !showData}
    <div
      in:blur={{ delay: 300, amount: 100, duration: 1000, easing: backOut }}
    >

      <div 
      style={`color: ${fontColorHex? fontColorHex : 'hsl(var(--p))'}`}
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
        class="bg-{buttonColor} fixed top-0 left-1/2 -translate-x-1/2 w-screen h-screen flex">
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