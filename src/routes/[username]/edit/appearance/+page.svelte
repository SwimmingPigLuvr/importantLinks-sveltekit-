<script lang="ts">
  import Fonts from "$lib/components/Fonts.svelte";
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import { db, user, userData, storage } from "$lib/firebase";
  import type { LinkData } from "$lib/firebase";
  import { setTheme, type CustomTheme, emptyTheme } from "$lib/theme";
  import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { backOut, cubicInOut } from "svelte/easing";
  import { slide, blur, fly } from "svelte/transition";
  import { updateTheme } from "$lib/themeStore";
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import ImageUpload from "$lib/components/ImageUpload.svelte";
  import ColorInput from "$lib/components/ColorInput.svelte";

  let sizeNumber: number = 4;
  let unit: string = 'px';

  let header: string;
  let background: {
    gradient: {
      from: {
        hex: string,
        opacity: number,
      },
      to: {
        hex: string,
        opacity: number,
      },
      direction: string
    };
    hex: string | undefined;
    image: {
      position: string,
      repeat: string,
      size: string,
      url: string,
    };
    opacity: number;
    style: string;
  };

  let link: {
    border: {
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      image: {
        url: string,
        repeat: "stretch" | "repeat" | "round" | "space",
      }
      isVisible: boolean,
      opacity: number;
      fillStyle: string;
      style: string;
      width: string;
    }
    fill: {
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
      image: {
        position: string,
        repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" | "round",
        size: "auto" | "contain" | "cover" | "100% 100%",
        url: string,
      };
    }
    radius: string;
    shadow: {
      direction: string;
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
    }
    title: {
      effect: {
        effect: string;
        hex: string;
        onHover: boolean;
      }
      font: {
        size: string;
        tracking: string;
        hex: string | undefined;
      }
      opacity: number;
    }
  };

  let font: {
    family: string;
    hex: string | undefined;
    opacity: number;
  };

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

  let solidLinkFill: boolean;
  let gradientLinkFill: boolean;
  let imageLinkFill: boolean;

  let solidLinkBorder: boolean;
  let gradientLinkBorder: boolean;
  let imageLinkBorder: boolean;

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

  $: if (link?.fill?.style === 'solid') {
    solidLinkFill = true;
  } else {
    solidLinkFill = false;
  }

  $: if (link?.fill?.style === 'gradient') {
    gradientLinkFill = true;
  } else {
    gradientLinkFill = false;
  }

  $: if (link?.fill?.style === 'image') {
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
        console.log('theme: ', theme);
        console.log('setting emptyTheme');
        batch.set(doc(db, `users/${$user!.uid}`), {
          customTheme: emptyTheme
        }, { merge: true });
      }
    }


    await batch.commit();
    chosenTheme = '';
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
    console.log('font drop down: ', fontDropdown);
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

      batch.set(doc(db, `users/${$user!.uid}`), {
        customTheme: {
          background: {
            image: {
              url: url
            },
            style: 'image',
          }
        }
      }, { merge: true });

      await batch.commit();

      uploadSuccess = true;
    } catch (error) {
      console.error('background upload error: something went wrong: ', error);
    } finally {
      uploading = false;
    }

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

<LivePreview 
  username={username} 
  photoURL={photoURL} 
  bio={bio} links={links} 
  theme={theme} 
  customTheme={customTheme}
/>

