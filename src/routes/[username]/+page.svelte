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

<main class="prose text-center mx-auto mt-8">
  <h1 class="text-[3rem] m-auto">
    @{data.username}
  </h1>

  <img 
    src={data.photoURL ?? "/sonic.jpeg"}
    alt="photoURL"
    width="256"
    class="mx-auto"
  />

  <p class="text-xl my-8">{data.bio ?? "no bio"}</p>
  <ul class="list-none">
    {#each data.links as item }
      <li class="m-auto">
        <UserLink {...item} />
      </li>
    {/each}
  </ul>




</main>
