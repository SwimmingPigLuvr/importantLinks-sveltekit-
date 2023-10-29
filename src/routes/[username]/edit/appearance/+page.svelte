<script lang="ts">
  import Fonts from "$lib/components/Fonts.svelte";
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import { db, user, userData, storage, userTheme } from "$lib/firebase";
  import type { LinkData } from "$lib/firebase";
  import { setTheme, dataTheme } from "$lib/theme";
  import type { CustomTheme, Gradient, Color, Image, RepeatValue, PositionValue, Border, BorderImage, Fill, Shadow, Title, Effect, TitleFont, Font } from "$lib/theme";
  import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { backOut, cubicInOut } from "svelte/easing";
  import { slide, blur, fly } from "svelte/transition";
  import { updateTheme } from "$lib/themeStore";
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import ImageUpload from "$lib/components/ImageUpload.svelte";
  import ColorInput from "$lib/components/ColorInput.svelte";

  let themeHover: boolean[] = [];
  let customThemeHover: boolean[] = [];
  let sizeNumber: number = 4;
  let unit: string = 'px';

  let header: string;
  let background: {
    gradient: Gradient;
    hex: string | undefined;
    image: Image;
    opacity: number;
    style: string;
  }

  let link: {
    border: Border;
    fill: Fill;
    radius: string;
    shadow: Shadow;
    title: Title;
  };

  let font: Font;

  async function setBorderWidth(sizeNumber: number, unit: string) {
    const batch = writeBatch(db);
    saving = true;
    const width = `${sizeNumber}${unit}`;

    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        link: {
          border: {
            width: width
          }
        }
      }
    }, { merge: true });

    await batch.commit();
    saveSuccess = true;
    saving = false;
  }

  async function setBorderFillStyle(fillStyle: string) {
    const batch = writeBatch(db);
    saving = true;

    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        link: {
          border: {
            fillStyle: fillStyle
          }
        }
      }
    }, { merge: true });

    await batch.commit();
    saveSuccess = true;
    saving = false;  
  }

  let fill: boolean;
  let border: boolean;
  let shadow: boolean;

  let isLinkAnimationActive: boolean;

  let solidLinkFill: boolean;
  let gradientLinkFill: boolean;
  let imageLinkFill: boolean;

  let solidLinkBorder: boolean;
  let gradientLinkBorder: boolean;
  let imageLinkBorder: boolean;

  async function updateLinkAnimation(animation: string) {
    const batch = writeBatch(db);
    saving = true;
    console.log('updating link animation');

    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        link: {
          animation: animation
        }
      }
    }, { merge: true });

    await batch.commit();
    saving = false;
    saveSuccess = true;
  }

  async function toggleLinkAnimation() {
    const batch = writeBatch(db);
    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        link: {
          active: true
        }
      }
    }, { merge: true });
    await batch.commit();
  }

  async function updateVisibility(mode: string, isVisible: boolean) {
    const batch = writeBatch(db);
    console.log('updating visibility for ', mode);

    if (mode === 'fill') {
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

  let showBackUp: boolean = false;

  export let data: PageData;

  // declare user data vars
  let username: string | undefined;
  let bio: string | undefined;
  let photoURL: string | undefined;
  let links: LinkData[];
  let customTheme: CustomTheme;
  let theme: string | undefined;
  

  let userThemes: CustomTheme[] = [];
  
  let onHover: boolean;

  let currentBackgroundHex: any;
  let currentBackgroundGradient: any;

  let currentLinkHex: any;
  let currentLinkGradient: any;

  let currentBorderHex: any;
  let currentBorderGradient: any;

  let currentShadowHex: any;
  let currentShadowGradient: any;
  let currentLinkTitleHex: any;
  let currentFontHex: any;

  let headerImage: any;
  let backgroundImage: any;
  let linkImage: any;
  let borderImage: any;

  $: if ($userData) {
    username = $userData.username;
    bio = $userData.bio;
    photoURL = $userData.photoURL;
    links = $userData.links;
    customTheme = $userData.customTheme;
    theme = $userData.theme;    
    userThemes = $userData.userThemes;
    header = $userData.header;

    font = customTheme.font;
    background = customTheme.background;
    link = customTheme.link;
    onHover = link?.title?.effect?.onHover;

    // objects for color input component
    currentFontHex = {hex: font.hex, opacity: font.opacity}
    currentLinkHex = {hex: link.fill.hex, opacity: link.fill.opacity};
    currentBorderHex = {hex: link.border.hex, opacity: link.border.opacity};
    currentShadowHex = {hex: link.shadow.hex, opacity: link.shadow.opacity};
    currentLinkTitleHex = {hex: link.title.font.hex, opacity: link.title.opacity};

    currentBackgroundHex = {hex: background.hex, opacity: background.opacity};
    currentLinkGradient = {...link.fill.gradient, style: link.fill.style};
    currentBorderGradient = {...link.border.gradient, style: link.border.style};
    currentShadowGradient = {...link.shadow.gradient, style: link.shadow.style};
    currentBackgroundGradient = {
      from: {
        hex: background.gradient.from.hex,
        opacity: background.gradient.from.opacity
      },
      to: {
        hex: background.gradient.to.hex,
        opacity: background.gradient.to.opacity
      },
      direction: background.gradient.direction,
      style: background.style,
    };

    // objects for the ImageUpload component
    backgroundImage = background.image;
    linkImage = link.fill.image;
    borderImage = link.border.image;
  }

  $: if (isLinkAnimationActive) {
    toggleLinkAnimation;
  }

  $: if ($userData && $userData.userThemes && $userData.userThemes.length > 1) {
    const uniqueThemeName = Object.keys(userThemes[1])[0];
  }

  $: if (data && data.customTheme) {
    updateTheme(customTheme);
  }


  $: if (background?.style === 'background-gradient' || background?.style === 'background-radial-gradient') {
    backgroundGradientSelect = true;
  } else {
    backgroundGradientSelect = false;
  }

  $: if (background?.style === 'background-solid') {
    backgroundColorSelect = true;
  } else {
    backgroundColorSelect = false;
  }

  $: if (background?.style === 'background-image') {
    backgroundImageForm = true;
  } else {
    backgroundImageForm = false;
  }

  $: if (link?.fill?.isVisible) {
    fill = true
  } else {
    fill = false
  }

  $: if (link?.fill?.style === 'image' && link?.fill?.isVisible) {
    linkImageForm = true;
  } else {
    linkImageForm = false;
  }

  $: if (link?.border?.isVisible) {
    border = true;
  } else {
    border = false;
  }

  $: if (link?.shadow?.isVisible) {
    shadow = true;
  } else {
    shadow = false;
  }

  $: if (link?.fill?.style === 'link-solid') {
    solidLinkFill = true;
  } else {
    solidLinkFill = false;
  }

  $: if (link?.fill?.style === 'link-gradient') {
    gradientLinkFill = true;
  } else {
    gradientLinkFill = false;
  }

  $: if (link?.fill?.style === 'link-image' || link?.fill?.style === 'link-gif') {
    imageLinkFill = true;
  } else {
    imageLinkFill = false;
  }

  $: if (link?.border?.fillStyle === 'border-solid') {
    solidLinkBorder = true;
  } else {
    solidLinkBorder = false;
  }

  $: if (link?.border?.fillStyle === 'border-gradient') {
    gradientLinkBorder = true;
  } else {
    gradientLinkBorder = false;
  }

  $: if (link?.border?.fillStyle === 'border-image') {
    borderImageForm = true;
  } else {
    borderImageForm = false;
  }

  // save theme
  let chosenTheme = '';

  async function saveTheme() {
    console.log('saving theme: ', chosenTheme);
    const userRef = doc(db, `users/${$user!.uid}`);

    const docSnapshot = await getDoc(userRef);
    const userData = docSnapshot.data();
    let userThemes = userData?.userThemes || [];


    const batch = writeBatch(db);
    batch.set(doc(db, `users/${$user!.uid}`), {
      theme: chosenTheme
    }, { merge: true });

    for (const theme of userThemes) {
      if (chosenTheme === theme.name) {
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: theme
        }, { merge: true });
      }
    }

    for (const theme of themes) {
      if (chosenTheme === theme) {
        setDataTheme(theme);
      }
    }


    await batch.commit();
    chosenTheme = '';
  }

  async function setDataTheme(theme: string) {
    console.log('setting the data theme to ', theme);
    const batch = writeBatch(db);
    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        background: {
          gradient: {
            from: {hex: '', opacity: 100},
            to: {hex: '', opacity: 100}
          },
          hex: '',
        },
        link: {
          fill: {
            gradient: {
              from: {hex: '', opacity: 100},
              to: {hex: '', opacity: 100},
            },
            hex: '',
          },
          border: {
            gradient: {
              from: {hex: '', opacity: 100},
              to: {hex: '', opacity: 100},
            },
            hex: '',
          },
          shadow: {
            gradient: {
              from: {hex: '', opacity: 100},
              to: {hex: '', opacity: 100},
            },
          },
          title: {
            effect: {
              hex: '',
            },
            font: {
              hex: '',
            }
          },
        },
        font: {
          hex: '',
        },
      }
    }, { merge: true });

    await batch.commit();
  }

  const handleThemeSelect = (selectedTheme: string) => {
    chosenTheme = selectedTheme;
    saveTheme();
    setTheme(selectedTheme);
  }
  
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
    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        link: { 
          title: {
            effect: {
              effect: effect
            }
          }
        }
      }
    } , { merge: true });

    await batch.commit();
  }

  let fontDropdown = false;

  function toggleFontDropdown() {
    fontDropdown = !fontDropdown;
  };

  let showColorPicker = false;
  let showGradientPicker = false;
  let showButtonColorPicker = false;
  let showFontColorPicker = false;

  // solid
  let backgroundColorSelect: boolean = false;
  // gradient
  let backgroundGradientSelect: boolean = false;
  
  function toggleShowColorPicker() {
    if (showGradientPicker) {
      showGradientPicker = false;
    }
    showColorPicker = !showColorPicker;
  }

  // handles 'solid' and 'gradient' background styles

  // color selection
  function toggleShowBackgroundColorSelect() {backgroundColorSelect = !backgroundColorSelect;}

  // gradient selection
  // function toggleShowBackgroundGradientSelect() {backgroundGradientSelect = !backgroundGradientSelect;}

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
    "methyleneBlue",
    "coffee",
    "luxury",
    "garden",
    "retro",
    "business",
    "autumn",
    "emerald",
    "cmyk",
    "dracula",
    "halloween",
    "fantasy",
    "wireframe",
    "cupcake",
    "bumblebee",
    "corporate",
    "synthwave",
    "valentine",
    "lofi",
    "winter",
    "pastel",
    "black",
    "aqua",
    "night",
    "acid",
    "forest",
    "cyberpunk",
    "lemonade",
    "red",
  ];

  // img upload
  let files: FileList;
  let backgroundImageForm = false;
  let linkImageForm = false;
  let borderImageForm = false; 

  let previewURL: string;
  let uploading: boolean = false;
  let uploadSuccess: boolean = false;

  let saving: boolean = false;
  let saveSuccess: boolean = false;

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
  async function updateColor(mode: string, hex: string, opacity: number) {
    const batch = writeBatch(db);
    saving = true;
    switch (mode) {
      case 'background':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              hex: hex
            }
          }
        }, { merge: true });

        break;

      
      case 'link fill':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              fill: {
                hex: hex
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
                hex: hex
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
                hex: hex
              }
            }
          }
        }, { merge: true });

        break;
      
      case 'link title':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              title: {
                hex: hex
              }
            }
          }
        }, { merge: true });

        break;
      
      case 'font':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            font: {
              hex: hex
            }
          }
        }, { merge: true });

        break;

      
      case 'background gradient from':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              gradient: {
                from: {hex: hex, opacity: opacity},
              }
            }
          }
        }, { merge: true });
        break;
      case 'background gradient to':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              gradient: {
                to: {hex: hex, opacity: opacity},
              }
            }
          }
        }, { merge: true });
        break;
      case 'link gradient from':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              fill: {
                gradient: {
                  from: {hex: hex, opacity: opacity}
                }
              }
            }
          }
        }, { merge: true });
        break;
      case 'link gradient to':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              fill: {
                gradient: {
                  to: {hex: hex, opacity: opacity}
                }
              }
            }
          }
        }, { merge: true });
        break;
      case 'border gradient from':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              border: {
                gradient: {
                  from: {hex: hex, opacity: opacity}
                }
              }
            }
          }
        }, { merge: true });
        break;
      case 'border gradient to':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              border: {
                gradient: {
                  to: {hex: hex, opacity: opacity}
                }
              }
            }
          }
        }, { merge: true });
        break;
      case 'shadow gradient from':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              shadow: {
                gradient: {
                  from: {hex: hex, opacity: opacity}
                }
              }
            }
          }
        }, { merge: true });
        break;
      case 'shadow gradient to':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              shadow: {
                gradient: {
                  to: {hex: hex, opacity: opacity}
                }
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

  async function updateOpacity(mode: string, opacity: number) {
    const batch = writeBatch(db);
    saving = true;
    switch (mode) {
      case 'background': 
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              opacity: opacity
            }
          }
        }, { merge: true });
        break;
      case 'font': 
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            font: {
              opacity: opacity
            }
          }
        }, { merge: true });
        break;
      case 'link title':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            link: {
              title: {
                opacity: opacity
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
                opacity: opacity
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
                opacity: opacity
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
                opacity: opacity
              }
            }
          }
        }, { merge: true });
        break;
      case 'background gradient from':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              gradient: {
                from: {
                  opacity: opacity
                }
              }
            }
          }
        }, { merge: true });
        break;
      case 'background gradient to':
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: {
            background: {
              gradient: {
                to: {
                  opacity: opacity
                }
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


// text effects
  let glow = 'glow';
  let glowHover = 'glowHover';
  let highlight = 'highlight';
  let highlightHover = 'highlightHover';
  let gradient = 'gradient';
  let gradientHover = 'gradientHover';

  let showOptions = false;

</script>

<AuthCheck>

<div class="fixed right-0 w-[40%] transform transition-all duration-1000 ease-in-out">

  <LivePreview 
    username={username} 
    photoURL={photoURL} 
    bio={bio} links={links} 
    theme={theme} 
    customTheme={customTheme}
  />
</div>

  <!-- optional bg style -->
  <!-- style="background-image: url('/minecraft.gif'); background-repeat: no-repeat; background-size: 100% 100%; background-attachment: fixed;"  -->
<!-- main html -->
<main 
  data-theme="{theme}" 
  class="flex flex-col bg-secondary-content">

  <!-- logo -->
  <h1 id="custom" class="px-2 z-10 font-blix text-accent text-[2rem] ">Magic<span class="font-oblique">Hat</span> 🎩🪄</h1>

  <!-- hidden fonts -->
  <div>
    <h1 id="custom" class="hidden px-2 z-10 font-spooky text-[2rem] ">Magic<span class="font-lithotype">Hat</span> 🎩🪄</h1>
    <h1 id="custom" class="hidden px-2 z-10 font-fit text-[2rem] ">Magic<span class="font-fit -tracking-[1em]">Hat</span> 🎩🪄</h1>
    <p class="font-balboa hidden">hehe</p>
    <p class="font-balboa-black hidden">hehe</p>
    <p class="font-haunted hidden">hehe</p>
    <p class="font-herb-bold hidden">hehe</p>
    <p class="font-herb-condensed hidden">hehe</p>
    <p class="font-herb-condensed-bold hidden">hehe</p>
    <p class="font-playwright hidden">hehe</p>
    <p class="font-tech hidden">hehe</p>
    <p class="font-ink hidden">hehe</p>
    <p class="font-tech-thin hidden">hehe</p>
    <p class="font-gerald hidden">hehe</p>
    <p class="font-gerald-italic hidden">hehe</p>
    <p class="font-gerald-black hidden">hehe</p>
    <p class="font-gerald-black-italic hidden">hehe</p>
    <p class="font-gerald-thin hidden">hehe</p>
    <p class="font-gerald-thin-italic hidden">hehe</p>
    <p class="font-mono hidden">hehe</p>
    <p class="font-typewriter hidden">hehe</p>
    <p class="font-totally-gothic hidden">hehe</p>
  </div>

  <div id="top" class="flex flex-col my-8 mt-14 p-4 md:max-w-[60%]">

    <!-- themes -->
    <div class="content-section">
    <h2 class="content-section-heading">Themes</h2>
      <div class="mx-auto grid-themes">
        <!-- custom -->
        <div class="">
          <a href="#custom" class="btn bg-opacity-50 hover:bg-opacity-70 rounded-none bg-primary border-dashed border-2 border-black w-[150px] h-[225px] sm:w-[100px] sm:h-[150px] md:w-[125px] md:h-[188px] flex flex-col justify-start py-4">
            <p class="font-blix max-w-[100px] text-[1rem] leading-normal m-auto"><span class="">Create </span><span class="font-herb">Custom </span><span class="">Theme </span></p>
          </a>
          <h3 class="text-white text-[1.25rem] tracking-[-0.075em] font-change-italic bg-opacity-0 text-center text-md mb-4 mt-2">Custom</h3>
        </div>

        <!-- user made themes -->
        {#each userThemes as userTheme, index}
        
          <button 
            on:mouseenter={() => customThemeHover[index] = true}
            on:mouseleave={() => customThemeHover[index] = false}
            on:click|preventDefault={() => handleThemeSelect(userTheme.name)} 
            class:glow={customThemeHover[index] || userTheme.name === $userData?.theme}
            class="">
            <button 
              class:active-theme={userTheme.name === $userData?.theme}
              data-theme={$userData?.theme}
              class="btn option-card">
                <div class={`font-${userTheme.font? userTheme.font?.family : ''} flex flex-col items-center font`}>
                  <!-- pfp -->
                  <img class="w-[33px] h-[33px]"  src="{photoURL}" alt="pfp">
                  <!-- Username -->
                  <p class="text-[0.5rem]">@{username}</p>
                  <!-- bio -->
                  <p class="text-[0.33rem]">{bio}</p>
                </div>
                <!-- links -->
                <div class={`w-full h-2`}></div>
                <div class={`bg-${userTheme.link? userTheme.link.fill.hex : ''} w-full h-4`}></div>
                <div class={`bg-${userTheme.link? userTheme.link.fill.hex : ''} w-full h-4`}></div>
            </button>
            <h3 class="text-white text-[1.25rem] tracking-[-0.075em] font-change-italic my-2 text-center capitalize-first">{userTheme.name}</h3>
          </button> 
        {/each}

        <!-- prebuilt Themes -->
        {#each themes as theme, index}
          <button  
            on:mouseenter={() => themeHover[index] = true}
            on:mouseleave={() => themeHover[index] = false}
            on:click|preventDefault={() => handleThemeSelect(theme)} 
            class:glow={themeHover[index] || theme === $userData?.theme}
            class="">
            <button 
              class="btn border-none bg-primary w-[150px] h-[225px] sm:w-[100px] sm:h-[150px] md:w-[125px] md:h-[188px] flex flex-col justify-start py-4"
              class:active-theme={theme === $userData?.theme}
              data-theme={theme}>
                <div class="flex flex-col items-center">
                  <!-- pfp -->
                  <img class="w-[33px] h-[33px]"  src="{$userData?.photoURL}" alt="pfp">
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
            <h3 class="option-title text-white text-[1.25rem] tracking-[-0.075em] font-change-italic my-2 text-center bg-opacity-0 capitalize-first" data-theme={theme}>{theme}</h3>
          </button>
        {/each}
      </div>
    </div>

  <div class="my-4">

  </div>

    <div class="content-section">
      <h2 class="content-section-heading">Header</h2>
      <ImageUpload currentImage={headerImage} mode={'header'}/>
    </div>
    
    <!-- backgrounds -->

    <!-- backgrounds container -->
    <div class="content-section">
      <h2 class="content-section-heading">Background</h2>
      
      <!-- bg styles -->
      <div class="flex space-x-2">
        <!-- solid color -->
        <div>
          <button 
            on:click={() => setStyle('background', 'background-solid')} 
            class="filter grayscale hover:grayscale-0 w-[120px] h-[150px] bg-accent transition transform duration-300 ease-in-out rounded-lg flex"></button>
          <h3 class="option-title">Solid Color</h3>
        </div>
      <!-- gradient -->
      <div>
        <button 
          on:click={() => setStyle('background', 'background-gradient')}
          class="w-[120px] h-[150px] btn bg-gradient-to-b from-accent to-primary hover:bg-gradient-to-tl transform transition-colors duration-1000 ease-in-out border-none flex flex-col justify-start py-4"></button>
        <h3 class="option-title">Gradient</h3>
      </div>
    


      <button>
        <button 
          on:click={() => setStyle('background', 'background-image')}
          class="w-[120px] h-[150px] filter grayscale hover:grayscale-0 border-none flex flex-col justify-start">
          <img src="{$userData?.photoURL}" alt="pfp" class="h-[100%] btn p-0">
        </button>
        <h3 class="option-title">Image</h3>
      </button>
      <button>
        <button 
          on:click={() => setStyle('background', 'background-gif')}
          class="w-[120px] h-[150px] filter grayscale hover:grayscale-0 border-none flex flex-col justify-start">
          <img src="/minecraft.gif" alt="pfp" class="h-[100%] btn p-0">
        </button>
        <h3 class="option-title">Gif</h3>
      </button>

    </div>
    {#if backgroundColorSelect}
      <ColorInput mode={'background'} currentHex={currentBackgroundHex} />
    {/if}
    {#if backgroundGradientSelect}
      <ColorInput mode={'background'} isGradient={true} currentGradient={currentBackgroundGradient}/>
    {/if}
    {#if backgroundImageForm}
      <ImageUpload currentImage={backgroundImage} mode={'background'}/>
    {/if}

    <!-- end bg image upload here -->
  </div>


    <!-- links -->
      <!-- main container -->
      <div class="content-section">
        <h2 class="content-section-heading">Links</h2>

        <!-- Fill controls -->
        <div class="flex flex-col flex-wrap justify-between ">
          <!-- Label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={fill} on:change={() => updateVisibility('fill', !fill)} />
            <h3 class="font-mono text-white text-[1.5rem]">Fill</h3>
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
                <span class="label-text font-mono">Style</span>
              </label>
              <div id="Fill Style">
                <!-- styles -->
                <div class="flex space-x-4 font-mono font-black text-sm -tracking-widest">
                  <!-- solid -->
                  <button 
                    on:click={() => setStyle('fill', 'link-solid')}
                    class:grayscale-0={link?.fill?.style === 'link-solid'}
                    class="filter grayscale hover:grayscale-0 hover:border-4 border-[0.1rem] border-accent p-2 btn rounded-md btn-primary w-1/5 transform transition duration-300 ease-in-out">solid</button>
                  <!-- gradient -->
                  <button 
                    on:click={() => setStyle('fill', 'link-gradient')}
                    class:grayscale-0={link?.fill?.style === 'link-gradient' || link?.fill?.style === 'radial gradient'}
                    class="filter grayscale hover:grayscale-0 p-2 btn rounded-md btn-accent bg-gradient-to-tr from-accent via-secondary to-primary hover:border-4 w-1/5">gradient</button>
                  <!-- image -->
                  <button 
                    on:click={() => setStyle('fill', 'link-image')}
                    class:grayscale-0={link?.fill?.style === 'link-image'}
                    class="filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/icons/trash.jpeg')] bg-cover bg-top text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">image</button>
                  <!-- custom fill -->
                  <button 
                    on:click={() => setStyle('fill', 'link-gif')}
                    class:grayscale-0={link?.fill?.style === 'link-gif'}
                    class="filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/minecraft.gif')] bg-cover bg-bottom text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">gif</button>
                </div>
              </div>
            </div>

            <!-- solid color selection -->
            {#if solidLinkFill}
              <ColorInput mode={'link fill'} currentHex={currentLinkHex} />
            {/if}
            {#if gradientLinkFill}
            <ColorInput mode={'link fill'} isGradient={true} currentGradient={currentLinkGradient}/>
            {/if}

          </div>
          {/if}
          {#if linkImageForm}
          <div class="">
            <ImageUpload mode={'link'} currentImage={linkImage} />
          </div>
          {/if}
        </div>

        <!-- border controls -->
        <div class="flex flex-wrap flex-col justify-between">
          <!-- label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={border} on:change={() => updateVisibility('border', !border)} />
            <h3 class="font-mono text-white text-[1.5rem]">Border</h3>
          </div>
          
          {#if border}
          <div 
            in:slide={{duration: 500, easing: cubicInOut}}
            out:slide={{duration: 500, easing: cubicInOut}}
            class="py-4">

            
            
            <!-- fill styles -->
            <div>

              <div 
                in:fly={{y: -20, duration: 400, easing: backOut, delay: 200}}
                out:blur
                class="mt-2 mb-6">
                <label for="Fill Style" class="label">
                  <span class="label-text font-mono">Style</span>
                </label>
                <div id="Fill Style">
                  <!-- styles -->
                  <div class="flex space-x-4 font-mono font-black text-sm -tracking-widest">
                    <!-- solid -->
                    <button 
                      on:click={() => setBorderFillStyle('border-solid')}
                      class:grayscale-0={link?.border?.fillStyle === 'border-solid'}
                      class="filter grayscale hover:grayscale-0 hover:border-4 border-[0.1rem] border-accent p-2 btn rounded-md btn-primary w-1/5 transform transition duration-300 ease-in-out">solid</button>
                    <!-- gradient -->
                    <button 
                      on:click={() => setBorderFillStyle('border-gradient')}
                      class:grayscale-0={link?.border?.fillStyle === 'border-gradient' || link?.fill?.style === 'border-radial-gradient'}
                      class="filter grayscale hover:grayscale-0 p-2 btn rounded-md btn-accent bg-gradient-to-tr from-accent via-secondary to-primary hover:border-4 w-1/5">gradient</button>
                    <!-- image -->
                    <button 
                      on:click={() => setBorderFillStyle('border-image')}
                      class:grayscale-0={link?.border?.fillStyle === 'border-image'}
                      class="filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/icons/trash.jpeg')] bg-cover bg-top text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">image</button>
                    <!-- custom fill -->
                    <button 
                      on:click={() => setBorderFillStyle('border-gif')}
                      class:grayscale-0={link?.border?.fillStyle === 'border-gif'}
                      class="filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/minecraft.gif')] bg-cover bg-bottom text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">gif</button>
                    <!-- <button 
                      on:click={() => setBorderFillStyle('hover-2')}
                      class:grayscale-0={link?.border?.fillStyle === 'hover-2'}
                      class="hover-2 filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/minecraft.gif')] bg-cover bg-bottom text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">hover</button> -->
                  </div>
              </div>
            </div>
            
            <!-- border size -->
            <div>
              <label for="size input" class="label">
                <span class="label-text font-mono">Size</span>
              </label>
              <div id="size input" class="join font-mono">
                <input on:change={() => setBorderWidth(sizeNumber, unit)} type="number" placeholder="4" class="input w-28" bind:value={sizeNumber}>
                <div class="dropdown dropdown-hover">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label tabindex="-1" class="btn">{unit}</label>
                  <ul tabindex="-1" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-[1rem]">
                    <button 
                      on:click={() => {unit = 'px'; setBorderWidth(sizeNumber, unit)}} 
                      on:keydown={(e) => { if (e.key === 'Enter' || e.key === 'Space') {unit = 'px'; setBorderWidth(sizeNumber, unit)}; }}
                      tabindex="0">px</button>

                    <button 
                      on:click={() => {unit = 'rem'; setBorderWidth(sizeNumber, unit)}} 
                      on:keydown={(e) => { if (e.key === 'Enter' || e.key === 'Space') {unit = 'rem'; setBorderWidth(sizeNumber, unit)}; }}
                      tabindex="0">rem</button>
                
                    <button 
                      on:click={() => {unit = 'em'; setBorderWidth(sizeNumber, unit)}} 
                      on:keydown={(e) => { if (e.key === 'Enter' || e.key === 'Space') {unit = 'em'; setBorderWidth(sizeNumber, unit)}; }}
                      tabindex="0">em</button>
                
                  </ul>
                </div>
              </div>
            </div>

            <!-- border style -->
            {#if solidLinkBorder}
            <div 
              in:slide={{duration: 1000, easing: cubicInOut}}
              out:slide={{duration: 1000, easing: cubicInOut}}
              class="mt-2 mb-6">
              <label for="Border Style" class="label">
                <span class="label-text font-mono">Style</span>
              </label>
              <div id="Border Style">
                <!-- styles -->
                <div class="flex flex-wrap font-mono">
                  <!-- solid -->
                  <button 
                    on:click={() => setStyle('border', 'solid')}
                    style="border: 4px solid"
                    class:bg-info={link?.border?.style === 'solid'}
                    class="p-2 hover:bg-info rounded-md w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">solid</button>
                  <!-- dashed -->
                  <button 
                    on:click={() => setStyle('border', 'dashed')}
                    style="border: 4px dashed"
                    class:bg-info={link?.border?.style === 'dashed'}
                    class="p-2 hover:bg-info rounded-md w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">dashed</button>
                  <!-- double -->
                  <button 
                    on:click={() => setStyle('border', 'double')}
                    style="border: 4px double"
                    class:bg-info={link?.border?.style === 'double'}
                    class="p-2 hover:bg-info rounded-md w-1/5 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">double</button>
                  <!-- groove -->
                  <button 
                    on:click={() => setStyle('border', 'groove')}
                    style="border: 4px groove"
                    class:bg-info={link?.border?.style === 'groove'}
                    class="p-2 hover:bg-info rounded-md w-1/5 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">groove</button>
                  <!-- ridge -->
                  <button 
                    on:click={() => setStyle('border', 'ridge')}
                    style="border: 4px ridge"
                    class:bg-info={link?.border?.style === 'ridge'}
                    class="p-2 hover:bg-info rounded-md w-1/5 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">ridge</button>
                  <button 
                    on:click={() => setStyle('border', 'inset')}
                    style="border: 4px inset"
                    class:bg-info={link?.border?.style === 'inset'}
                    class="p-2 hover:bg-info rounded-md w-1/5 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">inset</button>
                  <button 
                    on:click={() => setStyle('border', 'outset')}
                    style="border: 4px outset"
                    class:bg-info={link?.border?.style === 'outset'}
                    class="p-2 hover:bg-info rounded-md w-1/5 transform transition duration-300 ease-in-out font-black text-sm -tracking-widest">outset</button>
                </div>
              </div>

              <ColorInput mode={'link border'} currentHex={currentBorderHex} />

            </div>
            {/if}

            {#if gradientLinkBorder}
            <div 
              in:slide={{duration: 1000, easing: cubicInOut}}
              out:slide={{duration: 1000, easing: cubicInOut}}
              class="py-4">
              <ColorInput mode={'link border'} isGradient={true} currentGradient={currentBorderGradient}/>
            </div>
            {/if}

            {#if borderImageForm}
              <ImageUpload mode={'border'} currentImage={borderImage} />
            {/if}
            

          </div>



            
          </div>
          {/if}

        </div>

        <!-- shadow controls -->
        <div class="flex flex-wrap flex-col justify-between">
          <!-- label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={shadow} on:change={() => updateVisibility('shadow', !shadow)} />
            <h3 class="font-mono text-white text-[1.5rem]">Shadow</h3>
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
                <span class="label-text font-mono">Style</span>
              </label>
              <div id="Shadow Style">
                <!-- styles -->
                <div class="flex space-x-4 font-mono">
                  <!-- soft shadow -->
                  <button 
                    on:click={() => setStyle('shadow', 'soft-shadow')}
                    class="btn soft-shadow p-2 rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">soft shadow</button>
                  <!-- hard shadow -->
                  <button 
                    on:click={() => setStyle('shadow', 'hard-shadow')}
                    class="hard-shadow p-2 btn rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">hard shadow</button>
                  <!-- smooth steel shadow -->
                  <button 
                    on:click={() => setStyle('shadow', 'smooth-steel')}
                    class="smooth-steel p-2 btn rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">smooth steel</button>
                  <button
                    on:click={() => setStyle('shadow', 'croc')}
                    class="croc p-2 btn rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">croc</button>
                </div>
              </div>
            </div>

            <ColorInput mode={'link shadow'} currentHex={currentShadowHex} />
            
          </div>
          {/if}

        </div> 

        <!-- title controls -->
        <div class="flex flex-wrap flex-col justify-between">
          <!-- label -->
          <div class="flex space-x-6 items-center mt-8">
            <h3 class="font-mono text-white text-[1.5rem]">Link Title</h3>
          </div>
          <!-- style + color picker div -->
          <div 
            in:slide={{duration: 300, easing: cubicInOut}}
            out:slide>

            <!-- color selection -->
            <ColorInput mode={'link title'} currentHex={currentLinkTitleHex} />

            <!-- style/texteffects div -->
            <div 
              in:fly={{y: -20, duration: 400, easing: backOut, delay: 200}}
              out:blur
              class="mt-2 mb-6">
              
              <div class="flex flex-col space-x-6 items-start mb-2">
                <label for="Text Effect" class="label">
                  <span class="label-text font-mono">Text Effect</span>
                </label>
              </div>
              <div id="Text Effect">
                <!-- styles -->
                <div class="flex space-x-4 font-mono">
                  <!-- glow -->
                  <button 
                  on:click|preventDefault={() => saveTextEffect('glow')} 
                  class="glow btn p-2 rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">Glow</button>
                  <!-- hard shadow -->
                  <button 
                    on:click={() => saveTextEffect('highlight')}
                    class="p-2 btn rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">Highlight</button>
                  <button 
                    on:click={() => saveTextEffect('tony')}
                    class="tony p-2 btn btn-outline rounded-md w-1/5 transform transition duration-300 ease-in-out font-black -tracking-widest">Tony</button>
                </div>
              </div>
            </div>

            
          </div>

        </div> 

      <!-- radius control -->
        <h3 class="font-mono text-white my-2 mt-6">Radius</h3>
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


        <div class="flex flex-wrap flex-col justify-between">
          <!-- label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={isLinkAnimationActive} />
            <h3 class="font-mono text-white text-[1.5rem]">First Link Animation</h3>
          </div>
        </div>
    </div>
  

      <!-- fonts -->
      <div class="content-section">
        <h2 class="content-section-heading">Font</h2>
        <h3 class="font-mono text-white text-xs mb-2">Font</h3>
        <button on:click|preventDefault={() => toggleFontDropdown()} class="btn w-full group border-neutral-200 shadow shadow-neutral-200 bg-white h-16 flex items-center justify-start space-x-2">
          <div class="bg-neutral-100 w-10 h-10 rounded-lg items-center justify-center flex">
            <p class="m-auto font-{font?.family} text-black text-[1rem]">Aa</p>
          </div>
          <p class="font-{font?.family} text-[1rem]">{font?.family}</p>
        </button>
      {#if fontDropdown}
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div id="fonts" class="">
          <Fonts />
        </div>
      {/if}
      <div class="">
        <ColorInput mode={'font'} currentHex={currentFontHex}/>
      </div>

        

        <!-- font size -->
        

      </div>
      
    <div>

    </div> 
      
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="content-section">
    <h2 class="content-section-heading">Save Custom Theme</h2>
    <label for="Custom Theme Name">Theme Name</label>
    <input type="text" bind:value={name} class="p-4 rounded-md" placeholder="Enter Theme Name">
    <button 
      on:click={() => saveCustomTheme(name, customTheme)}
      class="btn">Save Theme</button>
  </div> 

  <div class="content-section">
    <h2 class="content-section-heading">Milady</h2>
    <img src="/icons/custom.png" alt="custom" width="200">
  </div> 
  
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

<!-- saving message -->
<div class="fixed z-50 bottom-2 right-2">
  {#if saving}
    <div in:slide class="flex w-full bg-success-content p-1 px-2">
      <p class="text-lg text-success font-mono tracking-widest">saving</p>
    </div> 
  {/if}
  {#if saveSuccess}
    <button on:click={() => saveSuccess = false} in:slide class="flex w-full bg-success-content p-2 px-4">
      <p class="text-lg text-success font-mono tracking-widest">change saved</p>
    </button>  
  {/if}
</div>
</AuthCheck>

<style>
  

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
  background-image: url('/static/linkDefault.png'); /* Set your image URL here */
  opacity: 0.5;  /* Initial opacity set to 50% */
  z-index: -1;  /* Place it behind the content */
}

.my-theme:hover::before {
  opacity: 1;  /* Opacity set to 100% on hover */
}

.inline-input {
  background: none;
  border: none;
  outline: none;
  /* More styles here as needed */
}

.gradient-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: 
    linear-gradient(
      to right, 
      hsl(var(--p)),
      rgba(0, 0, 0, 0), 
      rgba(0, 0, 0, 0), 
      rgba(0, 0, 0, 0), 
      rgba(0, 0, 0, 0), 
      rgba(0, 0, 0, 0), 
      rgba(0, 0, 0, 0), 
      rgba(0, 0, 0, 0), 
      hsl(var(--p))
    );
  pointer-events: none; /* Ensures the gradient doesn't interfere with interactions */
  z-index: 2; /* Optional, if you have other positioned elements and need layering */
}

.grid-themes {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns on small screens */
    gap: 16px; /* Adjust this value to your preference */
}

@media screen and (min-width: 600px) { /* Tailwind's sm breakpoint */
    .grid-themes {
        grid-template-columns: repeat(3, 1fr); /* 3 columns on medium screens */
    }
}

@media screen and (min-width: 768px) { /* Tailwind's md breakpoint */
    .grid-themes {
        grid-template-columns: repeat(4, 1fr); /* 4 columns on large screens */
    }
}
  
  </style>


  