<script lang="ts">
  import ColorPicker from "$lib/components/ColorPicker.svelte";
  import Fonts from "$lib/components/Fonts.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData, storage } from "$lib/firebase";
  import { setTheme, type CustomTheme, defaultTheme } from "$lib/theme";
  import { doc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
  import { flip } from "svelte/animate";
  import { backIn, backOut } from "svelte/easing";
  import { fade, slide } from "svelte/transition";
  import { updateTheme } from "$lib/themeStore";
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import colors from "tailwindcss/colors";

  let textEffect: {effect: string, onHover: boolean};

  export let data: PageData;

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
  let buttonStyle: "squareFill" | "roundFill" | "circleFill" | "squareOutline" | "roundOutline" | "circleOutline" | "squareShadow" | "roundShadow" | "circleShadow";
  let buttonColor: string;
  let buttonFontColor: string;
  
  // hex vars
  let fontColorHex: string | undefined;
  let backgroundHex: string | undefined;
  let buttonColorHex: string | undefined;
  let buttonFontColorHex: string | undefined;

  $: if ($userData) {
    username = $userData.username;
    bio = $userData.bio;
    photoURL = $userData.photoURL;
    links = $userData.links;
    customTheme = $userData.customTheme;
    theme = $userData.theme;    

    // set customTheme vars
    font = customTheme?.font?.family;
    fontColor = customTheme?.font?.color;


    // the style of backgorund will effect how we apply it
    // we only need the string value rn
    background = customTheme?.background?.value;

    // buttons
    buttonStyle = customTheme?.button?.style;
    buttonColor = customTheme?.button?.color;
    buttonFontColor = customTheme?.button?.fontColor;

    // convert these to hex codes
    backgroundHex = background ? convert(background) : undefined;
    fontColorHex = fontColor ? convert(fontColor) : undefined;
    buttonColorHex = buttonColor ? convert(buttonColor) : undefined;
    buttonFontColorHex = buttonFontColor ? convert(buttonFontColor) : undefined;

  }

  $: if (data && data.customTheme) {
    updateTheme(customTheme);
  }

  // convert tailwind to hex
  function convert(colorName: string): string | undefined {
    const [color, shade] = colorName.split('-');
    return (colors as any)[color]?.[shade];
  }

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
        button: {
          style: chosenButtonStyle
        }
      }
    }, { merge: true });

    await batch.commit();
    chosenButtonStyle = '';
  }

  const handleButtonSelect = (selectedButton: string) => {
    chosenButtonStyle = selectedButton;
    saveButtonStyle();
  }

  async function saveTextEffect(textEffect: {effect: string, onHover: boolean}) {
    console.log('saving text effect: ', textEffect);

    const batch = writeBatch(db);

    // update textEffect
    batch.set(doc(db, "users", $user!.uid), {
      customTheme: {
        textEffect: textEffect
      }
    } , { merge: true });

    await batch.commit();
  }

  const handleTextEffectSelect = (effect, onHover) => {
    textEffect = {effect: effect, onHover: onHover}
    console.log('handling text effect selection: ', textEffect);
    saveTextEffect(textEffect);
  }


  let fontDropdown = false;

  function toggleFontDropdown() {
    fontDropdown = !fontDropdown;
    console.log('font drop down: ', fontDropdown);
  };

  let bgColor = '';
  let currentColorSelection = null;


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

  function toggleShowFontColorPicker() {
    showFontColorPicker = !showFontColorPicker;
  }
  
  const themes = [
      'retro',
      'garden',
      'forest',
      'luxury',
      'aqua',
      'night',
      'red',
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

  let glow = 'glow';
  let glowHover = 'glowHover';
  let highlight = 'highlight';
  let highlightHover = 'highlightHover';
  let gradient = 'gradient';
  let gradientHover = 'gradientHover';

  let showOptions = false;

</script>

<LivePreview 
  username={username} 
  photoURL={photoURL} 
  bio={bio} links={links} 
  theme={theme} 
  customTheme={customTheme} 
/>

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
      <ColorPicker mode={'background'} customTheme={customTheme}/>
    {/if}
    {#if showGradientPicker && !showColorPicker}
      <ColorPicker mode={'gradient'} customTheme={customTheme}/>
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
      <ColorPicker mode={mode} customTheme={customTheme}/>
    {/if}


      <!-- shadow -->
      <h3 class="font-input-mono text-white my-2 mt-6">Text Effects</h3>
    <div class="flex flex-wrap justify-between">
      <button 
        on:mouseenter={() => showOptions = true}
        on:mouseleaeve={() => showOptions = false}
        on:click|preventDefault={() => handleTextEffectSelect('glow', false)} 
        class="btn w-1/3 rounded-md mb-4">
        Glow
      </button>
      <button on:click|preventDefault={() => handleTextEffectSelect('highligh', false)} class="btn w-1/3 rounded-md mb-4">Highlight</button>
      <button on:click|preventDefault={() => handleButtonSelect('gradient', false)} class="btn w-1/4 rounded-md mb-4">Gradient</button>
    </div>
  
      
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
            <p class="m-auto font-{font} text-black text-[1.5rem]">Aa</p>
          </div>
          <p class="font-{font} group-hover:text-neutral-200 text-[1.5rem] text-black">{font}</p>
        </button>
 
      <h3 class="font-input-mono text-white my-2">Font Color</h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div on:click={() => {toggleShowFontColorPicker(); mode = 'fontColor'}} class="w-10 h-10 bg-{buttonColor} rounded-md"></div>
      
    <div>

    </div> 
    {#if showFontColorPicker}
      <ColorPicker mode={mode} customTheme={customTheme}/>
    {/if}


    


     
    
 
</div>

<a href="#top" class="fixed bottom-3 right-3 text-[3rem]">
  👆
</a>

<Nav username={username} />

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


  