<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { arrayRemove, doc, updateDoc } from "firebase/firestore";

    import { createEventDispatcher } from "svelte";
    import { flip } from "svelte/animate";
    import { backIn, backInOut, backOut, cubicInOut } from "svelte/easing";
  import { blur, fly, slide } from "svelte/transition";

    let showDelete: boolean[] = [];
    
    async function deleteLink(item: any) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
        links: arrayRemove(item),
        });
    }

    export let list: any[];
    let isOver: string | boolean = false;

    const dispatch = createEventDispatcher();

    

    function getDraggedParent(node: any) {
        if (!node.dataset.index) {
            return getDraggedParent(node.parentNode);
        } else {
            return { ...node.dataset };
        }
    }

    function onDragStart(e: DragEvent) {
        //  @ts-ignore
        const dragged = getDraggedParent(e.target);
        e.dataTransfer?.setData("source", dragged?.index.toString());
    }

    function onDragOver(e: DragEvent) {
        // @ts-ignore
        const id = e.target.dataset?.id;
        const dragged = getDraggedParent(e.target);
        isOver = dragged?.id ?? false;
    }

    function onDragLeave(e: DragEvent) {
        const dragged = getDraggedParent(e.target);
        isOver === dragged.id && (isOver = false);
    }

    function onDrop(e: DragEvent) {
        isOver = false;
        const dragged = getDraggedParent(e.target);
        reorder({
            from: e.dataTransfer?.getData("source"),
            to: dragged.index,
        });
    }

    const reorder = ({ from, to }: any) => {
        const newList = [...list];
        newList[from] = [newList[to], (newList[to] = newList[from])][0];

        dispatch("sort", newList);
    };

</script>

{#if list?.length}
    <ul class="list-none mt-4 flex flex-col items-center">
        {#each list as item, index (item.id)}
            <li
                class="relative border-2 border-dashed border-transparent py-2 transition-all max-w-2xl w-full"
                class:over={item.id === isOver}
                data-index={index}
                data-id={item.id}
                draggable="true"
                on:mouseenter={() => showDelete[index] = true}
                on:mouseleave={() => showDelete[index] = false}
                on:dragstart={onDragStart}
                on:dragover|preventDefault={onDragOver}
                on:dragleave={onDragLeave}
                on:drop|preventDefault={onDrop}
                animate:flip={{ duration: 500, easing: cubicInOut }}
            >
      {#if showDelete[index]}
      <!-- delete button -->
        <button
            in:blur={{ duration: 1000, easing: backOut, amount: 100 }}
            out:fly={{ x: 10, duration: 500, easing: backIn }}
          on:click|preventDefault={e => deleteLink(item)}
          class="z-50 absolute right-0 top-0">
            <img src="/icons/trashCat.jpeg" alt="trash" class="h-10 w-10 rounded-full filter saturate-200 contrast-100 -hue-rotate-90 hover:scale-110">
            delete
        </button>
      {/if}
                <slot {item} {index} />
            </li>
        {/each}
    </ul>
{:else}
    <p class="text-center my-12 text-lg font-bold">no links</p>
{/if}

<style>
    .over {
        @apply border-accent scale-x-125 transition-all duration-100 transform ease-[backOut];
    }
</style>