<!-- main html -->
<main data-theme="{theme}" class="flex flex-col">

  <h1 id="custom" class="font-input-mono text-[1.5rem] lg:text-[2.5rem] -tracking-widest">👁️‍🗨️🌴 Customize your profile.</h1>
  <div id="top" class="flex flex-col my-8  md:max-w-[62%]">
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
              data-theme={$userData?.theme}
              on:click|preventDefault={() => handleThemeSelect(userTheme.name)} 
              style={`color: ${userTheme.font?.hex}; ${userTheme.background?.style === 'image' ? `background-image: url(${userTheme.background?.image?.url}); background-size: ${userTheme.background.image.size}; background-repeat: ${userTheme.background.image.repeat}; background-position: ${userTheme.background.image.position};` : (userTheme.background?.style === 'solid' ? `background-color: ${userTheme.background?.hex}` : '')}`}
              class={`btn border-none min-w-[160px] min-h-[300px] max-w-[200px] {theme} flex flex-col justify-start py-4`}>
                <div class={`font-${userTheme.font? userTheme.font?.family : ''} flex flex-col items-center font`}>
                  <!-- pfp -->
                  <img class="w-[45px] h-[45px]"  src="{photoURL}" alt="pfp">
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

  </div>

    <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Header</h2>
    <div class="bg-secondary m-auto mx-6 mb-6 p-6 rounded-2xl">
      <ImageUpload currentImage={headerImage} mode={'header'}/>
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
            on:click={() => setStyle('background', 'background-solid')} 
            class="w-[120px] h-[200px] btn bg-accent border-none flex flex-col justify-start"></button>
          <h3 class="text-white font-input-mono text-center text-md mb-4 mt-2">Solid Color</h3>
        </div>
      <!-- gradient -->
      <div>
        <button 
          on:click={() => setStyle('background', 'background-gradient')}
          class="w-[120px] h-[200px] btn bg-gradient-to-b from-accent to-primary hover:bg-gradient-to-tl transform transition-colors duration-1000 ease-in-out border-none flex flex-col justify-start py-4"></button>
        <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Gradient</h3>
      </div>
    


      <div>
        <button 
          on:click={() => setStyle('background', 'background-image')}
          class="w-[120px] h-[200px] filter grayscale hover:grayscale-0 border-none flex flex-col justify-start">
          <img src="{$userData?.photoURL}" alt="pfp" class="h-[100%] btn p-0">
        </button>
        <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Image</h3>
      </div>

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
    <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Links</h2>
      <!-- main container -->
      <div class="bg-secondary m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl space-y-4">

        <!-- Fill controls -->
        <div class="flex flex-col flex-wrap justify-between ">
          <!-- Label / checkbox -->
          <div class="flex space-x-6 items-center ">
            <input type="checkbox" class="toggle" bind:checked={fill} on:change={() => updateVisibility('fill', !fill)} />
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
                    class:grayscale-0={link?.fill?.style === 'solid'}
                    class="filter grayscale hover:grayscale-0 hover:border-4 border-[0.1rem] border-accent p-2 btn rounded-md btn-primary w-1/5 transform transition duration-300 ease-in-out">solid</button>
                  <!-- gradient -->
                  <button 
                    on:click={() => setStyle('fill', 'gradient')}
                    class:grayscale-0={link?.fill?.style === 'gradient' || link?.fill?.style === 'radial gradient'}
                    class="filter grayscale hover:grayscale-0 p-2 btn rounded-md btn-accent bg-gradient-to-tr from-accent via-secondary to-primary hover:border-4 w-1/5">gradient</button>
                  <!-- image -->
                  <button 
                    on:click={() => setStyle('fill', 'image')}
                    class:grayscale-0={link?.fill?.style === 'image'}
                    class="filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/icons/trash.jpeg')] bg-cover bg-top text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">image</button>
                  <!-- custom fill -->
                  <button 
                    on:click={() => setStyle('fill', 'gif')}
                    class:grayscale-0={link?.fill?.style === 'gif'}
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
            <h3 class="font-input-mono text-white text-[1.5rem]">Border</h3>
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
                  <span class="label-text font-input-mono">Style</span>
                </label>
                <div id="Fill Style">
                  <!-- styles -->
                  <div class="flex space-x-4 font-input-mono font-black text-sm -tracking-widest">
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
                <span class="label-text font-input-mono">Size</span>
              </label>
              <div id="size input" class="join font-input-mono">
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
                <span class="label-text font-input-mono">Style</span>
              </label>
              <div id="Border Style">
                <!-- styles -->
                <div class="flex flex-wrap font-input-mono">
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
            <h3 class="font-input-mono text-white text-[1.5rem]">Link Title</h3>
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
                  <span class="label-text font-input-mono">Text Effect</span>
                </label>
              </div>
              <div id="Text Effect">
                <!-- styles -->
                <div class="flex space-x-4 font-input-mono">
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
      <div class="flex space-x-8 mt-4 bg-white">
        <ColorInput mode={'font'} currentHex={currentFontHex}/>
      </div>

        

        <!-- font size -->
        

      </div>
      
    <div>

    </div> 
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

  <h2 class="mx-2 p-2 font-input-mono text-[1.5rem] ">Milady</h2>
  <div class="bg-secondary space-y-4 font-input-mono m-auto mx-6 mb-6 p-6 flex flex-col rounded-2xl">
    <img src="/icons/custom.png" alt="custom" width="200">
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
      <p class="text-lg text-success font-input-mono tracking-widest">saving</p>
    </div> 
  {/if}
  {#if saveSuccess}
    <button on:click={() => saveSuccess = false} in:slide class="flex w-full bg-success-content p-2 px-4">
      <p class="text-lg text-success font-input-mono tracking-widest">change saved</p>
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
  background-image: url('linkDefault.png'); /* Set your image URL here */
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



  
  </style>


  