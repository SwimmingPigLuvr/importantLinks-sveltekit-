<script lang="ts">
  import { onMount } from "svelte";
  import type { CustomTheme } from "$lib/theme";
  import Page from "../../routes/+page.svelte";

  export let customTheme: CustomTheme;
  export let iconURL = 'https://miladymaker.net/images/milady3.jpg';
  export let iconURLalt = 'ha';
  export let url = 'foo';
  export let title = 'some cool title';
  export let previewMode = false;

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
    style: "image" | "gradient" | "solid";
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

  $: if (customTheme && customTheme.link) {
    background = customTheme.background;
    link = customTheme.link;
    font = customTheme.font;
  }

</script>

<a 
  href="{url}" 
    style={`
      ${link.fill.style === 'solid' && link.fill.isVisible ? `background-color: ${link.fill.hex ? link.fill.hex : `hsl(var(--p))`}` : ''}
      ${link.fill.style === 'gradient' && link.fill.isVisible ? `linear-gradient: 0deg, hsl(var(--s)), hsl(var(--a))` : ''}
      ${link.fill.style === 'image' && link.fill.isVisible ? `background-image: url(${link.fill.value}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;` : ''}
      ${link.border.isVisible ? `border: ${link.border.width} ${link.border.style} ${link.border.hex ? link.border.hex : 'hsl(var(--a))'};` : ''}
      ${link.shadow.style === 'soft' && link.shadow.isVisible ? `box-shadow: 0 10px 20px -12px ${link.shadow.hex ? link.shadow.hex : 'hsl(var(--a))'};` : ''}
      ${link.shadow.style === 'hard' && link.shadow.isVisible ? `box-shadow: 10px 10px 0px ${link.shadow.hex ? link.shadow.hex : 'hsl(var(--a))'};` : ''}
    `}    
    class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} max-w-[94%] 
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
      color: ${link.title.hex ? link.title.hex : `hsl(var(--pc))`} 
      ${previewMode ? 'transform: translateX(-1rem); font-size: 1rem;' : 'transform: translateX(-1.6rem);'}
    `}
    class='font-{font.family} {previewMode ? 'text-[0.5rem]' : 'text-[1rem]'}'>{title}
    </p>
</a>


