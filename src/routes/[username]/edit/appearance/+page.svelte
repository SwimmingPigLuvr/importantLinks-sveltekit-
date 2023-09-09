<script lang="ts">
  import ColorPicker from "$lib/components/ColorPicker.svelte";
  import Fonts from "$lib/components/Fonts.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData, storage, userTheme } from "$lib/firebase";
  import { setTheme, type CustomTheme, defaultTheme, emptyTheme } from "$lib/theme";
  import { doc, getDoc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { flip } from "svelte/animate";
  import { backIn, backOut, cubicIn, cubicInOut, cubicOut } from "svelte/easing";
  import { fade, slide, blur, fly } from "svelte/transition";
  import { updateTheme } from "$lib/themeStore";
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import colors from "tailwindcss/colors";
  import { convert, concatOpacity } from "$lib/theme";
  import { onMount } from "svelte";

  let showBackUp: boolean = false;

  function handleScroll() {
    const windowHeight = document.documentElement.offsetHeight;
    const windowBottom = windowHeight + window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;

    // check if scrolled past 60% of the page
    if (windowBottom / documentHeight >= 0.8) {
      showBackUp = true;
    } else {
      showBackUp = false;
    }
  }


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
  let fontSize: number = 1;
  let fontColor: string;
  let background: string;
  let backgroundStyle: 'gradient' | 'image' | 'solid';
  let buttonStyle: "squareFill" | "roundFill" | "circleFill" | "squareBorder" | "roundBorder" | "circleBorder" | "squareShadow" | "roundShadow" | "circleShadow";
  let buttonColor: string;
  let buttonFontColor: string;
  let buttonFontSize: number = 1;


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

  $: if ($userData) {
    username = $userData.username;
    bio = $userData.bio;
    photoURL = $userData.photoURL;
    links = $userData.links;
    customTheme = $userData.customTheme;
    theme = $userData.theme;    
    userThemes = $userData.userThemes;

    

    // set customTheme vars
    font = customTheme?.font?.family;
    fontColor = customTheme?.font?.color;


    // the style of backgorund will effect how we apply it
    // we only need the string value rn
    backgroundStyle = customTheme?.background?.style;
    background = customTheme?.background?.value;

    // buttons
    buttonStyle = customTheme?.button?.style;
    buttonColor = customTheme?.button?.color;
    buttonFontColor = customTheme?.button?.fontColor;
    buttonBorder = customTheme?.button?.border;
    buttonShadow = customTheme?.button?.shadow;

    // convert these to hex codes
    backgroundHex = background ? convert(background) : undefined;
    fontColorHex = fontColor ? convert(fontColor) : undefined;
    buttonColorHex = buttonColor ? convert(buttonColor) : undefined;
    buttonFontColorHex = buttonFontColor ? convert(buttonFontColor) : undefined;
    buttonShadowHex = buttonShadow ? convert(buttonShadow) : undefined;
    buttonBorderHex = buttonBorder ? convert(buttonBorder) : undefined;

    // [buttonShade, buttonValue] = buttonColor.split('-');

    // append opacities
    bgchwo = concatOpacity(backgroundHex, bgOpacity);

    fchwo = concatOpacity(fontColorHex, fcOpacity);

    bchwo = concatOpacity(buttonColorHex, bcOpacity);

    bfchwo = concatOpacity(buttonFontColorHex, bfOpacity);

    buttonBorderHexWithOpacity = concatOpacity(buttonBorderHex, bbOpacity);
    buttonShadowHexWithOpacity = concatOpacity(buttonShadowHex, bsOpacity);


  }

  $: if ($userData && $userData.userThemes && $userData.userThemes.length > 1) {
    const uniqueThemeName = Object.keys(userThemes[1])[0];
    console.log('userthemes: ', userThemes);
  }

  $: if (data && data.customTheme) {
    updateTheme(customTheme);
  }

  // delete this: will be imported from theme.ts
  // convert tailwind to hex

  // function convert(colorName: string): string | undefined {
  //   const [color, shade] = colorName.split('-');
  //   return (colors as any)[color]?.[shade];
  // }

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

  async function changeButtonFontSize() {
    console.log('changing buttonFontsize to: ', buttonFontSize);

    const batch = writeBatch(db);
    batch.set(doc(db, "users", $user!.uid), {
      customTheme: {
        ...customTheme,
        button: {
          ...button,
          fontSize: buttonFontSize
        }
      }
    }, { merge: true })

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


  // save button style
  let chosenButtonStyle = '';



async function updateButtonStyle(batch, buttonStyle, shadowColor, borderColor) {
  let buttonData = {
    style: buttonStyle,
    shadow: '',
    border: '',
    shadowOpacity: 0,
    borderOpacity: 0,
  };

  if (buttonStyle.endsWith('Shadow')) {
    buttonData.shadow = shadowColor;
    buttonData.shadowOpacity = 100;
  } else if (buttonStyle.endsWith('Border')) {
    buttonData.border = borderColor;
    buttonData.borderOpacity = 100;
  }

  return {
    customTheme: {
      button: buttonData
    }
  };
}

async function saveButtonStyle() {
  console.log('saving button style: ', chosenButtonStyle);

  const batch = writeBatch(db);
  const dataToSave = await updateButtonStyle(batch, chosenButtonStyle, tempButtonShadowColor, tempButtonBorderColor);

  batch.set(doc(db, "users", $user!.uid), dataToSave, { merge: true });

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
        button: { 
          textEffect: textEffect 
        }
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

  let showColorSelection: boolean = false;
  
  function toggleShowColorPicker() {
    if (showGradientPicker) {
      showGradientPicker = false;
    }
    showColorPicker = !showColorPicker;
  }

  function toggleShowColorSelection() {
    showColorSelection = !showColorSelection;
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

  async function updateColor(mode: string, value: string, shade: string) {

    console.log('updateing colors: ', mode + ': ' + value + '-' + shade);
    temp = value + '-' + shade.toString();

    const batch = writeBatch(db);

    switch (mode) {

      // background
      case 'bg':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              style: 'solid',
              value: temp,
              opacity: bgOpacity
            }
          }
        }, { merge: true });

        break;

      // button color
      case 'bc':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              color: temp,
              opacity: bcOpacity
            }
          }
        }, { merge: true });

        break;

      // button border
      case 'bb':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              border: temp,
              borderOpacity: bbOpacity
            }
          }
        }, { merge: true });

        break;

      // button Shadow
      case 'bs':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              shadow: temp,
              shadowOpacity: bsOpacity
            }
          }
        }, { merge: true });

        break;
      
      // button font
      case 'bf':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              fontColor: temp,
              fontOpacity: bfOpacity
            }
          }
        }, { merge: true });

        break;
      
      // font
      case 'fc':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            font: {
              color: temp,
              opacity: fcOpacity
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

  async function updateOpacity(mode: string) {
    const batch = writeBatch(db);

    switch (mode) {
      case 'bg': 
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              opacity: bgOpacity
            }
          }
        }, { merge: true });
        break;
      case 'fc': 
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            font: {
              opacity: fcOpacity
            }
          }
        }, { merge: true });
        break;
      case 'bf':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              fontOpacity: bfOpacity
            }
          }
        }, { merge: true });
        break;
      case 'bc':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              opacity: bcOpacity
            }
          }
        }, { merge: true });
        break;
      case 'bb':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              borderOpacity: bbOpacity
            }
          }
        }, { merge: true });
        break;
      case 'bs':
      batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            button: {
              shadowOpacity: bsOpacity
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

<svelte:window on:scroll={handleScroll} />


<!-- put these props back incase hehe -->

<!--   -->

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

        <!-- user made themes -->
        {#each userThemes as userTheme, index}
          <div class="">
                <button 
                  on:click|preventDefault={() => handleThemeSelect(userTheme.name)} 
                  style={`color: ${fontColorHex}; ${userTheme?.background?.style === 'image' ? `background-image: url(${userTheme?.background?.value}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;` : (userTheme?.background?.style === 'solid' ? `background-color: ${convert(userTheme?.background?.value)}` : '')}`}
                  class={`btn bg-${background} border-none min-w-[160px] min-h-[300px] max-w-[200px] {theme} flex flex-col justify-start py-4`}>
                    <div class={`font-${userTheme.font? userTheme.font.family : ''} flex flex-col items-center font`}>
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
            on:click={() => toggleShowColorSelection()} 
            class="btn bg-warning-content border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4"></button>
          <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Solid Color</h3>
        </div>
      <!-- gradient -->
      <div>
        <button class="group btn bg-gradient-to-br from-green-400 to-blue-500 hover:bg-gradient-to-tl transform transition-colors duration-1000 ease-in-out border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4 gradient-transition"><span class="font-noka text-warning-content text-[0.6rem]">UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION</span><div class="overlay btn w-[100%] h-[100%]"></div></button>
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
    {#if showColorSelection}
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
              style={`background-color: ${bgchwo? bgchwo : 'white'}`}
              on:click={() => {toggleShowColorPicker(); mode = 'background'}} 
              class="btn w-1/4 rounded-md"></button>

            <!-- select vaklue -->
            <select placeholder={bgValue} bind:value={bgValue} on:change={() => updateColor('bg', bgValue, bgShade)} class="select select-bordered">
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
            <select bind:value={bgShade} on:change={() => updateColor('bg', bgValue, bgShade)} class="select select-bordered">
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



    <!-- form here -->
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
      <!-- end form here -->

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
            
          <!-- border -->
          <h3 class="font-input-mono text-white my-2">Border</h3>
        <div class="flex flex-wrap justify-between">
          <button on:click|preventDefault={() => handleButtonSelect('squareBorder')} class="btn bg-opacity-0 border-primary border-2 w-full rounded-none mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('roundBorder')} class="btn bg-opacity-0 border-primary border-2 w-full mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('circleBorder')} class="btn bg-opacity-0 border-primary border-2 w-full rounded-full mb-4"></button>
        </div>

          <!-- shadow -->
          <h3 class="font-input-mono text-white my-2">Shadow</h3>
        <div class="flex flex-wrap justify-between">
          <button on:click|preventDefault={() => handleButtonSelect('squareShadow')} class="btn shadow-md shadow-primary bg-opacity-0 border-none w-full rounded-none mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('roundShadow')}  class="btn shadow-md shadow-primary bg-opacity-0 border-none w-full mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('circleShadow')} class="btn shadow-md shadow-primary bg-opacity-0 border-none w-full mb-4 rounded-full"></button>
        </div>

          <!-- hardShadow -->
          <h3 class="font-input-mono text-white my-2">Hard Shadow</h3>
        <div class="flex flex-wrap justify-between">
          <button on:click|preventDefault={() => handleButtonSelect('squareHardShadow')} class="btn hardShadow bg-opacity-0 w-full rounded-none mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('roundHardShadow')}  class="btn hardShadow bg-opacity-0 w-full mb-4"></button>
          <button on:click|preventDefault={() => handleButtonSelect('circleHardShadow')} class="btn hardShadow bg-opacity-0 w-full mb-4 rounded-full"></button>
        </div>
            
  <!-- container -->
  <div class="flex flex-col justify-start space-y-4">


    <!-- color select -->
    <!-- button color + opacity -->
    <div class="flex justify-start space-x-10 mt-8 ">

      <!-- button color -->
      <div>
        <label for="Button Color" class="label">
          <span class="label-text font-input-mono">Button Color</span>
        </label>      
        <div id="Button Color" class="join">

            <!-- show buttoncolor / clikc for color picker -->
            <button 
              style={`background-color: ${bchwo? bchwo : 'white'}`}
              on:click={() => {toggleShowButtonColorPicker(); mode = 'buttonColor'}} 
              class="btn w-1/4 rounded-md"></button>

            <!-- select value -->
            <select placeholder={bcValue} bind:value={bcValue} on:change={() => updateColor('bc', bcValue, bcShade)} class="select select-bordered">
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
            <select bind:value={bcShade} on:change={() => updateColor('bc', bcValue, bcShade)} class="select select-bordered">
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
          <input type="text" min="0" max="100" id="opacity" bind:value={bcOpacity} on:change={() => updateOpacity('bc')} class="input input-bordered w-1/2" />
          <span>%</span>
        </label>
      </div>
    </div>




      <!-- button font color -->
      <div class="flex justify-start space-x-10 mt-8 ">

        <!-- button color -->
        <div>
          <label for="Button Font Color" class="label">
            <span class="label-text font-input-mono">Button Font Color</span>
          </label>      
          <div id="Button Font Color" class="join">
  
              <!-- show buttoncolor / clikc for color picker -->
              <button 
                style={`background-color: ${bfchwo? bfchwo : 'white'}`}
                on:click={() => {toggleShowButtonColorPicker(); mode = 'buttonFontColor'}} 
                class="btn w-1/4 rounded-md"></button>
  
              <!-- select value -->
              <select placeholder={bfValue} bind:value={bfValue} on:change={() => updateColor('bf', bfValue, bfShade)} class="select select-bordered">
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
              <select bind:value={bfShade} on:change={() => updateColor('bf', bfValue, bfShade)} class="select select-bordered">
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
            <input type="text" min="0" max="100" id="opacity" bind:value={bfOpacity} on:change={() => updateOpacity('bf')} class="input input-bordered w-1/2" />
            <span>%</span>
          </label>
        </div>
      </div>

    <!-- buttonshadowcolor -->
    {#if buttonShadow !== ''}
    <div class="flex justify-start space-x-10 mt-8 ">

      <!-- button shadow color -->
      <div>
        <label for="Shadow Color" class="label">
          <span class="label-text font-input-mono">Shadow Color</span>
        </label>      
        <div id="Shadow Color" class="join">

            <!-- show shadow color / clikc for color picker -->
            <button 
              style={`background-color: ${buttonShadowHexWithOpacity? buttonShadowHexWithOpacity : 'white'}`}
              on:click={() => {toggleShowButtonColorPicker(); mode = 'shadowColor'}} 
              class="btn w-1/4 rounded-md"></button>

            <!-- select value -->
            <select placeholder={bsValue} bind:value={bsValue} on:change={() => updateColor('bs', bsValue, bsShade)} class="select select-bordered">
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
            <select bind:value={bsShade} on:change={() => updateColor('bs', bsValue, bsShade)} class="select select-bordered">
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
    {/if}
    <!-- buttonshadowcolor -->

    <!-- button border -->
    {#if buttonBorder !== ''}
    <div class="flex justify-start space-x-10 mt-8 ">

      <!-- button border color -->
      <div>
        <label for="Border Color" class="label">
          <span class="label-text font-input-mono">Border Color</span>
        </label>      
        <div id="Border Color" class="join">

            <!-- show border color / clikc for color picker -->
            <button 
              style={`background-color: ${buttonBorderHexWithOpacity? buttonBorderHexWithOpacity : 'white'}`}
              on:click={() => {toggleShowButtonColorPicker(); mode = 'borderColor'}} 
              class="btn w-1/4 rounded-md"></button>

            <!-- select value -->
            <select placeholder={bbValue} bind:value={bbValue} on:change={() => updateColor('bb', bbValue, bbShade)} class="select select-bordered">
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
            <select bind:value={bbShade} on:change={() => updateColor('bb', bbValue, bbShade)} class="select select-bordered">
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
    {/if}
    <!-- button border color -->


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
      <button on:click|preventDefault={() => handleTextEffectSelect('highlight', false)} class="btn w-1/3 rounded-md mb-4">Highlight</button>
      <button on:click|preventDefault={() => handleTextEffectSelect('gradient', false)} class="btn w-1/4 rounded-md mb-4">Gradient</button>
    </div>
  
      
      </div>
  

      <!-- fonts -->
      <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Font</h2>
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
        
        <h3 class="font-input-mono text-white my-2">Font</h3>
        <button on:click|preventDefault={() => toggleFontDropdown()} class="btn group border-neutral-200 shadow shadow-neutral-200 bg-white h-20 flex items-center justify-start space-x-4">
          <div class="bg-neutral-200 w-12 h-12 rounded-sm items-center justify-center flex">
            <p class="m-auto font-{font} text-black text-[1.5rem]">Aa</p>
          </div>
          <p class="font-{font} group-hover:text-neutral-200 text-[1.5rem] text-black">{font}</p>
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

        <!-- background color -->
        <div>
          <label for="Font Color" class="label">
            <span class="label-text font-input-mono">Font Color</span>
          </label>      
          <div id="Font Color" class="join">

              <!-- show fontColor / clikc for color picker -->
              <button 
                style={`background-color: ${fchwo? fchwo : 'white'}`}
                on:click={() => {toggleShowColorPicker(); mode = 'fontColor'}} 
                class="btn w-1/4 rounded-md"></button>

              <!-- select value -->
              <select placeholder={fcValue} bind:value={fcValue} on:change={() => updateColor('fc', fcValue, fcShade)} class="select select-bordered">
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
              <select bind:value={fcShade} on:change={() => updateColor('fc', fcValue, fcShade)} class="select select-bordered">
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

  
  </style>


  