<script lang="ts">
    import { db, user, storage, userData } from "$lib/firebase";
    import { doc, writeBatch } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
    import { backInOut, cubicInOut } from "svelte/easing";
    import { slide, blur, fly } from "svelte/transition";

    export let mode: string;
    export let currentImage: {
        position: string,
        repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" | "round",
        size: "auto" | "contain" | "cover" | "100% 100%",
        url: string,
    };
    let image: string;

    let headerDefault: string = '/headerDefault.png';
    let backgroundDefault: string = '/backgroundDefault.png';
    let linkDefault: string = '/linkDefault.png';
    let borderDefault: string = '/borderDefault.png';

    let deleteBanner: boolean;

    let saving: boolean = false;
    let saveSuccess: boolean = false;
    let uploading: boolean = false;
    let uploadSuccess: boolean = false;
    let previewURL: string;
    let files: FileList;

    let showPosition: boolean;
    let showSize: boolean;
    let showRepeat: boolean;
    let customSize: string;

    let isPosition: string;
    let isSize: string;
    let isRepeat: string;
    let isUrl: string;

    if (currentImage) {
        isPosition = currentImage.position;
        isSize = currentImage.size;
        isRepeat = currentImage.repeat;
        isUrl = currentImage.url;
    }

    async function setPosition(mode: string, position: string) {
        const batch = writeBatch(db);
        saving = true;

        if (mode === 'background') {
            batch.set(doc(db, `users/${$user!.uid}`), {
                customTheme: {
                    background: {
                        image: {
                            position: position
                        }
                    }
                }
            }, { merge: true });
        } else if (mode === 'link') {
            batch.set(doc(db, `users/${$user!.uid}`), {
                customTheme: {
                    link: {
                        fill: {
                            image: {
                                position: position
                            }  
                        }
                        
                    }
                }
            }, { merge: true });
        }
        await batch.commit();
        saveSuccess = true;
        isPosition = position;
        saving = false;
    }

    async function setSize(mode: string, size: string) {
        const batch = writeBatch(db);
        saving = true;

        if (mode === 'background') {
            batch.set(doc(db, `users/${$user!.uid}`), {
                customTheme: {
                    background: {
                        image: {
                            size: size
                        }
                    }
                }
            }, { merge: true });
        } else if (mode === 'link') {
            batch.set(doc(db, `users/${$user!.uid}`), {
                customTheme: {
                    link: {
                        fill: {
                            image: {
                                size: size
                            }  
                        }
                        
                    }
                }
            }, { merge: true });
        } 
        await batch.commit();
        saveSuccess = true;
        isSize = size;
        saving = false;
    }

    async function setRepeat(mode: string, repeat: string) {
        const batch = writeBatch(db);
        saving = true;

        if (mode === 'background') {
            batch.set(doc(db, `users/${$user!.uid}`), {
                customTheme: {
                    background: {
                        image: {
                            repeat: repeat
                        }
                    }
                }
            }, { merge: true });
        } else if (mode === 'link') {
            batch.set(doc(db, `users/${$user!.uid}`), {
                customTheme: {
                    link: {
                        fill: {
                            image: {
                                repeat: repeat
                            }  
                        }
                        
                    }
                }
            }, { merge: true });
        } else if (mode === 'border') {
            batch.set(doc(db, `users${$user!.uid}`), {
                customTheme: {
                    link: {
                        border: {
                            image: {
                                repeat: repeat
                            }
                        }
                    }
                }
            }, { merge: true});
        }
        await batch.commit();
        saveSuccess = true;
        isRepeat = repeat;
        saving = false;
    }

    async function uploadImage(mode: string, e: any) {
        uploadSuccess = false;
        uploading = true;

        console.log('uploading image');

        // get user uploaded file into a URL
        const file = e.target.files[0];
        previewURL = URL.createObjectURL(file);
        const storageRef = ref(storage, `users/${$user!.uid}/background.png`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);

        const batch = writeBatch(db);

        try {
            if (mode === 'background') {
                batch.set(doc(db, `users/${$user!.uid}`), {
                    customTheme: {
                        background: {
                            style: 'background-image',
                            image: {
                                url: url
                            },
                        }
                    }
                }, { merge: true });

            } else if (mode === 'link') {
                batch.set(doc(db, `users/${$user!.uid}`), {
                    customTheme: {
                        link: {
                            fill: {
                                style: 'image',
                                image: {
                                    url: url
                                },
                            }
                        }
                    }
                }, { merge: true });
            } else if (mode === 'header') {
                batch.set(doc(db, `users/${$user!.uid}`), {
                    header: url
                }, { merge: true }); 
            }

            await batch.commit();
            uploadSuccess = true;
            isUrl = previewURL;

        } catch (error) {
            console.error('background upload error: something went wrong: ', error);
        } finally {
            uploading = false;
        }
    }

    async function deleteImage(mode: string) {
        const batch = writeBatch(db);

        batch.set(doc(db, `users/${$user!.uid}`), {
            header: ''
        }, { merge: true });
        await batch.commit();
    }

    function getImageUrl(mode: string) {
        if (mode === 'header') return $userData?.header || headerDefault;
        if (mode === 'background') return $userData?.customTheme?.background?.image?.url || backgroundDefault;
        if (mode === 'link') return $userData?.customTheme?.link?.fill?.image?.url || linkDefault;
        if (mode === 'border') return $userData?.customTheme?.link?.border?.image?.url || borderDefault;
        return ''; // default fallback
    }


    
