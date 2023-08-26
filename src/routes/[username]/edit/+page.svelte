<script lang="ts">
  import { page } from "$app/stores";
  import SortableList from "$lib/components/SortableList.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData, storage } from "$lib/firebase";
  import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { fade, fly, slide, blur } from "svelte/transition";
  import { backIn, backInOut, backOut, cubicIn, cubicInOut, cubicOut } from "svelte/easing";
  import { themeStore } from "$lib/theme";
  import Footer from "$lib/components/Footer.svelte";
  import colors from "tailwindcss/colors";
  import { updateTheme } from "$lib/themeStore";
  import type { PageData } from "./$types";
  import type { CustomTheme } from "$lib/theme";
  import type { LinkData } from "$lib/firebase";
  import Nav from "$lib/components/Nav.svelte";

  // states
  let showDndMessage = false;
  let showChangePfpModal = false;
  let showChangePfp = false;
  let editingBio = false;
  let showForm = false;

  // get user data from $userData store
  export let data: {
    username: string;
    bio: string;
    photoURL: string;
    links: LinkData[];
    customTheme: CustomTheme;
    theme: string;
  } | null = $userData;
  
  // declare user data vars
  let username: string | undefined;
  let bio: string | undefined;
  let photoURL: string | undefined;
  let links: LinkData[];
  let customTheme: CustomTheme;
  let theme: string | undefined;
  
  // declare customTheme vars
  let font: string;
  let fontColor: string;
  let background: string;
  let backgroundStyle: "gradient" | "image" | "solid";
  let buttonStyle: "squareFill" | "roundFill" | "circleFill" | "squareOutline" | "roundOutline" | "circleOutline" | "squareShadow" | "roundShadow" | "circleShadow";
  let buttonColor: string;
  let buttonFontColor: string;

  // hexes 
  let backgroundHex: string | undefined;
  let fontColorHex: string | undefined;
  let buttonColorHex: string | undefined;
  let buttonFontColorHex: string | undefined;

  $: if ($userData) {
    username = $userData.username;
    photoURL = $userData.photoURL;
    links = $userData.links;
    customTheme = $userData.customTheme;
    theme = $userData.theme;    

    // set customTheme vars
    font = customTheme.font.family;
    fontColor = customTheme.font.color;
    background = customTheme.background.value;
    backgroundStyle = customTheme.background.style;
    buttonStyle = customTheme.button.style;
    buttonColor = customTheme.button.color;
    buttonFontColor = customTheme.button.fontColor;

    // convert these to hex codes
    backgroundHex = background ? convert(background) : undefined;
    fontColorHex = fontColor ? convert(fontColor) : undefined;
    buttonColorHex = buttonColor ? convert(buttonColor) : undefined;
    buttonFontColorHex = buttonFontColor ? convert(buttonFontColor) : undefined;

  }

  // makes sure bio isn't actively being edited
  $: if ($userData && !editingBio) {
    bio = $userData.bio;
  }

  // convert tailwind to hex
  function convert(colorName: string): string | undefined {
    const [color, shade] = colorName.split('-');

    // convert('lime-400') returns colors[lime].[400]
    // colors[lime].[400] === the correct hex code
    return (colors as any)[color]?.[shade];
  }

  onMount (() => {

    console.log('bg check: ', background);
    
    if (data && data.customTheme) {
      updateTheme(customTheme);
      console.log('themeupdated 🍨', $themeStore);
    }
  });



  // upload new pfp
  async function upload(e: any) {
      uploadSuccess = false;
      uploading = true;

      try {
          const file = e.target.files[0];
          previewURL = URL.createObjectURL(file);
          const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
          const result = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(result.ref);

          await updateDoc(doc(db,  `users/${$user!.uid}`), { photoURL: url });
          uploadSuccess = true;
      } catch (error) {
          console.error('an error occurred while attempting to upload the file: ', error);
      } finally {
          uploading = false;
      }
  }

  // save bio
  function saveBio() {
    const userRef = doc(db, `users/${$user!.uid}`);

    updateDoc(userRef, {bio: bio });
    console.log('updated bio: ', bio)

    editingBio = false;
  }

  // edit bio
  function editBio() {
    editingBio = true;
    console.log('editingBio: ', editingBio);
  }


  const formDefaults = {
    iconURL: "",
    title: "",
    url: "https://",
  }

  const formData = writable(formDefaults);

  let files: FileList;
  let uploadSuccess = false;
  let uploading = false;
  let previewURL: string;



  // verify url && title
  $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
  $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
  $: formIsValid = urlIsValid && titleIsValid;


  // add link
  async function addLink(e: SubmitEvent) {
    const userRef = doc(db, `users/${$user!.uid}`);

    // upload icon
    uploadSuccess = false;
    uploading = true;
    let url = '/icons/custom.png';

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

  
  // cancel new link upload
  function cancelLink() {
    formData.set(formDefaults);
    showForm = false;
  }

  // rearrange links in DB
  function sortList(e: CustomEvent) {
    const newList = e.detail;
    const userRef = doc(db, `users/${$user!.uid}`);
    setDoc(userRef, { links: newList }, { merge: true });
  }

  // handle user file choice
  function handleFileChange(event: { target: any; }) {
    const inputElement = event.target;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      previewURL = URL.createObjectURL(file);
    }
  }

