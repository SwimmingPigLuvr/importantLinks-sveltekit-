<script lang="ts">
    import { onMount } from "svelte";
    import UserLink from "./UserLink.svelte";
    import { fly, blur, fade, slide } from "svelte/transition";
    import { backOut } from "svelte/easing";
  import type { CustomTheme } from "$lib/theme";

  // user's customTheme settings 
  export let customTheme: CustomTheme;

  // user's data
  export let username: string = '';
  export let photoURL: string = '';
  export let bio: string = '';
  export let links: any[] = [];
  export let theme: string = '';
  export let header: string = '';
  let previewMode: boolean = true;

  let background: {
    gradient: {
      from: {
        hex: string,
        opacity: number,
      },
      to: {
        hex: string,
        opacity: number,
      },
      direction: string
    };
    hex: string | undefined;
    image: {
      position: string,
      repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" | "round",
      size: "auto" | "contain" | "cover",
      url: string,
    };
    opacity: number;
    style: string;
  };

  let link: {
    border: {
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      image: {
        url: string,
        repeat: "stretch" | "repeat" | "round" | "space",
      }
      isVisible: boolean,
      opacity: number;
      fillStyle: string;
      style: string;
      width: string;
    }
    fill: {
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
      image: {
        position: string,
        repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" | "round",
        size: "auto" | "contain" | "cover",
        url: string,
      };
    }
    radius: string;
    shadow: {
      direction: string;
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
    }
    title: {
      effect: {
        effect: string;
        hex: string;
        onHover: boolean;
      }
      font: {
        size: string;
        tracking: string;
        hex: string | undefined;
      }
      opacity: number;
    }
  };

  let font: {
    family: string;
    hex: string | undefined;
    opacity: number;
  };

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

  $: if (background?.style === 'gradient') {
    gradient = background?.gradient;
    fromHex = gradient?.from?.hex;
    fromOpacity = gradient?.from?.opacity;
    toHex = gradient?.to?.hex;
    toOpacity = gradient?.to?.opacity;
    direction = gradient?.direction;

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

  let combinedStyle: string;
  let backgroundImage: string[] = [];
  let backgroundColor: string = '';
  let backgroundRepeat: string[] = [];
  let backgroundPosition: string[] = [];
  let backgroundSize: string[] = []; // Changed this to an array for easier management
  let color: string = '';

  $: {
      // Clear previous values
      backgroundImage = [];
      backgroundSize = [];

      // If header exists
      if (header && header !== '') {
          backgroundImage.push(`url(${header})`);
          backgroundSize.push('contain');
          backgroundRepeat.push('no-repeat');
          backgroundPosition.push('top');
      }

      // If background style exists
      if (background) {
          if (background?.style === 'image') {
              backgroundImage.push(`url(${background.image.url})`);
              backgroundRepeat.push(background.image.repeat || `no-repeat`);
              backgroundPosition.push(background.image.position || `center`);
              backgroundSize.push(background.image.size || `cover`);
          } 

          // Solid color background
          if (background?.style === 'solid') {
              backgroundColor = background.hex || `hsl(var(--s))`;
          } 
          
          // Gradient background
          if (background?.style === 'gradient') {
              backgroundColor = `linear-gradient(${direction || `0deg`}, ${fromHex || `hsl(var(--p))`}, ${toHex || `hsl(var(--s))`})`;
          } 

          // Radial Gradient background
          if (background?.style === 'radial-gradient') {
              backgroundColor = `radial-gradient(${fromHex || `hsl(var(--p))`}, ${toHex || `hsl(var(--s))`})`;
          }
      }

      // If font exists
      if (font) {
          color = font.hex || `hsl(var(--ac))`;
      }

      // Construct the final combined style using the individual properties
      combinedStyle = `
          color: ${color};
          background-image: ${backgroundImage.join(", ")};
          background-color: ${backgroundColor};
          background-repeat: ${backgroundRepeat.join(', ')};
          background-position: ${backgroundPosition.join(', ')};
          background-size: ${backgroundSize.join(", ")};
      `;
  }


  


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
        style={`${showPreview? 'width: 100vw; height: 100vh' : 'width: 30vw; min-width: 190px; min-height: 380px; max-height: 600px; max-width: 300px;'} 
        ${combinedStyle}
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




            </div>
        </div>
    </div>
  </div>
  <!-- preview end -->
  {/if}

<style>



</style>