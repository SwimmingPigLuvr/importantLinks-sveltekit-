<script lang='ts'>
  import { db, user, storage, userData } from "$lib/firebase";
  import { doc, writeBatch } from "firebase/firestore";
  import { backOut, cubicInOut } from "svelte/easing";
  import { slide, blur, fly, fade } from "svelte/transition";


    export let mode: string;
    // since the gradient cases have ttwo inputs the mode needs to be less specific when passed in
    // i think that mode: 'background', link fill, link border, link shadow ...etc
    // + isGradient, is sufficient to let us know how to handle it
    // because then each input is already divided into: from & to.
    // so i shouldn't need to refactor much.
    // just make sure that i pass the isGradient on all of the gradient sections
    // 
    export let isGradient: boolean = false;

    export let currentHex = {
        hex: '#FFFFFF',
        opacity: 100,
    };

    export let currentGradient = {
        from: { hex: '#FFFFFF', opacity: 100 },
        to: { hex: '#000000', opacity: 100 },
        direction: '0deg',
        style: 'linear',
    };

    let hex: string;
    let opacity: number;

    if (currentHex) {
        hex = currentHex.hex;
        opacity = currentHex.opacity;
    }

    let from: {hex: string, opacity: number};
    let to: {hex: string, opacity: number};

    let direction: string;
    let style: string;

    if (currentGradient) {
        from = currentGradient.from;
        to = currentGradient.to;
        direction = currentGradient.direction;
        style = currentGradient.style;
    }


    let saving: boolean = false;
    let saveSuccess: boolean = false;

    let showRemoveHex: boolean = false;
    let showRemoveFromHex: boolean = false;
    let showRemoveToHex: boolean = false;

    async function updateColor(mode: string, hex: string) {
        console.log('updating color');
        console.log('mode: ', mode, '; hex: ', hex);
        const batch = writeBatch(db);
        saving = true;

        switch (mode) {

        case 'background':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {hex: hex}}},
            { merge: true });
            break;
        
        case 'link fill':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {hex: hex}}}},
            {merge: true});
            break;

        case 'link border':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {hex: hex}}}},
            {merge: true});
            break;

        case 'link shadow':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {hex: hex}}}},
            {merge: true});
            break;
        
        case 'link title':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {title: {font: {hex: hex}}}}},
            {merge: true});
            break;
        
        case 'font':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {font: {hex: hex}}},
            {merge: true});
            break;

        case 'background from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {gradient: {from: {hex: hex}}}}},
            {merge: true});
            break;

        case 'background to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {gradient: {to: {hex: hex}}}}},
            {merge: true});
            break;
            
        case 'link fill from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {gradient: {from: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'link fill to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {gradient: {to: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'link border from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {gradient: {from: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'link border to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {gradient: {to: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'link shadodw from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {gradient: {from: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'link shadow to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {gradient: {to: {hex: hex}}}}}},
            {merge: true});
            break;

        default:
            return;
        }

        await batch.commit();
        saveSuccess = true;
        saving = false;
    }

    async function updateOpacity(mode: string, opacity: number) {
        const batch = writeBatch(db);
        saving = true;

        switch (mode) {

        case 'background': 
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {opacity: opacity}}},
            {merge: true});
            break;

        case 'font': 
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {font: {opacity: opacity}}},
            {merge: true});
            break;

        case 'link title':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {title: {opacity: opacity}}}},
            {merge: true});
            break;

        case 'link fill':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {opacity: opacity}}}},
            {merge: true});
            break;
            
        case 'link border':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {opacity: opacity}}}},
            {merge: true});
            break;
        
        case 'link shadow':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {opacity: opacity}}}},
            {merge: true});
            break;

        case 'background gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {gradient: {from: {opacity: opacity}}}}},
            {merge: true});
            break;

        case 'background gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {gradient: {to: {opacity: opacity}}}}},
            {merge: true});
            break;

        case 'link gradient from':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {link: {fill: {gradient: {from: {opacity: opacity}}}}}   
            }, { merge: true });
            break;

        case 'link gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {gradient: {to: {opacity: opacity}}}}}},
            {merge: true});
            break;

        case 'border gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {gradient: {from: {opacity: opacity}}}}}},
            {merge: true});
            break;

        case 'border gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {gradient: {to: {opacity: opacity}}}}}},
            {merge: true});
            break;

        case 'shadow gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {gradient: {from: {opacity: opacity}}}}}},
            {merge: true});
            break;

        case 'shadow gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {gradient: {to: {opacity: opacity}}}}}},
            {merge: true});
            break;

        default:
            return;
        }
        await batch.commit();
        saveSuccess = true;
        saving = false;
    }

    async function setStyle(mode: string, style: string) {
        const batch = writeBatch(db);
        saving = true;

        switch (mode) {
        case 'background':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                background: {
                style: style
                }
            }
            }, { merge: true });
        break;
        case 'border':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                link: {
                border: {
                    style: style
                }
                }
            }
            }, { merge: true });
        break;
        case 'fill':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                link: {
                fill: {
                    style: style
                }
                }
            }
            }, { merge: true });
        break;
        case 'shadow':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                link: {
                shadow: {
                    style: style
                }
                }
            }
            }, { merge: true });
        break;

        default: 
        return;
        }

        await batch.commit();
        saveSuccess = true;
        saving = false;
    }

    async function setGradientDirection(mode: string, degree: number) {
        const batch = writeBatch(db);
        saving = true;
        const degreeValue = `${degree}deg`;

        switch (mode) {
        case 'background':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                background: {
                gradient: {
                    direction: degreeValue
                }
                }
            }
            }, { merge: true });
            break;
        case 'link border':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                link: {
                border: {
                    gradient: {
                    direction: degreeValue
                    }
                }
                }
            }
            }, { merge: true });
            break;
        case 'link fill':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                link: {
                fill: {
                    gradient: {
                    direction: degreeValue
                    }
                }
                }
            }
            }, { merge: true });
            break;
        case 'link shadow':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {
                link: {
                shadow: {
                    gradient: {
                    direction: degreeValue
                    }
                }
                }
            }
            }, { merge: true });
            break;

        default:
            break;
        }
        await batch.commit();
        saveSuccess = true;
        saving = false;
        direction = degreeValue;
    }

