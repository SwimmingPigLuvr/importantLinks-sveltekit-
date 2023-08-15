<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { setTheme, getCustomStyles, themeStore } from "$lib/theme";
  import Footer from "$lib/components/Footer.svelte";

  export let data: PageData;
  const customStyles = getCustomStyles(data);

  themeStore.set(customStyles);

  const { customBackground, customButtonStyle, customButtonColor, customButtonFontColor, customFont } = $themeStore;

  onMount(() => {
    if (data && data.theme) {
      setTheme(data.theme);
    }
  });

  let customBG = data?.customTheme?.background;

</script>

<svelte:head>
  <title>@{data.username} Links</title>
  <meta name="description" content={data.bio} />
  <!-- Twitter Card meta tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@yourSiteHandle">
  <meta name="twitter:title" content={`@${data.username} Links`}>
  <meta name="twitter:description" content={data.bio}>
  <meta name="twitter:image" content={data.photoURL}>
  <meta name="twitter:creator" content={`@${data.username}`}>
  <!-- Open Graph meta tags -->
  <meta property="og:title" content={`@${data.username} Links`} />
  <meta property="og:description" content={data.bio} />
  <meta property="og:image" content={data.photoURL} />
  <meta property="og:url" content={`https://yourdomain.com/${data.username}`} />
  <meta property="og:type" content="website" />
</svelte:head>

<main 
  
class={`bg-${customBG ? customBG : 'primary'} font-${customFont} -z-20 h-screen fixed top-0 left-0 w-[100vw] overflow-auto text-center text-${customButtonFontColor}`}>

  <!-- PFP -->
  <img 
    src={data.photoURL ?? "/sonic.jpeg"}
    alt="photoURL"
    class="mx-auto mt-16 mb-4 h-20 w-20"
  />
  
  <!-- USERNAME -->
  <h1 class="text-[1.5rem] m-auto font-{customFont}">
    @{data.username}
  </h1>

  <!-- BIO -->
  <p 
    class={`text-[1rem] p-2 font-${customFont} bg-${customBG}`}
  >
    {data.bio ?? "no bio"}
  </p>

  <!-- LINKS -->
  <ul class="list-none mt-4 mb-60">
    {#each data.links as item (item.id) }
      <li class="m-auto p-2">
        <UserLink 
          iconURL={item.iconURL} 
          title={item.title} 
          url={item.url} 
          buttonStyle={customButtonStyle} 
          font={customFont} buttonColor={customButtonColor} 
          buttonFontColor={customButtonFontColor} 
        />
      </li>
    {/each}
  </ul>

  <AuthCheck>

    <a href="{data.username}/edit" class="btn w-20 fixed top-4 right-4">Edit</a>
    
  </AuthCheck>

<Footer></Footer>

</main>


<!-- give user option to upload icons for each link -->
<!-- add social links below -->