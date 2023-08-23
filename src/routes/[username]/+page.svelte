<script lang="ts">
  import UserLink from "$lib/components/UserLink.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import Footer from "$lib/components/Footer.svelte";
  import { blur, fly, slide } from "svelte/transition";
  import { backIn, backOut, cubicInOut } from "svelte/easing";
  import { themeStore, updateTheme } from "$lib/themeStore";
  import type { CustomTheme } from "$lib/theme";
  import colors from 'tailwindcss/colors';
  import { userData, type LinkData } from "$lib/firebase";
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

  // declare customTheme vars
  let font:string;
  let fontColor: string;
  let background: string;
  let buttonStyle: "squareFill" | "roundFill" | "circleFill" | "squareOutline" | "roundOutline" | "circleOutline" | "squareShadow" | "roundShadow" | "circleShadow";
  let buttonColor: string;
  let buttonFontColor: string;

  // hex vars
  let fontColorHex: string | undefined;
  let backgroundHex: string | undefined;
  let buttonColorHex: string | undefined;
  let buttonFontColorHex: string | undefined;

  let buttonTextEffect: 'none' | 'glow' | 'gradient' | 'highlight';
  let buttonTextEffectHover: boolean;

  $: if ($userData) {
    bio = data.bio;
    username = data.username;
    photoURL = data.photoURL;
    links = data.links;
    customTheme = data.customTheme;
    theme = data.theme;    

    // set customTheme vars
    font = customTheme?.font?.family;
    fontColor = customTheme?.font?.color;


    // the style of backgorund will effect how we apply it
    // we only need the string value rn
    background = customTheme?.background?.value;

    // buttons
    buttonStyle = customTheme?.button?.style;
    buttonColor = customTheme?.button?.color;
    buttonFontColor = customTheme?.button?.fontColor;

    // text effect
    buttonTextEffect = customTheme?.button?.textEffect?.effect;
    buttonTextEffectHover = customTheme?.button?.textEffect?.onHover;

    // convert these to hex codes
    backgroundHex = background ? convert(background) : undefined;
    fontColorHex = fontColor ? convert(fontColor) : undefined;
    buttonColorHex = buttonColor ? convert(buttonColor) : undefined;
    buttonFontColorHex = buttonFontColor ? convert(buttonFontColor) : undefined;

  }
   
  let rose = 'rose-500';

    function convert(colorName: string): string | undefined {
      const [color, shade] = colorName.split('-');
      return (colors as any)[color]?.[shade];
    }

    const roseHex = convert(rose);

    // convert the pesky classes that tailwind is too lazy to let me use

    onMount(() => {

    console.log('theme store ', $themeStore)
    
    if (data && data.customTheme) {
      updateTheme(customTheme);
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
style={`color: ${fontColorHex}`}
class={`bg-${background? background : 'rose-700'} font-${font? font : 'herb'} -z-20 h-screen fixed top-0 left-0 w-[100vw] overflow-auto text-center`}>


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
    class={`text-[1rem] p-2 font-${font} bg-${background}`}
  >
    {bio ?? "no bio"}
  </p>

  {#if mounted}
  <!-- LINKS -->
  <ul class="list-none mt-4 mb-60">
    {#each links as item, index (item.id) }
      <li 
      in:fly={{ y: -10, duration: 200, easing: backOut, delay: (index * 300)}}
      class="m-auto p-2">
        <UserLink 
          iconURL={item.iconURL} 
          title={item.title} 
          url={item.url} 
          buttonStyle={buttonStyle} 
          font={font} 
          buttonColor={buttonColor} 
          buttonColorHex={buttonColorHex} 
          buttonFontColorHex={buttonFontColorHex} 
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