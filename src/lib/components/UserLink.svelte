<script lang="ts">
  import { onMount } from "svelte";
  import type { CustomTheme } from "$lib/theme";
  import Page from "../../routes/+page.svelte";
  import { browserLocalPersistence } from "firebase/auth";

  export let customTheme: CustomTheme;
  export let iconURL = 'https://miladymaker.net/images/milady3.jpg';
  export let iconURLalt = 'ha';
  export let url = 'foo';
  export let title = 'some cool title';
  export let previewMode: boolean;

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

  $: if (customTheme && customTheme.link) {
    link = customTheme.link;
    font = customTheme.font;
  }

  // gradient constructors
  let fillGradient;
  // values
  let fillFromHex: string;
  let fillToHex: string;
  let fillDirection: string;
  // opacity
  let fillFromOpacity: number;
  let fillToOpacity: number;

  $: if (link?.fill?.style === 'gradient') {
    fillGradient = link?.fill?.gradient;

    fillFromHex = fillGradient?.from?.hex;
    fillToHex = fillGradient?.to?.hex;

    fillDirection = fillGradient?.direction;

    fillToOpacity = fillGradient?.to?.opacity;
    fillFromOpacity = fillGradient?.from?.opacity;

  }

  // gradient constructors for border
  let borderGradient;
  // values
  let borderFromHex: string;
  let borderToHex: string;
  let borderDirection: string;
  // opacity
  let borderFromOpacity: number;
  let borderToOpacity: number;

  $: if (link?.border?.style === 'gradient') {
      borderGradient = link?.border?.gradient;

      borderFromHex = borderGradient?.from?.hex;
      borderToHex = borderGradient?.to?.hex;

      borderDirection = borderGradient?.direction;

      borderToOpacity = borderGradient?.to?.opacity;
      borderFromOpacity = borderGradient?.from?.opacity;
  }

  // gradient constructors for shadow
  let shadowGradient;
  // values
  let shadowFromHex: string;
  let shadowToHex: string;
  let shadowDirection: string;
  // opacity
  let shadowFromOpacity: number;
  let shadowToOpacity: number;

  $: if (link?.shadow?.style === 'gradient') {
      shadowGradient = link?.shadow?.gradient;

      shadowFromHex = shadowGradient?.from?.hex;
      shadowToHex = shadowGradient?.to?.hex;

      shadowDirection = shadowGradient?.direction;

      shadowToOpacity = shadowGradient?.to?.opacity;
      shadowFromOpacity = shadowGradient?.from?.opacity;
  }

  let style: string[] = [];
  let combinedStyle: string;

$: if (link) {
    let newStyles = [];
    
    if (link?.fill?.isVisible) {
        switch (link?.fill?.style) {
            case 'solid':
                newStyles.push(`background-color: ${link.fill.hex || `hsl(var(--p))`};`);
                break;
            case 'gradient':
                newStyles.push(`background: linear-gradient(${fillDirection || '0deg'}, ${fillFromHex || `hsl(var(--p))`}, ${fillToHex || `hsl(var(--a))`});`);
                break;
            case 'image':
                newStyles.push(`background-image: url(${link.fill.image.url}); background-size: ${link.fill.image.size || `auto`}; background-repeat: ${link.fill.image.repeat || `round`}; background-position: ${link.fill.image.position || `center`};`);
                break;
            default:
                break;
        }
    }

    if (link?.border?.isVisible) {
        switch (link?.border?.style) {
            case 'image':
                newStyles.push(`border: ${link.border.width} solid; border-image: url(${link.border.image.url}) ${link.border.image.repeat};`);
                break;
            case 'solid':
                newStyles.push(`border: ${link.border.width} ${link.border.style} ${link.border.hex || `hsl(var(--a))`};`);
                break;
            case 'gradient':
                newStyles.push(`border: ${link.border.width} solid; border-image: linear-gradient(${borderDirection || `0deg`}, ${borderFromHex || `hsl(var(--s))`}, ${borderToHex || `hsl(var(--in))`});`);
                break;
            default: 
                break;
        }
    }

    if (link?.shadow?.isVisible) {
        switch (link?.shadow?.style) {
            case 'soft':
                newStyles.push(`box-shadow: 0 10px 20px -12px ${link.shadow.hex || `hsl(var(--a))`};`);
                break;
            case 'hard':
                newStyles.push(`box-shadow: 10px 10px 0px ${link.shadow.hex || `hsl(var(--a))`};`);
                break;
            default:
                break;
        }
    }

    style = newStyles;
    combinedStyle = style.join('; ');
}



</script>

<a 
  href="{url}" 
    style={`${combinedStyle}`} 
    class="{previewMode ? 'h-[40px]  p-[0.2rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} max-w-[94%] 
     {link.radius === 'full' ? 'rounded-full' : link.radius === 'half' ? 'rounded-[0.5rem]' : 'rounded-none'}  
     hover:translate-x-1 hover:translate-y-1 
     flex justify-between m-auto items-center no-underline">
     <!-- link icon -->
    <img 
      src={iconURL} 
      alt={iconURLalt} 
      class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 {link.radius === 'full' ? 'rounded-full' : link.radius === 'none' ? 'rounded-none' : 'rounded-[0.23rem]'}">
    
    <!-- Link title -->
    <p 
    style={`
      color: ${link.title.font.hex ? `hsl(var(--pc))` : ''} 
    `}
    class='font-{font.family} {previewMode ? 'text-[1.23rem] -translate-x-[1rem]' : 'text-[1.5rem] -translate-x-[1.6rem]'} m-auto'>{title}
    </p>
</a>


