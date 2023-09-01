<script lang="ts">
  import { buttonStyles, convert, concatOpacity } from "$lib/theme";
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

    let buttonStyle: "squareHardShadow" | "roundHardShadow" | "circleHardShadow" | "squareFill" | "roundFill" | "circleFill" | "squareOutline" | "roundOutline" | "circleOutline" | "squareShadow" | "roundShadow" | "circleShadow"  = 'squareFill';
    let buttonColor: string;
    let buttonOpacity: number;
    let buttonFont: string;
    let buttonFontOpacity: number;
    let buttonFontColor: string;
    let buttonTextEffect: string;
    let buttonTextEffectHover = false;
    let buttonColorHex: string | undefined;
    let buttonFontColorHex: string | undefined;
    // button color hex w opacity
    let bchwo: string | undefined;
    // button font color hex w opacity
    let bfchwo: string | undefined;

    // buttons
    $: if (customTheme && customTheme.button) {
      buttonStyle = customTheme.button.style;
      buttonColor = customTheme.button.color;
      buttonFont = customTheme.font.family;
      buttonFontColor = customTheme.button.fontColor;

      buttonOpacity = customTheme.button.opacity;
      buttonFontOpacity = customTheme.button.fontOpacity;


      // convert tailwind to hex
      buttonColorHex = convert(buttonColor);
      buttonFontColorHex = convert(buttonFontColor);

      // button color hex w opacity
      bchwo = concatOpacity(buttonColorHex, buttonOpacity);
      // font color
      bfchwo = concatOpacity(buttonFontColorHex, buttonFontOpacity);

    }

    $: if (customTheme?.button?.textEffect) {
      buttonTextEffect = customTheme.button.textEffect.effect;
      buttonTextEffectHover = customTheme.button.textEffect.onHover;
    }


  onMount(() => {
    
  })


    
    let buttonRadius = '';
    let fill = false;
    let outline = false;
    let shadow = false;
    let hardShadow = false;


    

    $: if (buttonStyle in buttonStyles) {
    let style = buttonStyles[buttonStyle];
    buttonRadius = style.buttonRadius;
    fill = style.fill;
    outline = style.outline;
    shadow = style.shadow;
    hardShadow = style.hardShadow;
    console.log(`Button style: ${buttonStyle}`);
  }
  
</script>

     <!-- if fill then bg-{buttonColor ? {buttonColor} : 'secondary'}, -->



     <!-- todo make the conditional styles neccessary to apply: -->
     <!-- buttonColorHex to the border and shadow of outline and shadow -->


<a 
  href="{url}" 
    class:hardShadow={hardShadow}
    style={`
      ${shadow ? `box-shadow: 0 10px 20px  -12px ${bchwo};` : ''}
      ${outline ? `border: 3px solid ${bchwo};` : ''}
      ${fill ? `background-color: ${bchwo};` : ''}
      ${hardShadow ? `box-shadow: 10px 10px 0px ${bchwo}; border: 2px solid ${bchwo};` : ''}
    `}    
    class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} max-w-[94%] 
     {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.5rem]'} border-0  
     {fill ? `bg-${buttonColor ? 'lime-400' : 'secondary'}` : 'bg-opacity-0'}
     {outline ? `border-2'}` : 'border-transparent'}
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
      style={`color: ${bfchwo ? bfchwo : bchwo};` + (previewMode ? `transform: translateX(-1rem); font-size: 1rem;` : 'transform: translateX(-1.6rem);')}
      class='font-{buttonFont} {previewMode ? 'text-[0.88rem]' : 'text-[1.5rem]'} herby '>{title}
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