</script>
    {#if !isGradient}

    <container 
        in:slide={{ duration: 1000, easing: cubicInOut }}
        out:slide={{ duration: 1000, easing: cubicInOut }}
        class="flex justify-start space-x-10 mt-8">
      <div>
        <label for="{mode} color" class="label">
          <span class="label-text font-input-mono">{mode} color</span>
        </label>      
        <!-- inputs -->
        <div id="{mode} color" class="flex flex-col">
            <div 
                style={`border: 2px solid ${hex}`}
                class="flex relative">
                
                <!-- color input -->
              <input 
                type="color" 
                id="colorInput"
                style="width: 3.1rem; height: 3rem; " 
                bind:value={hex} 
                on:change={() => updateColor(mode, hex)}
                class="relative"
              >
              <!-- text hex input -->
              <input 
                type="text" 
                placeholder="#12345" 
                bind:value={hex} 
                on:change={() => updateColor(mode, hex)} 
                class="input text-center w-[13rem] rounded-none font-input-mono tracking-widest">
            
              <!-- revert back to theme color -->
              {#if hex !== ''}
                <button
                  in:fly={{y: 10, duration: 200, easing: backOut}} 
                  out:blur={{amount: 10, duration: 1000}}
                  on:mouseenter={() => showRemoveHex = true}
                  on:mouseleave={() => showRemoveHex = false}
                  on:click={() => {updateColor(mode, '')}} 
                  class="absolute -top-1 -right-1 btn btn-xs font-input-mono">
                    ❌
                </button>
                <!-- remove hex message -->
                {#if showRemoveHex}
                  <p 
                    in:slide={{duration: 500, easing: backOut}}
                    out:blur={{amount: 10, duration: 1000}}
                    class="absolute -top-10 -right-1/3 p-2 px-4 text-xs bg-primary font-input-mono text-primary-content">remove custom color?</p>
                {/if}
              {/if}

            </div>
              
              

            

            
        </div>
      </div>
    </container>

    {:else}

    <container 
        in:slide={{ duration: 1000, easing: cubicInOut }}
        out:slide={{ duration: 1000, easing: cubicInOut }}
        class="flex-col flex space-y-4 my-4">
      <div class="flex space-x-4">
        <button class:bg-success={style === 'gradient'} on:click={() => setStyle(mode, 'gradient')} class="btn btn-outline">Linear</button>
        <button class:bg-success={style === 'radial gradient'} on:click={() => setStyle(mode, 'radial gradient')} class="btn btn-outline">Radial</button>
      </div>

      <!-- colors -->
      <div class="flex flex-col">
          
        <!-- from color -->
        <div class="flex">
            <div class="">

                <div class="flex">
                    
                    <!-- From Color Input Section -->
                    <div class="flex flex-col flex-1">
                        <label for="From" class="label">
                            <span class="label-text font-input-mono text-[1rem]">From</span>
                        </label>
                        <div id="From" class="flex flex-col">
                            <div
                                style={`border: 2px solid ${from.hex}`}
                                class="flex relative">

                                <!-- from input -->
                                <input 
                                    type="color" 
                                    id="colorInput"
                                    style={`width: 3.1rem; height: 3rem; background-color: ${from.hex ?? `hsl(var(--a))`};`}
                                    bind:value={from.hex} 
                                    on:change={() => updateColor(`${mode} from`, from.hex)}
                                    class="relative">
                                <input 
                                    type="text" 
                                    placeholder="#12345" 
                                    bind:value={from.hex} 
                                    on:change={() => updateColor(`${mode} from`, from.hex)} 
                                    class="input text-center w-[13rem] rounded-none font-input-mono tracking-widest">

                                <!-- remove color to revert back to theme color -->
                                {#if from.hex !== ''}
                                    <button
                                        in:fly={{y: 10, duration: 200, easing: backOut}} 
                                        out:blur={{amount: 100}}
                                        on:mouseenter={() => showRemoveFromHex = true}
                                        on:mouseleave={() => showRemoveFromHex = false}
                                        on:click={() => {updateColor(`${mode} from`, '')}} 
                                        class="absolute -top-2 -right-2 btn btn-xs font-input-mono">
                                            ❌
                                    </button>
                                    {#if showRemoveFromHex}
                                        <p 
                                            in:fade
                                            out:fade
                                            class="absolute -top-10 -right-4 p-2 px-4 text-xs bg-primary font-input-mono text-primary-content">remove first color?</p>
                                    {/if}
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Opacity Input Section -->
                    <div class=" mx-4 form-control flex-1">
                        <label for="opacity" class="label">
                            <span class="label-text font-input-mono">Opacity</span>
                        </label>
                        <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity might cause background to reflect diffently in preview than it will on your site"`}>
                            <label class="input-group">
                                <input type="number" min="0" max="100" id="opacity" bind:value={from.opacity} on:change={() => updateOpacity(`${mode} from`, from.opacity)} class="input input-bordered" />
                                <span>%</span>
                            </label>
                        </div>
                    </div>

                </div> <!-- End of the flex container -->
            </div>
        </div>

        <!-- to color -->
        <div class="flex">
            <div class="">

                <!-- Wrapping both "To color" and "Opacity" sections with a flex container -->
                <div class="flex">

                    <!-- To Color Input Section -->
                    <div class="flex flex-col flex-1">
                        <label for="to Color" class="label">
                            <span class="label-text font-input-mono text-[1rem]">To</span>
                        </label>      
                        <div id="to Color" class="flex flex-col">
                            <div 
                                style={`border: 2px solid ${to.hex}`}
                                class="flex relative">
                                <!-- show buttoncolor / click for color picker -->
                                <input 
                                    type="color" 
                                    id="colorInput"
                                    style="width: 3.1rem; height: 3rem; border: 1px ridge {to.hex ?? `hsl(var(--p))`};"
                                    bind:value={to.hex} 
                                    on:change={() => updateColor(`${mode} to`, to.hex)} 
                                    class="">
                                <input 
                                    type="text" 
                                    placeholder="#12345" 
                                    bind:value={to.hex} 
                                    on:change={() => updateColor(`${mode} to`, to.hex)} 
                                    class="input text-center w-[13rem] rounded-none font-input-mono tracking-widest">
                                {#if to.hex !== ''}
                                    <button
                                        in:fly={{y: 10, duration: 200, easing: backOut}} 
                                        out:blur={{amount: 100}}
                                        on:mouseenter={() => showRemoveToHex = true}
                                        on:mouseleave={() => showRemoveToHex = false}
                                        on:click={() => {updateColor(`${mode} to`, '')}} 
                                        class="absolute -top-2 -right-2 btn btn-xs font-input-mono">
                                            ❌
                                    </button>
                                    {#if showRemoveToHex}
                                        <p 
                                            in:fade
                                            out:fade
                                            class="absolute -top-10 -right-4 p-2 px-4 text-xs bg-primary font-input-mono text-primary-content">remove second color?</p>
                                    {/if}
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Opacity Input Section -->
                    <div class="form-control flex-1 mx-4">
                        <label for="opacity" class="label">
                            <span class="label-text font-input-mono">Opacity</span>
                        </label>
                        <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity will cause background to reflect diffently in preview than it will on your site"`}>
                            <label class="input-group">
                                <input type="number" min="0" max="100" id="opacity" bind:value={to.opacity} on:change={() => updateOpacity(`${mode} to`, to.opacity)} class="input input-bordered" />
                                <span>%</span>
                            </label>
                        </div>
                    </div>

                </div> <!-- End of the flex container -->
            </div>
        </div>

      </div>

      <!-- gradient direction -->
      <div class="flex flex-col justify-start">

        <!-- preview + selection container -->
        <div class="flex justify-start space-x-4">

          <!-- gradient preview -->
          <div 
            style={`background: linear-gradient(${direction}, ${from.hex}, ${to.hex});`}
            class="w-full border-2 mt-10 border-primary rounded-xl h-40 ">
          </div>
          {#if style === 'gradient'}
          <!-- gradient direction -->
          <div 
            in:fade={{duration: 300}}
            out:fade={{duration: 300}}
            class="flex flex-col mt-4">
            <label for="Gradient Direction" class="label">
              <span class="label-text font-input-mono">Direction <span class="text-info">{direction}°</span></span>
            </label>
            <div class="flex">

            <div id="Gradient Direction" class="flex flex-col text-white  join">
              <div class="join text-white flex justify-evenly">
                <button class:bg-info={direction === '315deg'} on:click={() => setGradientDirection(mode, 315)} class="btn-outline btn text-5xl">↖</button>
                <button class:bg-info={direction === '0deg'} on:click={() => setGradientDirection(mode, 0)} class="btn btn-outline text-5xl">↑</button>
                <button class:bg-info={direction === '45deg'} on:click={() => setGradientDirection(mode, 45)} class="btn btn-outline text-5xl">↗</button>
              </div>
              <div class="join flex justify-evenly">
                <button class:bg-info={direction === '270deg'} on:click={() => setGradientDirection(mode, 270)} class="btn btn-outline text-5xl">←</button>
                <button class="bg-opacity-0 text-5xl font-input-mono">☯︎</button>
                <button class:bg-info={direction === '90deg'} on:click={() => setGradientDirection(mode, 90)} class="btn btn-outline text-5xl">→</button>
              </div>
              <div class="join flex justify-evenly">
                <button class:bg-info={direction === '215deg'} on:click={() => setGradientDirection(mode, 215)} class="btn btn-outline text-5xl">↙</button>
                <button class:bg-info={direction === '180deg'} on:click={() => setGradientDirection(mode, 180)} class="btn btn-outline text-5xl">↓</button>
                <button class:bg-info={direction === '135deg'} on:click={() => setGradientDirection(mode, 135)} class="btn btn-outline text-5xl">↘</button>
              </div>
            </div>
            </div>
          </div>
          {/if}


        </div>


        <!-- input gradient values -->
        
        <div class="text-[1rem] font-input-mono mt-4 border-accent bg-primary bg-opacity-50 text-primary-content border-2 p-4 px-6 flex flex-col space-y-2">
          {#if style === 'gradient'}
            <p>Linear Gradient</p>
          {/if}
          {#if style === 'radial gradient'}
            <p>Radial Gradient</p>
          {/if}
            <div class="flex space-x-2">

          <p>from:<input type="text" class="text-info inline-input w-[5.75rem]" bind:value={from.hex} />,</p>
          <p>to:<input type="text" class="text-info inline-input w-[5.75rem]" bind:value={to.hex} />,</p>
            </div>
          {#if style === 'gradient'}
            <input type="text" class="text-info inline-input w-[7rem]" bind:value={direction} />
          {/if}
        </div>
      </div>

    </container>
    {/if}