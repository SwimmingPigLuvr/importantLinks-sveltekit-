<script lang="ts">
  import { page } from "$app/stores";
  import SortableList from "$lib/components/SortableList.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData, storage } from "$lib/firebase";
  import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { onMount } from "svelte";
  import { backIn, backOut, cubicInOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";


  const formDefaults = {

    iconURL: "",
    title: "",
    url: "https://",
  }

  const formData = writable(formDefaults);

  let files: FileList;
  let showForm = false;
  let uploadSuccess = false;
  let uploading = false;
  let previewURL: string;

  let showDragMessage = false;

  onMount (() => {
    showDragMessage = true;
  });

  
  $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
  $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
  $: formIsValid = urlIsValid && titleIsValid;

  async function addLink(e: SubmitEvent) {
    const userRef = doc(db, "users", $user!.uid);

    // upload icon
    uploadSuccess = false;
    uploading = true;
    let url = '';

    try {
      const file = files[0];
      previewURL = URL.createObjectURL(file);
      const storageRef = ref(storage, `users/${$user!.uid}/links/${file.name}`);
      const result = await uploadBytes(storageRef, file);
      url = await getDownloadURL(result.ref);

      uploadSuccess = true;
    } catch (error) {
      console.error('an error occurred while attempting upload: ', error);
    } finally {
      uploading = false;
    }

    await updateDoc(userRef, {
      links: arrayUnion({
        ...$formData,
        id: Date.now().toString(),
        iconURL: url,
      }),
    });

    formData.set(formDefaults);

    showForm = false;
  }

  async function deleteLink(item: any) {
    const userRef = doc(db, "users", $user!.uid);
    await updateDoc(userRef, {
      links: arrayRemove(item),
    });
  }

  function cancelLink() {
    formData.set(formDefaults);
    showForm = false;
  }

  function sortList(e: CustomEvent) {
    const newList = e.detail;
    const userRef = doc(db, "users", $user!.uid);
    setDoc(userRef, { links: newList }, { merge: true });
  }

  function handleFileChange(event: { target: any; }) {
    const inputElement = event.target;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      previewURL = URL.createObjectURL(file);
    }
  }

</script>

<main class="max-w-xl mx-auto">

<!-- messages -->

{#if showDragMessage}
<div 
  in:slide={{ delay: 1000, duration: 500, easing: backOut}}
  out:slide={{ duration: 500, easing: backIn }} 
  class="group z-20 flex absolute space-x-3 top-20 w-36 left-40  px-4 bg-sky-400 rounded-lg">
  <button on:click={() => showDragMessage = false} class="btn-xs btn-circle border-white border-[0.1rem] bg-black invisible group-hover:visible absolute -right-3 -top-3">X</button>
  <p class="text-6xl py-2">!</p>
  <p class="text-xs my-auto py-2">Drag and drop links to change order</p>
</div>
{/if}

  {#if $userData?.username == $page.params.username}
    <h1 class="mx-2 text-2xl font-input-mono font-bold mt-8 mb-4 text-center">
      Edit Profile
    </h1>

    <!-- insert sortable list here -->
    <SortableList
      list={$userData?.links}
      on:sort={sortList}
      let:item>

      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div 
        class="group relative">
        <UserLink iconURL={item.iconURL} title={item.title} url={item.url} />
      
      <!-- delete button -->
        <button
          on:click|preventDefault={e => deleteLink(item)}
          class="btn-xs btn-error invisible group-hover:visible transition-all absolute -right-2 top-2">
          <p class="text-white">Delete</p>
        </button>
      </div>
    </SortableList>

    {#if showForm}
      <form 
        in:slide={{ duration: 700, easing: cubicInOut}}
        out:slide={{ duration: 500, easing: cubicInOut}}
        on:submit|preventDefault={addLink}
        class="bg-base-300 p-6 max-w-[94%] mx-auto rounded-xl space-y-6 flex flex-col"
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- icon upload -->
        <div class="space-y-3 flex flex-col">
          <label  for="url">Enter URL</label>
          <input 
            name="url"
            type="text"
            placeholder="URL"
            class="input input-sm w-full"
            bind:value={$formData.url}
          />
          <label  for="title">Title</label>
          <input 
          name="title"
          type="text"
          placeholder="Title"
          class="input input-sm"
          bind:value={$formData.title}
        />
        </div>
        <label for="icon">Thumbnail</label>
        <div class="flex">
          <img 
            src={previewURL ? previewURL : "/icons/custom.png"}
            alt="default"
            width="128"
            height="128"
            class="mx-auto w-[128px] h-[128px]"
          />
          <input
            name="iconURL"
            type="file"
            class="input input-sm"
            accept="image/png, image/jpeg, image/gif, image/webp"
            on:change={handleFileChange}
            bind:files
          />
      </div>
        
        
        

         <!-- add link button -->
        <button
          disabled={!formIsValid || uploading}
          type="submit"
          class="btn btn-success block">add link</button>
          
          <div class="my-4">
            {#if !titleIsValid}
              <p class="text-error text-xs">invalid title</p>
            {/if}
            {#if !urlIsValid}
              <p class="text-error text-xs">invalid url</p>
            {/if}
            {#if formIsValid}
              <p class="text-success text-xs">looks good 🤓</p>
            {/if}
            {#if uploading}
              <p class="text-info-content mt-6">uploading...</p>
              <progress class="progress progress-secondary w-56 mt-2 m-auto" />
            {/if}
            {#if uploadSuccess}
              <div class="bg-success rounded-md p-2 mt-6 w-3/4 m-auto">
                <p class="text-success-content">uploaded successfully</p>
              </div>
            {/if}
        </div>
        
        <!-- cancel button -->
        <button type="button" class="btn btn-xs my-4" on:click={cancelLink}>cancel</button>
      </form>
    {:else}
      <button
        on:click={() => (showForm = true)}
        class="btn btn-outline block mx-auto my-4">add link</button>
    {/if}
  {/if}

<a href="/{$userData?.username}/edit/appearance" class="btn btn-accent fixed top-4 right-4 ">appearance</a>
  

</main>





