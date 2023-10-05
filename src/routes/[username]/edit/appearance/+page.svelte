<script lang="ts">
  import ColorPicker from "$lib/components/ColorPicker.svelte";
  import Fonts from "$lib/components/Fonts.svelte";
  import LivePreview from "$lib/components/LivePreview.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData, storage, userTheme } from "$lib/firebase";
  import { setTheme, type CustomTheme, defaultTheme, emptyTheme, type GradientValue } from "$lib/theme";
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
  import Saving from "$lib/components/Saving.svelte";


  let openPosition: boolean;
  let openSize: boolean;
  let openRepeat: boolean;
  let customSize: string;

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
      repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" | "round",
      size: "auto" | "contain" | "cover",
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
        size: "auto" | "contain" | "cover",
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

  async function setBackgroundPosition(position: string) {
    const batch = writeBatch(db);
    saving = true;

    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        background: {
          image: {
            position: position
          }
        }
      }
    }, { merge: true });
    
    await batch.commit();
    saveSuccess = true;
    saving = false;
  }

  async function setBackgroundSize(size: string) {
    const batch = writeBatch(db);
    saving = true;

    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        background: {
          image: {
            size: size
          }
        }
      }
    }, { merge: true });
    
    await batch.commit();
    saveSuccess = true;
    saving = false;
  }

  async function setBackgroundRepeat(repeat: string) {
    const batch = writeBatch(db);
    saving = true;
    batch.set(doc(db, `users/${$user!.uid}`), {
      customTheme: {
        background: {
          image: {
            repeat: repeat
          }
        }
      }
    }, { merge: true });
    
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
  }


  let fill: boolean;
  let border: boolean;
  let shadow: boolean;

  let solidLinkFill: boolean;
  let gradientLinkFill: boolean;
  let imageLinkFill: boolean;

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
  let fromHex: string | undefined = '#A0A0A0FF';
  let toHex: string | undefined = '#4A4A4AFF';

  let showBackUp: boolean = false;

  let showRemoveBackground: boolean = false;
  let showRemoveFromColor: boolean = false;
  let showRemoveToColor: boolean = false;
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

  let backgroundDirection;
  let backgroundFromHex;
  let backgroundToHex;
  let backgroundFromOpacity;
  let backgroundToOpacity;

  $: if (background?.style === 'gradient' || background?.style === 'radial gradient') {
    backgroundDirection = background?.gradient?.direction;
    backgroundFromHex = background?.gradient?.from?.hex;
    backgroundToHex = background?.gradient?.to?.hex;
    backgroundFromOpacity = background?.gradient?.from?.opacity;
    backgroundToOpacity = background?.gradient?.to?.opacity;
    backgroundGradientSelect = true;
  } else {
    backgroundGradientSelect = false;
  }

  $: if (background?.style === 'solid') {
    backgroundColorSelect = true;
  } else {
    backgroundColorSelect = false;
  }

  $: if (background?.style === 'image') {
    backgroundImageForm = true;
  } else {
    backgroundImageForm = false;
  }

  $: if (link?.fill?.isVisible) {
    fill = true
  } else {
    fill = false
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
    "business",
    "cmyk",
    "dracula",
    "fantasy",
    "wireframe",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "valentine",
    "halloween",
    "lofi",
    "winter",
    "autumn",
    "pastel",
    "retro",
    "garden",
    "black",
    "luxury",
    "aqua",
    "night",
    "coffee",
    "acid",
    "forest",
    "cyberpunk",
    "lemonade",
    "red",
    "methyleneBlue"
  ];

  let allThemes = userThemes.concat(themes);

  // img upload
  let files: FileList;
  let backgroundImageForm = false;

  function toggleBackgroundImageForm() {
    showBackgroundImageForm = !showBackgroundImageForm;
  }
  
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

<!-- <Saving 
  saving={saving}
  saveSuccess={saveSuccess}
/> -->

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

<LivePreview 
  username={username} 
  photoURL={photoURL} 
  bio={bio} links={links} 
  theme={theme} 
  customTheme={customTheme}
