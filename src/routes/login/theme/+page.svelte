<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { db, user, userData } from "$lib/firebase";
    import { doc, writeBatch } from "firebase/firestore";
    import { onMount } from 'svelte';
  
    let chosenTheme = '';
    const themes = [
        '💙 methyleneBlue',
        '🟥 red',
        '📼 retro',
        '🪴 garden',
        '⚫️ black',
        '🤑 luxury',
        '🌊 aqua',
        '🌃 night',
        '☕️ coffee',
        '🧪 acid',
        '🌲 forest',
        '🤖 cyberpunk',
        '🍋 lemonade'
    ];
  
    async function saveTheme() {
      console.log("saving theme", chosenTheme);
  
      const batch = writeBatch(db);
      batch.set(doc(db, "users", $user!.uid), {
          theme: chosenTheme
      }, { merge: true }); // merge:true ensures that other fields are not overwritten
  
      await batch.commit();
      chosenTheme = '';
    }

    function setTheme(themeWithEmoji: string) {

        const theme = themeWithEmoji.split(' ').slice(1).join(' ');

        chosenTheme = theme;
        
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }
  </script>
  
  <AuthCheck>
    
    <form action="" class="w-full" on:submit|preventDefault={saveTheme}>
        <div class="my-4 min-h-16 px-4 w-full">
            {#each themes as theme}
              <button 
                on:click|preventDefault={() => setTheme(theme)} 
                class="btn m-1"
                class:btn-secondary={theme === chosenTheme}
                >
                    {theme}
                </button>
            {/each}
            {#if chosenTheme}
              <button class="btn btn-info m-1">Save Theme</button>
            {/if}
        </div>
    </form>
    
    {#if chosenTheme !== ''}
        <p class="">
            current theme
        </p>
        <p class=" p-6 bg-secondary rounded-md text-secondary-content text-[1.5rem]">
                {chosenTheme}
        </p>
    {/if}
  </AuthCheck> 