</script>

<div 
  in:slide={{ duration: 1000, easing: cubicInOut }}
  out:slide={{ duration: 1000, easing: cubicInOut }}
  class:justify-center={mode === 'header'}
  class="flex space-x-4 my-12 justify-start">

  <div class="form-control lg:w-[256px] max-w-xs text-center">
    <!-- image preview -->
      <div class="relative">

      <img 
          src="{getImageUrl(mode)}" 
          alt="preview"
          width="432"
          height="432"
          class={`${uploading? 'filter grayscale' : 'grayscale-0'}`}
      />
      {#if mode === 'header' && $userData?.header !== ''}
        <button 
        on:mouseenter={() => deleteBanner = true}
        on:mouseleave={() => deleteBanner = false}
        class="-top-6 -right-6 z-50 btn btn-circle btn-outline hover:bg-info text-sm absolute">
        ❌
        {#if deleteBanner}
            <button on:click={() => deleteImage('header')} in:fly={{y: 100, duration: 1000, easing: backInOut}} class="bg-success p-2 absolute -top-5">Delete Banner?</button>

        {/if}
        </button>
        {/if}
      </div>
      <label for="photoURL" class="label">
          <span class="label-text"></span>
      </label>
      <input
          on:change={$event => uploadImage(mode, $event)}
          name="photoURL"
          type="file"
          class="file-input file-input-xs file-input-bordered w-[231px] max-w-xs"
          accept="image/png, image/jpeg, image/gif, image/webp"
      />
      {#if uploading}
        <p class="text-info-content mt-6">uploading...</p>
        <progress class="progress progress-secondary w-56 mt-2 m-auto" />
      {/if}
      {#if uploadSuccess}
        <button in:blur out:blur on:click={() => uploadSuccess = false} class="bg-success-content rounded-md p-2 mt-6 w-3/4 m-auto relative">
            <p class="hover:bg-primary -top-1 -right-1 absolute p-2 rounded-full border-2 border-success bg-success-content text-xs text-success">X</p>
            <p class="text-success">uploaded successfully</p>
        </button>
      {/if}
      
  </div>
    

  <!-- use these styles for everything except for the header -->
  {#if mode !== 'header'}
    <!-- image style options -->
    <div 
      in:slide={{duration: 2000, easing: cubicInOut}}
      class="flex flex-col text-accent font-input-mono text-[1rem] space-y-4 justify-start">

      <!-- background-position -->
      <div class="flex flex-col space-y-2 justify-start rounded-none ">
        <button class="font-input-mono text-white text-[1.5rem] text-left border-b-8 border-accent w-28 hover:w-36 transform transition-all duration-500 ease-[backOut]" on:click={() => {showPosition = !showPosition; showSize = false; showRepeat = false}}>Position</button>
        {#if showPosition}
          <div in:slide out:slide class=" flex-col space-y-2 justify-start ">
            <div class="flex space-x-2 ">
              <button class:bg-info={isPosition === 'left top'} on:click={() => setPosition(mode, 'left top')} class="btn btn-outline text-[2rem]">↖</button>
              <button class:bg-info={isPosition === 'center top'} on:click={() => setPosition(mode, 'center top')} class="btn btn-outline text-[2rem]">↑</button>
              <button class:bg-info={isPosition === 'right top'} on:click={() => setPosition(mode, 'right top')} class="btn btn-outline text-[2rem]">↗</button>
            </div>
            <div class="flex space-x-2">
              <button class:bg-info={isPosition === 'left'} on:click={() => setPosition(mode, 'left')} class="btn btn-outline text-[2rem]">←</button>
              <button class:bg-info={isPosition === 'center'} on:click={() => setPosition(mode, 'center')} class="btn btn-outline text-[2rem]">☯︎</button>
              <button class:bg-info={isPosition === 'right'} on:click={() => setPosition(mode, 'right')} class="btn btn-outline text-[2rem]">→</button>
            </div>
            <div class="flex space-x-2">
              <button class:bg-info={isPosition === 'left bottom'} on:click={() => setPosition(mode, 'left bottom')} class="btn btn-outline text-[2rem]">↙</button>
              <button class:bg-info={isPosition === 'center bottom'} on:click={() => setPosition(mode, 'center bottom')} class="btn btn-outline text-[2rem]">↓</button>
              <button class:bg-info={isPosition === 'right bottom'} on:click={() => setPosition(mode, 'right bottom')} class="btn btn-outline text-[2rem]">↘</button>
            </div>
          </div>
        {/if}
      </div>  

      <!-- background-size -->
      <div class="flex flex-col space-y-2 justify-start rounded-none ">
        <button class=" text-white text-[1.5rem] text-left border-b-8 border-accent w-12 hover:w-20 transform transition-all duration-500 ease-[backOut]" on:click={() => {showSize = !showSize; showPosition = false; showRepeat = false}}>Size</button>
        {#if showSize}
          <div in:slide out:slide class="flex flex-wrap gap-2">
            <button class:bg-info={isSize === "auto"} on:click={() => setSize(mode, 'auto')} class="btn btn-sm btn-outline">auto</button>
            <button class:bg-info={isSize === "cover"} on:click={() => setSize(mode, 'cover')} class="btn btn-sm btn-outline">cover</button>
            <button class:bg-info={isSize === "contain"} on:click={() => setSize(mode, 'contain')} class="btn btn-sm btn-outline">contain</button>
            <button class:bg-info={isSize === "100% 100%"} on:click={() => setSize(mode, '100% 100%')} class="btn btn-sm btn-outline">100% 100%</button>
            <input 
              type="text" 
              bind:value={customSize} 
              placeholder="custom" 
              on:change={() => setSize(mode, customSize)} 
              on:keypress={(e) => {if (e.key === 'Enter') setSize(mode, customSize);}}
              class:bg-info={isSize === customSize}
              class="input input-sm w-1/2"/>
          </div> 
        {/if}
      </div>

      <!-- background-repeat -->
      <div class="flex flex-col space-y-2 justify-start rounded-none ">
        <button class="font-input-mono text-white text-[1.5rem] text-left w-20 hover:w-32 border-b-8 border-accent hover:border-separate transform transition-all duration-500 ease-[backOut]" on:click={() => {showRepeat = !showRepeat; showSize = false; showPosition = false}}>Repeat</button>
        {#if showRepeat}
          <div in:slide out:slide class="flex flex-wrap gap-2">
            <button class:bg-info={isRepeat === 'repeat'} on:click={() => setRepeat(mode, 'repeat')} class="btn btn-xs btn-outline">repeat</button>
            <button class:bg-info={isRepeat === 'no-repeat'} on:click={() => setRepeat(mode, 'no-repeat')} class="btn btn-xs btn-outline">no-repeat</button>
            <button class:bg-info={isRepeat === 'space'} on:click={() => setRepeat(mode, 'space')} class="btn btn-xs btn-outline">space</button>
            <button class:bg-info={isRepeat === 'round'} on:click={() => setRepeat(mode, 'round')} class="btn btn-xs btn-outline">round</button>
            <button class:bg-info={isRepeat === 'repeat-x'} on:click={() => setRepeat(mode, 'repeat-x')} class="btn btn-xs btn-outline">repeat-x</button>
            <button class:bg-info={isRepeat === 'repeat-y'} on:click={() => setRepeat(mode, 'repeat-y')} class="btn btn-xs btn-outline">repeat-y</button>
          </div> 
        {/if}
      </div> 
    </div>
  {/if}

</div>