<!-- need links -->
<!-- nedd to have reactive sizes -->
<!-- thats it -->

<!-- same concept as the userlink component but this is a full preview with the pfp and the bio -->

<!-- has to be reactive based on the window size -->

<!-- so ill create a component and the slot will be where the little mini links go -->
<!-- lets think about this to see if making another userlink component is necessary -->


<!-- solution -->
<!-- passing previewMode prop -->
<!-- then in the userLink component the classes will be different if preview mode is applied -->



<!-- todo -->
<!-- fix style issues: -->
<!-- preview pfp needs to change with phone size -->

<!-- update previewMode = true classes in the userlink.svelte -->

<!-- also update the sizes of the theme preview in the appearance page -->

<!-- also add the neccessary style options: -->
<!-- buttons -->
<!-- fonts -->
<!-- image uploads etc -->

<script>
    import { userData } from "$lib/firebase";
    import { onMount } from "svelte";
    import UserLink from "./UserLink.svelte";
    import { fly } from "svelte/transition";
    import { backIn, backInOut, backOut, cubicInOut } from "svelte/easing";
    let mounted = false;

    onMount(() => {
            mounted = true;
            console.log('mounted');
        }
    );

    let links = $userData?.links || [];
    let userFont = 'input-mono';



</script>

{#if mounted}
<!-- preview -->
<div 
    class="hidden md:flex bg-blue-300 w-[38%] fixed right-0 justify-center items-center h-screen">
    <!-- phone div -->
    <div 
        in:fly={{ y: 50, x: -50, duration: 1000, easing: backOut }}
        style="width: 30vw; min-width: 190px; min-height: 380px; max-height: 600px; max-width: 300px;" 
        class="border-black bg-primary flex flex-col justify-start border-[0.75rem] rounded-[33px] overflow-auto">
        <div style="padding-top: 205%; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="p-4">

      <div class="flex flex-col items-center mt-8 mb-4">
        <!-- pfp -->
        <img class="min-w-[38px] min-h-[38px] max-h-[88px] max-w-[88px]"  src="{$userData?.photoURL}" alt="pfp">
        <!-- Username -->
        <p class="text-[1rem] font-{userFont}">@{$userData?.username}</p>
        <!-- bio -->
        <p class="text-[0.75rem] font-{userFont}">{$userData?.bio}</p>
      </div>
        <!-- links -->
        <ul>
          {#each links as link}
            <li class="m-auto py-[0.33rem]">
              <UserLink iconURL={link.iconURL} title={link.title} url={link.url} previewMode={true} />
            </li>
          {/each}
        </ul>
            </div>
        </div>
    </div>
  </div>
  <!-- preview end -->
  {/if}