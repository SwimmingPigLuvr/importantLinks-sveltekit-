<script lang="ts">
  import { convert, concatOpacity } from "$lib/theme";
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

    let buttonStyle: "squareHardShadow" | "roundHardShadow" | "circleHardShadow" | "squareFill" | "roundFill" | "circleFill" | "squareBorder" | "roundBorder" | "circleBorder" | "squareShadow" | "roundShadow" | "circleShadow" | "theme";
    let buttonColor: string;
    let buttonOpacity: number;
    let buttonFont: string;
    let buttonFontOpacity: number;
    let buttonFontColor: string;
    let buttonTextEffect: string;
    let buttonTextEffectHover = false;
    let buttonColorHex: string | undefined;
    let buttonFontColorHex: string | undefined;

    let buttonBorder: string;
    let buttonShadow: string;
    let buttonBorderOpacity: number;
    let buttonShadowOpacity: number;
    let buttonBorderHex: string | undefined;
    let buttonShadowHex: string | undefined;

    // button color hex w opacity
    let bchwo: string | undefined;
    // button font color hex w opacity
    let bfchwo: string | undefined;
    // border
    let buttonBorderHexWithOpacity: string;
    // shadow
    let buttonShadowHexWithOpacity: string;

    // buttons
    $: if (customTheme && customTheme.button) {
      buttonStyle = customTheme.button.style;
      buttonColor = customTheme.button.color;
      buttonFont = customTheme.font.family;
      buttonFontColor = customTheme.button.fontColor;

      buttonOpacity = customTheme.button.opacity;
      buttonFontOpacity = customTheme.button.fontOpacity;

      buttonBorderOpacity = customTheme.button.borderOpacity;
      buttonShadowOpacity = customTheme.button.shadowOpacity;

      buttonShadow = customTheme.button.shadow;
      buttonBorder = customTheme.button.border;



      // convert tailwind to hex
      buttonColorHex = convert(buttonColor);
      buttonFontColorHex = convert(buttonFontColor);

      buttonBorderHex = convert(buttonBorder);
      buttonShadowHex = convert(buttonShadow);

      // button color hex w opacity
      bchwo = concatOpacity(buttonColorHex, buttonOpacity);
      // font color
      bfchwo = concatOpacity(buttonFontColorHex, buttonFontOpacity);

      buttonBorderHexWithOpacity = concatOpacity(buttonBorderHex, buttonBorderOpacity);
      buttonShadowHexWithOpacity = concatOpacity(buttonShadowHex, buttonShadowOpacity);

    }

    $: if (customTheme?.button?.textEffect) {
      buttonTextEffect = customTheme.button.textEffect.effect;
      buttonTextEffectHover = customTheme.button.textEffect.onHover;
    }


  onMount(() => {
    
  })

  let theme = false;

  $: if (buttonStyle === 'theme') {
    theme = true;
    console.log('theme? ', theme);
  }
    
  let buttonRadius = '';
  let fill = false;
  let border = false;
  let shadow = false;
  let hardShadow = false;

  // Object map for button styles
  const styleMap: { [key: string]: string } = {
    'square': 'rounded-none',
    'round': 'rounded-[0.5rem]',
    'circle': 'rounded-full',
  };

  const endsWithMap: { [key: string]: () => void } = {
    'Fill': () => fill = true,
    'HardShadow': () => hardShadow = true,
    'Shadow': () => shadow = true,
    'Border': () => border = true,
  };

  $: if (buttonStyle && buttonStyle !== 'theme') {
    const prefix = buttonStyle.split(/Fill|HardShadow|Shadow|Border/)[0];
    const suffix = buttonStyle.slice(prefix.length);

    buttonRadius = styleMap.hasOwnProperty(prefix) ? styleMap[prefix] : '';
    if (endsWithMap.hasOwnProperty(suffix)) endsWithMap[suffix]();
  }
    


    

   
  
</script>
      <!-- put this back in the a href style if need be good luk -->
      <!-- ${fill ? `background-color: ${bchwo};` : ''} -->

<a 
  href="{url}" 
    class:hardShadow={hardShadow}
    style={`background-color: ${bchwo}; border: 3px solid transparent;
      ${shadow ? `box-shadow: 0 10px 20px  -12px ${buttonShadowHexWithOpacity};` : ''}
      ${border || theme ? `border: 3px solid ${buttonBorderHexWithOpacity? buttonBorderHexWithOpacity : 'hsl(var(--pc))'};` : ''}
      ${hardShadow || theme ? `box-shadow: 10px 10px 0px ${buttonShadowHexWithOpacity? buttonShadowHexWithOpacity : 'hsl(var(--af))'}; border: 2px solid ${buttonShadowHexWithOpacity? buttonShadowHexWithOpacity : 'hsl(var(--a))'};` : ''}
    `}    
    class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} max-w-[94%] 
     {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.5rem]'} border-0  
     {fill || theme ? `bg-${buttonColor ? 'lime-400' : 'accent'}` : 'bg-opacity-0'}
     {border ? 'border-2' : 'border-transparent'}
     {shadow ? 'shadow-xl' : 'shadow-none'}
     hover:translate-x-1 hover:translate-y-1 
     flex justify-between m-auto items-center no-underline">

     <!-- link icon -->
    <img 
      src={iconURL} 
      alt={iconURLalt} 
      class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.23rem]'}">
    
    <!-- Link title -->
    <p 
    style={`${theme ? `color: hsl(var(--ac));` : `color: ${bfchwo ? bfchwo : 'orange-600'};`} ${previewMode ? 'transform: translateX(-1rem); font-size: 1rem;' : 'transform: translateX(-1.6rem);'}`}
    class='font-{buttonFont} {previewMode ? 'text-[0.5rem]' : 'text-[1rem]'} herby '>{title}
    </p>
    <!-- empty element -->
    <div class="right"></div>
</a>

<style>

.hardShadow {
  box-shadow: 10px 10px 0px black;
  border: 2px solid black;
}

</style>

