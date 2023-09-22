<script lang="ts">
  import ColorPicker from "$lib/components/ColorPicker.svelte";
  import Fonts from "$lib/components/Fonts.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData, storage, userTheme } from "$lib/firebase";
  import { setTheme, type CustomTheme, defaultTheme, emptyTheme, type GradientValue, convert } from "$lib/theme";
  import { doc, getDoc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { flip } from "svelte/animate";
  import { backIn, backOut, cubicIn, cubicInOut, cubicOut } from "svelte/easing";
  import { fade, slide, blur, fly } from "svelte/transition";
  import { updateTheme } from "$lib/themeStore";
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import colors from "tailwindcss/colors";
  import { onMount } from "svelte";

  let background: {
    style: string,
    value: string,
    opacity: number,
    hex: string | undefined,
  }

  let font: {
    family: string,
    value: string,
    opacity: number,
    hex: string | undefined,
  }

  let link: {
    radius: string;
    fill: {
      isVisible: boolean;
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    border: {
      isVisible: boolean;
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    shadow: {
      isVisible: boolean;
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    title: {
      value: string;
      opacity: number;
      hex: string | undefined;
      size: number;
      tracking: string;
      effect: string;
      onHover: boolean;
    }
  }


  let fill: boolean;
  let border: boolean;
  let shadow: boolean;

  async function updateVisibility(mode: string, isVisible: boolean) {
    const batch = writeBatch(db);

    if (mode === 'fill') {
      console.log('updating visibility for fill -> ', mode);
      batch.set(doc(db, `users/${$user!.uid}`), {
        customTheme: {
          link: {
            fill: {
              isVisible: isVisible
            }
          }
        }
      }, { merge: true });

    } else if (mode === 'border') {
      console.log('updating visibility for border -> ', mode);
      batch.set(doc(db, `users/${$user!.uid}`), {
        customTheme: {
          link: {
            border: {
              isVisible: isVisible
            }
          }
        }
      }, { merge: true });
      
    } else if (mode === 'shadow') {
      console.log('updating visibility for shadow -> ', mode);
      batch.set(doc(db, `users/${$user!.uid}`), {
        customTheme: {
          link: {
            shadow: {
              isVisible: isVisible
            }
          }
        }
      }, { merge: true });
    }
    await batch.commit();

  }

  async function updateOnHover() {
    const batch = writeBatch(db);

    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        link: {
          title: {
            onHover: onHover
          }
        }
      }
    }, { merge: true });

    await batch.commit();
  }

  let from: GradientValue = {
    value: 'lime',
    shade: '400',
    opacity: 100 
  };

  let to: GradientValue = {
    value: 'cyan',
    shade: '200',
    opacity: 100
  };

  let direction: string = '45deg';

  // tailwind class based on user color choices
  let fromColor: string;
  let toColor: string;

  // hex codes
  let fromHex: string | undefined;
  let toHex: string | undefined;

  let showBackUp: boolean = false;

  let showRemoveBackground: boolean = false;
  let showRemoveFill: boolean = false;
  let showRemoveBorder: boolean = false;
  let showRemoveShadow: boolean = false;
  let showRemoveTitle: boolean = false;
  let showRemoveFont: boolean = false;

  export let data: PageData;

  // declare user data vars
  let username: string | undefined;
  let bio: string | undefined;
  let photoURL: string | undefined;
  let links: LinkData[];
  let customTheme: CustomTheme;
  let theme: string | undefined;
  


  // new color flow
  let shade: string = 'lime';
  let value: number;
  let opacity: number = 100;


  // background
  let bgValue: string = 'sky';
  let bgShade: string = '600';
  let bgOpacity: number = 100;

  // button color
  let bcValue: string = 'lime';
  let bcShade: string = '400';
  let bcOpacity: number = 100;

  // button font
  let bfValue: string = 'slate';
  let bfShade: string = '50';
  let bfOpacity: number = 100;

  // button border
  let buttonBorder: string;
  let bbValue: string = 'lime';
  let bbShade: string = '50';
  let bbOpacity: number = 100;

  // button shadow
  let buttonShadow: string;
  let bsValue: string = 'slate';
  let bsShade: string = '950';
  let bsOpacity: number = 100;

  // font
  let fcValue: string = 'zinc';
  let fcShade: string = '50';
  let fcOpacity: number = 100;

  let temp: string;

  let tempBackgroundColor: string;

  let tempButtonColor: string;
  let tempButtonFontColor: string;
  let tempButtonBorderColor: string = 'zinc-950';
  let tempButtonShadowColor: string = 'zinc-950';

  let tempFontColor: string;

  let userThemes: CustomTheme[] = [];
  
  // hex vars
  let fontColorHex: string | undefined;
  let backgroundHex: string | undefined;
  let buttonColorHex: string | undefined;
  let buttonFontColorHex: string | undefined;
  let buttonBorderHex: string | undefined;
  let buttonShadowHex: string | undefined;

  // complicated vars lol
  // bg color hex w opacity
  let bgchwo: string;

  // button color hex w opacity
  let bchwo: string;

  // button font color hex w opacity
  let bfchwo: string;

  // button border
  let buttonBorderHexWithOpacity: string;

  // button shadow color with opacity
  let buttonShadowHexWithOpacity: string;

  // font color hex w opacity
  let fchwo: string;

  let onHover: boolean;

  $: if ($userData) {
    username = $userData.username;
    bio = $userData.bio;
    photoURL = $userData.photoURL;
    links = $userData.links;
    customTheme = $userData.customTheme;
    theme = $userData.theme;    
    userThemes = $userData.userThemes;

    font = customTheme.font;
    background = customTheme.background;
    link = customTheme.link;
    onHover = link?.title?.onHover;
  }

  $: if ($userData && $userData.userThemes && $userData.userThemes.length > 1) {
    const uniqueThemeName = Object.keys(userThemes[1])[0];
    console.log('userthemes: ', userThemes);
  }

  $: if (data && data.customTheme) {
    updateTheme(customTheme);
  }


  let mode = '';

  // save theme
  let chosenTheme = '';

  async function saveTheme() {
    console.log('saving theme: ', chosenTheme);
    const userRef = doc(db, `users/${$user!.uid}`);

    const docSnapshot = await getDoc(userRef);
    const userData = docSnapshot.data();
    let userThemes = userData?.userThemes || [];


    const batch = writeBatch(db);
    batch.set(doc(db, "users", $user!.uid), {
      theme: chosenTheme
    }, { merge: true });

    for (const theme of userThemes) {
      if (chosenTheme === theme.name) {
        batch.set(doc(db, "users", $user!.uid), {
          customTheme: theme
        }, { merge: true });
      }
    }

    for (const theme of themes) {
      if (chosenTheme === theme) {
        console.log('theme: ', theme);
        console.log('setting emptyTheme');
        batch.set(doc(db, "users", $user!.uid), {
          customTheme: emptyTheme
        }, { merge: true });
      }
    }


    await batch.commit();
    chosenTheme = '';
  }

  async function changeFontSize() {
    console.log('changing font size to: ', fontSize);

    const batch = writeBatch(db);
    batch.set(doc(db, "users", $user!.uid), {
      customTheme: {
        ...customTheme,
        font: {
          ...font,
          family: font,
          size: fontSize,
        }
      }
    }, {merge: true});

    await batch.commit();
  }

  const handleThemeSelect = (selectedTheme: string) => {
    chosenTheme = selectedTheme;
    saveTheme();
    setTheme(selectedTheme);
  }
  // save theme

  let name: string;

  async function saveCustomTheme(name: string, customTheme: CustomTheme) {
    console.log('saving customTheme: ', name + ': ', + customTheme);

    const userRef = doc(db, `users/${$user!.uid}`);

    const docSnapshot = await getDoc(userRef);
    const userData = docSnapshot.data();
    let userThemes = userData?.userThemes || [];

    userThemes.push({
        ...customTheme,
        name: name
    });

    await updateDoc(userRef, {
      userThemes: userThemes
    });
  }


  async function saveTextEffect(effect: string) {
    const batch = writeBatch(db);

    // update textEffect
    batch.set(doc(db, "users", $user!.uid), {
      customTheme: {
        link: { 
          title: {
            effect: effect
          }
        }
      }
    } , { merge: true });

    await batch.commit();
  }

  const handleTextEffectSelect = (effect) => {
    console.log('handling text effect selection');
    saveTextEffect(effect);
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

  // solid
  let showBackgroundColorSelect: boolean = false;
  // gradient
  let showBackgroundGradientSelect: boolean = false;
  
  function toggleShowColorPicker() {
    if (showGradientPicker) {
      showGradientPicker = false;
    }
    showColorPicker = !showColorPicker;
  }

  // handles 'solid' and 'gradient' background styles
  function handleStyleChange(mode: string, style: string) {
    if (mode === 'bg' && style === 'solid') {
      toggleShowBackgroundColorSelect();
    } else if (mode === 'bg' && style === 'gradient') {
      toggleShowBackgroundGradientSelect();
    }
    updateStyle(mode, style);
  }

  // color selection
  function toggleShowBackgroundColorSelect() {showBackgroundColorSelect = !showBackgroundColorSelect;}

  // gradient selection
  function toggleShowBackgroundGradientSelect() {showBackgroundGradientSelect = !showBackgroundGradientSelect;}


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

  let allThemes = userThemes.concat(themes);

  // img upload
  let files: FileList;
  let showBackgroundImageForm = false;

  function toggleBackgroundImageForm() {
    showBackgroundImageForm = !showBackgroundImageForm;
  }
  
  let previewURL: string;
  let uploading = false;
  let uploadSuccess = false;

  async function uploadBackground(e: any) {
    uploadSuccess = false;
    uploading = true;

    console.log('uploading bg image');

    const batch = writeBatch(db);

    try {
      // get user uploaded file into a URL
      const file = e.target.files[0];
      previewURL = URL.createObjectURL(file);
      const storageRef = ref(storage, `users/${$user!.uid}/background.png`);
      const result = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(result.ref);

      const updatedBackground = { ...customTheme, background: { style: 'image', value: url } };


      batch.update(doc(db, 'users', $user!.uid), { "customTheme.background.style": 'image', "customTheme.background.value": url });

      await batch.commit();

      uploadSuccess = true;
    } catch (error) {
      console.error('background upload error: something went wrong: ', error);
    } finally {
      uploading = false;
    }

  }

  async function updateStyle(mode: string, style: string) {
    console.log('updating style of ', mode, ' to: ', style);

    const batch = writeBatch(db);

    if (mode === 'bg') {
      batch.set(doc(db, `users/${$user!.uid}`), {
        customTheme: {
          background: {
            style: style
          }
        }
      }, { merge: true });
    }
    await batch.commit();
  }


  async function updateGradient(from: GradientValue, to: GradientValue, direction: string) {
    fromColor = from.value + '-' + from.shade.toString();
    fromHex = convert(fromColor, from.opacity);

    toColor = to.value + '-' + to.shade.toString();
    toHex = convert(toColor, to.opacity);

    const batch = writeBatch(db);

    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        background: {
          style: 'gradient',
          value: `${fromColor}, ${toColor}, ${direction}`,
          opacity: 100,
          hex: `${fromHex}, ${toHex}, ${direction}`,
        }
      }
    }, { merge: true });

    await batch.commit();
  }

  async function setStyle(mode: string, style: string) {
    const batch = writeBatch(db);

    switch (mode) {
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
    

    
  }

  async function setRadius(radius: string) {
    const batch = writeBatch(db);
    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        link: {
          radius: radius
        }
      }
    }, { merge: true });
    await batch.commit();
  }

  // save color selections
  // construct hex codes in the db
  async function updateColor(mode: string, hex: string) {
    // mode let's us know hwere to save it in the db
    // value + shade create the color
    console.log('updateing colors: ', mode + ': ' + value + '-' + shade);
    temp = value + '-' + shade.toString();

    const batch = writeBatch(db);

    switch (mode) {

      // background
      case 'background':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              style: 'solid',
              value: temp,
              opacity: background.opacity,
              hex: convert(temp, background.opacity)
            }
          }
        }, { merge: true });

        break;

      // link fill
      case 'link fill':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              fill: {
                style: 'solid',
                value: temp,
                opacity: link.fill.opacity,
                hex: convert(temp, link.fill.opacity)
              }
            }
          }
        }, { merge: true });

        break;

      // link border
      case 'link border':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              border: {
                // no style because the same color can be used with idfferent styles
                value: temp,
                opacity: link.border.opacity,
                hex: convert(temp, link.border.opacity)
              }
            }
          }
        }, { merge: true });

        break;

      // link Shadow
      case 'link shadow':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              shadow: {
                value: temp,
                opacity: link.shadow.opacity,
                hex: convert(temp, link.shadow.opacity)
              }
            }
          }
        }, { merge: true });

        break;
      
      // link title
      case 'link title':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              title: {
                value: temp,
                opacity: link?.title?.opacity,
                hex: convert(temp, link?.title?.opacity)
              }
            }
          }
        }, { merge: true });

        break;
      
      // font
      case 'font':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            font: {
              value: temp,
              opacity: font.opacity,
              hex: convert(temp, font.opacity)
            }
          }
        }, { merge: true });

        break;
      default:
        console.log('error: unidentified mode.');
        return;
    }

    await batch.commit();
  }

  // save opacities in the db
  async function updateOpacity(mode: string) {
    const batch = writeBatch(db);

    switch (mode) {
      case 'background': 
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              opacity: background.opacity
            }
          }
        }, { merge: true });
        break;
      case 'font': 
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            font: {
              opacity: font.opacity
            }
          }
        }, { merge: true });
        break;
      case 'link title':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              title: {
                opacity: link?.title?.opacity
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
                opacity: link.fill.opacity
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
                opacity: link.border.opacity
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
                opacity: link.shadow.opacity
              }
            }
          }
        }, { merge: true });
        break;
      default:
        return;
    }

    await batch.commit();
  }


