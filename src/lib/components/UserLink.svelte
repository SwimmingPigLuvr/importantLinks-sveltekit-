<script lang="ts">
  import { hexToRgb, type CustomTheme } from "$lib/theme";
  import { backInOut, backOut } from "svelte/easing";

  export let customTheme: CustomTheme;
  export let iconURL = 'https://miladymaker.net/images/milady3.jpg';
  export let iconURLalt = 'ha';
  export let url = 'foo';
  export let title = 'some cool title';
  export let previewMode: boolean;
  export let theme: string = '';

  let element: HTMLElement;

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

  let customClass: string[] = [];
  let combinedClass: string;

$: if (link) {
    let newStyles: string[] = [];
    let newClasses: string[] = [];

    // set user's hex values
    const rootStyle = document.documentElement.style;

    let shadowRgb = hexToRgb(link.shadow.hex || '#ffffff');

    // set css vars
    rootStyle.setProperty('--title-color', link?.title?.font?.hex || 'hsl(var(--a))');
    rootStyle.setProperty('--border-color', link?.border?.hex || 'hsl(var(--a))');
  // links
    
    // link background
    rootStyle.setProperty('--link-color', link?.fill?.hex || 'hsl(var(--p))');
    rootStyle.setProperty('--link-gradient-direction', link?.fill?.gradient?.direction || '90deg');
    rootStyle.setProperty('--link-gradient-from', link?.fill?.gradient?.from?.hex || 'hsl(var(--p))');
    rootStyle.setProperty('--link-gradient-to', link?.fill?.gradient?.to?.hex || 'hsl(var(--s))');
    rootStyle.setProperty('--link-image-position', link?.fill?.image?.position || 'center');
    rootStyle.setProperty('--link-image-repeat', link?.fill?.image?.repeat || 'repeat');
    rootStyle.setProperty('--link-image-size', link?.fill?.image?.size || 'contain');
    rootStyle.setProperty('--link-image-url', link?.fill?.image?.url || '/static/linkDefault.png');

    // link shadow
    rootStyle.setProperty('--shadow-color', link?.shadow?.hex || 'hsl(var(--a))');
    rootStyle.setProperty('--shadow-rgb', shadowRgb);

    // link border
    rootStyle.setProperty('--border-style', link?.border?.style || 'solid');
    rootStyle.setProperty('--border-width', link?.border?.width || '0.1rem');
    rootStyle.setProperty('--border-image', link?.border?.image?.url || '/borderDefault.png');
    rootStyle.setProperty('--border-repeat', link?.border?.image?.repeat || 'no-repeat');
    rootStyle.setProperty('--border-gradient-direction', link?.border?.gradient?.direction || '90deg');
    rootStyle.setProperty('--border-gradient-from', link?.border?.gradient?.from?.hex || 'hsl(var(--p))');
    rootStyle.setProperty('--border-gradient-to', link?.border?.gradient?.to?.hex || 'hsl(var(--s))');



    // push styles into newClasses array

    // fill
    if (link?.fill?.isVisible) {
      newClasses.push(link.fill.style);
    }

    // border
    if (link?.shadow?.isVisible) {
      newClasses.push(link.shadow.style);
    }

    // shadow
    if (link?.border?.isVisible) {
      newClasses.push(link.border.fillStyle);
    }
    
    

    

    combinedStyle = newStyles.join('; ');
    combinedClass = newClasses.join(' ');
}





</script>

<a 
  data-theme="{theme}"
  href="{url}" 
  bind:this={element}
  style={`${combinedStyle}`} 
  class="
    {combinedClass} 
    {previewMode ? 'blinktree-preview' : 'blinktree'} ease-[backInOut]
    {link.radius === 'full' ? 'rounded-full' : link.radius === 'half' ? 'rounded-[0.5rem]' : link.radius === 'none' ? 'rounded-none' : 'rounded-[0.5rem]'}  
    flex justify-between m-auto items-stretch no-underline transform transition-all ease-[backOut]
  ">
     
  <!-- link icon -->
  <img 
    src={iconURL} 
    alt={iconURLalt} 
    class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 {link.radius === 'full' ? 'rounded-full' : link.radius === 'none' ? 'rounded-none' : 'rounded-[0.23rem]'}">
    
  <!-- Link title -->
  <p 
  style={`
    color: ${link.title.font.hex || `hsl(var(--pc))`} 
  `}
  class='text-{link.title.font.hex} font-{font.family} {link?.title?.effect?.effect} {previewMode ? 'text-[0.88rem] -translate-x-[1rem]' : 'text-[1.5rem] -translate-x-[1.6rem]'} m-auto'>{title}
  </p>
</a>


