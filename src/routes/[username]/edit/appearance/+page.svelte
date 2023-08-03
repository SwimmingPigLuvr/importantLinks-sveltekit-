<script lang="ts">
  import LivePreview from "$lib/components/LivePreview.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { userData } from "$lib/firebase";
  import { setTheme } from "$lib/theme";
  import { backIn, backOut } from "svelte/easing";
  import { slide } from "svelte/transition";

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

  

<div class="flex flex-col my-20 items-center md:max-w-[62%]">

    <h2 class="mx-2 p-2 font-input-mono text-[1.5rem]">Themes</h2>
  <div class="bg-secondary m-auto mx-6 p-6 flex flex-col rounded-2xl">
    <!-- themes -->
    <div class="flex flex-wrap justify-between space-x-1">
      {#each themes as theme}
      <div>

        <button 
        on:click|preventDefault={() => setTheme(theme)} 
        class="btn bg-primary border-none w-[180px] h-[285px] {theme} flex flex-col justify-start py-4"
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
    <!-- backgrounds -->
    <h2 class="text-info">Background</h2>
    <!-- choose color -->
      <button class="btn btn-outline" on:click={toggleShowColorPicker}>Solid Color</button>
    {#if showColorPicker}
      <div 
        class="flex flex-row fixed top-0 left-0 m-auto" 
        in:slide={{duration: 500, easing: backOut}}
        out:slide={{duration: 500, easing: backIn}}
        >
        <!-- slate -->
        <div class="grid">
          <button class=" bg-slate-50 cell"></button>
          <button class=" bg-slate-100 cell"></button>
          <button class=" bg-slate-200 cell"></button>
          <button class=" bg-slate-300 cell"></button>
          <button class=" bg-slate-400 cell"></button>
          <button class=" bg-slate-500 cell"></button>
          <button class=" bg-slate-600 cell"></button>
          <button class=" bg-slate-700 cell"></button>
          <button class=" bg-slate-800 cell"></button>
          <button class=" bg-slate-900 cell"></button>
          <button class=" bg-slate-950 cell"></button>
        </div>
        <!-- gray -->
        <div class="grid">
          <button class=" bg-gray-50 cell"></button>
          <button class=" bg-gray-100 cell"></button>
          <button class=" bg-gray-200 cell"></button>
          <button class=" bg-gray-300 cell"></button>
          <button class=" bg-gray-400 cell"></button>
          <button class=" bg-gray-500 cell"></button>
          <button class=" bg-gray-600 cell"></button>
          <button class=" bg-gray-700 cell"></button>
          <button class=" bg-gray-800 cell"></button>
          <button class=" bg-gray-900 cell"></button>
          <button class=" bg-gray-950 cell"></button>
        </div>
        <!-- zinc -->
        <div class="grid">
          <button class=" bg-zinc-50 cell"></button>
          <button class=" bg-zinc-100 cell"></button>
          <button class=" bg-zinc-200 cell"></button>
          <button class=" bg-zinc-300 cell"></button>
          <button class=" bg-zinc-400 cell"></button>
          <button class=" bg-zinc-500 cell"></button>
          <button class=" bg-zinc-600 cell"></button>
          <button class=" bg-zinc-700 cell"></button>
          <button class=" bg-zinc-800 cell"></button>
          <button class=" bg-zinc-900 cell"></button>
          <button class=" bg-zinc-950 cell"></button>
        </div>
        <!-- neutral -->
        <div class="grid">
          <button class=" bg-neutral-50 cell"></button>
          <button class=" bg-neutral-100 cell"></button>
          <button class=" bg-neutral-200 cell"></button>
          <button class=" bg-neutral-300 cell"></button>
          <button class=" bg-neutral-400 cell"></button>
          <button class=" bg-neutral-500 cell"></button>
          <button class=" bg-neutral-600 cell"></button>
          <button class=" bg-neutral-700 cell"></button>
          <button class=" bg-neutral-800 cell"></button>
          <button class=" bg-neutral-900 cell"></button>
          <button class=" bg-black cell"></button>
        </div>
        <!-- stone -->
        <div class="grid">
          <button class=" bg-stone-50 cell"></button>
          <button class=" bg-stone-100 cell"></button>
          <button class=" bg-stone-200 cell"></button>
          <button class=" bg-stone-300 cell"></button>
          <button class=" bg-stone-400 cell"></button>
          <button class=" bg-stone-500 cell"></button>
          <button class=" bg-stone-600 cell"></button>
          <button class=" bg-stone-700 cell"></button>
          <button class=" bg-stone-800 cell"></button>
          <button class=" bg-stone-900 cell"></button>
          <button class=" bg-stone-950 cell"></button>
        </div>
        <!-- red -->
        <div class="grid">
          <button class=" bg-red-50 cell"></button>
          <button class=" bg-red-100 cell"></button>
          <button class=" bg-red-200 cell"></button>
          <button class=" bg-red-300 cell"></button>
          <button class=" bg-red-400 cell"></button>
          <button class=" bg-red-500 cell"></button>
          <button class=" bg-red-600 cell"></button>
          <button class=" bg-red-700 cell"></button>
          <button class=" bg-red-800 cell"></button>
          <button class=" bg-red-900 cell"></button>
          <button class=" bg-red-950 cell"></button>
        </div>
        <!-- orange -->
        <div class="grid">
          <button class=" bg-orange-50 cell"></button>
          <button class=" bg-orange-100 cell"></button>
          <button class=" bg-orange-200 cell"></button>
          <button class=" bg-orange-300 cell"></button>
          <button class=" bg-orange-400 cell"></button>
          <button class=" bg-orange-500 cell"></button>
          <button class=" bg-orange-600 cell"></button>
          <button class=" bg-orange-700 cell"></button>
          <button class=" bg-orange-800 cell"></button>
          <button class=" bg-orange-900 cell"></button>
          <button class=" bg-orange-950 cell"></button>
        </div>
        <!-- amber -->
        <div class="grid">
          <button class=" bg-amber-50 cell"></button>
          <button class=" bg-amber-100 cell"></button>
          <button class=" bg-amber-200 cell"></button>
          <button class=" bg-amber-300 cell"></button>
          <button class=" bg-amber-400 cell"></button>
          <button class=" bg-amber-500 cell"></button>
          <button class=" bg-amber-600 cell"></button>
          <button class=" bg-amber-700 cell"></button>
          <button class=" bg-amber-800 cell"></button>
          <button class=" bg-amber-900 cell"></button>
          <button class=" bg-amber-950 cell"></button>
        </div>
        <!-- yellow -->
        <div class="grid">
          <button class=" bg-yellow-50 cell"></button>
          <button class=" bg-yellow-100 cell"></button>
          <button class=" bg-yellow-200 cell"></button>
          <button class=" bg-yellow-300 cell"></button>
          <button class=" bg-yellow-400 cell"></button>
          <button class=" bg-yellow-500 cell"></button>
          <button class=" bg-yellow-600 cell"></button>
          <button class=" bg-yellow-700 cell"></button>
          <button class=" bg-yellow-800 cell"></button>
          <button class=" bg-yellow-900 cell"></button>
          <button class=" bg-yellow-950 cell"></button>
        </div>
        <!-- lime -->
        <div class="grid">
          <button class=" bg-lime-50 cell"></button>
          <button class=" bg-lime-100 cell"></button>
          <button class=" bg-lime-200 cell"></button>
          <button class=" bg-lime-300 cell"></button>
          <button class=" bg-lime-400 cell"></button>
          <button class=" bg-lime-500 cell"></button>
          <button class=" bg-lime-600 cell"></button>
          <button class=" bg-lime-700 cell"></button>
          <button class=" bg-lime-800 cell"></button>
          <button class=" bg-lime-900 cell"></button>
          <button class=" bg-lime-950 cell"></button>
        </div>
        <!-- green -->
        <div class="grid">
          <button class=" bg-green-50 cell"></button>
          <button class=" bg-green-100 cell"></button>
          <button class=" bg-green-200 cell"></button>
          <button class=" bg-green-300 cell"></button>
          <button class=" bg-green-400 cell"></button>
          <button class=" bg-green-500 cell"></button>
          <button class=" bg-green-600 cell"></button>
          <button class=" bg-green-700 cell"></button>
          <button class=" bg-green-800 cell"></button>
          <button class=" bg-green-900 cell"></button>
          <button class=" bg-green-950 cell"></button>
        </div>
        <!-- emerald -->
        <div class="grid">
          <button class=" bg-emerald-50 cell"></button>
          <button class=" bg-emerald-100 cell"></button>
          <button class=" bg-emerald-200 cell"></button>
          <button class=" bg-emerald-300 cell"></button>
          <button class=" bg-emerald-400 cell"></button>
          <button class=" bg-emerald-500 cell"></button>
          <button class=" bg-emerald-600 cell"></button>
          <button class=" bg-emerald-700 cell"></button>
          <button class=" bg-emerald-800 cell"></button>
          <button class=" bg-emerald-900 cell"></button>
          <button class=" bg-emerald-950 cell"></button>
        </div>
        <!-- teal -->
        <div class="grid">
          <button class=" bg-teal-50 cell"></button>
          <button class=" bg-teal-100 cell"></button>
          <button class=" bg-teal-200 cell"></button>
          <button class=" bg-teal-300 cell"></button>
          <button class=" bg-teal-400 cell"></button>
          <button class=" bg-teal-500 cell"></button>
          <button class=" bg-teal-600 cell"></button>
          <button class=" bg-teal-700 cell"></button>
          <button class=" bg-teal-800 cell"></button>
          <button class=" bg-teal-900 cell"></button>
          <button class=" bg-teal-950 cell"></button>
        </div>
        <!-- cyan -->
        <div class="grid">
          <button class=" bg-cyan-50 cell"></button>
          <button class=" bg-cyan-100 cell"></button>
          <button class=" bg-cyan-200 cell"></button>
          <button class=" bg-cyan-300 cell"></button>
          <button class=" bg-cyan-400 cell"></button>
          <button class=" bg-cyan-500 cell"></button>
          <button class=" bg-cyan-600 cell"></button>
          <button class=" bg-cyan-700 cell"></button>
          <button class=" bg-cyan-800 cell"></button>
          <button class=" bg-cyan-900 cell"></button>
          <button class=" bg-cyan-950 cell"></button>
        </div>
        <!-- sky -->
        <div class="grid">
          <button class=" bg-sky-50 cell"></button>
          <button class=" bg-sky-100 cell"></button>
          <button class=" bg-sky-200 cell"></button>
          <button class=" bg-sky-300 cell"></button>
          <button class=" bg-sky-400 cell"></button>
          <button class=" bg-sky-500 cell"></button>
          <button class=" bg-sky-600 cell"></button>
          <button class=" bg-sky-700 cell"></button>
          <button class=" bg-sky-800 cell"></button>
          <button class=" bg-sky-900 cell"></button>
          <button class=" bg-sky-950 cell"></button>
        </div>
        <!-- blue -->
        <div class="grid">
          <button class=" bg-blue-50 cell"></button>
          <button class=" bg-blue-100 cell"></button>
          <button class=" bg-blue-200 cell"></button>
          <button class=" bg-blue-300 cell"></button>
          <button class=" bg-blue-400 cell"></button>
          <button class=" bg-blue-500 cell"></button>
          <button class=" bg-blue-600 cell"></button>
          <button class=" bg-blue-700 cell"></button>
          <button class=" bg-blue-800 cell"></button>
          <button class=" bg-blue-900 cell"></button>
          <button class=" bg-blue-950 cell"></button>
        </div>
        <!-- indigo -->
        <div class="grid">
          <button class=" bg-indigo-50 cell"></button>
          <button class=" bg-indigo-100 cell"></button>
          <button class=" bg-indigo-200 cell"></button>
          <button class=" bg-indigo-300 cell"></button>
          <button class=" bg-indigo-400 cell"></button>
          <button class=" bg-indigo-500 cell"></button>
          <button class=" bg-indigo-600 cell"></button>
          <button class=" bg-indigo-700 cell"></button>
          <button class=" bg-indigo-800 cell"></button>
          <button class=" bg-indigo-900 cell"></button>
          <button class=" bg-indigo-950 cell"></button>
        </div>
        <!-- violet -->
        <div class="grid">
          <button class=" bg-violet-50 cell"></button>
          <button class=" bg-violet-100 cell"></button>
          <button class=" bg-violet-200 cell"></button>
          <button class=" bg-violet-300 cell"></button>
          <button class=" bg-violet-400 cell"></button>
          <button class=" bg-violet-500 cell"></button>
          <button class=" bg-violet-600 cell"></button>
          <button class=" bg-violet-700 cell"></button>
          <button class=" bg-violet-800 cell"></button>
          <button class=" bg-violet-900 cell"></button>
          <button class=" bg-violet-950 cell"></button>
        </div>
        <!-- purple -->
        <div class="grid">
          <button class=" bg-purple-50 cell"></button>
          <button class=" bg-purple-100 cell"></button>
          <button class=" bg-purple-200 cell"></button>
          <button class=" bg-purple-300 cell"></button>
          <button class=" bg-purple-400 cell"></button>
          <button class=" bg-purple-500 cell"></button>
          <button class=" bg-purple-600 cell"></button>
          <button class=" bg-purple-700 cell"></button>
          <button class=" bg-purple-800 cell"></button>
          <button class=" bg-purple-900 cell"></button>
          <button class=" bg-purple-950 cell"></button>
        </div>
        <!-- violet -->
        <div class="grid">
          <button class=" bg-violet-50 cell"></button>
          <button class=" bg-violet-100 cell"></button>
          <button class=" bg-violet-200 cell"></button>
          <button class=" bg-violet-300 cell"></button>
          <button class=" bg-violet-400 cell"></button>
          <button class=" bg-violet-500 cell"></button>
          <button class=" bg-violet-600 cell"></button>
          <button class=" bg-violet-700 cell"></button>
          <button class=" bg-violet-800 cell"></button>
          <button class=" bg-violet-900 cell"></button>
          <button class=" bg-violet-950 cell"></button>
        </div>
        <!-- pink -->
        <div class="grid">
          <button class=" bg-pink-50 cell"></button>
          <button class=" bg-pink-100 cell"></button>
          <button class=" bg-pink-200 cell"></button>
          <button class=" bg-pink-300 cell"></button>
          <button class=" bg-pink-400 cell"></button>
          <button class=" bg-pink-500 cell"></button>
          <button class=" bg-pink-600 cell"></button>
          <button class=" bg-pink-700 cell"></button>
          <button class=" bg-pink-800 cell"></button>
          <button class=" bg-pink-900 cell"></button>
          <button class=" bg-pink-950 cell"></button>
        </div>
        <!-- rose -->
        <div class="grid">
          <button class=" bg-rose-50 cell"></button>
          <button class=" bg-rose-100 cell"></button>
          <button class=" bg-rose-200 cell"></button>
          <button class=" bg-rose-300 cell"></button>
          <button class=" bg-rose-400 cell"></button>
          <button class=" bg-rose-500 cell"></button>
          <button class=" bg-rose-600 cell"></button>
          <button class=" bg-rose-700 cell"></button>
          <button class=" bg-rose-800 cell"></button>
          <button class=" bg-rose-900 cell"></button>
          <button class=" bg-rose-950 cell"></button>
        </div>
      </div>
    {/if}
    <!-- choose gradient -->
    <div>
      <label for="Gradient">Gradient</label>
    </div>
    <!-- upload image -->
    <div>
      <label for="Image">Upload Background</label>
    </div>

  <!-- buttons -->
  <div>
    <h2>Buttons</h2>
    <!-- button shape -->
    <div></div>
    <!-- button shadow -->
    <div></div>
    <!-- button border -->
    <div></div>
    <!-- button color -->
    <div></div>
    <!-- button font -->
    <div></div>
    <!-- button font color -->
    <div></div>
  </div>

  <div>
    <!-- fonts -->
    <h2>Font</h2>
    <!-- font dropdown -->
    <div></div>
    <!-- font color -->
    <div class="bg-opacity-20"></div>
  </div>
</div>

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

  
  </style>