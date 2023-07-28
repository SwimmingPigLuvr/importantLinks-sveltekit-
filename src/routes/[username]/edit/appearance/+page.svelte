<script lang="ts">
  import { db, user, userData } from "$lib/firebase";
  import { writable } from "svelte/store";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { doc, setDoc } from "firebase/firestore";



  export let data: PageData;
</script>
