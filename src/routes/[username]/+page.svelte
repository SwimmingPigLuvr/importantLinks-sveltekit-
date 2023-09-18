<script lang="ts">
  import UserLink from "$lib/components/UserLink.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import Footer from "$lib/components/Footer.svelte";
  import { blur, fly, slide } from "svelte/transition";
  import { backIn, backOut, cubicInOut } from "svelte/easing";
  import { themeStore, updateTheme } from "$lib/themeStore";
  import { concatOpacity, convert, type CustomTheme } from "$lib/theme";
  import colors from 'tailwindcss/colors';
  import type { LinkData } from "$lib/firebase";
  import { page } from "$app/stores";

  // states
  let mounted = false;

  export let data: PageData;

  // declare user data vars
  let username: string | undefined;
  let bio: string | undefined;
  let photoURL: string | undefined;
  let links: LinkData[];
  let customTheme: CustomTheme;
  let theme: string | undefined;


  let background: {
    style: "image" | "gradient" | "solid";
    value: string;
    opacity: number;
    hex: string;
  }

  let link: {
    radius: string;
    fill: {
      style: string;
      value: string;
      opacity: number;
      hex: string;
    }
    border: {
      style: string;
      value: string;
      opacity: number;
      hex: string;
    }
    shadow: {
      style: string;
      value: string;
      opacity: number;
      hex: string;
    }
    title: {
      value: string;
      opacity: number;
      hex: string;
      size: number;
      tracking: string;
      effect: string;
      onHover: boolean;
    }
  }

  let font: {
    family: string;
    value: string;
    opacity: number;
    hex: string;
  }

  // hex vars
  let fontColorHex: string | undefined;
  let backgroundHex: string | undefined;
  let buttonColorHex: string | undefined;
  let buttonFontColorHex: string | undefined;

  let buttonTextEffect: 'none' | 'glow' | 'gradient' | 'highlight';
  let buttonTextEffectHover: boolean;

  let bgOpacity: number = 100;
  let bgchwo: string;

  $: if (data) {
    bio = data.bio;
    username = data.username;
    photoURL = data.photoURL;
    links = data.links;
    customTheme = data.customTheme;
    theme = data.theme;    

    // set customTheme vars
    font = customTheme?.font?.family;
    fontColor = customTheme?.font?.value;


    // the style of backgorund will effect how we apply it
    // we only need the string value rn
    backgroundStyle = customTheme?.background?.style;
    background = customTheme?.background?.value;
    bgOpacity = customTheme?.background?.opacity;

    // buttons
    buttonColor = customTheme?.link?.color;
    buttonFontColor = customTheme?.button?.fontColor;

    // text effect
    buttonTextEffect = customTheme?.button?.textEffect?.effect;
    buttonTextEffectHover = customTheme?.button?.textEffect?.onHover;

    // convert these to hex codes
    backgroundHex = background ? convert(background) : undefined;
    fontColorHex = fontColor ? convert(fontColor) : undefined;
    buttonColorHex = buttonColor ? convert(buttonColor) : undefined;
    buttonFontColorHex = buttonFontColor ? convert(buttonFontColor) : undefined;

    bgchwo = concatOpacity(backgroundHex, bgOpacity);

  }

  let gradient: string[];

  let fromHexWithOpacity: string;
  let toHexWithOpacity: string;
  let direction: string;

  $: if (backgroundStyle === 'gradient') {
    gradient = background.split(', ');

    fromHexWithOpacity = gradient[0];
    toHexWithOpacity = gradient[1];
    direction = gradient[2];
  }
   
 

    // convert the pesky classes that tailwind is too lazy to let me use

    onMount(() => {

    console.log('theme store ', $themeStore)
    
    if (data && data.customTheme) {
      updateTheme(customTheme);
      console.log('customTHeme: ', customTheme);
      console.log('themeupdated 🍨', $themeStore);
    }
    mounted = true;
  });
    

    

    



</script>

<svelte:head>
  <title>@{username} Links</title>
  <meta name="description" content={bio} />
  <!-- Twitter Card meta tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@yourSiteHandle">
  <meta name="twitter:title" content={`@${username} Links`}>
  <meta name="twitter:description" content={bio}>
  <meta name="twitter:image" content={photoURL}>
  <meta name="twitter:creator" content={`@${username}`}>
  <!-- Open Graph meta tags -->
  <meta property="og:title" content={`@${username} Links`} />
  <meta property="og:description" content={bio} />
  <meta property="og:image" content={photoURL} />
  <meta property="og:url" content={`https://yourdomain.com/${username}`} />
  <meta property="og:type" content="website" />
</svelte:head>

<main 
data-theme={theme}
style={`color: ${fontColorHex? fontColorHex : 'hsl(var(--p))'}; ${backgroundStyle === 'image' ? `background-image: url(${background}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;` : (backgroundStyle === 'solid' ? `background-color: ${bgchwo};` : (backgroundStyle === 'gradient' ? `background: linear-gradient(${direction}, ${fromHexWithOpacity}, ${toHexWithOpacity})` : ''))}`}
class={`font-${font? font : 'input-mono'} bg- -z-20 h-screen fixed top-0 left-0 w-[100vw] overflow-auto text-center`}>


  <!-- PFP -->
  <img 
    src={photoURL ?? "/sonic.jpeg"}
    alt="photoURL"
    class="mx-auto mt-16 mb-4 h-20 w-20"
  />
  
  <!-- USERNAME -->
  <h1 class="text-[1.5rem] m-auto font-{font}">
    @{username}
  </h1>

  <!-- BIO -->
  <p 
    class={`text-[1rem] p-2 font-${font}`}
  >
    {bio ?? "no bio"}
  </p>

  {#if mounted}
  <!-- LINKS -->
  <ul class="list-none mt-4 mb-60">
    {#each links as item, index (item.id) }
      <li 
      in:fly={{ y: -10, duration: 200, easing: backOut, delay: (index * 300)}}
      class="m-auto py-[0.5rem]">
        <UserLink 
          iconURL={item.iconURL} 
          title={item.title} 
          url={item.url} 
          customTheme={customTheme} 
        />
      </li>
    {/each}
  </ul>
  {/if}

  <Nav username={username}/>


<Footer></Footer>

</main>




<style>
  
</style>
<!-- give user option to upload icons for each link -->
<!-- add social links below -->