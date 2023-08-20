<script lang="ts">
    import { db, user, userData, userTheme } from "$lib/firebase";
    import { onDestroy, onMount } from "svelte";
    import UserLink from "./UserLink.svelte";
    import { fly } from "svelte/transition";
    import { backIn, backInOut, backOut, cubicInOut } from "svelte/easing";
    import Theme from "./Theme.svelte";
  import { defaultTheme } from "$lib/theme";
  import type { CustomTheme } from "$lib/theme";
  import { writable } from "svelte/store";
  import { doc, onSnapshot } from "firebase/firestore";

  const customThemeStore = writable(defaultTheme); // default value
  
  $: if ($user && $user.uid) {

      const userRef = doc(db, "users", $user.uid);
      const customThemeRef = doc(userRef, "customTheme");
  
      // Clean up previous listener if any
      customThemeStore.set(defaultTheme); // Reset to default value

      // Subscribe to changes in customTheme
      const unsubscribe = onSnapshot(customThemeRef, (snapshot) => {
          if (snapshot.exists()) {
          const data = snapshot.data() as CustomTheme; // Cast the data to your CustomTheme interface
          customThemeStore.set(data);
          } else {
          // Handle the case when the document doesn't exist, if necessary
          customThemeStore.set(defaultTheme);
          }
      });

      // Cleanup function
      onDestroy(() => {
          unsubscribe();
      });
  }



    let mounted = false;

    onMount(() => {
            mounted = true;
            console.log('mounted');
        }
    );
    

    let links = $userData?.links || [];

    $: customBS = $customThemeStore?.customBS;
    $: customBG = $customThemeStore?.customBG;
    $: customBC = $customThemeStore?.customBC;
    $: customBFC = $customThemeStore?.customBFC;
    $: customF = $customThemeStore?.customF;
    

</script>

<Theme>
  

{#if mounted}
<!-- preview -->
<div 

    class={`hidden md:flex w-[38%] fixed right-0 justify-center items-center h-screen`}
    >
    <!-- phone div -->
    <div 
        in:fly={{ y: 50, x: -50, duration: 1000, easing: backOut }}
        style="width: 30vw; min-width: 190px; min-height: 380px; max-height: 600px; max-width: 300px;" 
        class="border-black {customBG} flex flex-col justify-start border-[0.75rem] rounded-[33px] overflow-auto">
        <div style="padding-top: 205%; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="p-4">

      <div 
      class="flex flex-col items-center mt-8 mb-4 font-{customF}">
        <!-- pfp -->
        <img class="min-w-[38px] min-h-[38px] max-h-[88px] max-w-[88px]"  src="{$userData?.photoURL}" alt="pfp">
        <!-- Username -->
        <p class="text-[1rem]">@{$userData?.username}</p>
        <!-- bio -->
        <p class="text-[0.75rem]">{$userData?.bio}</p>
      </div>
        <!-- links -->
        <ul>
          {#each links as link}
            <li class="m-auto py-[0.33rem]">
              <UserLink iconURL={link.iconURL} title={link.title} url={link.url} previewMode={true} buttonStyle={customBS} buttonColor={customBC} buttonFontColor={customBFC} />
            </li>
          {/each}
        </ul>
            </div>
        </div>
    </div>
  </div>
  <!-- preview end -->
  {/if}


</Theme>