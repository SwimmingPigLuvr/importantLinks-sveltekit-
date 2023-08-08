
<!-- goal -->
<!-- to save appearance preferences into a new custom theme -->

<!-- that way applying them is as easy as changing themes -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { backIn, backOut, cubicIn, cubicInOut } from "svelte/easing";
  import { fade, fly, slide } from "svelte/transition";
  
  import { db, user, userData } from "$lib/firebase";
  import { doc, writeBatch } from "firebase/firestore";

  const dispatch = createEventDispatcher();

    let color = '';
    let gradientColor1 = '';
    let gradientColor2 = '';
    let firstColorSelected = false;



    $: gradientClass = `bg-gradient-to-b from-${gradientColor1} to-${gradientColor2}`;

    let chosenBackground = '';

    async function saveBackground() {
      console.log("saving background: ", chosenBackground);

      const batch = writeBatch(db);

      // update the bg property inside the theme object
      batch.set(doc(db, "users", $user!.uid), {
        theme: {
          background: chosenBackground
        }
      }, { merge: true });

      await batch.commit();
      chosenBackground = '';
    }

    export let gradientMode = false;

    const handleColorSelect = (selectedColor: string) => {
      if (gradientMode) {
        // implement gradient choices
        // choice 1 = gradientColor1
        // choice 2 = gradientColor2
        // chosenBackground = "from-{gradientColor1} to-{gradientColor2}"; 

        if (!gradientColor1) {
          gradientColor1 = selectedColor;
          return; // only the first choice is made, so we do not save just yet
        }

        // choose next color
        if (gradientColor1 && !gradientColor2) {
          gradientColor2 = selectedColor;
        }

        // create name from choices
        chosenBackground = `from-${gradientColor1} to-${gradientColor2}`;
        saveBackground();

        // reset gradientMode & gradientColors
        gradientMode = false;
        gradientColor1 = '';
        gradientColor2 = '';
      } else {
        chosenBackground = selectedColor;
        saveBackground();
      }
    };

</script>