</script>

<AuthCheck>


<main 
data-theme={theme}
style={`color: ${fontColorHex}; ${backgroundStyle === 'image' ? `background-image: url(${background}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; background-attachment: fixed;` : (backgroundStyle === 'solid' ? `background-color: ${backgroundHex};` : '')}`}

class={`bg-${background ? background : 'accent'} font-${font ? font : 'totally-gothic'} -z-20 h-screen fixed top-0 left-0 overflow-auto w-[100vw] text-center`}>


  <!-- this is an authcheck to make sure  -->
  {#if $userData?.username == $page.params.username}
    <h1 class="fixed top-2 left-1/2 -translate-x-1/2 text-2xl font-{font} font-bold text-center">
      Edit Profile
    </h1>

        <!-- PFP -->
    
    <div class="mx-auto  mt-16 mb-4 flex justify-center max-w-sm relative">
        {#if showChangePfp}
          <div 
            in:fly={{ y: -100, duration: 500, easing: backOut }}
            out:blur={{ duration: 3000, easing: cubicOut, amount: 100 }}
            class="z-20 btn-info bg-opacity-25 absolute -top-10 right-1/2 translate-x-1/2 border-2 ">

            <p class="text-secondary-content p-2 px-4">Change PFP</p>
          </div>
        {/if}
        <button
          on:mouseenter={() => showChangePfp = true}
          on:mouseleave={() => showChangePfp = false}
          on:click={() => showChangePfpModal = true}
          on:keydown={() => showChangePfpModal = true}
          on:keyup={() => showChangePfpModal = false}
          on:blur={() => showChangePfpModal = false}
        >
      <img 
        
        src={photoURL ?? "/sonic.jpeg"}
        alt="photoURL"
        class={`mx-auto h-20 w-20 duration-200 transform transition-all ease-[backOut] ${showChangePfp ? 'scale-x-[3] scale-y-75 filter sepia' : ''}`}
      />

        </button>

        {#if showChangePfpModal}
        <div 
        in:fade
        out:fade
        class="w-screen h-screen fixed top-0 left-0 bg-primary bg-opacity-50 ">


          <div 
            in:blur
            out:fly={{ y: -1000, duration: 500, easing: backIn}}
            class="m-auto z-50 fixed top-1/3 left-1/2 -translate-x-1/2 bg-{background} w-1/2 p-8">

          <input

                on:change|stopPropagation={upload}
                name="photoURL"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs"
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
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

      
        </div>
        
        {/if}
    </div>


    <!-- USERNAME -->
    <h1 
      class="text-[1.5rem] m-auto text-center font-{font}">

      @{username}
    </h1>

    <!-- BIO -->
    {#if editingBio}
    <div class="flex flex-col p-2 space-y-4">

      <input
        type="text"
        class="input max-w-lg m-auto text-center"
        bind:value={bio}
        placeholder="Enter your bio"
      />
      <div>
        <button on:click={saveBio} class="btn btn-success">Save</button>
        <button on:click={() => (editingBio = false)} class="btn btn-error">Cancel</button>
      </div>
    </div>
{:else}
  <p class="text-[1rem] p-5 font-{font? font : 'elven'} text-center">{bio ?? "no bio"}</p>
  <button on:click={editBio} class="btn btn-outline">Edit Bio</button>
{/if}

{#if showDndMessage}
<div 
  in:slide={{ delay: 1000, duration: 500, easing: backOut}}
  out:blur={{ duration: 500, easing: cubicOut, amount: 100 }} 
  class="group py-2 z-20 w-[80%] md:max-w-[60%] lg:max-w-[40%] flex justify-center absolute top-56 left-1/2 -translate-x-1/2 px-4 btn-warning hover:border-info border-2 bg-opacity-75">
  <button on:click={() => showDndMessage = false} class="btn-xs btn-circle border-primary border-2 bg-info-content invisible group-hover:visible absolute -right-3 -top-3 text-primary">X</button>
  <p>☝️🤓</p>
  <p class="text-xs text-secondary-content text-center mx-auto my-auto">Drag and drop links to change order!</p>
</div>
{/if}

    <!-- insert sortable list here -->
    <SortableList
      list={$userData?.links}
      on:sort={sortList}
      let:item>

      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div 
        class="group relative -z-10">
        <UserLink 
        iconURL={item.iconURL} 
        title={item.title} 
        url={item.url} 
        customTheme={customTheme}
      />      
  

      </div>
    </SortableList>



    <!-- add link form -->
    {#if showForm}
      <form 
        in:slide={{ duration: 700, easing: cubicInOut}}
        out:slide={{ duration: 500, easing: cubicInOut}}
        on:submit|preventDefault={addLink}
        class="bg-{fontColor} text-{background} font-{font} p-6 max-w-[94%] mx-auto rounded-xl space-y-6 flex flex-col mb-40"
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

<Nav username={username}/>
  
</main>



<Footer></Footer>

</AuthCheck>

<!-- cool message style -->
<!-- btn-info bg-opacity-25 border-2 text-secondary-content -->




