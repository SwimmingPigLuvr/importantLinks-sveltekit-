

<script lang="ts">
  import { db, user } from "$lib/firebase";
  import { doc, writeBatch } from "firebase/firestore";
  import { backIn, backOut, cubicInOut } from "svelte/easing";
  import { slide } from "svelte/transition";

    let chosenFont = '';

    let fonts = [
        'gin',
        'elven',
        'input-mono',
        'totally-gothic',
        'typewriter',
        'elizeth-condensed',
        'herb',
        'lapture-display',
        'josefine',
        'ellograph',
        'titilium',
        'new-spirit',
        'noka',
    ]
    let sample = '';

    async function saveFont() {
        console.log('saving font: ', chosenFont);

        const batch = writeBatch(db);

        // update font in db
        batch.set(doc(db, "users", $user!.uid), {
            theme: {
                font: chosenFont
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
        class="w-full flex flex-col justify-center items-center md:max-w-xl bg-primary p-10 rounded-full">
        <input bind:value={sample} placeholder="type here 4 preview" type="text" name="sample" id="sample" class="p-2 text-center">
            {#each fonts as font (font)}
                <button on:click={() => handleFontSelect(font)} class="bg-black p-2 w-full rounded-none hover:text-primary text-[1.5rem]  font-{font}" value={font}>
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