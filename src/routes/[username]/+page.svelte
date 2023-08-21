<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { defaultTheme, setTheme } from "$lib/theme";
  import Footer from "$lib/components/Footer.svelte";
  import { fly } from "svelte/transition";
  import { backIn, backOut } from "svelte/easing";
  import { themeStore, updateTheme } from "$lib/themeStore";
  import type { CustomTheme } from "$lib/theme";


  // get user data
  export let data: PageData;

  let custom: CustomTheme = defaultTheme;
  
  const username: string = data.username;
  const photoURL: string = data.photoURL;
  const bio: string = data.bio;
  const links = data.links;
  const theme: string = data.theme;
  const customTheme: CustomTheme = data.customTheme;

  $: if (data && data.customTheme) {
    custom = $themeStore;
    updateTheme(customTheme);
    console.log('$themeStore: ', $themeStore);
  }


  



  let mounted = false;
  onMount(() => {
    if (data && theme) {
      setTheme(theme);
    }
    if (data && data.customTheme) {
      updateTheme(customTheme);
    }
    mounted = true;
  });


  // THIS SKIPS THE GETCUSTOMSTYLES FUNCTION
  // lets come back to this way to see if it's simpler

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
  
class={`bg-${custom.customBG? custom.customBG : 'bg-gradient-to-tr from-primary to-secondary'} font-${customTheme.customF? custom.customF : 'herb'} -z-20 h-screen fixed top-0 left-0 w-[100vw] overflow-auto text-center text-${custom.customFC}`}>

  <!-- PFP -->
  <img 
    src={photoURL ?? "/sonic.jpeg"}
    alt="photoURL"
    class="mx-auto mt-16 mb-4 h-20 w-20"
  />
  
  <!-- USERNAME -->
  <h1 class="text-[1.5rem] m-auto font-{custom.customF}">
    @{username}
  </h1>

  <!-- BIO -->
  <p 
    class={`text-[1rem] p-2 font-${custom.customF} bg-${custom.customBG}`}
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
          buttonStyle={custom.customBS} 
          font={custom.customF} 
          buttonColor={custom.customBC} 
          buttonFontColor={custom.customBFC} 
        />
      </li>
    {/each}
  </ul>
  {/if}

  <AuthCheck>

    <a href="{username}/edit" class="btn w-20 fixed top-4 right-4">Edit</a>
    
  </AuthCheck>

<Footer></Footer>

</main>


<!-- give user option to upload icons for each link -->
<!-- add social links below -->