// text effects
  let glow = 'glow';
  let glowHover = 'glowHover';
  let highlight = 'highlight';
  let highlightHover = 'highlightHover';
  let gradient = 'gradient';
  let gradientHover = 'gradientHover';

  let showOptions = false;

</script>

<!-- <svelte:window on:scroll={handleScroll} /> -->


<!-- put these props back incase hehe -->

<!--   -->

<LivePreview 
  username={username} 
  photoURL={photoURL} 
  bio={bio} links={links} 
  theme={theme} 
  customTheme={customTheme}
/>

<main data-theme="{theme}" class="flex flex-col">
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

        <!-- user made themes -->
        {#each userThemes as userTheme, index}
          <div class="">
                <button 
                  on:click|preventDefault={() => handleThemeSelect(userTheme.name)} 
                  style={`color: ${fontColorHex}; ${userTheme?.background?.style === 'image' ? `background-image: url(${userTheme?.background?.value}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;` : (userTheme?.background?.style === 'solid' ? `background-color: ${convert(userTheme?.background?.value)}` : '')}`}
                  class={`btn bg-${background} border-none min-w-[160px] min-h-[300px] max-w-[200px] {theme} flex flex-col justify-start py-4`}>
                    <div class={`font-${userTheme.font? userTheme.font?.family : ''} flex flex-col items-center font`}>
                      <!-- pfp -->
                      <img class="w-[45px] h-[45px]"  src="{$userData?.photoURL}" alt="pfp">
                      <!-- Username -->
                      <p class="text-[0.5rem]">@{$userData?.username}</p>
                      <!-- bio -->
                      <p class="text-[0.33rem]">{$userData?.bio}</p>
                    </div>
                    <!-- links -->
                    <div class={`bg-${userTheme.button? userTheme.button.color : ''} w-full h-4`}></div>
                    <div class={`bg-${userTheme.button? userTheme.button.color : ''} w-full h-4`}></div>
                    <div class={`bg-${userTheme.button? userTheme.button.color : ''} w-full h-4`}></div>
                </button>
              <h3 class="text-white font-input-mono text-center text-md mb-4 mt-2">{userTheme.name}</h3>
          </div> 
        {/each}

        <!-- prebuilt Themes -->
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
            <h3 class="text-white font-input-mono text-center text-md mb-4 mt-2 bg-opacity-0" data-theme={theme}>{theme}</h3>
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

    <!-- backgrounds container -->
    <div class="bg-secondary m-auto mx-6 mb-6 p-6 rounded-2xl">
      
      <!-- bg styles -->
      <div class="flex space-x-2">


        <!-- solid color -->
        <div>
          <button 
            on:click={() => handleStyleChange('bg', 'solid')} 
            class="btn bg-warning-content border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4"></button>
          <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Solid Color</h3>
        </div>
      <!-- gradient -->
      <div>
        <button 
          on:click={() => handleStyleChange('bg', 'gradient')}
          class="group btn bg-gradient-to-br from-green-400 to-blue-500 hover:bg-gradient-to-tl transform transition-colors duration-1000 ease-in-out border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4 gradient-transition"><span class="font-noka text-warning-content text-[0.6rem]">UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION</span><div class="overlay btn w-[100%] h-[100%]"></div></button>
        <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Gradient</h3>
      </div>
    


    <div>
      <button 
        on:click={() => toggleBackgroundImageForm()}
        class="filter grayscale hover:grayscale-0 btn border-none w-[150px] min-h-[300px] flex flex-col justify-start py-4">
        <img src="{$userData?.photoURL}" alt="pfp" class="w-[100%] h-[100%]">
      </button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Upload Image</h3>
    </div>

    </div>

    <!-- color selection is right below background styles -->
    {#if showBackgroundColorSelect}
    <div 
      in:slide={{duration: 1000, easing: backOut}}
      out:slide={{duration: 400, easing: backIn}}
      class="flex justify-start space-x-10 mt-8 ">

      <!-- background color -->
      <div>
        <label for="Background Color" class="label">
          <span class="label-text font-input-mono">Background Color</span>
        </label>      
        <div id="Background Color" class="join">

            <!-- show buttoncolor / clikc for color picker -->
            <button 
            style={`background-color: ${background.hex? background.hex: 'hsl(var(--s))'}`}
              on:mouseenter={() => {if (background.hex !== '') {showRemoveBackground = true}}}
              on:mouseleave={() => showRemoveBackground = false}
              on:click={() => {updateColor('background', '', '')}} 
            class="btn w-1/4 rounded-md relative">
            {#if showRemoveBackground}
              <div
                in:slide out:blur={{amount: 100}}
                class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</div>
            {/if}
          </button>
      <div>
        <p class="text-[2rem]">{background.hex}</p>
        <input type="color" bind:value={background.hex} on:change={() => updateColor('background', background.hex)}>
      </div>

            <!-- select vaklue -->
            <select placeholder={bgValue} bind:value={bgValue} on:change={() => updateColor('background', bgValue, bgShade)} class="select select-bordered">
              <option>slate</option>
              <option>gray</option>
              <option>zinc</option>
              <option>neutral</option>
              <option>stone</option>
              <option>red</option>
              <option>orange</option>
              <option>amber</option>
              <option>yellow</option>
              <option>lime</option>
              <option>green</option>
              <option>emerald</option>
              <option>teal</option>
              <option>cyan</option>
              <option>sky</option>
              <option>blue</option>
              <option>indigo</option>
              <option>violet</option>
              <option>purple</option>
              <option>fuchsia</option>
              <option>pink</option>
              <option>rose</option>
            </select>

            <!-- select shade -->
            <select bind:value={bgShade} on:change={() => updateColor('background', bgValue, bgShade)} class="select select-bordered">
              <option>50</option>
              <option>100</option>
              <option>200</option>
              <option>300</option>
              <option>400</option>
              <option>500</option>
              <option>600</option>
              <option>700</option>
              <option>800</option>
              <option>900</option>
              <option>950</option>
            </select>
        </div>
      </div>

      <!-- opacity -->
      <div class="form-control">
        <label for="opacity" class="label">
          <span class="label-text font-input-mono">Opacity</span>
        </label>
        <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity will cause background to reflect diffently in preview than it will on your site"`}>

        <label class="input-group">
            <input type="text" min="0" max="100" id="opacity" bind:value={bgOpacity} on:change={() => updateOpacity('bg')} class="input input-bordered w-1/2" />
          <span>%</span>
        </label>
        </div>
      </div>
    </div>
    {/if}

    {#if showBackgroundGradientSelect}
    <div 
      in:slide={{duration: 1000, easing: backOut}}
      out:slide={{duration: 400, easing: backIn}}
      class="flex flex-col justify-start mt-8 ">

      <!-- from color -->
      <div class="flex space-x-10">
        <div>
          <label for="Gradient Color 1" class="label">
            <span class="label-text font-input-mono">From</span>
          </label>      
          <div id="Gradient Color 1" class="join">

              <!-- show buttoncolor / clikc for color picker -->
              <button 
                style={`background-color: ${fromHex? fromHex : 'white'}`}
                on:click={() => {toggleShowColorPicker(); mode = 'background'}} 
                class="btn w-1/4 rounded-md"></button>

              <!-- select vaklue -->
              <select placeholder={from.value} bind:value={from.value} on:change={() => updateGradient(from, to, direction)} class="select select-bordered">
                <option>slate</option>
                <option>gray</option>
                <option>zinc</option>
                <option>neutral</option>
                <option>stone</option>
                <option>red</option>
                <option>orange</option>
                <option>amber</option>
                <option>yellow</option>
                <option>lime</option>
                <option>green</option>
                <option>emerald</option>
                <option>teal</option>
                <option>cyan</option>
                <option>sky</option>
                <option>blue</option>
                <option>indigo</option>
                <option>violet</option>
                <option>purple</option>
                <option>fuchsia</option>
                <option>pink</option>
                <option>rose</option>
              </select>

              <!-- select shade -->
              <select bind:value={from.shade} on:change={() => updateGradient(from, to, direction)} class="select select-bordered">
                <option>50</option>
                <option>100</option>
                <option>200</option>
                <option>300</option>
                <option>400</option>
                <option>500</option>
                <option>600</option>
                <option>700</option>
                <option>800</option>
                <option>900</option>
                <option>950</option>
              </select>
          </div>
        </div>
        <!-- opacity -->
        <div class="form-control">
          <label for="opacity" class="label">
            <span class="label-text font-input-mono">Opacity</span>
          </label>
          <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity will cause background to reflect diffently in preview than it will on your site"`}>

          <label class="input-group">
              <input type="text" min="0" max="100" id="opacity" bind:value={from.opacity} on:change={() => updateGradient(from, to, direction)} class="input input-bordered w-1/2" />
            <span>%</span>
          </label>
          </div>
        </div>
      </div>

      <!-- to color -->
      <div class="flex space-x-10">
        <div>
          <label for="Gradient Color 2" class="label">
            <span class="label-text font-input-mono">To</span>
          </label>      
          <div id="Gradient Color 2" class="join">

              <!-- show buttoncolor / clikc for color picker -->
              <button 
                style={`background-color: ${toHex? toHex : 'white'}`}
                on:click={() => {toggleShowColorPicker(); mode = 'background'}} 
                class="btn w-1/4 rounded-md"></button>

              <!-- select vaklue -->
              <select placeholder={to.value} bind:value={to.value} on:change={() => updateGradient(from, to, direction)} class="select select-bordered">
                <option>slate</option>
                <option>gray</option>
                <option>zinc</option>
                <option>neutral</option>
                <option>stone</option>
                <option>red</option>
                <option>orange</option>
                <option>amber</option>
                <option>yellow</option>
                <option>lime</option>
                <option>green</option>
                <option>emerald</option>
                <option>teal</option>
                <option>cyan</option>
                <option>sky</option>
                <option>blue</option>
                <option>indigo</option>
                <option>violet</option>
                <option>purple</option>
                <option>fuchsia</option>
                <option>pink</option>
                <option>rose</option>
              </select>

              <!-- select shade -->
              <select bind:value={to.shade} on:change={() => updateGradient(from, to, direction)} class="select select-bordered">
                <option>50</option>
                <option>100</option>
                <option>200</option>
                <option>300</option>
                <option>400</option>
                <option>500</option>
                <option>600</option>
                <option>700</option>
                <option>800</option>
                <option>900</option>
                <option>950</option>
              </select>
          </div>
        </div>
        <!-- opacity -->
        <div class="form-control">
          <label for="opacity" class="label">
            <span class="label-text font-input-mono">Opacity</span>
          </label>
          <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity will cause background to reflect diffently in preview than it will on your site"`}>

          <label class="input-group">
              <input type="text" min="0" max="100" id="opacity" bind:value={to.opacity} on:change={() => updateGradient(from, to, direction)} class="input input-bordered w-1/2" />
            <span>%</span>
          </label>
          </div>
        </div>
      </div>

      <!-- gradient direction -->
      <!-- container -->
      <div class="flex justify-start space-x-2 ">
        <!-- preview -->
        <div 
        style={`background: linear-gradient(${direction}, ${fromHex}, ${toHex});`}
        class="w-60 border-2 mt-10 border-primary rounded-xl max-w-md h-40 custom-gradient">

        </div>
      <div class="flex flex-col mt-4 ">
        <label for="Gradient Direction" class="label">
          <span class="label-text font-input-mono">Direction <span class="text-info">{direction}°</span></span>
        </label>
        <div class="flex ">

        <div id="Gradient Direction" class="flex flex-col text-white  join">
          <div class="join text-white flex justify-evenly">
            <button on:click={() => updateGradient(from, to, direction = '315deg')} class="btn bg-opacity-0 text-5xl">↖</button>
            <button on:click={() => updateGradient(from, to, direction = '0deg')} class="btn bg-opacity-0 text-5xl">↑</button>
            <button on:click={() => updateGradient(from, to, direction = '45deg')} class="btn bg-opacity-0 text-5xl">↗</button>
          </div>
          <div class="join flex justify-evenly">
            <button on:click={() => updateGradient(from, to, direction = '270deg')} class="btn bg-opacity-0 text-5xl">←</button>
            <button class="bg-opacity-0 text-5xl font-input-mono">☯︎</button>
            <button on:click={() => updateGradient(from, to, direction = '90deg')} class="btn bg-opacity-0 text-5xl">→</button>
          </div>
          <div class="join flex justify-evenly">
            <button on:click={() => updateGradient(from, to, direction = '225deg')} class="btn bg-opacity-0 text-5xl">↙</button>
            <button on:click={() => updateGradient(from, to, direction = '180deg')} class="btn bg-opacity-0 text-5xl">↓</button>
            <button on:click={() => updateGradient(from, to, direction = '135deg')} class="btn bg-opacity-0 text-5xl">↘</button>
          </div>
        </div>
        </div>

        
      </div>


      </div>

      <div class="font-input-mono mt-4 bg-accent p-2 px-4">
        <p>from <span class="text-info">{fromHex}</span> to <span class="text-info">{toHex}</span>, <span class="text-info">{direction}</span>°</p>
      </div>
    </div>
    {/if}



    <!-- background image upload -->
    {#if showBackgroundImageForm}
      <form 
      in:slide={{ duration: 1000, easing: cubicInOut }}
      out:slide={{ duration: 1000, easing: cubicInOut }}
      class="">
        <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
            <img 
                src="{previewURL ?? $userData?.photoURL ?? "/sonic.jpeg"}" 
                alt="photoURL"
                width="256"
                height="256"
                class="mx-auto"
            />
            <label for="photoURL" class="label">
                <span class="label-text"></span>
            </label>
            <input
                on:change={uploadBackground}
                name="photoURL"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs"
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
            {#if uploading}
                <p class="text-info-content mt-6">uploading...</p>
                <progress class="progress progress-secondary w-56 mt-2 m-auto" />
            {/if}
            {#if uploadSuccess}
                <div class="bg-success rounded-md p-2 mt-6 w-3/4 m-auto">
                    <p class="text-success-content">uploaded successfully</p>
                </div>
            {/if}
        </div>
      </form>
    {/if}
    <!-- end bg image upload here -->
  </div>


    <!-- links -->
    <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Links</h2>
      <!-- main container -->
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl space-y-4">

        <!-- Fill controls -->
        <div class="flex flex-col flex-wrap justify-between ">
          <!-- Label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={fill} on:change={() => updateVisibility('fill', fill)} />
            <h3 class="font-input-mono text-white text-[1.5rem]">Fill</h3>
          </div>

          {#if fill}
          <!-- fill style -->
          <div 
            in:slide={{duration: 300, easing: cubicInOut}}
            out:slide>

            <div 
              in:fly={{y: -20, duration: 400, easing: backOut, delay: 200}}
              out:blur
              class="mt-2 mb-6">
              <label for="Fill Style" class="label">
                <span class="label-text font-input-mono">Style</span>
              </label>
              <div id="Fill Style">
                <!-- styles -->
                <div class="flex space-x-4 font-input-mono font-black text-sm -tracking-widest">
                  <!-- solid -->
                  <button 
                    on:click={() => setStyle('fill', 'solid')}
                    class="p-2 btn rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">solid</button>
                  <!-- gradient -->
                  <button 
                    on:click={() => setStyle('fill', 'gradient')}
                    class="p-2 btn rounded-md btn-accent bg-gradient-to-tr from-accent via-secondary to-primary hover:border-4 w-1/5">gradient</button>
                  <!-- image -->
                  <button 
                    on:click={() => setStyle('fill', 'image')}
                    class="hover:border-4 p-2 btn bg-[url('/icons/trash.jpeg')] bg-cover bg-top filter text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">image</button>
                  <!-- custom fill -->
                  <button 
                    on:click={() => setStyle('fill', 'gif')}
                    class="hover:border-4 p-2 btn bg-[url('/minecraft.gif')] bg-cover bg-bottom filter text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">gif</button>
                </div>
              </div>
            </div>

            <!-- color selection -->
            <div 
              in:fly={{x: 20, duration: 400, easing: backOut, delay: 500}}
              out:blur
              class="flex justify-start space-x-10 0">

              
              <!-- button color -->
              <div class="">
                <label for="Fill Color" class="label">
                  <span class="label-text font-input-mono text-right">Fill Color</span>
                </label>      
                <div id="Fill Color" class="join">

                    <!-- link fill value -->
                    <button 
                      style={`background-color: ${link.fill.hex? link.fill.hex : 'hsl(var(--a))'}`}
                      on:mouseenter={() => {if (link.fill.hex !== '') {showRemoveFill = true}}}
                      on:mouseleave={() => showRemoveFill = false}
                      on:click={() => {updateColor('link fill', '', '')}} 
                      class="btn w-1/4 rounded-md relative">
                      {#if showRemoveFill}
                        <div
                          in:slide out:blur={{amount: 100}}
                          class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</div>
                      {/if}
                    </button>

                    <!-- select value -->
                    <select placeholder={bcValue} bind:value={bcValue} on:change={() => updateColor('link fill', bcValue, bcShade)} class="select select-bordered">
                      <option>slate</option>
                      <option>gray</option>
                      <option>zinc</option>
                      <option>neutral</option>
                      <option>stone</option>
                      <option>red</option>
                      <option>orange</option>
                      <option>amber</option>
                      <option>yellow</option>
                      <option>lime</option>
                      <option>green</option>
                      <option>emerald</option>
                      <option>teal</option>
                      <option>cyan</option>
                      <option>sky</option>
                      <option>blue</option>
                      <option>indigo</option>
                      <option>violet</option>
                      <option>purple</option>
                      <option>fuchsia</option>
                      <option>pink</option>
                      <option>rose</option>
                    </select>

                    <!-- select shade -->
                    <select bind:value={bcShade} on:change={() => updateColor('link fill', bcValue, bcShade)} class="select select-bordered">
                      <option>50</option>
                      <option>100</option>
                      <option>200</option>
                      <option>300</option>
                      <option>400</option>
                      <option>500</option>
                      <option>600</option>
                      <option>700</option>
                      <option>800</option>
                      <option>900</option>
                      <option>950</option>
                    </select>
                </div>
              </div>

              <!-- opacity -->
              <div class="form-control">
                <label for="opacity" class="label">
                  <span class="label-text font-input-mono">Opacity</span>
                </label>
                <label class="input-group">
                  <input type="text" min="0" max="100" id="opacity" bind:value={bcOpacity} on:change={() => updateOpacity('link fill')} class="input input-bordered w-1/2" />
                  <span>%</span>
                </label>
              </div>
            </div>
          </div>
          {/if}
        </div>

        <!-- border controls -->
        <div class="flex flex-wrap flex-col justify-between">
          <!-- label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={border} on:change={() => updateVisibility('border', border)} />
            <h3 class="font-input-mono text-white text-[1.5rem]">Border</h3>
          </div>
          
          {#if border}
          <!-- border style -->
          <div 
            in:slide={{duration: 300, easing: cubicInOut}}
            out:slide>

            <div 
              in:fly={{x: -20, duration: 400, easing: cubicInOut, delay: 200}}
              out:blur
              class="mt-2 mb-6">
              <label for="Border Style" class="label">
                <span class="label-text font-input-mono">Style</span>
              </label>
              <div id="Border Style">
                <!-- styles -->
                <div class="flex space-x-4 font-input-mono">
                  <!-- solid -->
                  <button 
                    on:click={() => setStyle('border', 'solid')}
                    class="p-2 rounded-md btn-accent border-success w-1/5 border-4 transform transition duration-300 ease-in-out font-black -tracking-widest">solid</button>
                  <!-- dashed -->
                  <button 
                    on:click={() => setStyle('border', 'dashed')}
                    class="p-2 rounded-md btn-accent border-success w-1/5 border-dashed border-4 transform transition duration-300 ease-in-out font-black -tracking-widest">dashed</button>
                  <!-- double -->
                  <button 
                    on:click={() => setStyle('border', 'double')}
                    class="p-2 rounded-md btn-accent border-success w-1/5 border-double border-4 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">double</button>
                  <!-- groove -->
                  <button 
                    on:click={() => setStyle('border', 'groove')}
                    style="border: 4px groove"
                    class="p-2 rounded-md btn-accent border-success w-1/5 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">groove</button>
                  <!-- ridge -->
                  <button 
                    on:click={() => setStyle('border', 'ridge')}
                    style="border: 4px ridge"
                    class="p-2 rounded-md btn-accent border-success w-1/5 border-4 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">ridge</button>
                  <!-- custom border -->
                  <!-- <button 
                    on:click={() => setStyle('border', 'custom')}
                    class="p-2 rounded-md btn-accent w-1/5 border-t-primary border-r-primary border-b-info border-l-info border-4 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">custom</button> -->
                </div>
              </div>
            </div>

            <!-- color selection -->
            <div 
              in:fly={{x: 20, duration: 400, easing: backOut, delay: 500}}
              out:blur
              class="flex flex-wrap justify-between">
              <div class="flex justify-start space-x-10 ">
                <!-- button border color -->
                <div>
                  <label for="Border Color" class="label">
                    <span class="label-text font-input-mono">Border Color</span>
                  </label>      
                  <div id="Border Color" class="join">
          
                      <!-- link border color -->
                      <button 
                      style={`background-color: ${link.border.hex? link.border.hex : 'hsl(var(--s))'}`}
                        on:mouseenter={() => {if (link.border.hex !== '') {showRemoveBorder = true}}}
                        on:mouseleave={() => showRemoveBorder = false}
                        on:click={() => {updateColor('link border', '', '')}} 
                      class="btn w-1/4 rounded-md relative">
                      {#if showRemoveBorder}
                        <div
                          in:slide out:blur={{amount: 100}}
                          class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</div>
                      {/if}
                    </button>
          
                      <!-- select value -->
                      <select placeholder={bbValue} bind:value={bbValue} on:change={() => updateColor('link border', bbValue, bbShade)} class="select select-bordered">
                        <option>slate</option>
                        <option>gray</option>
                        <option>zinc</option>
                        <option>neutral</option>
                        <option>stone</option>
                        <option>red</option>
                        <option>orange</option>
                        <option>amber</option>
                        <option>yellow</option>
                        <option>lime</option>
                        <option>green</option>
                        <option>emerald</option>
                        <option>teal</option>
                        <option>cyan</option>
                        <option>sky</option>
                        <option>blue</option>
                        <option>indigo</option>
                        <option>violet</option>
                        <option>purple</option>
                        <option>fuchsia</option>
                        <option>pink</option>
                        <option>rose</option>
                      </select>
          
                      <!-- select shade -->
                      <select bind:value={bbShade} on:change={() => updateColor('link border', bbValue, bbShade)} class="select select-bordered">
                        <option>50</option>
                        <option>100</option>
                        <option>200</option>
                        <option>300</option>
                        <option>400</option>
                        <option>500</option>
                        <option>600</option>
                        <option>700</option>
                        <option>800</option>
                        <option>900</option>
                        <option>950</option>
                      </select>
                  
                  </div>
                </div>
                <!-- opacity -->
                <div class="form-control">
                  <label for="opacity" class="label">
                    <span class="label-text font-input-mono">Opacity</span>
                  </label>
                  <label class="input-group">
                    <input type="text" min="0" max="100" id="opacity" bind:value={bbOpacity} on:change={() => updateOpacity('bb')} class="input input-bordered w-1/2" />
                    <span>%</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/if}

        </div>

        <!-- shadow controls -->
        <div class="flex flex-wrap flex-col justify-between">
          <!-- label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={shadow} on:change={() => updateVisibility('shadow', shadow)} />
            <h3 class="font-input-mono text-white text-[1.5rem]">Shadow</h3>
          </div>
          
          {#if shadow}
          <!-- shadow style -->
          <div 
            in:slide={{duration: 300, easing: cubicInOut}}
            out:slide>

            <div 
              in:fly={{y: -20, duration: 400, easing: backOut, delay: 200}}
              out:blur
              class="mt-2 mb-6">
              <label for="Shadow Style" class="label">
                <span class="label-text font-input-mono">Style</span>
              </label>
              <div id="Shadow Style">
                <!-- styles -->
                <div class="flex space-x-4 font-input-mono">
                  <!-- soft shadow -->
                  <button 
                    on:click={() => setStyle('shadow', 'soft')}
                    class="btn soft-shadow p-2 rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">soft shadow</button>
                  <!-- hard shadow -->
                  <button 
                    on:click={() => setStyle('shadow', 'hard')}
                    class="hard-shadow p-2 btn rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">hard shadow</button>
                </div>
              </div>
            </div>

            <!-- color selection -->
            <div 
              in:fly={{y: 20, duration: 400, easing: backOut, delay: 500}}
              out:blur
              class="flex flex-wrap justify-between">
              <div class="flex justify-start space-x-10 ">
                <!-- shadow color -->
                <div>
                  <label for="Shadow Color" class="label">
                    <span class="label-text font-input-mono">Shadow Color</span>
                  </label>      
                  <div id="Shadow Color" class="join">
          
                      <!-- link shadow color -->
                      <button 
                      style={`background-color: ${link.shadow.hex? link.shadow.hex : 'hsl(var(--s))'}`}
                        on:mouseenter={() => {if (link.shadow.hex !== '') {showRemoveShadow = true}}}
                        on:mouseleave={() => showRemoveShadow = false}
                        on:click={() => {updateColor('link shadow', '', '')}} 
                      class="btn w-1/4 rounded-md relative">
                      {#if showRemoveShadow}
                        <div
                          in:slide out:blur={{amount: 100}}
                          class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</div>
                      {/if}
                    </button>
          
                      <!-- select value -->
                      <select placeholder={bsValue} bind:value={bsValue} on:change={() => updateColor('link shadow', bsValue, bsShade)} class="select select-bordered">
                        <option>slate</option>
                        <option>gray</option>
                        <option>zinc</option>
                        <option>neutral</option>
                        <option>stone</option>
                        <option>red</option>
                        <option>orange</option>
                        <option>amber</option>
                        <option>yellow</option>
                        <option>lime</option>
                        <option>green</option>
                        <option>emerald</option>
                        <option>teal</option>
                        <option>cyan</option>
                        <option>sky</option>
                        <option>blue</option>
                        <option>indigo</option>
                        <option>violet</option>
                        <option>purple</option>
                        <option>fuchsia</option>
                        <option>pink</option>
                        <option>rose</option>
                      </select>
          
                      <!-- select shade -->
                      <select bind:value={bsShade} on:change={() => updateColor('link shadow', bsValue, bsShade)} class="select select-bordered">
                        <option>50</option>
                        <option>100</option>
                        <option>200</option>
                        <option>300</option>
                        <option>400</option>
                        <option>500</option>
                        <option>600</option>
                        <option>700</option>
                        <option>800</option>
                        <option>900</option>
                        <option>950</option>
                      </select>
                  
                  </div>
                </div>
                <!-- opacity -->
                <div class="form-control">
                  <label for="opacity" class="label">
                    <span class="label-text font-input-mono">Opacity</span>
                  </label>
                  <label class="input-group">
                    <input type="text" min="0" max="100" id="opacity" bind:value={bsOpacity} on:change={() => updateOpacity('bs')} class="input input-bordered w-1/2" />
                    <span>%</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/if}

        </div> 

        <!-- title controls -->
        <div class="flex flex-wrap flex-col justify-between">
          <!-- label -->
          <div class="flex space-x-6 items-center mt-8">
            <h3 class="font-input-mono text-white text-[1.5rem]">Link Title</h3>
          </div>
          <!-- style + color picker div -->
          <div 
            in:slide={{duration: 300, easing: cubicInOut}}
            out:slide>
            <!-- style/texteffects div -->
            <div 
              in:fly={{y: -20, duration: 400, easing: backOut, delay: 200}}
              out:blur
              class="mt-2 mb-6">
              
              <div class="flex flex-col space-x-6 items-start mb-4">
                <label for="Text Effect" class="label">
                  <span class="label-text font-input-mono">Text Effect</span>
                </label>
                <div class="flex space-x-2">
                  <input type="checkbox" class="toggle toggle-sm" bind:checked={onHover} on:change={() => updateOnHover()}>
                  <h4 class="font-input-mono text-info text-[1rem]">
                    {#if onHover}
                    <span in:blur>On Hover</span>
                    {:else}
                    <span in:blur>Static</span>
                    {/if}
                  </h4>
                </div>
              </div>
              <div id="Text Effect">
                <!-- styles -->
                <div class="flex space-x-4 font-input-mono">
                  <!-- glow -->
                  <button 
                  on:click|preventDefault={() => handleTextEffectSelect('glow', false)} 
                  class="glow btn p-2 rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">Glow</button>
                  <!-- hard shadow -->
                  <button 
                    on:click={() => handleTextEffectSelect('highlight', false)}
                    class="p-2 btn rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">Highlight</button>
                </div>
              </div>
            </div>

            <!-- color selection -->
            <div 
              in:fly={{y: 20, duration: 400, easing: backOut, delay: 500}}
              out:blur
              class="flex flex-wrap justify-between">
              <div class="flex justify-start space-x-10 ">
                <!-- title color -->
                <div>
                  <label for="Title Color" class="label">
                    <span class="label-text font-input-mono">Title Color</span>
                  </label>      
                  <div id="Title Color" class="join">
          
                      <!-- link title color -->
                      <button 
                      style={`background-color: ${link?.title.hex? link?.title.hex : 'hsl(var(--pc))'}`}
                        on:mouseenter={() => {if (link?.title.hex !== '') {showRemoveTitle = true}}}
                        on:mouseleave={() => showRemoveTitle = false}
                        on:click={() => {updateColor('link title', '', '')}} 
                      class="btn w-1/4 rounded-md relative">
                      {#if showRemoveTitle}
                        <div
                          in:slide out:blur={{amount: 100}}
                          class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</div>
                      {/if}
                    </button>
          
                      <!-- select value -->
                      <select placeholder={bfValue} bind:value={bfValue} on:change={() => updateColor('link title', bfValue, bfShade)} class="select select-bordered">
                        <option>slate</option>
                        <option>gray</option>
                        <option>zinc</option>
                        <option>neutral</option>
                        <option>stone</option>
                        <option>red</option>
                        <option>orange</option>
                        <option>amber</option>
                        <option>yellow</option>
                        <option>lime</option>
                        <option>green</option>
                        <option>emerald</option>
                        <option>teal</option>
                        <option>cyan</option>
                        <option>sky</option>
                        <option>blue</option>
                        <option>indigo</option>
                        <option>violet</option>
                        <option>purple</option>
                        <option>fuchsia</option>
                        <option>pink</option>
                        <option>rose</option>
                      </select>
          
                      <!-- select shade -->
                      <select bind:value={bfShade} on:change={() => updateColor('link title', bfValue, bfShade)} class="select select-bordered">
                        <option>50</option>
                        <option>100</option>
                        <option>200</option>
                        <option>300</option>
                        <option>400</option>
                        <option>500</option>
                        <option>600</option>
                        <option>700</option>
                        <option>800</option>
                        <option>900</option>
                        <option>950</option>
                      </select>
                  
                  </div>
                </div>
                <!-- opacity -->
                <div class="form-control">
                  <label for="opacity" class="label">
                    <span class="label-text font-input-mono">Opacity</span>
                  </label>
                  <label class="input-group">
                    <input type="text" min="0" max="100" id="opacity" bind:value={bfOpacity} on:change={() => updateOpacity('link title')} class="input input-bordered w-1/2" />
                    <span>%</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div> 

      <!-- radius control -->
        <h3 class="font-input-mono text-white my-2 mt-6">Radius</h3>
        <div class="flex flex-wrap justify-between">
          <button 
            on:click={() => setRadius('none')} 
            class="btn w-1/3 rounded-none mb-4">None</button>
          <button 
            on:click={() => setRadius('half')} 
            class="btn w-1/3 rounded-[0.5rem] mb-4">Half</button>
          <button 
            on:click={() => setRadius('full')} 
            class="btn w-1/4 rounded-full mb-4">Full</button>
      </div>
    </div>
  

      <!-- fonts -->
      <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Font</h2>
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
        
        <h3 class="font-input-mono text-white my-2">Font</h3>
        <button on:click|preventDefault={() => toggleFontDropdown()} class="btn group border-neutral-200 shadow shadow-neutral-200 bg-white h-20 flex items-center justify-start space-x-4">
          <div class="bg-neutral-200 w-12 h-12 rounded-sm items-center justify-center flex">
            <p class="m-auto font-{font?.family} text-black text-[1.5rem]">Aa</p>
          </div>
          <p class="font-{font?.family} group-hover:text-neutral-200 text-[1.5rem] text-black">{font?.family}</p>
        </button>
 {#if fontDropdown}
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div id="fonts" class="mt-8">
          <Fonts />
        </div>
      {/if}
      <div class="flex space-x-8 mt-4">

        <!-- font color selection -->
        <div 
          in:slide={{duration: 1000, easing: backOut}}
          out:slide={{duration: 400, easing: backIn}}
          class="flex justify-start space-x-10 mt-8 ">

        <!-- font color -->
        <div>
          <label for="Font Color" class="label">
            <span class="label-text font-input-mono">Font Color</span>
          </label>      
          <div id="Font Color" class="join">

              <!-- show fontColor / clikc for color picker -->
              <button 
                style={`background-color: ${font?.hex? font?.hex : 'white'}`}
                on:mouseenter={() => {if (font?.hex !== '') {showRemoveFont = true}}}
                on:mouseleave={() => showRemoveFont = false}
                on:click={() => {updateColor('font', '', '')}} 
                class="btn w-1/4 rounded-md">
                {#if showRemoveFont}
                <div
                  in:slide out:blur={{amount: 100}}
                  class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</div>
                {/if}
              </button>

              <!-- select value -->
              <select placeholder={fcValue} bind:value={fcValue} on:change={() => updateColor('font', fcValue, fcShade)} class="select select-bordered">
                <option>slate</option>
                <option>gray</option>
                <option>zinc</option>
                <option>neutral</option>
                <option>stone</option>
                <option>red</option>
                <option>orange</option>
                <option>amber</option>
                <option>yellow</option>
                <option>lime</option>
                <option>green</option>
                <option>emerald</option>
                <option>teal</option>
                <option>cyan</option>
                <option>sky</option>
                <option>blue</option>
                <option>indigo</option>
                <option>violet</option>
                <option>purple</option>
                <option>fuchsia</option>
                <option>pink</option>
                <option>rose</option>
              </select>

              <!-- select shade -->
              <select bind:value={fcShade} on:change={() => updateColor('font', fcValue, fcShade)} class="select select-bordered">
                <option>50</option>
                <option>100</option>
                <option>200</option>
                <option>300</option>
                <option>400</option>
                <option>500</option>
                <option>600</option>
                <option>700</option>
                <option>800</option>
                <option>900</option>
                <option>950</option>
              </select>
          </div>
        </div>

        <!-- font opacity -->
        <div class="form-control">
          <label for="opacity" class="label">
            <span class="label-text font-input-mono">Opacity</span>
          </label>

          <label class="input-group">
              <input type="text" min="0" max="100" id="opacity" bind:value={fcOpacity} on:change={() => updateOpacity(fcOpacity)} class="input input-bordered w-1/2" />
            <span>%</span>
          </label>
        </div>
      </div>
        <!-- font color selection -->

        

        <!-- font size -->
        

      </div>
      
    <div>

    </div> 
    {#if showFontColorPicker}
      <ColorPicker mode={mode} customTheme={customTheme}/>
    {/if}


</div>
    
<!-- fonts -->
<h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Save Custom Theme</h2>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bg-secondary space-y-4 font-input-mono m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">

  
  <label for="Custom Theme Name">Theme Name</label>
<input type="text" bind:value={name} class="p-4 rounded-md" placeholder="Enter Theme Name">
<button 
on:click={() => saveCustomTheme(name, customTheme)}
class="btn">Save Theme</button>


</div> 



     
    
 

{#if showBackUp}
  <a 
    in:blur
    out:blur
    href="#top" 
    class="fixed bottom-3 z-50 right-3 text-[3rem]">
    👆
  </a>
{/if}

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

.my-theme {
  position: relative;
  width: 200px;  /* Set to your desired width */
  height: 200px;  /* Set to your desired height */
}

.my-theme::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('your-image-url.jpg'); /* Set your image URL here */
  opacity: 0.5;  /* Initial opacity set to 50% */
  z-index: -1;  /* Place it behind the content */
}

.my-theme:hover::before {
  opacity: 1;  /* Opacity set to 100% on hover */
}

.custom-gradient {
  background: linear-gradient(var(--direction, to right), var(--fromHex), var(--toHex));
}

  
  </style>


  