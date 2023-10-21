<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { db, user, userData } from "$lib/firebase";
  import { defaultTheme } from "$lib/theme";
  import { doc, getDoc, writeBatch } from "firebase/firestore";

  let username = "";
  let loading = false;
  let isAvailable = false;
  let debounceTimer: NodeJS.Timeout;


  const re = /^(?=[a-zA-z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
  $: isTouched = username.length > 0;
  $: isTaken = isValid && !isAvailable && !loading;

  async function checkAvailability() {
    // clear previous timer
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    loading = true;


    // set new timer
    debounceTimer = setTimeout(async () => {
    console.log("checking availability of", username);

    const ref = doc(db, "usernames", username);
    const exists = await getDoc(ref).then((doc) => doc.exists());

    isAvailable = !exists;
    loading = false;
    
    }, 1000);


  }

  async function confirmUsername() {
    console.log("confirming username", username);
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, `users/${$user!.uid}`), {
        username,
        photoURL: $user?.userData?.photoURL ?? null,
        published: true,
        bio: 'this is my bio ;)',
        links: [
            {
                title: 'Exo-Science.com',
                url: 'https://exo-science.com',
                icon: 'custom'
            }
        ],
        customTheme: defaultTheme,
        userThemes: [],
    });

    await batch.commit();

    username = '';
    isAvailable = false;

  }


</script>


<AuthCheck>
    {#if $userData?.username}
        <p class="">
            Welcome, 
        </p>
        <p class="text-white text-[2rem]">
                @{$userData.username}
        </p>
        <a class="btn btn-secondary" href="/login/photo">upload pfp <span class="text-[2rem]">👉</span></a>
    {:else}
        <form action="" class="w-full" on:submit|preventDefault={confirmUsername}>
            <input 
                type="text" 
                placeholder="username" 
                class="input w-full text-center" 
                bind:value={username}
                on:input={checkAvailability}
                class:input-error={(!isValid && isTouched)}
                class:input-warning={isTaken}
                class:input-success={isAvailable && isValid && !loading}
            />
            <div class="my-4 min-h-16 px-8 w-full">
                {#if loading}
                <p class="text-secondary">Checking availability of @{username}...</p>
                {/if}
            
                {#if !isValid && isTouched}
                <p class="text-error text-sm">
                    must be 3-16 characters long, alphanumeric only
                </p>
                {/if}
            
                {#if isValid && !isAvailable && !loading}
                <p class="text-warning text-sm">
                    @{username} is not available
                </p>
                {/if}

                {#if isAvailable}
                    <button class="btn btn-success">save name</button>
                {/if}
            </div>

        </form>
    {/if}
</AuthCheck>    