<!-- picker modal -->
<div 
    in:slide={{ duration: 1000, easing: cubicInOut }}
    out:slide={{ duration: 1000, easing: cubicInOut }}
    class="mt-10 z-50 pb-4 mx-auto flex flex-col space-y-4">

    {#if !gradientMode}
      <h3 class="font-input-mono">Choose Background Color</h3>
    {:else}
      <h3 class="font-input-mono">Choose Background Gradient</h3>
    {/if}


<!-- colors -->
    <div 
          class=" flex flex-col m-auto" 
          
          >
          <!-- slate -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'slate-50'} on:click={() => handleColorSelect('slate-50')}  class=" bg-slate-50 cell rounded-tl-full"></button>
            <button on:mouseenter={() => color = 'slate-100'} on:click={() => handleColorSelect('slate-100')} class=" bg-slate-100 cell"></button>
            <button on:mouseenter={() => color = 'slate-200'} on:click={() => handleColorSelect('slate-200')} class=" bg-slate-200 cell"></button>
            <button on:mouseenter={() => color = 'slate-300'} on:click={() => handleColorSelect('slate-300')} class=" bg-slate-300 cell"></button>
            <button on:mouseenter={() => color = 'slate-400'} on:click={() => handleColorSelect('slate-400')} class=" bg-slate-400 cell"></button>
            <button on:mouseenter={() => color = 'slate-500'} on:click={() => handleColorSelect('slate-500')} class=" bg-slate-500 cell"></button>
            <button on:mouseenter={() => color = 'slate-600'} on:click={() => handleColorSelect('slate-600')} class=" bg-slate-600 cell"></button>
            <button on:mouseenter={() => color = 'slate-700'} on:click={() => handleColorSelect('slate-700')} class=" bg-slate-700 cell"></button>
            <button on:mouseenter={() => color = 'slate-800'} on:click={() => handleColorSelect('slate-800')} class=" bg-slate-800 cell"></button>
            <button on:mouseenter={() => color = 'slate-900'} on:click={() => handleColorSelect('slate-900')} class=" bg-slate-900 cell"></button>
            <button on:mouseenter={() => color = 'slate-950'} on:click={() => handleColorSelect('slate-950')} class=" bg-slate-950 cell rounded-tr-full"></button>
          </div>
          <!-- gray -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'gray-50'} on:click={() => handleColorSelect('gray-50')}   class=" bg-gray-50 cell"></button>
            <button on:mouseenter={() => color = 'gray-100'} on:click={() => handleColorSelect('gray-100')} class=" bg-gray-100 cell"></button>
            <button on:mouseenter={() => color = 'gray-200'} on:click={() => handleColorSelect('gray-200')} class=" bg-gray-200 cell"></button>
            <button on:mouseenter={() => color = 'gray-300'} on:click={() => handleColorSelect('gray-300')} class=" bg-gray-300 cell"></button>
            <button on:mouseenter={() => color = 'gray-400'} on:click={() => handleColorSelect('gray-400')} class=" bg-gray-400 cell"></button>
            <button on:mouseenter={() => color = 'gray-500'} on:click={() => handleColorSelect('gray-500')} class=" bg-gray-500 cell"></button>
            <button on:mouseenter={() => color = 'gray-600'} on:click={() => handleColorSelect('gray-600')} class=" bg-gray-600 cell"></button>
            <button on:mouseenter={() => color = 'gray-700'} on:click={() => handleColorSelect('gray-700')} class=" bg-gray-700 cell"></button>
            <button on:mouseenter={() => color = 'gray-800'} on:click={() => handleColorSelect('gray-800')} class=" bg-gray-800 cell"></button>
            <button on:mouseenter={() => color = 'gray-900'} on:click={() => handleColorSelect('gray-900')} class=" bg-gray-900 cell"></button>
            <button on:mouseenter={() => color = 'gray-950'} on:click={() => handleColorSelect('gray-950')} class=" bg-gray-950 cell"></button>
          </div>
          <!-- zinc -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'zinc-50'} on:click={() => handleColorSelect('zinc-50')}   class=" bg-zinc-50 cell"></button>
            <button on:mouseenter={() => color = 'zinc-100'} on:click={() => handleColorSelect('zinc-100')} class=" bg-zinc-100 cell"></button>
            <button on:mouseenter={() => color = 'zinc-200'} on:click={() => handleColorSelect('zinc-200')} class=" bg-zinc-200 cell"></button>
            <button on:mouseenter={() => color = 'zinc-300'} on:click={() => handleColorSelect('zinc-300')} class=" bg-zinc-300 cell"></button>
            <button on:mouseenter={() => color = 'zinc-400'} on:click={() => handleColorSelect('zinc-400')} class=" bg-zinc-400 cell"></button>
            <button on:mouseenter={() => color = 'zinc-500'} on:click={() => handleColorSelect('zinc-500')} class=" bg-zinc-500 cell"></button>
            <button on:mouseenter={() => color = 'zinc-600'} on:click={() => handleColorSelect('zinc-600')} class=" bg-zinc-600 cell"></button>
            <button on:mouseenter={() => color = 'zinc-700'} on:click={() => handleColorSelect('zinc-700')} class=" bg-zinc-700 cell"></button>
            <button on:mouseenter={() => color = 'zinc-800'} on:click={() => handleColorSelect('zinc-800')} class=" bg-zinc-800 cell"></button>
            <button on:mouseenter={() => color = 'zinc-900'} on:click={() => handleColorSelect('zinc-900')} class=" bg-zinc-900 cell"></button>
            <button on:mouseenter={() => color = 'zinc-950'} on:click={() => handleColorSelect('zinc-950')} class=" bg-zinc-950 cell"></button>
          </div>
          <!-- neutral -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'neutral-50'} on:click={() => handleColorSelect('neutral-50')}   class=" bg-neutral-50 cell"></button>
            <button on:mouseenter={() => color = 'neutral-100'} on:click={() => handleColorSelect('neutral-100')} class=" bg-neutral-100 cell"></button>
            <button on:mouseenter={() => color = 'neutral-200'} on:click={() => handleColorSelect('neutral-200')} class=" bg-neutral-200 cell"></button>
            <button on:mouseenter={() => color = 'neutral-300'} on:click={() => handleColorSelect('neutral-300')} class=" bg-neutral-300 cell"></button>
            <button on:mouseenter={() => color = 'neutral-400'} on:click={() => handleColorSelect('neutral-400')} class=" bg-neutral-400 cell"></button>
            <button on:mouseenter={() => color = 'neutral-500'} on:click={() => handleColorSelect('neutral-500')} class=" bg-neutral-500 cell"></button>
            <button on:mouseenter={() => color = 'neutral-600'} on:click={() => handleColorSelect('neutral-600')} class=" bg-neutral-600 cell"></button>
            <button on:mouseenter={() => color = 'neutral-700'} on:click={() => handleColorSelect('neutral-700')} class=" bg-neutral-700 cell"></button>
            <button on:mouseenter={() => color = 'neutral-800'} on:click={() => handleColorSelect('neutral-800')} class=" bg-neutral-800 cell"></button>
            <button on:mouseenter={() => color = 'neutral-900'} on:click={() => handleColorSelect('neutral-900')} class=" bg-neutral-900 cell"></button>
            <button on:mouseenter={() => color = 'black'} on:click={() => handleColorSelect('black')} class=" bg-black cell"></button>
          </div>
          <!-- stone -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'stone-50'} on:click={() => handleColorSelect('stone-50')}   class=" bg-stone-50 cell"></button>
            <button on:mouseenter={() => color = 'stone-100'} on:click={() => handleColorSelect('stone-100')} class=" bg-stone-100 cell"></button>
            <button on:mouseenter={() => color = 'stone-200'} on:click={() => handleColorSelect('stone-200')} class=" bg-stone-200 cell"></button>
            <button on:mouseenter={() => color = 'stone-300'} on:click={() => handleColorSelect('stone-300')} class=" bg-stone-300 cell"></button>
            <button on:mouseenter={() => color = 'stone-400'} on:click={() => handleColorSelect('stone-400')} class=" bg-stone-400 cell"></button>
            <button on:mouseenter={() => color = 'stone-500'} on:click={() => handleColorSelect('stone-500')} class=" bg-stone-500 cell"></button>
            <button on:mouseenter={() => color = 'stone-600'} on:click={() => handleColorSelect('stone-600')} class=" bg-stone-600 cell"></button>
            <button on:mouseenter={() => color = 'stone-700'} on:click={() => handleColorSelect('stone-700')} class=" bg-stone-700 cell"></button>
            <button on:mouseenter={() => color = 'stone-800'} on:click={() => handleColorSelect('stone-800')} class=" bg-stone-800 cell"></button>
            <button on:mouseenter={() => color = 'stone-900'} on:click={() => handleColorSelect('stone-900')} class=" bg-stone-900 cell"></button>
            <button on:mouseenter={() => color = 'stone-950'} on:click={() => handleColorSelect('stone-950')} class=" bg-stone-950 cell"></button>
          </div>
          <!-- red -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'red-50'} on:click={() => handleColorSelect('red-50')}  class=" bg-red-50 cell"></button>
            <button on:mouseenter={() => color = 'red-100'} on:click={() => handleColorSelect('red-100')}  class=" bg-red-100 cell"></button>
            <button on:mouseenter={() => color = 'red-200'} on:click={() => handleColorSelect('red-200')}  class=" bg-red-200 cell"></button>
            <button on:mouseenter={() => color = 'red-300'} on:click={() => handleColorSelect('red-300')}  class=" bg-red-300 cell"></button>
            <button on:mouseenter={() => color = 'red-400'} on:click={() => handleColorSelect('red-400')}  class=" bg-red-400 cell"></button>
            <button on:mouseenter={() => color = 'red-500'} on:click={() => handleColorSelect('red-500')}  class=" bg-red-500 cell"></button>
            <button on:mouseenter={() => color = 'red-600'} on:click={() => handleColorSelect('red-600')}  class=" bg-red-600 cell"></button>
            <button on:mouseenter={() => color = 'red-700'} on:click={() => handleColorSelect('red-700')}  class=" bg-red-700 cell"></button>
            <button on:mouseenter={() => color = 'red-800'} on:click={() => handleColorSelect('red-800')}  class=" bg-red-800 cell"></button>
            <button on:mouseenter={() => color = 'red-900'} on:click={() => handleColorSelect('red-900')}  class=" bg-red-900 cell"></button>
            <button on:mouseenter={() => color = 'red-950'} on:click={() => handleColorSelect('red-950')}  class=" bg-red-950 cell"></button>
          </div>
          <!-- orange -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'orange-50'} on:click={() => handleColorSelect('orange-50')}  class=" bg-orange-50 cell"></button>
            <button on:mouseenter={() => color = 'orange-100'} on:click={() => handleColorSelect('orange-100')}  class=" bg-orange-100 cell"></button>
            <button on:mouseenter={() => color = 'orange-200'} on:click={() => handleColorSelect('orange-200')}  class=" bg-orange-200 cell"></button>
            <button on:mouseenter={() => color = 'orange-300'} on:click={() => handleColorSelect('orange-300')}  class=" bg-orange-300 cell"></button>
            <button on:mouseenter={() => color = 'orange-400'} on:click={() => handleColorSelect('orange-400')}  class=" bg-orange-400 cell"></button>
            <button on:mouseenter={() => color = 'orange-500'} on:click={() => handleColorSelect('orange-500')}  class=" bg-orange-500 cell"></button>
            <button on:mouseenter={() => color = 'orange-600'} on:click={() => handleColorSelect('orange-600')}  class=" bg-orange-600 cell"></button>
            <button on:mouseenter={() => color = 'orange-700'} on:click={() => handleColorSelect('orange-700')}  class=" bg-orange-700 cell"></button>
            <button on:mouseenter={() => color = 'orange-800'} on:click={() => handleColorSelect('orange-800')}  class=" bg-orange-800 cell"></button>
            <button on:mouseenter={() => color = 'orange-900'} on:click={() => handleColorSelect('orange-900')}  class=" bg-orange-900 cell"></button>
            <button on:mouseenter={() => color = 'orange-950'} on:click={() => handleColorSelect('orange-950')}  class=" bg-orange-950 cell"></button>
          </div>
          <!-- amber -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'amber-50'} on:click={() => handleColorSelect('amber-50')}  class=" bg-amber-50 cell"></button>
            <button on:mouseenter={() => color = 'amber-100'} on:click={() => handleColorSelect('amber-100')}  class=" bg-amber-100 cell"></button>
            <button on:mouseenter={() => color = 'amber-200'} on:click={() => handleColorSelect('amber-200')}  class=" bg-amber-200 cell"></button>
            <button on:mouseenter={() => color = 'amber-300'} on:click={() => handleColorSelect('amber-300')}  class=" bg-amber-300 cell"></button>
            <button on:mouseenter={() => color = 'amber-400'} on:click={() => handleColorSelect('amber-400')}  class=" bg-amber-400 cell"></button>
            <button on:mouseenter={() => color = 'amber-500'} on:click={() => handleColorSelect('amber-500')}  class=" bg-amber-500 cell"></button>
            <button on:mouseenter={() => color = 'amber-600'} on:click={() => handleColorSelect('amber-600')}  class=" bg-amber-600 cell"></button>
            <button on:mouseenter={() => color = 'amber-700'} on:click={() => handleColorSelect('amber-700')}  class=" bg-amber-700 cell"></button>
            <button on:mouseenter={() => color = 'amber-800'} on:click={() => handleColorSelect('amber-800')}  class=" bg-amber-800 cell"></button>
            <button on:mouseenter={() => color = 'amber-900'} on:click={() => handleColorSelect('amber-900')}  class=" bg-amber-900 cell"></button>
            <button on:mouseenter={() => color = 'amber-950'} on:click={() => handleColorSelect('amber-950')}  class=" bg-amber-950 cell"></button>
          </div>
          <!-- yellow -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'yellow-50'} on:click={() => handleColorSelect('yellow-50')}  class=" bg-yellow-50 cell"></button>
            <button on:mouseenter={() => color = 'yellow-100'} on:click={() => handleColorSelect('yellow-100')}  class=" bg-yellow-100 cell"></button>
            <button on:mouseenter={() => color = 'yellow-200'} on:click={() => handleColorSelect('yellow-200')}  class=" bg-yellow-200 cell"></button>
            <button on:mouseenter={() => color = 'yellow-300'} on:click={() => handleColorSelect('yellow-300')}  class=" bg-yellow-300 cell"></button>
            <button on:mouseenter={() => color = 'yellow-400'} on:click={() => handleColorSelect('yellow-400')}  class=" bg-yellow-400 cell"></button>
            <button on:mouseenter={() => color = 'yellow-500'} on:click={() => handleColorSelect('yellow-500')}  class=" bg-yellow-500 cell"></button>
            <button on:mouseenter={() => color = 'yellow-600'} on:click={() => handleColorSelect('yellow-600')}  class=" bg-yellow-600 cell"></button>
            <button on:mouseenter={() => color = 'yellow-700'} on:click={() => handleColorSelect('yellow-700')}  class=" bg-yellow-700 cell"></button>
            <button on:mouseenter={() => color = 'yellow-800'} on:click={() => handleColorSelect('yellow-800')}  class=" bg-yellow-800 cell"></button>
            <button on:mouseenter={() => color = 'yellow-900'} on:click={() => handleColorSelect('yellow-900')}  class=" bg-yellow-900 cell"></button>
            <button on:mouseenter={() => color = 'yellow-950'} on:click={() => handleColorSelect('yellow-950')}  class=" bg-yellow-950 cell"></button>
          </div>
          <!-- lime -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'lime-50'} on:click={() => handleColorSelect('lime-50')}  class=" bg-lime-50 cell"></button>
            <button on:mouseenter={() => color = 'lime-100'} on:click={() => handleColorSelect('lime-100')}  class=" bg-lime-100 cell"></button>
            <button on:mouseenter={() => color = 'lime-200'} on:click={() => handleColorSelect('lime-200')}  class=" bg-lime-200 cell"></button>
            <button on:mouseenter={() => color = 'lime-300'} on:click={() => handleColorSelect('lime-300')}  class=" bg-lime-300 cell"></button>
            <button on:mouseenter={() => color = 'lime-400'} on:click={() => handleColorSelect('lime-400')}  class=" bg-lime-400 cell"></button>
            <button on:mouseenter={() => color = 'lime-500'} on:click={() => handleColorSelect('lime-500')}  class=" bg-lime-500 cell"></button>
            <button on:mouseenter={() => color = 'lime-600'} on:click={() => handleColorSelect('lime-600')}  class=" bg-lime-600 cell"></button>
            <button on:mouseenter={() => color = 'lime-700'} on:click={() => handleColorSelect('lime-700')}  class=" bg-lime-700 cell"></button>
            <button on:mouseenter={() => color = 'lime-800'} on:click={() => handleColorSelect('lime-800')}  class=" bg-lime-800 cell"></button>
            <button on:mouseenter={() => color = 'lime-900'} on:click={() => handleColorSelect('lime-900')}  class=" bg-lime-900 cell"></button>
            <button on:mouseenter={() => color = 'lime-950'} on:click={() => handleColorSelect('lime-950')}  class=" bg-lime-950 cell"></button>
          </div>
          <!-- green -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'green-50'} on:click={() => handleColorSelect('green-50')}  class=" bg-green-50 cell"></button>
            <button on:mouseenter={() => color = 'green-100'} on:click={() => handleColorSelect('green-100')}  class=" bg-green-100 cell"></button>
            <button on:mouseenter={() => color = 'green-200'} on:click={() => handleColorSelect('green-200')}  class=" bg-green-200 cell"></button>
            <button on:mouseenter={() => color = 'green-300'} on:click={() => handleColorSelect('green-300')}  class=" bg-green-300 cell"></button>
            <button on:mouseenter={() => color = 'green-400'} on:click={() => handleColorSelect('green-400')}  class=" bg-green-400 cell"></button>
            <button on:mouseenter={() => color = 'green-500'} on:click={() => handleColorSelect('green-500')}  class=" bg-green-500 cell"></button>
            <button on:mouseenter={() => color = 'green-600'} on:click={() => handleColorSelect('green-600')}  class=" bg-green-600 cell"></button>
            <button on:mouseenter={() => color = 'green-700'} on:click={() => handleColorSelect('green-700')}  class=" bg-green-700 cell"></button>
            <button on:mouseenter={() => color = 'green-800'} on:click={() => handleColorSelect('green-800')}  class=" bg-green-800 cell"></button>
            <button on:mouseenter={() => color = 'green-900'} on:click={() => handleColorSelect('green-900')}  class=" bg-green-900 cell"></button>
            <button on:mouseenter={() => color = 'green-950'} on:click={() => handleColorSelect('green-950')}  class=" bg-green-950 cell"></button>
          </div>
          <!-- emerald -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'emerald-50'} on:click={() => handleColorSelect('emerald-50')}  class=" bg-emerald-50 cell"></button>
            <button on:mouseenter={() => color = 'emerald-100'} on:click={() => handleColorSelect('emerald-100')}  class=" bg-emerald-100 cell"></button>
            <button on:mouseenter={() => color = 'emerald-200'} on:click={() => handleColorSelect('emerald-200')}  class=" bg-emerald-200 cell"></button>
            <button on:mouseenter={() => color = 'emerald-300'} on:click={() => handleColorSelect('emerald-300')}  class=" bg-emerald-300 cell"></button>
            <button on:mouseenter={() => color = 'emerald-400'} on:click={() => handleColorSelect('emerald-400')}  class=" bg-emerald-400 cell"></button>
            <button on:mouseenter={() => color = 'emerald-500'} on:click={() => handleColorSelect('emerald-500')}  class=" bg-emerald-500 cell"></button>
            <button on:mouseenter={() => color = 'emerald-600'} on:click={() => handleColorSelect('emerald-600')}  class=" bg-emerald-600 cell"></button>
            <button on:mouseenter={() => color = 'emerald-700'} on:click={() => handleColorSelect('emerald-700')}  class=" bg-emerald-700 cell"></button>
            <button on:mouseenter={() => color = 'emerald-800'} on:click={() => handleColorSelect('emerald-800')}  class=" bg-emerald-800 cell"></button>
            <button on:mouseenter={() => color = 'emerald-900'} on:click={() => handleColorSelect('emerald-900')}  class=" bg-emerald-900 cell"></button>
            <button on:mouseenter={() => color = 'emerald-950'} on:click={() => handleColorSelect('emerald-950')}  class=" bg-emerald-950 cell"></button>
          </div>
          <!-- teal -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'teal-50'} on:click={() => handleColorSelect('teal-50')}  class=" bg-teal-50 cell"></button>
            <button on:mouseenter={() => color = 'teal-100'} on:click={() => handleColorSelect('teal-100')}  class=" bg-teal-100 cell"></button>
            <button on:mouseenter={() => color = 'teal-200'} on:click={() => handleColorSelect('teal-200')}  class=" bg-teal-200 cell"></button>
            <button on:mouseenter={() => color = 'teal-300'} on:click={() => handleColorSelect('teal-300')}  class=" bg-teal-300 cell"></button>
            <button on:mouseenter={() => color = 'teal-400'} on:click={() => handleColorSelect('teal-400')}  class=" bg-teal-400 cell"></button>
            <button on:mouseenter={() => color = 'teal-500'} on:click={() => handleColorSelect('teal-500')}  class=" bg-teal-500 cell"></button>
            <button on:mouseenter={() => color = 'teal-600'} on:click={() => handleColorSelect('teal-600')}  class=" bg-teal-600 cell"></button>
            <button on:mouseenter={() => color = 'teal-700'} on:click={() => handleColorSelect('teal-700')}  class=" bg-teal-700 cell"></button>
            <button on:mouseenter={() => color = 'teal-800'} on:click={() => handleColorSelect('teal-800')}  class=" bg-teal-800 cell"></button>
            <button on:mouseenter={() => color = 'teal-900'} on:click={() => handleColorSelect('teal-900')}  class=" bg-teal-900 cell"></button>
            <button on:mouseenter={() => color = 'teal-950'} on:click={() => handleColorSelect('teal-950')}  class=" bg-teal-950 cell"></button>
          </div>
          <!-- cyan -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'cyan-50'} on:click={() => handleColorSelect('cyan-50')}  class=" bg-cyan-50 cell"></button>
            <button on:mouseenter={() => color = 'cyan-100'} on:click={() => handleColorSelect('cyan-100')}  class=" bg-cyan-100 cell"></button>
            <button on:mouseenter={() => color = 'cyan-200'} on:click={() => handleColorSelect('cyan-200')}  class=" bg-cyan-200 cell"></button>
            <button on:mouseenter={() => color = 'cyan-300'} on:click={() => handleColorSelect('cyan-300')}  class=" bg-cyan-300 cell"></button>
            <button on:mouseenter={() => color = 'cyan-400'} on:click={() => handleColorSelect('cyan-400')}  class=" bg-cyan-400 cell"></button>
            <button on:mouseenter={() => color = 'cyan-500'} on:click={() => handleColorSelect('cyan-500')}  class=" bg-cyan-500 cell"></button>
            <button on:mouseenter={() => color = 'cyan-600'} on:click={() => handleColorSelect('cyan-600')}  class=" bg-cyan-600 cell"></button>
            <button on:mouseenter={() => color = 'cyan-700'} on:click={() => handleColorSelect('cyan-700')}  class=" bg-cyan-700 cell"></button>
            <button on:mouseenter={() => color = 'cyan-800'} on:click={() => handleColorSelect('cyan-800')}  class=" bg-cyan-800 cell"></button>
            <button on:mouseenter={() => color = 'cyan-900'} on:click={() => handleColorSelect('cyan-900')}  class=" bg-cyan-900 cell"></button>
            <button on:mouseenter={() => color = 'cyan-950'} on:click={() => handleColorSelect('cyan-950')}  class=" bg-cyan-950 cell"></button>
          </div>
          <!-- sky -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'sky-50'} on:click={() => handleColorSelect('sky-50')}  class=" bg-sky-50 cell"></button>
            <button on:mouseenter={() => color = 'sky-100'} on:click={() => handleColorSelect('sky-100')}  class=" bg-sky-100 cell"></button>
            <button on:mouseenter={() => color = 'sky-200'} on:click={() => handleColorSelect('sky-200')}  class=" bg-sky-200 cell"></button>
            <button on:mouseenter={() => color = 'sky-300'} on:click={() => handleColorSelect('sky-300')}  class=" bg-sky-300 cell"></button>
            <button on:mouseenter={() => color = 'sky-400'} on:click={() => handleColorSelect('sky-400')}  class=" bg-sky-400 cell"></button>
            <button on:mouseenter={() => color = 'sky-500'} on:click={() => handleColorSelect('sky-500')}  class=" bg-sky-500 cell"></button>
            <button on:mouseenter={() => color = 'sky-600'} on:click={() => handleColorSelect('sky-600')}  class=" bg-sky-600 cell"></button>
            <button on:mouseenter={() => color = 'sky-700'} on:click={() => handleColorSelect('sky-700')}  class=" bg-sky-700 cell"></button>
            <button on:mouseenter={() => color = 'sky-800'} on:click={() => handleColorSelect('sky-800')}  class=" bg-sky-800 cell"></button>
            <button on:mouseenter={() => color = 'sky-900'} on:click={() => handleColorSelect('sky-900')}  class=" bg-sky-900 cell"></button>
            <button on:mouseenter={() => color = 'sky-950'} on:click={() => handleColorSelect('sky-950')}  class=" bg-sky-950 cell"></button>
          </div>
          <!-- blue -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'blue-50'} on:click={() => handleColorSelect('blue-50')}  class=" bg-blue-50 cell"></button>
            <button on:mouseenter={() => color = 'blue-100'} on:click={() => handleColorSelect('blue-100')}  class=" bg-blue-100 cell"></button>
            <button on:mouseenter={() => color = 'blue-200'} on:click={() => handleColorSelect('blue-200')}  class=" bg-blue-200 cell"></button>
            <button on:mouseenter={() => color = 'blue-300'} on:click={() => handleColorSelect('blue-300')}  class=" bg-blue-300 cell"></button>
            <button on:mouseenter={() => color = 'blue-400'} on:click={() => handleColorSelect('blue-400')}  class=" bg-blue-400 cell"></button>
            <button on:mouseenter={() => color = 'blue-500'} on:click={() => handleColorSelect('blue-500')}  class=" bg-blue-500 cell"></button>
            <button on:mouseenter={() => color = 'blue-600'} on:click={() => handleColorSelect('blue-600')}  class=" bg-blue-600 cell"></button>
            <button on:mouseenter={() => color = 'blue-700'} on:click={() => handleColorSelect('blue-700')}  class=" bg-blue-700 cell"></button>
            <button on:mouseenter={() => color = 'blue-800'} on:click={() => handleColorSelect('blue-800')}  class=" bg-blue-800 cell"></button>
            <button on:mouseenter={() => color = 'blue-900'} on:click={() => handleColorSelect('blue-900')}  class=" bg-blue-900 cell"></button>
            <button on:mouseenter={() => color = 'blue-950'} on:click={() => handleColorSelect('blue-950')}  class=" bg-blue-950 cell"></button>
          </div>
          <!-- indigo -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'indigo-50'} on:click={() => handleColorSelect('indigo-50')}  class=" bg-indigo-50 cell"></button>
            <button on:mouseenter={() => color = 'indigo-100'} on:click={() => handleColorSelect('indigo-100')}  class=" bg-indigo-100 cell"></button>
            <button on:mouseenter={() => color = 'indigo-200'} on:click={() => handleColorSelect('indigo-200')}  class=" bg-indigo-200 cell"></button>
            <button on:mouseenter={() => color = 'indigo-300'} on:click={() => handleColorSelect('indigo-300')}  class=" bg-indigo-300 cell"></button>
            <button on:mouseenter={() => color = 'indigo-400'} on:click={() => handleColorSelect('indigo-400')}  class=" bg-indigo-400 cell"></button>
            <button on:mouseenter={() => color = 'indigo-500'} on:click={() => handleColorSelect('indigo-500')}  class=" bg-indigo-500 cell"></button>
            <button on:mouseenter={() => color = 'indigo-600'} on:click={() => handleColorSelect('indigo-600')}  class=" bg-indigo-600 cell"></button>
            <button on:mouseenter={() => color = 'indigo-700'} on:click={() => handleColorSelect('indigo-700')}  class=" bg-indigo-700 cell"></button>
            <button on:mouseenter={() => color = 'indigo-800'} on:click={() => handleColorSelect('indigo-800')}  class=" bg-indigo-800 cell"></button>
            <button on:mouseenter={() => color = 'indigo-900'} on:click={() => handleColorSelect('indigo-900')}  class=" bg-indigo-900 cell"></button>
            <button on:mouseenter={() => color = 'indigo-950'} on:click={() => handleColorSelect('indigo-950')}  class=" bg-indigo-950 cell"></button>
          </div>
          <!-- violet -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'violet-50'} on:click={() => handleColorSelect('violet-50')}  class=" bg-violet-50 cell"></button>
            <button on:mouseenter={() => color = 'violet-100'} on:click={() => handleColorSelect('violet-100')}  class=" bg-violet-100 cell"></button>
            <button on:mouseenter={() => color = 'violet-200'} on:click={() => handleColorSelect('violet-200')}  class=" bg-violet-200 cell"></button>
            <button on:mouseenter={() => color = 'violet-300'} on:click={() => handleColorSelect('violet-300')}  class=" bg-violet-300 cell"></button>
            <button on:mouseenter={() => color = 'violet-400'} on:click={() => handleColorSelect('violet-400')}  class=" bg-violet-400 cell"></button>
            <button on:mouseenter={() => color = 'violet-500'} on:click={() => handleColorSelect('violet-500')}  class=" bg-violet-500 cell"></button>
            <button on:mouseenter={() => color = 'violet-600'} on:click={() => handleColorSelect('violet-600')}  class=" bg-violet-600 cell"></button>
            <button on:mouseenter={() => color = 'violet-700'} on:click={() => handleColorSelect('violet-700')}  class=" bg-violet-700 cell"></button>
            <button on:mouseenter={() => color = 'violet-800'} on:click={() => handleColorSelect('violet-800')}  class=" bg-violet-800 cell"></button>
            <button on:mouseenter={() => color = 'violet-900'} on:click={() => handleColorSelect('violet-900')}  class=" bg-violet-900 cell"></button>
            <button on:mouseenter={() => color = 'violet-950'} on:click={() => handleColorSelect('violet-950')}  class=" bg-violet-950 cell"></button>
          </div>
          <!-- purple -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'purple-50'} on:click={() => handleColorSelect('purple-50')}  class=" bg-purple-50 cell"></button>
            <button on:mouseenter={() => color = 'purple-100'} on:click={() => handleColorSelect('purple-100')}  class=" bg-purple-100 cell"></button>
            <button on:mouseenter={() => color = 'purple-200'} on:click={() => handleColorSelect('purple-200')}  class=" bg-purple-200 cell"></button>
            <button on:mouseenter={() => color = 'purple-300'} on:click={() => handleColorSelect('purple-300')}  class=" bg-purple-300 cell"></button>
            <button on:mouseenter={() => color = 'purple-400'} on:click={() => handleColorSelect('purple-400')}  class=" bg-purple-400 cell"></button>
            <button on:mouseenter={() => color = 'purple-500'} on:click={() => handleColorSelect('purple-500')}  class=" bg-purple-500 cell"></button>
            <button on:mouseenter={() => color = 'purple-600'} on:click={() => handleColorSelect('purple-600')}  class=" bg-purple-600 cell"></button>
            <button on:mouseenter={() => color = 'purple-700'} on:click={() => handleColorSelect('purple-700')}  class=" bg-purple-700 cell"></button>
            <button on:mouseenter={() => color = 'purple-800'} on:click={() => handleColorSelect('purple-800')}  class=" bg-purple-800 cell"></button>
            <button on:mouseenter={() => color = 'purple-900'} on:click={() => handleColorSelect('purple-900')}  class=" bg-purple-900 cell"></button>
            <button on:mouseenter={() => color = 'purple-950'} on:click={() => handleColorSelect('purple-950')}  class=" bg-purple-950 cell"></button>
          </div>
          <!-- fuchsia -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'fuchsia-50'} on:click={() => handleColorSelect('fuchsia-50')}  class=" bg-fuchsia-50 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-100'} on:click={() => handleColorSelect('fuchsia-100')}  class=" bg-fuchsia-100 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-200'} on:click={() => handleColorSelect('fuchsia-200')}  class=" bg-fuchsia-200 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-300'} on:click={() => handleColorSelect('fuchsia-300')}  class=" bg-fuchsia-300 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-400'} on:click={() => handleColorSelect('fuchsia-400')}  class=" bg-fuchsia-400 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-500'} on:click={() => handleColorSelect('fuchsia-500')}  class=" bg-fuchsia-500 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-600'} on:click={() => handleColorSelect('fuchsia-600')}  class=" bg-fuchsia-600 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-700'} on:click={() => handleColorSelect('fuchsia-700')}  class=" bg-fuchsia-700 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-800'} on:click={() => handleColorSelect('fuchsia-800')}  class=" bg-fuchsia-800 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-900'} on:click={() => handleColorSelect('fuchsia-900')}  class=" bg-fuchsia-900 cell"></button>
            <button on:mouseenter={() => color = 'fuchsia-950'} on:click={() => handleColorSelect('fuchsia-950')}  class=" bg-fuchsia-950 cell"></button>
          </div>
          <!-- pink -->
          <div class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'pink-50'} on:click={() => handleColorSelect('pink-50')}  class=" bg-pink-50 cell"></button>
            <button on:mouseenter={() => color = 'pink-100'} on:click={() => handleColorSelect('pink-100')}  class=" bg-pink-100 cell"></button>
            <button on:mouseenter={() => color = 'pink-200'} on:click={() => handleColorSelect('pink-200')}  class=" bg-pink-200 cell"></button>
            <button on:mouseenter={() => color = 'pink-300'} on:click={() => handleColorSelect('pink-300')}  class=" bg-pink-300 cell"></button>
            <button on:mouseenter={() => color = 'pink-400'} on:click={() => handleColorSelect('pink-400')}  class=" bg-pink-400 cell"></button>
            <button on:mouseenter={() => color = 'pink-500'} on:click={() => handleColorSelect('pink-500')}  class=" bg-pink-500 cell"></button>
            <button on:mouseenter={() => color = 'pink-600'} on:click={() => handleColorSelect('pink-600')}  class=" bg-pink-600 cell"></button>
            <button on:mouseenter={() => color = 'pink-700'} on:click={() => handleColorSelect('pink-700')}  class=" bg-pink-700 cell"></button>
            <button on:mouseenter={() => color = 'pink-800'} on:click={() => handleColorSelect('pink-800')}  class=" bg-pink-800 cell"></button>
            <button on:mouseenter={() => color = 'pink-900'} on:click={() => handleColorSelect('pink-900')}  class=" bg-pink-900 cell"></button>
            <button on:mouseenter={() => color = 'pink-950'} on:click={() => handleColorSelect('pink-950')}  class=" bg-pink-950 cell"></button>
          </div>
          <!-- rose -->
          <div  class="flex overflow-x-auto w-full">
            <button on:mouseenter={() => color = 'rose-50'} on:click={() => handleColorSelect('rose-50')}  class=" bg-rose-50 cell rounded-bl-full"></button>
            <button on:mouseenter={() => color = 'rose-100'} on:click={() => handleColorSelect('rose-100')} class=" bg-rose-100 cell"></button>
            <button on:mouseenter={() => color = 'rose-200'} on:click={() => handleColorSelect('rose-200')} class=" bg-rose-200 cell"></button>
            <button on:mouseenter={() => color = 'rose-300'} on:click={() => handleColorSelect('rose-300')} class=" bg-rose-300 cell"></button>
            <button on:mouseenter={() => color = 'rose-400'} on:click={() => handleColorSelect('rose-400')} class=" bg-rose-400 cell"></button>
            <button on:mouseenter={() => color = 'rose-500'} on:click={() => handleColorSelect('rose-500')} class=" bg-rose-500 cell"></button>
            <button on:mouseenter={() => color = 'rose-600'} on:click={() => handleColorSelect('rose-600')} class=" bg-rose-600 cell"></button>
            <button on:mouseenter={() => color = 'rose-700'} on:click={() => handleColorSelect('rose-700')} class=" bg-rose-700 cell"></button>
            <button on:mouseenter={() => color = 'rose-800'} on:click={() => handleColorSelect('rose-800')} class=" bg-rose-800 cell"></button>
            <button on:mouseenter={() => color = 'rose-900'} on:click={() => handleColorSelect('rose-900')} class=" bg-rose-900 cell"></button>
            <button on:mouseenter={() => color = 'rose-950'} on:click={() => handleColorSelect('rose-950')} class=" bg-rose-950 cell rounded-br-full"></button>
          </div>
        </div>
