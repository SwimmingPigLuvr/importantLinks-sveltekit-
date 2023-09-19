<script lang="ts">
  import { convert } from "$lib/theme";
  import { onMount } from "svelte";
  import type { CustomTheme } from "$lib/theme";
  import Page from "../../routes/+page.svelte";


    // one export to rulle them all
    export let customTheme: CustomTheme;
    // link data items
    export let iconURL = 'https://miladymaker.net/images/milady3.jpg';
    export let iconURLalt = 'ha';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;

  let background: {
    style: "image" | "gradient" | "solid";
    value: string;
    opacity: number;
    hex: string | undefined;
  }

  let link: {
    radius: string;
    fill: {
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    border: {
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    shadow: {
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

  let font: {
    family: string;
    value: string;
    opacity: number;
    hex: string | undefined;
  }

  $: if (customTheme && customTheme.link) {
    background = customTheme.background;
    link = customTheme.link;
    font = customTheme.font;
  }


  onMount(() => {
    
  })

   
  
</script>
      <!-- put this back in the a href style if need be good luk -->
      <!-- ${fill ? `background-color: ${bchwo};` : ''} -->

<a 
  href="{url}" 
    style={`
      ${link.fill.style === 'image' ? `background-image: url(${link.fill.value}); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;` : ''}
      ${link.fill.style === 'gradient' ? `linear-gradient: 0deg, hsl(var(--s)), hsl(var(--a))` : ''}
      ${link.fill.style === 'solid' ? `background-color: ${link.fill.hex ? link.fill.hex : `hsl(var(--p))`}` : ''}
      ${link.shadow.style === 'soft' ? `box-shadow: 0 10px 20px -12px ${link.shadow.hex ? link.shadow.hex : 'hsl(var(--a))'};` : ''}
      ${link.shadow.style === 'hard' ? `box-shadow: 10px 10px 0px ${link.shadow.hex ? link.shadow.hex : 'hsl(var(--a))'};` : ''}
      ${link.border.style === 'solid' ? `border: 3px solid ${link.border.hex ? link.border.hex : 'hsl(var(--a))'};` : ''}
      ${link.border.style === 'double' ? `border: 3px double ${link.border.hex ? link.border.hex : 'hsl(var(--a))'};` : ''}
      ${link.border.style === 'dashed' ? `border: 3px dashed ${link.border.hex ? link.border.hex : 'hsl(var(--a))'};` : ''}
      ${link.border.style === 'custom' ? `border: 3px dashed ${link.border.hex ? link.border.hex : 'hsl(var(--a))'};` : ''}
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
      color: ${link.title.hex ? link.title.hex : `hsl(var(--sc))`} 
      ${previewMode ? 'transform: translateX(-1rem); font-size: 1rem;' : 'transform: translateX(-1.6rem);'}
    `}
    class='font-{font.family} {previewMode ? 'text-[0.5rem]' : 'text-[1rem]'}'>{title}
    </p>
</a>