/>

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
              on:click|preventDefault={() => handleThemeSelect(userTheme.name)} 
              style={`color: ${fontColorHex}; ${userTheme?.background?.style === 'image' ? `background-image: url(${userTheme?.background?.value}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;` : (userTheme?.background?.style === 'solid' ? `background-color: ${userTheme?.background?.hex}` : '')}`}
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
            on:click={() => setStyle('background', 'solid')} 
            class="btn bg-warning-content border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4"></button>
          <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Solid Color</h3>
        </div>
      <!-- gradient -->
      <div>
        <button 
          on:click={() => setStyle('background', 'gradient')}
          class="group btn bg-gradient-to-br from-green-400 to-blue-500 hover:bg-gradient-to-tl transform transition-colors duration-1000 ease-in-out border-none min-w-[150px] min-h-[300px] max-w-[200px] flex flex-col justify-start py-4 gradient-transition"><span class="font-noka text-warning-content text-[0.6rem]">UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION UNDER CONSTRUCTION</span><div class="overlay btn w-[100%] h-[100%]"></div></button>
        <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Gradient</h3>
      </div>
    


    <div>
      <button 
        on:click={() => setStyle('background', 'image')}
        class="filter grayscale hover:grayscale-0 btn border-none w-[150px] min-h-[300px] flex flex-col justify-start py-4">
        <img src="{$userData?.photoURL}" alt="pfp" class="w-[100%] h-[100%]">
      </button>
      <h3 class="text-white font-input-mono bg-opacity-0 text-center text-md mb-4 mt-2">Upload Image</h3>
    </div>

    </div>

<!-- solid background color picker -->

    {#if backgroundColorSelect}
    <div 
      in:slide={{ duration: 1000, easing: cubicInOut }}
      out:slide={{ duration: 1000, easing: cubicInOut }}
      class="flex justify-start space-x-10 mt-8 ">

      <!-- background color -->
      <div>
        <label for="Background Color" class="label">
          <span class="label-text font-input-mono">Background Color</span>
        </label>      
        <div id="Background Color" class="flex flex-col">

            <!-- show buttoncolor / clikc for color picker -->
            <div class="flex relative">
              <input 
                type="color" 
                id="colorInput"
                style="width: 3.1rem; height: 3rem; border: 1px ridge {background?.hex};" 
                bind:value={background.hex} 
                on:change={() => updateColor('background', background.hex, background.opacity)}
                class="relative"
              >
              <input 
                type="text" 
                placeholder="#12345" 
                bind:value={background.hex} 
                on:change={() => updateColor('background', background.hex, background.opacity)} 
                class="input text-center w-[13rem]">
              {#if background?.hex !== ''}
                <button
                  in:slide out:blur={{amount: 100}}
                  on:mouseenter={() => showRemoveBackground = true}
                  on:mouseleave={() => showRemoveBackground = false}
                  on:click={() => {updateColor('background', '', 100)}} 
                  class="absolute -top-1 -right-1 btn btn-xs font-input-mono">
                    ❌
                </button>
                {#if showRemoveBackground}
                  <p 
                    in:fade
                    out:fade
                    class="absolute -top-10 -right-1/3 p-2 px-4 text-xs bg-primary font-input-mono text-primary-content">remove custom color?</p>
                {/if}
              {/if}
            </div>
              
              

            

            
        </div>
      </div>
    </div>
    {/if}

<!-- gradient background color pickers -->

    {#if backgroundGradientSelect}
    <!-- entire gradient div -->

    <!-- radial? or linear? -->
    <div 
      in:slide={{ duration: 1000, easing: cubicInOut }}
      out:slide={{ duration: 1000, easing: cubicInOut }}
      class="flex-col flex space-y-4 my-4">
      <div class="flex space-x-4">
        <button class:bg-success={background?.style === 'gradient'} on:click={() => setStyle('background', 'gradient')} class="btn btn-outline">Linear</button>
        <button class:bg-success={background?.style === 'radial gradient'} on:click={() => setStyle('background', 'radial gradient')} class="btn btn-outline">Radial</button>
      </div>

      <!-- colors -->
      <div class="flex">
        <!-- from color -->
        <div class="flex justify-start space-x-4">
          
          <!-- from color -->
          <div>
            <label for="From" class="label">
              <span class="label-text font-input-mono text-[1rem]">From</span>
            </label>      
            <div id="From" class="flex flex-col">
              <div class="flex relative">
                <!-- from input -->
                <input 
                  type="color" 
                  id="colorInput"
                  style={`width: 3.1rem; height: 3rem; background-color: ${background?.gradient?.to?.hex ?? `hsl(var(--a))`};`}
                  bind:value={background.gradient.from.hex} 
                  on:mouseenter={() => {if (background?.gradient?.from?.hex !== '') {showRemoveBackground = true}}}
                  on:mouseleave={() => showRemoveBackground = false}
                  on:change={() => updateColor('background gradient from', background?.gradient?.from?.hex, background?.gradient?.from?.opacity)}
                  class="relative">
                <input 
                  type="text" 
                  placeholder="#12345" 
                  bind:value={background.gradient.from.hex} 
                  on:change={() => updateColor('background gradient from', background?.gradient?.from?.hex, background?.gradient?.from?.opacity)} 
                  class="input text-center w-1/2">
                  <!-- remove color to revert back to theme color -->
                {#if background?.gradient?.from?.hex !== ''}
                  <button
                    in:slide out:blur={{amount: 100}}
                    on:mouseenter={() => showRemoveFromColor = true}
                    on:mouseleave={() => showRemoveFromColor = false}
                    on:click={() => {updateColor('background gradient from', '', 100)}} 
                    class="absolute -top-1 right-[4.69rem] btn btn-xs font-input-mono">
                      ❌
                  </button>
                  {#if showRemoveFromColor}
                    <p 
                      in:fade
                      out:fade
                      class="absolute -top-10 -right-4 p-2 px-4 text-xs bg-primary font-input-mono text-primary-content">remove first color?</p>
                  {/if}
                {/if}
                </div>

              
            </div>
          </div>

          <!-- no opacities for backgrounds until further notice -->
          <!-- opacity -->
          <!-- <div class="form-control">
            <label for="opacity" class="label">
              <span class="label-text font-input-mono">Opacity</span>
            </label>
            <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity might cause background to reflect diffently in preview than it will on your site"`}>
            <label class="input-group">
                <input type="text" min="0" max="100" id="opacity" bind:value={background.gradient.from.opacity} on:change={() => updateOpacity('background', background?.gradient?.from?.opacity)} class="input input-bordered w-[4rem]" />
              <span>%</span>
            </label>
            </div>
          </div> -->

        </div>

        <!-- to color -->
        <div class="flex justify-start space-x-4">

          <!-- to color -->
          <div>
            <label for="to Color" class="label">
              <span class="label-text font-input-mono text-[1rem]">To</span>
            </label>      
            <div id="to Color" class="flex flex-col">
              <div class="flex relative">
                <!-- show buttoncolor / clikc for color picker -->
                <input 
                  type="color" 
                  id="colorInput"
                  style="width: 3.1rem; height: 3rem; border: 1px ridge {background?.gradient?.to?.hex ?? `hsl(var(--p))`};" 
                  bind:value={background.gradient.to.hex} 
                  on:mouseenter={() => {if (background?.gradient?.to?.hex !== '') {showRemoveBackground = true}}}
                  on:mouseleave={() => showRemoveBackground = false}
                  on:change={() => updateColor('background gradient to', background?.gradient?.to?.hex, background?.gradient?.to?.opacity)} 
                  class="relative">
                <input 
                  type="text" 
                  placeholder="#12345" 
                  bind:value={background.gradient.to.hex} 
                  on:change={() => updateColor('background gradient to', background?.gradient?.to?.hex, background?.gradient?.to?.opacity)} 
                  class="input text-center w-1/2">
                {#if background?.gradient?.to?.hex !== ''}
                  <button
                    in:slide out:blur={{amount: 100}}
                    on:mouseenter={() => showRemoveToColor = true}
                    on:mouseleave={() => showRemoveToColor = false}
                    on:click={() => {updateColor('background gradient to', '', '')}} 
                    class="absolute -top-1 right-[4.69rem] btn btn-xs font-input-mono">
                      ❌
                  </button>
                  {#if showRemoveToColor}
                    <p 
                      in:fade
                      out:fade
                      class="absolute -top-10 -right-4 p-2 px-4 text-xs bg-primary font-input-mono text-primary-content">remove second color?</p>
                  {/if}
                {/if}
              </div>
                
            </div>
          </div>

          <!-- opacity -->
          <!-- <div class="form-control">
            <label for="opacity" class="label">
              <span class="label-text font-input-mono">Opacity</span>
            </label>
            <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity will cause background to reflect diffently in preview than it will on your site"`}>

            <label class="input-group">
                <input type="text" min="0" max="100" id="opacity" bind:value={background.gradient.to.opacity} on:change={() => updateOpacity('background', background?.gradient?.to?.opacity)} class="input input-bordered w-[4rem]" />
              <span>%</span>
            </label>
            </div>
          </div> -->
        </div>
      </div>
      <!-- gradient direction -->
      <div class="flex flex-col justify-start">

        <!-- preview + selection container -->
        <div class="flex justify-start space-x-4">

          <!-- gradient preview -->
          <div 
            style={`background: linear-gradient(${backgroundDirection}, ${backgroundFromHex}, ${backgroundToHex});`}
            class="w-60 border-2 mt-10 border-primary rounded-xl max-w-md h-40 ">
          </div>
          <!-- gradient direction -->
          <div class="flex flex-col mt-4">
            <label for="Gradient Direction" class="label">
              <span class="label-text font-input-mono">Direction <span class="text-info">{backgroundDirection}°</span></span>
            </label>
          <div class="flex">

          <div id="Gradient Direction" class="flex flex-col text-white  join">
            <div class="join text-white flex justify-evenly">
              <button on:click={() => setGradientDirection('background', 315)} class="btn bg-opacity-0 text-5xl">↖</button>
              <button on:click={() => setGradientDirection('background', 0)} class="btn bg-opacity-0 text-5xl">↑</button>
              <button on:click={() => setGradientDirection('background', 4)} class="btn bg-opacity-0 text-5xl">↗</button>
            </div>
            <div class="join flex justify-evenly">
              <button on:click={() => setGradientDirection('background', 270)} class="btn bg-opacity-0 text-5xl">←</button>
              <button class="bg-opacity-0 text-5xl font-input-mono">☯︎</button>
              <button on:click={() => setGradientDirection('background', 90)} class="btn bg-opacity-0 text-5xl">→</button>
            </div>
            <div class="join flex justify-evenly">
              <button on:click={() => setGradientDirection('background', 215)} class="btn bg-opacity-0 text-5xl">↙</button>
              <button on:click={() => setGradientDirection('background', 180)} class="btn bg-opacity-0 text-5xl">↓</button>
              <button on:click={() => setGradientDirection('background', 135)} class="btn bg-opacity-0 text-5xl">↘</button>
            </div>
          </div>
          </div>

          
          </div>


        </div>


        <!-- input gradient values -->
        
        <div class="font-input-mono mt-4 bg-accent p-2 px-4">
          <p>
            from 
            <input 
              type="text" 
              class="text-info inline-input w-[5.75rem]" 
              bind:value={backgroundFromHex} 
            />, 
            to 
            <input type="text" class="text-info inline-input w-[5.75rem]" bind:value={backgroundToHex} />, 
            <input type="text" class="text-info inline-input w-[4rem]" bind:value={backgroundDirection} />
          </p>
        </div>
      </div>

    <!-- end of entire gradient div -->
    </div>
    {/if}



    <!-- background image upload -->
    {#if backgroundImageForm}
      <div 
        in:slide={{ duration: 1000, easing: cubicInOut }}
        out:slide={{ duration: 1000, easing: cubicInOut }}
        class="flex space-x-8 my-12 justify-start">
        <!-- image upload -->
        <div class="form-control lg:w-[256px] max-w-xs text-center">
            <img 
                src="{previewURL ?? $userData?.photoURL ?? "/sonic.jpeg"}" 
                alt="photoURL"
                width="231"
                height="231"
                class={`${uploading? 'filter grayscale' : 'grayscale-0'}`}
            />
            <label for="photoURL" class="label">
                <span class="label-text"></span>
            </label>
            <input
                on:change={uploadBackground}
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

        {#if background?.style === 'image'}
          <!-- image style options -->
          <div 
            in:slide={{duration: 2000, easing: cubicInOut}}
            class="flex flex-col text-accent font-input-mono text-[1rem] space-y-4 justify-start">

            <!-- background-position -->
            <div class="flex flex-col space-y-2 justify-start rounded-none ">
              <button class="font-input-mono text-white text-[1.5rem] text-left border-b-8 border-accent w-28 hover:w-36 transform transition-all duration-500 ease-[backOut]" on:click={() => {openPosition = !openPosition; openSize = false; openRepeat = false}}>Position</button>
              {#if openPosition}
                <div in:slide out:slide class=" flex-col space-y-2 justify-start ">
                  <div class="flex space-x-2 ">
                    <button class:bg-info={background?.image?.position === 'left top'} on:click={() => setBackgroundPosition('left top')} class="btn btn-outline text-[2rem]">↖</button>
                    <button class:bg-info={background?.image?.position === 'center top'} on:click={() => setBackgroundPosition('center top')} class="btn btn-outline text-[2rem]">↑</button>
                    <button class:bg-info={background?.image?.position === 'right top'} on:click={() => setBackgroundPosition('right top')} class="btn btn-outline text-[2rem]">↗</button>
                  </div>
                  <div class="flex space-x-2">
                    <button class:bg-info={background?.image?.position === 'left'} on:click={() => setBackgroundPosition('left')} class="btn btn-outline text-[2rem]">←</button>
                    <button class:bg-info={background?.image?.position === 'center'} on:click={() => setBackgroundPosition('center')} class="btn btn-outline text-[2rem]">☯︎</button>
                    <button class:bg-info={background?.image?.position === 'right'} on:click={() => setBackgroundPosition('right')} class="btn btn-outline text-[2rem]">→</button>
                  </div>
                  <div class="flex space-x-2">
                    <button class:bg-info={background?.image?.position === 'left bottom'} on:click={() => setBackgroundPosition('left bottom')} class="btn btn-outline text-[2rem]">↙</button>
                    <button class:bg-info={background?.image?.position === 'center bottom'} on:click={() => setBackgroundPosition('center bottom')} class="btn btn-outline text-[2rem]">↓</button>
                    <button class:bg-info={background?.image?.position === 'right bottom'} on:click={() => setBackgroundPosition('right bottom')} class="btn btn-outline text-[2rem]">↘</button>
                  </div>
                </div>
              {/if}
            </div>  

            <!-- background-size -->
            <div class="flex flex-col space-y-2 justify-start rounded-none ">
              <button class=" text-white text-[1.5rem] text-left border-b-8 border-accent w-12 hover:w-20 transform transition-all duration-500 ease-[backOut]" on:click={() => {openSize = !openSize; openPosition = false; openRepeat = false}}>Size</button>
              {#if openSize}
                <div in:slide out:slide class="flex flex-wrap gap-2">
                  <button class:bg-info={background?.image?.size === 'auto'} on:click={() => setBackgroundSize('auto')} class="btn btn-sm btn-outline">auto</button>
                  <button class:bg-info={background?.image?.size === 'cover'} on:click={() => setBackgroundSize('cover')} class="btn btn-sm btn-outline">cover</button>
                  <button class:bg-info={background?.image?.size === 'contain'} on:click={() => setBackgroundSize('contain')} class="btn btn-sm btn-outline">contain</button>
                  <button class:bg-info={background?.image?.size === '100% 100%'} on:click={() => setBackgroundSize('100% 100%')} class="btn btn-sm btn-outline">100% 100%</button>
                  <input 
                    type="text" 
                    bind:value={customSize} 
                    placeholder="custom" 
                    on:change={() => setBackgroundSize(customSize)} 
                    on:keypress={(e) => {if (e.key === 'Enter') setBackgroundSize(customSize);}}
                    class:bg-info={background?.image?.size === customSize}
                    class="input input-sm w-1/2"/>
                </div> 
              {/if}
            </div>

            <!-- background-repeat -->
            <div class="flex flex-col space-y-2 justify-start rounded-none ">
              <button class="font-input-mono text-white text-[1.5rem] text-left w-20 hover:w-32 border-b-8 border-accent hover:border-separate transform transition-all duration-500 ease-[backOut]" on:click={() => {openRepeat = !openRepeat; openSize = false; openPosition = false}}>Repeat</button>
              {#if openRepeat}
                <div in:slide out:slide class="flex flex-wrap gap-2">
                  <button class:bg-info={background?.image?.repeat === 'repeat'} on:click={() => setBackgroundRepeat('repeat')} class="btn btn-xs btn-outline">repeat</button>
                  <button class:bg-info={background?.image?.repeat === 'no-repeat'} on:click={() => setBackgroundRepeat('no-repeat')} class="btn btn-xs btn-outline">no-repeat</button>
                  <button class:bg-info={background?.image?.repeat === 'space'} on:click={() => setBackgroundRepeat('space')} class="btn btn-xs btn-outline">space</button>
                  <button class:bg-info={background?.image?.repeat === 'round'} on:click={() => setBackgroundRepeat('round')} class="btn btn-xs btn-outline">round</button>
                  <button class:bg-info={background?.image?.repeat === 'repeat-x'} on:click={() => setBackgroundRepeat('repeat-x')} class="btn btn-xs btn-outline">repeat-x</button>
                  <button class:bg-info={background?.image?.repeat === 'repeat-y'} on:click={() => setBackgroundRepeat('repeat-y')} class="btn btn-xs btn-outline">repeat-y</button>
                </div> 
              {/if}
            </div> 
          </div>
        {/if}

      </div>
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
                    class:grayscale-0={link?.fill?.style === ''}
                    class="filter grayscale hover:grayscale-0 hover:border-4 border-[0.1rem] border-accent p-2 btn rounded-md btn-primary w-1/5 transform transition duration-300 ease-in-out">solid</button>
                  <!-- gradient -->
                  <button 
                    on:click={() => setStyle('fill', 'gradient')}
                    class="filter grayscale hover:grayscale-0 p-2 btn rounded-md btn-accent bg-gradient-to-tr from-accent via-secondary to-primary hover:border-4 w-1/5">gradient</button>
                  <!-- image -->
                  <button 
                    on:click={() => setStyle('fill', 'image')}
                    class="filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/icons/trash.jpeg')] bg-cover bg-top text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">image</button>
                  <!-- custom fill -->
                  <button 
                    on:click={() => setStyle('fill', 'gif')}
                    class="filter grayscale hover:grayscale-0 hover:border-4 p-2 btn bg-[url('/minecraft.gif')] bg-cover bg-bottom text-white rounded-md btn-accent w-1/5 transform transition duration-300 ease-in-out">gif</button>
                </div>
              </div>
            </div>

            <!-- solid color selection -->
            {#if solidLinkFill}
            <div 
              in:slide={{duration: 500, easing: cubicInOut}}
              out:slide={{duration: 500, easing: cubicInOut}}
              class="flex justify-start space-x-10">
              
              <!-- link color -->
              <div class="">
                <label for="Fill Color" class="label">
                  <span class="label-text font-input-mono text-right">Fill Color</span>
                </label>      
                <div id="Fill Color" class="join">

                  <input 
                    type="color" 
                    id="colorInput"
                    style="width: 3.1rem; height: 3rem; border: 1px ridge {link?.fill?.hex};" 
                    bind:value={link.fill.hex} 
                    on:mouseenter={() => {if (link?.fill?.hex !== '') {showRemoveBackground = true}}}
                    on:mouseleave={() => showRemoveBackground = false}
                    on:change={() => updateColor('link fill', link.fill.hex, link.fill.opacity)}
                    class="relative"
                  >
                  {#if showRemoveBackground}
                  <button
                    in:slide out:blur={{amount: 100}}
                    on:click={() => {updateColor('link fill', '', 100)}} 
                    class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</button>
                  {/if}
                  <input 
                    type="text" 
                    placeholder="#12345" 
                    bind:value={link.fill.hex} 
                    on:change={() => updateColor('link fill', link.fill.hex, link.fill.opacity)} 
                    class="input text-center w-[13rem]"
                  >
                    
                </div>
              </div>

              <!-- opacity -->
              <div class="form-control">
                <label for="link fillopacity" class="label">
                  <span class="label-text font-input-mono">Opacity</span>
                </label>
                <label class="input-group">
                  <input type="text" min="0" max="100" id="opacity" bind:value={link.fill.opacity} on:change={() => updateOpacity('link fill')} class="input input-bordered w-1/2" />
                  <span>%</span>
                </label>
              </div>
            </div>
            {/if}

            {#if gradientLinkFill}
              <!-- entire gradient div -->
              <!-- radial? or linear? -->
            <div 
              in:slide={{ duration: 1000, easing: cubicInOut }}
              out:slide={{ duration: 1000, easing: cubicInOut }}
              class="flex-col flex space-y-4 my-4">
              <div class="flex space-x-4">
                <button class:bg-success={link?.fill?.style === 'gradient'} on:click={() => setStyle('fill', 'gradient')} class="btn btn-outline">Linear</button>
                <button class:bg-success={link?.fill?.style === 'radial gradient'} on:click={() => setStyle('fill', 'radial gradient')} class="btn btn-outline">Radial</button>
              </div>

              <!-- colors -->
              <div class="flex">
                <!-- from color -->
                <div class="flex justify-start space-x-4">
                  
                  <!-- from color -->
                  <div>
                    <label for="From" class="label">
                      <span class="label-text font-input-mono text-[1rem]">From</span>
                    </label>      
                    <div id="From" class="join">

                        <!-- from input -->
                        <input 
                          type="color" 
                          id="colorInput"
                          style="width: 3.1rem; height: 3rem; border: 1px ridge {link?.fill?.gradient?.from?.hex};" 
                          bind:value={link.fill.gradient.from.hex} 
                          on:mouseenter={() => {if (link?.fill?.gradient?.from?.hex !== '') {showRemoveBackground = true}}}
                          on:mouseleave={() => showRemoveBackground = false}
                          on:change={() => updateColor('link gradient from', link?.fill?.gradient?.from?.hex, link?.fill?.gradient?.from?.opacity)}
                          class="relative">

                        <!-- remove color to revert back to theme color -->
                        {#if showRemoveBackground}
                        <button
                          in:slide out:blur={{amount: 100}}
                          on:click={() => {updateColor('link gradient from', '', 100)}} 
                          class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</button>
                        {/if}

                        <!-- hex input -->
                        <input 
                          type="text" 
                          placeholder="#12345" 
                          bind:value={link.fill.gradient.from.hex} 
                          on:change={() => updateColor('link gradient from', link?.fill?.gradient?.from?.hex)} 
                          class="input text-center w-1/2">
                      </div>
                    </div>

                  <!-- no opacities for backgrounds until further notice -->
                  <!-- opacity -->
                  <!-- <div class="form-control">
                    <label for="opacity" class="label">
                      <span class="label-text font-input-mono">Opacity</span>
                    </label>
                    <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity might cause background to reflect diffently in preview than it will on your site"`}>
                    <label class="input-group">
                        <input type="text" min="0" max="100" id="opacity" bind:value={background.gradient.from.opacity} on:change={() => updateOpacity('background', background?.gradient?.from?.opacity)} class="input input-bordered w-[4rem]" />
                      <span>%</span>
                    </label>
                    </div>
                  </div> -->

                </div>

                <!-- to color -->
                <div class="flex justify-start space-x-4">

                  <!-- to color -->
                  <div>
                    <label for="to Color" class="label">
                      <span class="label-text font-input-mono text-[1rem]">To</span>
                    </label>      
                    <div id="Background Color" class="join">

                        <!-- show buttoncolor / clikc for color picker -->
                          <input 
                            type="color" 
                            id="colorInput"
                            style="width: 3.1rem; height: 3rem; border: 1px ridge {link?.fill?.gradient?.to?.hex};" 
                            bind:value={link.fill.gradient.to.hex} 
                            on:mouseenter={() => {if (link?.fill?.gradient?.to?.hex !== '') {showRemoveBackground = true}}}
                            on:mouseleave={() => showRemoveBackground = false}
                            on:change={() => updateColor('link gradient to', link?.fill?.gradient?.to?.hex, link?.fill?.gradient?.to?.opacity)} 
                            class="relative"
                          >
                          {#if showRemoveBackground}
                          <button
                            in:slide out:blur={{amount: 100}}
                            on:click={() => {updateColor('background gradient to', '', '')}} 
                            class="text-[0.5rem] absolute -top-2 left-1/2 -translate-x-1/2 w-[8rem] bg-warning-content border-accent border-[0.1rem] font-input-mono text-warning">Remove Custom Color</button>
                          {/if}
                      <input 
                        type="text" 
                        placeholder="#12345" 
                        bind:value={link.fill.gradient.to.hex} 
                        on:change={() => updateColor('link gradient to', link?.fill?.gradient?.to?.hex, link?.fill?.gradient?.to?.opacity)} 
                        class="input text-center w-1/2"
                      >

                        

                        
                    </div>
                  </div>

                  <!-- opacity -->
                  <!-- <div class="form-control">
                    <label for="opacity" class="label">
                      <span class="label-text font-input-mono">Opacity</span>
                    </label>
                    <div class="tooltip tooltip-accent tooltip-left" data-tip={`🤓: "changing opacity will cause background to reflect diffently in preview than it will on your site"`}>

                    <label class="input-group">
                        <input type="text" min="0" max="100" id="opacity" bind:value={background.gradient.to.opacity} on:change={() => updateOpacity('background', background?.gradient?.to?.opacity)} class="input input-bordered w-[4rem]" />
                      <span>%</span>
                    </label>
                    </div>
                  </div> -->
                </div>
              </div>
              <!-- gradient direction -->
              <div class="flex flex-col justify-start">

                <!-- preview + selection container -->
                <div class="flex justify-start space-x-4">

                  <!-- gradient preview -->
                  <div 
                    style={`background: linear-gradient(${backgroundDirection}, ${backgroundFromHex}, ${backgroundToHex});`}
                    class="w-60 border-2 mt-10 border-primary rounded-xl max-w-md h-40 ">
                  </div>
                  <!-- gradient direction -->
                  <div class="flex flex-col mt-4">
                    <label for="Gradient Direction" class="label">
                      <span class="label-text font-input-mono">Direction <span class="text-info">{backgroundDirection}°</span></span>
                    </label>
                  <div class="flex">

                  <div id="Gradient Direction" class="flex flex-col text-white  join">
                    <div class="join text-white flex justify-evenly">
                      <button on:click={() => setGradientDirection('background', 315)} class="btn bg-opacity-0 text-5xl">↖</button>
                      <button on:click={() => setGradientDirection('background', 0)} class="btn bg-opacity-0 text-5xl">↑</button>
                      <button on:click={() => setGradientDirection('background', 4)} class="btn bg-opacity-0 text-5xl">↗</button>
                    </div>
                    <div class="join flex justify-evenly">
                      <button on:click={() => setGradientDirection('background', 270)} class="btn bg-opacity-0 text-5xl">←</button>
                      <button class="bg-opacity-0 text-5xl font-input-mono">☯︎</button>
                      <button on:click={() => setGradientDirection('background', 90)} class="btn bg-opacity-0 text-5xl">→</button>
                    </div>
                    <div class="join flex justify-evenly">
                      <button on:click={() => setGradientDirection('background', 215)} class="btn bg-opacity-0 text-5xl">↙</button>
                      <button on:click={() => setGradientDirection('background', 180)} class="btn bg-opacity-0 text-5xl">↓</button>
                      <button on:click={() => setGradientDirection('background', 135)} class="btn bg-opacity-0 text-5xl">↘</button>
                    </div>
                  </div>
                  </div>

                  
                  </div>


                </div>


                <!-- input gradient values -->
                
                <div class="font-input-mono mt-4 bg-accent p-2 px-4">
                  <p>
                    from 
                    <input 
                      type="text" 
                      class="text-info inline-input w-[5.75rem]" 
                      bind:value={backgroundFromHex} 
                    />, 
                    to 
                    <input type="text" class="text-info inline-input w-[5.75rem]" bind:value={backgroundToHex} />, 
                    <input type="text" class="text-info inline-input w-[4rem]" bind:value={backgroundDirection} />
                  </p>
                </div>
              </div>

            </div>
            <!-- end of entire gradient div -->
            {/if}

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

.inline-input {
  background: none;
  border: none;
  outline: none;
  /* More styles here as needed */
}

  
  </style>


  