<!-- end colors -->



<!-- current color -->
    <div class="w-full flex justify-end items-end space-x-8 p-3">
        <!-- gradient picker -->
        {#if gradientMode}
            <div class="{gradientClass} w-40 h-16 rounded-xl shadow-md "></div>
            <div class="w-40 h-16 rounded-xl shadow-md  bg-{gradientColor1}"></div>
            <div class="w-40 h-16 rounded-xl shadow-md  bg-{gradientColor2}"></div>
            <p class="font-input-mono text-{color} text-center text-[1rem]">{gradientColor1} to {gradientColor2}</p>
        {:else}
        <!-- preview -->
            <p class="font-input-mono text-{color} text-[2rem]">{color}</p>
            <div class="w-20 h-16 rounded-xl shadow-md bg-{color}">
            </div>
        {/if}
    </div>

</div>

<style>

  

  .cell {
    width: calc((100vw / 22) - 0rem);
    height: 1rem;
    position: relative;
  }

  .cell::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.21);
    opacity: 0;
    border: 1px solid transparent;
    transition: opacity 0.3s ease-in-out, border-color 0.3s ease-out-in;
  }

  .cell:hover::after {
      opacity: 1;
      border-color: white;
  }

  /* Media query for small screens */
@media (max-width: 768px) {
    .cell {
      width: calc((100vw / 11) - 0.75rem );
      height: 1rem;
      position: relative;
      scroll-snap-align: start;
    }
    /* ... other styles as needed */
}


</style>

<!-- aug 6 2023 -->
<!-- idea -->

<!-- what if i rotated the  colorpicker -->
<!-- user will scroll verticall through the middle color -->
<!-- then once on a color they can scroll horizontally for the lighter - darker -->

