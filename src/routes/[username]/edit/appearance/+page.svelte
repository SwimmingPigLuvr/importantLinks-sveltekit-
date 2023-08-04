<script lang="ts">
  import ColorPicker from "$lib/components/ColorPicker.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { userData } from "$lib/firebase";
  import { setTheme } from "$lib/theme";
  import { flip } from "svelte/animate";
  import { backIn, backOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  let buttonColor = 'white';
  let buttonFontColor = 'black';

  let currentFont = 'totally-gothic'


  let links = $userData?.links || [];

  let showColorPicker = false;
  
  function toggleShowColorPicker() {
    showColorPicker = !showColorPicker;
  }
  
  let chosenTheme = '';
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

</script>

<LivePreview />

<main class="flex flex-col">

  

<div id="top" class="flex flex-col my-20  md:max-w-[62%]">
<h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Themes</h2>

  <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
    <!-- themes -->
    <div class="flex flex-wrap justify-between space-x-1">
      <!-- custom -->
      <a href="#custom" class="btn bg-white border-dashed border-2 border-black min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4">
        <p class="max-w-[100px] text-[1.5rem] leading-normal m-auto"><span class="font-gin">Create </span><span class="font-totally-gothic">Custom </span><span class="font-typewriter">Theme </span></p>
      </a>
      {#each themes as theme}
      <div>

        <button 
        on:click|preventDefault={() => setTheme(theme)} 
        class="btn bg-primary border-none min-w-[150px] min-h-[300px] max-w-[200px] {theme} flex flex-col justify-start py-4"
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


    <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col items-center rounded-2xl">
    <div class="flex flex-wrap justify-between space-x-4">


    <!-- solid color -->
    <div>
      <button on:click={toggleShowColorPicker} class="btn bg-warning-content border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4"></button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Solid Color</h3>
    </div>
      
    <!-- gradient -->
      
    <div>
      <button class="btn bg-gradient-to-br from-green-400 to-blue-500 hover:bg-gradient-to-tl transform transition-colors duration-1000 ease-in-out border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4 gradient-transition"><div class="overlay btn w-[100%] h-[100%]"></div></button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Gradient</h3>
    </div>

    <!-- image -->

    <div>
      <button on:click={toggleShowColorPicker} class="filter grayscale hover:grayscale-0 btn border-none w-[150px] min-h-[300px] flex flex-col justify-start py-4">
        <img src="{$userData?.photoURL}" alt="pfp" class="w-[100%] h-[100%]">
      </button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Image</h3>
    </div>


    <!-- color picker -->
    {#if showColorPicker}
        <ColorPicker />
      {/if}
    </div>
    <!-- end of color picker -->
  </div>


    <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Buttons</h2>
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
        
          <!-- fill -->
          <h3 class="font-input-mono text-white my-2">Fill</h3>
        <div class="flex flex-wrap justify-between">
          <button class="btn bg-primary w-[230px] rounded-none border-none  mb-4"></button>
          <button class="btn border-none bg-primary w-[230px] mb-4"></button>
          <button class="btn bg-primary border-none rounded-full w-[230px] mb-4"></button>
        </div>
            
          <!-- outline -->
          <h3 class="font-input-mono text-white my-2">Outline</h3>
        <div class="flex flex-wrap justify-between">
          <button class="btn bg-opacity-0 border-primary border-2 w-[230px] rounded-none mb-4"></button>
          <button class="btn bg-opacity-0 border-primary border-2 w-[230px] mb-4"></button>
          <button class="btn bg-opacity-0 border-primary border-2 w-[230px] rounded-full mb-4"></button>
        </div>

          <!-- shadow -->
          <h3 class="font-input-mono text-white my-2">Shadow</h3>
        <div class="flex flex-wrap justify-between">
          <button class="btn shadow-md shadow-primary bg-opacity-0 border-none w-[230px] rounded-none mb-4"></button>
          <button class="btn shadow-md shadow-primary bg-opacity-0 border-none w-[230px] mb-4"></button>
          <button class="btn shadow-md rounded-full shadow-primary bg-opacity-0 border-none w-[230px] mb-4"></button>
        </div>
            
  <!-- colors -->
  <div>
    <div>
      <h3 class="font-input-mono text-white my-2">Button Color</h3>
      <div class="w-10 h-10 bg-{buttonColor} rounded-md"></div>
    </div>
    <div>
      <h3 class="font-input-mono text-white my-2">Button Font Color</h3>
      <div class="w-10 h-10 bg-{buttonFontColor} rounded-md"></div>
    </div>
  </div>
  
      
      </div>
  

      <!-- fonts -->
      <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Font</h2>
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
        
        <h3 class="font-input-mono text-white my-2">Font</h3>
        <button class="btn group border-neutral-200 shadow shadow-neutral-200 bg-white h-20 flex items-center justify-start space-x-4">
          <div class="bg-neutral-200 w-12 h-12 rounded-sm items-center justify-center flex">
            <p class="m-auto font-{currentFont} text-black text-[1.5rem]">Aa</p>
          </div>
          <p class="font-{currentFont} group-hover:text-neutral-200 text-[1.5rem] text-black">{currentFont}</p>
        </button>
 
      <h3 class="font-input-mono text-white my-2">Font Color</h3>
      <div class="w-10 h-10 bg-{buttonColor} rounded-md"></div>
    </div>
    <div>
    
 
</div>

<a href="#top" class="fixed bottom-3 right-3 text-[3rem]">
  👆
</a>

</main>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(1, 2fr);
    gap: 0;
  }

  .cell {
    width: 1rem;
    height: 2rem;
    position: relative;
  }

  .cell::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgb(0, 0, 0);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .cell:hover::after {
      opacity: 1;
  }

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
    background: linear-gradient(0deg, #f0f9ff, #0c4a6e);
    opacity: 0;
    transition: opacity 1s ease-out;
}

  
  </style>