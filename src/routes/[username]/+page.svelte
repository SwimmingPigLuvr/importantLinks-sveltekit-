<script lang="ts">
  import UserLink from "$lib/components/UserLink.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import Footer from "$lib/components/Footer.svelte";
  import { blur, fly, slide } from "svelte/transition";
  import { backIn, backOut, cubicInOut } from "svelte/easing";
  import { updateTheme } from "$lib/themeStore";
  import type { LinkData } from "$lib/firebase";
  import type { CustomTheme, Gradient, Color, Image, RepeatValue, PositionValue, Border, BorderImage, Fill, Shadow, Title, Effect, TitleFont, Font } from "$lib/theme";


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

  $: if (data) {
    bio = data.bio;
    username = data.username;
    photoURL = data.photoURL;
    links = data.links;
    customTheme = data.customTheme;
    theme = data.theme;    

    font = customTheme?.font;
    background = customTheme?.background;
    link= customTheme?.link;
  }

  let gradient;

  let fromHex: string;
  let fromOpacity: number;
  let toHex: string;
  let toOpacity: number;
  let direction: string;

  $: if (background.style === 'gradient') {
    gradient = background.gradient;
    fromHex = gradient.from.hex;
    fromOpacity = gradient.from.opacity;
    toHex = gradient.to.hex;
    toOpacity = gradient.to.opacity;
    direction = gradient.direction;
  }
   
 


    onMount(() => {

    
    if (data && data.customTheme) {
      updateTheme(customTheme);
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
style={`
  color: ${font.hex? font.hex : 'hsl(var(--p))'}; 
  ${background.style === 'image' ? `background-image: url(${background?.image?.url}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;` : 
  (background.style === 'solid' ? `background-color: ${background.hex};` : 
  (background.style === 'gradient' ? `background: linear-gradient(${direction}, ${fromHex}, ${toHex})` : ''))}
`}
class={`font-${font? font : 'input-mono'} -z-20 h-screen fixed top-0 left-0 w-[100vw] overflow-auto text-center`}>


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
          previewMode={false}
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