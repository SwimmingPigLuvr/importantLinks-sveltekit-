<script lang="ts">
  import { page } from "$app/stores";
  import ColorPicker from "$lib/components/ColorPicker.svelte";
  import Fonts from "$lib/components/Fonts.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData, storage } from "$lib/firebase";
  import { setTheme } from "$lib/theme";
  import { doc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
  import { flip } from "svelte/animate";
  import { backIn, backOut } from "svelte/easing";
  import { fade, slide } from "svelte/transition";

  let mode = '';

  // save theme
  let chosenTheme = '';

  async function saveTheme() {
    console.log('saving theme: ', chosenTheme);

    const batch = writeBatch(db);
    batch.set(doc(db, "users", $user!.uid), {
      theme: chosenTheme
    }, { merge: true });

    await batch.commit();
    chosenTheme = '';
  }

  const handleThemeSelect = (selectedTheme: string) => {
    chosenTheme = selectedTheme;
    saveTheme();
    setTheme(selectedTheme);
  }
  // save theme


  // save button style
  let chosenButtonStyle = '';

  async function saveButtonStyle() {
    console.log('saving button style: ', chosenButtonStyle);

    const batch = writeBatch(db);

    // update buttonStyle
    batch.set(doc(db, "users", $user!.uid), {
      customTheme: {
        buttonStyle: chosenButtonStyle
      }
    }, { merge: true });

    await batch.commit();
    chosenButtonStyle = '';
  }

  const handleButtonSelect = (selectedButton: string) => {
    chosenButtonStyle = selectedButton;
    saveButtonStyle();
  }
  // save button style

  // save button color
  
  // save button color



  let fontDropdown = false;

  function toggleFontDropdown() {
    fontDropdown = !fontDropdown;
    console.log('font drop down: ', fontDropdown);
  };

  let bgColor = '';
  let currentColorSelection = null;



  let buttonColor = 'white';
  let buttonFontColor = 'black';

  let currentFont = 'totally-gothic'


  let links = $userData?.links || [];

  let colorPickerHover = false;
  let showColorPicker = false;
  let showGradientPicker = false;
  let showButtonColorPicker = false;
  let showFontColorPicker = false;
  
  function toggleShowColorPicker() {
    if (showGradientPicker) {
      showGradientPicker = false;
    }
    showColorPicker = !showColorPicker;
  }


  function toggleShowGradientPicker() {
    if (showColorPicker) {
      showColorPicker = false;
    }
    showGradientPicker = !showGradientPicker;
  }

  function toggleShowButtonColorPicker() {
    showButtonColorPicker = !showButtonColorPicker;
  }
  
  const themes = [
      'red',
      'retro',
      'garden',
      'forest',
      'luxury',
      'aqua',
      'night',
      'coffee',
      'methyleneBlue',
      'acid',
      'black',
      'cyberpunk',
      'lemonade'
  ];


  // img upload
  let files: FileList;
  let showForm = false;
  let uploadSuccess = false;
  let uploading = false;
  let previewURL: string;

  async function uploadBackground(e: SubmitEvent) {
    const userRef = doc(db, "users/appearance", $user!.uid)
  }



</script>

<LivePreview />

<main class="flex flex-col">

  

<div id="top" class="flex flex-col my-20  md:max-w-[62%]">
<h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Themes</h2>

  <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-wrap rounded-2xl">
    <!-- themes -->
    <div class="flex overflow-auto space-x-2">
      <!-- custom -->
      <div>

      <a href="#custom" class="btn bg-white border-dashed border-2 border-black min-w-[160px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4">
        <p class="max-w-[100px] text-[1.5rem] leading-normal m-auto"><span class="font-gin">Create </span><span class="font-totally-gothic">Custom </span><span class="font-typewriter">Theme </span></p>
      </a>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Custom</h3>
      </div>
      {#each themes as theme}
      <div class="">

        <button 
        on:click|preventDefault={() => handleThemeSelect(theme)} 
        class="btn bg-primary border-none min-w-[160px] min-h-[300px] max-w-[200px] {theme} flex flex-col justify-start py-4"
        class:btn-secondary={theme === chosenTheme}
        data-theme={theme}>
        <div class="flex flex-col items-center">

          <!-- pfp -->
          <img class="w-[45px] h-[45px]"  src="{$userData?.photoURL}" alt="pfp">
          <!-- Username -->
          <p class="text-[0.5rem]">@{$userData?.username}</p>
          <!-- bio -->
          <p class="text-[0.33rem]">{$userData?.bio}</p>
        </div>
          <!-- links -->
          <div class="bg-secondary w-full h-4"></div>
          <div class="bg-secondary w-full h-4"></div>
          <div class="bg-secondary w-full h-4"></div>
        </button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2" data-theme={theme}>{theme}</h3>
      </div>
      {/each}
    </div>
  </div>
<div class="my-4">

  <h2 id="custom" class="m-2 p-2 font-input-mono text-[1.5rem]">Custom Appearance</h2>
  <div class="m-auto mb-6 px-6">
    <p class="font-input-mono">Completely customize your swimmingPig profile. 
      Change your background with colors, gradients and images. 
      Choose a button style, change the typeface and more.</p>
  </div>
</div>


    <!-- backgrounds -->
    <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Background</h2>


    <div class="bg-secondary m-auto mx-6 mb-6 p-6 rounded-2xl">
    <div class="flex overflow-auto space-x-2">


    <!-- solid color -->
    <div>
      <button 
        on:click={() => toggleShowColorPicker()} 
        class="btn bg-warning-content border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4"></button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Solid Color</h3>
    </div>





    <!-- gradient -->
      
    <div>
      <button class="group btn bg-gradient-to-br from-green-400 to-blue-500 hover:bg-gradient-to-tl transform transition-colors duration-1000 ease-in-out border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4 gradient-transition"><span class="font-noka text-warning-content text-[0.6rem]">UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION</span><div class="overlay btn w-[100%] h-[100%]"></div></button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Gradient</h3>
    </div>







    <!-- image -->

    <div>
      <button class="filter grayscale hover:grayscale-0 btn border-none w-[150px] min-h-[300px] flex flex-col justify-start py-4">
        <img src="{$userData?.photoURL}" alt="pfp" class="w-[100%] h-[100%]">
      </button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Upload Image</h3>
    </div>


    
    </div>

    {#if showColorPicker && !showGradientPicker}
      <ColorPicker mode={'background'}/>
    {/if}
    {#if showGradientPicker && !showColorPicker}
      <ColorPicker mode={'gradient'} />
    {/if}

  </div>


    <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Buttons</h2>
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
        
          <!-- fill -->
          <h3 class="font-input-mono text-white my-2">Fill</h3>
        <div class="flex flex-wrap justify-between">
          <!-- square -->
          <button on:click|preventDefault={() => handleButtonSelect('squareFill')} class="btn bg-primary w-full rounded-none border-none  mb-4"></button>
          <!-- round -->
          <button on:click|preventDefault={() => handleButtonSelect('roundFill')} class="btn border-none bg-primary w-full mb-4"></button>
          <!-- circle -->
          <button on:click|preventDefault={() => handleButtonSelect('circleFill')} class="btn bg-primary border-none rounded-full w-full mb-4"></button>
        </div>
            
          <!-- outline -->
          <h3 class="font-input-mono text-white my-2">Outline</h3>
        <div class="flex flex-wrap justify-between">
          <button on:click|preventDefault={() => handleButtonSelect('squareOutline')} class="btn bg-opacity-0 border-primary border-2 w-full rounded-none mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('roundOutline')} class="btn bg-opacity-0 border-primary border-2 w-full mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('circleOutline')} class="btn bg-opacity-0 border-primary border-2 w-full rounded-full mb-4"></button>
        </div>

          <!-- shadow -->
          <h3 class="font-input-mono text-white my-2">Shadow</h3>
        <div class="flex flex-wrap justify-between">
          <button on:click|preventDefault={() => handleButtonSelect('squareShadow')} class="btn shadow-md shadow-primary bg-opacity-0 border-none w-full rounded-none mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('roundShadow')}  class="btn shadow-md shadow-primary bg-opacity-0 border-none w-full mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('circleShadow')} class="btn shadow-md shadow-primary bg-opacity-0 border-none w-full mb-4 rounded-full"></button>
        </div>
            
  <!-- colors -->
  <div class="flex justify-start space-x-8">
    <div>
      <h3 class="font-input-mono text-white my-2 text-xs">Button Color</h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={() => {toggleShowButtonColorPicker(); mode = 'buttonColor'}} class="btn w-40 h-10 bg-{buttonColor} rounded-md"></div>
    </div>
    <div>
      <h3 class="font-input-mono text-white my-2 text-xs">Button Font Color</h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={() => {toggleShowButtonColorPicker(); mode = 'buttonFontColor'}} class="btn w-40 h-10 bg-{buttonFontColor} rounded-md"></div>
    </div>

  </div>
    {#if showButtonColorPicker}
      <ColorPicker mode={mode}/>
    {/if}
  
      
      </div>
  

      <!-- fonts -->
      <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Font</h2>
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
        {#if fontDropdown}
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div id="fonts" class="mt-8">
          <Fonts />
        </div>
      {/if}
        <h3 class="font-input-mono text-white my-2">Font</h3>
        <button on:click|preventDefault={() => toggleFontDropdown()} class="btn group border-neutral-200 shadow shadow-neutral-200 bg-white h-20 flex items-center justify-start space-x-4">
          <div class="bg-neutral-200 w-12 h-12 rounded-sm items-center justify-center flex">
            <p class="m-auto font-{currentFont} text-black text-[1.5rem]">Aa</p>
          </div>
          <p class="font-{currentFont} group-hover:text-neutral-200 text-[1.5rem] text-black">{currentFont}</p>
        </button>
 
      <h3 class="font-input-mono text-white my-2">Font Color</h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div on:click={() => {toggleShowButtonColorPicker(); mode = 'fontColor'}} class="w-10 h-10 bg-{buttonColor} rounded-md"></div>
      
    <div>

    </div> 
    {#if showFontColorPicker}
      <ColorPicker mode={mode}/>
    {/if}
    


     
    
 
</div>

<a href="#top" class="fixed bottom-3 right-3 text-[3rem]">
  👆
</a>

</main>

<style>
  

  .gradient-transition {
    background: linear-gradient(180deg, #f0f9ff, #0c4a6e);
    position: relative;
    transition: background 1s ease-in-out;
}

.gradient-transition:hover .overlay {
    opacity: 1;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/photos/disclaimer.jpeg');
    background-size: contain;  /* This will make the image cover the entire div */
    background-position: center;  /* This will center the image */
    background-repeat: repeat;  /* This will prevent the image from repeating if it's too small for the container */
    opacity: 0;
    transition: opacity 1s ease-out;
}

  
  </style>


<!-- in order to figure out how to save the styles instantly 
  i should look at how the save theme button saves the theme instantly -->
  