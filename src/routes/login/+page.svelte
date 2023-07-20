<script lang="ts">
  import { auth, user } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
  import { backOut } from "svelte/easing";


    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);

        const idToken = await credential.user.getIdToken();

        const res = await fetch("/api/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });
    }

    async function signOutSSR() {
      const res = await fetch("/api/signin", { method: "DELETE"});
      await signOut(auth);
    }

</script>

<h2 class="text-neutral-content">LOGIN</h2>

{#if $user}
  <h2 class="card-title">Welcome, {$user.displayName}</h2>
  <p class="text-center text-success">You have been successfully logged in</p>
  <div>
    <button class="btn btn-error" on:click={signOutSSR}>sign out</button>
    <a class="btn btn-secondary mt-6" href="/login/username">choose username <span class="text-[2rem]">👉</span></a>
  </div>

{:else}
  <button class="btn bg-neutral text-neutral-content transform transition duration-500 ease-[backOut]" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}