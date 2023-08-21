<script lang="ts">
    import { onMount } from "svelte";
    import UserLink from "./UserLink.svelte";
    import { fly } from "svelte/transition";
    import { backIn, backInOut, backOut, cubicInOut } from "svelte/easing";
  import type { CustomTheme } from "$lib/theme";

  export const username: string = '';
  export const photoURL: string = '';
  export const bio: string = '';
  export const links: any[] = [];
  export const theme: string = '';
  export const customTheme: CustomTheme = {
     customBG: "",
     customBS: "squareFill",
     customBC: "",
     customBFC: "",
     customF: "",
     customFC: ""
   };

    let mounted = false;

    onMount(() => {
            mounted = true;
            console.log('mounted');
        }
    );
    

    

</script>

  

{#if mounted}
<!-- preview -->
<div 

    class={`hidden md:flex w-[38%] fixed right-0 justify-center items-center h-screen`}
    >
    <!-- phone div -->
    <div 
        in:fly={{ y: 50, x: -50, duration: 1000, easing: backOut }}
        style="width: 30vw; min-width: 190px; min-height: 380px; max-height: 600px; max-width: 300px;" 
        class="border-black {customTheme.customBG} flex flex-col justify-start border-[0.75rem] rounded-[33px] overflow-auto">
        <div style="padding-top: 205%; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="p-4">

      <div 
      class="flex flex-col items-center mt-8 mb-4 font-{customTheme.customF}">
        <!-- pfp -->
        <img class="min-w-[38px] min-h-[38px] max-h-[88px] max-w-[88px]"  src="{photoURL}" alt="pfp">
        <!-- Username -->
        <p class="text-[1rem]">@{username}</p>
        <!-- bio -->
        <p class="text-[0.75rem]">{bio}</p>
      </div>
        <!-- links -->
        <ul>
          {#each links as link}
            <li class="m-auto py-[0.33rem]">
              <UserLink iconURL={link.iconURL} title={link.title} url={link.url} previewMode={true} buttonStyle={customTheme.customBS} buttonColor={customTheme.customBC} buttonFontColor={customTheme.customBFC} />
            </li>
          {/each}
        </ul>
            </div>
        </div>
    </div>
  </div>
  <!-- preview end -->
  {/if}

