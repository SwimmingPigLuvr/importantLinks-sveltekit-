<script lang='ts'>
    import { user, db } from "$lib/firebase";
    import { doc, onSnapshot } from "firebase/firestore";
    import { onDestroy } from "svelte";
    import { writable } from 'svelte/store';
    import { defaultTheme } from "$lib/theme";
    import type { CustomTheme } from "$lib/theme";



    export const customThemeStore = writable(defaultTheme); // default value
  
    $: if ($user && $user.uid) {

        const userRef = doc(db, "users", $user!.uid);
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
  </script>
  
  
  
  
  
  