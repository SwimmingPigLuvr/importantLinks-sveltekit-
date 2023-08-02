<script lang="ts">
    import { user, userData } from "$lib/firebase";
    import { onMount } from "svelte";
    import "../app.css";

    $user;
    $userData;

    

    
    
</script>


<slot />

<footer class="fixed bottom-8 -z-10 left-1/2 -translate-x-1/2 m-auto text-center">
    <h3 class="hover:text-lime-400 transition transform duration-500 ease-in-out font-input-mono">made by <span class="font-herb">Dylan</span></h3>
    <a href="/login">
        <h4 class="hover:text-sky-400 transition transform duration-500 ease-in-out font-input-mono">create your own <span class="font-typewriter">here</span></h4>
    </a>
</footer>