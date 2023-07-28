<script lang="ts">
  import UserLink from "$lib/components/UserLink.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  

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

<main class="text-center">

  <!-- PFP -->
  <img 
    src={data.photoURL ?? "/sonic.jpeg"}
    alt="photoURL"
    class="mx-auto mt-16 mb-4 h-20 w-20"
  />
  
  <!-- USERNAME -->
  <h1 class="text-[1.5rem] m-auto font-gin">
    @{data.username}
  </h1>

  <!-- BIO -->
  <p class="text-[1rem] p-2 font-gin">{data.bio ?? "no bio"}</p>

  <!-- LINKS -->
  <ul class="list-none mt-4">
    {#each data.links as item }
      <li class="m-auto p-2">
        <UserLink iconURL={item.iconURL} title={item.title} url={item.url} />
      </li>
    {/each}
  </ul>




</main>

<!-- give user option to upload icons for each link -->
<!-- add social links below -->