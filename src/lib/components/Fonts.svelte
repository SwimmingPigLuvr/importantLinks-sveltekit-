

<script lang="ts">
  import { db, user } from "$lib/firebase";
  import { doc, writeBatch } from "firebase/firestore";
  import { backIn, backOut } from "svelte/easing";
  import { slide } from "svelte/transition";


    let chosenFont = '';

    let fonts = [
        'lithotype',
        'spooky',
        'fit',
        'blix',
        'oblique',
        'balboa',
        'balboa-black',
        'gin',
        'elven',
        'haunted',
        'herb',
        'herb-bold',
        'herb-condensed',
        'herb-condensed-bold',
        'ink',
        'legal-heading',
        'playwright',
        'tech',
        'tech-thin',
        'gerald',
        'gerald-italic',
        'gerald-black',
        'gerald-black-italic',
        'gerald-thin',
        'gerald-thin-italic',
        'input-mono',
        'typewriter',
        'totally-gothic',
    ]
    let sample = '';

    async function saveFont() {
        console.log('saving font: ', chosenFont);

        const batch = writeBatch(db);

        // update font in db
        batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                font: {
                    family: chosenFont
                }
            }
        }, { merge: true });

        await batch.commit();
        chosenFont = '';
    }

    const handleFontSelect = (selectedFont: string) => {
        chosenFont = selectedFont;
        saveFont();
    }

    
</script>

    <h3 class="font-input-mono m-auto text-center text-primary-content">Select Font</h3>
    <div 
        in:slide={{duration: 500, easing: backOut}}
        out:slide={{duration: 500, easing: backIn}}
        class="w-full flex flex-col justify-center items-center bg-primary rounded-lg">
        <input bind:value={sample} placeholder="type here 4 preview" type="text" name="sample" id="sample" class="p-2 text-center">
            {#each fonts as font (font)}
                <button on:click={() => handleFontSelect(font)} class={`bg-slate-200 hover:bg-slate-400 text-black px-2 py-1 w-full rounded-none text-[1rem] text-left font-${font}`} value={font}>
                    {#if sample !== ''}
                        {sample}
                    {:else}
                        {font}
                    {/if}
                </button>
            {/each}
    </div>


    <!-- this should handle a font selection and save it to users db -->
    <!-- font should be instantly active everywhere! -->